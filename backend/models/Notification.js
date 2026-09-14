const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'new_user',
      'new_order',
      'payment_success',
      'payment_failed',
      'project_request',
      'feature_request',
      'bug_report',
      'referral_conversion',
      'download_accessed',
      'system_alert'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);
