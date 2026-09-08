const commonHead = (title, desc) => `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | DEVCRAFT Studio</title>
  <meta name="description" content="${desc || 'DEVCRAFT: Ideas → Code → Real Solutions. High-performance software engineering studio offering mobile apps, web applications, enterprise dashboards, AI workflows, and cloud architecture.'}" />
  <meta name="keywords" content="DevCraft, Software Development Studio, Mobile Apps, Web Applications, React Native, Next.js, Node.js, AI Solutions, Android Developer, Cloud Deployment" />
  <meta property="og:title" content="${title} | DEVCRAFT Studio" />
  <meta property="og:description" content="${desc || 'Ideas → Code → Real Solutions. Production-grade software development for high-growth businesses.'}" />
  <meta property="og:image" content="/assets/images/project-ai.svg" />
  <link rel="icon" type="image/svg+xml" href="/assets/images/avatar-harshit.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/style.css" />
  <link rel="stylesheet" href="/css/responsive.css" />
`;

const navbar = (active = 'home') => `
  <nav class="navbar" id="navbar">
    <div class="container nav-container">
      <a href="/" class="brand-logo" aria-label="DEVCRAFT Home">
        <div class="brand-badge-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <div class="brand-name">DEV<span>CRAFT</span></div>
        <span class="brand-tagline-mini">STUDIO</span>
      </a>

      <ul class="nav-links">
        <li><a href="#services" class="nav-link ${active === 'services' ? 'active' : ''}">Services (50% OFF)</a></li>
        <li><a href="#aptitude" class="nav-link">Aptitude (30% OFF)</a></li>
        <li><a href="#demos" class="nav-link ${active === 'demos' ? 'active' : ''}">Demos</a></li>
        <li><a href="#why-devcraft" class="nav-link">Why Us</a></li>
        <li><a href="#process" class="nav-link">Process</a></li>
        <li><a href="#technologies" class="nav-link">Tech</a></li>
        <li><a href="#case-studies" class="nav-link">Case Studies</a></li>
        <li><a href="#pricing" class="nav-link">Pricing</a></li>
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="#contact" class="nav-link ${active === 'contact' ? 'active' : ''}">Contact</a></li>
        <li class="auth-group-logged-in" style="display: none;"><a href="/dashboard" class="nav-link">Dashboard</a></li>
      </ul>

      <div class="nav-actions">
        <!-- 3-Theme Selector -->
        <div class="theme-selector-dropdown" id="theme-selector">
          <button class="theme-btn" id="theme-toggle-btn" aria-label="Select UI Theme" title="Switch UI Theme">
            <span class="theme-preview-dot"></span>
            <span class="theme-active-label" id="current-theme-label">Futuristic Dev</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="theme-menu" id="theme-menu">
            <button class="theme-option" data-theme-value="futuristic-dev">
              <span class="theme-swatch cyan-purple"></span>
              <div>
                <strong>Option A: Futuristic Dev</strong>
                <small>Cyan & Purple Neon Glow</small>
              </div>
            </button>
            <button class="theme-option" data-theme-value="premium-saas">
              <span class="theme-swatch slate-indigo"></span>
              <div>
                <strong>Option B: Premium SaaS</strong>
                <small>Slate Minimalist Violet</small>
              </div>
            </button>
            <button class="theme-option" data-theme-value="cyber-studio">
              <span class="theme-swatch emerald-yellow"></span>
              <div>
                <strong>Option C: Cyber Studio</strong>
                <small>Pitch Black & Emerald Terminal</small>
              </div>
            </button>
          </div>
        </div>

        <!-- Logged Out Auth Buttons -->
        <div class="auth-group-logged-out" style="display: flex; gap: 8px; align-items: center;">
          <a href="/login" class="btn btn-ghost btn-sm">Sign In</a>
          <a href="/register" class="btn btn-outline btn-sm">Register</a>
          <a href="#contact" class="btn btn-primary btn-sm btn-start-project-nav">Start Project</a>
        </div>

        <!-- Logged In Auth Buttons -->
        <div class="auth-group-logged-in" style="display: none; align-items: center; gap: 8px;">
          <a href="/dashboard" class="user-nav-chip" title="My Dashboard">
            <span class="user-avatar-initials nav-user-initials">U</span>
            <span class="user-chip-name nav-user-name">Client</span>
          </a>
          <a href="/dashboard" class="btn btn-xs btn-outline">Dashboard</a>
          <button onclick="DevCraftAuth.logout()" class="btn btn-xs btn-ghost text-muted" title="Logout">Logout</button>
        </div>

        <button class="mobile-toggle" id="mobile-toggle-btn" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Drawer -->
  <div class="mobile-drawer" id="mobile-drawer">
    <div class="mobile-drawer-header">
      <div class="brand-name">DEV<span>CRAFT</span></div>
      <button class="mobile-drawer-close" id="mobile-drawer-close" aria-label="Close menu">&times;</button>
    </div>
    <div class="mobile-drawer-links">
      <a href="#services" class="mobile-nav-link">20 Development Services (50% OFF) <span>→</span></a>
      <a href="#aptitude" class="mobile-nav-link">Aptitude &amp; Placement Hub (30% OFF) <span>→</span></a>
      <a href="#demos" class="mobile-nav-link">10 Interactive Demos <span>→</span></a>
      <a href="#why-devcraft" class="mobile-nav-link">Why DevCraft <span>→</span></a>
      <a href="#process" class="mobile-nav-link">6-Step Agile Process <span>→</span></a>
      <a href="#technologies" class="mobile-nav-link">Technologies & Stack <span>→</span></a>
      <a href="#case-studies" class="mobile-nav-link">Case Studies & Metrics <span>→</span></a>
      <a href="#pricing" class="mobile-nav-link">Pricing & Calculator <span>→</span></a>
      <a href="#about" class="mobile-nav-link">About DevCraft Studio <span>→</span></a>
      <a href="#contact" class="mobile-nav-link">Project Inquiry Form <span>→</span></a>

      <!-- Mobile Auth Logged Out -->
      <div class="auth-group-logged-out" style="display: flex; flex-direction: column; gap: 8px; margin: 8px 0;">
        <a href="/login" class="mobile-nav-link" style="color: var(--accent);">Sign In <span>🔑</span></a>
        <a href="/register" class="mobile-nav-link" style="color: var(--emerald);">Create Client Account <span>👤</span></a>
      </div>

      <!-- Mobile Auth Logged In -->
      <div class="auth-group-logged-in" style="display: none; flex-direction: column; gap: 8px; margin: 8px 0;">
        <a href="/dashboard" class="mobile-nav-link" style="color: var(--accent);">Client Workspace Dashboard <span>📊</span></a>
        <a href="/profile" class="mobile-nav-link">Profile &amp; Security Settings <span>⚙️</span></a>
        <a href="javascript:void(0)" onclick="DevCraftAuth.logout()" class="mobile-nav-link" style="color: #ef4444;">Sign Out <span>🚪</span></a>
      </div>

      <a href="/admin-login" class="mobile-nav-link" style="color: var(--warning);">Studio Admin Login <span>🔒</span></a>
    </div>

    <!-- Mobile Theme Switcher -->
    <div class="mobile-theme-bar">
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; font-weight: 600; text-transform: uppercase;">Select Site Theme</div>
      <div class="mobile-theme-buttons">
        <button class="btn btn-xs theme-picker-btn" data-theme-value="futuristic-dev">A: Futuristic</button>
        <button class="btn btn-xs theme-picker-btn" data-theme-value="premium-saas">B: SaaS Slate</button>
        <button class="btn btn-xs theme-picker-btn" data-theme-value="cyber-studio">C: Cyber Green</button>
      </div>
    </div>

    <div style="margin-top: 18px; display: flex; flex-direction: column; gap: 10px;">
      <a href="#contact" class="btn btn-primary" style="width: 100%; justify-content: center;">Start a Project Now</a>
      <a href="https://wa.me/918791984082?text=Hi%20DevCraft,%20I'm%20interested%20in%20discussing%20a%20project." target="_blank" rel="noopener noreferrer" class="btn btn-emerald" style="width: 100%; justify-content: center;">
        WhatsApp Studio Lead
      </a>
      <a href="tel:+917017022966" class="btn btn-outline" style="width: 100%; justify-content: center;">
        Direct Call +91 7017022966
      </a>
    </div>
  </div>
`;

