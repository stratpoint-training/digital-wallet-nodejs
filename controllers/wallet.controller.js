const WalletService = require('../services/wallet.service');
//const StripeService = require('../services/stripe.service');
const validator = require('../utils/validator');
const logger = require('../utils/logger');

// const initStripeService = (req) => {
//   const stripeSecretKey = req.headers['stripe-secret-key'];
//   return StripeService(stripeSecretKey);
// };

exports.createWallet = async (req, res) => {
  try {
    const { error } = validator.validateWalletCreation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { initialBalance } = req.body;
    const userId = req.user.id;

    //const stripeService = initStripeService(req);
    const result = await WalletService.createWallet(userId, req.user.email, initialBalance);
    res.status(201).json(result);
  } catch (error) {
    logger.error('Error creating wallet:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deposit = async (req, res) => {
  try {
    const { error } = validator.validateTransaction({ ...req.body, type: 'deposit' });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { amount, paymentMethodId } = req.body;
    const userId = req.user.id;

    //const stripeService = initStripeService(req);
    const result = await WalletService.deposit(userId, amount, paymentMethodId);
    res.json(result);
  } catch (error) {
    logger.error('Error depositing funds:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.transfer = async (req, res) => {
  try {
    const { error } = validator.validateTransaction({ ...req.body, type: 'transfer' });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { toUserId, amount } = req.body;
    const fromUserId = req.user.id;

    const result = await WalletService.transfer(fromUserId, toUserId, amount);
    res.json(result);
  } catch (error) {
    logger.error('Error transferring funds:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { error } = validator.validateTransaction({ ...req.body, type: 'withdraw' });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { amount, destinationAccount } = req.body;
    const userId = req.user.id;

    //const stripeService = initStripeService(req);
    const result = await WalletService.withdraw(userId, amount, destinationAccount);
    res.json(result);
  } catch (error) {
    logger.error('Error withdrawing funds:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await WalletService.getBalance(userId);
    res.json(result);
  } catch (error) {
    logger.error('Error getting balance:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await WalletService.getTransactionHistory(userId);
    res.json(result);
  } catch (error) {
    logger.error('Error getting transaction history:', error);
    res.status(500).json({ error: error.message });
  }
};