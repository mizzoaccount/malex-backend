// models/Seller.js
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  mpesaCode: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['inactive', 'pending', 'active'], default: 'inactive' },
  //shopInfo: { type: Object, default: {} },
}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
