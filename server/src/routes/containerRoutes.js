const express = require('express');
const router = express.Router();
const containerController = require('../controllers/containerController');
const auth = require('../middlewares/authMiddleware');

// GET /api/containers (Protect all routes)
router.get('/', auth, containerController.getContainers);

// POST /api/containers
router.post('/', auth, containerController.createContainer);

// GET /api/containers/:id/stats
router.get('/:id/stats', auth, containerController.getContainerStats);

// DELETE /api/containers/:id
router.delete('/:id', auth, containerController.removeContainer);

// POST /api/containers/:id/start
router.post('/:id/start', auth, containerController.startContainer);

// POST /api/containers/:id/stop
router.post('/:id/stop', auth, containerController.stopContainer);

// POST /api/containers/:id/restart
router.post('/:id/restart', auth, containerController.restartContainer);

module.exports = router;
