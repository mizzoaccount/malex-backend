const express = require('express');
const {
  createSeller,
  approveSeller,
  getAllSellers,
  editSeller,
} = require('../controllers/sellerController');

const router = express.Router();

// Create a new seller
router.post('/create', createSeller);

// Approve a seller
router.patch('/approve/:id', approveSeller);

// Get all sellers
router.get('/', getAllSellers);

// Route to edit seller information
router.put('/edit/:id', editSeller);

module.exports = router;
