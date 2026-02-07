const express = require('express');
const router = express.Router();
const containerController = require('../controllers/containerController');

// GET /api/containers
router.get('/', containerController.getContainers);

// GET /api/containers/:id/stats
router.get('/:id/stats', containerController.getContainerStats);

module.exports = router;
