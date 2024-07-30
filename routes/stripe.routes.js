const express = require('express');
const StripeController = require('../controllers/stripe.controller');
const authenticateJWT = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/create-payment-method', authenticateJWT, StripeController.createPaymentMethod);
router.get('/payment-methods', authenticateJWT, StripeController.getPaymentMethods);

module.exports = router;