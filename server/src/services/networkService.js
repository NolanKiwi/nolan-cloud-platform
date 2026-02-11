const docker = require('../config/docker');

class NetworkService {
  /**
   * List all networks
   * @returns {Promise<Array>} List of networks
   */
  async listNetworks() {
    try {
      const networks = await docker.listNetworks();
      return networks.map(network => ({
        id: network.Id,
        name: network.Name,
        driver: network.Driver,
        scope: network.Scope,
        internal: network.Internal,
        attachable: network.Attachable,
        ingress: network.Ingress,
        ipam: network.IPAM,
        containers: network.Containers,
        options: network.Options,
        labels: network.Labels,
        created: network.Created
      }));
    } catch (error) {
      console.error('Error listing networks:', error);
      throw error;
    }
  }

  /**
   * Create a new network
   * @param {Object} options - Network creation options
   * @returns {Promise<Object>} Created network
   */
  async createNetwork(options) {
    try {
      const network = await docker.createNetwork(options);
      return network;
    } catch (error) {
      console.error('Error creating network:', error);
      throw error;
    }
  }

  /**
   * Remove a network
   * @param {string} id - Network ID
   * @returns {Promise<void>}
   */
  async removeNetwork(id) {
    try {
      const network = docker.getNetwork(id);
      await network.remove();
    } catch (error) {
      console.error(`Error removing network ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new NetworkService();
