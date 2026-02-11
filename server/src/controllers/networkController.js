const networkService = require('../services/networkService');

class NetworkController {
  async getNetworks(req, res) {
    try {
      const networks = await networkService.listNetworks();
      res.json({
        success: true,
        count: networks.length,
        data: networks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch networks',
        error: error.message
      });
    }
  }

  async createNetwork(req, res) {
    try {
      const options = req.body;
      const network = await networkService.createNetwork(options);
      res.status(201).json({
        success: true,
        data: network
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create network',
        error: error.message
      });
    }
  }

  async removeNetwork(req, res) {
    try {
      const { id } = req.params;
      await networkService.removeNetwork(id);
      res.json({
        success: true,
        message: `Network ${id} removed`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Failed to remove network ${req.params.id}`,
        error: error.message
      });
    }
  }
}

module.exports = new NetworkController();
