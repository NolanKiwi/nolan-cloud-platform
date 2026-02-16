const express = require('express');
const router = express.Router();
const volumeController = require('../controllers/volumeController');
const auth = require('../middlewares/authMiddleware');

// GET /api/volumes
router.get('/', auth, volumeController.listVolumes);

// POST /api/volumes
router.post('/', auth, volumeController.createVolume);

// GET /api/volumes/:name
router.get('/:name', auth, volumeController.inspectVolume);

// DELETE /api/volumes/:name
router.delete('/:name', auth, volumeController.removeVolume);

module.exports = router;
