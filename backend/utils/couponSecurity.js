const crypto = require('crypto');
const config = require('../config/env');

const CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Generate a cryptographically secure, random coupon code
 * Format: DEV-XXXX-XXXX-XXXX
 */
function generateCouponCode() {
  const getChunk = (len) => {
    const bytes = crypto.randomBytes(len * 2);
    let chunk = '';
    for (let i = 0; i < bytes.length && chunk.length < len; i++) {
      chunk += CHARSET[bytes[i] % CHARSET.length];
    }
    return chunk;
  };
  return `DEV-${getChunk(4)}-${getChunk(4)}-${getChunk(4)}`;
}

/**
 * HMAC-SHA256 Hash of coupon code using server-side pepper
 */
function hashCouponCode(rawCode) {
  if (!rawCode || typeof rawCode !== 'string') return '';
  const normalized = rawCode.trim().toUpperCase();
  return crypto.createHmac('sha256', config.couponPepper).update(normalized).digest('hex');
}

/**
 * Mask raw coupon code for safe display in logs or UI
 * e.g. DEV-9K7X-W2MR-8YNP -> DEV-****-****-8YNP
 */
function maskCouponCode(rawCode) {
  if (!rawCode || typeof rawCode !== 'string') return 'DEV-****-****-****';
  const parts = rawCode.trim().toUpperCase().split('-');
  if (parts.length === 4) {
    return `DEV-****-****-${parts[3]}`;
  }
  return 'DEV-****-****-****';
}

/**
 * Validate format
 */
function isCouponCodeValidFormat(rawCode) {
  if (!rawCode || typeof rawCode !== 'string') return false;
  const regex = /^DEV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
  return regex.test(rawCode.trim());
}

/**
 * In-memory brute force & rate limit tracking per client IP / email
 * Max 5 failed attempts within 15 minutes window
 */
const failedAttemptsMap = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

function cleanupOldAttempts() {
  const now = Date.now();
  for (const [key, record] of failedAttemptsMap.entries()) {
    if (now - record.firstAttempt > WINDOW_MS) {
      failedAttemptsMap.delete(key);
    }
  }
}
setInterval(cleanupOldAttempts, 5 * 60 * 1000);

function getAttemptKey(req, customEmail) {
  const ip = req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || '127.0.0.1';
  const email = customEmail || (req.user && req.user.email) || '';
  return `${ip.toString().trim()}::${email.toLowerCase().trim()}`;
}

function isBruteForced(key) {
  const now = Date.now();
  const record = failedAttemptsMap.get(key);
  if (!record) return false;
  if (now - record.firstAttempt > WINDOW_MS) {
    failedAttemptsMap.delete(key);
    return false;
  }
  return record.count >= MAX_FAILED_ATTEMPTS;
}

function recordFailedAttempt(key) {
  const now = Date.now();
  const record = failedAttemptsMap.get(key);
  if (!record || now - record.firstAttempt > WINDOW_MS) {
    failedAttemptsMap.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
  } else {
    record.count += 1;
    record.lastAttempt = now;
  }
}

function resetFailedAttempts(key) {
  failedAttemptsMap.delete(key);
}

function getCooldownSeconds(key) {
  const record = failedAttemptsMap.get(key);
  if (!record) return 0;
  const elapsed = Date.now() - record.firstAttempt;
  return Math.max(0, Math.ceil((WINDOW_MS - elapsed) / 1000));
}

module.exports = {
  generateCouponCode,
  hashCouponCode,
  maskCouponCode,
  isCouponCodeValidFormat,
  getAttemptKey,
  isBruteForced,
  recordFailedAttempt,
  resetFailedAttempts,
  getCooldownSeconds,
  MAX_FAILED_ATTEMPTS,
  WINDOW_MS
};
