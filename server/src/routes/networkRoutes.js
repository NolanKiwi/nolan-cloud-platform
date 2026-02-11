const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');

// GET /api/networks - List all networks
router.get('/', networkController.getNetworks);

// POST /api/networks - Create a new network
router.post('/', networkController.createNetwork);

// DELETE /api/networks/:id - Remove a network
router.delete('/:id', networkController.removeNetwork);

module.exports = router;
