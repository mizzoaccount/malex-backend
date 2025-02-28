const Member = require('../models/Member');

// Controller to create a new member
const createMember = async (req, res) => {
  try {
    const { mpesaCode, name, amount, phoneNumber, email, role } = req.body;

    // Set role to 'nonmember' if not provided
    const newMember = new Member({
      mpesaCode,
      name,
      amount,
      phoneNumber,
      email,
      user: req.user.id,
      role: role || 'nonmember', // If role is not provided, default to 'nonmember'
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Controller to fetch all members from the database
const getAllMembers = async (req, res) => {
  try {
    // Fetch all members from the Member model
    const members = await Member.find().populate('user', 'name email'); // Optionally populate user data if needed
    
    if (!members) {
      return res.status(404).json({ error: 'No members found' });
    }

    res.status(200).json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// Get single member by ID
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ msg: "Member not found" });
    }
    res.status(200).json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update a member by ID
const updateMember = async (req, res) => {
  try {
    const { name, email, phoneNumber, role } = req.body;
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { name, email, phoneNumber, role },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ msg: "Member not found" });
    }
    res.status(200).json(updatedMember);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete a member by ID
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ msg: "Member not found" });
    }
    res.status(200).json({ msg: "Member deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
