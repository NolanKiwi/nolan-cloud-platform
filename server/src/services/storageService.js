const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs').promises;
const path = require('path');

const STORAGE_ROOT = path.join(__dirname, '../../../storage_data');

class StorageService {
  async listBuckets(userId) {
    return await prisma.bucket.findMany({
      where: { userId }
    });
  }

  async createBucket(userId, name) {
    // 1. Check uniqueness (DB constraint will also handle this, but explicit check is better for UX)
    const existing = await prisma.bucket.findUnique({
      where: { name }
    });

    if (existing) {
      throw new Error(`Bucket name "${name}" already exists`);
    }

    // 2. Create in DB
    const bucket = await prisma.bucket.create({
      data: {
        name,
        userId
      }
    });

    // 3. Create physical directory
    const bucketPath = path.join(STORAGE_ROOT, name);
    await fs.mkdir(bucketPath, { recursive: true });

    return bucket;
  }

  async deleteBucket(userId, bucketId) {
    // 1. Verify ownership and existence
    const bucket = await prisma.bucket.findUnique({
      where: { id: parseInt(bucketId) },
      include: { objects: true }
    });

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    if (bucket.userId !== userId) {
      throw new Error('Permission denied');
    }

    if (bucket.objects.length > 0) {
      throw new Error('Bucket is not empty. Delete all objects first.');
    }

    // 2. Delete from DB
    await prisma.bucket.delete({
      where: { id: parseInt(bucketId) }
    });

    // 3. Delete physical directory
    const bucketPath = path.join(STORAGE_ROOT, bucket.name);
    try {
      await fs.rmdir(bucketPath);
    } catch (err) {
      // If directory doesn't exist or is not empty (unexpected), we just log it
      console.error(`Failed to delete directory ${bucketPath}:`, err.message);
    }

    return { message: 'Bucket deleted successfully' };
  }

  async putObject(userId, bucketName, file) {
    // 1. Verify bucket existence and ownership
    const bucket = await prisma.bucket.findUnique({
      where: { name: bucketName }
    });

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    if (bucket.userId !== userId) {
      throw new Error('Permission denied');
    }

    // 2. Create or update object in DB
    const object = await prisma.object.upsert({
      where: {
        bucketId_key: {
          bucketId: bucket.id,
          key: file.originalname
        }
      },
      update: {
        size: file.size,
        mimeType: file.mimetype,
        path: file.path
      },
      create: {
        key: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        path: file.path,
        bucketId: bucket.id
      }
    });

    return object;
  }
  async getObject(userId, bucketName, objectKey) {
    // 1. Verify bucket and object existence
    const bucket = await prisma.bucket.findUnique({
      where: { name: bucketName }
    });

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    if (bucket.userId !== userId) {
      throw new Error('Permission denied');
    }

    const object = await prisma.object.findUnique({
      where: {
        bucketId_key: {
          bucketId: bucket.id,
          key: objectKey
        }
      }
    });

    if (!object) {
      throw new Error('Object not found');
    }

    // 2. Return object metadata and physical path
    return object;
  }
}

module.exports = new StorageService();
