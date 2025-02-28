const Seller = require('../models/Seller');
const User = require('../models/User'); // Assuming the User model is in the same folder

// Create a new seller entry
exports.createSeller = async (req, res) => {
  try {
    const { name, email, phoneNumber, mpesaCode, amount } = req.body;

    console.log('Request Body:', req.body);

    // Validate input
    if (!name || !email || !phoneNumber || !mpesaCode || !amount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists in the User model
    const existingUser = await User.findOne({ email });
    console.log('Existing User:', existingUser);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    console.log('Existing Seller:', existingSeller);
    if (existingSeller) {
      return res.status(400).json({ error: 'Seller with this email already exists' });
    }

    // Create a new seller with 'pending' status
    const seller = new Seller({
      name,
      email,
      phoneNumber,
      mpesaCode,
      amount,
      status: 'pending',
    });

    await seller.save();
    console.log('Seller Created:', seller);
    res.status(201).json({ message: 'Seller request submitted successfully', seller });
  } catch (error) {
    console.error('Error creating seller:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};


// Approve a seller (Admin action)
exports.approveSeller = async (req, res) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    seller.status = 'active';
    await seller.save();

    res.status(200).json({ message: 'Seller approved successfully', seller });
  } catch (error) {
    console.error('Error approving seller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



/*exports.editSeller = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Seller ID from params:', id);

    // Log the request body to debug
    console.log('Request body:', req.body);

    const { name, phoneNumber, mpesaCode, amount, status, shopInfo } = req.body;

    // Find the seller by ID
    const seller = await Seller.findById(id);
    if (!seller) {
      console.error('Seller not found');
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Log the seller object before making changes
    console.log('Found seller:', seller);

    // Update fields conditionally
    if (name) seller.name = name;
    if (phoneNumber) seller.phoneNumber = phoneNumber;
    if (mpesaCode) seller.mpesaCode = mpesaCode;
    if (amount) seller.amount = amount;
    if (status) seller.status = status;
    if (shopInfo) seller.shopInfo = { ...seller.shopInfo, ...shopInfo }; // Merge existing and new shopInfo

    // Log the updated seller before saving
    console.log('Updated seller:', seller);

    // Save the seller
    await seller.save();

    // Send the updated seller as the response
    res.status(200).json(seller);
  } catch (error) {
    console.error('Error editing seller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};*/


// Get all sellers
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.editSeller = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Seller ID from params:', id);

    // Log the request body to debug
    console.log('Request body:', req.body);

    const { 
      name, 
      phoneNumber, 
      mpesaCode, 
      amount, 
      status, 
      location, 
      description, 
      email, 
      instagram, 
      facebook, 
      twitter 
    } = req.body;

    // Find the seller by ID
    const seller = await Seller.findById(id);
    if (!seller) {
      console.error('Seller not found');
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Log the seller object before making changes
    console.log('Found seller:', seller);

    // Update fields conditionally
    if (name) seller.name = name;
    if (phoneNumber) seller.phoneNumber = phoneNumber;
    if (mpesaCode) seller.mpesaCode = mpesaCode;
    if (amount) seller.amount = amount;
    if (status) seller.status = status;

    // Conditionally update shopInfo with new values
    if (location) seller.shopInfo.location = location;
    if (description) seller.shopInfo.description = description;
    if (email) seller.shopInfo.email = email;
    if (instagram) seller.shopInfo.instagram = instagram;
    if (facebook) seller.shopInfo.facebook = facebook;
    if (twitter) seller.shopInfo.twitter = twitter;

    // Log the updated seller before saving
    console.log('Updated seller:', seller);

    // Save the seller
    await seller.save();

    // Send the updated seller as the response
    res.status(200).json(seller);
  } catch (error) {
    console.error('Error editing seller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
