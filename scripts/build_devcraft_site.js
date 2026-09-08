const fs = require('fs');
const path = require('path');

const DEVCRAFT_SERVICES = require('./data_services');
const DEVCRAFT_DEMOS = require('./data_demos');
const { DEVCRAFT_PRODUCTS, calculatePricing } = require('./data_products');
const { commonHead, navbar, floatingActions, footer } = require('./components');

const ROOT = path.join(__dirname, '..');
const FRONTEND = path.join(ROOT, 'frontend');
const PAGES = path.join(FRONTEND, 'pages');

if (!fs.existsSync(PAGES)) fs.mkdirSync(PAGES, { recursive: true });

// Helper to escape JSON for safe script tag embedding
const safeJsonServices = JSON.stringify(DEVCRAFT_SERVICES).replace(/</g, '\\u003c');
const safeJsonDemos = JSON.stringify(DEVCRAFT_DEMOS).replace(/</g, '\\u003c');
const safeJsonProducts = JSON.stringify(DEVCRAFT_PRODUCTS).replace(/</g, '\\u003c');

// ==========================================
// 1. ALL 16 SECTIONS GENERATORS
// ==========================================

// Section 2: Hero
function renderHeroSection() {
  return `
  <header class="hero-section" id="hero">
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="status-pill-online"><span class="status-dot"></span> Available for Q3/Q4 Production Sprints</span>
        </div>

        <div class="hero-tagline-lead">DEVCRAFT STUDIO • IDEAS → CODE → REAL SOLUTIONS</div>
        <h1 class="hero-headline">
          Engineering <span class="text-gradient">Scalable Software</span> & High-Impact Digital Products
        </h1>

        <p class="hero-bio">
          DevCraft is a high-performance software engineering studio. We architect and ship full-stack web platforms, native mobile applications, intelligent AI workflows, and mission-critical cloud infrastructure for ambitious founders and growing enterprises.
        </p>

        <!-- Service Offering Pills -->
        <div class="hero-offerings-pills">
          <span class="pill-tag">📱 Android & iOS Apps</span>
          <span class="pill-tag">⚡ Full-Stack Web Apps</span>
          <span class="pill-tag">🤖 AI Agents & Workflows</span>
          <span class="pill-tag">🛍️ Custom E-Commerce</span>
          <span class="pill-tag">📊 Enterprise Dashboards</span>
          <span class="pill-tag">☁️ Cloud DevOps & APIs</span>
          <span class="pill-tag">🚀 Website Redesigns</span>
        </div>

        <!-- Primary CTAs -->
        <div class="hero-cta-group">
          <a href="#demos" class="btn btn-primary">
            <span>Explore 10 Live Demos</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          <a href="#contact" class="btn btn-emerald">Start a Project</a>
          <a href="#services" class="btn btn-outline">All 20 Services</a>
        </div>

        <!-- Trust Stats -->
        <div class="hero-stats-strip">
          <div class="hero-stat-item">
            <span class="stat-number text-gradient">20</span>
            <span class="stat-label">Full-Stack Services</span>
          </div>
          <div class="hero-stat-item">
            <span class="stat-number text-cyan">10</span>
            <span class="stat-label">Interactive Demos</span>
          </div>
          <div class="hero-stat-item">
            <span class="stat-number text-emerald">&lt;50ms</span>
            <span class="stat-label">Avg API Latency</span>
          </div>
          <div class="hero-stat-item">
            <span class="stat-number text-warning">100%</span>
            <span class="stat-label">IP & Code Ownership</span>
          </div>
        </div>
      </div>

      <!-- Hero Visual / 3D Canvas Anchor -->
      <div class="hero-visual">
        <div class="three-canvas-container" id="three-container">
          <canvas id="three-canvas" class="three-canvas"></canvas>
          <div id="three-fallback" class="three-fallback" style="display: none;">
            <div class="fallback-glow"></div>
            <div class="fallback-avatar-graphic">
              <div class="brand-badge-icon" style="width: 80px; height: 80px; font-size: 2rem;">⚡</div>
            </div>
          </div>
        </div>
        <div class="hero-card-floating hero-card-top-right">
          <div class="floating-icon">⚡</div>
          <div>
            <strong>100% Production Ready</strong>
            <small>Zero placeholder code</small>
          </div>
        </div>
        <div class="hero-card-floating hero-card-bottom-left">
          <div class="floating-icon">🛡️</div>
          <div>
            <strong>Enterprise Security</strong>
            <small>OWASP compliant architectures</small>
          </div>
        </div>
      </div>
    </div>
  </header>
  `;
}

