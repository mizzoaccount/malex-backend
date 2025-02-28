const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');

const createWithdrawal = async (req, res) => {
  console.log("Received request to withdraw cash");

  const userId = req.user?.id; // Get authenticated user's ID
  const { amount, withdrawalMethod } = req.body; // e.g., Bank Transfer, M-Pesa withdrawal

  try {
    if (!userId || !amount || !withdrawalMethod) {
      return res.status(400).json({ message: "Amount and withdrawal method are required." });
    }

    // Fetch user's current balance
    let balance = await Balance.findOne({ userId });
    if (!balance) {
      return res.status(400).json({ message: "No balance found for this user." });
    }

    // Check if the user has sufficient balance
    if (balance.totalBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    const previousBalance = balance.totalBalance;
    const newBalance = previousBalance - amount;

    // Log the withdrawal transaction
    const transaction = new Transaction({
      userId,
      type: 'withdrawal',
      amount,
      status: 'successful', // You can add status handling based on withdrawal method or API response
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
      withdrawalMethod,
    });

    await transaction.save();

    // Update the user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    console.log("Withdrawal successful:", transaction);

    res.status(200).json({
      message: "Withdrawal successful",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createWithdrawal };
