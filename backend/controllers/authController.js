const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/env');
const dbService = require('../utils/dbAdapter');
const logger = require('../utils/logger');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await dbService.Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      logger.warn(`Failed login attempt for unknown email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      logger.warn(`Failed login attempt (wrong password) for: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(admin._id);

    logger.success(`Admin logged in successfully: ${admin.email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

const getMe = async (req, res, next) => {
  try {
    const admin = await dbService.Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      dbEngine: dbService.getEngine()
    });
  } catch (err) {
    next(err);
  }
};

const getClients = async (req, res, next) => {
  try {
    const clients = await dbService.User.find();
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
      clients: clients
    });
  } catch (err) {
    next(err);
  }
};

const getAdminReferrals = async (req, res, next) => {
  try {
    const referrals = await dbService.Referral.find({});
    const totalReferrals = referrals.length;
    const converted = referrals.filter(r => r.status === 'converted').length;
    const totalRewards = referrals.reduce((sum, r) => sum + (Number(r.rewardAmount) || 0), 0);

    res.status(200).json({
      success: true,
      count: referrals.length,
      stats: { totalReferrals, converted, totalRewards },
      referrals
    });
  } catch (err) {
    next(err);
  }
};

const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await dbService.SiteSetting.get();
    res.status(200).json({
      success: true,
      settings
    });
  } catch (err) {
    next(err);
  }
};

const updateAdminSettings = async (req, res, next) => {
  try {
    const { referralRewardPercent, minPayout } = req.body;
    const updates = {};
    if (referralRewardPercent !== undefined) updates.referralRewardPercent = Number(referralRewardPercent);
    if (minPayout !== undefined) updates.minPayout = Number(minPayout);

    const updated = await dbService.SiteSetting.update(updates);
    logger.info(`[Admin] Site settings updated: ${JSON.stringify(updates)}`);

    res.status(200).json({
      success: true,
      message: 'Site settings updated successfully.',
      settings: updated
    });
  } catch (err) {
    next(err);
  }
};

const getAdminActivityLogs = async (req, res, next) => {
  try {
    const logs = await dbService.ActivityLog.find({});
    res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  logout,
  getMe,
  getClients,
  getAdminReferrals,
  getAdminSettings,
  updateAdminSettings,
  getAdminActivityLogs
};
