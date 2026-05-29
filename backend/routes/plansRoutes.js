// File: routes/plansRoutes.js

const express = require('express');
const router = express.Router();
const { getAllPlans } = require('../controllers/plansController');

// This is a public route, no authentication needed
router.get('/', getAllPlans);

module.exports = router;