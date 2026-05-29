// File: routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { submitReview } = require('../controllers/contactController');

// This is a public route, anyone can submit a review
router.post('/', submitReview);

module.exports = router;