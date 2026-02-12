const docker = require('../config/docker');

class ContainerService {
  /**
   * List all containers
   * @param {boolean} all - If true, show all containers (including stopped)
   * @returns {Promise<Array>} List of containers
   */
  async listContainers(all = false) {
    try {
      const containers = await docker.listContainers({ all });
      return containers.map(container => ({
        id: container.Id,
        names: container.Names,
        image: container.Image,
        state: container.State,
        status: container.Status,
        ports: container.Ports,
        created: new Date(container.Created * 1000).toISOString()
      }));
    } catch (error) {
      console.error('Error listing containers:', error);
      throw error;
    }
  }

  /**
   * Get container stats
   * @param {string} id - Container ID
   * @returns {Promise<Object>} Container stats
   */
  async getContainerStats(id) {
    try {
      const container = docker.getContainer(id);
      const stats = await container.stats({ stream: false });
      return stats;
    } catch (error) {
      console.error(`Error getting stats for container ${id}:`, error);
      throw error;
    }
  }

  /**
   * Start a container
   * @param {string} id - Container ID
   * @returns {Promise<void>}
   */
  async startContainer(id) {
    try {
      const container = docker.getContainer(id);
      await container.start();
    } catch (error) {
      console.error(`Error starting container ${id}:`, error);
      throw error;
    }
  }

  /**
   * Stop a container
   * @param {string} id - Container ID
   * @returns {Promise<void>}
   */
  async stopContainer(id) {
    try {
      const container = docker.getContainer(id);
      await container.stop();
    } catch (error) {
      console.error(`Error stopping container ${id}:`, error);
      throw error;
    }
  }

  /**
   * Restart a container
   * @param {string} id - Container ID
   * @returns {Promise<void>}
   */
  async restartContainer(id) {
    try {
      const container = docker.getContainer(id);
      await container.restart();
    } catch (error) {
      console.error(`Error restarting container ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new container
   * @param {string} image - Image name (e.g., 'nginx:latest')
   * @param {string[]} cmd - Command to run
   * @param {string} name - Optional container name
   * @returns {Promise<Object>} Created container info
   */
  async createContainer(image, cmd, name) {
    try {
      const opts = {
        Image: image,
        Cmd: cmd,
        name: name
      };
      // Ensure image exists locally or pull it?
      // For now, assume it exists or dockerode handles pull if missing (it doesn't by default).
      // Dockerode createContainer needs image to be present usually.
      
      const container = await docker.createContainer(opts);
      return container;
    } catch (error) {
      console.error('Error creating container:', error);
      throw error;
    }
  }

  /**
   * Remove a container
   * @param {string} id - Container ID
   * @param {boolean} force - Force removal
   * @returns {Promise<void>}
   */
  async removeContainer(id, force = false) {
    try {
      const container = docker.getContainer(id);
      await container.remove({ force });
    } catch (error) {
      console.error(`Error removing container ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new ContainerService();
