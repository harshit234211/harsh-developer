# Harsh Developer — Production 3D Portfolio & Client Service Platform

> Built for **Harshit** (**Harsh Developer**) — Full-Stack Web Developer & 3D WebGL Engineer.

---

## 🌟 Overview

A complete, live-working, production-ready 3D developer portfolio and client management system.

- **Real 3D Experience**: Powered by Three.js & WebGL with an interactive Cybernetic Developer Core, orbit gimbals, holographic data nodes, and mouse-parallax interaction. Includes automatic fallback for devices without WebGL.
- **Client Services Platform**: 10 comprehensive developer services with auto-selecting project request links.
- **Dynamic Projects Showcase**: REST-driven showcase projects with dynamic category filter tabs and "Coming Soon" GitHub state.
- **Working Contact Pipeline**: Validated project enquiry form with anti-spam debounce, database persistence, and status notifications.
- **Direct Connect Links**: Instant WhatsApp (`wa.me/918791984082`), Phone Call (`tel:+917017022966`), Email (`mailto:shakyaharshit683@gmail.com`), Instagram (`@kiro_mage`), and Telegram (`@harshuuu1123`).
- **Full-Stack Admin System**: Secure JWT authentication, password hashing via `bcryptjs`, CRM pipeline for enquiry status tracking (`New`, `Contacted`, `In Progress`, `Completed`, `Cancelled`), and project CMS for creating, modifying, and publishing portfolio items.
- **Dual-Engine Database Adapter**: Runs out-of-the-box using the embedded document store (`database/store.json`), and automatically connects to MongoDB / MongoDB Atlas whenever `MONGODB_URI` is provided.

---

## 📂 Project Structure

```
harsh-developer/
├── frontend/
│   ├── index.html               # Main entrance with Hero 3D scene & dynamic sections
│   ├── css/
│   │   ├── style.css            # Dark theme, glassmorphism, neon accents, typography
│   │   └── responsive.css       # Breakpoint media queries (mobile 320px to 4K)
│   ├── js/
│   │   ├── three-scene.js       # Real Three.js WebGL 3D Cybernetic Developer Core
│   │   ├── api.js               # Centralized REST API client with toasts
│   │   ├── main.js              # Navigation, mobile drawer, project filters
│   │   └── form.js              # Enquiry validation & submission handler
│   ├── pages/
│   │   ├── services.html        # Dedicated services catalog (10 services)
│   │   ├── projects.html        # Filterable project showcase gallery
│   │   ├── about.html           # Developer profile, skills & workflow
│   │   ├── contact.html         # Project request and contact channels
│   │   └── admin-login.html     # Secure admin login portal
│   └── assets/
│       ├── icons/               # SVG tech & brand icons
│       └── images/              # Showcase project mockups & avatar
├── backend/
│   ├── server.js                # Express app entrypoint & static serving
│   ├── config/
│   │   ├── db.js                # Database connection orchestrator
│   │   └── env.js               # Environment configuration loader
│   ├── models/
│   │   ├── Admin.js             # Admin schema & password hashing
│   │   ├── Project.js           # Project schema
│   │   └── Enquiry.js           # Enquiry schema & status lifecycle
│   ├── controllers/
│   │   ├── authController.js    # Login, JWT issue, logout, me
│   │   ├── projectController.js # Public list, Admin create, edit, delete
│   │   └── enquiryController.js # Submit enquiry, list, status patch, stats
│   ├── routes/
│   │   ├── authRoutes.js        # /api/admin/*
│   │   ├── projectRoutes.js     # /api/projects/*
│   │   └── enquiryRoutes.js     # /api/contact & /api/admin/enquiries/*
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification & route guard
│   │   ├── rateLimiter.js       # Express rate limiters for forms & login
│   │   ├── validator.js         # Input sanitization & validation
│   │   └── errorHandler.js      # Production-safe error handler
│   └── utils/
│       ├── dbAdapter.js         # Dual-Engine: MongoDB Mongoose + Embedded Document Store
│       ├── seedData.js          # Initial showcase projects & default admin
│       └── logger.js            # Structured terminal logger
├── admin/
│   ├── index.html               # Admin Dashboard (Analytics, CRM, Project CMS)
│   ├── css/
│   │   └── admin.css            # Glassmorphic dashboard UI
│   └── js/
│       └── admin.js             # Dashboard controller (JWT session & CRUD)
├── database/
│   └── store.json               # Local persistent document store
├── tests/
│   └── qa_suite.js              # 25-step automated QA verification suite
├── .env.example                 # Environment variables template
├── .env                         # Active configuration
├── package.json                 # Node dependencies & run scripts
└── README.md                    # Setup & deployment documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested with v24.19.0)
- **npm**: v9+ (tested with v11.17.0)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development

# Database (Leave blank for zero-setup local store, or provide MongoDB Atlas URI)
MONGODB_URI=

# Admin Login Credentials
ADMIN_EMAIL=admin@harshdeveloper.com
ADMIN_PASSWORD=HarshAdmin2026!
JWT_SECRET=harsh_developer_jwt_secret_token_secure_key_2026_production
JWT_EXPIRES_IN=7d

# Developer Contact Information
DEVELOPER_EMAIL=shakyaharshit683@gmail.com
DEVELOPER_WHATSAPP=+918791984082
DEVELOPER_PHONE=+917017022966
DEVELOPER_INSTAGRAM=https://www.instagram.com/kiro_mage/
DEVELOPER_TELEGRAM=https://t.me/harshuuu1123
```

