const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const prisma = require('../db');

class ContainerService {
  /**
   * List containers for a specific user
   * @param {number} userId - ID of the user
   * @param {boolean} all - If true, show all containers (including stopped)
   * @returns {Promise<Array>} List of containers
   */
  async listContainers(userId, all = false) {
    try {
      // 1. Get user's instances from DB
      const instances = await prisma.instance.findMany({
        where: { userId: userId },
      });

      if (instances.length === 0) {
        return [];
      }

      // 2. Get real-time status from Docker for these instances
      // Optimization: Fetch all containers once and filter, or inspect each?
      // For now, let's fetch all from Docker and match by ID.
      const dockerContainers = await docker.listContainers({ all: true });
      
      const result = instances.map(instance => {
        const dockerInfo = dockerContainers.find(c => c.Id.startsWith(instance.containerId) || c.Names.includes(`/${instance.name}`));
        
        return {
          id: instance.id, // DB ID
          containerId: instance.containerId, // Docker ID
          name: instance.name,
          image: instance.image,
          status: dockerInfo ? dockerInfo.Status : 'Stopped (or Missing)',
          state: dockerInfo ? dockerInfo.State : 'exited',
          created: instance.createdAt,
        };
      });

      return result;
    } catch (error) {
      console.error('Error listing containers:', error);
      throw error;
    }
  }

  /**
   * Create a new container
   * @param {number} userId - Owner ID
   * @param {string} image - Image name
   * @param {string} name - Container name
   * @param {string[]} cmd - Command to run
   * @returns {Promise<Object>} Created container info
   */
  async createContainer(userId, image, name, cmd) {
    try {
      // 1. Create Docker Container
      const opts = {
        Image: image,
        Cmd: cmd,
        name: name // Docker requires unique names
      };
      
      const container = await docker.createContainer(opts);
      const containerInfo = await container.inspect();

      // 2. Save to DB (Instance)
      const newInstance = await prisma.instance.create({
        data: {
          containerId: containerInfo.Id,
          name: name || containerInfo.Name.replace('/', ''), // Remove leading slash
          image: image,
          status: 'created',
          userId: userId,
        },
      });

      return newInstance;
    } catch (error) {
      console.error('Error creating container:', error);
      throw error;
    }
  }

  /**
   * Remove a container
   * @param {number} userId - Owner ID
   * @param {string} id - Docker Container ID or DB Instance ID? Let's use Docker ID for now.
   * @param {boolean} force - Force removal
   * @returns {Promise<void>}
   */
  async removeContainer(userId, containerId, force = false) {
    try {
      // 1. Verify ownership
      const instance = await prisma.instance.findUnique({
        where: { containerId: containerId },
      });

      if (!instance || instance.userId !== userId) {
        throw new Error('Container not found or access denied');
      }

      // 2. Remove from Docker
      const container = docker.getContainer(containerId);
      // Check if container exists in Docker (it might be already gone)
      try {
        await container.remove({ force });
      } catch (dockerError) {
        if (dockerError.statusCode !== 404) {
          throw dockerError;
        }
        console.warn(`Container ${containerId} not found in Docker, removing from DB only.`);
      }

      // 3. Remove from DB
      await prisma.instance.delete({
        where: { containerId: containerId },
      });

    } catch (error) {
      console.error(`Error removing container ${containerId}:`, error);
      throw error;
    }
  }

  // --- Start/Stop/Restart/Stats (Need ownership check) ---

  async checkOwnership(userId, containerId) {
    const instance = await prisma.instance.findUnique({
      where: { containerId: containerId },
    });
    if (!instance || instance.userId !== userId) {
      throw new Error('Access denied');
    }
    return instance;
  }

  async getContainerStats(userId, id) {
    await this.checkOwnership(userId, id);
    const container = docker.getContainer(id);
    return await container.stats({ stream: false });
  }

  async startContainer(userId, id) {
    await this.checkOwnership(userId, id);
    const container = docker.getContainer(id);
    await container.start();
    // Update DB status? Optional, but good practice.
    await prisma.instance.update({
        where: { containerId: id },
        data: { status: 'running' }
    });
  }

  async stopContainer(userId, id) {
    await this.checkOwnership(userId, id);
    const container = docker.getContainer(id);
    await container.stop();
    await prisma.instance.update({
        where: { containerId: id },
        data: { status: 'exited' }
    });
  }

  async restartContainer(userId, id) {
    await this.checkOwnership(userId, id);
    const container = docker.getContainer(id);
    await container.restart();
    await prisma.instance.update({
        where: { containerId: id },
        data: { status: 'running' }
    });
  }
}

module.exports = new ContainerService();