// Section 3: Services Showcase (All 20 Services with Dynamic 50% Discount)
function renderServicesSection() {
  const categories = ['All', 'Mobile Apps', 'Web Apps', 'Websites', 'AI & ML', 'Dashboards', 'Custom Software', 'Automation'];

  return `
  <section class="section" id="services">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Full Engineering Catalog • 50% OFF</div>
        <h2 class="section-title">20 Complete <span class="text-gradient">Developer Services</span></h2>
        <p class="section-desc">
          From native mobile experiences and multi-tenant SaaS platforms to autonomous AI agents and cloud DevOps. All services include an automatic <strong>50% promotional discount</strong> with transparent upfront pricing.
        </p>
      </div>

      <!-- Services Category Filter Bar -->
      <div class="filter-bar" id="services-filter-bar">
        ${categories.map(c => `
          <button class="filter-pill ${c === 'All' ? 'active' : ''}" onclick="filterServicesCategory('${c}')">${c}</button>
        `).join('')}
      </div>

      <!-- 20 Service Cards Grid (Requirement 1: 50% DISCOUNT) -->
      <div class="services-catalog-grid" id="services-catalog-grid">
        ${DEVCRAFT_SERVICES.map(service => {
          const matchingProduct = DEVCRAFT_PRODUCTS.find(p => p.id === service.id || p.name === service.name || (p.linkedServiceId && p.linkedServiceId === service.id));
          const prodId = matchingProduct ? matchingProduct.id : service.id;
          const parsed = parseInt(service.pricingStarting.replace(/[^0-9]/g, ''), 10) || 24999;
          const originalPrice = matchingProduct ? matchingProduct.originalPrice : (parsed * 2);
          const finalPrice = matchingProduct ? matchingProduct.finalPrice : parsed;

          return `
          <div class="service-card" data-category="${service.category}">
            <div class="service-card-top">
              <span class="service-badge">${service.category} • ${service.badge}</span>
              <h3 class="service-title">${service.name}</h3>
              <p class="service-desc">${service.shortDesc}</p>
              <div class="service-tech-pills">
                ${service.technologies.slice(0, 4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
              </div>
            </div>

            <div class="service-card-bottom">
              <!-- Requirement 1: Original Price -> 50% OFF -> Final Price -->
              <div class="card-pricing-block">
                <div class="price-top-row">
                  <span class="price-label">Original Price:</span>
                  <del class="price-original">₹${originalPrice.toLocaleString('en-IN')}</del>
                  <span class="badge-discount pill-app">50% OFF</span>
                </div>
                <div class="price-bottom-row">
                  <span class="price-final-label">Final Price:</span>
                  <span class="price-final-value">₹${finalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <!-- Requirement 5 & 9: Actions with Share -->
              <div class="card-shop-actions">
                <button class="btn btn-outline btn-xs" onclick="devcraftShop.openProductModal('${prodId}')">
                  View Details
                </button>
                <button class="btn btn-primary btn-xs btn-buy" onclick="devcraftShop.openCheckoutModal('${prodId}')">
                  ⚡ Order (₹${finalPrice.toLocaleString('en-IN')}) →
                </button>
                <button type="button" class="btn-share-icon" title="Share Offer" onclick="devcraftShop.openShareModal('${prodId}')">
                  🔗 Share
                </button>
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section: Aptitude & Placement Hub (Requirement 2: 30% DISCOUNT)
function renderAptitudeSection() {
  const aptitudeProducts = DEVCRAFT_PRODUCTS.filter(p => p.type === 'aptitude');

  return `
  <section class="section" id="aptitude" style="background: radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.08) 0%, transparent 70%);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge" style="border-color: rgba(168, 85, 247, 0.4); color: #c084fc; background: rgba(168, 85, 247, 0.1);">
          Campus &amp; Technical Placement Hub • 30% OFF
        </div>
        <h2 class="section-title">Developer Aptitude &amp; <span class="text-gradient" style="background: linear-gradient(135deg, #c084fc, #00f0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Placement Prep</span></h2>
        <p class="section-desc">
          Master technical screening rounds required by product startups, FAANG, and top IT recruiters. Speed math shortcuts, logical reasoning drills, CS fundamentals, and timed test simulators with an <strong>exclusive 30% discount</strong>.
        </p>
      </div>

      <!-- 5 Aptitude Cards Grid (Requirement 2: 30% OFF) -->
      <div class="services-catalog-grid" id="aptitude-catalog-grid">
        ${aptitudeProducts.map(item => `
          <div class="service-card" style="border-color: rgba(168, 85, 247, 0.25);">
            <div class="service-card-top">
              <span class="service-badge" style="background: rgba(168, 85, 247, 0.12); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3);">
                ${item.category} • ${item.badge}
              </span>
              <h3 class="service-title">${item.name}</h3>
              <p class="service-desc">${item.shortDesc}</p>
              <div class="service-tech-pills">
                ${(item.technologies || []).slice(0, 4).map(t => `<span class="tech-tag" style="border-color: rgba(168, 85, 247, 0.3); color: #e9d5ff;">${t}</span>`).join('')}
              </div>
            </div>

            <div class="service-card-bottom">
              <!-- Requirement 2: Original Price -> 30% OFF -> Final Price -->
              <div class="card-pricing-block" style="border-color: rgba(168, 85, 247, 0.2); background: rgba(168, 85, 247, 0.04);">
                <div class="price-top-row">
                  <span class="price-label">Original Price:</span>
                  <del class="price-original">₹${item.originalPrice.toLocaleString('en-IN')}</del>
                  <span class="badge-discount pill-aptitude">30% OFF</span>
                </div>
                <div class="price-bottom-row">
                  <span class="price-final-label">Final Price:</span>
                  <span class="price-final-value" style="color: #c084fc;">₹${item.finalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <!-- Requirement 5 & 9: Actions with Share -->
              <div class="card-shop-actions">
                <button class="btn btn-outline btn-xs" onclick="devcraftShop.openProductModal('${item.id}')">
                  View Syllabus
                </button>
                <button class="btn btn-primary btn-xs btn-buy" style="background: linear-gradient(135deg, #a855f7, #00f0ff); border: none;" onclick="devcraftShop.openCheckoutModal('${item.id}')">
                  ⚡ Enroll (₹${item.finalPrice.toLocaleString('en-IN')}) →
                </button>
                <button type="button" class="btn-share-icon" title="Share Course" onclick="devcraftShop.openShareModal('${item.id}')">
                  🔗 Share
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 4: Featured Projects & Demos (All 10 Demos)
function renderFeaturedDemosSection() {
  const demoFilters = ['ALL', 'MOBILE APPS', 'WEB APPS', 'WEBSITES', 'AI', 'DASHBOARDS', 'BUSINESS SOFTWARE', 'AUTOMATION'];

  return `
  <section class="section" id="demos">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Live Interactive Showcase</div>
        <h2 class="section-title">10 Production <span class="text-gradient">Demo Applications</span></h2>
        <p class="section-desc">
          Every demo below is a fully functional simulated software application. Click "View Demo" to interact live, test features, and inspect real case studies.
        </p>
      </div>

      <!-- Portfolio Dynamic Filter Bar -->
      <div class="filter-bar" id="portfolio-filter-bar">
        ${demoFilters.map(f => `
          <button class="filter-pill ${f === 'ALL' ? 'active' : ''}" onclick="filterDemosCategory('${f}')">${f}</button>
        `).join('')}
      </div>

      <!-- 10 Demo Cards Grid -->
      <div class="demos-catalog-grid" id="demos-catalog-grid">
        ${DEVCRAFT_DEMOS.map(demo => `
          <div class="demo-card" data-category="${demo.category}">
            <div class="demo-media-wrap">
              <span class="demo-badge-pill">${demo.badge}</span>
              <img src="${demo.image}" alt="${demo.title} Preview" loading="lazy" />
            </div>

            <div class="demo-card-body">
              <h3 class="demo-title">${demo.title}</h3>
              <div class="demo-subtitle">${demo.subtitle}</div>
              <p class="demo-desc">${demo.shortDesc}</p>

              <!-- Metrics Strip -->
              <div class="demo-metrics-strip">
                ${demo.metrics.map(m => `
                  <div>
                    <div class="demo-metric-val text-gradient">${m.value}</div>
                    <div class="demo-metric-lbl">${m.label}</div>
                  </div>
                `).join('')}
              </div>

              <!-- Tech Tags -->
              <div class="service-tech-pills" style="margin-bottom: 16px;">
                ${demo.technologies.slice(0, 4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
              </div>

              <!-- Actions -->
              <div class="demo-card-actions">
                <div class="demo-btn-group-row">
                  <button class="btn btn-primary btn-sm" onclick="devcraftDemos.openDemoModal('${demo.id}')">
                    <span>⚡ View Live Demo</span>
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="devcraftDemos.openCaseStudyModal('${demo.id}')">
                    <span>📖 Case Study</span>
                  </button>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center;">
                  <button class="btn btn-ghost btn-xs text-muted" style="flex-grow: 1; text-align: left;" onclick="devcraftDemos.startProjectFor('${demo.title}')">
                    Start Similar Project →
                  </button>
                  <button type="button" class="btn-share-icon" title="Share Demo" onclick="devcraftShop.openShareModal('${demo.id}')">
                    🔗 Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 5: Live Interactive Demo Lab
function renderDemoLabSection() {
  return `
  <section class="section" id="demo-lab" style="background: rgba(255, 255, 255, 0.01);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Direct Application Launchpad</div>
        <h2 class="section-title">Interactive <span class="text-gradient">Demo Lab</span></h2>
        <p class="section-desc">
          Instant one-click access to all 10 interactive application simulators. Experience genuine user flows, real-time data calculations, and simulated state changes.
        </p>
      </div>

      <div class="demo-lab-tiles-grid">
        ${DEVCRAFT_DEMOS.map((demo, idx) => `
          <div class="demo-lab-tile" onclick="devcraftDemos.openDemoModal('${demo.id}')">
            <div class="tile-header">
              <span class="tile-number">0${idx + 1}</span>
              <span class="status-pill-online"><span class="status-dot"></span> Interactive</span>
            </div>
            <h4 class="tile-title">${demo.title}</h4>
            <div class="tile-sub">${demo.subtitle}</div>
            <div class="tile-action">
              <span>Launch Simulator</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 6: Why DevCraft
function renderWhySection() {
  const pillars = [
    { icon: '💎', title: 'Production-Grade Code', desc: 'Zero shortcuts. We write clean, strongly typed TypeScript and modular code architectures designed to survive heavy scale and team growth.' },
    { icon: '⚡', title: 'Rapid Agile Sprints', desc: 'Bi-weekly working releases with interactive staging URLs. You test real features constantly, keeping surprises to absolute zero.' },
    { icon: '🌐', title: 'Full-Stack Mastery', desc: 'Seamless end-to-end execution across React Native mobile apps, Next.js web applications, high-concurrency Node.js APIs, and AI models.' },
    { icon: '🚀', title: 'Sub-Second Performance', desc: 'Obsessive optimization: Redis caching, relational database indexing, and adaptive CDNs yielding sub-50ms latency and 99/100 Lighthouse scores.' },
    { icon: '🔒', title: '100% IP & Code Ownership', desc: 'You own everything we build. Full copyright transfer, clean Git repositories, complete documentation, and zero proprietary lock-in.' },
    { icon: '⏰', title: '24/7 DevOps & Uptime', desc: 'Continuous cloud uptime monitoring, self-healing Docker containers, automated SSL renewals, and rapid developer response SLAs.' }
  ];

  return `
  <section class="section" id="why-devcraft">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">The DevCraft Difference</div>
        <h2 class="section-title">Why Ambitious Teams <span class="text-gradient">Choose DevCraft</span></h2>
        <p class="section-desc">
          We combine the velocity of a boutique dev lab with the engineering standards of an enterprise tech consultancy.
        </p>
      </div>

      <div class="why-grid">
        ${pillars.map(p => `
          <div class="why-card">
            <div class="why-icon">${p.icon}</div>
            <h3 class="service-title">${p.title}</h3>
            <p class="service-desc">${p.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 7: Development Process
function renderProcessSection() {
  const steps = [
    { num: '01', title: 'Discovery & Scope', desc: 'We dissect your business goals, user journeys, functional constraints, and technical feasibility to produce a fixed timeline and milestone roadmap.' },
    { num: '02', title: 'Architecture & UI/UX', desc: 'We design database schemas, REST/WebSocket API contracts, and high-fidelity interactive component wireframes before writing code.' },
    { num: '03', title: 'Agile Full-Stack Sprints', desc: 'Development in 1-to-2 week sprints with CI/CD continuous deployment to password-protected staging preview environments.' },
    { num: '04', title: 'Rigorous QA & Security', desc: 'Comprehensive testing: unit suites, responsive cross-device validation, OWASP security audits, and load/stress testing.' },
    { num: '05', title: 'Cloud Production Launch', desc: 'Zero-downtime deployment to Render, AWS, or Vercel, paired with automated SSL certificates, CDN caching, and domain DNS routing.' },
    { num: '06', title: 'Continuous Scale & Support', desc: 'Post-launch 24/7 health pings, database telemetry optimization, regular backups, and seamless feature iteration.' }
  ];

  return `
  <section class="section" id="process" style="background: rgba(255, 255, 255, 0.01);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Predictable Execution</div>
        <h2 class="section-title">Our 6-Step <span class="text-gradient">Engineering Lifecycle</span></h2>
        <p class="section-desc">
          A disciplined, transparent software delivery framework that takes your project from napkin sketch to rock-solid production reality.
        </p>
      </div>

      <div class="process-grid">
        ${steps.map(s => `
          <div class="process-card">
            <div class="process-num">${s.num}</div>
            <h3 class="service-title">${s.title}</h3>
            <p class="service-desc">${s.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 8: Technologies & Stack
function renderTechSection() {
  const stacks = [
    { title: 'Frontend & UI', items: ['React 18', 'Next.js 14', 'TypeScript', 'TailwindCSS', 'Three.js WebGL', 'Vite', 'HTML5/SCSS', 'Framer Motion'] },
    { title: 'Mobile Applications', items: ['React Native', 'Android SDK', 'Kotlin', 'Flutter', 'Jetpack Compose', 'Expo', 'Room DB', 'iOS Swift Bridge'] },
    { title: 'Backend & Real-Time APIs', items: ['Node.js', 'Express.js', 'Python FastAPI', 'Socket.IO', 'GraphQL', 'BullMQ Workers', 'RESTful Services', 'JWT/OAuth2'] },
    { title: 'Databases & Storage', items: ['PostgreSQL', 'MongoDB', 'Redis In-Memory', 'Prisma ORM', 'Pinecone Vector DB', 'AWS S3', 'SQLite/Room'] },
    { title: 'Cloud & DevOps Infrastructure', items: ['Docker Containers', 'Render Cloud', 'AWS (EC2, S3, CloudFront)', 'Vercel', 'Cloudflare CDN', 'GitHub Actions CI/CD', 'Linux / NGINX'] },
    { title: 'AI, LLMs & Automation', items: ['OpenAI GPT-4 API', 'LangChain Agents', 'Vector Embeddings', 'Anthropic Claude', 'Puppeteer Scraping', 'Twilio Webhooks', 'Stripe Payments'] }
  ];

  return `
  <section class="section" id="technologies">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Production Tooling</div>
        <h2 class="section-title">Modern <span class="text-gradient">Technology Stack</span></h2>
        <p class="section-desc">
          We deliberately choose proven, future-proof technologies that offer exceptional performance, active ecosystem support, and zero technical debt.
        </p>
      </div>

      <div class="tech-category-grid">
        ${stacks.map(s => `
          <div class="tech-cat-card">
            <h3 class="tech-cat-title">${s.title}</h3>
            <div class="tech-items-wrap">
              ${s.items.map(i => `<span class="tech-badge-item">${i}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 9: Case Studies Spotlight
function renderCaseStudiesSection() {
  const spotlights = [
    {
      id: 'cravex',
      client: 'CraveX Logistics Corp',
      service: 'Native Android & React Native Delivery Platform',
      metrics: ['83% Faster App Launch', '64% Conversion Surge', '4.9 ★ Rating'],
      highlight: 'Engineered sub-50ms live courier GPS tracking that transformed food delivery conversions and eliminated drop-offs.'
    },
    {
      id: 'fitcore',
      client: 'FitCore Franchises',
      service: 'Gym & Fitness Operations SaaS',
      metrics: ['₹3.8L Saved Monthly', '0.4s Check-in Speed', '45+ Gym Locations'],
      highlight: 'Replaced paper registers and WhatsApp renewals with automated Stripe subscription billing and contactless QR turnstile passes.'
    },
    {
      id: 'jarvis-ai',
      client: 'Apex Software Labs',
      service: 'Enterprise AI Assistant Workspace',
      metrics: ['11.5 hrs Saved/Dev', '42% Higher Test Coverage', '500k+ Inferences'],
      highlight: 'Built secure private multi-agent engineering assistant integrated with OpenAI models and corporate vector search.'
    }
  ];

  return `
  <section class="section" id="case-studies" style="background: rgba(255, 255, 255, 0.01);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Demonstrated Impact</div>
        <h2 class="section-title">Case Studies & <span class="text-gradient">Proven Outcomes</span></h2>
        <p class="section-desc">
          See how DevCraft transforms business challenges into high-performing, revenue-generating software systems.
        </p>
      </div>

      <div class="case-studies-spotlight-grid">
        ${spotlights.map(s => `
          <div class="cs-spotlight-card">
            <div class="cs-spot-header">
              <span class="badge-subtle">${s.client}</span>
              <h3 class="service-title" style="margin-top: 8px;">${s.service}</h3>
            </div>
            <p class="service-desc">${s.highlight}</p>
            <div class="cs-spot-metrics">
              ${s.metrics.map(m => `<span class="cs-pill">${m}</span>`).join('')}
            </div>
            <div class="cs-spot-actions">
              <button class="btn btn-outline btn-sm" onclick="devcraftDemos.openCaseStudyModal('${s.id}')">
                Read Detailed Case Study →
              </button>
              <button class="btn btn-primary btn-sm" onclick="devcraftDemos.openDemoModal('${s.id}')">
                Launch Live Demo
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 10: About DevCraft
function renderAboutSection() {
  return `
  <section class="section" id="about">
    <div class="container">
      <div class="about-grid-layout">
        <div class="about-text-col">
          <div class="section-badge">Studio Story & Ethos</div>
          <h2 class="section-title">Ideas → Code → <span class="text-gradient">Real Solutions</span></h2>
          <p class="service-desc">
            DevCraft was founded by lead software engineer Harshit with a single mission: to eliminate the friction, delays, and bloat that plague modern software development.
          </p>
          <p class="service-desc">
            We operate as an elite engineering strike team. Rather than handing your project to junior developers or layers of non-technical account managers, every line of code at DevCraft is designed, built, and reviewed by experienced software architects.
          </p>
          <p class="service-desc">
            From our core engineering hub, we serve clients worldwide across startups, retail brands, healthcare companies, and high-growth platforms.
          </p>

          <div class="about-pillars-row">
            <div class="about-pillar-item">
              <strong>Direct Engineering Access</strong>
              <small>Speak directly with the architects building your product.</small>
            </div>
            <div class="about-pillar-item">
              <strong>Transparent Git Delivery</strong>
              <small>Commit logs, PR reviews, and live preview staging at every step.</small>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <a href="#contact" class="btn btn-primary">Work With DevCraft</a>
          </div>
        </div>

        <div class="about-card-col">
          <div class="about-profile-card">
            <div class="profile-avatar-wrap">
              <img src="/assets/images/avatar-harshit.svg" alt="Harshit - Lead Software Architect" />
            </div>
            <h3 class="profile-name">Harshit</h3>
            <div class="profile-role text-gradient">Lead Software Architect & Founder</div>
            <p class="profile-bio">
              Full-stack engineer passionate about high-concurrency architectures, 3D WebGL interfaces, native Android systems, and autonomous AI pipelines.
            </p>

            <div class="profile-skills-pills">
              <span class="tech-tag">React / Next.js</span>
              <span class="tech-tag">Node.js</span>
              <span class="tech-tag">Kotlin / Android</span>
              <span class="tech-tag">PostgreSQL</span>
              <span class="tech-tag">Docker / DevOps</span>
              <span class="tech-tag">OpenAI LLMs</span>
            </div>

            <div class="profile-social-links">
              <a href="https://wa.me/918791984082" target="_blank" rel="noopener noreferrer" class="channel-btn whatsapp">WhatsApp</a>
              <a href="tel:+917017022966" class="channel-btn call">Call</a>
              <a href="https://www.instagram.com/kiro_mage/" target="_blank" rel="noopener noreferrer" class="channel-btn instagram">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}

// Section 11: Client Testimonials
function renderTestimonialsSection() {
  const reviews = [
    {
      name: 'Rohan Malhotra',
      role: 'Co-Founder & COO, CraveX Logistics',
      rating: '5.0 ★',
      text: 'DevCraft built our food delivery app from the ground up in just 6 weeks. The sub-50ms live courier GPS tracking transformed customer retention. Our checkout conversion rate jumped 64% in the first month!'
    },
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Director of Operations, CareFirst Wellness',
      rating: '5.0 ★',
      text: 'TimeSlot Pro completely removed booking headaches for our 8 clinics. Automated Google Calendar syncing and WhatsApp reminders reduced our patient no-show rate to under 2%. Exceptional engineering quality.'
    },
    {
      name: 'Vikramaditya Rao',
      role: 'Head of Technology, VentureScale',
      rating: '5.0 ★',
      text: 'The Nexus Admin Dashboard DevCraft delivered handles over 50k events per second without breaking a sweat. Clean code, comprehensive documentation, and zero maintenance issues over 12 months in production.'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Founder, Nova Trends E-Commerce',
      rating: '5.0 ★',
      text: 'Our previous Shopify setup was sluggish and losing mobile shoppers. DevCraft engineered a custom headless store with sub-second page loads. Our average order value increased by 28% immediately!'
    }
  ];

  return `
  <section class="section" id="testimonials" style="background: rgba(255, 255, 255, 0.01);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Client Trust</div>
        <h2 class="section-title">What Founders Say About <span class="text-gradient">DevCraft</span></h2>
        <p class="section-desc">
          Real feedback from founders, executives, and product leaders who rely on DevCraft to build and scale their software.
        </p>
      </div>

      <div class="testimonials-grid">
        ${reviews.map(r => `
          <div class="testimonial-card">
            <div class="testimonial-rating text-warning">${r.rating}</div>
            <p class="testimonial-text">"${r.text}"</p>
            <div class="testimonial-author">
              <strong>${r.name}</strong>
              <small>${r.role}</small>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 12: Interactive FAQ Accordion
function renderFaqSection() {
  const faqs = [
    {
      q: 'How does DevCraft manage project milestones and delivery timelines?',
      a: 'Every project begins with a crystal-clear technical specification, fixed deliverables, and bi-weekly sprint milestones. You receive access to a dedicated client staging environment where you can review live working builds at the end of every sprint.'
    },
    {
      q: 'Do I get complete ownership of the source code and intellectual property (IP)?',
      a: 'Yes, 100%. Upon final project milestone completion, all copyright and intellectual property rights are formally transferred to your entity. You receive clean, well-documented Git repositories with zero proprietary dependencies or vendor lock-in.'
    },
    {
      q: 'Can DevCraft refactor, modernize, or take over an existing troubled codebase?',
      a: 'Yes. We regularly conduct comprehensive Code Audits to inspect performance bottlenecks, security vulnerabilities, and outdated dependencies. We then formulate a safe, phased migration plan to modernize your software without interrupting live production users.'
    },
    {
      q: 'Which cloud infrastructure platforms and databases do you deploy to?',
      a: 'We deploy to Render, AWS (EC2, S3, CloudFront, RDS), Vercel, and Cloudflare. For databases, we specialize in PostgreSQL, MongoDB, Redis caching, and vector stores such as Pinecone.'
    },
    {
      q: 'Do you sign Non-Disclosure Agreements (NDAs) before discussing project details?',
      a: 'Absolutely. We routinely sign bilateral NDAs before scoping calls to guarantee your proprietary business logic, algorithms, and intellectual property remain strictly confidential.'
    },
    {
      q: 'What happens after deployment? Do you offer post-launch maintenance & support?',
      a: 'Yes. Every project includes 30 days of complimentary post-launch warranty support. Beyond that, we provide monthly retainer packages covering 24/7 server monitoring, automated backups, security patches, and on-demand feature additions.'
    }
  ];

  return `
  <section class="section" id="faq">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Common Inquiries</div>
        <h2 class="section-title">Frequently Asked <span class="text-gradient">Questions</span></h2>
        <p class="section-desc">
          Clear, straightforward answers about how we collaborate, bill, engineer, and support your software.
        </p>
      </div>

      <div class="faq-accordion" id="faq-accordion">
        ${faqs.map((faq, i) => `
          <div class="faq-item ${i === 0 ? 'active' : ''}" onclick="toggleFaq(this)">
            <div class="faq-question">
              <span>${faq.q}</span>
              <span class="faq-toggle-icon">+</span>
            </div>
            <div class="faq-answer">
              <p>${faq.a}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 13: Transparent Pricing & Project Estimator
function renderPricingSection() {
  return `
  <section class="section" id="pricing" style="background: rgba(255, 255, 255, 0.01);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Transparent Investment</div>
        <h2 class="section-title">Straightforward <span class="text-gradient">Pricing Tiers</span></h2>
        <p class="section-desc">
          No hidden fees or unexpected billing spikes. Fixed milestones, dedicated sprints, and predictable ROI.
        </p>
      </div>

      <!-- Pricing Cards -->
      <div class="pricing-tiers-grid">
        <!-- Tier 1 -->
        <div class="pricing-card">
          <div class="pricing-badge">MVP / Starter</div>
          <h3 class="pricing-title">Starter Sprint</h3>
          <div class="pricing-price-num text-gradient">₹24,999+</div>
          <p class="pricing-desc">Ideal for high-converting landing pages, rapid MVPs, or standalone microservices.</p>
          <ul class="pricing-features-list">
            <li><span>✓</span> Custom responsive UI with animations</li>
            <li><span>✓</span> Node.js / Express backend integration</li>
            <li><span>✓</span> Contact inquiry capture & database storage</li>
            <li><span>✓</span> Free SSL & Render/Vercel deployment</li>
            <li><span>✓</span> 14 days complimentary post-launch support</li>
          </ul>
          <button class="btn btn-outline btn-block" onclick="devcraftDemos.startProjectFor('Starter Sprint')">Select Starter Sprint</button>
        </div>

        <!-- Tier 2 (Featured) -->
        <div class="pricing-card featured">
          <div class="pricing-badge-popular">Most Popular</div>
          <div class="pricing-badge">Full Solution</div>
          <h3 class="pricing-title">Growth Studio</h3>
          <div class="pricing-price-num text-gradient">₹59,999+</div>
          <p class="pricing-desc">Complete full-stack web application or cross-platform mobile app with auth & payments.</p>
          <ul class="pricing-features-list">
            <li><span>✓</span> React / Next.js or React Native mobile app</li>
            <li><span>✓</span> PostgreSQL or MongoDB database schema design</li>
            <li><span>✓</span> JWT user authentication & role access control</li>
            <li><span>✓</span> Stripe / Razorpay payment gateway integration</li>
            <li><span>✓</span> 30 days priority warranty & support</li>
          </ul>
          <button class="btn btn-primary btn-block" onclick="devcraftDemos.startProjectFor('Growth Studio')">Select Growth Studio</button>
        </div>

        <!-- Tier 3 -->
        <div class="pricing-card">
          <div class="pricing-badge">Enterprise Scale</div>
          <h3 class="pricing-title">Enterprise Custom</h3>
          <div class="pricing-price-num text-gradient">₹1,20,000+</div>
          <p class="pricing-desc">High-concurrency multi-tenant SaaS, custom AI agent workflows, and mission-critical cloud systems.</p>
          <ul class="pricing-features-list">
            <li><span>✓</span> Full-scale microservice & pub/sub architecture</li>
            <li><span>✓</span> AI agent integration (GPT-4 / Claude / Vector DB)</li>
            <li><span>✓</span> Custom admin operations cockpit & telemetry</li>
            <li><span>✓</span> Docker containerization & AWS auto-scaling</li>
            <li><span>✓</span> 60 days dedicated maintenance & 24/7 SLA</li>
          </ul>
          <button class="btn btn-outline btn-block" onclick="devcraftDemos.startProjectFor('Enterprise Custom')">Select Enterprise Custom</button>
        </div>
      </div>

      <!-- Interactive Project Cost Estimator -->
      <div class="pricing-estimator-box" style="margin-top: 50px;">
        <div class="estimator-header text-center">
          <h3>Interactive Project Cost Estimator</h3>
          <p class="text-secondary">Get an instant preliminary estimate tailored to your project scope.</p>
        </div>

        <div class="estimator-controls-grid">
          <div class="est-control">
            <label class="input-label">Project Type</label>
            <select class="form-control" id="est-type" onchange="calculateEstimate()">
              <option value="web">Full-Stack Web App</option>
              <option value="mobile">Mobile App (iOS & Android)</option>
              <option value="ai">AI Agent & LLM Automation</option>
              <option value="dashboard">Admin Operations Dashboard</option>
              <option value="website">High-Speed Business Website</option>
            </select>
          </div>

          <div class="est-control">
            <label class="input-label">Complexity Level</label>
            <select class="form-control" id="est-complexity" onchange="calculateEstimate()">
              <option value="mvp">Lean MVP (Fast to market)</option>
              <option value="standard" selected>Production Standard (Auth, DB, APIs)</option>
              <option value="enterprise">Enterprise Grade (High concurrency, AI, SLA)</option>
            </select>
          </div>

          <div class="est-control">
            <label class="input-label">Desired Delivery Window</label>
            <select class="form-control" id="est-speed" onchange="calculateEstimate()">
              <option value="normal">Standard (4 - 6 Weeks)</option>
              <option value="express">Express Sprint (2 - 3 Weeks)</option>
              <option value="flexible">Flexible (8+ Weeks)</option>
            </select>
          </div>
        </div>

        <div class="estimator-result-bar">
          <div>
            <div class="est-label">Estimated Investment Range:</div>
            <div class="est-value text-gradient" id="est-result-val">₹45,000 – ₹75,000</div>
          </div>
          <button class="btn btn-primary" onclick="devcraftDemos.startProjectFor('Custom Estimator Quote')">
            Claim This Estimate →
          </button>
        </div>
      </div>
    </div>
  </section>
  `;
}

// Section 14: Project Inquiry Form
function renderContactSection() {
  return `
  <section class="section" id="contact">
    <div class="container">
      <div class="contact-grid">
        <!-- Contact Info Column -->
        <div class="contact-info-col">
          <div class="section-badge">Let's Build Together</div>
          <h2 class="section-title">Start Your <span class="text-gradient">DevCraft Project</span></h2>
          <p class="service-desc">
            Tell us what you want to build. We will review your requirements, prepare a comprehensive technical architecture proposal, and respond within 24 hours.
          </p>

          <div class="contact-methods-list">
            <a href="https://wa.me/918791984082?text=Hi%20DevCraft,%20I'd%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" class="contact-method-card">
              <div class="method-icon wa-icon">💬</div>
              <div>
                <strong>Chat Directly on WhatsApp</strong>
                <small>+91 8791984082 • Typically replies in 15 minutes</small>
              </div>
            </a>

            <a href="tel:+917017022966" class="contact-method-card">
              <div class="method-icon call-icon">📞</div>
              <div>
                <strong>Direct Studio Call</strong>
                <small>+91 7017022966 • Available 09:00 - 21:00 IST</small>
              </div>
            </a>

            <a href="mailto:shakyaharshit683@gmail.com" class="contact-method-card">
              <div class="method-icon mail-icon">✉️</div>
              <div>
                <strong>Direct Email Address</strong>
                <small>shakyaharshit683@gmail.com • Strict NDA compliant</small>
              </div>
            </a>
          </div>

          <div class="contact-trust-points">
            <div>✓ Strict Non-Disclosure Agreement (NDA) on request</div>
            <div>✓ Detailed scope & fixed-cost quotation guarantee</div>
            <div>✓ Direct communication with Senior Software Architect</div>
          </div>
        </div>

        <!-- Working Inquiry Form -->
        <div class="contact-form-card">
          <h3 class="form-title">Send Project Inquiry</h3>
          <p class="form-subtitle">Fill in the specifications below to initiate your sprint.</p>

          <form id="project-inquiry-form" onsubmit="submitInquiry(event)">
            <div class="form-row">
              <div class="form-group">
                <label class="input-label" for="client-name">Your Full Name *</label>
                <input type="text" id="client-name" name="name" class="form-control" placeholder="e.g. Rahul Sharma" required />
              </div>
              <div class="form-group">
                <label class="input-label" for="client-email">Work Email *</label>
                <input type="email" id="client-email" name="email" class="form-control" placeholder="rahul@company.com" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="input-label" for="client-phone">Phone / WhatsApp *</label>
                <input type="tel" id="client-phone" name="phone" class="form-control" placeholder="+91 98765 43210" required />
              </div>
              <div class="form-group">
                <label class="input-label" for="project-service">Primary Service Required *</label>
                <select id="project-service" name="service" class="form-control" required>
                  <option value="" disabled selected>Select a Service</option>
                  ${DEVCRAFT_SERVICES.map(s => `
                    <option value="${s.name}">${s.name}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="input-label" for="project-budget">Estimated Budget Range *</label>
                <select id="project-budget" name="budget" class="form-control" required>
                  <option value="Under ₹25,000">Under ₹25,000 (MVP / Starter)</option>
                  <option value="₹25,000 - ₹60,000" selected>₹25,000 - ₹60,000 (Standard Sprints)</option>
                  <option value="₹60,000 - ₹1,50,000">₹60,000 - ₹1,50,000 (Full-Stack Platform)</option>
                  <option value="₹1,50,000+">₹1,50,000+ (Enterprise Custom / AI)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="input-label" for="project-timeline">Target Timeline</label>
                <select id="project-timeline" name="timeline" class="form-control">
                  <option value="Immediate Sprint (1-2 Weeks)">Immediate Sprint (1-2 Weeks)</option>
                  <option value="Standard Window (3-4 Weeks)" selected>Standard Window (3-4 Weeks)</option>
                  <option value="Quarterly Roadmap (1-2 Months)">Quarterly Roadmap (1-2 Months)</option>
                  <option value="Flexible Schedule">Flexible Schedule</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="input-label" for="project-details">Project Summary & Technical Requirements *</label>
              <textarea id="project-details" name="message" class="form-control" rows="4" placeholder="Briefly describe what you'd like to build, your target audience, existing stack, or any specific demo you want similar to..." required></textarea>
            </div>

            <button type="submit" id="submit-inquiry-btn" class="btn btn-primary btn-block">
              <span>Send Project Inquiry Now →</span>
            </button>
            <div id="form-feedback-msg" class="form-feedback"></div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `;
}

// Section 15: Final High-Impact CTA Banner
function renderFinalCtaSection() {
  return `
  <section class="section final-cta-section" style="padding: 70px 0;">
    <div class="container">
      <div class="final-cta-banner">
        <div class="final-cta-content">
          <div class="section-badge">Accelerate Delivery</div>
          <h2 class="final-cta-title">Have a Software Concept You Need <span class="text-gradient">Shipped Fast?</span></h2>
          <p class="final-cta-desc">
            Let’s turn your vision into high-performance code. Book a free technical architecture consultation with our lead engineer today.
          </p>
          <div class="final-cta-buttons">
            <a href="#contact" class="btn btn-primary">Start Your Project</a>
            <a href="https://wa.me/918791984082?text=Hi%20DevCraft,%20let's%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" class="btn btn-emerald">
              Chat on WhatsApp
            </a>
            <a href="tel:+917017022966" class="btn btn-outline">Call +91 7017022966</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}

// Modals Wrapper (Demo modal, Case Study modal, Service modal, Confirmation modal)
function renderModalsMarkup() {
  return `
  <!-- 1. Interactive Demo Simulator Modal -->
  <div class="devcraft-modal" id="demo-modal">
    <div class="devcraft-modal-dialog">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <h3 id="demo-modal-title">DevCraft Interactive Demo</h3>
          <p id="demo-modal-subtitle">Live simulated application environment</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn btn-xs btn-primary" id="demo-modal-cta">Start Similar Project →</button>
          <button class="devcraft-modal-close" onclick="devcraftDemos.hideModal('demo-modal')" aria-label="Close modal">&times;</button>
        </div>
      </div>
      <div class="devcraft-modal-body" id="demo-interactive-stage">
        <!-- Interactive demo contents rendered here by devcraft-demos.js -->
      </div>
    </div>
  </div>

  <!-- 2. Case Study Modal -->
  <div class="devcraft-modal" id="case-study-modal">
    <div class="devcraft-modal-dialog">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <h3>Client Case Study & Architecture</h3>
          <p>Real challenges, engineering solutions, and measurable impact</p>
        </div>
        <button class="devcraft-modal-close" onclick="devcraftDemos.hideModal('case-study-modal')" aria-label="Close modal">&times;</button>
      </div>
      <div class="devcraft-modal-body" id="case-study-modal-body">
        <!-- Case study details rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- 3. Service Details Modal -->
  <div class="devcraft-modal" id="service-modal">
    <div class="devcraft-modal-dialog">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <h3>Development Service Specification</h3>
          <p>Features, use-cases, and production architectures</p>
        </div>
        <button class="devcraft-modal-close" onclick="devcraftDemos.hideModal('service-modal')" aria-label="Close modal">&times;</button>
      </div>
      <div class="devcraft-modal-body" id="service-modal-body">
        <!-- Service details rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- 4. Inquiry Success Confirmation Modal -->
  <div class="devcraft-modal" id="inquiry-success-modal">
    <div class="devcraft-modal-dialog" style="max-width: 500px; text-align: center;">
      <div class="devcraft-modal-body" style="padding: 40px 30px;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Inquiry Received Successfully!</h3>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5;">
          Thank you for reaching out to <strong>DEVCRAFT</strong>. Our lead software architect will review your project requirements and connect with you via email and WhatsApp within 24 hours.
        </p>
        <div style="background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px; margin: 20px 0; font-family: var(--font-mono); font-size: 0.85rem;" id="inquiry-ref-box">
          Inquiry Ref: DC-INQ-${Math.floor(100000 + Math.random() * 900000)}
        </div>
        <button class="btn btn-primary btn-block" onclick="devcraftDemos.hideModal('inquiry-success-modal')">
          Back to DevCraft Studio
        </button>
      </div>
    </div>
  </div>

  <!-- 5. Product Detail Modal (Requirement 9) -->
  <div class="devcraft-modal" id="product-detail-modal">
    <div class="devcraft-modal-dialog product-modal-dialog">
      <button class="devcraft-modal-close" onclick="devcraftShop.hideModal('product-detail-modal')" aria-label="Close modal">&times;</button>
      <div class="devcraft-modal-body" id="product-detail-modal-body">
        <!-- Rendered dynamically by devcraftShop.openProductModal -->
      </div>
    </div>
  </div>

  <!-- 6. Share Product Modal (Requirement 5, 6, 7) -->
  <div class="devcraft-modal" id="share-product-modal">
    <div class="devcraft-modal-dialog share-modal-dialog">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <h3>Share with Network</h3>
          <p>Spread the word via WhatsApp, Telegram, X, or direct link</p>
        </div>
        <button class="devcraft-modal-close" onclick="devcraftShop.hideModal('share-product-modal')" aria-label="Close modal">&times;</button>
      </div>
      <div class="devcraft-modal-body" id="share-product-modal-body">
        <!-- Rendered dynamically by devcraftShop.openShareModal -->
      </div>
    </div>
  </div>

  <!-- 7. Checkout & Coupon Order Modal (Requirement 3 & 4) -->
  <div class="devcraft-modal" id="checkout-order-modal">
    <div class="devcraft-modal-dialog checkout-modal-dialog">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <h3>Order &amp; Project Checkout</h3>
          <p>Instant booking with automatic discounts and secure coupon verification</p>
        </div>
        <button class="devcraft-modal-close" onclick="devcraftShop.hideModal('checkout-order-modal')" aria-label="Close modal">&times;</button>
      </div>
      <div class="devcraft-modal-body" id="checkout-order-modal-body">
        <!-- Rendered dynamically by devcraftShop.openCheckoutModal -->
      </div>
    </div>
  </div>

  <!-- 8. Order Success Modal -->
  <div class="devcraft-modal" id="order-success-modal">
    <div class="devcraft-modal-dialog" style="max-width: 540px;">
      <div class="devcraft-modal-body" id="order-success-modal-body">
        <!-- Rendered dynamically by devcraftShop.showOrderSuccess -->
      </div>
    </div>
  </div>
  `;
}

// Embedded Data & Scripts
function renderClientDataScripts() {
  return `
  <!-- Embed Catalogs in Client Window for Zero-Lag Execution -->
  <script>
    window.DEVCRAFT_SERVICES_DATA = ${safeJsonServices};
    window.DEVCRAFT_DEMOS_DATA = ${safeJsonDemos};
    window.DEVCRAFT_PRODUCTS_DATA = ${safeJsonProducts};
  </script>

  <!-- External CDNs for Three.js WebGL (Safe fallback handled in three-scene.js) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <!-- DevCraft Core Scripts -->
  <script src="/js/api.js"></script>
  <script src="/js/devcraft-auth.js"></script>
  <script src="/js/devcraft-demos.js"></script>
  <script src="/js/devcraft-shop.js"></script>
  <script src="/js/three-scene.js"></script>
  <script src="/js/main.js"></script>
  <script src="/js/form.js"></script>
  `;
}

// ==========================================
// 2. BUILD FRONTEND / INDEX.HTML
// ==========================================
function buildIndexHtml() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('DEVCRAFT Studio', 'Ideas → Code → Real Solutions. High-performance software engineering studio offering Android & mobile apps, full-stack web applications, AI automation, and cloud systems.')}
</head>
<body>
  ${navbar('home')}

  <main>
    ${renderHeroSection()}
    ${renderServicesSection()}
    ${renderAptitudeSection()}
    ${renderFeaturedDemosSection()}
    ${renderDemoLabSection()}
    ${renderWhySection()}
    ${renderProcessSection()}
    ${renderTechSection()}
    ${renderCaseStudiesSection()}
    ${renderAboutSection()}
    ${renderTestimonialsSection()}
    ${renderFaqSection()}
    ${renderPricingSection()}
    ${renderContactSection()}
    ${renderFinalCtaSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(FRONTEND, 'index.html'), html, 'utf8');
  console.log('✓ Generated frontend/index.html with all 16 sections, 20 services, and 10 demos.');
}

// ==========================================
// 3. BUILD SUBPAGES (SERVICES, PROJECTS, ABOUT, CONTACT, PORTAL, ADMIN)
// ==========================================
function buildServicesPage() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('All 20 Development Services & Aptitude Hub', 'Explore DevCraft’s comprehensive catalog of 20 software development services (50% OFF) and Campus Aptitude & Placement Prep courses (30% OFF).')}
</head>
<body>
  ${navbar('services')}

  <main style="padding-top: 100px;">
    ${renderServicesSection()}
    ${renderAptitudeSection()}
    ${renderPricingSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'services.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/services.html');
}

function buildProjectsPage() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('Interactive Demos & Portfolio', 'Explore 10 interactive application demos engineered by DevCraft across Mobile, Web, AI, and Dashboards.')}
</head>
<body>
  ${navbar('demos')}

  <main style="padding-top: 100px;">
    ${renderFeaturedDemosSection()}
    ${renderDemoLabSection()}
    ${renderCaseStudiesSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'projects.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/projects.html');
}

function buildAboutPage() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('About DevCraft Studio', 'Learn about DevCraft’s software engineering philosophy, lead architect Harshit, and our production standards.')}
</head>
<body>
  ${navbar('about')}

  <main style="padding-top: 100px;">
    ${renderAboutSection()}
    ${renderWhySection()}
    ${renderProcessSection()}
    ${renderTechSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'about.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/about.html');
}

function buildContactPage() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('Contact & Project Inquiry', 'Start your software project with DevCraft. Request a quote or schedule a technical scoping call.')}
</head>
<body>
  ${navbar('contact')}

  <main style="padding-top: 100px;">
    ${renderContactSection()}
    ${renderFaqSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'contact.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/contact.html');
}

function buildClientPortalPage() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('Client Portal Login', 'Access your live DevCraft sprint milestones, staging links, invoices, and project roadmap.')}
</head>
<body>
  ${navbar('portal')}

  <main style="padding: 120px 0 80px; min-height: 80vh; display: flex; align-items: center;">
    <div class="container" style="max-width: 520px;">
      <div class="glass-card" style="padding: 40px; border-radius: 20px; border: 1px solid var(--border-glow);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div class="brand-badge-icon" style="margin: 0 auto 16px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 700;">Client Portal Access</h2>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">Sign in to view live sprint milestones, staging links & invoices.</p>
        </div>

        <form onsubmit="event.preventDefault(); alert('Demo Client Portal: Staging workspace preview verified for Client Demo #DC-8841.');">
          <div class="form-group" style="margin-bottom: 16px;">
            <label class="input-label">Client Access Email</label>
            <input type="email" class="form-control" placeholder="client@company.com" value="client@demo.com" required />
          </div>
          <div class="form-group" style="margin-bottom: 20px;">
            <label class="input-label">Project Passkey / PIN</label>
            <input type="password" class="form-control" placeholder="••••••••" value="demo2026" required />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Access Project Dashboard →</button>
        </form>

        <div style="margin-top: 20px; text-align: center; font-size: 0.82rem; color: var(--text-muted);">
          Need an active client passkey? <a href="https://wa.me/918791984082" target="_blank" style="color: var(--cyan);">Contact Studio Lead</a>
        </div>
      </div>
    </div>
  </main>

  ${footer()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'client-portal.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/client-portal.html');
}

function buildAdminLoginPage() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('Studio Admin Portal', 'DevCraft Internal Operations Cockpit & Inquiry Manager')}
</head>
<body>
  ${navbar()}

  <main style="padding: 120px 0 80px; min-height: 80vh; display: flex; align-items: center;">
    <div class="container" style="max-width: 500px;">
      <div class="glass-card" style="padding: 40px; border-radius: 20px; border: 1px solid var(--border-glow);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div class="brand-badge-icon" style="margin: 0 auto 16px; background: #f59e0b;">
            🔒
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 700;">Studio Admin Authentication</h2>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">Authorized engineering personnel only</p>
        </div>

        <form id="admin-login-form" onsubmit="handleAdminLogin(event)">
          <div class="form-group" style="margin-bottom: 16px;">
            <label class="input-label">Admin Email</label>
            <input type="email" id="admin-email-input" class="form-control" placeholder="shakyaharshit683@gmail.com" value="shakyaharshit683@gmail.com" required />
          </div>
          <div class="form-group" style="margin-bottom: 20px;">
            <label class="input-label">Admin Password</label>
            <input type="password" id="admin-password-input" class="form-control" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Authenticate Session 🔒</button>
        </form>

        <div id="admin-login-feedback" style="margin-top: 15px; text-align: center; font-size: 0.85rem;"></div>
      </div>
    </div>
  </main>

  ${footer()}
  ${renderClientDataScripts()}
  <script>
    async function handleAdminLogin(e) {
      e.preventDefault();
      const email = document.getElementById('admin-email-input').value;
      const password = document.getElementById('admin-password-input').value;
      const fb = document.getElementById('admin-login-feedback');
      fb.innerHTML = '<span style="color: var(--cyan);">Authenticating...</span>';

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem('admin_token', data.token);
          fb.innerHTML = '<span style="color: #10b981;">Access Granted! Redirecting...</span>';
          setTimeout(() => { window.location.href = '/admin/'; }, 600);
        } else {
          fb.innerHTML = '<span style="color: #ef4444;">' + (data.message || 'Invalid admin credentials') + '</span>';
        }
      } catch (err) {
        fb.innerHTML = '<span style="color: #ef4444;">Server connection error. Please try again.</span>';
      }
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'admin-login.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/admin-login.html');
}

// Master execution
function buildAll() {
  console.log('🚀 Starting DEVCRAFT Master Site Generation...');
  buildIndexHtml();
  buildServicesPage();
  buildProjectsPage();
  buildAboutPage();
  buildContactPage();
  buildClientPortalPage();
  buildAdminLoginPage();
  console.log('🎉 All DevCraft HTML pages generated successfully!');
}

if (require.main === module) {
  buildAll();
}

module.exports = { buildAll };