### 4. Run the Application
```bash
npm start
```
The server will start on port `5000`:
- **Live Website**: `http://localhost:5000/`
- **Services Catalog**: `http://localhost:5000/services`
- **Projects Gallery**: `http://localhost:5000/projects`
- **About Harshit**: `http://localhost:5000/about`
- **Contact & Hire Me**: `http://localhost:5000/contact`
- **Admin Login**: `http://localhost:5000/admin-login`
- **Admin Dashboard**: `http://localhost:5000/admin/`

---

## 🔒 Admin Credentials & Configuration

To access the Admin Dashboard:
1. Navigate to `http://localhost:5000/admin-login`
2. Enter the credentials defined in your `.env`:
   - **Email**: `admin@harshdeveloper.com`
   - **Password**: `HarshAdmin2026!`
3. Once logged in, you can:
   - View overview metrics (Total Enquiries, New Enquiries, In Progress, Completed, Total Projects).
   - Search, filter, and change enquiry status (`New` -> `Contacted` -> `In Progress` -> `Completed` -> `Cancelled`).
   - Click one-click direct WhatsApp, Call, or Email actions for each client.
   - Add, edit, publish/unpublish, and delete showcase portfolio projects.

---

## 🗄️ Database Setup

### Out-of-the-Box Local Mode (Zero Configuration)
If `MONGODB_URI` is left blank in `.env`, the system uses the atomic persistent JSON document store in `database/store.json`. All CRUD operations, status updates, and enquiries persist automatically across server restarts without installing MongoDB locally.

### Production MongoDB / MongoDB Atlas Mode
To connect to MongoDB Atlas or an external MongoDB instance:
1. In `.env`, set:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/harsh_developer?retryWrites=true&w=majority
   ```
2. Restart the server. The application will automatically detect MongoDB, connect via Mongoose, and migrate operations seamlessly.

---

## 🧪 Automated Testing

To run the complete automated test suite:
```bash
npm test
```
This executes `tests/qa_suite.js` covering:
- Healthcheck and system status
- Public contact form submission & field validations
- Anti-duplicate rapid submission protection
- Admin authentication (valid, invalid password, rate limits)
- Protected route guards (401 unauthorized checks)
- Project CRUD lifecycle (create, read, update, delete)
- Enquiry lifecycle (status update, search, delete)
- Contact and social link integrity verification
