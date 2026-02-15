const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User Registration
router.post('/signup', authController.signup);

// User Login
router.post('/login', authController.login);

module.exports = router;
