/**
 * DEVCRAFT STUDIO — MASTER CLIENT CONTROLLER
 * Theme Switching, Dynamic Filtering, FAQ Accordion, Cost Estimator, Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initMobileNav();
  initSmoothScroll();
  initBackToTop();
  calculateEstimate(); // initialize estimator display
});

// ==========================================
// 1. THEME SWITCHER (3 THEMES WITH LOCALSTORAGE)
// Option A: Futuristic Dev (default)
// Option B: Premium SaaS
// Option C: Cyber Studio
// ==========================================
function initThemeSwitcher() {
  const savedTheme = localStorage.getItem('devcraft_theme') || 'futuristic-dev';
  applyTheme(savedTheme);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  const themeMenu = document.getElementById('theme-menu');

  if (toggleBtn && themeMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!themeMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        themeMenu.classList.remove('show');
      }
    });

    // Theme menu option buttons
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-theme-value');
        if (selected) {
          applyTheme(selected);
          themeMenu.classList.remove('show');
        }
      });
    });
  }

  // Mobile theme picker buttons
  document.querySelectorAll('.theme-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-theme-value');
      if (selected) {
        applyTheme(selected);
      }
    });
  });
}

function applyTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('devcraft_theme', themeName);

  const labelMap = {
    'futuristic-dev': 'Futuristic Dev',
    'premium-saas': 'Premium SaaS',
    'cyber-studio': 'Cyber Studio'
  };

  const labelEl = document.getElementById('current-theme-label');
  if (labelEl) {
    labelEl.textContent = labelMap[themeName] || 'Futuristic Dev';
  }

  // Highlight active mobile picker button
  document.querySelectorAll('.theme-picker-btn').forEach(b => {
    if (b.getAttribute('data-theme-value') === themeName) {
      b.classList.add('btn-primary');
      b.classList.remove('btn-outline');
    } else {
      b.classList.remove('btn-primary');
      b.classList.add('btn-outline');
    }
  });
}

// ==========================================
// 2. SERVICES FILTER BAR (20 SERVICES)
// ==========================================
window.filterServicesCategory = function(category) {
  const filterBtns = document.querySelectorAll('#services-filter-bar .filter-pill');
  filterBtns.forEach(btn => {
    if (btn.textContent.trim().toLowerCase() === category.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('#services-catalog-grid .service-card');
  cards.forEach(card => {
    const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
    const targetCat = category.toLowerCase();

    if (targetCat === 'all' || cardCat.includes(targetCat) || targetCat.includes(cardCat)) {
      card.style.display = 'flex';
      card.style.opacity = '1';
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });
};

// ==========================================
// 3. DEMOS & PORTFOLIO FILTER BAR (10 DEMOS)
// ALL, MOBILE APPS, WEB APPS, WEBSITES, AI, DASHBOARDS, BUSINESS SOFTWARE, AUTOMATION
// ==========================================
window.filterDemosCategory = function(category) {
  const filterBtns = document.querySelectorAll('#portfolio-filter-bar .filter-pill');
  filterBtns.forEach(btn => {
    if (btn.textContent.trim().toUpperCase() === category.toUpperCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('#demos-catalog-grid .demo-card');
  cards.forEach(card => {
    const cardCat = (card.getAttribute('data-category') || '').toUpperCase();
    const targetCat = category.toUpperCase();

    if (targetCat === 'ALL' || cardCat.includes(targetCat) || targetCat.includes(cardCat)) {
      card.style.display = 'flex';
      card.style.opacity = '1';
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });
};

// ==========================================
// 4. INTERACTIVE FAQ ACCORDION
// ==========================================
window.toggleFaq = function(element) {
  const allItems = document.querySelectorAll('#faq-accordion .faq-item');
  const wasActive = element.classList.contains('active');

  allItems.forEach(item => item.classList.remove('active'));

  if (!wasActive) {
    element.classList.add('active');
  }
};

// ==========================================
// 5. INTERACTIVE PROJECT COST ESTIMATOR
// ==========================================
window.calculateEstimate = function() {
  const typeEl = document.getElementById('est-type');
  const compEl = document.getElementById('est-complexity');
  const speedEl = document.getElementById('est-speed');
  const resultEl = document.getElementById('est-result-val');

  if (!typeEl || !compEl || !speedEl || !resultEl) return;

  const basePrices = {
    web: 45000,
    mobile: 55000,
    ai: 65000,
    dashboard: 40000,
    website: 25000
  };

  const compMultipliers = {
    mvp: 0.75,
    standard: 1.0,
    enterprise: 1.8
  };

  const speedMultipliers = {
    normal: 1.0,
    express: 1.3,
    flexible: 0.9
  };

  const base = basePrices[typeEl.value] || 45000;
  const comp = compMultipliers[compEl.value] || 1.0;
  const speed = speedMultipliers[speedEl.value] || 1.0;

  const lowEstimate = Math.round((base * comp * speed) / 1000) * 1000;
  const highEstimate = Math.round((lowEstimate * 1.45) / 1000) * 1000;

  resultEl.textContent = `₹${lowEstimate.toLocaleString('en-IN')} – ₹${highEstimate.toLocaleString('en-IN')}`;
};

// ==========================================
// 6. MOBILE NAVIGATION DRAWER
// ==========================================
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('active');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('active');
      });
    }

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('active');
      });
    });
  }
}

// ==========================================
// 7. SMOOTH SCROLLING
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ==========================================
// 8. BACK TO TOP BUTTON
// ==========================================
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      } else {
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
      }
    });
  }
}

