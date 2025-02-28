const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');

const createPurchase = async (req, res) => {
  console.log("Received request to make a purchase");

  const userId = req.user?.id;
  const { amount, itemId } = req.body; // Item ID for the purchased good

  try {
    if (!userId || !amount || !itemId) {
      return res.status(400).json({ message: "Amount and item ID are required." });
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

    // Log the purchase transaction
    const transaction = new Transaction({
      userId,
      type: 'purchase',
      amount,
      status: 'successful',
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
      itemId,
    });

    await transaction.save();

    // Update the user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    console.log("Purchase successful:", transaction);

    res.status(200).json({
      message: "Purchase successful",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createPurchase };
