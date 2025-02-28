// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register User
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ firstName, lastName, email, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
const loginUser = async (req, res) => {
  console.log("Starting login process...");

  const { email, password } = req.body;
  console.log("Received credentials:", { email, password });

  if (!email || !password) {
    console.error("Missing email or password");
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    console.log("Querying user from DB...");
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found with this email");
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log("User found:", user);

    const isMatch = await user.matchPassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.error("Password does not match");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    try {
      console.log("JWT_SECRET used for signing:", process.env.JWT_SECRET);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log("JWT Token generated:", token);

      const userData = {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      console.log("User data to send in response:", userData);
      return res.status(200).json({
        message: 'User logged in successfully',
        token,
        user: userData,
      });
    } catch (error) {
      console.error("Error during JWT token generation:", error);
      return res.status(500).json({ message: 'Token generation error' });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
