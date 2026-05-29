// File: routes/adminRoutes.js (Updated)
const express = require('express');
const router = express.Router();
// IMPORTANT: Add getDashboardStats to the import below
const { getAllClients, getAllReviews, deleteClient, getDashboardStats } = require('../controllers/adminController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

// Existing routes
router.get('/clients', authMiddleware, isAdmin, getAllClients);
router.get('/reviews', authMiddleware, isAdmin, getAllReviews);
router.delete('/clients/:id', authMiddleware, isAdmin, deleteClient);

// ADD THIS NEW ROUTE for fetching dashboard stats
router.get('/stats', authMiddleware, isAdmin, getDashboardStats);

module.exports = router;