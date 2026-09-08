const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code_hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  code_mask: {
    type: String,
    required: true
  },
  discount_percentage: {
    type: Number,
    required: true,
    enum: [20, 50, 95]
  },
  active: {
    type: Boolean,
    default: true
  },
  expires_at: {
    type: Date,
    default: null
  },
  max_uses: {
    type: Number,
    default: 1
  },
  used_count: {
    type: Number,
    default: 0
  },
  user_restriction: {
    type: String,
    default: null,
    lowercase: true,
    trim: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);