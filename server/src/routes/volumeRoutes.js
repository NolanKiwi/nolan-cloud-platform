const express = require('express');
const router = express.Router();
const volumeController = require('../controllers/volumeController');

// GET /api/volumes
router.get('/', volumeController.listVolumes);

// POST /api/volumes
router.post('/', volumeController.createVolume);

// GET /api/volumes/:name
router.get('/:name', volumeController.inspectVolume);

// DELETE /api/volumes/:name
router.delete('/:name', volumeController.removeVolume);

module.exports = router;
