/**
 * HARSH DEVELOPER — FORM VALIDATION & ENQUIRY PIPELINE
 */

document.addEventListener('DOMContentLoaded', () => {
  const enquiryForm = document.getElementById('enquiry-form');
  const serviceSelect = document.getElementById('form-service');
  const statusMsgBox = document.getElementById('form-status-msg');

  // 1. Auto-select service from URL parameter (e.g. ?service=AI+Integration)
  if (serviceSelect) {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
      const decodedService = decodeURIComponent(serviceParam);
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase() === decodedService.toLowerCase() ||
            serviceSelect.options[i].text.toLowerCase() === decodedService.toLowerCase()) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  // 2. Global helper to pre-fill service from buttons
  window.requestService = function (serviceName) {
    const targetUrl = window.location.pathname.includes('contact') 
      ? `#contact-form-section` 
      : `/contact?service=${encodeURIComponent(serviceName)}`;

    if (window.location.pathname.includes('contact') || document.getElementById('enquiry-form')) {
      if (serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.toLowerCase() === serviceName.toLowerCase() ||
              serviceSelect.options[i].text.toLowerCase() === serviceName.toLowerCase()) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
      const formEl = document.getElementById('enquiry-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('form-name');
        if (nameInput) nameInput.focus();
      }
    } else {
      window.location.href = `/contact?service=${encodeURIComponent(serviceName)}`;
    }
  };

  // 3. Form Submission Handler
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const origBtnText = submitBtn ? submitBtn.innerHTML : 'Send Project Request';

      // Clear previous status
      if (statusMsgBox) {
        statusMsgBox.className = 'form-status-msg';
        statusMsgBox.style.display = 'none';
        statusMsgBox.textContent = '';
      }

      // Extract form values
      const formData = {
        name: (document.getElementById('form-name')?.value || '').trim(),
        email: (document.getElementById('form-email')?.value || '').trim(),
        phone: (document.getElementById('form-phone')?.value || '').trim(),
        whatsapp: (document.getElementById('form-whatsapp')?.value || '').trim(),
        service: (document.getElementById('form-service')?.value || '').trim(),
        budget: (document.getElementById('form-budget')?.value || '').trim(),
        projectType: (document.getElementById('form-type')?.value || '').trim(),
        deadline: (document.getElementById('form-deadline')?.value || '').trim(),
        referenceUrl: (document.getElementById('form-ref')?.value || '').trim(),
        description: (document.getElementById('form-desc')?.value || '').trim(),
        message: (document.getElementById('form-notes')?.value || '').trim()
      };

      // Client-side Validation Checks
      if (!formData.name || formData.name.length < 2) {
        showError('Please enter your full name (minimum 2 characters).');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) {
        showError('Please enter a valid email address.');
        return;
      }

      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 7) {
        showError('Please enter a valid contact phone number with country code (min 7 digits).');
        return;
      }

      if (!formData.service) {
        showError('Please select a service category.');
        return;
      }

      if (!formData.description || formData.description.length < 10) {
        showError('Please provide a brief project description (at least 10 characters).');
        return;
      }

      if (formData.referenceUrl) {
        try {
          new URL(formData.referenceUrl);
        } catch (_) {
          showError('Reference URL must start with http:// or https://');
          return;
        }
      }

      // Disable button during submission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          Submitting Request...
        `;
      }

      try {
        const response = await ApiService.submitEnquiry(formData);

        // Success state
        enquiryForm.reset();
        if (statusMsgBox) {
          statusMsgBox.className = 'form-status-msg success';
          statusMsgBox.style.display = 'block';
          statusMsgBox.innerHTML = `
            <strong>Enquiry Received!</strong><br/>
            ${response.message}
          `;
        }
        showToast('Your project request was sent successfully! Harshit will get in touch shortly.', 'success');
      } catch (err) {
        showError(err.message || 'Failed to submit enquiry. Please try again or WhatsApp Harshit directly.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnText;
        }
      }
    });
  }

  function showError(msg) {
    if (statusMsgBox) {
      statusMsgBox.className = 'form-status-msg error';
      statusMsgBox.style.display = 'block';
      statusMsgBox.textContent = msg;
    }
    showToast(msg, 'error');
  }
});
