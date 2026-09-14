const mongoose = require('mongoose');

const FeatureRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['feature_request', 'product_suggestion', 'bug_report', 'service_request', 'feedback'],
    default: 'feature_request'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['New', 'Reviewing', 'Planned', 'In Development', 'Completed', 'Rejected'],
    default: 'New'
  },
  userName: {
    type: String,
    trim: true,
    default: ''
  },
  userEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  userId: {
    type: String,
    default: null
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FeatureRequest', FeatureRequestSchema);
