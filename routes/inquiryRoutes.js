const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createInquiry,
  getUserInquiries,
  getAllInquiries,
  updateInquiry
} = require('../controllers/inquiryController');

const router = express.Router();

router.route('/')
  .post(authenticate, createInquiry)
  .get(authenticate, getUserInquiries);

router.route('/all')
  .get(authenticate, authorize('admin'), getAllInquiries);

router.route('/:id')
  .put(authenticate, authorize('admin'), updateInquiry);

module.exports = router;