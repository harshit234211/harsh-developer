const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Websites', 'Web Applications', 'Android Applications', 'AI Solutions', 'E-Commerce', 'Admin Dashboards', 'Custom Software']
  },
  technologies: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    default: '/assets/images/project-placeholder.svg'
  },
  liveDemoUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: 'Coming Soon'
  },
  status: {
    type: String,
    enum: ['Live', 'In Development', 'Completed', 'Showcase Demo'],
    default: 'Showcase Demo'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
