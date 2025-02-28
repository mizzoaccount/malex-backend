const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/:id', getCategoryById);

module.exports = router;
