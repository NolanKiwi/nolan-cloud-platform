const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storageController');
const authMiddleware = require('../middlewares/authMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const STORAGE_ROOT = path.join(__dirname, '../../../storage_data');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { bucketName } = req.params;
    const bucketPath = path.join(STORAGE_ROOT, bucketName);
    
    // Ensure bucket directory exists (it should have been created by createBucket)
    if (!fs.existsSync(bucketPath)) {
      return cb(new Error('Bucket directory not found'), null);
    }
    cb(null, bucketPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const { validate, schemas } = require('../middlewares/validationMiddleware');

// 1. Public / Optional Auth Routes
// GET /api/storage/buckets/:bucketName/objects/:objectKey (Download)
router.get('/buckets/:bucketName/objects/:objectKey', optionalAuthMiddleware, storageController.downloadObject);

// 2. Protected Routes (require Auth)
// Apply authMiddleware to all subsequent routes
router.use(authMiddleware);

// Bucket Operations
router.get('/buckets', storageController.listBuckets);
router.post('/buckets', validate(schemas.bucketCreate), storageController.createBucket);
router.delete('/buckets/:id', storageController.deleteBucket);

// Object Operations
router.post('/buckets/:bucketName/objects', upload.single('file'), storageController.uploadObject);

// Presigned URL
router.post('/buckets/:bucketName/objects/:objectKey/presign', storageController.generatePresignedUrl);

module.exports = router;
