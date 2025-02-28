const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['deposit', 'withdrawal', 'investment', 'seminar', 'purchase'], 
    required: true 
  },
  amount: { type: Number, required: true },
  mpesaCode: { type: String, required: function() { return this.type === 'deposit'; } }, // Required for deposits
  status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
