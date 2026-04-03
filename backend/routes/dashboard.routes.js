const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');

const {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
} = require('../controllers/dashboard.controller');

// All logged-in users can access dashboard
router.get('/summary', auth, getSummary);
router.get('/categories', auth, getCategoryBreakdown);
router.get('/trends', auth, getMonthlyTrends);
router.get('/recent', auth, getRecentActivity);

module.exports = router;