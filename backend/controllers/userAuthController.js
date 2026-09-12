const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/env');
const dbService = require('../utils/dbAdapter');
const logger = require('../utils/logger');

const generateToken = (id, rememberMe = false) => {
  return jwt.sign({ id, role: 'client' }, config.jwtSecret, {
    expiresIn: rememberMe ? '30d' : config.jwtExpiresIn
  });
};

const setSessionCookie = (res, token, rememberMe = false) => {
  const maxAge = (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000;
  res.cookie('devcraft_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge
  });
};

/**
 * 1. Register new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, company, password, confirmPassword, termsAgreed } = req.body;

    // Field validations
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide your full name (minimum 2 characters).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number (at least 7 digits).' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    if (!hasLetter || !hasDigit) {
      return res.status(400).json({ success: false, message: 'Password must contain both letters and numbers for account security.' });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match. Please re-enter your password confirmation.' });
    }

    if (termsAgreed === false) {
      return res.status(400).json({ success: false, message: 'You must agree to the Terms & Conditions to register.' });
    }

    // Duplicate email check
    const existingUser = await dbService.User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    // Referral Code handling (Requirement 9)
    let referrerUser = null;
    const rawRefCode = req.body.referralCode || req.body.ref;
    if (rawRefCode && typeof rawRefCode === 'string' && rawRefCode.trim().length > 0) {
      const cleanRefCode = rawRefCode.trim().toUpperCase();
      referrerUser = await dbService.User.findOne({ referralCode: cleanRefCode });
      if (!referrerUser) {
        return res.status(400).json({
          success: false,
          message: 'The referral code you entered is invalid. Please check the code or clear the field to proceed.'
        });
      }
      if (referrerUser.email.toLowerCase() === cleanEmail) {
        return res.status(400).json({
          success: false,
          message: 'Self-referral is not permitted. You cannot use your own referral code.'
        });
      }
    }

    // Hash password with bcrypt (never plaintext)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await dbService.User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      company: company ? company.trim() : '',
      password: hashedPassword,
      role: 'client',
      referredBy: referrerUser ? referrerUser.referralCode : null,
      savedDemos: [],
      lastLogin: new Date().toISOString()
    });

    // Record referral attribution in database
    if (referrerUser) {
      await dbService.Referral.create({
        referrerId: referrerUser._id,
        referrerCode: referrerUser.referralCode,
        referredUserId: user._id,
        referredUserEmail: user.email,
        status: 'registered'
      });
      logger.info(`[Referral Recorded] User ${user.email} registered using referral code ${referrerUser.referralCode} from ${referrerUser.email}`);
    }

    const token = generateToken(user._id, false);
    setSessionCookie(res, token, false);

    logger.success(`New client registered: ${user.name} (${user.email}) [Ref: ${user.referralCode}]`);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to DevCraft Studio.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        referralCode: user.referralCode,
        referralLink: `${config.publicSiteUrl}/register?ref=${user.referralCode}`,
        referredBy: user.referredBy || null,
        savedDemos: user.savedDemos || []
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await dbService.User.findOne({ email: cleanEmail });

    // Allow Harshit (Owner/Admin) to sign in to client portal with admin credentials
    if (!user) {
      const admin = await dbService.Admin.findOne({ email: cleanEmail });
      if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
          const token = generateToken(admin._id, Boolean(rememberMe));
          setSessionCookie(res, token, Boolean(rememberMe));
          logger.success(`Admin signed into client interface: ${admin.email}`);
          return res.status(200).json({
            success: true,
            message: 'Signed in successfully as Harshit (Studio Lead).',
            token,
            user: {
              id: admin._id,
              name: admin.name,
              email: admin.email,
              phone: config.developer.phone || '',
              company: 'DevCraft Studio (Admin)',
              savedDemos: []
            }
          });
        }
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials or create an account.'
      });
    }

    const userWithPassword = await dbService.User.findByIdWithPassword(user._id);
    const isMatch = await bcrypt.compare(password, (userWithPassword && userWithPassword.password) || user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your password.'
      });
    }

    // Update lastLogin
    await dbService.User.findByIdAndUpdate(user._id, {
      lastLogin: new Date().toISOString()
    });

    const token = generateToken(user._id, Boolean(rememberMe));
    setSessionCookie(res, token, Boolean(rememberMe));

    logger.success(`User signed in: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        company: user.company || '',
        referralCode: user.referralCode || 'DEV-STUDIO',
        referralLink: `${config.publicSiteUrl}/register?ref=${user.referralCode || 'DEV-STUDIO'}`,
        savedDemos: user.savedDemos || []
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. Logout user
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('devcraft_session', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 4. Forgot Password - Request Reset Token
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await dbService.User.findOne({ email: cleanEmail });

    let rawToken = null;

    if (user) {
      rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      await dbService.User.findByIdAndUpdate(user._id, {
        resetPasswordToken: tokenHash,
        resetPasswordExpires: expires
      });

      logger.info(`[Password Reset] Secure token created for ${cleanEmail}`);
    }

    // Generic response prevents account enumeration
    const responsePayload = {
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been generated.',
      emailServiceConfigured: Boolean(process.env.SMTP_HOST || process.env.SENDGRID_API_KEY)
    };

    // In local development/QA test mode, provide debug token so test suites can verify flow
    if (process.env.NODE_ENV !== 'production' && rawToken) {
      responsePayload.debugResetToken = rawToken;
      responsePayload.debugResetUrl = `/reset-password?token=${rawToken}`;
    }

    res.status(200).json(responsePayload);
  } catch (err) {
    next(err);
  }
};

/**
 * 5. Reset Password - Verify Token & Set New Password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Password reset token is required.' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasDigit = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasDigit) {
      return res.status(400).json({ success: false, message: 'New password must contain both letters and numbers.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password confirmation does not match.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const user = await dbService.User.findByResetToken(tokenHash);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired. Please request a new link.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Invalidate token and update password
    await dbService.User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    logger.success(`Password successfully reset for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset. You can now log in with your new credentials.'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 6. Get current logged-in user profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: 'User session not found.' });
    }

    const enquiries = await dbService.Enquiry.find({ email: user.email });

    res.status(200).json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        company: user.company || '',
        referralCode: user.referralCode || 'DEV-STUDIO',
        referralLink: `${config.publicSiteUrl}/register?ref=${user.referralCode || 'DEV-STUDIO'}`,
        savedDemos: user.savedDemos || [],
        role: user.role || 'client',
        createdAt: user.createdAt
      },
      stats: {
        totalEnquiries: enquiries.length,
        activeEnquiries: enquiries.filter(e => e.status !== 'Completed' && e.status !== 'Cancelled').length,
        completedEnquiries: enquiries.filter(e => e.status === 'Completed').length,
        savedDemosCount: (user.savedDemos || []).length
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 7. Update User Profile (Name, Phone, Company)
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, company } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Full name must be at least 2 characters.' });
    }

    const updated = await dbService.User.findByIdAndUpdate(req.user._id, {
      name: name.trim(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : ''
    });

    logger.info(`Profile updated for user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        company: updated.company,
        savedDemos: updated.savedDemos || []
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 8. Change Password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters with letters and numbers.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirmation do not match.' });
    }

    const userWithPassword = await dbService.User.findByIdWithPassword(req.user._id);
    if (!userWithPassword) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await dbService.User.findByIdAndUpdate(req.user._id, {
      password: hashedPassword
    });

    logger.success(`Password changed by user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 9. Toggle Saved Demo Bookmark
 */
