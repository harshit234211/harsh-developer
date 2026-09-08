/**
 * DEVCRAFT STUDIO — CLIENT-SIDE AUTHENTICATION ENGINE
 * Manages reactive login/register/logout, session tokens, protected routes,
 * navbar states, and user profile sync across all pages.
 */

const DevCraftAuth = (() => {
  const API_BASE = '/api/users';
  const TOKEN_KEY = 'devcraft_user_token';
  const USER_KEY = 'devcraft_user_profile';

  let currentUser = null;
  const authListeners = [];

  function init() {
    loadCachedUser();
    updateNavbarUI();
    verifySession();

    // Listen for multi-tab auth updates
    window.addEventListener('storage', (e) => {
      if (e.key === TOKEN_KEY || e.key === USER_KEY) {
        loadCachedUser();
        updateNavbarUI();
        notifyListeners();
      }
    });
  }

  function loadCachedUser() {
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      if (raw) currentUser = JSON.parse(raw);
    } catch (_) {
      currentUser = null;
    }
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  }

  function getUser() {
    return currentUser;
  }

  function isAuthenticated() {
    return Boolean(getToken() && currentUser);
  }

  async function verifySession() {
    const token = getToken();
    if (!token) {
      currentUser = null;
      updateNavbarUI();
      return null;
    }

    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        currentUser = data.user;
        if (localStorage.getItem(TOKEN_KEY)) {
          localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        } else {
          sessionStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        }
        updateNavbarUI();
        notifyListeners();
        return currentUser;
      } else if (res.status === 401) {
        // Session expired
        clearClientSession();
        updateNavbarUI();
        notifyListeners();
      }
    } catch (err) {
      console.warn('Session verification offline or paused:', err.message);
    }
    return currentUser;
  }

  function setSession(token, user, rememberMe = false) {
    currentUser = user;
    const storage = rememberMe ? localStorage : sessionStorage;
    
    // Clear opposite storage to prevent collisions
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));

    updateNavbarUI();
    notifyListeners();
  }

  function clearClientSession() {
    currentUser = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  async function login(email, password, rememberMe = false) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed. Please verify credentials.');
    }

    setSession(data.token, data.user, rememberMe);
    return data;
  }

  async function register(payload) {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed.');
    }

    setSession(data.token, data.user, false);
    return data;
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/logout`, { method: 'POST' });
    } catch (_) {}

    clearClientSession();
    updateNavbarUI();
    notifyListeners();

    // If on a protected route, redirect to home/login
    const protectedPaths = ['/dashboard', '/profile', '/settings', '/my-projects', '/saved-demos'];
    const currentPath = window.location.pathname.toLowerCase();
    if (protectedPaths.some(p => currentPath.startsWith(p))) {
      window.location.href = '/login';
    } else {
      window.location.reload();
    }
  }

  function updateNavbarUI() {
    const loggedOutEls = document.querySelectorAll('.auth-logged-out, .auth-group-logged-out');
    const loggedInEls = document.querySelectorAll('.auth-logged-in, .auth-group-logged-in');
    const nameEls = document.querySelectorAll('.nav-user-name, #nav-user-name');
    const initialsEls = document.querySelectorAll('.nav-user-initials, #nav-user-initials');

    const authed = isAuthenticated();

    loggedOutEls.forEach(el => {
      el.style.display = authed ? 'none' : (el.classList.contains('nav-link-item') ? 'inline-block' : 'flex');
    });

    loggedInEls.forEach(el => {
      el.style.display = authed ? (el.classList.contains('nav-link-item') ? 'inline-block' : 'flex') : 'none';
    });

    if (authed && currentUser) {
      const name = currentUser.name || 'User';
      const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

      nameEls.forEach(el => { el.textContent = name; });
      initialsEls.forEach(el => { el.textContent = initials; });
    }

    // Auto-prefill contact inquiry form if present on page
    autoPrefillContactForm();
  }

  function autoPrefillContactForm() {
    if (!isAuthenticated() || !currentUser) return;
    const nameInput = document.getElementById('name') || document.querySelector('input[name="name"]');
    const emailInput = document.getElementById('email') || document.querySelector('input[name="email"]');
    const phoneInput = document.getElementById('phone') || document.querySelector('input[name="phone"]');

    if (nameInput && !nameInput.value) nameInput.value = currentUser.name || '';
    if (emailInput && !emailInput.value) emailInput.value = currentUser.email || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = currentUser.phone || '';
  }

  function protectRoute() {
    if (!isAuthenticated()) {
      const currentUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
      return false;
    }
    return true;
  }

  function redirectIfAuthenticated(defaultUrl = '/dashboard') {
    if (isAuthenticated()) {
      const params = new URLSearchParams(window.location.search);
      const target = params.get('redirect') || defaultUrl;
      window.location.href = target;
      return true;
    }
    return false;
  }

  function onAuthChange(callback) {
    authListeners.push(callback);
  }

  function notifyListeners() {
    authListeners.forEach(cb => {
      try { cb(currentUser); } catch (e) { console.error(e); }
    });
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    getToken,
    getUser,
    isAuthenticated,
    login,
    register,
    logout,
    verifySession,
    updateNavbarUI,
    protectRoute,
    redirectIfAuthenticated,
    onAuthChange
  };
})();

window.DevCraftAuth = DevCraftAuth;
