const StripeService = require('../services/stripe.service');
const validator = require('../utils/validator');
const logger = require('../utils/logger');

const initStripeService = (req) => {
  const stripeSecretKey = req.headers['stripe-secret-key'];
  return new StripeService(stripeSecretKey);
};

exports.createPaymentMethod = async (req, res) => {
  try {
    const { type, card } = req.body;
    
    if (type !== 'card' || !card) {
      return res.status(400).json({ error: 'Invalid payment method details' });
    }

    const stripeService = initStripeService(req);
    const paymentMethod = await stripeService.createPaymentMethod(type, card);
    const customerId = req.user.stripeCustomerId;  // Assuming this is stored with the user
    await stripeService.attachPaymentMethodToCustomer(paymentMethod.id, customerId);

    res.json({ paymentMethod });
  } catch (error) {
    logger.error('Error creating payment method:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentMethods = async (req, res) => {
  try {
    const customerId = req.user.stripeCustomerId;  // Assuming this is stored with the user
    const stripeService = initStripeService(req);
    const paymentMethods = await stripeService.listCustomerPaymentMethods(customerId);
    res.json({ paymentMethods });
  } catch (error) {
    logger.error('Error getting payment methods:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const { error } = validator.validateAmount(req.body.amount);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { amount } = req.body;
    const customerId = req.user.stripeCustomerId;  // Assuming this is stored with the user

    const stripeService = initStripeService(req);
    const paymentIntent = await stripeService.createPaymentIntent(amount, 'usd', customerId);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};