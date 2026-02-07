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
}

module.exports = new ContainerService();
