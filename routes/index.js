const express = require('express');
const authRoutes = require('./auth.routes');
const walletRoutes = require('./wallet.routes');
const stripeRoutes = require('./stripe.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/wallet', walletRoutes);
router.use('/stripe', stripeRoutes);

module.exports = router;