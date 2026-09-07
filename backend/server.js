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

// Public Developer Profile API
app.get('/api/developer', (req, res) => {
  res.status(200).json({
    name: config.developer.name,
    brand: config.developer.brand,
    role: config.developer.role,
    email: config.developer.email,
    whatsapp: config.developer.whatsapp,
    phone: config.developer.phone,
    instagram: config.developer.instagram,
    telegram: config.developer.telegram,
    githubStatus: 'Coming Soon',
    servicesCount: 10
  });
});

// API Routes
app.use('/api/admin', authRoutes);
app.use('/api/admin/enquiries', enquiryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', enquiryRoutes);
app.use('/api/enquiries', enquiryRoutes);

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
  res.sendFile(path.join(__dirname, '../frontend/pages/client-portal.html'));
});

// Catch-all 404 for APIs
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.success(`🚀 Harsh Developer Production Server running on port ${config.port}`);
    logger.info(`🌐 Frontend: http://localhost:${config.port}`);
    logger.info(`🔒 Admin Dashboard: http://localhost:${config.port}/admin/`);
    logger.info(`🔑 Admin Login: http://localhost:${config.port}/admin-login`);
    logger.info(`📦 Database Engine: ${dbService.getEngine()}`);
  });

  // Handle unhandled promise rejections safely
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
