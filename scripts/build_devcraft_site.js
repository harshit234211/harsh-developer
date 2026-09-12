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
          Turn Your Ideas Into <span class="text-gradient">Real Software.</span>
        </h1>

        <!-- Visual Workflow: Idea → Design → Code → Product → Launch -->
        <div class="hero-workflow-stepper">
          <span class="step-item"><span class="step-num">1</span> Idea</span>
          <span class="step-arrow">→</span>
          <span class="step-item"><span class="step-num">2</span> Design</span>
          <span class="step-arrow">→</span>
          <span class="step-item"><span class="step-num">3</span> Code</span>
          <span class="step-arrow">→</span>
          <span class="step-item"><span class="step-num">4</span> Product</span>
          <span class="step-arrow">→</span>
          <span class="step-item"><span class="step-num">5</span> Launch</span>
        </div>

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
          <span class="pill-tag">🎓 Aptitude & Placement Hub</span>
        </div>

        <!-- Primary CTAs -->
        <div class="hero-cta-group">
          <a href="/products" class="btn btn-primary">
            <span>Explore Products (50% OFF)</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          <a href="/contact" class="btn btn-emerald">Build My App</a>
          <a href="/portfolio" class="btn btn-outline">View Portfolio &amp; Demos</a>
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

// Section 2.5: Flagship Autonomous AI Agents (Joya AI & Jarvis AI)
function renderFlagshipsSection() {
  return `
  <section class="section" id="flagships" style="background: rgba(11, 17, 32, 0.4); border-top: 1px solid var(--border-glass); border-bottom: 1px solid var(--border-glass);">
    <div class="container">
      <div class="section-header text-center" style="margin-bottom: 40px;">
        <div class="section-badge" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.3); color: #d8b4fe;">Flagship Autonomous AI Agents</div>
        <h2 class="section-title">Autonomous AI Systems Built by <span class="text-gradient">DevCraft</span></h2>
        <p class="section-desc">Production-ready voice and desktop AI software. On-device offline acoustic processing, custom wake words, desktop automation, and direct installer packages.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 28px;">
        <!-- Card 1: Joya AI -->
        <div class="glass-card" style="padding: 30px; border-radius: 20px; border: 1px solid rgba(168, 85, 247, 0.3); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
              <span class="flagship-hero-badge">🎙️ Android Native • Full Source Code Included</span>
              <span class="pill-tag" style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 700;">50% OFF</span>
            </div>

            <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">Joya AI — Full Source Code</h3>
            <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">
              Autonomous on-device voice assistant for Android with custom wake word <strong>"Wake up Joya"</strong>. Hands-free WhatsApp messaging, calls, alarms, and offline speech recognition. Customer gets the complete Joya Android source code after successful purchase.
            </p>

            <!-- Interactive Voice Waveform Simulator -->
            <div class="voice-wave-simulator">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--cyan); text-transform: uppercase;">Wake Word: "Wake up Joya"</span>
                <span class="status-pill-online" style="font-size: 0.7rem;"><span class="status-dot"></span> Active</span>
              </div>
              <div class="voice-bars-wrap">
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
              </div>
              <button type="button" class="btn btn-xs btn-outline" onclick="devcraftShop.simulateJoyaWakeWord()">
                Test Wake Word ("Wake up Joya") 🎙️
              </button>
              <div id="joya-voice-status" style="margin-top: 10px; font-size: 0.82rem; min-height: 20px;"></div>
            </div>

            <ul class="product-features-list" style="margin-top: 18px;">
              <li><span class="check-icon">✓</span> Complete Android Studio Kotlin project source code</li>
              <li><span class="check-icon">✓</span> Responsive wake word detection ("Wake up Joya")</li>
              <li><span class="check-icon">✓</span> WhatsApp &amp; Phone Dialer hands-free automation</li>
              <li><span class="check-icon">✓</span> 100% On-device privacy &amp; offline voice synthesis</li>
            </ul>
          </div>

          <div style="margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <del style="color: var(--text-muted); font-size: 0.9rem;">₹1,999</del>
                <span style="color: #10b981; font-size: 0.8rem; font-weight: 700; margin-left: 6px;">50% OFF</span>
                <div style="font-size: 1.4rem; font-weight: 800; color: var(--cyan);">₹999</div>
              </div>
              <span style="font-size: 0.78rem; color: #10b981; font-weight: 600;">Full Source Code Included</span>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-emerald btn-sm" onclick="devcraftShop.openCheckoutModal('joya-ai')">
                Buy Source Code (₹999) ⚡
              </button>
              <button class="btn btn-outline btn-sm" onclick="devcraftShop.addToCart('joya-ai')">
                + Cart 🛒
              </button>
              <a href="/joya" class="btn btn-ghost btn-sm">Full Specs →</a>
            </div>
          </div>
        </div>

        <!-- Card 2: Jarvis AI -->
        <div class="glass-card" style="padding: 30px; border-radius: 20px; border: 1px solid rgba(59, 130, 246, 0.3); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
              <span class="flagship-hero-badge" style="background: rgba(59, 130, 246, 0.15); color: #93c5fd; border-color: rgba(59, 130, 246, 0.4);">💻 PC Desktop • Full Source Code Included</span>
              <span class="pill-tag" style="background: rgba(0, 240, 255, 0.15); color: var(--cyan); font-weight: 700;">50% OFF</span>
            </div>

            <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">Jarvis AI — Full Source Code</h3>
            <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">
              Autonomous desktop assistant for PC (Windows/Mac/Linux). Executes terminal scripts, automates web browser workflows, indexes workspace files, and connects to local LLMs (Ollama). Customer gets the complete Jarvis PC source code after successful purchase.
            </p>

            <!-- Interactive Terminal Sandbox Mockup -->
            <div class="terminal-mockup">
              <div class="terminal-mockup-header">
                <span class="term-dot red"></span>
                <span class="term-dot yellow"></span>
                <span class="term-dot green"></span>
                <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 6px;">jarvis-core — bash</span>
              </div>
              <div class="terminal-mockup-body" id="jarvis-terminal-output">
                <div class="cmd-line">[Ready] Jarvis PC Agent v3.1.2 online...</div>
                <div class="out-line">Hotkeys enabled: Ctrl+Space listener active.</div>
              </div>
              <div style="padding: 8px 14px; background: #0b1120; border-top: 1px solid rgba(255, 255, 255, 0.06); display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('index')">Index Files</button>
                <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('scrape')">Web Scraper</button>
                <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('diag')">Diagnostics</button>
              </div>
            </div>

            <ul class="product-features-list" style="margin-top: 18px;">
              <li><span class="check-icon">✓</span> Complete PC Desktop project source code (Electron + Python)</li>
              <li><span class="check-icon">✓</span> Voice &amp; Hotkey (Ctrl+Space) desktop command center</li>
              <li><span class="check-icon">✓</span> Local LLM bridge (Ollama / Llama-3) &amp; script executor</li>
              <li><span class="check-icon">✓</span> Automated web scraper and file organization sentinel</li>
            </ul>
          </div>

          <div style="margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <del style="color: var(--text-muted); font-size: 0.9rem;">₹3,199</del>
                <span style="color: #10b981; font-size: 0.8rem; font-weight: 700; margin-left: 6px;">50% OFF</span>
                <div style="font-size: 1.4rem; font-weight: 800; color: var(--cyan);">₹1,599</div>
              </div>
              <span style="font-size: 0.78rem; color: #10b981; font-weight: 600;">Full Source Code Included</span>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-emerald btn-sm" onclick="devcraftShop.openCheckoutModal('jarvis-ai')">
                Buy Source Code (₹1,599) ⚡
              </button>
              <button class="btn btn-outline btn-sm" onclick="devcraftShop.addToCart('jarvis-ai')">
                + Cart 🛒
              </button>
              <a href="/jarvis" class="btn btn-ghost btn-sm">Full Specs →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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
          Inquiry Ref: DC-INQ-705532
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

  <!-- 9. Dynamic UPI Payment & Verification Modal -->
  <div class="devcraft-modal" id="upi-payment-modal">
    <div class="devcraft-modal-dialog upi-modal-dialog" style="max-width: 560px;">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #10b981; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            <span class="status-dot"></span> Secure UPI Payment Gateway
          </div>
          <h3 id="upi-modal-title" style="margin-top: 4px;">Dynamic UPI QR &amp; Verification</h3>
          <p id="upi-modal-subtitle">Pay securely via any UPI App or scan QR to unlock instant source code download</p>
        </div>
        <button class="devcraft-modal-close" onclick="devcraftShop.hideModal('upi-payment-modal')" aria-label="Close modal">&times;</button>
      </div>
      <div class="devcraft-modal-body" id="upi-payment-modal-body">
        <!-- Rendered dynamically by devcraftShop.openUpiPaymentModal -->
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
    ${renderFlagshipsSection()}
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

// ==========================================
// 4. DEDICATED PRODUCTS CATALOG PAGE
// ==========================================
function buildProductsPage() {
  const categories = ['All', 'Android Apps', 'PC Software', 'AI Products', 'Utilities', 'Aptitude', 'Other Products'];

  const productCardsHtml = DEVCRAFT_PRODUCTS.map(p => {
    const isAptitude = p.type === 'aptitude' || p.category === 'Aptitude';
    const discountPercent = isAptitude ? 30 : 50;
    const originalPrice = Number(p.originalPrice) || 10000;
    const finalPrice = p.finalPrice !== undefined ? p.finalPrice : Math.round(originalPrice * (1 - discountPercent / 100));

    let detailsLink = '/products';
    if (p.id === 'joya-ai') detailsLink = '/joya';
    else if (p.id === 'jarvis-ai') detailsLink = '/jarvis';
    else if (isAptitude) detailsLink = '/aptitude';

    return `
    <div class="product-shop-card" data-category="${p.category || 'Other'}" data-name="${(p.name || '').toLowerCase()}" data-price="${finalPrice}">
      <div class="product-card-top">
        <div class="product-card-meta">
          <span class="product-category-chip">${p.category}</span>
          <span class="product-discount-chip ${isAptitude ? 'chip-aptitude' : 'chip-app'}">
            ${discountPercent}% OFF
          </span>
        </div>
        ${p.platform ? `<span class="product-platform-tag">${p.platform}</span>` : ''}
      </div>

      <div class="product-card-info">
        <h3 class="product-card-title">${p.name}</h3>
        <p class="product-card-desc">${p.shortDesc}</p>
        
        <ul class="product-card-features">
          ${(p.features || []).slice(0, 3).map(f => `<li><span class="check-icon">✓</span> ${f}</li>`).join('')}
        </ul>

        <div class="product-tech-stack">
          ${(p.technologies || []).slice(0, 4).map(t => `<span class="tech-mini-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="product-card-pricing-footer">
        <div class="product-price-block">
          <div class="product-price-orig">
            <span>Original:</span>
            <del>₹${originalPrice.toLocaleString('en-IN')}</del>
          </div>
          <div class="product-price-final">
            <span class="price-val text-gradient">₹${finalPrice.toLocaleString('en-IN')}</span>
            <span class="price-save-badge">Save ${discountPercent}%</span>
          </div>
        </div>

        <div class="product-card-btn-grid">
          ${p.fileDetails && p.fileDetails.hasDownload ? `
          <button type="button" class="btn btn-primary btn-sm" onclick="devcraftShop.downloadProduct('${p.id}')" title="Direct download verified package">
            ⬇️ Download
          </button>
          ` : ''}
          <button type="button" class="btn btn-emerald btn-sm" onclick="devcraftShop.openCheckoutModal('${p.id}')">
            ⚡ Buy Now
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="devcraftShop.addToCart('${p.id}')">
            + Cart 🛒
          </button>
          <a href="${detailsLink}" class="btn btn-ghost btn-sm">
            View Page →
          </a>
          <button type="button" class="btn btn-ghost btn-sm" onclick="devcraftShop.openShareModal('${p.id}')" title="Share with friends">
            🔗
          </button>
        </div>
      </div>
    </div>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('All App Products & Courses (50% & 30% OFF)', 'Browse DevCraft’s complete marketplace of Android Apps, PC Software, AI Agents, Utilities, and Aptitude courses with automatic 50% & 30% discounts.')}
</head>
<body>
  ${navbar('products')}

  <main style="padding: 120px 0 80px;">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Full Production Marketplace • Direct Downloads</div>
        <h1 class="section-title">DevCraft <span class="text-gradient">Products &amp; Software</span></h1>
        <p class="section-desc">
          High-performance Android APKs, PC desktop applications, autonomous AI agents, and campus placement courses. All app products feature an automatic <strong>50% discount</strong> and all aptitude courses feature a <strong>30% discount</strong>.
        </p>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="catalog-toolbar" style="margin-bottom: 30px; display: flex; flex-wrap: wrap; gap: 14px; justify-content: space-between; align-items: center;">
        <div class="category-filters-wrap" style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${categories.map(c => `
            <button class="filter-chip-btn ${c === 'All' ? 'active' : ''}" onclick="filterProductsCategory('${c}', this)">
              ${c}
            </button>
          `).join('')}
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          <input type="text" id="catalog-search-input" class="form-control" style="width: 240px; padding: 8px 14px; font-size: 0.85rem;" placeholder="Search products..." oninput="filterProductsSearch(this.value)" />
          <select id="catalog-sort-select" class="form-control" style="width: 170px; padding: 8px 14px; font-size: 0.85rem;" onchange="sortProducts(this.value)">
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="products-grid" id="products-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px;">
        ${productCardsHtml}
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}

  <script>
    let activeCat = 'All';
    let searchQuery = '';

    function filterProductsCategory(category, btn) {
      activeCat = category;
      document.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      applyProductFilters();
    }

    function filterProductsSearch(q) {
      searchQuery = (q || '').trim().toLowerCase();
      applyProductFilters();
    }

    function applyProductFilters() {
      const cards = document.querySelectorAll('.product-shop-card');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const name = card.getAttribute('data-name') || '';

        const catMatches = activeCat === 'All' || cat.toLowerCase().includes(activeCat.toLowerCase());
        const searchMatches = !searchQuery || name.includes(searchQuery) || cat.toLowerCase().includes(searchQuery);

        card.style.display = (catMatches && searchMatches) ? 'flex' : 'none';
      });
    }

    function sortProducts(val) {
      const grid = document.getElementById('products-grid-container');
      const cards = Array.from(grid.querySelectorAll('.product-shop-card'));

      if (val === 'price-low') {
        cards.sort((a, b) => Number(a.getAttribute('data-price')) - Number(b.getAttribute('data-price')));
      } else if (val === 'price-high') {
        cards.sort((a, b) => Number(b.getAttribute('data-price')) - Number(a.getAttribute('data-price')));
      }

      cards.forEach(c => grid.appendChild(c));
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'products.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'products.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/products.html and frontend/products.html');
}

// ==========================================
// 5. JOYA AI DEDICATED FLAGSHIP PAGE
// ==========================================
function buildJoyaPage() {
  const joya = DEVCRAFT_PRODUCTS.find(p => p.id === 'joya-ai') || {};

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('Joya AI — Full Source Code (Android Studio / Kotlin)', 'Customer gets the complete Joya Android source code after successful purchase. Joya AI is an autonomous on-device personal voice assistant for Android with custom wake word "Wake up Joya", WhatsApp automation, and offline neural synthesis.')}
</head>
<body>
  ${navbar('joya')}

  <main style="padding: 120px 0 80px;">
    <div class="container">
      <!-- Hero Section -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: center; margin-bottom: 60px;">
        <div>
          <div class="flagship-hero-badge">🎙️ Android Native (Kotlin) • Full Source Code Included</div>
          <h1 style="font-size: 2.8rem; font-weight: 800; line-height: 1.2; margin-bottom: 16px;">
            Joya AI — <span class="text-gradient">Full Source Code</span> (Android)
          </h1>
          <p style="color: var(--text-secondary); font-size: 1.1rem; line-height: 1.7; margin-bottom: 24px;">
            Customer gets the complete Joya Android source code after successful purchase. Say <span class="wake-word-highlight">"Wake up Joya"</span> to awaken a completely private, on-device mobile assistant. Joya dictates WhatsApp messages, initiates phone calls, creates voice memos, and schedules alarms with zero cloud dependence.
          </p>

          <!-- Interactive Voice Waveform Simulator -->
          <div class="voice-wave-simulator" style="margin-bottom: 28px; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--cyan); text-transform: uppercase;">Acoustic Wake Word Engine: "Wake up Joya"</span>
              <span class="status-pill-online"><span class="status-dot"></span> Sentinel Active</span>
            </div>
            <div class="voice-bars-wrap" style="justify-content: flex-start;">
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
              <button type="button" class="btn btn-sm btn-outline" onclick="devcraftShop.simulateJoyaWakeWord()">
                Simulate Wake Word ("Wake up Joya") 🎙️
              </button>
              <div id="joya-voice-status" style="font-size: 0.85rem;"></div>
            </div>
          </div>

          <!-- Pricing & Direct CTAs -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 16px; padding: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Special Promotional Discount (50% OFF):</div>
              <div style="display: flex; align-items: baseline; gap: 10px;">
                <del style="color: var(--text-muted); font-size: 1.2rem;">₹1,999</del>
                <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 800; padding: 2px 8px; border-radius: 6px; font-size: 0.85rem;">50% OFF</span>
                <span class="text-gradient" style="font-size: 2.2rem; font-weight: 800;">₹999</span>
              </div>
              <div style="font-size: 0.82rem; color: #10b981; font-weight: 600; margin-top: 4px;">✓ Full Android Studio Source Code Included</div>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn btn-emerald" onclick="devcraftShop.openCheckoutModal('joya-ai')">
                Buy Full Source Code (₹999) ⚡
              </button>
              <button class="btn btn-outline" onclick="devcraftShop.addToCart('joya-ai')">
                + Cart 🛒
              </button>
              <button class="btn btn-ghost" onclick="devcraftShop.openShareModal('joya-ai')">
                🔗 Share
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side: Package & Technical Specs -->
        <div class="glass-card" style="padding: 30px; border-radius: 20px; border: 1px solid rgba(168, 85, 247, 0.3);">
          <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 20px; color: #ffffff;">Package Technical Specifications</h3>
          
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Delivered Package:</span>
              <strong style="color: var(--cyan);">Full Source Code (.ZIP) + Demo APK</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Target Platform:</span>
              <strong>Android 8.0+ (API 26 to 34, Android 14/15)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Source Package:</span>
              <strong style="font-family: var(--font-mono); color: var(--cyan);">joya-ai-source-code-v2.4.0.zip</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Wake Engine:</span>
              <strong>Porcupine Micro-Wake ("Wake up Joya")</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Automation Core:</span>
              <strong>WhatsApp Dispatch, Dialer, Alarms, TTS</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">License &amp; Ownership:</span>
              <strong style="color: #10b981;">100% Commercial Source Code Handover</strong>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 10px;">Architecture Technologies:</h4>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${(joya.technologies || ['Kotlin', 'Android NDK', 'Porcupine Wake Word', 'TensorFlow Lite', 'Room DB', 'Coroutines']).map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Features Deep Dive -->
      <div style="margin-bottom: 60px;">
        <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 24px; text-align: center;">What You Receive with <span class="text-gradient">Joya AI Source Code</span></h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">📁</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Complete Android Studio Project</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Ready-to-compile Gradle project with Kotlin 1.9, modern ViewBinding / Jetpack Compose layouts, and clean architecture.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🎙️</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Custom Wake Word Engine</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Complete foreground audio service with low battery drain and Porcupine acoustic model tuned for "Wake up Joya".</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">💬</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">WhatsApp &amp; App Automation</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Hands-free voice messaging, automated contact matching, and phone dialer integrations ready to customize.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">📖</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Build Docs &amp; Developer Guide</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Comprehensive README.md with compilation steps, permission guides, and instructions to retrain the wake word.</p>
          </div>
        </div>
      </div>

      <!-- FAQ Section (Requirement 18) -->
      <div class="glass-card" style="padding: 30px; border-radius: 20px; margin-bottom: 40px;">
        <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 20px;">Frequently Asked Questions — Joya AI</h3>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: Do I get the complete source code?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Yes! Immediately after your payment is verified, you receive download access to the complete Android Studio Kotlin project zip archive (all code, layouts, and build files).</p>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: Can I change the wake word to something else?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Yes. The project includes modular acoustic model binding so you can retrain or swap the wake word model to any custom name of your choice.</p>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: What are the minimum requirements to build?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Android Studio Hedgehog or higher, Android SDK 26+, and Kotlin 1.9+. Compiles cleanly with zero missing dependencies.</p>
          </div>
        </div>
      </div>

      <!-- Version Changelog -->
      <div class="glass-card" style="padding: 30px; border-radius: 20px;">
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 18px;">Changelog &amp; Release History</h3>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${(joya.changelog || [
            { version: 'v2.4.0', date: '2026-08-15', notes: 'Enhanced offline wake-word acoustic model; battery drain reduced by 35%.' },
            { version: 'v2.3.0', date: '2026-06-20', notes: 'Added direct WhatsApp message dictation and quick call triggers.' }
          ]).map(c => `
            <div style="border-left: 2px solid var(--cyan); padding-left: 14px;">
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 4px;">
                <strong style="color: var(--cyan); font-family: var(--font-mono);">${c.version}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${c.date}</span>
              </div>
              <p style="color: var(--text-secondary); font-size: 0.88rem; margin: 0;">${c.notes}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'joya.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'joya.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/joya.html and frontend/joya.html');
}

// ==========================================
// 6. JARVIS AI DEDICATED FLAGSHIP PAGE
// ==========================================
function buildJarvisPage() {
  const jarvis = DEVCRAFT_PRODUCTS.find(p => p.id === 'jarvis-ai') || {};

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('Jarvis AI — Full Source Code & Desktop Automation Agent', 'Jarvis AI is an autonomous desktop computing assistant for PC with terminal command execution, active workspace file indexing, web scraping, and local LLM bridge. Full source code included.')}
</head>
<body>
  ${navbar('jarvis')}

  <main style="padding: 120px 0 80px;">
    <div class="container">
      <!-- Hero Section -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: center; margin-bottom: 60px;">
        <div>
          <div class="flagship-hero-badge" style="background: rgba(59, 130, 246, 0.15); color: #93c5fd; border-color: rgba(59, 130, 246, 0.4);">
            💻 PC Desktop Intelligence • Full Source Code Included • 50% OFF
          </div>
          <h1 style="font-size: 2.8rem; font-weight: 800; line-height: 1.2; margin-bottom: 16px;">
            Jarvis AI — <span class="text-gradient">Full Source Code</span>
          </h1>
          <p style="color: var(--text-secondary); font-size: 1.1rem; line-height: 1.7; margin-bottom: 24px;">
            Take commanding control of your PC workflow. Activated via global hotkey <span class="wake-word-highlight">Ctrl + Space</span>, Jarvis indexes your hard drive, writes and tests shell scripts, automates browser data scraping, and bridges local LLMs (Ollama) into your editor.
          </p>

          <!-- Interactive Terminal Sandbox Mockup -->
          <div class="terminal-mockup" style="margin-bottom: 28px;">
            <div class="terminal-mockup-header">
              <span class="term-dot red"></span>
              <span class="term-dot yellow"></span>
              <span class="term-dot green"></span>
              <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 6px;">jarvis-core — desktop agent terminal</span>
            </div>
            <div class="terminal-mockup-body" id="jarvis-terminal-output" style="max-height: 180px; overflow-y: auto;">
              <div class="cmd-line">[Ready] Jarvis PC Agent v3.1.2 online...</div>
              <div class="out-line">Global Hotkey Ctrl+Space registered. Listening on local IPC bridge.</div>
            </div>
            <div style="padding: 8px 14px; background: #0b1120; border-top: 1px solid rgba(255, 255, 255, 0.06); display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('index')">Index Files</button>
              <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('scrape')">Web Scraper</button>
              <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('diag')">Diagnostics</button>
            </div>
          </div>

          <!-- Pricing & Direct CTAs -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 16px; padding: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Special Promotional Discount:</div>
              <div style="display: flex; align-items: baseline; gap: 10px;">
                <del style="color: var(--text-muted); font-size: 1.1rem;">₹3,199</del>
                <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 800; padding: 2px 8px; border-radius: 6px; font-size: 0.85rem;">50% OFF</span>
                <span class="text-gradient" style="font-size: 2rem; font-weight: 800;">₹1,599</span>
              </div>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn btn-emerald" onclick="devcraftShop.openCheckoutModal('jarvis-ai')">
                Buy Full Source Code (₹1,599) ⚡
              </button>
              <button class="btn btn-primary" onclick="devcraftShop.downloadProduct('jarvis-ai')">
                Download PC App ⬇️
              </button>
              <button class="btn btn-outline" onclick="devcraftShop.addToCart('jarvis-ai')">
                + Cart 🛒
              </button>
              <button class="btn btn-ghost" onclick="devcraftShop.openShareModal('jarvis-ai')">
                🔗 Share
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side: Specs & Features -->
        <div class="glass-card" style="padding: 30px; border-radius: 20px; border: 1px solid rgba(59, 130, 246, 0.3);">
          <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 20px; color: #ffffff;">Desktop Environment Specifications</h3>
          
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Delivered Package:</span>
              <strong style="color: var(--cyan);">Full Source Code (.ZIP) + PC Installer</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Source Package:</span>
              <strong style="font-family: var(--font-mono); color: var(--cyan);">jarvis-ai-source-code-v3.1.2.zip</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Operating Systems:</span>
              <strong>Windows 10/11 64-bit, macOS 12+, Ubuntu</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Local LLM Integration:</span>
              <strong style="color: #10b981;">Ollama (Llama-3, Mistral, Phi-3, DeepSeek)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">PC Installer Artifact:</span>
              <strong style="font-family: var(--font-mono); color: var(--cyan);">jarvis-ai-desktop-v3.1.2.exe</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">License &amp; Ownership:</span>
              <strong style="color: #10b981;">100% Commercial Source Code Handover</strong>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 10px;">Core Engineering Stack:</h4>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${(jarvis.technologies || ['Electron', 'Node.js', 'Python', 'Ollama', 'PyAutoGUI', 'SQLite']).map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Features Deep Dive -->
      <div style="margin-bottom: 60px;">
        <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 24px; text-align: center;">What You Receive with <span class="text-gradient">Jarvis AI Source Code</span></h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">💻</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Complete Electron &amp; Node.js Project</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Production Electron desktop architecture with translucent glass HUD, system tray integration, and native IPC bridges.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🧠</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Local Ollama &amp; Cloud LLM Core</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Zero-cloud-cost inference pipeline connecting to local LLMs via Ollama, plus extensible hooks for OpenAI, Claude, and Gemini.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">⚙️</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Python Automation &amp; Terminal Runner</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Autonomous terminal execution scripts, desktop PyAutoGUI clickers, web scrapers, and filesystem search indexers.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">📖</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Developer Documentation &amp; Setup</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Step-by-step developer guide to package .exe for Windows, .dmg for macOS, and configure custom system triggers.</p>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="glass-card" style="padding: 30px; border-radius: 20px; margin-bottom: 40px;">
        <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 20px;">Frequently Asked Questions — Jarvis AI</h3>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: Do I get the complete Jarvis AI source code?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Yes! Upon payment confirmation, you receive immediate download access to the complete source package zip (Electron frontend, Python automation engines, and package build configurations).</p>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: Does it require paid third-party API subscriptions?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">No. Jarvis is built with a local LLM bridge to Ollama (Llama 3, Mistral, DeepSeek), allowing 100% private, offline execution without monthly subscription costs.</p>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: Can I build installers for Windows and macOS?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Yes. The project includes cross-platform electron-builder scripts configured to produce Windows .exe installers and macOS .dmg packages.</p>
          </div>
        </div>
      </div>

      <!-- Version Changelog -->
      <div class="glass-card" style="padding: 30px; border-radius: 20px;">
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 18px;">Changelog &amp; Release History</h3>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${(jarvis.changelog || [
            { version: 'v3.1.2', date: '2026-08-20', notes: 'Direct Ollama local model bridge; native Windows 11 Fluent dark glass UI.' },
            { version: 'v3.0.0', date: '2026-05-12', notes: 'Architectural overhaul: Multi-threaded voice agent and desktop vision preview.' }
          ]).map(c => `
            <div style="border-left: 2px solid var(--cyan); padding-left: 14px;">
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 4px;">
                <strong style="color: var(--cyan); font-family: var(--font-mono);">${c.version}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${c.date}</span>
              </div>
              <p style="color: var(--text-secondary); font-size: 0.88rem; margin: 0;">${c.notes}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'jarvis.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'jarvis.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/jarvis.html and frontend/jarvis.html');
}

// ==========================================
// 7. APTITUDE DEDICATED PAGE (30% DISCOUNT)
// ==========================================
function buildAptitudePage() {
  const aptitudeProducts = DEVCRAFT_PRODUCTS.filter(p => p.type === 'aptitude' || p.category === 'Aptitude');

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('Campus Placement & Aptitude Hub (30% OFF)', 'Crack technical interviews, quantitative aptitude, and logical puzzle rounds for TCS NQT, Infosys, Wipro, and Amazon with structured courses.')}
</head>
<body>
  ${navbar('aptitude')}

  <main style="padding: 120px 0 80px;">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.4);">
          🎓 All Aptitude Courses • Flat 30% OFF
        </div>
        <h1 class="section-title">Campus Placement &amp; <span class="text-gradient">Aptitude Hub</span></h1>
        <p class="section-desc">
          Engineered specifically for engineering graduates and software developers. Master cognitive aptitude, quantitative problem solving, and logical coding puzzles.
        </p>

        <div style="margin-top: 16px;">
          <button class="btn btn-outline" onclick="devcraftShop.downloadProduct('aptitude-syllabus')">
            Download Comprehensive Syllabus (PDF) 📄
          </button>
        </div>
      </div>

      <!-- Courses Grid with 30% Discount -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin-top: 40px;">
        ${aptitudeProducts.map(p => {
          const originalPrice = Number(p.originalPrice) || 5000;
          const finalPrice = Math.round(originalPrice * 0.70);

          return `
          <div class="product-shop-card" style="border-color: rgba(16, 185, 129, 0.3);">
            <div class="product-card-top">
              <span class="product-category-chip" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">${p.category}</span>
              <span class="product-discount-chip chip-aptitude">30% OFF</span>
            </div>

            <div class="product-card-info">
              <h3 class="product-card-title">${p.name}</h3>
              <p class="product-card-desc">${p.shortDesc}</p>

              <ul class="product-card-features">
                ${(p.features || []).map(f => `<li><span class="check-icon" style="color: #10b981;">✓</span> ${f}</li>`).join('')}
              </ul>
            </div>

            <div class="product-card-pricing-footer">
              <div class="product-price-block">
                <div class="product-price-orig">
                  <span>Original:</span>
                  <del>₹${originalPrice.toLocaleString('en-IN')}</del>
                </div>
                <div class="product-price-final">
                  <span class="price-val" style="color: #34d399;">₹${finalPrice.toLocaleString('en-IN')}</span>
                  <span class="price-save-badge">Save 30%</span>
                </div>
              </div>

              <div class="product-card-btn-grid">
                <button type="button" class="btn btn-emerald btn-sm" onclick="devcraftShop.openCheckoutModal('${p.id}')">
                  Enroll Now 🎓
                </button>
                <button type="button" class="btn btn-outline btn-sm" onclick="devcraftShop.addToCart('${p.id}')">
                  + Cart 🛒
                </button>
                <button type="button" class="btn btn-ghost btn-sm" onclick="devcraftShop.openShareModal('${p.id}')">
                  🔗 Share
                </button>
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'aptitude.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'aptitude.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/aptitude.html and frontend/aptitude.html');
}

