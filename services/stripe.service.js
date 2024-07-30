const stripePackage = require('stripe');
const config = require('../config');

class StripeService {
  constructor() {
    this.stripe = stripePackage(config.stripeSecretKey);
  }

  async createCustomer(email) {
    try {
      const customer = await this.stripe.customers.create({ email: email });
      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create Stripe customer: ' + error.message);
    }
  }

  async createPaymentIntent(amount, currency, customerId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        payment_method_types: ['card'],
      });
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent: ' + error.message);
    }
  }

  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });
      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw new Error('Failed to confirm payment: ' + error.message);
    }
  }

  async createPayout(amount, currency, destination) {
    try {
      const payout = await this.stripe.payouts.create({
        amount,
        currency,
        destination,
        method: 'instant', // or 'standard' for ACH transfers
      });
      return payout;
    } catch (error) {
      console.error('Error creating payout:', error);
      throw new Error('Failed to create payout: ' + error.message);
    }
  }

  async getBalance() {
    try {
      const balance = await this.stripe.balance.retrieve();
      return balance;
    } catch (error) {
      console.error('Error retrieving Stripe balance:', error);
      throw new Error('Failed to retrieve Stripe balance: ' + error.message);
    }
  }

  async createPaymentMethod(type, card) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type,
        card,
      });
      return paymentMethod;
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw new Error('Failed to create payment method: ' + error.message);
    }
  }

  async attachPaymentMethodToCustomer(paymentMethodId, customerId) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      return paymentMethod;
    } catch (error) {
      console.error('Error attaching payment method to customer:', error);
      throw new Error('Failed to attach payment method to customer: ' + error.message);
    }
  }

  async listCustomerPaymentMethods(customerId) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data;
    } catch (error) {
      console.error('Error listing customer payment methods:', error);
      throw new Error('Failed to list customer payment methods: ' + error.message);
    }
  }

  async createRefund(paymentIntentId, amount) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount,
      });
      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw new Error('Failed to create refund: ' + error.message);
    }
  }
}

module.exports = new StripeService();