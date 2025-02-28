const express = require('express');
const { getAllUsers, getUserById, editUser } = require('../controllers/userController');
const router = express.Router();

// Route to get all users
router.get('/all', getAllUsers);

// Route to get a single user by ID
router.get('/:id', getUserById);

// Route to edit a user
router.put('/:id', editUser);

module.exports = router;