// ==========================================
// 8. PORTFOLIO & INTERACTIVE SIMULATORS PAGE
// ==========================================
function buildPortfolioPage() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('Interactive Portfolio & Live Simulators', 'Explore 10+ interactive application demos engineered by DevCraft across Mobile, Web, AI, and Dashboards.')}
</head>
<body>
  ${navbar('portfolio')}

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

  fs.writeFileSync(path.join(PAGES, 'portfolio.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'portfolio.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/portfolio.html and frontend/portfolio.html');
}

// ==========================================
// 9. CART & CHECKOUT PAGE
// ==========================================
function buildCartPage() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('Shopping Cart & Secure Checkout', 'Review your selected DevCraft products and services, apply cryptographic coupons, and complete your order.')}
</head>
<body>
  ${navbar()}

  <main class="cart-page-wrap">
    <div class="container">
      <div class="section-header" style="margin-bottom: 30px;">
        <h1 style="font-size: 2.2rem; font-weight: 800;">Shopping Cart &amp; <span class="text-gradient">Checkout</span></h1>
        <p style="color: var(--text-secondary);">Verify items, apply valid private coupons, and confirm your direct booking.</p>
      </div>

      <div class="cart-grid-layout">
        <!-- Cart Items List Container -->
        <div class="cart-items-panel" id="cart-items-container">
          <div style="text-align: center; padding: 40px; color: var(--text-muted);">
            Loading cart contents...
          </div>
        </div>

        <!-- Order Summary & Checkout Panel -->
        <div class="cart-summary-panel" id="cart-summary-box">
          <!-- Rendered dynamically by devcraftShop.renderCartPage() -->
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      devcraftShop.renderCartPage();
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'cart.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'cart.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/cart.html and frontend/cart.html');
}

