const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const validator = require('../utils/validator');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
  try {
    const { error } = validator.validateUser(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, firstName, lastName } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    user = str({ email, password, firstName, lastName });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    logger.error('Error in user registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = validator.validateLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await user.checkPassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    logger.error('Error in user login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};