const DEVCRAFT_SERVICES = [
  {
    id: 'android-app',
    icon: 'android',
    name: 'Android App Development',
    category: 'Mobile Apps',
    badge: 'Native Android',
    shortDesc: 'High-performance native Android apps built with Kotlin, Jetpack Compose, and modern architecture.',
    detailedDesc: 'We architect and build top-tier Android mobile applications from concept to Google Play Store launch. Focused on smooth 60fps UI, offline-first SQLite/Room caching, real-time push notifications, and robust hardware integration (camera, GPS, biometrics).',
    features: [
      'Modern Jetpack Compose & Material 3 UI systems',
      'Offline caching & Room database synchronization',
      'Google Play Billing, In-App Purchases & UPI Gateway',
      'Firebase Cloud Messaging for targeted push alerts',
      'Hardware access: Bluetooth, GPS, Biometrics & NFC',
      'Full Play Store compliance & release automation'
    ],
    useCases: [
      'Customer food ordering & on-demand delivery apps',
      'Field sales force tracking & logistics companions',
      'Healthcare patient vitals & prescription tracking',
      'Fitness companion & gym workout trackers'
    ],
    technologies: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Room DB', 'Retrofit', 'Firebase'],
    linkedDemoId: 'cravex',
    pricingStarting: '₹24,999'
  },
  {
    id: 'mobile-app',
    icon: 'smartphone',
    name: 'Mobile App Development',
    category: 'Mobile Apps',
    badge: 'iOS & Android',
    shortDesc: 'Cross-platform mobile apps engineered with React Native and Flutter with single-codebase efficiency.',
    detailedDesc: 'Deliver seamless experiences to both iOS and Android users simultaneously without compromising native performance. We leverage React Native and Flutter to build production applications featuring fluid gesture animations, state management, and unified design systems.',
    features: [
      'Cross-platform codebase (iOS + Android 98% shared code)',
      'Smooth 60/120fps gesture animations & micro-interactions',
      'Secure keychain storage & biometric sign-in',
      'Real-time WebSockets & background sync',
      'App Store & Google Play submission guarantee',
      'Automated CI/CD pipelines via Fastlane'
    ],
    useCases: [
      'E-commerce & retail mobile shopping apps',
      'Personal finance, expense & portfolio trackers',
      'Community social networking & creator platforms',
      'Membership & event ticketing apps'
    ],
    technologies: ['React Native', 'Flutter', 'TypeScript', 'Redux Toolkit', 'Expo', 'Swift/Kotlin'],
    linkedDemoId: 'fitcore',
    pricingStarting: '₹29,999'
  },
  {
    id: 'website-dev',
    icon: 'globe',
    name: 'Website Development',
    category: 'Websites',
    badge: 'High Performance & SEO',
    shortDesc: 'Ultra-fast, responsive business websites optimized for search rankings, conversions, and speed.',
    detailedDesc: 'Your website is your digital flagship. We design and develop bespoke, responsive websites with cinematic visuals, 100/100 Google PageSpeed scores, semantic SEO tags, and conversion-focused copy layout that turns visitors into high-paying clients.',
    features: [
      'Perfect 95-100 Google Lighthouse & Core Web Vitals',
      'Interactive 3D Three.js & WebGL visual sections',
      'Structured schema markup for top Google rankings',
      'CMS integration (Headless Strapi, Sanity, or WordPress)',
      'Lead capture forms with automated email & WhatsApp alerts',
      'Enterprise SSL, CDN caching & DDoS shielding'
    ],
    useCases: [
      'Corporate B2B & venture capital agency portfolios',
      'Law firms, chartered accountants & consulting offices',
      'High-converting SaaS product marketing pages',
      'Real estate builder & luxury villa showcase sites'
    ],
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'HTML5/CSS3', 'Three.js', 'Cloudflare'],
    linkedDemoId: 'business-website',
    pricingStarting: '₹14,999'
  },
  {
    id: 'web-app',
    icon: 'layout',
    name: 'Web App Development',
    category: 'Web Apps',
    badge: 'Cloud Scale & Dynamic',
    shortDesc: 'Complex single-page applications and client portals with reactive state and instant data rendering.',
    detailedDesc: 'Transform desktop software and legacy spreadsheets into lightning-fast, reactive browser applications. We engineer complex web applications featuring multi-tenant authentication, dynamic drag-and-drop dashboards, interactive data tables, and instant state syncing.',
    features: [
      'Single Page Application (SPA) architecture with React/Vue',
      'Role-based access control (RBAC) & fine-grained permissions',
      'Real-time collaborative editing & live table filters',
      'Export capabilities: automated PDF, CSV, Excel generation',
      'Progressive Web App (PWA) offline installation support',
      'End-to-end automated testing with Cypress and Playwright'
    ],
    useCases: [
      'Client relationship portals & service ticketing desks',
      'Online educational coaching & test examination systems',
      'Interactive property search & real estate directories',
      'Internal team operations & resource scheduling hubs'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Redis'],
    linkedDemoId: 'estatex',
    pricingStarting: '₹34,999'
  },
  {
    id: 'fullstack-dev',
    icon: 'layers',
    name: 'Full-Stack Development',
    category: 'Web Apps',
    badge: 'End-to-End Engineering',
    shortDesc: 'Complete end-to-end engineering covering modern frontends, scalable backends, and cloud databases.',
    detailedDesc: 'From database schema normalization to pixel-perfect UI execution, our full-stack engineering ensures every tier of your software functions in harmony. We handle architecture, API design, security, server tuning, and deployment with zero handoff friction.',
    features: [
      'Unified TypeScript stack across frontend and backend',
      'REST & GraphQL API design with OpenAPI documentation',
      'ACID-compliant transactional relational & NoSQL schemas',
      'Zero-downtime rolling deployments on AWS/Render/DigitalOcean',
      'Comprehensive error handling, request logging & monitoring',
      'High concurrency handling with caching & connection pooling'
    ],
    useCases: [
      'Custom online marketplaces connecting buyers and sellers',
      'Multi-vendor logistics & fleet dispatch platforms',
      'Fintech payment splitting & escrow management software',
      'Healthcare clinic management & patient record systems'
    ],
    technologies: ['Node.js', 'Express', 'React', 'MongoDB', 'PostgreSQL', 'Docker'],
    linkedDemoId: 'admin-dashboard',
    pricingStarting: '₹39,999'
  },
  {
    id: 'custom-software',
    icon: 'cpu',
    name: 'Custom Software Development',
    category: 'Business Software',
    badge: 'Tailored Business Logic',
    shortDesc: 'Tailor-made software solutions engineered precisely to match your unique operational business logic.',
    detailedDesc: 'Off-the-shelf software forces your business into someone else\'s workflow. We build custom bespoke software that matches your exact organizational processes, removes operational bottlenecks, and scales with your team\'s revenue growth.',
    features: [
      'Custom business workflow automation & rule engines',
      'Legacy software migration & database modernization',
      'Hardware peripherals integration: barcode, thermal printers, RFID',
      'Fine-grained multi-department role and access policies',
      'On-premise or private cloud deployment capability',
      'Complete intellectual property & source code handover'
    ],
    useCases: [
      'Manufacturing inventory, raw materials & batch tracking',
      'Custom billing, invoicing & GST compliance suites',
      'Gym, fitness club & member subscription management',
      'Educational institute ERP & examination controllers'
    ],
    technologies: ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'Prisma', 'Linux/Docker'],
    linkedDemoId: 'fitcore',
    pricingStarting: '₹44,999'
  },
  {
    id: 'saas-dev',
    icon: 'cloud',
    name: 'SaaS Development',
    category: 'Web Apps',
    badge: 'Multi-Tenant Architecture',
    shortDesc: 'Scalable Software-as-a-Service platforms featuring subscription billing, multi-tenancy, and onboarding.',
    detailedDesc: 'Build and launch your next recurring-revenue product. We engineer multi-tenant SaaS platforms with automated self-serve customer onboarding, subscription billing via Stripe and Razorpay, team invite tiers, usage quotas, and analytical dashboards.',
    features: [
      'Isolated multi-tenant data architecture (row-level or DB isolation)',
      'Recurring subscription billing & automated invoice receipts',
      'Customer onboarding checklist & self-serve tour widgets',
      'Tiered feature gating, API key issuance & usage rate limits',
      'Audit log tracking, compliance & session management',
      'Telemetry tracking for MRR, Churn, LTV, and customer health'
    ],
    useCases: [
      'B2B productivity tools & marketing automation software',
      'Real estate listing & lead distribution SaaS for brokers',
      'Appointment scheduling & customer CRM for clinics & salons',
      'Developer analytics & server infrastructure monitors'
    ],
    technologies: ['Next.js', 'Node.js', 'Stripe / Razorpay', 'Supabase', 'PostgreSQL', 'Redis'],
    linkedDemoId: 'edunova',
    pricingStarting: '₹49,999'
  },
  {
    id: 'ai-app-dev',
    icon: 'sparkles',
    name: 'AI Application Development',
    category: 'AI',
    badge: 'Intelligent Systems',
    shortDesc: 'AI-infused applications powered by LLMs, semantic vector search, and automated content generation.',
    detailedDesc: 'Elevate your business capabilities with intelligent AI integrations. We build custom applications that leverage state-of-the-art Large Language Models, embeddings, and vector databases for semantic document Q&A, automated report generation, and intelligent data extraction.',
    features: [
      'RAG (Retrieval-Augmented Generation) over private PDF/DOCs',
      'Semantic search & embeddings using Pinecone / pgvector',
      'Automated multi-step reasoning workflows with LangChain',
      'Real-time streaming text and token responses',
      'Intelligent prompt engineering, guardrails & fallback safety',
      'Cost optimization via semantic response caching'
    ],
    useCases: [
      'Internal corporate knowledge bases and SOP query engines',
      'Automated legal contract clause review and risk analysis',
      'Intelligent code analysis, refactoring & documentation tools',
      'AI marketing copy, email outreach & blog draft generators'
    ],
    technologies: ['OpenAI API', 'LangChain', 'Python / Node.js', 'Pinecone', 'pgvector', 'React'],
    linkedDemoId: 'jarvis',
    pricingStarting: '₹34,999'
  },
  {
    id: 'ai-chatbot',
    icon: 'message-square',
    name: 'AI Chatbot Development',
    category: 'AI',
    badge: '24/7 Smart Conversations',
    shortDesc: 'Context-aware conversational AI chatbots that resolve customer queries and capture qualified leads.',
    detailedDesc: 'Never miss a customer inquiry again. We deploy intelligent conversational bots trained on your exact business knowledge base. Our chatbots answer complex FAQs, qualify sales leads, book appointments, and smoothly hand off to human agents when needed.',
    features: [
      'Trained on your website, PDFs, manuals & past tickets',
      'Multi-channel: Website embed widget, WhatsApp & Telegram',
      'Automated lead qualification and CRM contact creation',
      'Instant human agent takeover when sentiment requires',
      'Multi-lingual conversation support (Hindi, English & 50+ languages)',
      'Conversation analytics, drop-off points & satisfaction scoring'
    ],
    useCases: [
      'E-commerce order tracking, refund FAQs & product finder',
      'Real estate instant property availability & site visit booking',
      'Education course inquiry, fee structure & syllabus bot',
      'Hospital & clinic patient appointment reservation bot'
    ],
    technologies: ['OpenAI / Claude', 'Node.js', 'WebSockets', 'WhatsApp Cloud API', 'Redis', 'React'],
    linkedDemoId: 'ai-automation',
    pricingStarting: '₹19,999'
  },
  {
    id: 'ai-assistant',
    icon: 'bot',
    name: 'AI Assistant Development',
    category: 'AI',
    badge: 'Executive Productivity',
    shortDesc: 'Custom autonomous assistants capable of executing multi-step tasks, scheduling, and research.',
    detailedDesc: 'Imagine having a brilliant 24/7 technical copilot. We create customized AI assistants designed to organize tasks, summarize lengthy documents, monitor metrics, draft correspondence, and execute API-driven tool calls across your business software.',
    features: [
      'Voice input & natural text command processing',
      'Function calling & automated third-party tool execution',
      'Persistent cross-session conversational memory',
      'Real-time system, metric & server monitoring dashboards',
      'Automated task checklists & deadline reminders',
      'Local-first fallback with optional private LLM deployment'
    ],
    useCases: [
      'Executive dashboard assistant for daily sales & KPI recaps',
      'Developer companion for debugging, tests & code generation',
      'Researcher assistant for aggregating news, patents & papers',
      'Customer support team assistant drafting verified responses'
    ],
    technologies: ['Python / Node.js', 'LLM Function Calling', 'Web Speech API', 'React', 'Tailwind', 'Vector DB'],
    linkedDemoId: 'jarvis',
    pricingStarting: '₹29,999'
  },
  {
    id: 'business-automation',
    icon: 'zap',
    name: 'Business Automation',
    category: 'Automation',
    badge: 'Zero Manual Busywork',
    shortDesc: 'Automated digital pipelines connecting CRMs, payment gateways, WhatsApp, and internal workflows.',
    detailedDesc: 'Eliminate repetitive, error-prone manual copy-pasting across your business. We build automated data pipelines that connect your website forms, payment processors, WhatsApp, Google Sheets, ERPs, and accounting software into a cohesive machine.',
    features: [
      'Visual trigger-action workflow architecture',
      'Automated WhatsApp & Email notifications upon payment',
      'Bi-directional CRM synchronization (HubSpot, Zoho, Notion)',
      'Automated PDF invoice generation & WhatsApp delivery',
      'Scheduled data reconciliation & error notification webhooks',
      'Significant reduction in manual data entry payroll hours'
    ],
    useCases: [
      'Lead auto-assignment to sales reps with instant WhatsApp ping',
      'Instant customer onboarding after successful Razorpay checkout',
      'Automated monthly gym / coaching fee payment reminders',
      'Daily executive revenue digest sent to Telegram/WhatsApp'
    ],
    technologies: ['Node.js', 'Webhooks', 'WhatsApp API', 'Razorpay API', 'Zapier/Make', 'Cron Jobs'],
    linkedDemoId: 'ai-automation',
    pricingStarting: '₹19,999'
  },
  {
    id: 'api-dev',
    icon: 'share-2',
    name: 'API Development & Integration',
    category: 'Web Apps',
    badge: 'High-Throughput & Secure',
    shortDesc: 'Enterprise REST and GraphQL APIs with token authentication, caching, rate-limiting, and docs.',
    detailedDesc: 'Connect systems smoothly and reliably. We build robust, well-documented RESTful and GraphQL APIs designed to serve millions of requests with sub-100ms response times, JWT/OAuth2 authentication, Redis caching, and automated Swagger/OpenAPI docs.',
    features: [
      'Clean OpenAPI / Swagger interactive documentation',
      'JWT, OAuth2 & HMAC API key validation middleware',
      'Redis distributed caching & request rate-limiting',
      'Third-party payment, shipping, SMS & WhatsApp integrations',
      'Structured JSON error payloads with RFC 7807 compliance',
      'Webhook listener architecture with automatic retry queues'
    ],
    useCases: [
      'Unified mobile app and web app shared backend gateway',
      'Payment gateway integrations (Razorpay, Cashfree, Stripe)',
      'Logistics courier tracking APIs (Shiprocket, Delhivery)',
      'Third-party partner developer API ecosystems'
    ],
    technologies: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'Swagger/OpenAPI', 'Docker'],
    linkedDemoId: 'admin-dashboard',
    pricingStarting: '₹21,999'
  },
  {
    id: 'admin-dashboard',
    icon: 'bar-chart-2',
    name: 'Admin Dashboard Development',
    category: 'Dashboards',
    badge: 'Operations Control Center',
    shortDesc: 'Custom business administration panels with interactive charts, user management, and metrics.',
    detailedDesc: 'Gain 100% control over your business metrics. We engineer tailored administrative back-offices featuring real-time graphical data visualizations, order and customer rosters, status toggles, user permissions, and one-click data exports.',
    features: [
      'Interactive Canvas/SVG line, bar, doughnut & area charts',
      'Advanced data tables: sorting, multi-column search, pagination',
      'One-click CSV, Excel and PDF report generation',
      'Granular role-based permissions (Owner, Manager, Staff)',
      'Audit log of all critical edits, deletions & updates',
      'Dark/Light theme support with ergonomic glass aesthetics'
    ],
    useCases: [
      'E-commerce order fulfillment & inventory tracking dashboard',
      'SaaS recurring revenue, user churn & subscription metrics',
      'School/Coaching student attendance & grade management',
      'Gym member workout scheduling & membership fee control'
    ],
    technologies: ['React', 'Chart.js / Recharts', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL'],
    linkedDemoId: 'admin-dashboard',
    pricingStarting: '₹24,999'
  },
  {
    id: 'ecommerce-dev',
    icon: 'shopping-cart',
    name: 'E-commerce Development',
    category: 'Websites',
    badge: 'High-Conversion Stores',
    shortDesc: 'Custom online shopping platforms featuring fast cart checkout, coupon engines, and payment gateways.',
    detailedDesc: 'Sell your products online with maximum conversion speed. We create bespoke e-commerce experiences with instant product filtering, variant pickers (size, color), promo code discounts, cart sliders, automated tax/shipping calculations, and local payment gateways.',
    features: [
      'Instant search & faceted category/price attribute filters',
      'Seamless slide-out cart drawer with live subtotal updates',
      'Promotional discount codes & bulk pricing rules',
      'Integrated Indian & Global payment gateways (UPI, Cards, EMI)',
      'Customer order history, shipping tracking & invoice download',
      'Admin product inventory control & stock alert notifications'
    ],
    useCases: [
      'Direct-to-Consumer (D2C) fashion & lifestyle brand stores',
      'Electronics, gadget & consumer hardware retail shops',
      'Organic food, grocery & cloud kitchen ordering portals',
      'Digital goods, courses & downloadable software delivery'
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB / Postgres', 'Razorpay', 'Tailwind CSS'],
    linkedDemoId: 'ecommerce',
    pricingStarting: '₹29,999'
  },
  {
    id: 'booking-system',
    icon: 'calendar',
    name: 'Booking System Development',
    category: 'Web Apps',
    badge: 'Automated Appointments',
    shortDesc: 'Universal appointment and slot booking platforms with automated confirmations and reminders.',
    detailedDesc: 'Stop playing telephone tag to book clients. We engineer universal appointment booking systems that allow your customers to select services, choose dates, pick live available time slots, and pay online with instant calendar invites and reminders.',
    features: [
      'Real-time time slot availability engine (no double booking)',
      'Custom working hours, buffer time & holiday exclusions',
      'Automated confirmation email & WhatsApp reminder alerts',
      'Upfront deposit collection or full online fee payment',
      'Customer self-serve reschedule and cancellation controls',
      'Staff appointment allocation & calendar sync (Google/Outlook)'
    ],
    useCases: [
      'Doctor clinics, dental offices & diagnostic centers',
      'Salons, luxury spas & wellness studios',
      'Legal advisors, chartered accountants & tech consultants',
      'Fitness personal trainers & sports turf reservation'
    ],
    technologies: ['React', 'Node.js', 'Date-Fns', 'PostgreSQL', 'WhatsApp API', 'Tailwind CSS'],
    linkedDemoId: 'booking',
    pricingStarting: '₹24,999'
  },
  {
    id: 'management-software',
    icon: 'briefcase',
    name: 'Management Software',
    category: 'Business Software',
    badge: 'Operational Efficiency',
    shortDesc: 'Comprehensive business management software uniting inventory, billing, employees, and operations.',
    detailedDesc: 'Bring total harmony to your daily business operations. We build all-in-one management platforms uniting staff attendance, client rosters, raw material inventory, invoice generation, and expense tracking into a single easy-to-use software.',
    features: [
      'Centralized client, member & student master directories',
      'Automated recurring billing, invoice generation & GST taxes',
      'Inventory stock monitoring with automated reorder warnings',
      'Staff shift allocation, task tracking & attendance registers',
      'Daily, weekly & monthly profit/loss accounting summaries',
      'Multi-branch and multi-location management support'
    ],
    useCases: [
      'Gym & fitness studio member and trainer management',
      'Coaching institute batch, student & exam management',
      'Restaurant kitchen order tickets (KOT) & table billing',
      'Real estate broker inventory & customer lead pipeline'
    ],
    technologies: ['Node.js', 'React', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind CSS'],
    linkedDemoId: 'fitcore',
    pricingStarting: '₹34,999'
  },
  {
    id: 'ui-ux-dev',
    icon: 'feather',
    name: 'UI/UX Development',
    category: 'Websites',
    badge: 'Design System & Aesthetics',
    shortDesc: 'Award-winning user interface engineering with glassmorphism, micro-interactions, and accessibility.',
    detailedDesc: 'Good code with bad design fails. We engineer captivating digital experiences that blend aesthetic beauty with psychological usability. From dark glassmorphism to clean SaaS minimalism, every pixel, transition, and button state is engineered to engage users.',
    features: [
      'Comprehensive design systems & reusable component libraries',
      'Micro-interactions, button state physics & fluid transitions',
      'WCAG 2.1 AA accessibility compliance & high contrast ratios',
      'Responsive typography scales & optical layout balance',
      'Dark mode, Light mode & custom brand theme styling',
      'Interactive prototype & Figma-to-production code fidelity'
    ],
    useCases: [
      'Modernizing dated legacy portals into premium experiences',
      'High-converting landing page redesigns for tech startups',
      'Consumer mobile app design systems with custom iconography',
      'Complex enterprise SaaS interface simplification'
    ],
    technologies: ['Figma', 'Tailwind CSS', 'CSS Variables', 'Three.js / WebGL', 'React', 'Framer Motion'],
    linkedDemoId: 'business-website',
    pricingStarting: '₹17,999'
  },
  {
    id: 'bug-fixing',
    icon: 'tool',
    name: 'Bug Fixing & Project Improvements',
    category: 'Business Software',
    badge: 'Performance & Stability',
    shortDesc: 'Rapid triage and resolution of critical codebase errors, broken features, and performance lag.',
    detailedDesc: 'Stuck with broken code, unresponsive developers, or slow loading speeds? We jump into existing codebases, diagnose core issues, fix bugs, optimize database queries, resolve frontend hydration glitches, and deliver clean, stable code.',
    features: [
      'Rapid root-cause error diagnostics & emergency hotfixes',
      'Slow database query indexing & N+1 query elimination',
      'Frontend bundle size reduction & asset compression',
      'Security patching, dependency updates & vulnerability fixes',
      'Resolving cross-browser mobile layout and layout shifts',
      'Code refactoring & architectural cleanup for future scalability'
    ],
    useCases: [
      'Emergency rescue of stalled or abandoned developer projects',
      'Fixing broken payment gateway and webhook sync issues',
      'Optimizing slow mobile app loading times and memory leaks',
      'Resolving API timeouts and unhandled server promise crashes'
    ],
    technologies: ['JavaScript/TypeScript', 'Node.js', 'React', 'SQL/NoSQL', 'Profiler Tools', 'Git'],
    linkedDemoId: 'admin-dashboard',
    pricingStarting: '₹9,999'
  },
  {
    id: 'database-integration',
    icon: 'database',
    name: 'Database Integration',
    category: 'Web Apps',
    badge: 'ACID Data Architecture',
    shortDesc: 'Robust database architecture, schema migrations, query optimization, and secure persistent storage.',
    detailedDesc: 'Data is the core of every digital business. We design normalized relational and high-speed document databases that maintain data integrity, eliminate redundancy, support complex aggregation queries, and scale effortlessly under heavy concurrent traffic.',
    features: [
      'Relational (PostgreSQL, MySQL) & NoSQL (MongoDB, Redis) design',
      'Zero-downtime database migrations & version-controlled schemas',
      'Advanced indexing strategies & query execution plan tuning',
      'Automated daily backup workflows & disaster recovery plans',
      'Connection pooling, connection retry logic & connection limits',
      'Data encryption at rest and in transit (SSL/TLS)'
    ],
    useCases: [
      'Migrating from unstable spreadsheet data to managed PostgreSQL',
      'Architecting multi-tenant database partitioning for SaaS',
      'Integrating Redis caching to slash database load by 80%',
      'Setting up automated cloud database replication on AWS/Atlas'
    ],
    technologies: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma ORM', 'Mongoose', 'Supabase'],
    linkedDemoId: 'edunova',
    pricingStarting: '₹19,999'
  },
  {
    id: 'cloud-deployment',
    icon: 'server',
    name: 'Cloud / Deployment Support',
    category: 'Automation',
    badge: '24/7 DevOps & Uptime',
    shortDesc: 'Production cloud setup, automated CI/CD pipelines, SSL encryption, and continuous monitoring.',
    detailedDesc: 'Ensure your software is always online, secure, and fast for users worldwide. We set up automated deployment pipelines, Docker containerization, custom domain DNS, SSL certificates, zero-downtime redeploys, and 24/7 keep-alive uptime monitoring.',
    features: [
      'Zero-downtime automated GitHub CI/CD build pipelines',
      'Docker containerization for portable consistent environments',
      'Custom domain DNS configuration with automated SSL certificates',
      '24/7 automated keep-alive pings & uptime alert notifications',
      'Server resource auto-scaling & load balancer configuration',
      'Security firewall, CORS lockdown & rate-limiting guards'
    ],
    useCases: [
      'Deploying full-stack Node.js + React apps to Render & Vercel',
      'Setting up AWS EC2, S3, CloudFront and RDS environments',
      'Configuring Cloudflare DNS, DDoS protection & CDN caching',
      'Migrating web applications from expensive hosts to optimized VPS'
    ],
    technologies: ['Docker', 'Render', 'Vercel', 'AWS', 'Cloudflare', 'GitHub Actions', 'Linux'],
    linkedDemoId: 'ai-automation',
    pricingStarting: '₹14,999'
  }
];

module.exports = DEVCRAFT_SERVICES;
