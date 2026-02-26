const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');

const STORAGE_ROOT = path.join(__dirname, '../../../storage_data');
const JWT_SECRET = process.env.JWT_SECRET || 'nolan-secret-key-123';

class StorageService {
  async listBuckets(userId) {
    return await prisma.bucket.findMany({
      where: { userId }
    });
  }

  async createBucket(userId, name, isPublic = false) {
    // 1. Check uniqueness
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
        userId,
        isPublic: !!isPublic
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
      console.error(`Failed to delete directory ${bucketPath}:`, err.message);
    }

    return { message: 'Bucket deleted successfully' };
  }

  async putObject(userId, bucketName, file, isPublic = false) {
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
        path: file.path,
        isPublic: !!isPublic
      },
      create: {
        key: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        path: file.path,
        bucketId: bucket.id,
        isPublic: !!isPublic
      }
    });

    return object;
  }

  async getObject(userId, bucketName, objectKey, token) {
    // 1. Verify bucket existence
    const bucket = await prisma.bucket.findUnique({
      where: { name: bucketName }
    });

    if (!bucket) {
      throw new Error('Bucket not found');
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

    // 2. Check Permissions
    let authorized = false;

    // A. Public Access
    if (bucket.isPublic || object.isPublic) {
      authorized = true;
    }

    // B. User Ownership
    if (!authorized && userId && bucket.userId === userId) {
      authorized = true;
    }

    // C. Presigned Token
    if (!authorized && token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.bucketName === bucketName && decoded.objectKey === objectKey) {
          authorized = true;
        }
      } catch (err) {
        console.error('Invalid presigned token:', err.message);
      }
    }

    if (!authorized) {
      throw new Error('Permission denied');
    }

    return object;
  }

  async generatePresignedUrl(userId, bucketName, objectKey, expiresIn = '1h') {
    // Verify ownership
    const bucket = await prisma.bucket.findUnique({
        where: { name: bucketName }
    });

    if (!bucket || bucket.userId !== userId) {
        throw new Error('Permission denied or bucket not found');
    }
    
    // Check if object exists (optional but good)
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

    const token = jwt.sign(
        { bucketName, objectKey, type: 'presigned' }, 
        JWT_SECRET, 
        { expiresIn }
    );
    
    return { 
        url: `/storage/buckets/${bucketName}/objects/${objectKey}?token=${token}`,
        expiresIn 
    };
  }
}

module.exports = new StorageService();
