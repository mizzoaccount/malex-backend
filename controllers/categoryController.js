/*const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const getCategories = async (req, res) => {
  try {
    console.log('Fetching categories...'); // Log before the query
    const categories = await Category.find();
    console.log('Categories fetched successfully:', categories); // Log on success
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message); // Log the error with details
    res.status(500).json({ message: 'Error fetching categories' });
  }
};


const createCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = new Category({ name, description });
      await category.save();
      res.status(200).json(category);
    } catch (error) {
      console.error('Error creating category:', error);  // Logs the exact error to the server console
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  };

  // Fetch a single category by ID
// Fetch a single category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  
  console.log(`Fetching category with ID: ${id}`);  // Log the ID of the category being fetched

  try {
    const category = await Category.findById(id);

    if (!category) {
      console.log(`Category with ID: ${id} not found`);  // Log if the category is not found
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log(`Successfully fetched category with ID: ${id}`);  // Log success
    res.json(category);
  } catch (error) {
    console.error(`Error fetching category with ID: ${id}`, error.message);  // Log any errors
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

  

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};

module.exports = {
  getCategoryById, 
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
*/

const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;
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

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

 // 'image' should match the key in the FormData

const createCategory = async (req, res) => {
  try {
    handleImageUpload(req, res, async (err) => {
      if (err) {
        console.error('Error handling image upload:', err);
        return res.status(500).json({ message: 'Error uploading image' });
      }

      const { name, description } = req.body;
      let imageUrl = '';
      
      // Check if the file exists in req.file (which is handled by multer)
      if (req.file) {
        console.log('Uploading image to Cloudinary...');
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'categories' },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          ).end(req.file.buffer);  // Send the buffer to Cloudinary
        });
        imageUrl = uploadResponse.secure_url;
        console.log('Image uploaded successfully:', imageUrl);
      }

      // Save the category to the database
      const category = new Category({ name, description, image: imageUrl });
      await category.save();
      res.status(200).json(category);
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Create a category
/*const createCategory = async (req, res) => {
  try {
    // Step 1: Use the middleware to handle the image file
    handleImageUpload(req, res, async (err) => {
      if (err) {
        console.error('Error handling image upload:', err);
        return res.status(500).json({ message: 'Error uploading image' });
      }

      // Step 2: Extract the category data from the request body
      const { name, description } = req.body;

      // Log the received data
      console.log('Received Data:', { name, description });

      // Step 3: Upload image to Cloudinary if an image file is present
      let imageUrl = '';
      if (req.file) {
        console.log('Uploading image to Cloudinary...');
        const uploadResponse = await cloudinary.uploader.upload_stream(
          { folder: 'categories' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload failed:', error);
              return res.status(500).json({ message: 'Image upload failed' });
            }
            imageUrl = result.secure_url;
            console.log('Image uploaded successfully:', imageUrl);
          }
        );
        req.file.stream.pipe(uploadResponse);
      }

      // Step 4: Create and save the category
      const category = new Category({ name, description, image: imageUrl });
      await category.save();
      res.status(200).json(category);
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};*/

// Fetch a single category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  
  console.log(`Fetching category with ID: ${id}`);  // Log the ID of the category being fetched

  try {
    const category = await Category.findById(id);

    if (!category) {
      console.log(`Category with ID: ${id} not found`);  // Log if the category is not found
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log(`Successfully fetched category with ID: ${id}`);  // Log success
    res.json(category);
  } catch (error) {
    console.error(`Error fetching category with ID: ${id}`, error.message);  // Log any errors
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Upload new image to Cloudinary if provided
    let imageUrl = '';
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload_stream(
        { folder: 'categories' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload failed:', error);
            return res.status(500).json({ message: 'Image upload failed' });
          }
          imageUrl = result.secure_url;
        }
      );
      req.file.stream.pipe(uploadResponse);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, ...(imageUrl && { image: imageUrl }) },
      { new: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
