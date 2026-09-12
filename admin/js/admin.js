/**
 * HARSH DEVELOPER — ADMIN DASHBOARD JAVASCRIPT
 */

const API_BASE = '/api';
let authToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken') || localStorage.getItem('admin_token');
let currentEnquiries = [];
let currentProjects = [];
let currentProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!authToken) {
    window.location.href = '/admin-login';
    return;
  }

  await verifyAdminSession();
  initNavigation();
  await loadStats();
  await loadEnquiries();
  await loadProjects();
  await loadClients();
  await loadCoupons();
  await loadProductsCMS();
  await loadDiscountRules();
  await loadSoftwareFiles();
  await loadOrdersRoster();
  await loadDownloadsAudit();
});

// Auth Guard
async function verifyAdminSession() {
  try {
    const res = await fetch(`${API_BASE}/admin/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!res.ok) throw new Error('Session invalid');

    const data = await res.json();
    document.getElementById('admin-name-display').textContent = data.admin.name;
    document.getElementById('admin-role-display').textContent = data.admin.email;
    document.getElementById('db-engine-badge').textContent = data.dbEngine || 'Connected';
  } catch (err) {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
  }
}

// Navigation Tabs
function initNavigation() {
  const navItems = document.querySelectorAll('.admin-nav-item[data-section]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      const activeEl = document.getElementById(`section-${section}`);
      if (activeEl) activeEl.classList.add('active');
    });
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
      await fetch(`${API_BASE}/admin/logout`, { method: 'POST' });
    } catch (_) {}
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
  });
}

// Stats Loader
async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/admin/enquiries/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok) return;
    const { data } = await res.json();

    document.getElementById('stat-total-enquiries').textContent = data.totalEnquiries || 0;
    document.getElementById('stat-new-enquiries').textContent = data.newEnquiries || 0;
    document.getElementById('stat-in-progress').textContent = data.inProgress || 0;
    document.getElementById('stat-completed').textContent = data.completed || 0;
    document.getElementById('stat-total-projects').textContent = data.totalProjects || 0;
    if (document.getElementById('stat-total-clients')) {
      document.getElementById('stat-total-clients').textContent = data.totalClients || 0;
    }
  } catch (err) {
    console.error('Error loading stats', err);
  }
}

// Clients Management
async function loadClients() {
  const tbody = document.getElementById('clients-table-body');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/admin/clients`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const { data } = await res.json();
    const clients = data || [];

    if (clients.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 24px;">No registered clients yet. Clients can register via the Client Portal.</td></tr>';
      return;
    }

    tbody.innerHTML = clients.map(c => {
      const cleanPhone = (c.phone || '').replace(/\\D/g, '');
      return `
        <tr>
          <td><strong>${escapeHtml(c.name)}</strong></td>
          <td>${escapeHtml(c.email)}</td>
          <td>${escapeHtml(c.phone || 'N/A')}</td>
          <td>${escapeHtml(c.company || 'Direct Client')}</td>
          <td style="color: #94a3b8; font-size: 0.82rem;">${new Date(c.createdAt).toLocaleDateString()}</td>
          <td>
            <div class="action-btns">
              ${cleanPhone ? `<a href="https://wa.me/${cleanPhone}" target="_blank" class="action-btn whatsapp" title="WhatsApp">💬 WA</a>` : ''}
              ${c.phone ? `<a href="tel:${c.phone}" class="action-btn" title="Call">📞</a>` : ''}
              <a href="mailto:${c.email}" class="action-btn" title="Email">✉️</a>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" style="color: #f87171; padding: 14px;">Failed to load clients.</td></tr>';
  }
}

// Enquiries Management
async function loadEnquiries() {
  const statusFilter = document.getElementById('enquiry-status-filter').value;
  const search = document.getElementById('enquiry-search-input').value.trim();

  let url = `${API_BASE}/admin/enquiries?status=${encodeURIComponent(statusFilter)}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const { data } = await res.json();
    currentEnquiries = data || [];
    renderEnquiriesTable(currentEnquiries);
  } catch (err) {
    console.error('Error fetching enquiries', err);
  }
}

function renderEnquiriesTable(enquiries) {
  const tbody = document.getElementById('enquiries-table-body');
  if (!tbody) return;

  if (enquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 30px;">No enquiries found matching criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = enquiries.map(e => {
    const dateStr = new Date(e.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const cleanPhone = e.phone.replace(/\D/g, '');
    const cleanWa = (e.whatsapp || e.phone).replace(/\D/g, '');

    return `
      <tr>
        <td><strong>${escapeHtml(e.name)}</strong></td>
        <td>
          <div>${escapeHtml(e.email)}</div>
          <div style="font-size: 0.8rem; color: #94a3b8;">${escapeHtml(e.phone)}</div>
        </td>
        <td><span class="status-pill status-new">${escapeHtml(e.service)}</span></td>
        <td>${escapeHtml(e.budget || 'Flexible')}</td>
        <td>
          <select onchange="updateEnquiryStatus('${e._id}', this.value)" class="filter-select" style="padding: 4px 8px; font-size: 0.8rem;">
            <option value="New" ${e.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Contacted" ${e.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="In Progress" ${e.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${e.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${e.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td style="font-size: 0.8rem; color: #94a3b8;">${dateStr}</td>
        <td>
          <div class="action-btns">
            <button onclick="viewEnquiryDetails('${e._id}')" class="action-btn" title="View Details">👁️</button>
            <a href="https://wa.me/${cleanWa}" target="_blank" class="action-btn whatsapp" title="Chat on WhatsApp">💬 WA</a>
            <a href="tel:+${cleanPhone}" class="action-btn" title="Call">📞</a>
            <a href="mailto:${e.email}?subject=Regarding%20your%20Project%20Enquiry%20-%20Harsh%20Developer" class="action-btn" title="Email">✉️</a>
            <button onclick="deleteEnquiry('${e._id}')" class="action-btn delete" title="Delete">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function updateEnquiryStatus(id, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      await loadStats();
    }
  } catch (err) {
    alert('Failed to update status');
  }
}

async function deleteEnquiry(id) {
  if (!confirm('Are you sure you want to permanently delete this enquiry?')) return;

  try {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (res.ok) {
      await loadStats();
      await loadEnquiries();
    }
  } catch (err) {
    alert('Failed to delete enquiry');
  }
}

function viewEnquiryDetails(id) {
  const enquiry = currentEnquiries.find(e => e._id === id);
  if (!enquiry) return;

  document.getElementById('modal-enquiry-content').innerHTML = `
    <h3 style="margin-bottom: 4px;">${escapeHtml(enquiry.name)}</h3>
    <div style="color: var(--cyan); margin-bottom: 20px;">${escapeHtml(enquiry.service)} — Status: <strong>${enquiry.status}</strong></div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; font-size: 0.9rem;">
      <div><strong>Email:</strong> <a href="mailto:${enquiry.email}" style="color: var(--cyan);">${escapeHtml(enquiry.email)}</a></div>
      <div><strong>Phone:</strong> <a href="tel:${enquiry.phone}" style="color: var(--cyan);">${escapeHtml(enquiry.phone)}</a></div>
      <div><strong>Budget:</strong> ${escapeHtml(enquiry.budget || 'Flexible')}</div>
      <div><strong>Target Deadline:</strong> ${escapeHtml(enquiry.deadline || 'Flexible')}</div>
      <div><strong>Project Type:</strong> ${escapeHtml(enquiry.projectType || 'New Project')}</div>
      <div><strong>Submitted:</strong> ${new Date(enquiry.createdAt).toLocaleString()}</div>
    </div>

    ${enquiry.referenceUrl ? `
      <div style="margin-bottom: 16px;">
        <strong>Reference URL:</strong> <a href="${enquiry.referenceUrl}" target="_blank" style="color: var(--cyan); word-break: break-all;">${escapeHtml(enquiry.referenceUrl)}</a>
      </div>
    ` : ''}

    <div style="margin-bottom: 16px;">
      <strong>Project Description:</strong>
      <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; margin-top: 6px; white-space: pre-wrap; font-size: 0.9rem;">
        ${escapeHtml(enquiry.description)}
      </div>
    </div>

    ${enquiry.message ? `
      <div style="margin-bottom: 16px;">
        <strong>Additional Message:</strong>
        <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-top: 6px; font-size: 0.88rem;">
          ${escapeHtml(enquiry.message)}
        </div>
      </div>
    ` : ''}
  `;

  document.getElementById('enquiry-detail-modal').classList.add('active');
}

// Projects Management
async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects?all=true`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const { data } = await res.json();
    currentProjects = data || [];
    renderProjectsTable(currentProjects);
  } catch (err) {
    console.error('Error fetching projects', err);
  }
}

function renderProjectsTable(projects) {
  const tbody = document.getElementById('projects-table-body');
  if (!tbody) return;

  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 30px;">No projects found. Add your first project using the button above!</td></tr>`;
    return;
  }

  tbody.innerHTML = projects.map(p => `
    <tr>
      <td><strong>${escapeHtml(p.name)}</strong></td>
      <td><span class="status-pill status-contacted">${escapeHtml(p.category)}</span></td>
      <td>${(p.technologies || []).slice(0, 3).join(', ')}${(p.technologies || []).length > 3 ? '...' : ''}</td>
      <td><span class="status-pill ${p.status === 'Live' ? 'status-completed' : 'status-new'}">${escapeHtml(p.status || 'Showcase')}</span></td>
      <td>
        <button onclick="toggleProjectPublish('${p._id}', ${!p.isPublished})" class="action-btn" style="color: ${p.isPublished ? 'var(--emerald)' : 'var(--amber)'};">
          ${p.isPublished ? '● Published' : '○ Draft'}
        </button>
      </td>
      <td>
        <div class="action-btns">
          <button onclick="editProject('${p._id}')" class="action-btn" title="Edit">✏️ Edit</button>
          <button onclick="deleteProject('${p._id}')" class="action-btn delete" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function toggleProjectPublish(id, newState) {
  try {
    await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ isPublished: newState })
    });
    await loadProjects();
  } catch (err) {
    alert('Failed to update publish state');
  }
}

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;

  try {
    await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    await loadStats();
    await loadProjects();
  } catch (err) {
    alert('Failed to delete project');
  }
}

// Project Modal (Add / Edit)
function openAddProjectModal() {
  document.getElementById('project-form').reset();
  document.getElementById('project-id').value = '';
  document.getElementById('project-modal-title').textContent = 'Add New Showcase Project';
  document.getElementById('project-modal').classList.add('active');
}

function editProject(id) {
  const p = currentProjects.find(item => item._id === id);
  if (!p) return;

  document.getElementById('project-id').value = p._id;
  document.getElementById('project-name').value = p.name;
  document.getElementById('project-category').value = p.category;
  document.getElementById('project-description').value = p.description;
  document.getElementById('project-technologies').value = (p.technologies || []).join(', ');
  document.getElementById('project-image').value = p.image || '';
  document.getElementById('project-demo').value = p.liveDemoUrl || '';
  document.getElementById('project-github').value = p.githubUrl || 'Coming Soon';
  document.getElementById('project-status').value = p.status || 'Showcase Demo';

  document.getElementById('project-modal-title').textContent = 'Edit Project';
  document.getElementById('project-modal').classList.add('active');
}

// Save Project (POST or PUT)
document.addEventListener('DOMContentLoaded', () => {
  const projectForm = document.getElementById('project-form');
  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('project-id').value;
      const payload = {
        name: document.getElementById('project-name').value.trim(),
        category: document.getElementById('project-category').value,
        description: document.getElementById('project-description').value.trim(),
        technologies: document.getElementById('project-technologies').value.split(',').map(t => t.trim()).filter(Boolean),
        image: document.getElementById('project-image').value.trim(),
        liveDemoUrl: document.getElementById('project-demo').value.trim(),
        githubUrl: document.getElementById('project-github').value.trim() || 'Coming Soon',
        status: document.getElementById('project-status').value
      };

      try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/projects/${id}` : `${API_BASE}/projects`;

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to save project');
        }

        closeModals();
        await loadStats();
        await loadProjects();
      } catch (err) {
        alert(err.message);
      }
    });
  }
});

function closeModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================
// COUPON MANAGEMENT (CRYPTOGRAPHIC SYSTEM)
// ==========================================

let currentCoupons = [];

async function loadCoupons() {
  const tbody = document.getElementById('coupons-table-body');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/admin/coupons`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/admin-login';
        return;
      }
      throw new Error('Failed to load coupons');
    }

    const data = await res.json();
    currentCoupons = data.coupons || [];

    // Update coupon stats
    if (data.stats) {
      const elTotal = document.getElementById('stat-coupons-total');
      const elActive = document.getElementById('stat-coupons-active');
      const elRedemptions = document.getElementById('stat-coupons-redemptions');
      const elSavings = document.getElementById('stat-coupons-savings');

      if (elTotal) elTotal.textContent = data.stats.totalCoupons;
      if (elActive) elActive.textContent = data.stats.activeCoupons;
      if (elRedemptions) elRedemptions.textContent = data.stats.totalRedemptions;
      if (elSavings) elSavings.textContent = `₹${(data.stats.totalSavingsGiven || 0).toLocaleString('en-IN')}`;
    }

    renderCouponsTable(currentCoupons);
  } catch (err) {
    console.error('Error loading coupons:', err);
    tbody.innerHTML = `<tr><td colspan="7" style="color: #f87171; text-align: center; padding: 20px;">Failed to load coupons: ${escapeHtml(err.message)}</td></tr>`;
  }
}

function renderCouponsTable(coupons) {
  const tbody = document.getElementById('coupons-table-body');
  if (!tbody) return;

  if (!coupons || coupons.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: #94a3b8; padding: 32px;">
          No cryptographic coupons found. Click "+ Generate New Coupon" or view initial private seeds.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = coupons.map(c => {
    const isActive = c.active;
    const isExhausted = c.max_uses && c.used_count >= c.max_uses;
    const isExpired = c.expires_at && new Date(c.expires_at).getTime() < Date.now();
    
    let statusBadge = '<span class="badge badge-success" style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; padding: 4px 8px; border-radius: 6px; font-size: 0.78rem;">Active</span>';
    if (!isActive) {
      statusBadge = '<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; padding: 4px 8px; border-radius: 6px; font-size: 0.78rem;">Disabled</span>';
    } else if (isExhausted) {
      statusBadge = '<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid #f59e0b; padding: 4px 8px; border-radius: 6px; font-size: 0.78rem;">Exhausted</span>';
    } else if (isExpired) {
      statusBadge = '<span class="badge" style="background: rgba(148, 163, 184, 0.2); color: #94a3b8; border: 1px solid #94a3b8; padding: 4px 8px; border-radius: 6px; font-size: 0.78rem;">Expired</span>';
    }

    const discountColor = c.discount_percentage >= 90 ? '#a855f7' : (c.discount_percentage >= 50 ? '#00f0ff' : '#10b981');
    const expiryText = c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never';
    const restrictionText = c.user_restriction ? escapeHtml(c.user_restriction) : '<span style="color: #64748b;">Public / Any Client</span>';

    return `
      <tr>
        <td>
          <div style="font-family: \'JetBrains Mono\', monospace; font-weight: 700; color: #f1f5f9; letter-spacing: 1px;">
            ${escapeHtml(c.code_mask)}
          </div>
          ${c.notes ? `<div style="font-size: 0.78rem; color: #94a3b8; margin-top: 2px;">${escapeHtml(c.notes)}</div>` : ''}
        </td>
        <td>
          <span style="font-weight: 800; font-size: 1.1rem; color: ${discountColor};">
            ${c.discount_percentage}% OFF
          </span>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div style="font-family: \'JetBrains Mono\', monospace; font-size: 0.88rem;">
            <strong>${c.used_count || 0}</strong> / ${c.max_uses ? c.max_uses : '∞'}
          </div>
        </td>
        <td style="font-size: 0.85rem;">${restrictionText}</td>
        <td style="font-size: 0.85rem; color: #94a3b8;">${expiryText}</td>
        <td>
          <div class="action-btns" style="display: flex; gap: 6px;">
            <button onclick="toggleCouponStatus(\'${c._id}\')" class="action-btn" title="${isActive ? 'Deactivate' : 'Activate'}" style="padding: 4px 8px; font-size: 0.78rem;">
              ${isActive ? '⏸️ Pause' : '▶️ Enable'}
            </button>
            <button onclick="regenerateCoupon(\'${c._id}\')" class="action-btn" title="Regenerate random key" style="padding: 4px 8px; font-size: 0.78rem; background: rgba(0, 240, 255, 0.1); border-color: var(--cyan); color: var(--cyan);">
              🔄 Re-roll
            </button>
            <button onclick="revokeCoupon(\'${c._id}\')" class="action-btn delete" title="Permanently delete" style="padding: 4px 8px; font-size: 0.78rem;">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openGenerateCouponModal() {
  const form = document.getElementById('generate-coupon-form');
  if (form) form.reset();
  const modal = document.getElementById('generate-coupon-modal');
  if (modal) modal.classList.add('active');
}

async function handleGenerateCoupon(event) {
  event.preventDefault();

  const discount = Number(document.getElementById('gen-discount').value);
  const maxUses = Number(document.getElementById('gen-max-uses').value) || 1;
  const expiresAt = document.getElementById('gen-expires-at').value || null;
  const userRestriction = document.getElementById('gen-restriction').value.trim() || null;
  const notes = document.getElementById('gen-notes').value.trim() || null;

  try {
    const res = await fetch(`${API_BASE}/admin/coupons/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        discountPercentage: discount,
        maxUses,
        expiresAt,
        userRestriction,
        notes
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Coupon generation failed');

    closeModals();

    // Show One-Time Reveal Modal
    const revealModal = document.getElementById('reveal-coupon-modal');
    document.getElementById('reveal-raw-code').textContent = data.rawCode;
    document.getElementById('reveal-discount-badge').textContent = `${data.coupon.discount_percentage}% Discount | Mask: ${data.coupon.code_mask} | Max Uses: ${data.coupon.max_uses}`;
    
    const copyBtn = document.getElementById('reveal-copy-btn');
    if (copyBtn) {
      copyBtn.textContent = '📋 Copy Code to Clipboard';
      copyBtn.disabled = false;
    }

    if (revealModal) revealModal.classList.add('active');

    await loadCoupons();
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

async function toggleCouponStatus(id) {
  try {
    const res = await fetch(`${API_BASE}/admin/coupons/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle status');
    await loadCoupons();
  } catch (err) {
    alert(err.message);
  }
}

async function regenerateCoupon(id) {
  if (!confirm('Are you sure you want to regenerate this coupon code? The old code will immediately stop working and a new cryptographically random code will be generated.')) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/admin/coupons/${id}/regenerate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to regenerate code');

    // Reveal new code
    const revealModal = document.getElementById('reveal-coupon-modal');
    document.getElementById('reveal-raw-code').textContent = data.rawCode;
    document.getElementById('reveal-discount-badge').textContent = `New Code for ${data.coupon.discount_percentage}% Discount | Mask: ${data.coupon.code_mask}`;
    
    const copyBtn = document.getElementById('reveal-copy-btn');
    if (copyBtn) {
      copyBtn.textContent = '📋 Copy Code to Clipboard';
      copyBtn.disabled = false;
    }

    if (revealModal) revealModal.classList.add('active');
    await loadCoupons();
  } catch (err) {
    alert(err.message);
  }
}

async function revokeCoupon(id) {
  if (!confirm('Are you sure you want to permanently delete/revoke this coupon? This action cannot be undone.')) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete coupon');
    await loadCoupons();
  } catch (err) {
    alert(err.message);
  }
}

