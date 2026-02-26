const notificationService = require('../services/notificationService');

const notificationController = {
  async testWebhook(req, res, next) {
    try {
      const { type, resourceId, status } = req.body;
      const event = {
        type: type || 'TEST_EVENT',
        resourceId: resourceId || 'test-resource-123',
        status: status || 'unknown',
        userId: req.user ? req.user.userId : 0,
        timestamp: new Date()
      };
      
      await notificationService.sendWebhook(event);
      res.json({ message: 'Webhook event triggered', event });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController;
