const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const productController = {
  // Create a new product
  createProduct: async (req, res) => {
    try {
      // Parse the JSON fields from FormData
      const { name, designer, mainCategory, subCategory, brand, price, stock, attributes } = req.body;
      
      // Parse attributes if it's a string
      const parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;

      // Upload images to Cloudinary
      const imageUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          // Upload from buffer since we're using memory storage
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'products' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            
            uploadStream.end(file.buffer);
          });
          
          imageUrls.push(result.secure_url);
        }
      }

      // Create new product
      const newProduct = new Product({
        name,
        designer,
        category: {
          main: mainCategory,
          sub: subCategory,
          brand
        },
        price: parseFloat(price),
        stock: parseInt(stock),
        images: imageUrls,
        attributes: parsedAttributes
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        product: newProduct
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message
      });
    }
  },

  // Get all products
 // Get all products (no filters)
getProducts: async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
},
};

module.exports = productController;