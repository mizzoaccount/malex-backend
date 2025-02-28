/*const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware'); // import protect middleware
const { createMember, getAllMembers } = require('../controllers/memberController'); // import createMember controller

// Route definition: Protect middleware should come first, followed by the controller function
router.post('/', protect, createMember);

router.get('/', getAllMembers);

module.exports = router;*/




// routes/memberRoutes.js

const express = require("express");
const protect = require('../middleware/authMiddleware');
const router = express.Router();
const {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");

router.post('/', protect, createMember);

// Get all members
router.get("/", getAllMembers);

// Get member by ID
router.get("/:id", getMemberById);

// Update member by ID
router.put("/:id", updateMember);

// Delete member by ID
router.delete("/:id", deleteMember);

module.exports = router;

