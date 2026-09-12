const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  referrerId: { type: String, required: true, index: true },
  referrerCode: { type: String, required: true, uppercase: true, index: true },
  referredUserId: y type: String, required: true, index: true },
  referredUserEmail: { type: String, required: true, lowercase: true },
  status: { type: String, enum: ['registered', 'converted'], default: 'registered' },
  orderId: { type: String, default: null },
  rewardPercent: { type: Number, default: 10 },
  rewardAmount: { type: Number, default: 0 },
  paid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Referral', ReferralSchema);
