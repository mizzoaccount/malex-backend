const cloudinary = require("cloudinary").v2;
const Product = require("../models/Product");
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer setup to handle the file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle image upload
const handleImageUpload = upload.single('image');




const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  console.log("Received request to update product with ID:", id);
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  try {
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      console.log("Product not found with ID:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle image upload if provided
    let imageUrl = product.image; // Default to the current image URL if no new image is uploaded
    if (req.file) {
      console.log("File received, uploading to Cloudinary...");

      // Log file details to ensure it's being received correctly
      console.log("File details:", req.file);

      // Use Cloudinary's uploader.upload() to directly upload the file
      const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products', // Optional: specify a folder
      });

      // If the upload is successful, update the image URL
      console.log("Cloudinary upload successful, URL:", uploadResponse.secure_url);
      imageUrl = uploadResponse.secure_url;
    } else {
      console.log("No file uploaded, keeping existing image URL.");
    }

    // Update the product fields
    product.name = name;
    product.price = price;
    product.stock = stock;
    product.image = imageUrl;  // Assign the image URL from Cloudinary

    // Save the updated product
    await product.save();
    console.log("Product updated successfully:", product);
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  console.log("Received request to delete product with ID:", id);

  try {
    // Find the product by ID and delete it
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      console.log("Product not found with ID:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product deleted successfully:", product);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    // Log the incoming request data
    console.log("Incoming Product Data:", req.body);

    handleImageUpload(req, res, async (err) => {
      if (err) {
        console.error('Error handling image upload:', err);
        return res.status(500).json({ message: 'Error uploading image' });
      }

      const { name, price, stock } = req.body;
      let imageUrl = '';

      // Log the image file details if available
      if (req.file) {
        console.log('File received:', req.file);
        console.log('Uploading image to Cloudinary...');
        
        try {
          const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: 'products' }, // Specify folder in Cloudinary
              (error, result) => {
                if (error) reject(error);
                resolve(result);
              }
            ).end(req.file.buffer);  // Send the buffer to Cloudinary
          });
          imageUrl = uploadResponse.secure_url;
          console.log('Image uploaded successfully:', imageUrl);
        } catch (cloudinaryError) {
          console.error('Error uploading image to Cloudinary:', cloudinaryError);
          return res.status(500).json({ message: 'Cloudinary upload failed' });
        }
      }

      // Log the product details before saving
      console.log("Product details before saving:", { name, price, stock, imageUrl });

      // Save the Product to the database
      const product = new Product({ name, price, stock, image: imageUrl });
      await product.save();

      // Log the saved product
      console.log('Product saved:', product);

      res.status(200).json(product);
    });
  } catch (error) {
    console.error('Error creating Product:', error);
    res.status(500).json({ message: 'Error creating Product', error: error.message });
  }
};

const createMultipleProducts = async (req, res) => {
  try {
    console.log("Incoming Products Data:", req.body);

    if (!Array.isArray(req.body.products) || req.body.products.length === 0) {
      return res.status(400).json({ message: "Invalid request. Expected an array of products." });
    }

    const productsData = req.body.products;
    const savedProducts = [];

    for (const productData of productsData) {
      const { name, price, stock } = productData;
      let imageUrl = '';

      if (productData.imageBuffer) {
        console.log('Uploading image to Cloudinary...');
        try {
          const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: 'products' },
              (error, result) => {
                if (error) reject(error);
                resolve(result);
              }
            ).end(Buffer.from(productData.imageBuffer, 'base64')); // Convert base64 to buffer
          });
          imageUrl = uploadResponse.secure_url;
          console.log('Image uploaded successfully:', imageUrl);
        } catch (cloudinaryError) {
          console.error('Error uploading image to Cloudinary:', cloudinaryError);
          return res.status(500).json({ message: 'Cloudinary upload failed' });
        }
      }

      const newProduct = new Product({ name, price, stock, image: imageUrl });
      await newProduct.save();
      savedProducts.push(newProduct);
    }

    console.log('All products saved:', savedProducts);
    res.status(200).json({ message: 'Products created successfully', products: savedProducts });

  } catch (error) {
    console.error('Error creating multiple products:', error);
    res.status(500).json({ message: 'Error creating multiple products', error: error.message });
  }
};

module.exports = { getProductById, createProduct, getAllProducts, updateProduct, deleteProduct, createMultipleProducts  };