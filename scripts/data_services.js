const DEVCRAFT_SERVICES = [
  {
    id: 'android-development',
    icon: 'android',
    name: 'Android App Development',
    category: 'Mobile Apps',
    badge: 'Native Android',
    shortDesc: 'High-performance native Android apps built with Kotlin, Jetpack Compose, and modern architecture.',
    detailedDesc: 'We architect and build top-tier Android mobile applications from concept to Google Play Store launch. Focused on smooth 60fps UI, offline caching, push notifications, and hardware integration.',
    features: [
      'Modern Jetpack Compose & Material 3 UI',
      'Offline caching & Room database',
      'UPI Payment gateway & Google Play Billing',
      'Push notifications & background sync',
      'Complete source code & APK delivery'
    ],
    technologies: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Room DB', 'Firebase'],
    pricingStarting: '₹3,999',
    priceNum: 3999
  },
  {
    id: 'web-development',
    icon: 'globe',
    name: 'Website Development',
    category: 'Websites',
    badge: 'Fast & Modern',
    shortDesc: 'Ultra-fast, responsive business websites optimized for mobile, speed, and conversions.',
    detailedDesc: 'Custom responsive websites designed to convert visitors into clients. Clean modern code, 100% mobile-friendly, lightning-fast load times, and SEO optimized.',
    features: [
      '100% Mobile & tablet responsive',
      'Ultra-fast loading speed & modern design',
      'Lead capture form with direct WhatsApp alert',
      'SEO & Google search ready',
      'Free hosting setup & domain connection'
    ],
    technologies: ['HTML5/CSS3', 'JavaScript', 'Tailwind CSS', 'Node.js'],
    pricingStarting: '₹2,499',
    priceNum: 2499
  },
  {
    id: 'software-development',
    icon: 'layout',
    name: 'Web App Development',
    category: 'Web Apps',
    badge: 'Dynamic & Scalable',
    shortDesc: 'Full-stack web applications and portals with user authentication, databases, and dashboards.',
    detailedDesc: 'Transform your business logic into a fast browser application. Multi-user login, database persistence, interactive dashboards, and cloud deployment.',
    features: [
      'Single Page Application (SPA) architecture',
      'User login, signup & JWT authentication',
      'Interactive data tables & analytics charts',
      'Secure database integration (MongoDB/PostgreSQL)',
      'Production deployment on cloud'
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
    pricingStarting: '₹4,499',
    priceNum: 4499
  },
  {
    id: 'custom-software',
    icon: 'cpu',
    name: 'Custom Software Development',
    category: 'Business Software',
    badge: 'Tailored Logic',
    shortDesc: 'Bespoke software solutions engineered precisely to match your unique workflow needs.',
    detailedDesc: 'Custom desktop and server software tailored to eliminate repetitive manual work, streamline operations, and boost team productivity.',
    features: [
      'Custom business workflow automation',
      'Database integration & data management',
      'Multi-user access & permission management',
      'Complete source code handover with setup guide'
    ],
    technologies: ['Node.js', 'Python', 'Electron', 'SQLite', 'React'],
    pricingStarting: '₹4,999',
    priceNum: 4999
  },
  {
    id: 'ai-solutions',
    icon: 'sparkles',
    name: 'AI Solutions & Chatbots',
    category: 'AI',
    badge: 'Smart Intelligence',
    shortDesc: 'AI-infused applications, custom ChatGPT-like bots, voice tools, and document assistants.',
    detailedDesc: 'Deploy intelligent AI into your business. Custom chatbots trained on your business data, automated content generators, and smart voice workflows.',
    features: [
      'Custom conversational AI bot for WhatsApp & Web',
      'Document Q&A and semantic knowledge base',
      'Integration with OpenAI, Claude, and local LLMs (Ollama)',
      'Voice-to-text & automated AI workflows'
    ],
    technologies: ['Python', 'Node.js', 'OpenAI API', 'LangChain', 'Ollama'],
    pricingStarting: '₹3,499',
    priceNum: 3499
  },
  {
    id: 'automation',
    icon: 'zap',
    name: 'Business Automation Workflows',
    category: 'Automation',
    badge: 'Zero Manual Work',
    shortDesc: 'Automated pipelines connecting website forms, WhatsApp messages, payments, and spreadsheets.',
    detailedDesc: 'Eliminate manual copy-pasting. We build automated data pipelines that trigger instant WhatsApp alerts, invoice creation, and email notifications.',
    features: [
      'Instant WhatsApp & Email alerts upon form submit',
      'Automated PDF invoice & receipt generation',
      'Google Sheets & database synchronization',
      'Scheduled background cron tasks & webhook triggers'
    ],
    technologies: ['Node.js', 'Webhooks', 'WhatsApp API', 'Cron Jobs'],
    pricingStarting: '₹1,999',
    priceNum: 1999
  },
  {
    id: 'api-integration',
    icon: 'share-2',
    name: 'API Integration & Backend',
    category: 'Backend',
    badge: 'Secure & Fast',
    shortDesc: 'Payment gateways (UPI, Cards), third-party API connections, and custom backend endpoints.',
    detailedDesc: 'Connect your software with external services. We integrate payment gateways (TranzUPI, Razorpay, Cashfree), SMS/WhatsApp APIs, and custom REST APIs.',
    features: [
      'Payment Gateway Integration (UPI QR, Instant Webhooks)',
      'Secure REST API design with JWT authentication',
      'Third-party service synchronization',
      'Complete documentation & error handling'
    ],
    technologies: ['Node.js', 'Express', 'REST API', 'Webhooks', 'JSON'],
    pricingStarting: '₹1,499',
    priceNum: 1499
  },
  {
    id: 'ui-ux',
    icon: 'feather',
    name: 'UI/UX Design & Frontend',
    category: 'Design',
    badge: 'Clean Aesthetics',
    shortDesc: 'Modern user interface design with glassmorphism, clean layouts, and mobile optimization.',
    detailedDesc: 'Crafting beautiful, intuitive digital experiences. Clean design systems, modern typography, dark/light system modes, and pixel-perfect responsiveness.',
    features: [
      'Modern, clean, and minimalist UI design',
      'Dark mode & Light mode responsive themes',
      'Interactive components, modals & drawers',
      'Cross-device mobile first compatibility'
    ],
    technologies: ['HTML5', 'CSS3', 'Tailwind CSS', 'Figma', 'JavaScript'],
    pricingStarting: '₹1,999',
    priceNum: 1999
  },
  {
    id: 'maintenance',
    icon: 'tool',
    name: 'Bug Fixing & Maintenance',
    category: 'Support',
    badge: 'Fast Resolution',
    shortDesc: 'Rapid triage and resolution of broken features, responsive bugs, and performance lag.',
    detailedDesc: 'Got broken code or slow load times? We diagnose root causes, fix UI layout glitches, repair database connections, and stabilize your software.',
    features: [
      'Emergency error diagnostics & bug fixes',
      'Mobile responsive layout corrections',
      'Website speed & performance optimization',
      'Code refactoring & dependency updates'
    ],
    technologies: ['JavaScript', 'Node.js', 'HTML/CSS', 'Python', 'Git'],
    pricingStarting: '₹999',
    priceNum: 999
  }
];

module.exports = DEVCRAFT_SERVICES;
