/**
 * HARSH DEVELOPER — API CLIENT & TOAST NOTIFICATION SERVICE
 */

const API_BASE = '/api';

// Toast Notification Manager
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconSvg = type === 'success'
    ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div>
      <div style="font-weight: 600; margin-bottom: 2px;">${type === 'success' ? 'Success' : 'Notice'}</div>
      <div style="font-size: 0.88rem; color: #cbd5e1;">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

// REST Endpoints
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({
      success: false,
      message: 'Server returned an invalid response.'
    }));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

// Specific API Services
const ApiService = {
  getProjects: async (category = 'All') => {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return await apiRequest(`/projects${query}`);
  },

  submitEnquiry: async (formData) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  },

  getDeveloperInfo: async () => {
    return await apiRequest('/developer');
  },

  getHealth: async () => {
    return await apiRequest('/health');
  }
};

window.showToast = showToast;
window.ApiService = ApiService;
