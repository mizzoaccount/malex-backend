// models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  mpesaCode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  role: {
    type: String,
    enum: ['member', 'nonmember'],
    default: 'nonmember', // Default value is 'nonmember'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
