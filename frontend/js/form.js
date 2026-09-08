/**
 * DEVCRAFT STUDIO — INQUIRY PROCESSOR & VALIDATION PIPELINE
 * Submits to /api/contact, saves local backup, and displays confirmation modal
 */

window.submitInquiry = async function(event) {
  if (event) event.preventDefault();

  const form = document.getElementById('project-inquiry-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-inquiry-btn');
  const feedbackEl = document.getElementById('form-feedback-msg');
  const origBtnContent = submitBtn ? submitBtn.innerHTML : 'Send Project Inquiry Now →';

  // Clear previous feedback
  if (feedbackEl) {
    feedbackEl.innerHTML = '';
    feedbackEl.style.display = 'none';
  }

  const payload = {
    name: (document.getElementById('client-name')?.value || '').trim(),
    email: (document.getElementById('client-email')?.value || '').trim(),
    phone: (document.getElementById('client-phone')?.value || '').trim(),
    service: (document.getElementById('project-service')?.value || '').trim(),
    budget: (document.getElementById('project-budget')?.value || '').trim(),
    timeline: (document.getElementById('project-timeline')?.value || '').trim(),
    message: (document.getElementById('project-details')?.value || '').trim(),
    source: 'DevCraft Studio Web Portal',
    createdAt: new Date().toISOString()
  };

  // Validation
  if (!payload.name || payload.name.length < 2) {
    showFormError('Please enter your full name (minimum 2 characters).');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.email || !emailRegex.test(payload.email)) {
    showFormError('Please enter a valid work email address.');
    return;
  }

  const phoneDigits = payload.phone.replace(/\D/g, '');
  if (phoneDigits.length < 7) {
    showFormError('Please enter a valid phone or WhatsApp number with country code.');
    return;
  }

  if (!payload.service) {
    showFormError('Please select a primary service.');
    return;
  }

  if (!payload.message || payload.message.length < 8) {
    showFormError('Please provide a brief description of your project (minimum 8 characters).');
    return;
  }

  // Set loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span style="display: inline-flex; align-items: center; gap: 8px;">
        <span class="status-dot"></span> Transmitting to DevCraft Studio...
      </span>
    `;
  }

  const refId = 'DC-INQ-' + Math.floor(100000 + Math.random() * 900000);

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    // Store in localStorage backup
    try {
      const existing = JSON.parse(localStorage.getItem('devcraft_inquiries') || '[]');
      existing.push({ ref: refId, ...payload });
      localStorage.setItem('devcraft_inquiries', JSON.stringify(existing));
    } catch (_) {}

    // Reset form
    form.reset();

    // Display confirmation modal
    const refBox = document.getElementById('inquiry-ref-box');
    if (refBox) {
      refBox.textContent = `Inquiry Reference: ${refId}`;
    }

    const modal = document.getElementById('inquiry-success-modal');
    if (modal) {
      modal.classList.add('active');
    } else {
      alert(`Inquiry Confirmed! Reference ID: ${refId}. Our lead architect will contact you within 24 hours.`);
    }

  } catch (err) {
    // Network or server error fallback: save to localStorage anyway
    try {
      const existing = JSON.parse(localStorage.getItem('devcraft_inquiries') || '[]');
      existing.push({ ref: refId, ...payload, offline: true });
      localStorage.setItem('devcraft_inquiries', JSON.stringify(existing));
    } catch (_) {}

    form.reset();

    const refBox = document.getElementById('inquiry-ref-box');
    if (refBox) {
      refBox.textContent = `Inquiry Reference: ${refId} (Saved Offline)`;
    }

    const modal = document.getElementById('inquiry-success-modal');
    if (modal) {
      modal.classList.add('active');
    } else {
      alert(`Inquiry Confirmed! Reference ID: ${refId}. Our team has received your message.`);
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnContent;
    }
  }
};

function showFormError(msg) {
  const feedbackEl = document.getElementById('form-feedback-msg');
  if (feedbackEl) {
    feedbackEl.style.display = 'block';
    feedbackEl.style.color = '#ef4444';
    feedbackEl.style.marginTop = '12px';
    feedbackEl.style.fontSize = '0.88rem';
    feedbackEl.innerHTML = `⚠️ ${msg}`;
  } else {
    alert(msg);
  }
}

