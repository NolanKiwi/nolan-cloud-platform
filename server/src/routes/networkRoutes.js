const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');
const auth = require('../middlewares/authMiddleware');

// GET /api/networks - List all networks
router.get('/', auth, networkController.getNetworks);

// POST /api/networks - Create a new network
router.post('/', auth, networkController.createNetwork);

// DELETE /api/networks/:id - Remove a network
router.delete('/:id', auth, networkController.removeNetwork);

module.exports = router;
