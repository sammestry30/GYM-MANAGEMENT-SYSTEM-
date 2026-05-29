// File: routes/userRoutes.js
const express = require('express');
const router = express.Router();

// I added 'getNotifications' to the import list here:
const { getUserProfile, getNotifications } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Existing profile route
router.get('/profile', authMiddleware, getUserProfile);

// NEW ROUTE: Get User Notifications
router.get('/notifications', authMiddleware, getNotifications);

module.exports = router;