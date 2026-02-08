const containerService = require('../services/containerService');

class ContainerController {
  async getContainers(req, res) {
    try {
      const all = req.query.all === 'true';
      const containers = await containerService.listContainers(all);
      res.json({
        success: true,
        count: containers.length,
        data: containers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch containers',
        error: error.message
      });
    }
  }

  async getContainerStats(req, res) {
    try {
      const { id } = req.params;
      const stats = await containerService.getContainerStats(id);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Failed to fetch stats for container ${req.params.id}`,
        error: error.message
      });
    }
  }

  async startContainer(req, res) {
    try {
      const { id } = req.params;
      await containerService.startContainer(id);
      res.json({ success: true, message: `Container ${id} started` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async stopContainer(req, res) {
    try {
      const { id } = req.params;
      await containerService.stopContainer(id);
      res.json({ success: true, message: `Container ${id} stopped` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async restartContainer(req, res) {
    try {
      const { id } = req.params;
      await containerService.restartContainer(id);
      res.json({ success: true, message: `Container ${id} restarted` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new ContainerController();
