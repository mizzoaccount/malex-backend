// routes/authRoutes.js
/*const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;*/




const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');  // Import the function
const router = express.Router();

router.post('/login', loginUser);  // Ensure this route is correctly set up
/*router.post('/login', (req, res, next) => {
    console.log('Login route hit!');
    next();
  }, loginUser);*/
router.post('/register', registerUser);

module.exports = router;



