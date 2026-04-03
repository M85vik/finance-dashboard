const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware.js');
const role = require('../middleware/role.middleware.js');

const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} = require('../controllers/record.controller.js');

// Create → Analyst + Admin
router.post('/', auth, role('analyst', 'admin'), createRecord);

// Read → All logged-in users
router.get('/', auth, getRecords);

// Update → Analyst + Admin
router.put('/:id', auth, role('analyst', 'admin'), updateRecord);

// Delete → Admin only
router.delete('/:id', auth, role('admin'), deleteRecord);

module.exports = router;