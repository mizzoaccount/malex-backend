const Inquiry = require('../models/Inquiry');


// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Private
exports.createInquiry = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ errors: [{ msg: 'No inquiry items provided' }] });
    }

    const inquiry = new Inquiry({
      user: req.user.userId,
      //user: req.user.id,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        category: item.category,
        specifications: item.specifications,
        image: item.image,
        quantity: item.quantity,
        notes: item.notes
      }))
    });

    await inquiry.save();

    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};


// @desc    Get user inquiries
// @route   GET /api/inquiries
// @access  Private
exports.getUserInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('user', 'name email');

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

// @desc    Get all inquiries (admin)
// @route   GET /api/inquiries/all
// @access  Private/Admin
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .sort('-createdAt')
      .populate('user', 'name email');

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

// @desc    Update inquiry status (admin)
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
exports.updateInquiry = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ errors: [{ msg: 'Inquiry not found' }] });
    }

    if (status) inquiry.status = status;
    if (adminNotes) inquiry.adminNotes = adminNotes;

    await inquiry.save();

    res.json({
      success: true,
      data: inquiry
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};