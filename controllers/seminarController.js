const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');

const createSeminarPayment = async (req, res) => {
  console.log("Received request to pay for seminar");

  const userId = req.user?.id;
  const { amount, seminarId } = req.body; // ID of the seminar being paid for

  try {
    if (!userId || !amount || !seminarId) {
      return res.status(400).json({ message: "Amount and seminar ID are required." });
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

    // Log the seminar payment transaction
    const transaction = new Transaction({
      userId,
      type: 'seminar',
      amount,
      status: 'successful',
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
      seminarId,
    });

    await transaction.save();

    // Update the user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    console.log("Seminar payment successful:", transaction);

    res.status(200).json({
      message: "Seminar payment successful",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("Error processing seminar payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createSeminarPayment };
