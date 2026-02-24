const storageService = require('../services/storageService');
const path = require('path');

class StorageController {
  async listBuckets(req, res, next) {
    try {
      const userId = req.user.userId;
      const buckets = await storageService.listBuckets(userId);
      res.json(buckets);
    } catch (error) {
      next(error);
    }
  }

  async createBucket(req, res, next) {
    try {
      const userId = req.user.userId;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Bucket name is required' });
      }
      const bucket = await storageService.createBucket(userId, name);
      res.status(201).json(bucket);
    } catch (error) {
      next(error);
    }
  }

  async deleteBucket(req, res, next) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const result = await storageService.deleteBucket(userId, id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async uploadObject(req, res, next) {
    try {
      const userId = req.user.userId;
      const { bucketName } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const object = await storageService.putObject(userId, bucketName, file);
      res.status(201).json(object);
    } catch (error) {
      next(error);
    }
  }

  async downloadObject(req, res, next) {
    try {
      const userId = req.user.userId;
      const { bucketName, objectKey } = req.params;

      const object = await storageService.getObject(userId, bucketName, objectKey);
      
      res.setHeader('Content-Type', object.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${object.key}"`);
      
      res.sendFile(path.resolve(object.path));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StorageController();
