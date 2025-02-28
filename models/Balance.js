const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalBalance: { type: Number, default: 0 }, // Tracks the total money in user's account
}, { timestamps: true });

const Balance = mongoose.model('Balance', balanceSchema);
module.exports = Balance;
