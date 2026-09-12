const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('../config/env');
const logger = require('./logger');
const couponSecurity = require('./couponSecurity');

const DB_DIR = path.join(__dirname, '../../database');
const DB_FILE = path.join(DB_DIR, 'store.json');
const PRIVATE_COUPONS_FILE = path.join(DB_DIR, '.devcraft_private_coupons.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// In-memory cache synced with file
let localDb = {
  admins: [],
  users: [],
  projects: [],
  enquiries: [],
  coupons: [],
  couponUsages: [],
  orders: [],
  payments: [],
  paymentTransactions: [],
  savedProducts: [],
  activityLogs: [],
  shareEvents: [],
  products: [],
  productFiles: [],
  discountRules: { appDefaultDiscount: 50, aptitudeDefaultDiscount: 30 },
  downloads: []
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
      if (!localDb.coupons) localDb.coupons = [];
      if (!localDb.couponUsages) localDb.couponUsages = [];
      if (!localDb.orders) localDb.orders = [];
      if (!localDb.payments) localDb.payments = [];
      if (!localDb.paymentTransactions) localDb.paymentTransactions = [];
      if (!localDb.savedProducts) localDb.savedProducts = [];
      if (!localDb.activityLogs) localDb.activityLogs = [];
      if (!localDb.shareEvents) localDb.shareEvents = [];
      if (!localDb.products) localDb.products = [];
      if (!localDb.productFiles) localDb.productFiles = [];
      if (!localDb.discountRules) localDb.discountRules = { appDefaultDiscount: 50, aptitudeDefaultDiscount: 30 };
      if (!localDb.downloads) localDb.downloads = [];
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

const ensureProductsSeeded = () => {
  loadLocalDb();
  try {
    const { DEVCRAFT_PRODUCTS } = require('../../scripts/data_products');
    if (!localDb.products || localDb.products.length === 0) {
      localDb.products = DEVCRAFT_PRODUCTS.map(p => ({
        _id: crypto.randomUUID(),
        ...p,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      saveLocalDb();
    } else {
      let modified = false;
      DEVCRAFT_PRODUCTS.forEach(p => {
        const idx = localDb.products.findIndex(existing => existing.id === p.id);
        if (idx !== -1) {
          const ep = localDb.products[idx];
          if (ep.name !== p.name || ep.originalPrice !== p.originalPrice || ep.badge !== p.badge || ep.shortDesc !== p.shortDesc) {
            localDb.products[idx] = {
              ...ep,
              name: p.name,
              originalPrice: p.originalPrice,
              badge: p.badge,
              shortDesc: p.shortDesc,
              detailedDesc: p.detailedDesc,
              fileDetails: p.fileDetails,
              features: p.features,
              requirements: p.requirements,
              updatedAt: new Date().toISOString()
            };
            modified = true;
          }
        } else {
          localDb.products.push({
            _id: crypto.randomUUID(),
            ...p,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          modified = true;
        }
      });
      if (modified) saveLocalDb();
    }
  } catch (e) {
    logger.error('Error seeding products:', e);
  }
};

const ensureProductFilesSeeded = () => {
  loadLocalDb();
  const requiredFiles = [
    {
      productId: 'joya-ai',
      filename: 'joya-ai-source-code-v2.4.0.zip',
      originalName: 'joya-ai-source-code-v2.4.0.zip',
      fileSize: '12.4 MB',
      mimeType: 'application/zip',
      version: 'v2.4.0',
      platform: 'Android Studio / Kotlin',
      changelog: 'Complete Android Studio project source code with wake word and WhatsApp automation.',
      filePath: 'uploads/products/joya-ai-source-code-v2.4.0.zip',
      isSourcePackage: true
    },
    {
      productId: 'joya-ai',
      filename: 'joya-ai-v2.4.0.apk',
      originalName: 'joya-ai-v2.4.0.apk',
      fileSize: '48.2 MB',
      mimeType: 'application/vnd.android.package-archive',
      version: 'v2.4.0',
      platform: 'Android',
      changelog: 'Enhanced offline wake-word acoustic model; battery drain reduced by 35%.',
      filePath: 'uploads/products/joya-ai-v2.4.0.apk'
    },
    {
      productId: 'jarvis-ai',
      filename: 'jarvis-ai-source-code-v3.1.2.zip',
      originalName: 'jarvis-ai-source-code-v3.1.2.zip',
      fileSize: '18.6 MB',
      mimeType: 'application/zip',
      version: 'v3.1.2',
      platform: 'Windows / PC (Electron / Python)',
      changelog: 'Complete PC desktop project source code with voice listener, web scraper, and Ollama bridge.',
      filePath: 'uploads/products/jarvis-ai-source-code-v3.1.2.zip',
      isSourcePackage: true
    },
    {
      productId: 'jarvis-ai',
      filename: 'jarvis-ai-desktop-v3.1.2.exe',
      originalName: 'jarvis-ai-desktop-v3.1.2.exe',
      fileSize: '118.5 MB',
      mimeType: 'application/octet-stream',
      version: 'v3.1.2',
      platform: 'Windows / PC',
      changelog: 'Direct Ollama local model bridge; native Windows 11 Fluent dark glass UI.',
      filePath: 'uploads/products/jarvis-ai-desktop-v3.1.2.exe'
    },
    {
      productId: 'cravex-app',
      filename: 'cravex-mobile-suite-v4.2.0.zip',
      originalName: 'cravex-mobile-suite-v4.2.0.zip',
      fileSize: '64.8 MB',
      mimeType: 'application/zip',
      version: 'v4.2.0',
      platform: 'Android & iOS',
      changelog: 'Production ready React Native suite with GPS delivery tracking.',
      filePath: 'uploads/products/cravex-mobile-suite-v4.2.0.zip'
    },
    {
      productId: 'aptitude-mastery',
      filename: 'aptitude-mastery-syllabus-bundle.pdf',
      originalName: 'aptitude-mastery-syllabus-bundle.pdf',
      fileSize: '18.4 MB',
      mimeType: 'application/pdf',
      version: '2026 Edition',
      platform: 'Universal PDF',
      changelog: 'Placement training syllabus bundle with FAANG preparation roadmap.',
      filePath: 'uploads/products/aptitude-mastery-syllabus-bundle.pdf'
    }
  ];

  if (!localDb.productFiles || localDb.productFiles.length === 0) {
    localDb.productFiles = requiredFiles.map(f => ({
      _id: crypto.randomUUID(),
      ...f,
      uploadedAt: new Date().toISOString()
    }));
    saveLocalDb();
  } else {
    let changed = false;
    requiredFiles.forEach(rf => {
      const idx = localDb.productFiles.findIndex(f => f.filename === rf.filename);
      if (idx === -1) {
        localDb.productFiles.push({
          _id: crypto.randomUUID(),
          ...rf,
          uploadedAt: new Date().toISOString()
        });
        changed = true;
      } else {
        if (rf.isSourcePackage && !localDb.productFiles[idx].isSourcePackage) {
          localDb.productFiles[idx].isSourcePackage = true;
          changed = true;
        }
      }
    });
    if (changed) saveLocalDb();
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

    // Seed Initial 3 Private Coupon Offers (Hashed & Non-public)
    await seedPrivateCoupons();
  } catch (err) {
    logger.error('Error during data seeding', err);
  }
};

const seedPrivateCoupons = async () => {
  try {
    let privateSeeds = [];
    if (fs.existsSync(PRIVATE_COUPONS_FILE)) {
      try {
        const raw = fs.readFileSync(PRIVATE_COUPONS_FILE, 'utf8').replace(/^\uFEFF/, '');
        privateSeeds = JSON.parse(raw);
      } catch (_) {}
    }

    if (!Array.isArray(privateSeeds) || privateSeeds.length < 3) {
      privateSeeds = [
        {
          offerName: 'Offer 1: 20% Discount',
          discountPercentage: 20,
          rawCode: couponSecurity.generateCouponCode(),
          maxUses: 100,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          userRestriction: null,
          notes: 'Standard Private Client Incentive (20% Off)'
        },
        {
          offerName: 'Offer 2: 50% Discount',
          discountPercentage: 50,
          rawCode: couponSecurity.generateCouponCode(),
          maxUses: 50,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          userRestriction: null,
          notes: 'Exclusive Partner & Startup Grant (50% Off)'
        },
        {
          offerName: 'Offer 3: 95% Discount',
          discountPercentage: 95,
          rawCode: couponSecurity.generateCouponCode(),
          maxUses: 10,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          userRestriction: null,
          notes: 'VIP Studio Leadership Pass (95% Off)'
        }
      ];
      fs.writeFileSync(PRIVATE_COUPONS_FILE, JSON.stringify(privateSeeds, null, 2), 'utf8');
      logger.info('Generated initial 3 cryptographically unique private coupon offers');
    }

    if (isMongoActive()) {
      const Coupon = require('../models/Coupon');
      for (const item of privateSeeds) {
        const hash = couponSecurity.hashCouponCode(item.rawCode);
        const existing = await Coupon.findOne({ code_hash: hash });
        if (!existing) {
          await Coupon.create({
            code_hash: hash,
            code_mask: couponSecurity.maskCouponCode(item.rawCode),
            discount_percentage: item.discountPercentage,
            active: true,
            expires_at: item.expiresAt,
            max_uses: item.maxUses,
            used_count: 0,
            user_restriction: item.userRestriction,
            notes: item.notes
          });
        }
      }
      logger.success('Private coupon hashes active in MongoDB');
    } else {
      loadLocalDb();
      if (!localDb.coupons) localDb.coupons = [];
      for (const item of privateSeeds) {
        const hash = couponSecurity.hashCouponCode(item.rawCode);
        const exists = localDb.coupons.some(c => c.code_hash === hash);
        if (!exists) {
          localDb.coupons.push({
            _id: crypto.randomUUID(),
            code_hash: hash,
            code_mask: couponSecurity.maskCouponCode(item.rawCode),
            discount_percentage: item.discountPercentage,
            active: true,
            expires_at: item.expiresAt,
            max_uses: item.maxUses,
            used_count: 0,
            user_restriction: item.userRestriction,
            notes: item.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
      saveLocalDb();
      logger.success('Private coupon hashes active in document store');
    }
  } catch (err) {
    logger.error('Error seeding private coupons', err);
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
    findByIdWithPassword: async (id) => {
      if (isMongoActive()) {
        const User = require('../models/User');
        return await User.findById(id);
      }
      loadLocalDb();
      const user = localDb.users.find(u => u._id === id);
      return user ? { ...user } : null;
    },
    findByIdAndUpdate: async (id, updateData) => {
      if (isMongoActive()) {
        const User = require('../models/User');
        return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      }
      loadLocalDb();
      const idx = localDb.users.findIndex(u => u._id === id);
      if (idx === -1) return null;
      localDb.users[idx] = {
        ...localDb.users[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      saveLocalDb();
      const { password, ...safeUser } = localDb.users[idx];
      return safeUser;
    },
    findByResetToken: async (tokenHash) => {
      if (isMongoActive()) {
        const User = require('../models/User');
        return await User.findOne({
          resetPasswordToken: tokenHash,
          resetPasswordExpires: { $gt: new Date() }
        });
      }
      loadLocalDb();
      const now = Date.now();
      const user = localDb.users.find(u => 
        u.resetPasswordToken === tokenHash && 
        u.resetPasswordExpires && 
        new Date(u.resetPasswordExpires).getTime() > now
      );
      return user ? { ...user } : null;
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
  },

  getPrivateCouponsSeed: () => {
    if (fs.existsSync(PRIVATE_COUPONS_FILE)) {
      try {
        const raw = fs.readFileSync(PRIVATE_COUPONS_FILE, 'utf8').replace(/^\uFEFF/, '');
        return JSON.parse(raw);
      } catch (_) {}
    }
    return [];
  },

  Coupon: {
    findOne: async (query) => {
      if (isMongoActive()) {
        const Coupon = require('../models/Coupon');
        return await Coupon.findOne(query);
      }
      loadLocalDb();
      const coupon = localDb.coupons.find(c => {
        if (query.code_hash && c.code_hash !== query.code_hash) return false;
        if (query.active !== undefined && c.active !== query.active) return false;
        if (query._id && c._id !== query._id) return false;
        return true;
      });
      return coupon ? { ...coupon } : null;
    },
    findById: async (id) => {
      if (isMongoActive()) {
        const Coupon = require('../models/Coupon');
        return await Coupon.findById(id);
      }
      loadLocalDb();
      const coupon = localDb.coupons.find(c => c._id === id);
      return coupon ? { ...coupon } : null;
    },
    find: async (filter = {}) => {
      if (isMongoActive()) {
        const Coupon = require('../models/Coupon');
        let q = {};
        if (filter.active !== undefined) q.active = filter.active;
        if (filter.discount_percentage) q.discount_percentage = filter.discount_percentage;
        return await Coupon.find(q).sort({ createdAt: -1 });
      }
      loadLocalDb();
      let list = [...localDb.coupons];
      if (filter.active !== undefined) {
        list = list.filter(c => c.active === filter.active);
      }
      if (filter.discount_percentage) {
        list = list.filter(c => c.discount_percentage === Number(filter.discount_percentage));
      }
      return list.reverse();
    },
    create: async (data) => {
      if (isMongoActive()) {
        const Coupon = require('../models/Coupon');
        return await Coupon.create(data);
      }
      loadLocalDb();
      const newCoupon = {
        _id: crypto.randomUUID(),
        code_hash: data.code_hash,
        code_mask: data.code_mask,
        discount_percentage: Number(data.discount_percentage),
        active: data.active !== undefined ? Boolean(data.active) : true,
        expires_at: data.expires_at || null,
        max_uses: Number(data.max_uses) || 1,
        used_count: Number(data.used_count) || 0,
        user_restriction: data.user_restriction ? data.user_restriction.toLowerCase().trim() : null,
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localDb.coupons.push(newCoupon);
      saveLocalDb();
      return newCoupon;
    },
    findByIdAndUpdate: async (id, updateData) => {
      if (isMongoActive()) {
        const Coupon = require('../models/Coupon');
        return await Coupon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      }
      loadLocalDb();
      const idx = localDb.coupons.findIndex(c => c._id === id);
      if (idx === -1) return null;
      localDb.coupons[idx] = {
        ...localDb.coupons[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      saveLocalDb();
      return { ...localDb.coupons[idx] };
    },
    findByIdAndDelete: async (id) => {
      if (isMongoActive()) {
        const Coupon = require('../models/Coupon');
        return await Coupon.findByIdAndDelete(id);
      }
      loadLocalDb();
      const idx = localDb.coupons.findIndex(c => c._id === id);
      if (idx === -1) return null;
      const removed = localDb.coupons.splice(idx, 1)[0];
      saveLocalDb();
      return removed;
    },
    countDocuments: async (filter = {}) => {
      if (isMongoActive()) {
        const Coupon = require('../models/Coupon');
        return await Coupon.countDocuments(filter);
      }
      loadLocalDb();
      if (!filter || Object.keys(filter).length === 0) return localDb.coupons.length;
      return localDb.coupons.filter(c => {
        for (const [k, v] of Object.entries(filter)) {
          if (c[k] !== v) return false;
        }
        return true;
      }).length;
    }
  },

  CouponUsage: {
    create: async (data) => {
      if (isMongoActive()) {
        const CouponUsage = require('../models/CouponUsage');
        return await CouponUsage.create(data);
      }
      loadLocalDb();
      const newUsage = {
        _id: crypto.randomUUID(),
        coupon_id: data.coupon_id,
        code_mask: data.code_mask,
        discount_percentage: Number(data.discount_percentage),
        user_id: data.user_id || null,
        user_email: data.user_email ? data.user_email.toLowerCase().trim() : null,
        order_id: data.order_id,
        original_amount: Number(data.original_amount),
        discount_amount: Number(data.discount_amount),
        final_amount: Number(data.final_amount),
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localDb.couponUsages.push(newUsage);
      saveLocalDb();
      return newUsage;
    },
    find: async (filter = {}) => {
      if (isMongoActive()) {
        const CouponUsage = require('../models/CouponUsage');
        let q = {};
        if (filter.user_email) q.user_email = filter.user_email.toLowerCase();
        if (filter.user_id) q.user_id = filter.user_id;
        if (filter.coupon_id) q.coupon_id = filter.coupon_id;
        return await CouponUsage.find(q).sort({ createdAt: -1 });
      }
      loadLocalDb();
      let list = [...localDb.couponUsages];
      if (filter.user_email) {
        const em = filter.user_email.toLowerCase().trim();
        list = list.filter(u => u.user_email && u.user_email.toLowerCase() === em);
      }
      if (filter.user_id) {
        list = list.filter(u => u.user_id === filter.user_id);
      }
      if (filter.coupon_id) {
        list = list.filter(u => u.coupon_id === filter.coupon_id);
      }
      return list.reverse();
    },
    countDocuments: async (filter = {}) => {
      if (isMongoActive()) {
        const CouponUsage = require('../models/CouponUsage');
        return await CouponUsage.countDocuments(filter);
      }
      loadLocalDb();
      if (!filter || Object.keys(filter).length === 0) return localDb.couponUsages.length;
      return localDb.couponUsages.filter(u => {
        for (const [k, v] of Object.entries(filter)) {
          if (u[k] !== v) return false;
        }
        return true;
      }).length;
    }
  },

  Order: {
    create: async (data) => {
      loadLocalDb();
      const newOrder = {
        _id: crypto.randomUUID(),
        orderId: data.orderId || ('DC-ORD-' + Math.floor(100000 + Math.random() * 900000)),
        productId: data.productId,
        productName: data.productName,
        productType: data.productType || 'app',
        originalPrice: Number(data.originalPrice),
        productDiscountPercent: Number(data.productDiscountPercent),
        productDiscountAmount: Number(data.productDiscountAmount),
        discountedPrice: Number(data.discountedPrice),
        couponCodeMask: data.couponCodeMask || null,
        couponDiscountPercent: Number(data.couponDiscountPercent || 0),
        couponDiscountAmount: Number(data.couponDiscountAmount || 0),
        finalAmount: Number(data.finalAmount),
        items: Array.isArray(data.items) ? data.items : [],
        userId: data.userId || null,
        clientName: data.clientName || 'Guest Client',
        clientEmail: data.clientEmail ? data.clientEmail.toLowerCase().trim() : '',
        clientPhone: data.clientPhone || '',
        notes: data.notes || '',
        status: data.status || 'pending', // pending, payment_processing, paid, failed, cancelled, refunded
        paymentStatus: data.paymentStatus || (Number(data.finalAmount) === 0 ? 'paid' : 'unpaid'),
        paymentMethod: data.paymentMethod || 'upi_tranz',
        transactionId: data.transactionId || null,
        utr: data.utr || null,
        tranzReferenceId: data.tranzReferenceId || null,
        entitlements: data.entitlements || (data.items && data.items.map(i => i.productId)) || (data.productId ? [data.productId] : []),
        paidAt: data.paidAt || (data.paymentStatus === 'paid' ? new Date().toISOString() : null),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localDb.orders.push(newOrder);
      saveLocalDb();
      return newOrder;
    },
    find: async (filter = {}) => {
      loadLocalDb();
      let list = [...localDb.orders];
      if (filter.userId) {
        list = list.filter(o => o.userId === filter.userId);
      }
      if (filter.clientEmail) {
        const em = filter.clientEmail.toLowerCase().trim();
        list = list.filter(o => o.clientEmail && o.clientEmail.toLowerCase() === em);
      }
      if (filter.productId) {
        list = list.filter(o => o.productId === filter.productId || (o.items && o.items.some(i => i.productId === filter.productId)));
      }
      if (filter.status) {
        list = list.filter(o => o.status === filter.status);
      }
      if (filter.paymentStatus) {
        list = list.filter(o => o.paymentStatus === filter.paymentStatus);
      }
      return list.reverse();
    },
    findById: async (id) => {
      loadLocalDb();
      return localDb.orders.find(o => o._id === id || o.orderId === id) || null;
    },
    findOne: async (query = {}) => {
      loadLocalDb();
      const o = localDb.orders.find(item => {
        if (query.orderId && item.orderId !== query.orderId) return false;
        if (query._id && item._id !== query._id) return false;
        if (query.transactionId && item.transactionId !== query.transactionId) return false;
        if (query.utr && item.utr !== query.utr) return false;
        if (query.clientEmail && item.clientEmail && item.clientEmail.toLowerCase() !== query.clientEmail.toLowerCase()) return false;
        return true;
      });
      return o ? { ...o } : null;
    },
    findByIdAndUpdate: async (id, updateData) => {
      loadLocalDb();
      const idx = localDb.orders.findIndex(o => o._id === id || o.orderId === id);
      if (idx === -1) return null;
      localDb.orders[idx] = {
        ...localDb.orders[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      saveLocalDb();
      return { ...localDb.orders[idx] };
    },
    countDocuments: async (filter = {}) => {
      loadLocalDb();
      if (!filter || Object.keys(filter).length === 0) return localDb.orders.length;
      return localDb.orders.filter(o => {
        for (const [k, v] of Object.entries(filter)) {
          if (o[k] !== v) return false;
        }
        return true;
      }).length;
    }
  },

  Payment: {
    create: async (data) => {
      loadLocalDb();
      const newPayment = {
        _id: crypto.randomUUID(),
        paymentId: data.paymentId || ('DC-PAY-' + Math.floor(100000 + Math.random() * 900000)),
        orderId: data.orderId,
        gateway: data.gateway || 'tranz_upi',
        amount: Number(data.amount),
        currency: data.currency || 'INR',
        status: data.status || 'created', // created, pending, paid, failed, cancelled
        upiUri: data.upiUri || '',
        gatewayOrderId: data.gatewayOrderId || '',
        gatewayTxnId: data.gatewayTxnId || '',
        utr: data.utr || '',
        customerEmail: data.customerEmail || '',
        customerPhone: data.customerPhone || '',
        metadata: data.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localDb.payments.push(newPayment);
      saveLocalDb();
      return newPayment;
    },
    findOne: async (query = {}) => {
      loadLocalDb();
      const item = localDb.payments.find(p => {
        if (query._id && p._id !== query._id) return false;
        if (query.paymentId && p.paymentId !== query.paymentId) return false;
        if (query.orderId && p.orderId !== query.orderId) return false;
        if (query.gatewayTxnId && p.gatewayTxnId !== query.gatewayTxnId) return false;
        if (query.utr && p.utr !== query.utr) return false;
        return true;
      });
      return item ? { ...item } : null;
    },
    findByIdAndUpdate: async (id, updateData) => {
      loadLocalDb();
      const idx = localDb.payments.findIndex(p => p._id === id || p.paymentId === id || p.orderId === id);
      if (idx === -1) return null;
      localDb.payments[idx] = {
        ...localDb.payments[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      saveLocalDb();
      return { ...localDb.payments[idx] };
    },
    find: async (filter = {}) => {
      loadLocalDb();
      let list = [...localDb.payments];
      if (filter.orderId) list = list.filter(p => p.orderId === filter.orderId);
      if (filter.status) list = list.filter(p => p.status === filter.status);
      return list.reverse();
    }
  },

  PaymentTransaction: {
    create: async (data) => {
      loadLocalDb();
      const txn = {
        _id: crypto.randomUUID(),
        paymentId: data.paymentId,
        orderId: data.orderId,
        amount: Number(data.amount),
        status: data.status,
        txnId: data.txnId || '',
        utr: data.utr || '',
        gatewayResponse: data.gatewayResponse || {},
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      localDb.paymentTransactions.push(txn);
      saveLocalDb();
      return txn;
    },
    find: async (filter = {}) => {
      loadLocalDb();
      let list = [...localDb.paymentTransactions];
      if (filter.orderId) list = list.filter(t => t.orderId === filter.orderId);
      return list.reverse();
    }
  },

  SavedProduct: {
    create: async (data) => {
      loadLocalDb();
      const sp = {
        _id: crypto.randomUUID(),
        userId: data.userId,
        productId: data.productId,
        createdAt: new Date().toISOString()
      };
      localDb.savedProducts.push(sp);
      saveLocalDb();
      return sp;
    },
    find: async (filter = {}) => {
      loadLocalDb();
      let list = [...localDb.savedProducts];
      if (filter.userId) list = list.filter(s => s.userId === filter.userId);
      if (filter.productId) list = list.filter(s => s.productId === filter.productId);
      return list;
    },
    deleteOne: async (filter = {}) => {
      loadLocalDb();
      const idx = localDb.savedProducts.findIndex(s => {
        if (filter.userId && s.userId !== filter.userId) return false;
        if (filter.productId && s.productId !== filter.productId) return false;
        return true;
      });
      if (idx !== -1) {
        const removed = localDb.savedProducts.splice(idx, 1)[0];
        saveLocalDb();
        return removed;
      }
      return null;
    }
  },

  ActivityLog: {
    create: async (data) => {
      loadLocalDb();
      const logItem = {
        _id: crypto.randomUUID(),
        action: data.action,
        actor: data.actor || 'system',
        details: data.details || {},
        ip: data.ip || '127.0.0.1',
        timestamp: new Date().toISOString()
      };
      localDb.activityLogs.push(logItem);
      if (localDb.activityLogs.length > 1000) {
        localDb.activityLogs = localDb.activityLogs.slice(-1000);
      }
      saveLocalDb();
      return logItem;
    },
    find: async (filter = {}) => {
      loadLocalDb();
      return [...localDb.activityLogs].reverse();
    }
  },

  Product: {
    find: async (filter = {}) => {
      ensureProductsSeeded();
      let list = [...localDb.products];
      if (filter.category && filter.category !== 'All') {
        list = list.filter(p => p.category && p.category.toLowerCase() === filter.category.toLowerCase());
      }
      if (filter.type) {
        list = list.filter(p => p.type && p.type.toLowerCase() === filter.type.toLowerCase());
      }
      if (filter.active !== undefined) {
        list = list.filter(p => p.active === filter.active);
      }
      return list;
    },
    findById: async (id) => {
      ensureProductsSeeded();
      const p = localDb.products.find(item => item._id === id || item.id === id);
      return p ? { ...p } : null;
    },
    findOne: async (query = {}) => {
      ensureProductsSeeded();
      const p = localDb.products.find(item => {
        if (query.id && item.id !== query.id) return false;
        if (query._id && item._id !== query._id) return false;
        if (query.name && item.name !== query.name) return false;
        return true;
      });
      return p ? { ...p } : null;
    },
    create: async (data) => {
      ensureProductsSeeded();
      const newProd = {
        _id: crypto.randomUUID(),
        id: data.id || ('prod-' + Date.now()),
        name: data.name,
        type: data.type || 'app',
        category: data.category || 'Other Products',
        platform: data.platform || 'Cross-Platform',
        badge: data.badge || 'New Product',
        originalPrice: Number(data.originalPrice) || 5000,
        discountPercent: data.discountPercent !== undefined ? Number(data.discountPercent) : null,
        shortDesc: data.shortDesc || '',
        detailedDesc: data.detailedDesc || '',
        features: Array.isArray(data.features) ? data.features : [],
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        version: data.version || 'v1.0.0',
        requirements: data.requirements || '',
        changelog: Array.isArray(data.changelog) ? data.changelog : [],
        fileDetails: data.fileDetails || null,
        image: data.image || '/assets/images/project-ai.svg',
        active: data.active !== undefined ? data.active : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localDb.products.push(newProd);
      saveLocalDb();
      return newProd;
    },
    findByIdAndUpdate: async (id, updateData) => {
      ensureProductsSeeded();
      const idx = localDb.products.findIndex(p => p._id === id || p.id === id);
      if (idx === -1) return null;
      localDb.products[idx] = {
        ...localDb.products[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      saveLocalDb();
      return localDb.products[idx];
    },
    findByIdAndDelete: async (id) => {
      ensureProductsSeeded();
      const idx = localDb.products.findIndex(p => p._id === id || p.id === id);
      if (idx === -1) return null;
      const removed = localDb.products.splice(idx, 1)[0];
      saveLocalDb();
      return removed;
    },
    countDocuments: async (filter = {}) => {
      ensureProductsSeeded();
      return localDb.products.length;
    }
  },

  ProductFile: {
    find: async (filter = {}) => {
      ensureProductFilesSeeded();
      let list = [...(localDb.productFiles || [])];
      if (filter.productId) list = list.filter(f => f.productId === filter.productId);
      if (filter.isSourcePackage !== undefined) list = list.filter(f => Boolean(f.isSourcePackage) === Boolean(filter.isSourcePackage));
      return list;
    },
    findOne: async (query = {}) => {
      ensureProductFilesSeeded();
      return (localDb.productFiles || []).find(f => {
        if (query.productId && f.productId !== query.productId) return false;
        if (query._id && f._id !== query._id) return false;
        if (query.isSourcePackage !== undefined && Boolean(f.isSourcePackage) !== Boolean(query.isSourcePackage)) return false;
        if (query.filename && f.filename !== query.filename) return false;
        return true;
      }) || null;
    },
    create: async (data) => {
      ensureProductFilesSeeded();
      const newFile = {
        _id: crypto.randomUUID(),
        productId: data.productId,
        filename: data.filename,
        originalName: data.originalName || data.filename,
        fileSize: data.fileSize || '0 KB',
        mimeType: data.mimeType || 'application/octet-stream',
        version: data.version || 'v1.0.0',
        platform: data.platform || 'Cross-Platform',
        changelog: data.changelog || '',
        filePath: data.filePath || '',
        uploadedAt: new Date().toISOString()
      };
      localDb.productFiles.push(newFile);
      saveLocalDb();
      return newFile;
    }
  },

  Download: {
    create: async (data) => {
      loadLocalDb();
      if (!localDb.downloads) localDb.downloads = [];
      const rec = {
        _id: crypto.randomUUID(),
        productId: data.productId,
        productName: data.productName || data.productId,
        userId: data.userId || null,
        clientEmail: data.clientEmail || 'Guest',
        ip: data.ip || '127.0.0.1',
        version: data.version || 'v1.0.0',
        timestamp: new Date().toISOString()
      };
      localDb.downloads.push(rec);
      saveLocalDb();
      return rec;
    },
    find: async (filter = {}) => {
      loadLocalDb();
      let list = [...(localDb.downloads || [])];
      if (filter.userId) list = list.filter(d => d.userId === filter.userId);
      if (filter.productId) list = list.filter(d => d.productId === filter.productId);
      return list.reverse();
    },
    countDocuments: async (filter = {}) => {
      loadLocalDb();
      return (localDb.downloads || []).length;
    }
  },

  getDiscountRules: () => {
    loadLocalDb();
    if (!localDb.discountRules) {
      localDb.discountRules = { appDefaultDiscount: 50, aptitudeDefaultDiscount: 30 };
      saveLocalDb();
    }
    return localDb.discountRules;
  },

  updateDiscountRules: (rules) => {
    loadLocalDb();
    localDb.discountRules = {
      ...localDb.discountRules,
      ...rules
    };
    saveLocalDb();
    return localDb.discountRules;
  },

  ShareEvent: {
    create: async (data) => {
      loadLocalDb();
      const newEvent = {
        _id: crypto.randomUUID(),
        productId: data.productId,
        sharePlatform: data.sharePlatform || 'unknown',
        userId: data.userId || null,
        ip: data.ip || '127.0.0.1',
        timestamp: new Date().toISOString()
      };
      localDb.shareEvents.push(newEvent);
      saveLocalDb();
      return newEvent;
    },
    find: async (filter = {}) => {
      loadLocalDb();
      let list = [...localDb.shareEvents];
      if (filter.productId) {
        list = list.filter(e => e.productId === filter.productId);
      }
      if (filter.sharePlatform) {
        list = list.filter(e => e.sharePlatform === filter.sharePlatform);
      }
      return list.reverse();
    },
    countDocuments: async (filter = {}) => {
      loadLocalDb();
      if (!filter || Object.keys(filter).length === 0) return localDb.shareEvents.length;
      return localDb.shareEvents.filter(e => {
        for (const [k, v] of Object.entries(filter)) {
          if (e[k] !== v) return false;
        }
        return true;
      }).length;
    }
  }
};

module.exports = dbService;
