const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const skillRoutes = require("./routes/skillRoutes");
const memberRoutes = require('./routes/memberRoutes');
const shelfRoutes = require('./routes/shelfRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const savingRoutes = require('./routes/savingRoutes');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();



const app = express();

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies

// Configure CORS
const allowedOrigins = ['http://localhost:3000','http://localhost:3001', 'https://www.malexchemsupplies.com', 'https://malex.onrender.com']; // Add your frontend URL here
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow credentials (cookies, headers, etc.)
  })
);

// Configure multer for file uploads (set up storage configuration)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be uploaded
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
  },
});

const uploadMultiple = multer({ storage: storage }).array('images'); // Allow multiple image uploads
const upload = multer({ storage: storage }).single('image'); // For single file upload

// Apply multer middleware to handle image uploads for shop creation
app.use("/api/shops", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message }); // Handle any multer errors
    }
    next(); // Proceed to the next middleware/route handler
  });
});

// Apply multer middleware to handle image uploads for shop creation
app.use("/api/skills", (req, res, next) => {
  upload(req, res, (err) => {
    // Log the initial incoming request
    console.log("Incoming request to /api/skills");
    
    // Log the request body and files
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files); // This will show an array of uploaded files, if any

    if (err) {
      // Log multer error details
      console.error("Multer Error:", err.message);

      // Respond with error details
      return res.status(400).json({ error: err.message });
    }

    // Log success if files are received correctly
    if (req.files) {
      req.files.forEach((file) => {
        console.log(`Received file: ${file.originalname}, type: ${file.mimetype}`);
      });
    }

    // Proceed to the next middleware or route handler
    next();
  });
});



// Connect to the database
connectDB();
// Trigger log at the start to confirm the server is running
console.log("Application is starting...");
// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/sellers', sellerRoutes); // Seller routes
app.use('/api/orders', orderRoutes); // Order routes
app.use("/api/shops", shopRoutes); // Shop routes
app.use("/api/products", productRoutes); // Product routes
app.use('/api/categories', categoryRoutes); // Category routes
app.use("/api/skill", skillRoutes); // Shop routes
app.use('/api/members', memberRoutes);
app.use('/api/shelf', shelfRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/saving', savingRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});