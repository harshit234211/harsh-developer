/**
 * HARSH DEVELOPER — MAIN UI CONTROLLER & PROJECTS LOADER
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initProjectsSection();
  initSmoothScroll();
});

// Mobile Navigation Toggle
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('active');
      const isExpanded = drawer.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close drawer when any nav link inside is clicked
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('active');
      });
    });
  }
}

// Projects Loader & Filter Tabs
async function initProjectsSection() {
  const projectsGrid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!projectsGrid) return;

  let currentCategory = 'All';

  async function loadProjects(category = 'All') {
    projectsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">
        <div style="display: inline-block; width: 32px; height: 32px; border: 3px solid rgba(0, 240, 255, 0.2); border-top-color: #00f0ff; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 12px;"></div>
        <p>Loading projects from API...</p>
      </div>
    `;

    try {
      const res = await ApiService.getProjects(category);
      const projects = res.data || [];

      if (projects.length === 0) {
        projectsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 50px; background: rgba(255,255,255,0.02); border-radius: 14px; border: 1px dashed rgba(255,255,255,0.1);">
            <h4 style="margin-bottom: 8px;">No projects found in this category</h4>
            <p style="color: #94a3b8; font-size: 0.95rem;">Check back soon or select another category above.</p>
          </div>
        `;
        return;
      }

      projectsGrid.innerHTML = projects.map(p => `
        <div class="glass-card project-card">
          <div class="project-image-wrap">
            <img src="${p.image || '/assets/images/project-placeholder.svg'}" alt="${p.name}" loading="lazy"/>
            <span class="project-status-badge status-showcase">${p.status || 'Showcase Demo'}</span>
          </div>
          <div class="project-category">${p.category}</div>
          <h3 class="project-title">${p.name}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">
            ${(p.technologies || []).map(tech => `<span class="project-tag">${tech}</span>`).join('')}
          </div>
          <div class="project-links">
            ${p.liveDemoUrl ? `
              <a href="${p.liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Live Demo
              </a>
            ` : ''}
            <button class="project-link-btn github-disabled" title="GitHub link coming soon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              GitHub <span class="badge-soon">Soon</span>
            </button>
          </div>
        </div>
      `).join('');
    } catch (err) {
      projectsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #f87171;">
          <p>Failed to load projects from server. Please refresh the page.</p>
        </div>
      `;
    }
  }

  // Bind filter button clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category || 'All';
      loadProjects(currentCategory);
    });
  });

  // Initial load
  loadProjects('All');
}

// Smooth Anchor Jump Helper
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
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