// ==========================================
// 10. LEGAL & POLICY PAGES (PRIVACY, TERMS, REFUND, LICENSE)
// ==========================================
function buildLegalPages() {
  const legalPages = [
    {
      file: 'privacy.html',
      title: 'Privacy Policy',
      content: `
        <h2>Privacy Policy</h2>
        <p><strong>Last Updated: August 2026</strong></p>
        <p>At DevCraft Studio, accessible from harsh-developer.onrender.com, privacy and cryptographic security are paramount. This policy outlines how user credentials, order histories, and telemetry are processed.</p>
        <h3>1. Authentication &amp; Password Security</h3>
        <p>Passwords are never stored in plaintext. They are salted and hashed using standard bcrypt algorithms. User tokens use signed HMAC-SHA256 JWTs.</p>
        <h3>2. Coupon Code Verification</h3>
        <p>Promotional coupon codes are verified strictly server-side using secure SHA-256 HMAC digest validation. Codes are never stored or exposed in client bundles.</p>
        <h3>3. Data Telemetry &amp; Offline AI</h3>
        <p>Our flagship AI software (Joya AI and Jarvis AI) utilizes on-device neural inferencing. Voice acoustic processing and local desktop commands remain 100% on your machine.</p>
      `
    },
    {
      file: 'terms.html',
      title: 'Terms of Service',
      content: `
        <h2>Terms of Service</h2>
        <p><strong>Last Updated: August 2026</strong></p>
        <p>Welcome to DevCraft Studio. By purchasing our software products, downloading packages, or contracting our development services, you agree to these terms.</p>
        <h3>1. Development Sprints &amp; Deliverables</h3>
        <p>All custom client work is executed under agreed milestones. 100% intellectual property ownership of bespoke source code is transferred upon final sprint settlement.</p>
        <h3>2. Software Distribution</h3>
        <p>Purchased binaries (APKs, EXEs, and ZIP packages) include a personal or enterprise non-transferable license as specified during checkout.</p>
      `
    },
    {
      file: 'refund.html',
      title: 'Refund & Cancellation Policy',
      content: `
        <h2>Refund &amp; Cancellation Policy</h2>
        <p><strong>Last Updated: August 2026</strong></p>
        <h3>1. Custom Engineering Sprints</h3>
        <p>Milestone payments for custom development are protected. In the unlikely event that sprint criteria cannot be met, unworked milestone funds will be refunded within 7 business days.</p>
        <h3>2. Digital Software Downloads &amp; Courses</h3>
        <p>Because software downloads (APKs, EXEs) provide immediate access, refunds are evaluated on technical grounds within 7 days if the software does not function according to documented specifications.</p>
      `
    },
    {
      file: 'license.html',
      title: 'Software Licensing & IP Ownership',
      content: `
        <h2>Software Licensing &amp; IP Ownership</h2>
        <p><strong>Last Updated: August 2026</strong></p>
        <p>DevCraft Studio grants clients full commercial ownership of bespoke custom code developed under contract. Our commercial off-the-shelf software packages are licensed under perpetual commercial licenses.</p>
      `
    }
  ];

  legalPages.forEach(p => {
    const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead(p.title, 'Official policy and legal documentation for DevCraft Studio.')}
</head>
<body>
  ${navbar()}

  <main style="padding: 120px 0 80px;">
    <div class="container" style="max-width: 800px;">
      <div class="glass-card" style="padding: 40px; border-radius: 20px; line-height: 1.8;">
        ${p.content}
        <div style="margin-top: 30px; border-top: 1px solid var(--border-glass); padding-top: 18px;">
          <a href="/" class="btn btn-outline btn-sm">← Back to DevCraft Home</a>
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

    fs.writeFileSync(path.join(PAGES, p.file), html, 'utf8');
    fs.writeFileSync(path.join(FRONTEND, p.file), html, 'utf8');
    console.log(`✓ Generated ${p.file}`);
  });
}

