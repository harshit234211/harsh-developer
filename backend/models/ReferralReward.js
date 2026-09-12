const mongoose = require('mongoose');

const ReferralRewardSchema = new mongoose.Schema({
  referralId: { type: String, required: true },
  referrerId: { type: String, required: true, index: true },
  referredUserId: { type: String, required: true },
  orderId: { type: String, required: true, index: true },
  orderAmount: { type: Number, required: true },
  rewardPercent: { type: Number, default: 10 },
  rewardAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'paid'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('ReferralReward', ReferralRewardSchema);
