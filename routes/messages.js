const express = require('express');
const router = express.Router();
const {
  getMessages,
  markAsRead
} = require('../controllers/messages');
const protect = require('../middleware/authMiddleware');

router.get('/:conversationId', protect, getMessages);
router.patch('/:messageId/read', protect, markAsRead);

module.exports = router;