function buildFaqPage() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('Frequently Asked Questions (FAQ) & Knowledge Base', 'Comprehensive questions and answers regarding DevCraft software development sprints, source code ownership, Joya & Jarvis AI, Tranz UPI payments, and referral commissions.', '/faq')}
</head>
<body>
  ${navbar('faq')}

  <main style="padding-top: 100px;">
    ${renderFaqSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'faq.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'faq.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/faq.html & frontend/faq.html');
}

function build404Page() {
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead('404 - Page Not Found', 'The requested page or resource could not be found on DevCraft Studio.', '/404')}
</head>
<body>
  ${navbar('')}

  <main style="padding: 140px 0 100px; min-height: 80vh; display: flex; align-items: center;">
    <div class="container" style="max-width: 720px; text-align: center;">
      <div class="glass-card" style="padding: 50px 30px; border-radius: 24px; border: 1px solid var(--border-glass);">
        <div style="font-family: var(--font-mono); font-size: 5rem; font-weight: 900; line-height: 1; color: var(--accent); margin-bottom: 16px;">
          404
        </div>
        <div style="display: inline-block; padding: 4px 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 9999px; color: #1d4ed8; font-weight: 700; font-size: 0.82rem; margin-bottom: 16px;">
          PAGE NOT FOUND
        </div>
        <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 14px; color: var(--text-primary);">
          Lost in Cyberspace?
        </h1>
        <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; margin-bottom: 30px; max-width: 540px; margin-left: auto; margin-right: auto;">
          The route you navigated to does not exist or has been relocated. Explore our production software products, development services, or return to home.
        </p>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px;">
          <a href="/" class="btn btn-primary" style="padding: 12px 24px;">
            ← Return to Home
          </a>
          <a href="/products" class="btn btn-emerald" style="padding: 12px 24px;">
            Software Products (50% OFF) ⚡
          </a>
          <a href="/services" class="btn btn-outline" style="padding: 12px 24px;">
            View Services
          </a>
          <a href="/contact" class="btn btn-outline" style="padding: 12px 24px;">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, '404.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, '404.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/404.html & frontend/404.html');
}

