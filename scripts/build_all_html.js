const fs = require('fs');
const path = require('path');
const { commonHead, navbar, floatingActions, footer } = require('./components');
const { servicesSectionContent, projectsSectionContent, aboutSectionContent, contactSectionContent } = require('./page_sections');

const ROOT = path.join(__dirname, '..');
const FRONTEND = path.join(ROOT, 'frontend');
const PAGES = path.join(FRONTEND, 'pages');

if (!fs.existsSync(PAGES)) fs.mkdirSync(PAGES, { recursive: true });

// 1. INDEX.HTML
const heroSection = `
  <header class="hero-section" id="hero">
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="pulse-dot"></span>
          <span>Available for New Projects & Freelance</span>
        </div>

        <div class="hero-greeting">Hi, I'm <span class="hero-name">Harshit</span></div>
        <h1 class="hero-headline">
          I Build <span class="gradient">Digital Experiences</span>
        </h1>

        <p class="hero-bio">
          Full-Stack Web Developer passionate about engineering modern websites, intelligent AI integrations,
          robust web applications, and intuitive mobile solutions with cinematic 3D fidelity.
        </p>

        <div class="hero-offerings-pills">
          <span class="pill-tag">Websites</span>
          <span class="pill-tag">Web Applications</span>
          <span class="pill-tag">Android Applications</span>
          <span class="pill-tag">AI-Powered Solutions</span>
          <span class="pill-tag">E-Commerce Platforms</span>
          <span class="pill-tag">Admin Dashboards</span>
          <span class="pill-tag">Custom Digital Products</span>
        </div>

        <div class="hero-cta-group">
          <a href="/projects" class="btn btn-primary">
            <span>View Projects</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          <a href="/contact" class="btn btn-emerald">Hire Me</a>
          <a href="/contact" class="btn btn-outline">Contact Me</a>
        </div>

        <div class="hero-channels">
          <span class="channel-label">Connect:</span>
          <a href="https://wa.me/918791984082?text=Hi%20Harshit,%20I'm%20interested%20in%20discussing%20a%20project." target="_blank" rel="noopener noreferrer" class="channel-btn whatsapp" title="Chat on WhatsApp">
            WhatsApp
          </a>
          <a href="tel:+917017022966" class="channel-btn call" title="Call Harshit">
            Call
          </a>
          <a href="https://www.instagram.com/kiro_mage/" target="_blank" rel="noopener noreferrer" class="channel-btn instagram" title="Instagram @kiro_mage">
            Instagram
          </a>
          <a href="https://t.me/harshuuu1123" target="_blank" rel="noopener noreferrer" class="channel-btn telegram" title="Telegram @harshuuu1123">
            Telegram
          </a>
          <button class="channel-btn github-soon" title="GitHub profile coming soon">
            GitHub <span class="badge-soon">Coming Soon</span>
          </button>
        </div>
      </div>

      <!-- Real Three.js Canvas Container -->
      <div class="hero-canvas-container" id="three-container">
        <canvas id="three-canvas" aria-label="Interactive 3D developer cyber core visualization"></canvas>
        <div class="canvas-fallback" id="three-fallback">
          <div style="font-family: monospace; color: #00f0ff;">&lt;3D CORE ONLINE&gt;</div>
        </div>
        <div class="canvas-badge-hint">✨ Interactive 3D Core: Move Cursor to Rotate</div>
      </div>
    </div>
  </header>
`;

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead("Harsh Developer — Full-Stack Developer & 3D WebGL", "Official website and developer portfolio of Harshit (Harsh Developer). Modern websites, AI applications, WebGL 3D, and custom software.")}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
  ${navbar('home')}
  ${heroSection}
  ${servicesSectionContent(false)}
  ${projectsSectionContent()}
  ${aboutSectionContent(false)}
  ${contactSectionContent()}
  ${floatingActions()}
  ${footer()}
  <script src="/js/api.js"></script>
  <script src="/js/three-scene.js"></script>
  <script src="/js/form.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(FRONTEND, 'index.html'), indexHtml, 'utf8');
console.log('✓ Generated frontend/index.html');

