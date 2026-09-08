const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const dbService = require('./utils/dbAdapter');

// Middleware imports
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const userRoutes = require('./routes/userRoutes');
const couponRoutes = require('./routes/couponRoutes');
const adminCouponRoutes = require('./routes/adminCouponRoutes');
const orderRoutes = require('./routes/orderRoutes');

// DevCraft Catalog Datasets
const DEVCRAFT_SERVICES = require('../scripts/data_services');
const DEVCRAFT_DEMOS = require('../scripts/data_demos');
const { DEVCRAFT_PRODUCTS } = require('../scripts/data_products');

const app = express();

// Trust reverse proxy for secure headers & rate limiting
app.set('trust proxy', 1);

// Security Headers (Configured to allow Three.js CDNs and Inline SVG/Styles)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com",
          "https://cdn.jsdelivr.net"
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// CORS setup
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Healthcheck & System Status API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    databaseEngine: dbService.getEngine()
  });
});

// Public DevCraft Studio Profile API
app.get('/api/developer', (req, res) => {
  res.status(200).json({
    brand: 'DEVCRAFT Studio',
    tagline: 'Ideas → Code → Real Solutions',
    leadArchitect: config.developer.name,
    role: config.developer.role,
    email: config.developer.email,
    whatsapp: config.developer.whatsapp,
    phone: config.developer.phone,
    instagram: config.developer.instagram,
    telegram: config.developer.telegram,
    github: config.developer.github,
    servicesCount: DEVCRAFT_SERVICES.length,
    demosCount: DEVCRAFT_DEMOS.length,
    status: 'Available for Production Sprints'
  });
});

// All 20 Services API
app.get('/api/services', (req, res) => {
  const { category } = req.query;
  if (category && category !== 'All') {
    const filtered = DEVCRAFT_SERVICES.filter(s => 
      s.category.toLowerCase().includes(category.toLowerCase())
    );
    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  }
  res.status(200).json({ success: true, count: DEVCRAFT_SERVICES.length, data: DEVCRAFT_SERVICES });
});

// All 10 Interactive Demos API
app.get('/api/demos', (req, res) => {
  const { category } = req.query;
  if (category && category !== 'ALL') {
    const filtered = DEVCRAFT_DEMOS.filter(d => 
      d.category.toUpperCase().includes(category.toUpperCase())
    );
    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  }
  res.status(200).json({ success: true, count: DEVCRAFT_DEMOS.length, data: DEVCRAFT_DEMOS });
});

// API Routes
app.use('/api/admin', authRoutes);
app.use('/api/admin/enquiries', enquiryRoutes);
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', enquiryRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api', orderRoutes);

// Static files for Admin Portal
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Static files for Public Frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle direct HTML page routes
app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/services.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/projects.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/contact.html'));
});

app.get('/hire-me', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/contact.html'));
});

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin-login.html'));
});

app.get('/client-portal', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/client-portal.html'));
});

app.get('/client-login', (req, res) => {
  res.redirect('/login');
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/forgot-password.html'));
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/reset-password.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/dashboard.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/profile.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/profile.html'));
});

app.get('/my-projects', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/dashboard.html'));
});

app.get('/saved-demos', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/dashboard.html'));
});

// Catch-all 404 for APIs
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.success(`🚀 DEVCRAFT Studio Production Server running on port ${config.port}`);
    logger.info(`🌐 Frontend: http://localhost:${config.port}`);
    logger.info(`🔒 Admin Dashboard: http://localhost:${config.port}/admin/`);
    logger.info(`🔑 Admin Login: http://localhost:${config.port}/admin-login`);
    logger.info(`📦 Database Engine: ${dbService.getEngine()}`);
  });

  // Handle unhandled promise rejections safely
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
  });

  // 24/7 Production Keep-Alive Ping (prevents Render Free Tier idle sleep)
  const renderUrl = process.env.RENDER_EXTERNAL_URL || 'https://harsh-developer.onrender.com';
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    const https = require('https');
    const KEEP_ALIVE_INTERVAL = 13 * 60 * 1000; // every 13 minutes
    setInterval(() => {
      https.get(`${renderUrl}/api/health`, (res) => {
        logger.info(`[Keep-Alive] 24/7 self-ping executed: ${res.statusCode}`);
      }).on('error', (err) => {
        logger.warn(`[Keep-Alive] Ping warning: ${err.message}`);
      });
    }, KEEP_ALIVE_INTERVAL);
    logger.info(`⏰ 24/7 Keep-Alive self-pinger initialized for: ${renderUrl}`);
  }

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
