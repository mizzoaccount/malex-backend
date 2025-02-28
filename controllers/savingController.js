//const Saving = require('../models/Saving');
const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');

// Controller to fetch savings
const getUserSavings = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the authenticated user (assuming it's stored in req.user)
    console.log(`Fetching savings for user ID: ${userId}`); // Log the user ID

    // Find saving entry for the current user
    const saving = await Balance.findOne({ userId });
    console.log(`Found saving: ${saving ? JSON.stringify(saving) : 'No saving found'}`); // Log saving data if found

    if (!saving) {
      // No saving found for the user, prompt them to make a saving
      console.log('No saving entry found for user, prompting to make a saving');
      return res.status(404).json({ message: 'No initial saving for this user. Please make a saving to proceed.' });
    }

    // If a saving entry exists, return the saving data
    console.log('Returning saving data for user');
    res.status(200).json({
      balance: saving.totalBalance,
      savingsId: saving._id,
      fullName: saving.fullName,
      approved: saving.approved,
    });
  } catch (error) {
    console.error('Error fetching savings:', error); // Log any errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


/*const createSaving = async (req, res) => {
  console.log("Received request to deposit cash");

  const userId = req.user?.id; // Get authenticated user's ID
  const { mpesaCode, fullName, amount, phoneNumber, email } = req.body;

  try {
    if (!userId || !mpesaCode || !fullName || !amount || !phoneNumber || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Fetch user's current balance (or create one if it doesn’t exist)
    let balance = await Balance.findOne({ userId });
    if (!balance) {
      balance = new Balance({ userId, totalBalance: 0 });
    }

    const previousBalance = balance.totalBalance;
    const newBalance = previousBalance + amount;

    // Save deposit as a new transaction
    const transaction = new Transaction({
      userId,
      type: 'deposit',
      amount,
      mpesaCode,
      status: 'successful',
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
    });

    await transaction.save();

    // Update user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    console.log("Deposit successful:", transaction);

    res.status(200).json({
      message: "Deposit successful",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};*/
const createSaving = async (req, res) => {
  console.log("Received request to deposit cash");

  const userId = req.user?.id; // Get authenticated user's ID
  const { mpesaCode, fullName, amount, phoneNumber, email } = req.body;

  try {
    if (!userId || !mpesaCode || !fullName || !amount || !phoneNumber || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure amount is a number
    const depositAmount = Number(amount); // Convert to number
    if (isNaN(depositAmount)) {
      return res.status(400).json({ message: "Amount must be a valid number." });
    }

    // Fetch user's current balance (or create one if it doesn’t exist)
    let balance = await Balance.findOne({ userId });
    if (!balance) {
      balance = new Balance({ userId, totalBalance: 0 });
    }

    const previousBalance = balance.totalBalance;
    const newBalance = previousBalance + depositAmount; // Ensure addition is done with numbers

    // Save deposit as a new transaction
    const transaction = new Transaction({
      userId,
      type: 'deposit',
      amount: depositAmount,
      mpesaCode,
      status: 'successful',
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
    });

    await transaction.save();

    // Update user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    console.log("Deposit successful:", transaction);

    res.status(200).json({
      message: "Deposit successful",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createSaving,
  getUserSavings,
};




