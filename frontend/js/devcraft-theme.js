/**
 * DEVCRAFT STUDIO — Theme Controller (devcraft-theme.js)
 * Supports: 'devcraft-light' (Light), 'devcraft-dark' (Dark), and 'system' (Auto OS)
 * Persistent via localStorage with zero flash of incorrect theme (FOUC).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'devcraft_theme';

  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'devcraft-light';
    }
    return 'devcraft-dark';
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'devcraft-dark';
    } catch (_) {
      return 'devcraft-dark';
    }
  }

  function resolveTheme(preference) {
    if (preference === 'system') {
      return getSystemPreference();
    }
    if (preference === 'light' || preference === 'devcraft-light') {
      return 'devcraft-light';
    }
    return 'devcraft-dark';
  }

  function applyTheme(preference) {
    var effectiveTheme = resolveTheme(preference);
    var doc = document.documentElement;

    doc.setAttribute('data-theme', effectiveTheme);
    doc.setAttribute('data-theme-preference', preference);
    if (document.body) {
      document.body.setAttribute('data-theme', effectiveTheme);
    }

    // Update any UI toggle buttons
    updateToggleButtons(preference, effectiveTheme);

    // Dispatch event for any interactive components (charts, 3D canvases, etc.)
    try {
      window.dispatchEvent(new CustomEvent('devcraft:theme-change', {
        detail: { preference: preference, effectiveTheme: effectiveTheme }
      }));
    } catch (_) {}
  }

  function updateToggleButtons(preference, effectiveTheme) {
    var buttons = document.querySelectorAll('.devcraft-theme-toggle');
    buttons.forEach(function (btn) {
      var isDark = effectiveTheme === 'devcraft-dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      
      var icon = btn.querySelector('.theme-toggle-icon');
      if (icon) {
        if (isDark) {
          // Render Sun icon
          icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        } else {
          // Render Moon icon
          icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
      }
    });
  }

  function setTheme(preference) {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch (_) {}
    applyTheme(preference);
  }

  function toggleTheme() {
    var currentPref = getSavedTheme();
    var effectiveTheme = resolveTheme(currentPref);
    var nextTheme = (effectiveTheme === 'devcraft-dark') ? 'devcraft-light' : 'devcraft-dark';
    setTheme(nextTheme);
  }

  // Initial early execution
  var initialPref = getSavedTheme();
  applyTheme(initialPref);

  // Listen for system theme changes if set to 'system'
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (getSavedTheme() === 'system') {
        applyTheme('system');
      }
    });
  }

  // Re-sync on DOM ready to bind buttons and body attributes
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getSavedTheme());

    document.addEventListener('click', function (e) {
      var toggleBtn = e.target.closest('.devcraft-theme-toggle');
      if (toggleBtn) {
        e.preventDefault();
        toggleTheme();
      }
    });
  });

  window.DevCraftTheme = {
    getTheme: getSavedTheme,
    getEffectiveTheme: function () { return resolveTheme(getSavedTheme()); },
    setTheme: setTheme,
    toggleTheme: toggleTheme
  };
})();
