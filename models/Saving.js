const mongoose = require('mongoose');

const savingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mpesaCode: { type: String, required: true },
  fullName: { type: String, required: true },
  amount: { type: Number, default: 0, required: true },  // Set default value to 0
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  approved: { type: String, enum: ['yes', 'no'], default: 'no' },
}, { timestamps: true });

const Saving = mongoose.model('Saving', savingSchema);

module.exports = Saving;