async function viewPrivateSeedsModal() {
  const modal = document.getElementById('private-seeds-modal');
  const container = document.getElementById('private-seeds-list');
  if (!modal || !container) return;

  container.innerHTML = '<div style="color: #94a3b8; text-align: center; padding: 20px;">Loading private seeds...</div>';
  modal.classList.add('active');

  try {
    const res = await fetch(`${API_BASE}/admin/coupons/private-seeds`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to retrieve seeds');

    const seeds = data.seeds || [];
    if (seeds.length === 0) {
      container.innerHTML = '<div style="color: #94a3b8; text-align: center; padding: 12px;">No seeded private offers available.</div>';
      return;
    }

    container.innerHTML = seeds.map(s => {
      const color = s.discountPercentage >= 90 ? '#a855f7' : (s.discountPercentage >= 50 ? '#00f0ff' : '#10b981');
      return `
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-weight: 800; color: ${color}; font-size: 1rem;">${s.discountPercentage}% DISCOUNT</span>
              <span style="font-size: 0.75rem; color: #94a3b8; background: rgba(255, 255, 255, 0.05); padding: 2px 6px; border-radius: 4px;">${escapeHtml(s.tier || 'Offer')}</span>
            </div>
            <div style="font-family: \'JetBrains Mono\', monospace; font-weight: 700; color: #fff; font-size: 1.1rem; letter-spacing: 1px;">
              ${escapeHtml(s.rawCode)}
            </div>
            <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 2px;">
              ${escapeHtml(s.description || '')} (Max Uses: ${s.maxUses || 'Unlimited'})
            </div>
          </div>
          <button onclick="navigator.clipboard.writeText(\'${s.rawCode}\').then(() => alert(\'Copied ${s.rawCode} to clipboard!\'))" class="action-btn" style="background: rgba(0, 240, 255, 0.15); border-color: var(--cyan); color: var(--cyan); padding: 8px 14px; font-weight: 600; white-space: nowrap;">
            📋 Copy Code
          </button>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = `<div style="color: #f87171; text-align: center; padding: 12px;">${escapeHtml(err.message)}</div>`;
  }
}

function copyRevealedCode() {
  const codeEl = document.getElementById('reveal-raw-code');
  if (!codeEl) return;
  const code = codeEl.textContent.trim();
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('reveal-copy-btn');
    if (btn) btn.textContent = '✅ Copied to Clipboard!';
  }).catch(() => {
    prompt('Copy your coupon code:', code);
  });
}

// ==========================================
// PRODUCTS CMS & PRICING
// ==========================================
async function loadProductsCMS() {
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/products/admin/all`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error('Failed to load products');
    const data = await res.json();
    currentProducts = data.products || [];

    if (currentProducts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No products registered yet.</td></tr>';
      return;
    }

    tbody.innerHTML = currentProducts.map(p => {
      const isAptitude = p.type === 'aptitude' || p.category === 'Aptitude';
      const discount = isAptitude ? 30 : 50;
      const orig = Number(p.originalPrice) || 10000;
      const finalPrice = Math.round(orig * (1 - discount / 100));

      return `
        <tr>
          <td>
            <strong>${escapeHtml(p.name)}</strong>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(p.id)}</div>
          </td>
          <td>${escapeHtml(p.category || 'N/A')}</td>
          <td><span class="status-pill status-in-progress">${escapeHtml(p.platform || 'Cross-Platform')}</span></td>
          <td><del>₹${orig.toLocaleString('en-IN')}</del></td>
          <td>
            <strong style="color: var(--cyan);">₹${finalPrice.toLocaleString('en-IN')}</strong>
            <span style="font-size: 0.75rem; color: #10b981; margin-left: 4px;">(${discount}% OFF)</span>
          </td>
          <td>
            <span class="status-pill ${p.active !== false ? 'status-completed' : 'status-new'}">
              ${p.active !== false ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td>
            <button onclick="toggleProductActive('${p.id}', ${p.active === false})" class="action-btn" style="padding: 4px 8px; font-size: 0.75rem;">
              ${p.active !== false ? 'Deactivate' : 'Activate'}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color: #f87171; text-align: center;">${escapeHtml(err.message)}</td></tr>`;
  }
}

async function toggleProductActive(productId, makeActive) {
  try {
    const res = await fetch(`${API_BASE}/products/admin/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ active: makeActive })
    });
    if (!res.ok) throw new Error('Failed to update product state');
    await loadProductsCMS();
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

// Global Discount Rules
async function loadDiscountRules() {
  const appInput = document.getElementById('rule-app-discount');
  const aptInput = document.getElementById('rule-aptitude-discount');
  if (!appInput || !aptInput) return;

  try {
    const res = await fetch(`${API_BASE}/products/admin/discounts/rules`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.discountRules) {
      appInput.value = data.discountRules.appDefaultDiscount || 50;
      aptInput.value = data.discountRules.aptitudeDefaultDiscount || 30;
    }
  } catch (_) {}
}

async function handleUpdateDiscountRules(e) {
  e.preventDefault();
  const appDiscount = Number(document.getElementById('rule-app-discount').value);
  const aptitudeDiscount = Number(document.getElementById('rule-aptitude-discount').value);
  const fb = document.getElementById('discount-rules-feedback');
  if (fb) fb.innerHTML = '<span style="color: var(--cyan);">Updating rules...</span>';

  try {
    const res = await fetch(`${API_BASE}/products/admin/discounts/rules`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        appDefaultDiscount: appDiscount,
        aptitudeDefaultDiscount: aptitudeDiscount
      })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (fb) fb.innerHTML = '<span style="color: #10b981;">✓ Discount rules updated successfully!</span>';
      setTimeout(() => { if (fb) fb.innerHTML = ''; }, 3000);
      await loadProductsCMS();
    } else {
      if (fb) fb.innerHTML = `<span style="color: #f87171;">${data.message || 'Error updating rules'}</span>`;
    }
  } catch (err) {
    if (fb) fb.innerHTML = `<span style="color: #f87171;">${err.message}</span>`;
  }
}

// ==========================================
// SOFTWARE UPLOADS MANAGER
// ==========================================
async function loadSoftwareFiles() {
  const tbody = document.getElementById('files-table-body');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/downloads/history/all`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    const files = data.files || [];

    if (files.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No distribution packages uploaded yet.</td></tr>';
      return;
    }

    tbody.innerHTML = files.map(f => `
      <tr>
        <td><strong style="color: var(--cyan);">${escapeHtml(f.productId)}</strong></td>
        <td>${escapeHtml(f.originalName || f.filename)}</td>
        <td>${escapeHtml(f.fileSize || 'N/A')}</td>
        <td><span class="status-pill status-completed">${escapeHtml(f.version || 'v1.0.0')}</span></td>
        <td>${new Date(f.uploadedAt).toLocaleDateString()}</td>
        <td>
          <a href="/api/downloads/${f.productId}" target="_blank" class="action-btn" style="padding: 4px 10px; font-size: 0.75rem;">
            ⬇️ Test Download
          </a>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="color: #f87171; text-align: center;">${escapeHtml(err.message)}</td></tr>`;
  }
}

async function handleUploadPackage(e) {
  e.preventDefault();
  const productId = document.getElementById('upload-product-id').value;
  const version = document.getElementById('upload-version').value;
  const fileInput = document.getElementById('upload-file-input');
  const fb = document.getElementById('upload-feedback');
  const submitBtn = document.getElementById('upload-submit-btn');

  if (!fileInput.files || fileInput.files.length === 0) {
    alert('Please select a package binary file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('packageFile', fileInput.files[0]);
  formData.append('productId', productId);
  formData.append('version', version);

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading Package...';
  }
  if (fb) fb.innerHTML = '<span style="color: var(--cyan);">Uploading distribution package to secure repository...</span>';

  try {
    const res = await fetch(`${API_BASE}/downloads/admin/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (fb) fb.innerHTML = '<span style="color: #10b981;">✓ Package uploaded successfully and linked to customer downloads!</span>';
      fileInput.value = '';
      await loadSoftwareFiles();
    } else {
      if (fb) fb.innerHTML = `<span style="color: #f87171;">${data.message || 'Upload failed.'}</span>`;
    }
  } catch (err) {
    if (fb) fb.innerHTML = `<span style="color: #f87171;">Error: ${err.message}</span>`;
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Upload Binary Package 🚀';
    }
  }
}

// ==========================================
// ORDERS ROSTER
// ==========================================
async function loadOrdersRoster() {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    const orders = data.orders || [];

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No client orders confirmed yet.</td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><strong style="font-family: 'JetBrains Mono', monospace; color: var(--cyan);">${escapeHtml(o.orderId)}</strong></td>
        <td>
          <strong>${escapeHtml(o.clientName)}</strong>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(o.clientEmail)}</div>
          ${o.clientPhone ? `<div style="font-size: 0.75rem; color: #94a3b8;">${escapeHtml(o.clientPhone)}</div>` : ''}
        </td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(o.productName || o.productId)}</div>
          ${o.items && o.items.length > 1 ? `<div style="font-size: 0.75rem; color: var(--text-muted);">${o.items.length} items bundle</div>` : ''}
        </td>
        <td><del>₹${(o.originalPrice || 0).toLocaleString('en-IN')}</del></td>
        <td>
          <span style="color: #10b981;">-${o.productDiscountPercent || 50}%</span>
          ${o.couponCodeMask ? `<div style="font-size: 0.75rem; color: #a855f7;">Coupon (${escapeHtml(o.couponCodeMask)}) -${o.couponDiscountPercent}%</div>` : ''}
        </td>
        <td><strong style="color: var(--cyan); font-size: 1.05rem;">₹${(o.finalAmount || 0).toLocaleString('en-IN')}</strong></td>
        <td><span class="status-pill status-completed">${escapeHtml(o.status || 'Confirmed')}</span></td>
        <td style="font-size: 0.78rem; color: var(--text-muted);">${new Date(o.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" style="color: #f87171; text-align: center;">${escapeHtml(err.message)}</td></tr>`;
  }
}

// ==========================================
// DOWNLOADS AUDIT LOG
// ==========================================
async function loadDownloadsAudit() {
  const tbody = document.getElementById('downloads-table-body');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/downloads/history/all`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    const downloads = data.downloads || [];

    if (downloads.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No package downloads recorded yet.</td></tr>';
      return;
    }

    tbody.innerHTML = downloads.slice(-50).reverse().map(d => `
      <tr>
        <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;">${d._id ? d._id.slice(0, 8) : 'LOG'}...</td>
        <td><strong style="color: var(--cyan);">${escapeHtml(d.productId)}</strong></td>
        <td>${escapeHtml(d.filename || 'N/A')}</td>
        <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.82rem;">${escapeHtml(d.ip || '127.0.0.1')}</td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${new Date(d.downloadedAt).toLocaleString()}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color: #f87171; text-align: center;">${escapeHtml(err.message)}</td></tr>`;
  }
}