const floatingActions = () => `
  <div class="floating-actions-bar">
    <a href="https://wa.me/918791984082?text=Hi%20DevCraft,%20I'm%20interested%20in%20discussing%20a%20software%20project." target="_blank" rel="noopener noreferrer" class="floating-btn wa" aria-label="Chat on WhatsApp">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z"/></svg>
      <span class="floating-tooltip">WhatsApp DevCraft</span>
    </a>
    <a href="tel:+917017022966" class="floating-btn call" aria-label="Call DevCraft">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      <span class="floating-tooltip">Direct Studio Call</span>
    </a>
    <button class="floating-btn back-to-top" id="back-to-top-btn" aria-label="Scroll to top">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
      <span class="floating-tooltip">Top</span>
    </button>
  </div>
`;

const footer = () => `
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <div class="brand-logo">
          <div class="brand-badge-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <div class="brand-name">DEV<span>CRAFT</span></div>
        </div>
        <p class="footer-tagline">
          <strong>Ideas → Code → Real Solutions</strong><br />
          Full-cycle software engineering studio delivering scalable mobile applications, modern web platforms, intelligent AI agents, and enterprise cloud systems.
        </p>
        <div class="footer-contact-details">
          <a href="mailto:shakyaharshit683@gmail.com" class="footer-contact-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            shakyaharshit683@gmail.com
          </a>
          <a href="tel:+917017022966" class="footer-contact-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            +91 7017022966 / +91 8791984082
          </a>
          <span class="footer-contact-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Mon – Sat: 09:00 – 21:00 IST • Rapid Response Guaranteed
          </span>
        </div>
      </div>

      <div>
        <div class="footer-col-title">Core Services</div>
        <div class="footer-links">
          <a href="#services" onclick="filterServicesCategory('Mobile Apps')" class="footer-link">Android & Mobile Apps</a>
          <a href="#services" onclick="filterServicesCategory('Web Apps')" class="footer-link">Full-Stack Web Apps</a>
          <a href="#services" onclick="filterServicesCategory('AI & ML')" class="footer-link">AI Integration & Chatbots</a>
          <a href="#services" onclick="filterServicesCategory('Dashboards')" class="footer-link">Admin Dashboards</a>
          <a href="#services" onclick="filterServicesCategory('Websites')" class="footer-link">High-Speed E-Commerce</a>
          <a href="#services" onclick="filterServicesCategory('Automation')" class="footer-link">Cloud DevOps & Automation</a>
        </div>
      </div>

      <div>
        <div class="footer-col-title">Interactive Demos</div>
        <div class="footer-links">
          <a href="#demos" onclick="devcraftDemos.openDemoModal('cravex')" class="footer-link">CraveX Food Delivery</a>
          <a href="#demos" onclick="devcraftDemos.openDemoModal('fitcore')" class="footer-link">FitCore Gym SaaS</a>
          <a href="#demos" onclick="devcraftDemos.openDemoModal('edunova')" class="footer-link">EduNova LMS</a>
          <a href="#demos" onclick="devcraftDemos.openDemoModal('estatex')" class="footer-link">EstateX Luxury Realty</a>
          <a href="#demos" onclick="devcraftDemos.openDemoModal('jarvis-ai')" class="footer-link">Jarvis AI Workspace</a>
          <a href="#demos" onclick="devcraftDemos.openDemoModal('novacart')" class="footer-link">NovaCart Digital Store</a>
        </div>
      </div>

      <div>
        <div class="footer-col-title">Direct Studio Hub</div>
        <div class="footer-links">
          <a href="https://wa.me/918791984082?text=Hi%20DevCraft,%20I'd%20like%20to%20hire%20your%20team%20for%20a%20project." target="_blank" rel="noopener noreferrer" class="footer-link">WhatsApp Studio</a>
          <a href="https://www.instagram.com/kiro_mage/" target="_blank" rel="noopener noreferrer" class="footer-link">Instagram (@kiro_mage)</a>
          <a href="https://t.me/harshuuu1123" target="_blank" rel="noopener noreferrer" class="footer-link">Telegram Channel</a>
          <a href="/client-portal" class="footer-link" style="color: var(--accent); font-weight: 600;">Client Portal 👤</a>
          <a href="/admin-login" class="footer-link" style="color: var(--warning); font-weight: 600;">Studio Admin Login 🔒</a>
          <a href="#faq" class="footer-link">Frequently Asked Questions</a>
        </div>
      </div>
    </div>

    <div class="container footer-bottom">
      <div>&copy; 2026 <strong>DEVCRAFT</strong>. All rights reserved. Ideas → Code → Real Solutions.</div>
      <div class="footer-badges-bottom">
        <span class="status-pill-online"><span class="status-dot"></span> All Systems Operational</span>
        <span>Node.js • Next.js • React Native • MongoDB</span>
      </div>
    </div>
  </footer>
`;

module.exports = { commonHead, navbar, floatingActions, footer };

