const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const walletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  stripeCustomerId: {
    type: String,
    required: true
  }
}, { _id: false }); // Disable _id for subdocument

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  wallet: walletSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.checkPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;