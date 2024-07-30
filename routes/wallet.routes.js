const express = require('express');
const authenticateJWT = require('../middleware/auth.middleware');
const WalletController = require('../controllers/wallet.controller');

const router = express.Router();

router.post('/create', authenticateJWT, WalletController.createWallet);
router.post('/deposit', authenticateJWT, WalletController.deposit);
router.post('/transfer', authenticateJWT, WalletController.transfer);
router.post('/withdraw', authenticateJWT, WalletController.withdraw);
router.get('/balance', authenticateJWT, WalletController.getBalance);
router.get('/transactions', authenticateJWT, WalletController.getTransactionHistory);

module.exports = router;
