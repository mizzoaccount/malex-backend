/*const express = require('express');
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

const { 
  createProduct,
  getAllProducts,
  updateProduct 
} = require('../controllers/productController');

// Route to add a product
router.post('/add', createProduct);

router.get('/', getAllProducts );

router.put("/edit/:id", upload.single("image"), updateProduct);

module.exports = router;*/

const express = require('express');
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "uploads/" }); // This should handle the file uploads

const { 
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct, 
  createMultipleProducts,
  getProductById 
} = require('../controllers/productController');

// Route to add a product
router.post('/add', createProduct);

router.get('/', getAllProducts );

router.put("/edit/:id", upload.single("image"), updateProduct); 

router.delete("/delete/:id", deleteProduct);

router.get("/:id", getProductById);

router.post("/bulk",createMultipleProducts )

module.exports = router;


