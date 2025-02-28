const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');

const createInvestment = async (req, res) => {
  console.log("Received request to make an investment");

  const userId = req.user?.id;
  const { amount, investmentDetails } = req.body; // Details about the investment

  try {
    if (!userId || !amount || !investmentDetails) {
      return res.status(400).json({ message: "Amount and investment details are required." });
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

    // Log the investment transaction
    const transaction = new Transaction({
      userId,
      type: 'investment',
      amount,
      status: 'successful',
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
      investmentDetails,
    });

    await transaction.save();

    // Update the user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    console.log("Investment successful:", transaction);

    res.status(200).json({
      message: "Investment successful",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("Error processing investment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createInvestment };
