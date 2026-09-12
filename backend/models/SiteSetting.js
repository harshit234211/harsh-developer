const mongoose = require('mongoose');

const SiteSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  referralRewardPercent: { type: Number, default: 10 },
  minPayout: { type: Number, default: 500 },
  siteName: { type: String, default: 'DevCraft' },
  tagline: { type: String, default: 'Ideas → Code → Real Solutions' }
}, { timestamps: true });

module.exports = mongoose.model('SiteSetting', SiteSettingSchema);
