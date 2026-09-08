/**
 * DEVCRAFT - Products & Courses Catalog
 * Supports All App Products (50% OFF) and Aptitude Courses (30% OFF)
 */

function calculatePricing(item) {
  const isAptitude = item.type === 'aptitude' || 
                     item.category === 'Aptitude' || 
                     (item.category && item.category.toLowerCase().includes('aptitude'));
  const discountPercent = isAptitude ? 30 : 50;
  const originalPrice = Number(item.originalPrice) || 10000;
  const discountAmount = Math.round(originalPrice * (discountPercent / 100));
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  return {
    isAptitude,
    discountPercent,
    discountAmount,
    finalPrice
  };
}

const DEVCRAFT_PRODUCTS = [
  // ==========================================
  // 1. APTITUDE & PLACEMENT COURSES (30% DISCOUNT)
  // ==========================================
  {
    id: 'aptitude-mastery',
    name: 'Developer Aptitude & Problem Solving Mastery',
    type: 'aptitude',
    category: 'Aptitude',
    badge: '30% OFF • High Placement Rate',
    originalPrice: 5000,
    shortDesc: 'Comprehensive aptitude program covering quantitative reasoning, logical deduction, algorithmic pattern matching, and FAANG placement tests.',
    detailedDesc: 'Master the technical aptitude screening rounds required by top tech companies, product startups, and IT enterprises. Designed by senior engineers to build crystal-clear problem decomposition, rapid mental math shortcuts, and speed under time pressure.',
    features: [
      '50+ Curated Quantitative & Logical Aptitude modules',
      'Data Interpretation, Number Theory, Probability & Permutations',
      'Coding Aptitude: Time-complexity analysis & dry-run drills',
      '20 Full-length timed mock tests with detailed video solutions',
      'Direct WhatsApp doubt clearing with mentor support',
      'Certificate of Completion & verified skill badge'
    ],
    technologies: ['Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation', 'Coding Logic', 'Speed Math'],
    image: '/assets/images/project-api.svg',
    rating: '4.95 ★ (1,400+ students)'
  },
  {
    id: 'aptitude-quant-logical',
    name: 'Technical Quantitative & Logical Assessment Pack',
    type: 'aptitude',
    category: 'Aptitude',
    badge: '30% OFF • Interview Ready',
    originalPrice: 3000,
    shortDesc: 'Targeted test series focusing on high-frequency questions asked in corporate tech screening and IT hiring challenges.',
    detailedDesc: 'Sharpen your quantitative and logical instincts with 1,500+ practice problems, step-by-step mathematical proofs, and automated score benchmarking against thousands of tech job aspirants.',
    features: [
      '1,500+ High-frequency aptitude practice questions',
      'Comprehensive coverage of Puzzles, Seating Arrangements, & Syllogisms',
      'Speed-building techniques for Profit & Loss, Percentages, and Work-Time',
      'Live leaderboard & percentile ranking system',
      'Downloadable PDF formula sheets & shortcut cheat-sheets',
      'Lifetime access with quarterly question bank updates'
    ],
    technologies: ['Mental Math', 'Logical Deduction', 'Syllogisms', 'Puzzles', 'Time-Speed-Distance'],
    image: '/assets/images/project-web.svg',
    rating: '4.9 ★ (890+ students)'
  },
  {
    id: 'aptitude-placement-bootcamp',
    name: 'Campus Placement & Company Coding Aptitude Accelerator',
    type: 'aptitude',
    category: 'Aptitude',
    badge: '30% OFF • All-In-One Campus Hub',
    originalPrice: 7000,
    shortDesc: 'Intensive 8-week bootcamp combining technical aptitude, verbal reasoning, core CS fundamentals, and live mock interview rounds.',
    detailedDesc: 'The ultimate campus recruitment accelerator. From initial online aptitude screenings to technical rounds and HR interviews, this program provides end-to-end preparation for engineering college students and fresh graduates.',
    features: [
      'Complete Quantitative, Logical & Verbal Aptitude curriculum',
      'CS Fundamentals: OS, DBMS, Computer Networks & OOPs aptitude tests',
      '1-on-1 Personalized resume review & portfolio audit',
      '2 Live simulated mock interview sessions with real feedback',
      'Company-specific test pattern drills (TCS, Infosys, Amazon, Wipro, etc.)',
      'Dedicated placement drive alerts & referral network'
    ],
    technologies: ['Campus Placement', 'Core CS', 'Verbal Reasoning', 'Mock Interviews', 'Aptitude Drills'],
    image: '/assets/images/project-dashboard.svg',
    rating: '4.98 ★ (2,100+ graduates)'
  },
  {
    id: 'aptitude-cs-fundamentals',
    name: 'Core CS Fundamentals & Algorithmic Aptitude Pack',
    type: 'aptitude',
    category: 'Aptitude',
    badge: '30% OFF • Core CS',
    originalPrice: 4500,
    shortDesc: 'Master operating systems, database management, computer networks, and data structure trivia frequently tested in written assessments.',
    detailedDesc: 'Bridge the gap between theoretical computer science and recruitment test questions. Learn how to solve tricky recursion questions, SQL query outputs, memory allocation puzzles, and networking protocol questions in seconds.',
    features: [
      'Operating Systems: Process synchronization, Deadlocks & Memory paging',
      'DBMS: Normalization, ACID transactions & Indexing aptitude',
      'Computer Networks: OSI model, TCP/IP, Subnetting & Socket trivia',
      'Data Structures & Algorithms dry-run prediction puzzles',
      'Interactive flashcards & timed micro-quizzes',
      'Curated repository of previous year interview questions'
    ],
    technologies: ['Operating Systems', 'DBMS', 'Computer Networks', 'DSA Logic', 'SQL Puzzles'],
    image: '/assets/images/project-ai.svg',
    rating: '4.88 ★ (750+ students)'
  },
  {
    id: 'aptitude-mock-simulator',
    name: 'Full-Stack Mock Aptitude & Technical Simulator',
    type: 'aptitude',
    category: 'Aptitude',
    badge: '30% OFF • Test Simulator',
    originalPrice: 2500,
    shortDesc: 'Realistic simulation platform replicating the exact UI, timer constraints, and adaptive difficulty of corporate hiring portals.',
    detailedDesc: 'Experience the pressure of real hiring assessments before the actual interview day. Our simulator mimics the testing environments of AMCAT, CoCubes, eLitmus, and top product hiring platforms with instant analytics and weak-area heatmaps.',
    features: [
      '10 Full-length adaptive mock exams with strict countdown timers',
      'Negative marking simulation & sectional time limit enforcement',
      'Comprehensive performance analytics & weak-topic diagnostic report',
      'Percentile ranking benchmarked against 15,000+ test-takers',
      'Video solutions explaining alternate shortcuts for each question',
      'Retake capability with randomized question variants'
    ],
    technologies: ['Exam Simulator', 'Timed Pressure Drills', 'Analytics Heatmap', 'AMCAT Pattern', 'CoCubes Pattern'],
    image: '/assets/images/project-ecommerce.svg',
    rating: '4.92 ★ (1,150+ students)'
  },

  // ==========================================
  // 2. APP PRODUCTS & SOFTWARE SERVICES (50% DISCOUNT)
  // ==========================================
  {
    id: 'cravex-app',
    name: 'CraveX Food Delivery Mobile App Suite',
    type: 'app',
    category: 'Mobile Apps',
    badge: '50% OFF • Production App',
    originalPrice: 50000,
    shortDesc: 'Complete food delivery app solution including Customer App, Restaurant Portal, and Driver GPS Tracking with live UPI payment.',
    detailedDesc: 'Deploy your own UberEats / Zomato style food delivery platform in weeks. Includes production-ready React Native apps for iOS & Android, real-time Socket.IO courier tracking, driver dispatch algorithms, and admin revenue dashboard.',
    features: [
      'Customer iOS & Android mobile apps (React Native)',
      'Live sub-50ms GPS courier coordinate tracking on Google Maps',
      'Restaurant kitchen order management tablet dashboard',
      'UPI, Razorpay, Cash-on-Delivery payment integration',
      'Push notification alerts for order milestones',
      'Full source code ownership & Play Store upload assistance'
    ],
    technologies: ['React Native', 'Node.js', 'Socket.IO', 'Google Maps API', 'Razorpay', 'MongoDB'],
    image: '/assets/images/project-mobile.svg',
    rating: '4.9 ★ (120+ launches)'
  },
  {
    id: 'fitcore-saas',
    name: 'FitCore Gym & Member Management SaaS',
    type: 'app',
    category: 'Business Software',
    badge: '50% OFF • Turnkey SaaS',
    originalPrice: 60000,
    shortDesc: 'Turnkey gym management platform with automated recurring membership billing, trainer booking calendar, and QR check-in gates.',
    detailedDesc: 'Stop losing recurring revenue to uncollected dues. FitCore automates member subscriptions, provides a dedicated member portal for workout scheduling, and gives franchise owners multi-branch revenue telemetry.',
    features: [
      'Dual-portal system: Member Web/Mobile app + Admin Dashboard',
      'Automated recurring subscription billing via Razorpay / Stripe',
      'Contactless QR code gym check-in scanner simulator',
      'Trainer private session scheduling & calendar sync',
      'Automated WhatsApp renewal reminders via Twilio/Gupshup',
      'Multi-branch membership analytics & staff payroll'
    ],
    technologies: ['Next.js', 'PostgreSQL', 'TailwindCSS', 'Stripe Billing', 'QR Code SDK', 'Docker'],
    image: '/assets/images/project-dashboard.svg',
    rating: '4.95 ★ (85+ gyms)'
  },
  {
    id: 'edunova-lms',
    name: 'EduNova Interactive LMS & Video Academy',
    type: 'app',
    category: 'Web Apps',
    badge: '50% OFF • Complete LMS',
    originalPrice: 70000,
    shortDesc: 'Full-featured online course academy with adaptive video streaming, interactive checkpoint quizzes, and automated certificate generator.',
    detailedDesc: 'Launch your own branded digital academy. Features DRM-protected video playback, student discussion forums, in-video knowledge tests, progress tracking, and instant PDF certificate generation upon course completion.',
    features: [
      'Modular curriculum builder with drag-and-drop lesson organization',
      'Adaptive HLS video player with speed control and bookmarking',
      'Interactive quiz engine with instant auto-grading and answer reviews',
      'Dynamic student progress percentage meter and milestone badges',
      'Automated branded PDF certificate generator',
      'Student community discussion board and teacher messaging'
    ],
    technologies: ['React 18', 'Node.js', 'Video.js', 'MongoDB', 'AWS S3', 'PDFKit'],
    image: '/assets/images/project-web.svg',
    rating: '4.9 ★ (200+ courses hosted)'
  },
  {
    id: 'estatex-portal',
    name: 'EstateX Luxury Real Estate & MLS Platform',
    type: 'app',
    category: 'Websites',
    badge: '50% OFF • High Conversion',
    originalPrice: 80000,
    shortDesc: 'High-end real estate portal with interactive map search, multi-factor filtering, HD photo galleries, and automated tour bookings.',
    detailedDesc: 'Engineered specifically for real estate developers, property agencies, and brokerage networks. Features sub-second amenity filtering, virtual tour integrations, lead capture modals, and automated calendar sync for private site visits.',
    features: [
      'Interactive property search with dynamic price, bed, and location sliders',
      'Interactive Leaflet / Google Maps property pins with cluster zoom',
      'Automated "Schedule a Private Tour" booking engine with calendar sync',
      'Built-in monthly mortgage and home loan EMI calculator',
      'Agent lead routing dashboard with instant WhatsApp inquiry pings',
      'SEO-optimized property listing pages with rich schema markup'
    ],
    technologies: ['Next.js', 'TailwindCSS', 'Leaflet Maps', 'PostgreSQL', 'Cloudinary', 'SendGrid'],
    image: '/assets/images/project-ecommerce.svg',
    rating: '4.9 ★ (40+ portals live)'
  },
  {
    id: 'jarvis-workspace',
    name: 'Jarvis AI Multi-Agent Enterprise Workspace',
    type: 'app',
    category: 'AI & ML',
    badge: '50% OFF • Enterprise AI',
    originalPrice: 60000,
    shortDesc: 'Intelligent AI assistant platform with multi-persona switching, private document Q&A (RAG), and syntax-highlighted code generation.',
    detailedDesc: 'Empower your company with a private AI workspace. Includes system personas for software architects, senior code reviewers, and business analysts, vector search over company documentation, and central API rate-limiting.',
    features: [
      'Multi-persona prompt switching (Architect, Coder, Analyst, Copywriter)',
      'Real-time streaming token generation via Server-Sent Events (SSE)',
      'Retrieval-Augmented Generation (RAG) over private PDF and DOC files',
      'Syntax-highlighted code display with 1-click clipboard copier',
      'Centralized enterprise API rate-limiting and token quota management',
      'Role-based departmental access controls & audit logs'
    ],
    technologies: ['OpenAI GPT-4', 'LangChain', 'Node.js', 'React', 'Pinecone Vector DB', 'Prism.js'],
    image: '/assets/images/project-ai.svg',
    rating: '4.98 ★ (95+ teams)'
  },
  {
    id: 'novacart-store',
    name: 'NovaCart Full-Stack E-Commerce Platform',
    type: 'app',
    category: 'Web Apps',
    badge: '50% OFF • E-Commerce Suite',
    originalPrice: 50000,
    shortDesc: 'Headless digital commerce store with slide-over cart drawer, instant cryptographic coupon engine, and 3-step checkout.',
    detailedDesc: 'Ditch slow, bloated marketplace plugins. NovaCart delivers sub-20ms catalog queries, instant faceted filtering, secure HMAC-SHA256 coupon validation, UPI and card payments, and automated invoice PDF generation.',
    features: [
      'Faceted product catalog filtering by category, price, and attributes',
      'Slide-over cart drawer with live subtotal and quantity increments',
      'Cryptographically secure server-validated promo code & coupon engine',
      'Single-page express checkout with address auto-complete',
      'Admin product inventory manager with low-stock alerts',
      'Automated customer email order receipt & shipment tracking number'
    ],
    technologies: ['React', 'Node.js', 'Express', 'Redis', 'MongoDB / Postgres', 'TailwindCSS'],
    image: '/assets/images/project-ecommerce.svg',
    rating: '4.92 ★ (180+ stores)'
  },
  {
    id: 'timeslot-booking',
    name: 'TimeSlot Pro Automated Scheduling Suite',
    type: 'app',
    category: 'Business Software',
    badge: '50% OFF • Booking Engine',
    originalPrice: 40000,
    shortDesc: 'Universal appointment booking engine with real-time timezone conversion, calendar invitation sync, and SMS/WhatsApp reminders.',
    detailedDesc: 'Eliminate double-booking errors and manual coordination. Customers choose services, select available dates, pick time slots, and pay deposits upfront, with automated Google/Outlook Calendar synchronization.',
    features: [
      'Live real-time time slot availability engine with buffer-time rules',
      'Google Calendar and Outlook Calendar bi-directional OAuth sync',
      'Automated WhatsApp and SMS reminder notifications before appointments',
      'Upfront deposit collection via UPI and card gateway',
      'Customer self-serve reschedule and cancellation portal',
      'Staff appointment allocation and daily timetable view'
    ],
    technologies: ['Next.js', 'TypeScript', 'Google Calendar API', 'Twilio', 'PostgreSQL', 'TailwindCSS'],
    image: '/assets/images/project-api.svg',
    rating: '4.89 ★ (300+ clinics/studios)'
  },
  {
    id: 'nexus-admin-suite',
    name: 'Nexus Admin Operations & Analytics Cockpit',
    type: 'app',
    category: 'Dashboards',
    badge: '50% OFF • Operations Cockpit',
    originalPrice: 40000,
    shortDesc: 'Comprehensive operations control panel with real-time SVG financial charts, user roster management, and live server telemetry.',
    detailedDesc: 'Gain total transparency over your business operations. Includes interactive time-series charts, user permission controls, instant table search and export, and live server CPU/RAM health monitoring.',
    features: [
      'Interactive Canvas & SVG revenue charts with time-range filtering',
      'Sortable, filterable client and user roster table with status toggles',
      'One-click data export to Excel, CSV, and formatted PDF reports',
      'Granular role-based permissions (SuperAdmin, Manager, Support)',
      'Live server telemetry: CPU usage, memory allocation, response latency',
      'Modern glassmorphic dark theme engineered for high operational focus'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'ApexCharts', 'Docker'],
    image: '/assets/images/project-dashboard.svg',
    rating: '4.94 ★ (150+ dashboards)'
  },
  {
    id: 'flowcraft-automation',
    name: 'FlowCraft Visual Workflow Automation Suite',
    type: 'app',
    category: 'Automation',
    badge: '50% OFF • Workflow Engine',
    originalPrice: 50000,
    shortDesc: 'Visual drag-and-drop automation builder connecting webhooks, AI LLMs, database updates, and multi-channel notification bots.',
    detailedDesc: 'Automate high-volume business workflows without writing repetitive glue code. Connect form submissions to AI summarization models, update customer records, and dispatch WhatsApp alerts in under 2 seconds.',
    features: [
      'Visual node-based canvas for multi-step workflow composition',
      'Live execution simulator with node-by-node payload inspection',
      'Pre-built integrations: WhatsApp, Slack, Gmail, Google Sheets, Stripe',
      'AI processing nodes for text extraction, classification, and summarization',
      'Distributed background job queuing with BullMQ and Redis',
      'Comprehensive error retry policies and execution failure alerts'
    ],
    technologies: ['Node.js', 'React Flow', 'OpenAI API', 'BullMQ', 'Redis', 'Docker'],
    image: '/assets/images/project-api.svg',
    rating: '4.96 ★ (70+ enterprise pipelines)'
  },
  {
    id: 'nexus-corp-web',
    name: 'Nexus High-Converting Corporate Web Presence',
    type: 'app',
    category: 'Websites',
    badge: '50% OFF • High Conversion',
    originalPrice: 30000,
    shortDesc: 'Cinema-grade business website built with smooth 3D micro-animations, interactive ROI calculators, and instant quote funnels.',
    detailedDesc: 'Transform corporate credibility into paying enterprise accounts. Delivers 99+ Google Lighthouse scores, customized interactive ROI calculators, glassmorphic styling, and seamless CRM lead capture.',
    features: [
      '100/100 Google PageSpeed and Core Web Vitals optimization',
      'Interactive business ROI & cost savings calculator with live sliders',
      'Smooth 3D WebGL micro-animations and physics-driven button states',
      'Multi-channel lead capture forms with instant WhatsApp and email notifications',
      'Dynamic case study spotlight accordion with real client metrics',
      'Bespoke dark aesthetic with custom brand color theming'
    ],
    technologies: ['Vite', 'HTML5/SCSS', 'Vanilla JS', 'Three.js', 'Tailwind', 'GSAP'],
    image: '/assets/images/project-web.svg',
    rating: '4.91 ★ (250+ websites launched)'
  },
  {
    id: 'android-native-package',
    name: 'Native Android Application Development Package',
    type: 'app',
    category: 'Mobile Apps',
    badge: '50% OFF • Custom Build',
    originalPrice: 50000,
    shortDesc: 'Bespoke native Android app engineered with Kotlin, Jetpack Compose, Room database, and Google Play Store submission.',
    detailedDesc: 'Full custom Android application engineering from Figma design to Play Store release. We craft smooth, 60fps applications with offline data caching, biometrics, GPS, and payment gateway integration.',
    features: [
      'Modern Jetpack Compose UI architecture',
      'Offline-first SQLite/Room database synchronization',
      'Google Play In-App Billing and UPI payment gateway',
      'Firebase Cloud Messaging for targeted push notifications',
      'Hardware integration: Camera, Biometrics, GPS & Bluetooth',
      'Play Store listing optimization and launch guarantee'
    ],
    technologies: ['Kotlin', 'Jetpack Compose', 'Room DB', 'Retrofit', 'Firebase', 'Android SDK'],
    image: '/assets/images/project-mobile.svg',
    rating: '4.9 ★ (60+ apps in Play Store)'
  },
  {
    id: 'cross-platform-package',
    name: 'Cross-Platform iOS & Android Mobile Package',
    type: 'app',
    category: 'Mobile Apps',
    badge: '50% OFF • iOS & Android',
    originalPrice: 60000,
    shortDesc: 'Unified cross-platform mobile application delivering native performance to both Apple App Store and Google Play simultaneously.',
    detailedDesc: 'Save 40% in engineering overhead with a unified React Native / Flutter codebase. Includes native device bridges, biometric security, state management, and continuous delivery via Fastlane.',
    features: [
      'Single codebase running natively on iOS and Android',
      'Smooth 60/120fps gesture animations and fluid navigation transitions',
      'Secure iOS Keychain and Android Keystore biometric sign-in',
      'Real-time WebSockets integration and background sync',
      'Both Apple App Store and Google Play Store submission guarantee',
      'Automated CI/CD build pipelines with Fastlane'
    ],
    technologies: ['React Native', 'Flutter', 'TypeScript', 'Redux Toolkit', 'Expo', 'Fastlane'],
    image: '/assets/images/project-mobile.svg',
    rating: '4.93 ★ (90+ mobile apps)'
  },
  {
    id: 'fullstack-web-package',
    name: 'Full-Stack Web Application Enterprise Package',
    type: 'app',
    category: 'Web Apps',
    badge: '50% OFF • Cloud Scale',
    originalPrice: 70000,
    shortDesc: 'Complete end-to-end full-stack web application with responsive React frontend, scalable Express backend, and managed database.',
    detailedDesc: 'Transform your operational workflows into a high-speed cloud platform. We handle architecture, database normalization, REST/GraphQL APIs, authentication, testing, and cloud deployment.',
    features: [
      'Single Page Application (SPA) architecture with React or Next.js',
      'Role-based access control (RBAC) and JWT/cookie session security',
      'ACID-compliant PostgreSQL or MongoDB document storage',
      'Real-time data synchronization with WebSockets / SSE',
      'Automated reporting: PDF, Excel, and CSV export modules',
      'Zero-downtime containerized cloud deployment on Render or AWS'
    ],
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Docker'],
    image: '/assets/images/project-web.svg',
    rating: '4.95 ★ (110+ web apps)'
  },
  {
    id: 'ai-bot-package',
    name: 'Conversational AI Chatbot & Agent System',
    type: 'app',
    category: 'AI & ML',
    badge: '50% OFF • 24/7 Smart Bot',
    originalPrice: 40000,
    shortDesc: 'Context-aware conversational AI assistant trained on your custom documentation, website FAQs, and product catalogs.',
    detailedDesc: 'Never miss an inquiry again. Deploy an intelligent conversational agent that resolves customer queries 24/7, captures qualified leads, and smoothly escalates to human agents via WhatsApp or web embed.',
    features: [
      'Trained on your private documents, FAQs, and product manuals',
      'Multi-channel: Website embed widget, WhatsApp, and Telegram',
      'Automated lead qualification and CRM contact creation',
      'Smooth human agent handover when sentiment requires',
      'Multi-lingual support across Hindi, English, and 50+ languages',
      'Conversation drop-off analytics and satisfaction scoring'
    ],
    technologies: ['OpenAI / Claude', 'Node.js', 'WebSockets', 'WhatsApp Cloud API', 'Redis', 'React'],
    image: '/assets/images/project-ai.svg',
    rating: '4.89 ★ (80+ bots live)'
  }
];

// Attach dynamic pricing properties to every product
const PRODUCTS_WITH_PRICING = DEVCRAFT_PRODUCTS.map(p => {
  const pricing = calculatePricing(p);
  return {
    ...p,
    ...pricing
  };
});

module.exports = {
  DEVCRAFT_PRODUCTS: PRODUCTS_WITH_PRICING,
  calculatePricing
};
