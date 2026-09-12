/**
 * DEVCRAFT - Master Products & Courses Catalog
 * Supports All App Products (50% OFF) and Aptitude Courses (30% OFF)
 * Categories: Android Apps, PC Software, AI Products, Utilities, Aptitude, Other Products
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
  // 1. FEATURED FLAGSHIP AI PRODUCTS
  // ==========================================
  {
    id: 'joya-ai',
    name: 'Joya AI — Autonomous Voice & Personal Mobile Assistant',
    type: 'app',
    category: 'Android Apps',
    platform: 'Android (APK)',
    badge: '50% OFF • Featured Voice AI',
    originalPrice: 2000,
    shortDesc: 'Autonomous voice-first personal assistant for Android with custom wake word "Wake up Joya", offline intent parsing, WhatsApp automation, and background intelligence.',
    detailedDesc: 'Joya AI transforms your Android smartphone into a responsive voice-commanded intelligence station. Powered by an on-device lightweight voice neural engine, Joya responds instantaneously to the wake phrase "Wake up Joya", executes multi-step app tasks (sending WhatsApp messages, making calls, setting alarms, taking voice memos), and operates seamlessly in the background without draining your battery.',
    features: [
      'Custom responsive wake word detection ("Wake up Joya")',
      'Hands-free app automation: WhatsApp, Phone Dialer, Music, Maps',
      'On-device offline voice synthesis & fast sub-100ms speech intent recognition',
      'Continuous background service with smart battery-saver sleeping states',
      'Context-aware conversational intelligence & memory store',
      'Zero analytics telemetry leakage — 100% private and user-controlled'
    ],
    wakeWord: 'Wake up Joya',
    version: 'v2.4.0',
    requirements: 'Android 8.0 (Oreo) or higher, 2GB+ RAM, Microphone permission',
    changelog: [
      { version: 'v2.4.0', date: '2026-08-15', notes: 'Enhanced offline wake-word acoustic model; battery drain reduced by 35%.' },
      { version: 'v2.3.0', date: '2026-06-20', notes: 'Added direct WhatsApp message dictation and quick call triggers.' },
      { version: 'v2.0.0', date: '2026-03-10', notes: 'Major rewrite with Neural TTS audio synthesizer and modular skill engine.' }
    ],
    fileDetails: {
      filename: 'joya-ai-v2.4.0.apk',
      size: '48.2 MB',
      releaseDate: '2026-08-15',
      isFree: false,
      hasDownload: true
    },
    technologies: ['Kotlin', 'Android NDK', 'Porcupine Wake Word', 'TensorFlow Lite', 'Room DB', 'Coroutines'],
    image: '/assets/images/project-ai.svg',
    screenshots: ['/assets/images/project-ai.svg', '/assets/images/project-mobile.svg'],
    rating: '4.98 ★ (3,200+ Android users)'
  },
  {
    id: 'jarvis-ai',
    name: 'Jarvis AI — Desktop Intelligence & Workflow Automation Agent',
    type: 'app',
    category: 'PC Software',
    platform: 'Windows / PC (Desktop)',
    badge: '50% OFF • Desktop AI Agent',
    originalPrice: 4000,
    shortDesc: 'Autonomous desktop AI assistant for PC with voice command listening, terminal execution, active file management, web scraping, and local LLM bridge.',
    detailedDesc: 'Take total command of your desktop computing environment. Jarvis AI integrates directly into your operating system to index your workspace files, launch apps, write and execute shell scripts, scrape dynamic web data, and query local LLMs (via Ollama or cloud models) without leaving your active workflow.',
    features: [
      'Always-on desktop voice listener & hotkey activation (Ctrl+Space)',
      'File System Sentinel: Instant semantic search, duplicate cleaner, file tagger',
      'Automated browser workflow executor for data scraping & form filling',
      'Seamless local LLM bridge (Ollama / Llama-3) and OpenAI / Claude fallback',
      'System telemetry monitoring: CPU/GPU temps, RAM usage, process killer',
      'Custom automation macro recorder & Python/Node.js script runner'
    ],
    version: 'v3.1.2',
    requirements: 'Windows 10/11 64-bit, macOS 12+, or Ubuntu 20.04+, 8GB RAM, 2GB Free Disk Space',
    changelog: [
      { version: 'v3.1.2', date: '2026-08-20', notes: 'Direct Ollama local model bridge; native Windows 11 Fluent dark glass UI.' },
      { version: 'v3.0.0', date: '2026-05-12', notes: 'Architectural overhaul: Multi-threaded voice agent and desktop vision preview.' },
      { version: 'v2.5.0', date: '2026-01-18', notes: 'Added automated browser scraping and macro recording engine.' }
    ],
    fileDetails: {
      filename: 'jarvis-ai-desktop-v3.1.2.exe',
      size: '118.5 MB',
      releaseDate: '2026-08-20',
      isFree: false,
      hasDownload: true
    },
    technologies: ['Electron', 'Node.js', 'Python', 'Ollama', 'PyAutoGUI', 'Prism.js'],
    image: '/assets/images/project-dashboard.svg',
    screenshots: ['/assets/images/project-dashboard.svg', '/assets/images/project-ai.svg'],
    rating: '4.96 ★ (2,100+ developers & creators)'
  },

  // ==========================================
  // 2. ANDROID APPS (50% OFF)
  // ==========================================
  {
    id: 'cravex-app',
    name: 'CraveX Food Delivery Mobile App Suite',
    type: 'app',
    category: 'Android Apps',
    platform: 'Android & iOS',
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
    version: 'v4.2.0',
    fileDetails: { filename: 'cravex-mobile-suite-v4.2.0.zip', size: '64.8 MB', releaseDate: '2026-07-10', isFree: false, hasDownload: true },
    technologies: ['React Native', 'Node.js', 'Socket.IO', 'Google Maps API', 'Razorpay', 'MongoDB'],
    image: '/assets/images/project-mobile.svg',
    rating: '4.9 ★ (120+ launches)'
  },
  {
    id: 'titanfit-companion',
    name: 'Titan Fitness Android Companion & Tracker',
    type: 'app',
    category: 'Android Apps',
    platform: 'Android',
    badge: '50% OFF • Fitness Tracker',
    originalPrice: 40000,
    shortDesc: 'Progressive fitness companion app with automated workout logging, macro analytics, step tracking, and offline syncing.',
    detailedDesc: 'Engineered for personal trainers and gym enthusiasts. Features custom workout split builders, rest timers with audio cues, body measurement charts, and sensor-based pedometer integration.',
    features: [
      'Custom workout split routines and exercise movement library',
      'Rest timer with audio chimes and background notifications',
      'Macro & calorie intake calculation with food barcode scanner',
      'Offline-first Room database sync with Google Fit / Health Connect',
      'Progress photo timeline with biometric privacy protection',
      'Export training logs to CSV, Excel, and PDF formats'
    ],
    version: 'v2.1.0',
    fileDetails: { filename: 'titanfit-companion-v2.1.0.apk', size: '36.4 MB', releaseDate: '2026-06-15', isFree: false, hasDownload: true },
    technologies: ['Android / Kotlin', 'Jetpack Compose', 'Health Connect', 'Room DB', 'MPAndroidChart'],
    image: '/assets/images/project-mobile.svg',
    rating: '4.91 ★ (850+ users)'
  },

  // ==========================================
  // 3. PC SOFTWARE & DESKTOP TOOLS (50% OFF)
  // ==========================================
  {
    id: 'pulseflow-desktop',
    name: 'PulseFlow SaaS Operations & Telemetry Desktop',
    type: 'app',
    category: 'PC Software',
    platform: 'Windows / PC (Desktop)',
    badge: '50% OFF • Operations Monitor',
    originalPrice: 45000,
    shortDesc: 'High-throughput system telemetry and cloud operations desktop dashboard with dark glassmorphic UI, CPU/RAM telemetry, and alert triggers.',
    detailedDesc: 'Real-time infrastructure monitor for DevOps engineers and system administrators. Monitors cloud server metrics, Docker container states, Redis cache latencies, and triggers desktop system tray alerts on CPU spikes.',
    features: [
      'Real-time system tray icon with live CPU/RAM utilization mini-gauges',
      'Direct SSH/WebSocket telemetry pipe to cloud server nodes',
      'Docker container inspector: logs streaming, restart, stop, memory limits',
      'Configurable alert thresholds with audio alarms and webhook dispatch',
      'Zero-footprint lightweight Electron / Rust native bridge',
      'Encrypted credential store for server SSH keys and tokens'
    ],
    version: 'v2.8.0',
    fileDetails: { filename: 'pulseflow-desktop-setup-v2.8.0.exe', size: '72.1 MB', releaseDate: '2026-07-28', isFree: false, hasDownload: true },
    technologies: ['Electron', 'TypeScript', 'Node.js', 'Chart.js', 'SSH2', 'WebSockets'],
    image: '/assets/images/project-dashboard.svg',
    rating: '4.94 ★ (340+ DevOps teams)'
  },
  {
    id: 'flowcraft-automation',
    name: 'FlowCraft Visual Workflow Automation Suite',
    type: 'app',
    category: 'PC Software',
    platform: 'Windows & Web',
    badge: '50% OFF • Workflow Engine',
    originalPrice: 50000,
    shortDesc: 'Visual node-based automation engine connecting webhooks, AI models, database updates, and multi-channel notification bots.',
    detailedDesc: 'Automate repetitive workflows without writing complex glue code. Drag and drop trigger nodes, configure AI text transformations, transform JSON payloads, and dispatch notifications across WhatsApp, Slack, and email.',
    features: [
      'Visual node-based canvas for multi-step workflow composition',
      'Live execution simulator with node-by-node payload inspection',
      'Pre-built integrations: WhatsApp, Slack, Gmail, Google Sheets, Stripe',
      'AI processing nodes for text extraction, classification, and summarization',
      'Distributed background job queuing with BullMQ and Redis',
      'Comprehensive error retry policies and execution failure alerts'
    ],
    version: 'v3.0.4',
    fileDetails: { filename: 'flowcraft-automation-suite-v3.0.4.zip', size: '88.3 MB', releaseDate: '2026-08-05', isFree: false, hasDownload: true },
    technologies: ['Node.js', 'React Flow', 'OpenAI API', 'BullMQ', 'Redis', 'Docker'],
    image: '/assets/images/project-api.svg',
    rating: '4.96 ★ (70+ enterprise pipelines)'
  },

  // ==========================================
  // 4. AI PRODUCTS (50% OFF)
  // ==========================================
  {
    id: 'neuralcraft-ai',
    name: 'NeuralCraft Autonomous AI Workflow Engine',
    type: 'app',
    category: 'AI Products',
    platform: 'Web & API',
    badge: '50% OFF • Autonomous AI',
    originalPrice: 80000,
    shortDesc: 'Full-stack AI prompt-to-app generator with real-time streaming, AST code synthesis, and interactive sandbox preview.',
    detailedDesc: 'Build and deploy full software components with natural language prompts. Features multi-agent collaboration, AST-verified code modifications, and immediate sandbox hot-reloading.',
    features: [
      'Multi-model fallback architecture: Claude 3.5 Sonnet, GPT-4o, DeepSeek',
      'Syntax tree (AST) code validation preventing hallucinated syntax errors',
      'Integrated WebAssembly sandbox for live in-browser preview',
      'Automated Git commit integration and branch deployment',
      'Token consumption metering with granular cost controls',
      'REST API and WebSockets for programmatic agent invocation'
    ],
    version: 'v1.9.0',
    fileDetails: { filename: 'neuralcraft-ai-core-v1.9.0.zip', size: '52.0 MB', releaseDate: '2026-07-15', isFree: false, hasDownload: true },
    technologies: ['React', 'Node.js', 'Express', 'OpenAI API', 'Tailwind CSS', 'WebSockets'],
    image: '/assets/images/project-ai.svg',
    rating: '4.97 ★ (450+ developers)'
  },
  {
    id: 'ai-bot-package',
    name: 'Conversational AI Chatbot & Agent System',
    type: 'app',
    category: 'AI Products',
    platform: 'Web & WhatsApp',
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
    version: 'v3.2.0',
    fileDetails: { filename: 'devcraft-chatbot-agent-v3.2.0.zip', size: '28.6 MB', releaseDate: '2026-08-01', isFree: false, hasDownload: true },
    technologies: ['OpenAI / Claude', 'Node.js', 'WebSockets', 'WhatsApp Cloud API', 'Redis', 'React'],
    image: '/assets/images/project-ai.svg',
    rating: '4.89 ★ (80+ bots live)'
  },

  // ==========================================
  // 5. UTILITIES & BUSINESS TOOLS (50% OFF)
  // ==========================================
  {
    id: 'timeslot-booking',
    name: 'TimeSlot Pro Automated Scheduling Suite',
    type: 'app',
    category: 'Utilities',
    platform: 'Web & Mobile',
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
    version: 'v2.4.1',
    fileDetails: { filename: 'timeslot-pro-v2.4.1.zip', size: '34.5 MB', releaseDate: '2026-07-22', isFree: false, hasDownload: true },
    technologies: ['Next.js', 'TypeScript', 'Google Calendar API', 'Twilio', 'PostgreSQL', 'TailwindCSS'],
    image: '/assets/images/project-api.svg',
    rating: '4.89 ★ (300+ clinics/studios)'
  },
  {
    id: 'nexus-admin-suite',
    name: 'Nexus Admin Operations & Analytics Cockpit',
    type: 'app',
    category: 'Utilities',
    platform: 'Web Application',
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
    version: 'v2.0.0',
    fileDetails: { filename: 'nexus-admin-cockpit-v2.0.0.zip', size: '42.1 MB', releaseDate: '2026-07-30', isFree: false, hasDownload: true },
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'ApexCharts', 'Docker'],
    image: '/assets/images/project-dashboard.svg',
    rating: '4.94 ★ (150+ dashboards)'
  },

  // ==========================================
  // 6. APTITUDE & PLACEMENT COURSES (30% DISCOUNT)
  // ==========================================
  {
    id: 'aptitude-mastery',
    name: 'Developer Aptitude & Problem Solving Mastery',
    type: 'aptitude',
    category: 'Aptitude',
    platform: 'Web Course & Portal',
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
    version: '2026 Edition',
    fileDetails: { filename: 'aptitude-mastery-syllabus-bundle.pdf', size: '18.4 MB', releaseDate: '2026-08-01', isFree: false, hasDownload: true },
    technologies: ['Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation', 'Coding Logic', 'Speed Math'],
    image: '/assets/images/project-api.svg',
    rating: '4.95 ★ (1,400+ students)'
  },
  {
    id: 'aptitude-quant-logical',
    name: 'Technical Quantitative & Logical Assessment Pack',
    type: 'aptitude',
    category: 'Aptitude',
    platform: 'Web Course & Portal',
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
    version: '2026 Edition',
    fileDetails: { filename: 'quant-logical-question-bank.pdf', size: '14.2 MB', releaseDate: '2026-07-15', isFree: false, hasDownload: true },
    technologies: ['Mental Math', 'Logical Deduction', 'Syllogisms', 'Puzzles', 'Time-Speed-Distance'],
    image: '/assets/images/project-web.svg',
    rating: '4.9 ★ (890+ students)'
  },
  {
    id: 'aptitude-placement-bootcamp',
    name: 'Campus Placement & Company Coding Aptitude Accelerator',
    type: 'aptitude',
    category: 'Aptitude',
    platform: 'Web Bootcamp',
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
    version: '2026 Edition',
    fileDetails: { filename: 'campus-placement-accelerator-curriculum.pdf', size: '24.6 MB', releaseDate: '2026-08-10', isFree: false, hasDownload: true },
    technologies: ['Campus Placement', 'Core CS', 'Verbal Reasoning', 'Mock Interviews', 'Aptitude Drills'],
    image: '/assets/images/project-dashboard.svg',
    rating: '4.98 ★ (2,100+ graduates)'
  },
  {
    id: 'aptitude-cs-fundamentals',
    name: 'Core CS Fundamentals & Algorithmic Aptitude Pack',
    type: 'aptitude',
    category: 'Aptitude',
    platform: 'Web Course & Portal',
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
    version: '2026 Edition',
    fileDetails: { filename: 'core-cs-fundamentals-notes.pdf', size: '21.0 MB', releaseDate: '2026-07-20', isFree: false, hasDownload: true },
    technologies: ['Operating Systems', 'DBMS', 'Computer Networks', 'DSA Logic', 'SQL Puzzles'],
    image: '/assets/images/project-ai.svg',
    rating: '4.88 ★ (750+ students)'
  },
  {
    id: 'aptitude-mock-simulator',
    name: 'Full-Stack Mock Aptitude & Technical Simulator',
    type: 'aptitude',
    category: 'Aptitude',
    platform: 'Web Simulator Platform',
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
    version: '2026 Edition',
    fileDetails: { filename: 'mock-simulator-portal-access.pdf', size: '12.8 MB', releaseDate: '2026-08-05', isFree: false, hasDownload: true },
    technologies: ['Exam Simulator', 'Timed Pressure Drills', 'Analytics Heatmap', 'AMCAT Pattern', 'CoCubes Pattern'],
    image: '/assets/images/project-ecommerce.svg',
    rating: '4.92 ★ (1,150+ students)'
  },

  // ==========================================
  // 7. OTHER PRODUCTS & SOFTWARE SERVICES (50% OFF)
  // ==========================================
  {
    id: 'fitcore-saas',
    name: 'FitCore Gym & Member Management SaaS',
    type: 'app',
    category: 'Other Products',
    platform: 'Web & Mobile SaaS',
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
    version: 'v3.5.0',
    fileDetails: { filename: 'fitcore-saas-distribution-v3.5.0.zip', size: '58.0 MB', releaseDate: '2026-07-12', isFree: false, hasDownload: true },
    technologies: ['Next.js', 'PostgreSQL', 'TailwindCSS', 'Stripe Billing', 'QR Code SDK', 'Docker'],
    image: '/assets/images/project-dashboard.svg',
    rating: '4.95 ★ (85+ gyms)'
  },
  {
    id: 'edunova-lms',
    name: 'EduNova Interactive LMS & Video Academy',
    type: 'app',
    category: 'Other Products',
    platform: 'Web Academy Platform',
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
    version: 'v4.0.1',
    fileDetails: { filename: 'edunova-lms-package-v4.0.1.zip', size: '76.4 MB', releaseDate: '2026-07-18', isFree: false, hasDownload: true },
    technologies: ['React 18', 'Node.js', 'Video.js', 'MongoDB', 'AWS S3', 'PDFKit'],
    image: '/assets/images/project-web.svg',
    rating: '4.9 ★ (200+ courses hosted)'
  },
  {
    id: 'estatex-portal',
    name: 'EstateX Luxury Real Estate & MLS Platform',
    type: 'app',
    category: 'Other Products',
    platform: 'Web Platform',
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
    version: 'v2.2.0',
    fileDetails: { filename: 'estatex-portal-v2.2.0.zip', size: '54.2 MB', releaseDate: '2026-06-25', isFree: false, hasDownload: true },
    technologies: ['Next.js', 'TailwindCSS', 'Leaflet Maps', 'PostgreSQL', 'Cloudinary', 'SendGrid'],
    image: '/assets/images/project-ecommerce.svg',
    rating: '4.9 ★ (40+ portals live)'
  },
  {
    id: 'novacart-store',
    name: 'NovaCart Full-Stack E-Commerce Platform',
    type: 'app',
    category: 'Other Products',
    platform: 'Web Store Suite',
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
    version: 'v3.1.0',
    fileDetails: { filename: 'novacart-ecommerce-v3.1.0.zip', size: '61.9 MB', releaseDate: '2026-07-05', isFree: false, hasDownload: true },
    technologies: ['React', 'Node.js', 'Express', 'Redis', 'MongoDB / Postgres', 'TailwindCSS'],
    image: '/assets/images/project-ecommerce.svg',
    rating: '4.92 ★ (180+ stores)'
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