const toggleSavedDemo = async (req, res, next) => {
  try {
    const { demoId } = req.body;
    if (!demoId) {
      return res.status(400).json({ success: false, message: 'Demo ID is required.' });
    }

    const user = await dbService.User.findById(req.user._id);
    let demos = Array.isArray(user.savedDemos) ? [...user.savedDemos] : [];

    const index = demos.indexOf(demoId);
    if (index > -1) {
      demos.splice(index, 1);
    } else {
      demos.push(demoId);
    }

    await dbService.User.findByIdAndUpdate(req.user._id, { savedDemos: demos });

    res.status(200).json({
      success: true,
      savedDemos: demos,
      isSaved: index === -1
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 10. Get User's own project requests (Strict Isolation)
 */
const getMyEnquiries = async (req, res, next) => {
  try {
    // Isolated: only returns records belonging to this user's email
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

/**
 * 11. Get User Referral Stats & Performance (Requirements 8, 9, 10)
 */
const getReferralStats = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized session.' });
    }

    const referrals = await dbService.Referral.find({ referrerId: user._id });
    const siteSettings = await dbService.SiteSetting.get();
    const rewardPercent = Number(siteSettings.referralRewardPercent) || 10;

    const totalReferrals = referrals.length;
    const successfulReferrals = referrals.filter(r => r.status === 'converted').length;
    const totalRewards = referrals.reduce((acc, r) => acc + (Number(r.rewardAmount) || 0), 0);
    const pendingRewards = referrals.filter(r => r.status === 'converted' && !r.paid).reduce((acc, r) => acc + (Number(r.rewardAmount) || 0), 0);
    const paidRewards = referrals.filter(r => r.paid).reduce((acc, r) => acc + (Number(r.rewardAmount) || 0), 0);

    const maskedReferrals = referrals.map(r => {
      const parts = (r.referredUserEmail || '').split('@');
      const maskedEmail = parts[0].length > 2 
        ? parts[0].substring(0, 2) + '***@' + (parts[1] || '') 
        : '***@' + (parts[1] || '');
      return {
        id: r._id,
        referredUserEmail: maskedEmail,
        status: r.status,
        orderId: r.orderId,
        rewardPercent: r.rewardPercent,
        rewardAmount: r.rewardAmount,
        paid: r.paid,
        createdAt: r.createdAt
      };
    });

    res.status(200).json({
      success: true,
      referralCode: user.referralCode || 'DEV-STUDIO',
      referralLink: `${config.publicSiteUrl}/register?ref=${user.referralCode || 'DEV-STUDIO'}`,
      rewardPercent,
      stats: {
        totalReferrals,
        successfulReferrals,
        totalRewards,
        pendingRewards,
        paidRewards
      },
      referrals: maskedReferrals
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  toggleSavedDemo,
  getMyEnquiries,
  getReferralStats
};
