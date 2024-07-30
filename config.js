require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY
};
