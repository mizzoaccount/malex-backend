const express = require('express');
const { getUserSavings, createSaving } = require('../controllers/savingController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware to authenticate and get the user ID from session or token
// You can implement a custom middleware to verify the user's session or token.

router.get('/savings', protect, getUserSavings);
// POST route to create a saving
router.post('/create', protect, createSaving);

module.exports = router;




