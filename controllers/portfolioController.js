const cloudinary = require("cloudinary").v2;
const Portfolio = require("../models/Skill");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Set up Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Controller for creating a portfolio item
const createPortfolio = async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;

    // Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Upload the image to Cloudinary
    cloudinary.uploader.upload_stream(
      { folder: "portfolio_images" }, // Optional folder in Cloudinary
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Cloudinary upload failed", error });
        }

        // Once image is uploaded, save the image URL
        const imageUrl = result.secure_url;

        // Create the product and save it to MongoDB
        try {
          const newProduct = new Portfolio({
            image: imageUrl,
            title: name,
            description,
          });

          const savedProduct = await newProduct.save();
          res.status(200).json(savedProduct);
        } catch (err) {
          console.error("Error saving product:", err);
          res.status(500).json({ message: "Error saving product" });
        }
      }
    ).end(req.file.buffer); // Use `req.file.buffer` to pass the file buffer to Cloudinary
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
};

module.exports = { createPortfolio };