function buildServiceSubPages() {
  const SERVICES_PAGES = path.join(PAGES, 'services');
  if (!fs.existsSync(SERVICES_PAGES)) fs.mkdirSync(SERVICES_PAGES, { recursive: true });

  const subServices = [
    {
      slug: 'android-development',
      name: 'Android App Development',
      category: 'Mobile Engineering',
      badge: 'Native Android Kotlin',
      headline: 'Native Android Apps Built with Kotlin & Jetpack Compose',
      subtitle: 'From conceptual wireframes to Google Play Store launch. We engineer reactive, high-performance native Android apps with sub-100ms startup times, offline-first Room caching, and seamless UPI payments.',
      heroStat1: '100% Native Kotlin',
      heroStat2: 'API 26-34 Ready',
      heroStat3: '60 FPS Smooth UI',
      heroStat4: '100% Code Handover',
      capabilities: [
        { title: 'Jetpack Compose UI', desc: 'Modern declarative UI components with Material Design 3, fluid animations, and dark/light themes.' },
        { title: 'Offline-First Room DB', desc: 'Robust local data persistence, SQLite synchronization, and offline mutation queues.' },
        { title: 'Payment & UPI Integration', desc: 'In-app purchases, Google Play Billing, and dynamic NPCI UPI QR code generation.' },
        { title: 'Firebase Cloud Messaging', desc: 'Real-time targeted push notifications, deep links, analytics, and crash reporting.' },
        { title: 'Hardware Sensors & GPS', desc: 'Precision geolocation, background tracking, Bluetooth BLE, camera, and biometric authentication.' },
        { title: 'Play Store Publishing', desc: 'Complete APK/AAB signing, Google Play Store compliance, review assistance, and CI/CD.' }
      ],
      techStack: ['Kotlin', 'Android Studio', 'Jetpack Compose', 'Room DB', 'Retrofit', 'Coroutines', 'Flow', 'Hilt', 'Firebase'],
      pricing: 'Starting at ₹24,999'
    },
    {
      slug: 'web-development',
      name: 'Web Development',
      category: 'Full-Stack Web',
      badge: 'Next.js & React',
      headline: 'Ultra-Fast, High-Converting Websites & Web Applications',
      subtitle: 'Bespoke corporate websites, SaaS landing portals, and responsive web applications engineered for 100/100 Core Web Vitals, organic search dominance, and conversion architectures.',
      heroStat1: '99+ Lighthouse Score',
      heroStat2: '<50ms Response',
      heroStat3: '100% Responsive',
      heroStat4: 'Zero Vendor Lock-in',
      capabilities: [
        { title: 'Server-Side Rendering (SSR)', desc: 'Next.js dynamic rendering and edge routing for instant page loads and premier SEO indexing.' },
        { title: 'Design System & Tailwind', desc: 'Modular, accessible design components built with Tailwind CSS and clean typography.' },
        { title: 'E-Commerce & Dynamic UPI', desc: 'High-speed headless commerce cart, express checkout, and instant payment verification.' },
        { title: 'Headless CMS Integration', desc: 'Easy content management with Strapi, Sanity, or custom markdown database backends.' },
        { title: 'Edge CDN & SSL Shielding', desc: 'Cloudflare enterprise caching, automated DDoS protection, and SSL certificates.' },
        { title: 'Automated Lead Funnels', desc: 'High-converting lead capture forms with instant WhatsApp and email notifications.' }
      ],
      techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Cloudflare'],
      pricing: 'Starting at ₹14,999'
    },
    {
      slug: 'software-development',
      name: 'Custom Software Development',
      category: 'Custom Engineering',
      badge: 'Enterprise & Desktop',
      headline: 'Enterprise-Grade Custom Software Built for Your Exact Workflow',
      subtitle: 'Replace fragmented SaaS tools and fragile spreadsheets with unified, proprietary software systems. Full intellectual property ownership, zero recurring user licenses.',
      heroStat1: '100% IP Ownership',
      heroStat2: 'Zero Seat Licenses',
      heroStat3: 'Cross-Platform',
      heroStat4: 'Bespoke Architecture',
      capabilities: [
        { title: 'Multi-Tenant Client Portals', desc: 'Secure web portals with role-based access control (RBAC), audit logging, and isolated client data.' },
        { title: 'Desktop Software (Electron)', desc: 'Cross-platform desktop executables for Windows, macOS, and Linux with local file access.' },
        { title: 'Custom Relational DBs', desc: 'PostgreSQL database modeling, migrations, ACID transaction safety, and indexing.' },
        { title: 'Background Task Workers', desc: 'Asynchronous task processing, scheduled reporting jobs, and automated PDF invoice engines.' },
        { title: 'Biometric & Local Security', desc: 'Encrypted token storage, zero-knowledge credentials, and tamper-resistant licensing.' },
        { title: 'Git & Complete Docs', desc: 'Clean, modular codebase handed over with full developer architecture documentation.' }
      ],
      techStack: ['Node.js', 'Electron', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'TypeScript'],
      pricing: 'Starting at ₹39,999'
    },
    {
      slug: 'ai-solutions',
      name: 'AI Solutions & Agent Development',
      category: 'Artificial Intelligence',
      badge: 'Autonomous AI & LLMs',
      headline: 'Autonomous AI Agents, Custom LLM Bridges & Neural Assistants',
      subtitle: 'Harness the power of cutting-edge generative AI and lightweight on-device models. We develop autonomous agent workflows, RAG vector pipelines, and voice assistants like Joya AI and Jarvis AI.',
      heroStat1: 'On-Device Inference',
      heroStat2: 'Zero Cloud Leakage',
      heroStat3: 'Multi-Model Fallback',
      heroStat4: 'Voice & Automation',
      capabilities: [
        { title: 'Local Offline LLM Bridges', desc: 'Ollama local model integration (Llama 3, Mistral, DeepSeek) for zero-cost, private inference.' },
        { title: 'Acoustic Wake Word Systems', desc: 'Lightweight on-device wake-word detection (e.g. "Wake up Joya") and neural voice processing.' },
        { title: 'Retrieval-Augmented Generation', desc: 'Vector database search over internal business manuals, FAQs, and product catalogs.' },
        { title: 'Multi-Agent Tool Orchestration', desc: 'Collaborative autonomous agents that read databases, call APIs, and execute desktop actions.' },
        { title: 'Desktop & Mobile Voice HUDs', desc: 'Always-listening background voice companions with hotkey toggles and floating UI.' },
        { title: 'Full Source Code Licensing', desc: 'Deploy proprietary AI pipelines with 100% source ownership and zero recurring token markup.' }
      ],
      techStack: ['Python', 'Ollama', 'LangChain', 'PyTorch', 'OpenAI API', 'TensorFlow Lite', 'Porcupine', 'Node.js'],
      pricing: 'Starting at ₹44,999'
    },
    {
      slug: 'automation',
      name: 'Workflow Automation',
      category: 'Business Automation',
      badge: 'Zero-Touch Workflows',
      headline: 'Eliminate Repetitive Tasks with Bulletproof Business Automation',
      subtitle: 'Connect fragmented software, automate customer messaging, and orchestrate complex multi-step data pipelines. We build webhook listeners, WhatsApp bots, and background task queues that run 24/7.',
      heroStat1: '24/7 Zero-Touch',
      heroStat2: '100% Reliable Queues',
      heroStat3: 'Multi-Channel Bots',
      heroStat4: 'Automated Alerts',
      capabilities: [
        { title: 'WhatsApp Business Cloud API', desc: 'Automated instant notifications, order alerts, transactional receipts, and interactive menu bots.' },
        { title: 'Distributed Job Queues', desc: 'High-throughput BullMQ and Redis queues with automatic retry exponential backoff policies.' },
        { title: 'Webhook Data Pipelines', desc: 'Real-time event receivers reconciling payment gateways, CRM contacts, and ERP inventories.' },
        { title: 'Headless Web Scraping', desc: 'Puppeteer and Playwright scrapers extracting dynamic web data and competitive intelligence.' },
        { title: 'Spreadsheet & Google Sheets Sync', desc: 'Automatic bidirectional data synchronization with Excel, Google Sheets, and Airtable.' },
        { title: 'Incident & Failure Alerts', desc: 'Immediate alerting via Telegram, WhatsApp, and Slack when critical pipeline thresholds breach.' }
      ],
      techStack: ['Node.js', 'BullMQ', 'Redis', 'Puppeteer', 'WhatsApp Cloud API', 'Docker', 'Webhooks'],
      pricing: 'Starting at ₹19,999'
    },
    {
      slug: 'api-integration',
      name: 'API Integration & Microservices',
      category: 'Backend & APIs',
      badge: 'High Throughput Microservices',
      headline: 'High-Performance REST & GraphQL APIs with Sub-50ms Latency',
      subtitle: 'Connect third-party payment gateways, CRM databases, logistics partners, and external SaaS platforms. We build bulletproof endpoints protected by cryptographic signatures, rate limiting, and Redis caching.',
      heroStat1: '<50ms Response Latency',
      heroStat2: 'HMAC-SHA256 Security',
      heroStat3: 'Swagger / OpenAPI Ready',
      heroStat4: 'Zero Downtime',
      capabilities: [
        { title: 'Payment Gateway Integration', desc: 'NPCI UPI dynamic QR, Razorpay, Cashfree, and Stripe integrations with webhook reconciliation.' },
        { title: 'Redis Cache Acceleration', desc: 'Sub-50ms query caching, token bucket rate limiting, and distributed session storage.' },
        { title: 'Cryptographic Verification', desc: 'HMAC-SHA256 request signatures, JWT authentication, and AES-256 payload encryption.' },
        { title: 'Interactive API Documentation', desc: 'Full Swagger/OpenAPI interactive specifications with mock request generators.' },
        { title: 'Bi-Directional WebSockets', desc: 'Sub-second real-time event streaming for chat, live bidding, and telemetry monitors.' },
        { title: 'Microservice Containerization', desc: 'Dockerized microservice deployments with health check probes and automated restart policies.' }
      ],
      techStack: ['Express', 'Node.js', 'Redis', 'PostgreSQL', 'GraphQL', 'JWT', 'HMAC-SHA256', 'OpenAPI/Swagger'],
      pricing: 'Starting at ₹16,999'
    },
    {
      slug: 'ui-ux',
      name: 'UI/UX Design & Frontend Engineering',
      category: 'Design & Frontend',
      badge: 'Design Systems & Modern UI',
      headline: 'Intuitive, Accessible & High-Conversion Digital Interfaces',
      subtitle: 'Transform complex software products into delightful, intuitive user journeys. We engineer cohesive design systems in Figma, build production-grade HTML/CSS components, and create cinematic micro-interactions.',
      heroStat1: 'WCAG 2.1 AA Compliant',
      heroStat2: '30+ Devices Tested',
      heroStat3: 'Figma Design System',
      heroStat4: 'Production Code Ready',
      capabilities: [
        { title: 'Figma Design Systems', desc: 'Comprehensive Figma component libraries, typography hierarchies, and reusable design tokens.' },
        { title: 'Responsive Multi-Device Layouts', desc: 'Pixel-perfect interfaces verified across smartphones, tablets, laptops, and ultra-wide displays.' },
        { title: 'Micro-Interactions & Transitions', desc: 'High-speed CSS animations, buttery hover states, and smooth modal transitions.' },
        { title: 'Accessibility & Reduced Motion', desc: 'WCAG 2.1 AA compliant color contrast, keyboard navigation, and prefers-reduced-motion support.' },
        { title: 'Interactive Prototypes', desc: 'Clickable client prototypes allowing stakeholder alignment prior to writing production code.' },
        { title: 'Zero-Bloat Frontend Code', desc: 'Clean, semantic HTML5, CSS3, and Vanilla JS with zero unnecessary bundle bloat.' }
      ],
      techStack: ['Figma', 'CSS Grid/Flexbox', 'Tailwind CSS', 'Three.js', 'SVG Animation', 'Design Tokens'],
      pricing: 'Starting at ₹18,999'
    },
    {
      slug: 'maintenance',
      name: 'Maintenance & Project Improvements',
      category: 'Support & DevOps',
      badge: '24/7 Reliability & SLA',
      headline: '24/7 Software Maintenance, Bug Fixing & Production Upgrades',
      subtitle: 'Keep your live applications fast, secure, and bug-free. We provide emergency bug fixing, security patching, cloud database optimization, memory leak debugging, and 24/7 uptime monitoring.',
      heroStat1: '24/7 Server Monitoring',
      heroStat2: '<15m Urgent Response',
      heroStat3: 'Weekly Security Patches',
      heroStat4: 'Direct WhatsApp Line',
      capabilities: [
        { title: '24/7 Automated Uptime Pings', desc: 'Continuous health check pings preventing server sleep and notifying architects on anomalies.' },
        { title: 'Security Vulnerability Patching', desc: 'Continuous auditing of npm and pip dependencies with prompt patching of discovered CVEs.' },
        { title: 'Database Optimization & Indexing', desc: 'Query profiling, index creation, table vacuuming, and memory caching to eliminate lag.' },
        { title: 'Code Refactoring & Debt Payoff', desc: 'Cleaning legacy antipatterns, upgrading deprecated frameworks, and adding test suites.' },
        { title: 'Zero-Downtime Deployments', desc: 'Seamless rolling releases, container restarts, automated daily database backups, and rollback safeguards.' },
        { title: 'Direct Engineer Standby', desc: 'Direct WhatsApp and phone access to our lead software architect for mission-critical emergencies.' }
      ],
      techStack: ['Docker', 'GitHub Actions', 'PM2', 'New Relic', 'Linux Servers', 'Sentry', 'Redis', 'Nginx'],
      pricing: 'Starting at ₹12,999 / mo'
    }
  ];

  subServices.forEach(srv => {
    const html = `<!DOCTYPE html>
<html lang="en" data-theme="futuristic-dev">
<head>
  ${commonHead(`${srv.name} Services`, srv.subtitle, `/services/${srv.slug}`)}
</head>
<body>
  ${navbar('services')}

  <main style="padding-top: 100px;">
    <!-- Service Subpage Hero -->
    <section class="section" style="padding-bottom: 40px;">
      <div class="container">
        <nav style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; margin-bottom: 24px;">
          <a href="/" style="color: var(--text-muted); text-decoration: none;">Home</a>
          <span style="color: var(--card-border);">/</span>
          <a href="/services" style="color: var(--text-muted); text-decoration: none;">Services</a>
          <span style="color: var(--card-border);">/</span>
          <span style="color: var(--accent); font-weight: 600;">${srv.name}</span>
        </nav>

        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 9999px; color: #1d4ed8; font-weight: 700; font-size: 0.85rem; margin-bottom: 16px;">
          <span>⚡ ${srv.category}</span> • <span>${srv.badge}</span>
        </div>

        <h1 style="font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; line-height: 1.15; color: var(--text-primary); margin-bottom: 20px;">
          ${srv.headline}
        </h1>

        <p style="font-size: 1.15rem; line-height: 1.7; color: var(--text-secondary); max-width: 820px; margin-bottom: 32px;">
          ${srv.subtitle}
        </p>

        <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin-bottom: 40px;">
          <a href="/contact?service=${srv.slug}" class="btn btn-primary" style="padding: 12px 28px;">
            Book Production Sprint →
          </a>
          <a href="/products" class="btn btn-emerald" style="padding: 12px 24px;">
            Explore Software Products (50% OFF) ⚡
          </a>
          <a href="/services" class="btn btn-outline" style="padding: 12px 24px;">
            All 20 Services Catalog
          </a>
        </div>

        <!-- Trust Stats Strip -->
        <div class="hero-stats-strip" style="background: var(--bg-card); border: 1px solid var(--card-border); border-radius: 16px; padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px;">
          <div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent);">${srv.heroStat1}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">Architectural Baseline</div>
          </div>
          <div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--emerald);">${srv.heroStat2}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">Engineered Capability</div>
          </div>
          <div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--cyan);">${srv.heroStat3}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">Performance Target</div>
          </div>
          <div>
            <div style="font-size: 1.3rem; font-weight: 800; color: #f59e0b;">${srv.heroStat4}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">IP Transfer &amp; Rights</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Capabilities Grid -->
    <section class="section" style="padding-top: 20px; padding-bottom: 40px;">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">Core Architecture</div>
          <h2 class="section-title">What We Build &amp; <span class="text-gradient">Deliver</span></h2>
          <p class="section-desc">Production-grade engineering standards applied to every layer of your ${srv.name.toLowerCase()} sprint.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          ${srv.capabilities.map((c, i) => `
            <div class="glass-card" style="padding: 28px; border-radius: 18px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: #eff6ff; border: 1px solid #bfdbfe; color: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; margin-bottom: 16px;">
                0${i + 1}
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
                ${c.title}
              </h3>
              <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
                ${c.desc}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Technologies Strip -->
    <section class="section" style="padding-top: 20px; padding-bottom: 40px; background: #f1f5f9;">
      <div class="container">
        <div style="text-align: center; margin-bottom: 24px;">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            Battle-Tested Tech Stack
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Modern tooling selected for speed, security, and developer ergonomics.</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
          ${srv.techStack.map(t => `
            <span style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; background: #ffffff; border: 1px solid var(--card-border); border-radius: 9999px; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <span style="color: var(--accent);">⚡</span> ${t}
            </span>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 5-Step Sprint Process -->
    <section class="section" style="padding-top: 40px; padding-bottom: 40px;">
      <div class="container">
        <div class="section-header text-center">
          <div class="section-badge">Sprint Methodology</div>
          <h2 class="section-title">How We Ship Your <span class="text-gradient">Project</span></h2>
          <p class="section-desc">From initial requirement analysis to live production launch with zero ambiguity.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--accent); margin-bottom: 6px;">STEP 01</div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Scoping &amp; Architecture</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Technical specification, milestones breakdown, and NDA execution.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--accent); margin-bottom: 6px;">STEP 02</div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Wireframes &amp; Design</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Component system, responsive UI layouts, and prototype validation.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--accent); margin-bottom: 6px;">STEP 03</div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Bi-Weekly Sprints</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Rapid full-stack coding with live staging deployments at every milestone.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--accent); margin-bottom: 6px;">STEP 04</div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Automated QA &amp; Audit</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Security hardening, load stress tests, and cross-device testing.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px; border-color: #86efac;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--emerald); margin-bottom: 6px;">STEP 05</div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Launch &amp; 100% IP Handover</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Production cutover, DNS routing, and complete Git repo transfer.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing & Inquiries -->
    ${renderPricingSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

    fs.writeFileSync(path.join(SERVICES_PAGES, `${srv.slug}.html`), html, 'utf8');
    // Also save in root PAGES and FRONTEND with hyphenated name for flat routing fallbacks
    fs.writeFileSync(path.join(PAGES, `${srv.slug}.html`), html, 'utf8');
    fs.writeFileSync(path.join(FRONTEND, `${srv.slug}.html`), html, 'utf8');
    console.log(`✓ Generated service page: ${srv.slug}.html`);
  });
}

// Master execution
function buildAll() {
  console.log('🚀 Starting DEVCRAFT Master Site Generation...');
  buildIndexHtml();
  buildProductsPage();
  buildJoyaPage();
  buildJarvisPage();
  buildAptitudePage();
  buildPortfolioPage();
  buildServicesPage();
  buildProjectsPage();
  buildAboutPage();
  buildContactPage();
  buildCartPage();
  buildLegalPages();
  buildClientPortalPage();
  buildAdminLoginPage();
  buildFaqPage();
  build404Page();
  buildServiceSubPages();
  console.log('🎉 All DevCraft HTML pages generated successfully!');
}

if (require.main === module) {
  buildAll();
}

module.exports = { buildAll };


