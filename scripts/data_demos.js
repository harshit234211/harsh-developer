/**
 * DEVCRAFT - Interactive Demos & Case Studies Catalog
 * 10 Comprehensive Demos across Mobile, Web, AI, Dashboards, and Automation
 */

const DEVCRAFT_DEMOS = [
  {
    id: 'cravex',
    title: 'CraveX',
    subtitle: 'Food Delivery Mobile Experience',
    category: 'MOBILE APPS',
    categoryKey: 'mobile',
    badge: 'Mobile App • React Native / Android',
    image: '/assets/images/project-mobile.svg',
    shortDesc: 'A lightning-fast food ordering mobile app with real-time GPS courier tracking, interactive dish customization, and UPI one-tap payment.',
    metrics: [
      { label: 'Avg Order Time', value: '42s' },
      { label: 'Courier Latency', value: '<50ms' },
      { label: 'Rating', value: '4.9 ★' }
    ],
    technologies: ['React Native', 'Kotlin', 'Node.js', 'Socket.IO', 'Google Maps API', 'Razorpay'],
    features: [
      'Interactive restaurant & dish catalog with category filtering',
      'Real-time cart management with instant bill calculations',
      'Simulated live driver GPS location tracker with delivery milestones',
      'Custom spice level, portion sizing, and add-on modifiers',
      'Instant push notification simulation for order status transitions'
    ],
    caseStudy: {
      client: 'CraveX Logistics Corp',
      timeline: '6 Weeks',
      problem: 'The client had an outdated hybrid app experiencing 4.2-second screen lag, frequent checkout drop-offs (38%), and poor GPS accuracy that frustrated hungry customers and couriers.',
      solution: 'DevCraft re-architected CraveX into a native-performance React Native application paired with a lightweight Node.js/Socket.IO microservice for sub-50ms courier coordinate streaming. We implemented offline cart persistence and a 2-step frictionless checkout.',
      architecture: [
        'React Native + Hermes JS engine for instant 60fps renders',
        'Redis Geo-spatial indexing for courier proximity calculations',
        'WebSockets stream for battery-efficient live GPS location polling',
        'Stripe & Razorpay multi-tender payment fallback gateway'
      ],
      results: [
        '64% increase in completed checkout conversions in first 30 days',
        'App launch time dropped from 4.2s to 0.7s (83% speedup)',
        '4.9/5 App Store rating across 12,000+ active monthly foodies'
      ]
    },
    demoType: 'food-delivery',
    linkedServiceId: 'android-app'
  },
  {
    id: 'fitcore',
    title: 'FitCore',
    subtitle: 'Gym & Fitness Management Platform',
    category: 'BUSINESS SOFTWARE',
    categoryKey: 'business',
    badge: 'SaaS Platform • Mobile & Web',
    image: '/assets/images/project-dashboard.svg',
    shortDesc: 'Complete gym operations SaaS featuring dual Member & Admin portals, automated recurring billing, trainer booking, and QR attendance.',
    metrics: [
      { label: 'Member Retention', value: '+34%' },
      { label: 'Check-in Speed', value: '0.4s' },
      { label: 'Active Gyms', value: '45+' }
    ],
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'TailwindCSS', 'Stripe Billing', 'QR Code SDK'],
    features: [
      'Dual-portal switch: Interactive Member view vs Administrator management view',
      'Live membership tier subscriber management with instant status toggles',
      'Dynamic trainer session booking schedule with calendar slots',
      'Live automated revenue & active member analytics dashboard',
      'QR Code contactless check-in validation simulator'
    ],
    caseStudy: {
      client: 'FitCore Global Franchises',
      timeline: '8 Weeks',
      problem: 'Franchise owners were managing membership renewals and trainer bookings across fragmented WhatsApp chats and paper registers, losing ₹3.8L monthly in uncollected renewal dues.',
      solution: 'DevCraft engineered an all-in-one web & mobile SaaS featuring automated Stripe recurring subscriptions, dynamic trainer availability calendars, and instant QR check-in gates.',
      architecture: [
        'Next.js 14 server components for instant dashboard data loading',
        'PostgreSQL with Prisma ORM for relational membership schemas',
        'Automated cron workers sending WhatsApp renewal links via Twilio',
        'Role-based access control (Admin, Trainer, Member)'
      ],
      results: [
        'Zero lost renewal fees with 99.4% automated subscription collection',
        'Trainer scheduling conflicts eliminated 100%',
        'Expanded from 3 locations to 45+ fitness hubs nationwide'
      ]
    },
    demoType: 'gym-management',
    linkedServiceId: 'custom-web-portals'
  },
  {
    id: 'edunova',
    title: 'EduNova',
    subtitle: 'Interactive Learning Management System',
    category: 'WEB APPS',
    categoryKey: 'web-apps',
    badge: 'LMS Platform • Web Application',
    image: '/assets/images/project-web.svg',
    shortDesc: 'A modern education platform with modular course video players, interactive knowledge-check quizzes, live progress tracking, and instant certificates.',
    metrics: [
      { label: 'Course Completion', value: '78%' },
      { label: 'Video CDN Speed', value: '99.9%' },
      { label: 'Students', value: '25k+' }
    ],
    technologies: ['React 18', 'Node.js', 'Video.js', 'MongoDB', 'AWS S3 / CloudFront', 'PDFKit'],
    features: [
      'Interactive multi-module course curriculum with collapsible lesson hierarchy',
      'Video lesson player mockup with playback scrub and note-taking mode',
      'Interactive 3-question knowledge quiz with instant grading and explanations',
      'Live percentage course progress meter with dynamic lesson checkmarks',
      'Instant certificate of completion generator modal'
    ],
    caseStudy: {
      client: 'EduNova EdTech Academy',
      timeline: '7 Weeks',
      problem: 'Traditional video hosting was slow, expensive, and lacked student engagement. Average course completion rates were under 14% due to passive unmonitored watching.',
      solution: 'DevCraft built an engaging, gamified LMS featuring micro-lesson bookmarking, in-video checkpoint quizzes, dynamic progress tracking, and automated branded PDF certification upon 100% completion.',
      architecture: [
        'React frontend with optimistic UI state caching',
        'HLS adaptive video bitrate streaming via AWS CloudFront CDN',
        'MongoDB document storage for flexible quiz schemas and answers',
        'Automated PDFKit certificate rendering engine'
      ],
      results: [
        'Course completion rates surged from 14% to 78%',
        'Video streaming costs slashed by 48% via adaptive HLS streaming',
        'Over 25,000 certified graduates in the first academic year'
      ]
    },
    demoType: 'lms-learning',
    linkedServiceId: 'web-app-dev'
  },
  {
    id: 'estatex',
    title: 'EstateX',
    subtitle: 'Modern Real Estate Platform',
    category: 'WEBSITES',
    categoryKey: 'websites',
    badge: 'Real Estate • Web & Mobile',
    image: '/assets/images/project-ecommerce.svg',
    shortDesc: 'Luxury real estate discovery portal featuring interactive price/location filters, high-resolution photo galleries, and instant private tour scheduling.',
    metrics: [
      { label: 'Property Inquiries', value: '3.2x' },
      { label: 'Search Speed', value: '24ms' },
      { label: 'Listing Views', value: '180k/mo' }
    ],
    technologies: ['Next.js', 'TailwindCSS', 'Leaflet Maps', 'PostgreSQL', 'Cloudinary', 'SendGrid'],
    features: [
      'Dynamic property filter engine (Type, Price range, Bedrooms, Location)',
      'Rich interactive property showcase cards with photo previews and feature badges',
      'Interactive property detail modal with floor plan tabs and specifications',
      'Working "Schedule a Private Tour" booking form with instant date selection',
      'Mortgage monthly installment estimation calculator'
    ],
    caseStudy: {
      client: 'EstateX Luxury Realty',
      timeline: '5 Weeks',
      problem: 'The agency relied on static PDF brochures and slow WordPress pages that took 5.6s to load, causing 60% of high-net-worth buyers to abandon searches.',
      solution: 'DevCraft engineered a bespoke Next.js real estate application with sub-second image loading via Cloudinary, instant multi-parameter filtering, and an integrated tour booking engine.',
      architecture: [
        'Next.js Incremental Static Regeneration (ISR) for instant search indexing',
        'PostgreSQL with Full-Text Search indexing on property amenities',
        'Cloudinary responsive WebP image optimization pipeline',
        'Automated tour calendar syncing directly into agents Google Calendars'
      ],
      results: [
        '320% surge in verified buyer tour requests within 60 days',
        'Page load time dropped to 0.6 seconds (90% faster)',
        'Closed ₹18 Cr in luxury property sales attributed to the platform'
      ]
    },
    demoType: 'real-estate',
    linkedServiceId: 'website-dev'
  },
  {
    id: 'jarvis-ai',
    title: 'Jarvis AI',
    subtitle: 'Intelligent Multi-Agent Workspace',
    category: 'AI',
    categoryKey: 'ai',
    badge: 'AI & Machine Learning • Full-Stack',
    image: '/assets/images/project-ai.svg',
    shortDesc: 'Enterprise AI assistant workspace with multi-persona switching (Architect, Coder, Analyst), real-time simulated token generation, and syntax-highlighted code output.',
    metrics: [
      { label: 'Response Latency', value: '120ms' },
      { label: 'Code Accuracy', value: '98.6%' },
      { label: 'Tasks Handled', value: '500k+' }
    ],
    technologies: ['OpenAI GPT-4 API', 'LangChain', 'Node.js', 'React', 'Prism.js', 'Vector DB'],
    features: [
      'Interactive multi-turn conversation with real-time responsive chat simulation',
      'Persona switcher: Full-Stack Architect, Senior Code Reviewer, or Data Analyst',
      'Pre-loaded prompt suggestions for instant one-click querying',
      'Simulated typing effect with live token count and latency metrics',
      'One-click code snippet copier with syntax styling'
    ],
    caseStudy: {
      client: 'Apex Global Software Labs',
      timeline: '6 Weeks',
      problem: 'A software firm was losing 12 hours per developer weekly on boilerplate code writing, API documentation parsing, and manual unit test generation.',
      solution: 'DevCraft built a secure, private enterprise AI workspace integrated with OpenAI models, featuring customized system personas, internal codebase context ingestion, and strict token limits.',
      architecture: [
        'Node.js streaming proxy with Server-Sent Events (SSE) for low latency',
        'Pinecone vector database for company documentation semantic retrieval',
        'Client-side Prism.js code syntax highlighting with copy-to-clipboard',
        'Enterprise JWT authorization with department-level usage quotas'
      ],
      results: [
        'Saved 11.5 hours per developer weekly on documentation and test creation',
        'Unit test coverage improved across company repositories by 42%',
        'Zero API key leaks with centralized enterprise rate-limiting proxy'
      ]
    },
    demoType: 'ai-workspace',
    linkedServiceId: 'ai-integration'
  },
  {
    id: 'business-website',
    title: 'Nexus Corp Presence',
    subtitle: 'Modern Agency & Corporate Studio',
    category: 'WEBSITES',
    categoryKey: 'websites',
    badge: 'Corporate Website • High Conversion',
    image: '/assets/images/project-web.svg',
    shortDesc: 'A high-converting corporate website engineered with smooth 3D micro-animations, interactive ROI calculator, and dynamic client presentation decks.',
    metrics: [
      { label: 'Page Speed Score', value: '99/100' },
      { label: 'Lead Conversion', value: '8.4%' },
      { label: 'Global Bounce', value: '<22%' }
    ],
    technologies: ['Vite', 'HTML5/SCSS', 'Vanilla JS', 'Three.js', 'Tailwind', 'GSAP'],
    features: [
      'Interactive live theme previewer (Dark Slate, Cyber Blue, Executive Gold)',
      'Interactive Business ROI & Cost Savings Calculator with dynamic sliders',
      'Interactive service grid preview with instant modal details',
      'Client case study spotlight accordion with real metrics',
      'One-click interactive project cost estimate generator'
    ],
    caseStudy: {
      client: 'Nexus Global Consulting Group',
      timeline: '4 Weeks',
      problem: 'Nexus had a 7-year-old WordPress website with poor mobile responsiveness, 4.8-second load times, and an unimpressive design that failed to reflect their enterprise status.',
      solution: 'DevCraft designed a bespoke, ultra-fast corporate experience with sleek dark styling, interactive financial ROI calculators, and instant inquiry workflows.',
      architecture: [
        'Vite build optimization with zero runtime bloat (sub-40KB initial bundle)',
        'CSS custom properties engine for real-time brand theme switching',
        'Interactive client-side ROI calculator with SVG chart renders',
        'Automated webhook sync with HubSpot and Salesforce CRM'
      ],
      results: [
        'Google Lighthouse scores achieved 99 Performance and 100 SEO',
        'Enterprise lead inquiry rate jumped by 170% in Q1',
        'Average user session duration doubled from 1m 12s to 3m 45s'
      ]
    },
    demoType: 'agency-showcase',
    linkedServiceId: 'landing-pages'
  },
  {
    id: 'novacart',
    title: 'NovaCart E-Commerce',
    subtitle: 'Complete Digital Commerce Store',
    category: 'WEB APPS',
    categoryKey: 'web-apps',
    badge: 'E-Commerce • Full-Stack Store',
    image: '/assets/images/project-ecommerce.svg',
    shortDesc: 'Modern e-commerce platform with reactive product filtering, slide-over cart drawer, instant promo code validation, and a simulated 3-step checkout.',
    metrics: [
      { label: 'Checkout Abandonment', value: '-42%' },
      { label: 'Cart Speed', value: '18ms' },
      { label: 'Catalog Items', value: '10k+' }
    ],
    technologies: ['React', 'Node.js', 'Express', 'Stripe', 'Redis Caching', 'TailwindCSS'],
    features: [
      'Interactive product catalog with category tags (Hardware, Wearables, Audio)',
      'Quick-view product detail modal with specs, ratings, and stock counter',
      'Slide-over cart drawer with quantity increments, removals, and subtotal',
      'Working coupon code system (try code "DEVCRAFT10" for 10% instant discount)',
      'Simulated 3-step checkout with instant order confirmation and tracking number'
    ],
    caseStudy: {
      client: 'Nova Trends E-Commerce',
      timeline: '7 Weeks',
      problem: 'Nova Trends was losing customers on Shopify due to bloated multi-page checkout flows and slow international currency transitions.',
      solution: 'DevCraft engineered a bespoke headless e-commerce store with an instant slide-out cart drawer, single-page express checkout, and sub-second catalog search.',
      architecture: [
        'React frontend with Redux Toolkit for zero-latency cart updates',
        'Express.js backend with Redis caching for 18ms product catalog responses',
        'Stripe Payment Intents with automatic local currency detection',
        'Automated webhook workers syncing warehouse inventory in real-time'
      ],
      results: [
        'Checkout abandonment plummeted from 68% to 26%',
        'Average order value (AOV) grew by 28% through dynamic cart upsells',
        'Successfully handled 15,000 simultaneous shoppers on Black Friday'
      ]
    },
    demoType: 'ecommerce-store',
    linkedServiceId: 'ecommerce-dev'
  },
  {
    id: 'timeslot-pro',
    title: 'TimeSlot Pro',
    subtitle: 'Appointment & Booking System',
    category: 'BUSINESS SOFTWARE',
    categoryKey: 'business',
    badge: 'Booking Engine • Web & Mobile',
    image: '/assets/images/project-api.svg',
    shortDesc: 'Automated appointment scheduling suite with timezone detection, real-time date/slot availability picker, and calendar invitation sync.',
    metrics: [
      { label: 'No-Show Rate', value: '<2%' },
      { label: 'Booking Time', value: '35s' },
      { label: 'Sync Latency', value: 'Instant' }
    ],
    technologies: ['Next.js', 'TypeScript', 'Google Calendar API', 'Twilio SMS', 'Tailwind', 'Prisma'],
    features: [
      'Step 1: Interactive service selection (Tech Consultation, Architecture Review, Code Audit)',
      'Step 2: Interactive live calendar date selector with weekend exclusion',
      'Step 3: Dynamic time slot grid with morning, afternoon, and evening slots',
      'Step 4: Contact details entry with automated confirmation modal and simulated calendar invitation',
      'Simulated SMS & Email confirmation trigger'
    ],
    caseStudy: {
      client: 'CareFirst Healthcare & Wellness',
      timeline: '5 Weeks',
      problem: 'Receptionists spent 4 hours every day manually exchanging emails to book consultations, resulting in a 22% no-show rate and double-booking errors.',
      solution: 'DevCraft built TimeSlot Pro: a frictionless 4-step scheduling engine with automated Google Calendar slot synchronization and automated WhatsApp/SMS reminders.',
      architecture: [
        'Next.js app router with optimistic server actions for zero slot clashes',
        'Google Calendar & Outlook Calendar bi-directional OAuth2 sync',
        'Twilio automated SMS and WhatsApp reminder notifications 2 hours before slots',
        'Custom buffer-time and cancellation window rule enforcement engine'
      ],
      results: [
        'No-show rate dropped from 22% to an unprecedented 1.8%',
        'Saved clinic staff 25+ hours of weekly manual phone coordination',
        'Over 8,000 appointments booked completely on autopilot'
      ]
    },
    demoType: 'appointment-booking',
    linkedServiceId: 'custom-web-portals'
  },
  {
    id: 'nexus-admin',
    title: 'Nexus Admin Dashboard',
    subtitle: 'Enterprise Analytics & Operations',
    category: 'DASHBOARDS',
    categoryKey: 'dashboards',
    badge: 'Enterprise Dashboard • Full Operations',
    image: '/assets/images/project-dashboard.svg',
    shortDesc: 'Mission-control admin dashboard featuring live metrics, interactive SVG revenue charts, user access management, and simulated system health gauges.',
    metrics: [
      { label: 'Data Ingestion', value: '50k/sec' },
      { label: 'Query Latency', value: '12ms' },
      { label: 'Uptime', value: '99.99%' }
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'ApexCharts', 'Docker'],
    features: [
      'Timeframe filter toggle: Daily, Weekly, and Monthly live metric recalculation',
      'Interactive SVG revenue & conversion performance charts with hover tooltips',
      'Live user management table with status toggles (Active, Suspended, Pending)',
      'Real-time server telemetry: CPU load, RAM allocation, and API latency indicators',
      'Instant search and filter across mock transactions and orders'
    ],
    caseStudy: {
      client: 'VentureScale B2B Platform',
      timeline: '6 Weeks',
      problem: 'Operations executives had to query 4 different database tables and wait 15 minutes for spreadsheet exports to review daily sales and user churn.',
      solution: 'DevCraft created Nexus Admin: a unified single-pane-of-glass operations cockpit with pre-aggregated SQL materialized views and sub-second chart rendering.',
      architecture: [
        'React with modular dashboard card widgets and virtualized scrolling',
        'Node.js caching layer on top of PostgreSQL materialized views',
        'WebSocket connection for real-time new subscriber alerts and status changes',
        'Role-based granular permissions (SuperAdmin, Support Lead, Billing Admin)'
      ],
      results: [
        'Decision-making latency dropped from 15 minutes to real-time (<1 second)',
        'Support team resolution speed increased by 3.5x with instant user status toggles',
        'Zero downtime across 18 consecutive months of production monitoring'
      ]
    },
    demoType: 'admin-dashboard',
    linkedServiceId: 'admin-dashboards'
  },
  {
    id: 'flowcraft-ai',
    title: 'FlowCraft AI',
    subtitle: 'Workflow & Prompt Automation Suite',
    category: 'AUTOMATION',
    categoryKey: 'automation',
    badge: 'AI Automation • Workflow Engine',
    image: '/assets/images/project-api.svg',
    shortDesc: 'Visual workflow automation platform connecting webhook triggers, LLM processing nodes, and multi-channel actions with step-by-step execution simulation.',
    metrics: [
      { label: 'Workflows Executed', value: '1.2M+' },
      { label: 'Time Saved', value: '450 hrs' },
      { label: 'Error Rate', value: '<0.01%' }
    ],
    technologies: ['Node.js', 'React Flow', 'OpenAI API', 'BullMQ', 'Redis', 'Docker'],
    features: [
      'Interactive 4-step workflow pipeline: Webhook Trigger -> Filter -> AI LLM -> Notification',
      'Working "Run Workflow Simulation" button with realistic step-by-step green glowing execution',
      'Live node inspector displaying JSON payload inputs and outputs at each stage',
      'Configurable AI prompt node parameters (Model, Temperature, Task)',
      'Execution log terminal with real timestamps and status confirmation'
    ],
    caseStudy: {
      client: 'Optima Data Solutions',
      timeline: '6 Weeks',
      problem: 'Customer inquiries received via contact forms took an average of 4.5 hours to be categorized, summarized, and routed to the proper account executive.',
      solution: 'DevCraft engineered FlowCraft AI: an autonomous workflow engine that receives webhooks, summarizes intent via GPT-4, scores lead value, and notifies the right Slack channel in 1.4 seconds.',
      architecture: [
        'React Flow node-based visual orchestration interface',
        'BullMQ with Redis for distributed background job queuing and retries',
        'OpenAI function-calling API for structured JSON extraction',
        'Webhook dispatchers for Slack, WhatsApp, HubSpot, and email'
      ],
      results: [
        'Lead response time plummeted from 4.5 hours to 1.4 seconds',
        'Sales meeting booking rate increased by 54% due to instant contact',
        'Saved over 450 engineering hours previously spent writing custom webhook glue'
      ]
    },
    demoType: 'workflow-automation',
    linkedServiceId: 'ai-automation'
  }
];

module.exports = DEVCRAFT_DEMOS;
