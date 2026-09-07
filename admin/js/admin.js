/**
 * HARSH DEVELOPER — ADMIN DASHBOARD JAVASCRIPT
 */

const API_BASE = '/api';
let authToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
let currentEnquiries = [];
let currentProjects = [];

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
