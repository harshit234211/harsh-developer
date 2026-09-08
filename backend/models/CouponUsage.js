const mongoose = require('mongoose');

const couponUsageSchema = new mongoose.Schema({
  coupon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  code_mask: {
    type: String,
    required: true
  },
  discount_percentage: {
    type: Number,
    required: true
  },
  user_id: {
    type: String,
    default: null
  },
  user_email: {
    type: String,
    default: null,
    lowercase: true,
    trim: true
  },
  order_id: {
    type: String,
    required: true
  },
  original_amount: {
    type: Number,
    required: true
  },
  discount_amount: {
    type: Number,
    required: true
  },
  final_amount: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CouponUsage', couponUsageSchema);
