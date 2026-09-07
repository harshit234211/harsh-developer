const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('../config/env');
const logger = require('./logger');

const DB_DIR = path.join(__dirname, '../../database');
const DB_FILE = path.join(DB_DIR, 'store.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// In-memory cache synced with file
let localDb = {
  admins: [],
  users: [],
  projects: [],
  enquiries: []
};

const loadLocalDb = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8').replace(/^\uFEFF/, '');
      localDb = JSON.parse(data);
      if (!localDb.users) localDb.users = [];
      if (!localDb.admins) localDb.admins = [];
      if (!localDb.projects) localDb.projects = [];
      if (!localDb.enquiries) localDb.enquiries = [];
    } else {
      saveLocalDb();
    }
  } catch (err) {
    logger.error('Failed to load local DB file, initializing empty', err);
    saveLocalDb();
  }
};

const saveLocalDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2), 'utf8');
  } catch (err) {
    logger.error('Failed to write local DB file', err);
  }
};

loadLocalDb();

const isMongoActive = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// Initial Projects Seed Data
const initialProjects = [
  {
    name: 'NeuralCraft AI Studio',
    description: 'Full-stack AI prompt-to-app generator with real-time streaming, AST code generation, and interactive preview sandbox.',
    category: 'AI Solutions',
    technologies: ['React', 'Node.js', 'Express', 'OpenAI API', 'Tailwind CSS', 'WebSockets'],
    image: '/assets/images/project-ai.svg',
    liveDemoUrl: 'https://harshdeveloper.com/demo/neuralcraft',
    githubUrl: 'Coming Soon',
    status: 'Showcase Demo',
    featured: true,
    isPublished: true
  },
  {
    name: 'Aetheria 3D E-Commerce Platform',
    description: 'Immersive WebGL 3D product visualizer and luxury goods boutique with headless checkout and instant inventory sync.',
    category: 'E-Commerce',
    technologies: ['Three.js', 'WebGL', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
    image: '/assets/images/project-ecommerce.svg',
    liveDemoUrl: 'https://harshdeveloper.com/demo/aetheria',
    githubUrl: 'Coming Soon',
    status: 'Showcase Demo',
    featured: true,
    isPublished: true
  },
  {
    name: 'PulseFlow SaaS Operations Dashboard',
    description: 'High-throughput real-time telemetry and server analytics dashboard with dark glassmorphic UI, charts, and alert triggers.',
    category: 'Admin Dashboards',
    technologies: ['JavaScript', 'Chart.js', 'Node.js', 'JWT Auth', 'REST API', 'CSS Grid'],
    image: '/assets/images/project-dashboard.svg',
    liveDemoUrl: 'https://harshdeveloper.com/demo/pulseflow',
    githubUrl: 'Coming Soon',
    status: 'Showcase Demo',
    featured: true,
    isPublished: true
  },
  {
    name: 'Titan Fitness Android & Web Companion',
    description: 'Cross-platform progressive fitness tracker with automated workout logs, macro analytics, and offline syncing.',
    category: 'Android Applications',
    technologies: ['Android', 'React Native', 'Node.js', 'Express', 'JWT', 'REST API'],
    image: '/assets/images/project-mobile.svg',
    liveDemoUrl: 'https://harshdeveloper.com/demo/titanfit',
    githubUrl: 'Coming Soon',
    status: 'Showcase Demo',
    featured: false,
    isPublished: true
  },
  {
    name: 'Apex Modern Agency Website',
    description: 'Ultra-fast responsive branding and service platform with interactive cursor physics, micro-interactions, and SEO architecture.',
    category: 'Websites',
    technologies: ['HTML5', 'CSS3', 'Modern JS', 'Three.js Particles', 'Express'],
    image: '/assets/images/project-web.svg',
    liveDemoUrl: 'https://harshdeveloper.com/demo/apex-agency',
    githubUrl: 'Coming Soon',
    status: 'Showcase Demo',
    featured: false,
    isPublished: true
  },
  {
    name: 'OmniCloud Microservices API Gateway',
    description: 'Production-ready Node.js REST API ecosystem with JWT authentication, Redis rate-limiting, and automated documentation.',
    category: 'Web Applications',
    technologies: ['Node.js', 'Express.js', 'REST API', 'JWT', 'MongoDB', 'Docker'],
    image: '/assets/images/project-api.svg',
    liveDemoUrl: 'https://harshdeveloper.com/demo/omnicloud',
    githubUrl: 'Coming Soon',
    status: 'Showcase Demo',
    featured: false,
    isPublished: true
  }
];

const seedInitialData = async () => {
  try {
    const defaultPasswordHash = await bcrypt.hash(config.adminPassword, 10);
    const targetEmail = config.adminEmail.toLowerCase();

    if (isMongoActive()) {
      const Admin = require('../models/Admin');
      const Project = require('../models/Project');

      // Update or create Harshit's admin
      let admin = await Admin.findOne({ email: targetEmail });
      if (!admin) {
        // Delete any legacy demo admin
        await Admin.deleteMany({ email: { $ne: targetEmail } });
        await Admin.create({
          name: 'Harshit (Harsh Developer)',
          email: targetEmail,
          password: defaultPasswordHash,
          role: 'superadmin'
        });
        logger.success(`Seeded Harshit admin (${targetEmail}) to MongoDB`);
      } else {
        admin.password = defaultPasswordHash;
        await admin.save();
      }

      const projectCount = await Project.countDocuments();
      if (projectCount === 0) {
        await Project.insertMany(initialProjects);
        logger.success('Seeded initial projects to MongoDB');
      }

      // Also ensure Harshit client account exists in MongoDB
      try {
        const User = require('../models/User');
        let user = await User.findOne({ email: targetEmail });
        if (!user) {
          await User.create({
            name: 'Harshit',
            email: targetEmail,
            phone: '+918791984082',
            company: 'Harsh Developer',
            password: defaultPasswordHash,
            role: 'client'
          });
          logger.success(`Seeded Harshit client account (${targetEmail}) to MongoDB`);
        } else {
          user.password = defaultPasswordHash;
          await user.save();
        }
      } catch (userErr) {
        logger.warn('User seed note:', userErr.message);
      }
    } else {
      loadLocalDb();
      // Ensure Harshit's admin is set and any old demo admin is removed
      localDb.admins = [{
        _id: crypto.randomUUID(),
        name: 'Harshit (Harsh Developer)',
        email: targetEmail,
        password: defaultPasswordHash,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
      logger.success(`Configured Harshit admin (${targetEmail}) in document store`);

      // Ensure Harshit also exists as client user in local document store
      if (!localDb.users) localDb.users = [];
      const userIdx = localDb.users.findIndex(u => u.email === targetEmail);
      if (userIdx === -1) {
        localDb.users.push({
          _id: crypto.randomUUID(),
          name: 'Harshit',
          email: targetEmail,
          phone: '+918791984082',
          company: 'Harsh Developer',
          password: defaultPasswordHash,
          role: 'client',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        logger.success(`Configured Harshit client account (${targetEmail}) in document store`);
      } else {
        localDb.users[userIdx].password = defaultPasswordHash;
      }
      saveLocalDb();

      if (!localDb.projects || localDb.projects.length === 0) {
        localDb.projects = initialProjects.map(p => ({
          _id: crypto.randomUUID(),
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        logger.success('Seeded initial showcase projects to local document store');
      }

      saveLocalDb();
    }
  } catch (err) {
    logger.error('Error during data seeding', err);
  }
};

// Database Service Abstraction
const dbService = {
  getEngine: () => isMongoActive() ? 'MongoDB (Connected)' : 'Embedded Document Store (Local Fallback)',

  seed: seedInitialData,

  Admin: {
    findOne: async (query) => {
      if (isMongoActive()) {
        const Admin = require('../models/Admin');
        return await Admin.findOne(query);
      }
      loadLocalDb();
      const admin = localDb.admins.find(a => {
        if (query.email && a.email.toLowerCase() !== query.email.toLowerCase()) return false;
        return true;
      });
      return admin || null;
    },
    findById: async (id) => {
      if (isMongoActive()) {
        const Admin = require('../models/Admin');
        return await Admin.findById(id).select('-password');
      }
      loadLocalDb();
      const admin = localDb.admins.find(a => a._id === id);
      if (!admin) return null;
      const { password, ...safeAdmin } = admin;
      return safeAdmin;
    }
  },

  User: {
    findOne: async (query) => {
      if (isMongoActive()) {
        const User = require('../models/User');
        return await User.findOne(query);
      }
      loadLocalDb();
      const user = localDb.users.find(u => {
        if (query.email && u.email.toLowerCase() !== query.email.toLowerCase()) return false;
        return true;
      });
      return user || null;
    },
    findById: async (id) => {
      if (isMongoActive()) {
        const User = require('../models/User');
        return await User.findById(id).select('-password');
      }
      loadLocalDb();
      const user = localDb.users.find(u => u._id === id);
      if (!user) return null;
      const { password, ...safeUser } = user;
      return safeUser;
    },
    create: async (data) => {
      if (isMongoActive()) {
        const User = require('../models/User');
        return await User.create(data);
      }
      loadLocalDb();
      const newUser = {
        _id: crypto.randomUUID(),
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone || '',
        company: data.company || '',
        password: data.password, // already hashed
        role: 'client',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localDb.users.push(newUser);
      saveLocalDb();
      return newUser;
    },
    find: async (filter = {}) => {
      if (isMongoActive()) {
        const User = require('../models/User');
        return await User.find(filter).select('-password').sort({ createdAt: -1 });
      }
      loadLocalDb();
      return localDb.users.map(({ password, ...safe }) => safe).reverse();
    },
    countDocuments: async (filter = {}) => {
      if (isMongoActive()) {
        const User = require('../models/User');
        return await User.countDocuments(filter);
      }
      loadLocalDb();
      return localDb.users.length;
    }
  },

  Project: {
    find: async (filter = {}) => {
      if (isMongoActive()) {
        const Project = require('../models/Project');
        return await Project.find(filter).sort({ createdAt: -1 });
      }
      loadLocalDb();
      let results = [...localDb.projects];
      if (filter.category && filter.category !== 'All') {
        results = results.filter(p => p.category === filter.category);
      }
      if (filter.isPublished !== undefined) {
        results = results.filter(p => p.isPublished === filter.isPublished);
      }
      return results.reverse();
    },
    findById: async (id) => {
      if (isMongoActive()) {
        const Project = require('../models/Project');
        return await Project.findById(id);
      }
      loadLocalDb();
      return localDb.projects.find(p => p._id === id) || null;
    },
    create: async (data) => {
      if (isMongoActive()) {
        const Project = require('../models/Project');
        return await Project.create(data);
      }
      loadLocalDb();
      const newProject = {
        _id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        category: data.category,
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        image: data.image || '/assets/images/project-placeholder.svg',
        liveDemoUrl: data.liveDemoUrl || '',
        githubUrl: data.githubUrl || 'Coming Soon',
        status: data.status || 'Showcase Demo',
        featured: Boolean(data.featured),
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localDb.projects.push(newProject);
      saveLocalDb();
      return newProject;
    },
    findByIdAndUpdate: async (id, updateData) => {
      if (isMongoActive()) {
        const Project = require('../models/Project');
        return await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      }
      loadLocalDb();
      const idx = localDb.projects.findIndex(p => p._id === id);
      if (idx === -1) return null;
      localDb.projects[idx] = {
        ...localDb.projects[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      saveLocalDb();
      return localDb.projects[idx];
    },
    findByIdAndDelete: async (id) => {
      if (isMongoActive()) {
        const Project = require('../models/Project');
        return await Project.findByIdAndDelete(id);
      }
      loadLocalDb();
      const idx = localDb.projects.findIndex(p => p._id === id);
      if (idx === -1) return null;
      const removed = localDb.projects.splice(idx, 1)[0];
      saveLocalDb();
      return removed;
    },
    countDocuments: async (filter = {}) => {
      if (isMongoActive()) {
        const Project = require('../models/Project');
        return await Project.countDocuments(filter);
      }
      loadLocalDb();
      return localDb.projects.length;
    }
  },

  Enquiry: {
    find: async (filter = {}) => {
      if (isMongoActive()) {
        const Enquiry = require('../models/Enquiry');
        let q = {};
        if (filter.status && filter.status !== 'All') q.status = filter.status;
        if (filter.email) q.email = filter.email.toLowerCase();
        return await Enquiry.find(q).sort({ createdAt: -1 });
      }
      loadLocalDb();
      let results = [...localDb.enquiries];
      if (filter.status && filter.status !== 'All') {
        results = results.filter(e => e.status === filter.status);
      }
      if (filter.email) {
        const emailLower = filter.email.toLowerCase();
        results = results.filter(e => e.email && e.email.toLowerCase() === emailLower);
      }
      if (filter.search) {
        const s = filter.search.toLowerCase();
        results = results.filter(e => 
          (e.name && e.name.toLowerCase().includes(s)) ||
          (e.email && e.email.toLowerCase().includes(s)) ||
          (e.phone && e.phone.includes(s)) ||
          (e.service && e.service.toLowerCase().includes(s))
        );
      }
      return results.reverse();
    },
    findById: async (id) => {
      if (isMongoActive()) {
        const Enquiry = require('../models/Enquiry');
        return await Enquiry.findById(id);
      }
      loadLocalDb();
      return localDb.enquiries.find(e => e._id === id) || null;
    },
    create: async (data) => {
      if (isMongoActive()) {
        const Enquiry = require('../models/Enquiry');
        return await Enquiry.create(data);
      }
      loadLocalDb();
      const newEnquiry = {
        _id: crypto.randomUUID(),
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        whatsapp: data.whatsapp || data.phone,
        service: data.service,
        budget: data.budget || 'Flexible',
        projectType: data.projectType || 'New Project',
        deadline: data.deadline || 'Flexible',
        description: data.description,
        message: data.message || '',
        referenceUrl: data.referenceUrl || '',
        userId: data.userId || null,
        status: 'New',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localDb.enquiries.push(newEnquiry);
      saveLocalDb();
      return newEnquiry;
    },
    findByIdAndUpdate: async (id, updateData) => {
      if (isMongoActive()) {
        const Enquiry = require('../models/Enquiry');
        return await Enquiry.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      }
      loadLocalDb();
      const idx = localDb.enquiries.findIndex(e => e._id === id);
      if (idx === -1) return null;
      localDb.enquiries[idx] = {
        ...localDb.enquiries[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      saveLocalDb();
      return localDb.enquiries[idx];
    },
    findByIdAndDelete: async (id) => {
      if (isMongoActive()) {
        const Enquiry = require('../models/Enquiry');
        return await Enquiry.findByIdAndDelete(id);
      }
      loadLocalDb();
      const idx = localDb.enquiries.findIndex(e => e._id === id);
      if (idx === -1) return null;
      const removed = localDb.enquiries.splice(idx, 1)[0];
      saveLocalDb();
      return removed;
    },
    countDocuments: async (filter = {}) => {
      if (isMongoActive()) {
        const Enquiry = require('../models/Enquiry');
        return await Enquiry.countDocuments(filter);
      }
      loadLocalDb();
      if (!filter || Object.keys(filter).length === 0) {
        return localDb.enquiries.length;
      }
      return localDb.enquiries.filter(e => {
        for (const [k, v] of Object.entries(filter)) {
          if (e[k] !== v) return false;
        }
        return true;
      }).length;
    }
  }
};

module.exports = dbService;
