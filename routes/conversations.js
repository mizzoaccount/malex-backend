const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversation,
  createConversation,
  getOrCreateConversation
} = require('../controllers/conversations');
const protect= require('../middleware/authMiddleware');

router.get('/', protect, getConversations);
router.get('/:id', protect, getConversation);
router.post('/', protect, createConversation);
router.post('/find-or-create', protect, getOrCreateConversation);

module.exports = router;