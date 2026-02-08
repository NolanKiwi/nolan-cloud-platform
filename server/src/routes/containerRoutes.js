const express = require('express');
const router = express.Router();
const containerController = require('../controllers/containerController');

// GET /api/containers
router.get('/', containerController.getContainers);

// GET /api/containers/:id/stats
router.get('/:id/stats', containerController.getContainerStats);

// POST /api/containers/:id/start
router.post('/:id/start', containerController.startContainer);

// POST /api/containers/:id/stop
router.post('/:id/stop', containerController.stopContainer);

// POST /api/containers/:id/restart
router.post('/:id/restart', containerController.restartContainer);

module.exports = router;
