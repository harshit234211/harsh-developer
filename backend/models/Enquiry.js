const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  whatsapp: {
    type: String,
    trim: true,
    default: ''
  },
  service: {
    type: String,
    required: [true, 'Service is required']
  },
  budget: {
    type: String,
    default: 'Flexible'
  },
  projectType: {
    type: String,
    default: 'New Project'
  },
  deadline: {
    type: String,
    default: 'Flexible'
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  message: {
    type: String,
    default: ''
  },
  referenceUrl: {
    type: String,
    default: ''
  },
  techPreference: {
    type: String,
    default: ''
  },
  additionalRequirements: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: [
      'New', 'Contacted', 'In Progress', 'Completed', 'Cancelled',
      'NEW', 'REVIEWING', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'COMPLETED', 'CANCELLED'
    ],
    default: 'NEW'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', EnquirySchema);
