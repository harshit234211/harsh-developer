const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'harsh_developer_fallback_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  couponPepper: process.env.COUPON_SECRET_PEPPER || 'devcraft_secure_coupon_pepper_hash_salt_2026_x89a',
  adminEmail: process.env.ADMIN_EMAIL || 'shakyaharshit683@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'harsshit9696',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  publicSiteUrl: process.env.PUBLIC_SITE_URL || 'https://kiromage.shop',
  tranzUpi: {
    apiKey: process.env.TRANZ_UPI_API_KEY || '',
    merchantId: process.env.TRANZ_UPI_MERCHANT_ID || 'DEVCRAFT_MERCHANT',
    secret: process.env.TRANZ_UPI_SECRET || '',
    baseUrl: process.env.TRANZ_UPI_BASE_URL || 'https://api.tranzupi.com',
    merchantVpa: process.env.TRANZ_UPI_VPA || 'devcraft@upi'
  },
  developer: {
    name: 'Harshit',
    brand: 'DEVCRAFT Studio',
    tagline: 'Ideas → Code → Real Solutions',
    role: 'Lead Software Architect',
    email: process.env.DEVELOPER_EMAIL || 'shakyaharshit683@gmail.com',
    whatsapp: process.env.DEVELOPER_WHATSAPP || '+918791984082',
    phone: process.env.DEVELOPER_PHONE || '+917017022966',
    instagram: process.env.DEVELOPER_INSTAGRAM || 'https://www.instagram.com/kiro_mage/',
    telegram: process.env.DEVELOPER_TELEGRAM || 'https://t.me/harshuuu1123',
    github: 'https://github.com/harshit234211/harsh-developer'
  }
};

module.exports = config;
