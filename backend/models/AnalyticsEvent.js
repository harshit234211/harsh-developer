const mongoose = require('mongoose');

const AnalyticsEventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  path: {
    type: String,
    default: '/'
  },
  referrer: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  ip: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    default: null
  },
  userEmail: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
