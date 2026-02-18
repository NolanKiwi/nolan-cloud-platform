const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, schemas } = require('../middlewares/validationMiddleware');

// User Registration
router.post('/signup', validate(schemas.signup), authController.signup);

// User Login
router.post('/login', validate(schemas.login), authController.login);

module.exports = router;
