const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/env');
const dbService = require('../utils/dbAdapter');
const logger = require('../utils/logger');

const generateToken = (id) => {
  return jwt.sign({ id, role: 'client' }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, phone, company, password } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide your full name (minimum 2 characters).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await dbService.User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists. Please sign in instead.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await dbService.User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      password: hashedPassword
    });

    const token = generateToken(user._id);

    logger.success(`New client registered: ${user.name} (${user.email})`);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to Harsh Developer Client Portal.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await dbService.User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    logger.success(`Client logged in: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company
      }
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await dbService.User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

const getMyEnquiries = async (req, res, next) => {
  try {
    const enquiries = await dbService.Enquiry.find({ email: req.user.email });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
      enquiries: enquiries
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  getMyEnquiries
};
