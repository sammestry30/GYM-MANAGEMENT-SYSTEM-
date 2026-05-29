const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for new user registration
// This will be called by your registration form
router.post('/register', authController.register);

// Route for user/admin login
// This will be called by your login form
router.post('/login', authController.login);

module.exports = router;