const containerService = require('../services/containerService');

class ContainerController {
  async getContainers(req, res) {
    try {
      const userId = req.user.id; // Auth Middleware
      const all = req.query.all === 'true';
      const containers = await containerService.listContainers(userId, all);
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
      const userId = req.user.id;
      const { id } = req.params;
      const stats = await containerService.getContainerStats(userId, id);
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
      const userId = req.user.id;
      const { id } = req.params;
      await containerService.startContainer(userId, id);
      res.json({ success: true, message: `Container ${id} started` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async stopContainer(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await containerService.stopContainer(userId, id);
      res.json({ success: true, message: `Container ${id} stopped` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async restartContainer(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await containerService.restartContainer(userId, id);
      res.json({ success: true, message: `Container ${id} restarted` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createContainer(req, res) {
    try {
      const userId = req.user.id;
      const { image, cmd, name } = req.body; // Changed 'Image', 'Cmd' -> 'image', 'cmd' (consistent naming)
      
      if (!image) {
        return res.status(400).json({ success: false, error: 'Image is required' });
      }

      const container = await containerService.createContainer(userId, image, name, cmd);
      res.status(201).json({ success: true, data: container });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async removeContainer(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const force = req.query.force === 'true';
      await containerService.removeContainer(userId, id, force);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new ContainerController();