// 2. SERVICES.HTML
const servicesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead("Client Services — Harsh Developer", "Explore full-stack web, mobile, AI, and e-commerce development services offered by Harshit.")}
</head>
<body>
  ${navbar('services')}
  <div style="padding-top: 100px;">
    ${servicesSectionContent(true)}
  </div>
  ${floatingActions()}
  ${footer()}
  <script src="/js/api.js"></script>
  <script src="/js/form.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(PAGES, 'services.html'), servicesHtml, 'utf8');
console.log('✓ Generated frontend/pages/services.html');

// 3. PROJECTS.HTML
const projectsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead("Projects & Case Studies — Harsh Developer", "Browse full-stack projects, web applications, and digital solutions created by Harshit.")}
</head>
<body>
  ${navbar('projects')}
  <div style="padding-top: 100px;">
    ${projectsSectionContent()}
  </div>
  ${floatingActions()}
  ${footer()}
  <script src="/js/api.js"></script>
  <script src="/js/form.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(PAGES, 'projects.html'), projectsHtml, 'utf8');
console.log('✓ Generated frontend/pages/projects.html');

// 4. ABOUT.HTML
const aboutHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead("About Harshit — Harsh Developer", "Learn more about Harshit, developer focus, workflow, technical skills, and availability.")}
</head>
<body>
  ${navbar('about')}
  <div style="padding-top: 100px;">
    ${aboutSectionContent(true)}
  </div>
  ${floatingActions()}
  ${footer()}
  <script src="/js/api.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(PAGES, 'about.html'), aboutHtml, 'utf8');
console.log('✓ Generated frontend/pages/about.html');

// 5. CONTACT.HTML
const contactHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead("Contact & Hire Me — Harsh Developer", "Request a quote, initiate an enquiry, or message Harshit directly via WhatsApp, Call, or Email.")}
</head>
<body>
  ${navbar('contact')}
  <div style="padding-top: 100px;">
    ${contactSectionContent()}
  </div>
  ${floatingActions()}
  ${footer()}
  <script src="/js/api.js"></script>
  <script src="/js/form.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(PAGES, 'contact.html'), contactHtml, 'utf8');
console.log('✓ Generated frontend/pages/contact.html');

// 6. ADMIN-LOGIN.HTML
const adminLoginHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead("Admin Portal Login — Harsh Developer", "Secure administrative management access for Harshit.")}
  <style>
    .login-container {
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 120px 24px 60px;
    }
    .login-card {
      width: 100%;
      max-width: 440px;
      padding: 40px;
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      backdrop-filter: blur(20px);
    }
    .login-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid var(--amber);
      border-radius: var(--radius-full);
      font-size: 0.78rem;
      color: var(--amber);
      font-weight: 600;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  ${navbar('')}
  
  <div class="login-container">
    <div class="login-card">
      <div style="text-align: center; margin-bottom: 28px;">
        <div class="login-badge">🔒 Restricted Admin Area</div>
        <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Admin Login</h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">
          Authenticate to manage client enquiries and showcase projects.
        </p>
      </div>

      <div id="login-error-msg" class="form-status-msg" style="display: none;"></div>

      <form id="admin-login-form">
        <div class="form-group" style="margin-bottom: 20px;">
          <label for="admin-email" class="form-label">Admin Email</label>
          <input type="email" id="admin-email" class="form-control" placeholder="shakyaharshit683@gmail.com" required autocomplete="email" />
        </div>

        <div class="form-group" style="margin-bottom: 24px;">
          <label for="admin-password" class="form-label">Password</label>
          <input type="password" id="admin-password" class="form-control" placeholder="••••••••••••" required autocomplete="current-password" />
        </div>

        <button type="submit" id="login-btn" class="btn btn-primary" style="width: 100%;">
          <span>Sign In to Dashboard</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </form>

      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-glass); text-align: center; font-size: 0.82rem; color: var(--text-muted);">
        Secured with Bcrypt & Signed JWT Sessions.<br/>
        Client looking to track a project? <a href="/client-portal" style="color: var(--cyan); text-decoration: underline;">Open Client Portal</a>
      </div>
    </div>
  </div>

  ${footer()}

  <script src="/js/api.js"></script>
  <script>
    if (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) {
      window.location.href = '/admin/';
    }

    const form = document.getElementById('admin-login-form');
    const emailInput = document.getElementById('admin-email');
    const passInput = document.getElementById('admin-password');
    const submitBtn = document.getElementById('login-btn');
    const errorBox = document.getElementById('login-error-msg');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBox.style.display = 'none';

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Authenticating...';

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailInput.value.trim(),
            password: passInput.value
          })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Authentication failed');
        }

        sessionStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminUser', JSON.stringify(data.admin));

        showToast('Login successful! Redirecting to Dashboard...', 'success');
        setTimeout(() => {
          window.location.href = '/admin/';
        }, 800);
      } catch (err) {
        errorBox.className = 'form-status-msg error';
        errorBox.style.display = 'block';
        errorBox.textContent = err.message;
        showToast(err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Sign In to Dashboard</span>';
      }
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(PAGES, 'admin-login.html'), adminLoginHtml, 'utf8');
console.log('✓ Generated frontend/pages/admin-login.html');

// 7. CLIENT-PORTAL.HTML
const clientPortalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead("Client Portal & Project Tracking — Harsh Developer", "Client dashboard for tracking project enquiries, requesting software solutions, and collaborating with Harshit.")}
  <style>
    .portal-container {
      min-height: calc(100vh - 160px);
      padding: 120px 24px 80px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .auth-wrapper {
      max-width: 460px;
      margin: 0 auto;
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 36px;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
    }
    .auth-tabs {
      display: flex;
      border-bottom: 1px solid var(--border-glass);
      margin-bottom: 24px;
    }
    .auth-tab {
      flex: 1;
      text-align: center;
      padding: 12px;
      cursor: pointer;
      font-weight: 600;
      color: var(--text-muted);
      border-bottom: 2px solid transparent;
      transition: var(--transition-fast);
    }
    .auth-tab.active {
      color: var(--cyan);
      border-bottom-color: var(--cyan);
    }
    .client-dashboard {
      display: none;
    }
    .dashboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 36px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-glass);
    }
    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 36px;
    }
    .dashboard-stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 24px;
    }
    .dashboard-stat-num {
      font-size: 2rem;
      font-weight: 800;
      color: var(--cyan);
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .dashboard-stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  ${navbar('portal')}

  <div class="portal-container">
    <div id="auth-section" class="auth-wrapper">
      <div style="text-align: center; margin-bottom: 20px;">
        <div class="section-badge" style="margin-bottom: 10px;">Client Portal</div>
        <h2 style="font-size: 1.6rem;">Access Your Project Hub</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 6px;">
          Track development progress and manage project requests.
        </p>
      </div>

      <div class="auth-tabs">
        <div class="auth-tab active" id="tab-login-btn" onclick="switchAuthTab('login')">Sign In</div>
        <div class="auth-tab" id="tab-register-btn" onclick="switchAuthTab('register')">Create Account</div>
      </div>

      <div id="auth-status-msg" class="form-status-msg" style="display: none;"></div>

      <form id="client-login-form">
        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Email Address</label>
          <input type="email" id="client-email" class="form-control" placeholder="client@example.com" required autocomplete="email" />
        </div>

        <div class="form-group" style="margin-bottom: 24px;">
          <label class="form-label">Password</label>
          <input type="password" id="client-password" class="form-control" placeholder="••••••••" required autocomplete="current-password" />
        </div>

        <button type="submit" id="btn-login-submit" class="btn btn-primary" style="width: 100%;">
          Sign In to Portal →
        </button>
      </form>

      <form id="client-register-form" style="display: none;">
        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label">Full Name <span class="req">*</span></label>
          <input type="text" id="reg-name" class="form-control" placeholder="Alex Smith" required />
        </div>

        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label">Email Address <span class="req">*</span></label>
          <input type="email" id="reg-email" class="form-control" placeholder="alex@company.com" required />
        </div>

        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label">Phone / WhatsApp Number</label>
          <input type="tel" id="reg-phone" class="form-control" placeholder="+91 9876543210" />
        </div>

        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label">Company / Brand (Optional)</label>
          <input type="text" id="reg-company" class="form-control" placeholder="Acme Inc." />
        </div>

        <div class="form-group" style="margin-bottom: 24px;">
          <label class="form-label">Create Password (min 6 characters) <span class="req">*</span></label>
          <input type="password" id="reg-password" class="form-control" placeholder="••••••••" required minlength="6" />
        </div>

        <button type="submit" id="btn-reg-submit" class="btn btn-primary" style="width: 100%;">
          Register Account →
        </button>
      </form>
    </div>

    <div id="dashboard-section" class="client-dashboard">
      <div class="dashboard-header">
        <div>
          <div class="section-badge" style="margin-bottom: 8px;">Client Workspace</div>
          <h1 style="font-size: 2.2rem; margin-bottom: 4px;">
            Welcome, <span id="client-user-name" class="text-gradient">Client</span>!
          </h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Account: <span id="client-user-email">email</span> | 
            Company: <span id="client-user-company">Direct Client</span>
          </p>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="/contact" class="btn btn-primary">
            <span>+ Request New Project</span>
          </a>
          <button onclick="clientLogout()" class="btn btn-outline">
            Sign Out
          </button>
        </div>
      </div>

      <div class="dashboard-stats">
        <div class="dashboard-stat-card">
          <div class="dashboard-stat-num" id="stat-my-total">0</div>
          <div class="dashboard-stat-label">Total Requests</div>
        </div>
        <div class="dashboard-stat-card">
          <div class="dashboard-stat-num" id="stat-my-progress" style="color: #c084fc;">0</div>
          <div class="dashboard-stat-label">In Progress</div>
        </div>
        <div class="dashboard-stat-card">
          <div class="dashboard-stat-num" id="stat-my-completed" style="color: var(--emerald);">0</div>
          <div class="dashboard-stat-label">Completed</div>
        </div>
      </div>

      <div class="glass-card" style="padding: 28px; margin-bottom: 30px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <h3 style="font-size: 1.3rem;">My Project Enquiries</h3>
          <button onclick="loadClientEnquiries()" class="action-btn" style="cursor: pointer; padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass); color: #fff; border-radius: 6px;">🔄 Refresh</button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-glass); color: var(--text-muted);">
                <th style="padding: 12px 14px;">Service</th>
                <th style="padding: 12px 14px;">Description</th>
                <th style="padding: 12px 14px;">Budget</th>
                <th style="padding: 12px 14px;">Deadline</th>
                <th style="padding: 12px 14px;">Status</th>
                <th style="padding: 12px 14px;">Date Submitted</th>
              </tr>
            </thead>
            <tbody id="client-enquiries-body">
            </tbody>
          </table>
        </div>
      </div>

      <div class="glass-card" style="padding: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
        <div>
          <h4 style="font-size: 1.15rem; margin-bottom: 6px;">Need Direct Communication With Harshit?</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            Discuss milestones or fast-track quotes via WhatsApp or Direct Call.
          </p>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="https://wa.me/918791984082?text=Hi%20Harshit,%20checking%20in%20from%20my%20Client%20Portal." target="_blank" class="btn btn-emerald btn-sm">
            Chat on WhatsApp
          </a>
          <a href="tel:+917017022966" class="btn btn-outline btn-sm">
            Call +91 7017022966
          </a>
        </div>
      </div>
    </div>
  </div>

  ${floatingActions()}
  ${footer()}

  <script src="/js/api.js"></script>
  <script>
    let userToken = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');

    function switchAuthTab(tab) {
      const loginTab = document.getElementById('tab-login-btn');
      const regTab = document.getElementById('tab-register-btn');
      const loginForm = document.getElementById('client-login-form');
      const regForm = document.getElementById('client-register-form');
      const msgBox = document.getElementById('auth-status-msg');
      if (msgBox) msgBox.style.display = 'none';

      if (tab === 'login') {
        loginTab.classList.add('active');
        regTab.classList.remove('active');
        loginForm.style.display = 'block';
        regForm.style.display = 'none';
      } else {
        loginTab.classList.remove('active');
        regTab.classList.add('active');
        loginForm.style.display = 'none';
        regForm.style.display = 'block';
      }
    }

    document.addEventListener('DOMContentLoaded', async () => {
      if (userToken) {
        await checkClientAuth();
      }
    });

    async function checkClientAuth() {
      try {
        const res = await fetch('/api/users/me', {
          headers: { 'Authorization': 'Bearer ' + userToken }
        });
        if (!res.ok) throw new Error('Session expired');
        const data = await res.json();
        showClientDashboard(data.user);
        await loadClientEnquiries();
      } catch (err) {
        userToken = null;
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userToken');
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('dashboard-section').style.display = 'none';
      }
    }

    function showClientDashboard(user) {
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('dashboard-section').style.display = 'block';
      document.getElementById('client-user-name').textContent = user.name;
      document.getElementById('client-user-email').textContent = user.email;
      document.getElementById('client-user-company').textContent = user.company || 'Direct Client';
    }

    function clientLogout() {
      userToken = null;
      localStorage.removeItem('userToken');
      sessionStorage.removeItem('userToken');
      window.location.reload();
    }

    document.getElementById('client-login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('client-email').value.trim();
      const password = document.getElementById('client-password').value;
      const btn = document.getElementById('btn-login-submit');
      const msgBox = document.getElementById('auth-status-msg');

      btn.disabled = true;
      btn.textContent = 'Signing in...';

      try {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

        userToken = data.token;
        localStorage.setItem('userToken', data.token);
        sessionStorage.setItem('userToken', data.token);

        showToast('Signed in successfully!', 'success');
        showClientDashboard(data.user);
        await loadClientEnquiries();
      } catch (err) {
        msgBox.className = 'form-status-msg error';
        msgBox.style.display = 'block';
        msgBox.textContent = err.message;
        showToast(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In to Portal →';
      }
    });

    document.getElementById('client-register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const company = document.getElementById('reg-company').value.trim();
      const password = document.getElementById('reg-password').value;
      const btn = document.getElementById('btn-reg-submit');
      const msgBox = document.getElementById('auth-status-msg');

      btn.disabled = true;
      btn.textContent = 'Creating account...';

      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, company, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');

        userToken = data.token;
        localStorage.setItem('userToken', data.token);
        sessionStorage.setItem('userToken', data.token);

        showToast('Registration successful! Welcome.', 'success');
        showClientDashboard(data.user);
        await loadClientEnquiries();
      } catch (err) {
        msgBox.className = 'form-status-msg error';
        msgBox.style.display = 'block';
        msgBox.textContent = err.message;
        showToast(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Register Account →';
      }
    });

    async function loadClientEnquiries() {
      const tbody = document.getElementById('client-enquiries-body');
      try {
        const res = await fetch('/api/users/my-enquiries', {
          headers: { 'Authorization': 'Bearer ' + userToken }
        });
        const { data } = await res.json();
        const enquiries = data || [];

        document.getElementById('stat-my-total').textContent = enquiries.length;
        document.getElementById('stat-my-progress').textContent = enquiries.filter(e => e.status === 'In Progress').length;
        document.getElementById('stat-my-completed').textContent = enquiries.filter(e => e.status === 'Completed').length;

        if (enquiries.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 24px;">No project requests yet. Click "+ Request New Project" to submit one!</td></tr>';
          return;
        }

        tbody.innerHTML = enquiries.map(e => {
          const badgeClass = 'status-' + (e.status || 'new').toLowerCase().replace(/\\s+/g, '-');
          return \`
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
              <td style="padding: 14px;"><strong style="color: var(--cyan);">\${escapeHtml(e.service)}</strong></td>
              <td style="padding: 14px; max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${escapeHtml(e.description)}</td>
              <td style="padding: 14px;">\${escapeHtml(e.budget || 'Flexible')}</td>
              <td style="padding: 14px;">\${escapeHtml(e.deadline || 'Flexible')}</td>
              <td style="padding: 14px;">
                <span class="status-pill \${badgeClass}">\${escapeHtml(e.status)}</span>
              </td>
              <td style="padding: 14px; color: #94a3b8; font-size: 0.82rem;">\${new Date(e.createdAt).toLocaleDateString()}</td>
            </tr>
          \`;
        }).join('');
      } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" style="color: #f87171; padding: 14px;">Failed to load enquiries.</td></tr>';
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(PAGES, 'client-portal.html'), clientPortalHtml, 'utf8');
console.log('✓ Generated frontend/pages/client-portal.html');

console.log('All frontend HTML pages built successfully!');
