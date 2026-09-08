/**
 * DEVCRAFT - Universal Pricing, Discount, Coupon & Sharing Engine
 * Handles 50% App Discount, 30% Aptitude Discount, Cryptographic Coupons,
 * WhatsApp/Telegram/Twitter/CopyLink Sharing, and Server-Authoritative Checkout.
 */

window.devcraftShop = (function() {
  'use strict';

  let currentProductId = null;
  let appliedCouponCode = '';
  let cachedCalculation = null;

  function getProduct(productId) {
    const products = window.DEVCRAFT_PRODUCTS_DATA || [];
    return products.find(p => p.id === productId) || null;
  }

  function formatCurrency(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
  }

  function showToast(message, duration = 3000) {
    let toast = document.getElementById('devcraft-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'devcraft-toast';
      toast.className = 'devcraft-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // ==========================================
  // 1. PRODUCT DETAIL MODAL (Requirement 9)
  // ==========================================
  function openProductModal(productId) {
    const p = getProduct(productId);
    if (!p) return;
    currentProductId = productId;

    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('product-detail-modal-body');
    if (!modal || !content) return;

    const isAptitude = p.type === 'aptitude' || p.category === 'Aptitude';
    const discountPercent = isAptitude ? 30 : 50;
    const originalPrice = Number(p.originalPrice) || 10000;
    const finalPrice = Math.round(originalPrice * (1 - discountPercent / 100));

    content.innerHTML = `
      <div class="product-modal-header">
        <div class="product-badges-row">
          <span class="product-cat-tag">${p.category}</span>
          <span class="product-discount-pill ${isAptitude ? 'pill-aptitude' : 'pill-app'}">
            ⚡ ${discountPercent}% OFF
          </span>
        </div>
        <h2 class="product-modal-title">${p.name}</h2>
        <p class="product-modal-desc">${p.detailedDesc || p.shortDesc}</p>
      </div>

      <div class="product-pricing-hero-box">
        <div class="price-breakdown-row">
          <div class="price-strike-wrap">
            <span class="price-label">Original Price:</span>
            <del class="price-original">${formatCurrency(originalPrice)}</del>
          </div>
          <div class="price-discount-tag">
            <span>Special Offer:</span>
            <strong>${discountPercent}% DISCOUNT</strong>
          </div>
          <div class="price-final-wrap">
            <span class="price-label">Current Final Price:</span>
            <span class="price-final text-gradient">${formatCurrency(finalPrice)}</span>
          </div>
        </div>
      </div>

      <div class="product-modal-body-grid">
        <div class="product-modal-col">
          <h4>Key Included Features</h4>
          <ul class="product-features-list">
            ${(p.features || []).map(f => `<li><span class="check-icon">✓</span> ${f}</li>`).join('')}
          </ul>
        </div>
        <div class="product-modal-col">
          <h4>Technologies &amp; Frameworks</h4>
          <div class="product-tech-tags">
            ${(p.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          ${p.rating ? `<div class="product-rating-box">Rating: <strong>${p.rating}</strong></div>` : ''}
        </div>
      </div>

      <div class="product-modal-actions">
        <button class="btn btn-primary" onclick="devcraftShop.openCheckoutModal('${p.id}')">
          ⚡ Buy / Start Project (${formatCurrency(finalPrice)}) →
        </button>
        <button class="btn btn-outline" onclick="devcraftShop.openCheckoutModal('${p.id}', true)">
          🎟️ Apply Coupon Code
        </button>
        <button class="btn btn-ghost" onclick="devcraftShop.openShareModal('${p.id}')">
          🔗 Share
        </button>
      </div>
    `;

    modal.classList.add('active');
  }

  // ==========================================
  // 2. SHARE SYSTEM (Requirements 5, 6, 7, 8)
  // ==========================================
  function openShareModal(productId) {
    const p = getProduct(productId);
    if (!p) return;
    currentProductId = productId;

    const modal = document.getElementById('share-product-modal');
    const content = document.getElementById('share-product-modal-body');
    if (!modal || !content) return;

    const isAptitude = p.type === 'aptitude' || p.category === 'Aptitude';
    const discountPercent = isAptitude ? 30 : 50;
    const originalPrice = Number(p.originalPrice) || 10000;
    const finalPrice = Math.round(originalPrice * (1 - discountPercent / 100));

    // Construct Product URL
    const baseUrl = window.location.origin || 'https://harsh-developer.onrender.com';
    const productUrl = `${baseUrl}/services?product=${encodeURIComponent(p.id)}`;

    // Build pre-filled sharing message strictly matching requirement 6:
    const shareMessage = `Check out ${p.name} on DevCraft.\nOriginal Price: ${formatCurrency(originalPrice)}\nCurrent Offer: ${discountPercent}% OFF\nFinal Price: ${formatCurrency(finalPrice)}\nView: ${productUrl}`;

    // WhatsApp URL
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    // Telegram URL
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Check out ${p.name} on DevCraft! (${discountPercent}% OFF)`)}`;
    // X / Twitter URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;

    content.innerHTML = `
      <div class="share-preview-card">
        <div class="share-product-title">${p.name}</div>
        <div class="share-price-row">
          <del>${formatCurrency(originalPrice)}</del>
          <span class="share-pill">${discountPercent}% OFF</span>
          <strong class="share-final">${formatCurrency(finalPrice)}</strong>
        </div>
      </div>

      <div class="share-options-list">
        <!-- WhatsApp Share (Requirement 6) -->
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="share-btn share-whatsapp" onclick="devcraftShop.trackShare('${p.id}', 'whatsapp')">
          <span class="share-icon">🟢</span>
          <div class="share-btn-text">
            <strong>Share on WhatsApp</strong>
            <small>Direct message with auto-calculated prices</small>
          </div>
        </a>

        <!-- Copy Link (Requirement 7) -->
        <button type="button" class="share-btn share-copy" onclick="devcraftShop.copyShareLink('${productUrl}', '${p.id}')">
          <span class="share-icon">📋</span>
          <div class="share-btn-text">
            <strong>Copy Link</strong>
            <small>Share anywhere with direct link</small>
          </div>
        </button>

        <!-- Native Share Sheet (Requirement 5) -->
        ${navigator.share ? `
        <button type="button" class="share-btn share-native" onclick="devcraftShop.triggerNativeShare('${p.name.replace(/'/g, "\\'")}', '${p.shortDesc.replace(/'/g, "\\'")}', '${productUrl}', '${shareMessage.replace(/'/g, "\\'")}', '${p.id}')">
          <span class="share-icon">📱</span>
          <div class="share-btn-text">
            <strong>Native Device Share</strong>
            <small>Open system share sheet (AirDrop, Messages, etc.)</small>
          </div>
        </button>
        ` : ''}

        <!-- Telegram -->
        <a href="${telegramUrl}" target="_blank" rel="noopener noreferrer" class="share-btn share-telegram" onclick="devcraftShop.trackShare('${p.id}', 'telegram')">
          <span class="share-icon">✈️</span>
          <div class="share-btn-text">
            <strong>Share on Telegram</strong>
            <small>Send to Telegram contacts &amp; channels</small>
          </div>
        </a>

        <!-- Twitter / X -->
        <a href="${twitterUrl}" target="_blank" rel="noopener noreferrer" class="share-btn share-twitter" onclick="devcraftShop.trackShare('${p.id}', 'twitter')">
          <span class="share-icon">✖️</span>
          <div class="share-btn-text">
            <strong>Post on X (Twitter)</strong>
            <small>Broadcast offer to your network</small>
          </div>
        </a>
      </div>
    `;

    modal.classList.add('active');
  }

  function copyShareLink(url, productId) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied successfully.');
        trackShare(productId, 'copy_link');
      }).catch(() => {
        prompt('Copy product link:', url);
        trackShare(productId, 'copy_link');
      });
    } else {
      prompt('Copy product link:', url);
      trackShare(productId, 'copy_link');
    }
  }

  function triggerNativeShare(title, desc, url, fullText, productId) {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: fullText,
        url: url
      }).then(() => {
        trackShare(productId, 'native');
      }).catch(err => {
        if (err.name !== 'AbortError') {
          console.log('Share canceled or failed', err);
        }
      });
    }
  }

  // Requirement 8: Share Tracking
  function trackShare(productId, platform) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('devcraft_user_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      fetch('/api/analytics/share', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: productId || currentProductId,
          sharePlatform: platform
        })
      }).catch(() => {});
    } catch (_) {}
  }

  // ==========================================
  // 3. CHECKOUT & COUPON MODAL (Requirements 3, 4, 10)
  // ==========================================
  async function openCheckoutModal(productId, focusCoupon = false) {
    const p = getProduct(productId);
    if (!p) return;
    currentProductId = productId;
    appliedCouponCode = '';

    const modal = document.getElementById('checkout-order-modal');
    if (!modal) return;

    // Hide product detail modal if open
    hideModal('product-detail-modal');

    // Pre-fill user details if logged in (Requirement 10)
    let clientName = '';
    let clientEmail = '';
    let clientPhone = '';
    if (window.DevCraftAuth && DevCraftAuth.isAuthenticated()) {
      const u = DevCraftAuth.getUser() || {};
      clientName = u.name || '';
      clientEmail = u.email || '';
      clientPhone = u.phone || '';
    }

    renderCheckoutUI(p, clientName, clientEmail, clientPhone);
    modal.classList.add('active');

    // Fetch authoritative initial calculation
    await recalculateOrderPrice('');

    if (focusCoupon) {
      setTimeout(() => {
        const inp = document.getElementById('checkout-coupon-input');
        if (inp) {
          inp.focus();
          inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }

  function renderCheckoutUI(product, name = '', email = '', phone = '') {
    const container = document.getElementById('checkout-order-modal-body');
    if (!container) return;

    const isAptitude = product.type === 'aptitude' || product.category === 'Aptitude';
    const discountPercent = isAptitude ? 30 : 50;

    container.innerHTML = `
      <div class="checkout-product-summary">
        <div class="checkout-summary-left">
          <span class="product-cat-tag">${product.category}</span>
          <h3 class="checkout-prod-title">${product.name}</h3>
          <p class="checkout-prod-desc">${product.shortDesc}</p>
        </div>
        <div class="checkout-summary-right">
          <div class="checkout-badge-pill ${isAptitude ? 'pill-aptitude' : 'pill-app'}">
            ${discountPercent}% Product Discount
          </div>
        </div>
      </div>

      <!-- Live Calculation Breakdown (Requirement 3 & 4) -->
      <div class="checkout-calc-card" id="checkout-calc-container">
        <div class="calc-loading">Calculating server-authoritative pricing...</div>
      </div>

      <!-- Coupon Code Section (Requirement 3) -->
      <div class="coupon-input-section">
        <label class="coupon-label">Have a coupon code?</label>
        <div class="coupon-input-wrap">
          <input type="text" id="checkout-coupon-input" class="coupon-input" placeholder="Enter coupon code (e.g. DEV-XXXX-XXXX-XXXX)" autocomplete="off" />
          <button type="button" id="checkout-coupon-apply-btn" class="btn btn-outline btn-sm" onclick="devcraftShop.applyCoupon()">
            Apply
          </button>
        </div>
        <div id="checkout-coupon-feedback" class="coupon-feedback-box" style="display: none;"></div>
      </div>

      <!-- Client Contact Form (Auto-prefilled if logged in) -->
      <form id="checkout-form" onsubmit="devcraftShop.submitCheckout(event)">
        <div class="checkout-form-grid">
          <div class="form-group">
            <label class="input-label">Full Name *</label>
            <input type="text" id="checkout-client-name" class="form-control" value="${escapeHtml(name)}" placeholder="Johnathan Vance" required />
          </div>
          <div class="form-group">
            <label class="input-label">Email Address *</label>
            <input type="email" id="checkout-client-email" class="form-control" value="${escapeHtml(email)}" placeholder="name@company.com" required />
          </div>
        </div>

        <div class="checkout-form-grid">
          <div class="form-group">
            <label class="input-label">Contact Phone / WhatsApp</label>
            <input type="tel" id="checkout-client-phone" class="form-control" value="${escapeHtml(phone)}" placeholder="+91 98765 43210" />
          </div>
          <div class="form-group">
            <label class="input-label">Project / Onboarding Notes (Optional)</label>
            <input type="text" id="checkout-client-notes" class="form-control" placeholder="Any specific requirements or start date" />
          </div>
        </div>

        <div class="checkout-submit-row">
          <button type="submit" id="checkout-submit-btn" class="btn btn-primary btn-block btn-lg">
            Complete Order &amp; Confirm Booking →
          </button>
        </div>
      </form>
    `;
  }

  async function recalculateOrderPrice(couponCode = '') {
    const calcContainer = document.getElementById('checkout-calc-container');
    const feedback = document.getElementById('checkout-coupon-feedback');
    const emailInput = document.getElementById('checkout-client-email');
    const clientEmail = emailInput ? emailInput.value.trim() : '';

    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('devcraft_user_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders/calculate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: currentProductId,
          couponCode: couponCode || null,
          email: clientEmail
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (feedback) {
          feedback.textContent = data.message || 'Invalid or expired coupon code.';
          feedback.className = 'coupon-feedback-box error';
          feedback.style.display = 'block';
        }
        return;
      }

      cachedCalculation = data.calculation;
      appliedCouponCode = data.calculation.couponApplied ? couponCode : '';

      // Update feedback box
      if (feedback) {
        if (data.calculation.couponApplied) {
          feedback.innerHTML = `
            <span style="color: #10b981; font-weight: 600;">✓ Coupon applied successfully: ${data.calculation.couponDiscountPercent}% additional discount!</span>
            <button type="button" class="btn-remove-coupon" onclick="devcraftShop.removeCoupon()">[ Remove Coupon ]</button>
          `;
          feedback.className = 'coupon-feedback-box success';
          feedback.style.display = 'flex';
        } else if (data.calculation.couponError) {
          feedback.textContent = data.calculation.couponError;
          feedback.className = 'coupon-feedback-box error';
          feedback.style.display = 'block';
        } else {
          feedback.style.display = 'none';
        }
      }

      // Render Calculation Card (Requirement 3 & 4: Original -> Product Disc -> Coupon Disc -> Final)
      const c = data.calculation;
      if (calcContainer) {
        calcContainer.innerHTML = `
          <div class="calc-row">
            <span class="calc-label">Original Price:</span>
            <span class="calc-val-original">${formatCurrency(c.originalPrice)}</span>
          </div>
          <div class="calc-row text-discount">
            <span class="calc-label">Product Discount (${c.productDiscountPercent}% OFF):</span>
            <span class="calc-val-discount">- ${formatCurrency(c.productDiscountAmount)}</span>
          </div>
          <div class="calc-row calc-subtotal-row">
            <span class="calc-label">Subtotal after Product Discount:</span>
            <span class="calc-val-subtotal">${formatCurrency(c.discountedPrice)}</span>
          </div>
          ${c.couponApplied ? `
          <div class="calc-row text-coupon">
            <span class="calc-label">Coupon Discount (${c.couponDiscountPercent}% OFF - ${escapeHtml(c.couponCodeMask)}):</span>
            <span class="calc-val-coupon">- ${formatCurrency(c.couponDiscountAmount)}</span>
          </div>
          ` : ''}
          <div class="calc-row calc-total-row">
            <span class="calc-total-label">Final Payable Amount:</span>
            <span class="calc-total-val text-gradient">${formatCurrency(c.finalAmount)}</span>
          </div>
        `;
      }

      // Update button text
      const submitBtn = document.getElementById('checkout-submit-btn');
      if (submitBtn) {
        submitBtn.innerHTML = `Confirm &amp; Place Order (${formatCurrency(c.finalAmount)}) →`;
      }
    } catch (err) {
      if (feedback) {
        feedback.textContent = 'Failed to calculate price. Please check your network.';
        feedback.className = 'coupon-feedback-box error';
        feedback.style.display = 'block';
      }
    }
  }

  async function applyCoupon() {
    const input = document.getElementById('checkout-coupon-input');
    if (!input || !input.value.trim()) {
      const feedback = document.getElementById('checkout-coupon-feedback');
      if (feedback) {
        feedback.textContent = 'Please enter a coupon code.';
        feedback.className = 'coupon-feedback-box error';
        feedback.style.display = 'block';
      }
      return;
    }

    const code = input.value.trim();
    const btn = document.getElementById('checkout-coupon-apply-btn');
    if (btn) btn.disabled = true;

    await recalculateOrderPrice(code);

    if (btn) btn.disabled = false;
  }

  async function removeCoupon() {
    appliedCouponCode = '';
    const input = document.getElementById('checkout-coupon-input');
    if (input) input.value = '';
    await recalculateOrderPrice('');
  }

  async function submitCheckout(e) {
    e.preventDefault();

    const clientName = document.getElementById('checkout-client-name').value.trim();
    const clientEmail = document.getElementById('checkout-client-email').value.trim();
    const clientPhone = document.getElementById('checkout-client-phone').value.trim();
    const notes = document.getElementById('checkout-client-notes').value.trim();
    const submitBtn = document.getElementById('checkout-submit-btn');

    if (!clientName || !clientEmail) {
      alert('Please provide your name and email address.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Server Checkout...';

    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('devcraft_user_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: currentProductId,
          couponCode: appliedCouponCode || null,
          clientName,
          clientEmail,
          clientPhone,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Checkout failed.');
      }

      hideModal('checkout-order-modal');

      // Show Order Confirmation Modal
      showOrderSuccess(data.order);
    } catch (err) {
      alert(`Error during checkout: ${err.message}`);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Complete Order & Confirm Booking →';
    }
  }

  function showOrderSuccess(order) {
    const modal = document.getElementById('order-success-modal');
    const content = document.getElementById('order-success-modal-body');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align: center; padding: 20px 10px;">
        <div style="font-size: 3.5rem; margin-bottom: 12px;">🎉</div>
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 8px;">Order Confirmed!</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 20px;">
          Thank you for choosing <strong>DEVCRAFT</strong>. Your order has been securely registered with server-authoritative discount verification.
        </p>

        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px; text-align: left; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-secondary); font-size: 0.85rem;">Order Reference ID:</span>
            <strong style="font-family: var(--font-mono); color: var(--cyan);">${order.orderId}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-secondary); font-size: 0.85rem;">Product / Course:</span>
            <strong>${order.productName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-secondary); font-size: 0.85rem;">Original Price:</span>
            <del style="color: #94a3b8;">${formatCurrency(order.originalPrice)}</del>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #10b981;">
            <span style="font-size: 0.85rem;">Product Discount:</span>
            <strong>${order.productDiscountPercent}% OFF</strong>
          </div>
          ${order.couponCodeMask ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #a855f7;">
            <span style="font-size: 0.85rem;">Coupon (${order.couponCodeMask}):</span>
            <strong>${order.couponDiscountPercent}% OFF (- ${formatCurrency(order.couponDiscountAmount)})</strong>
          </div>
          ` : ''}
          <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700;">Final Amount Paid:</span>
            <span style="font-size: 1.3rem; font-weight: 800; color: var(--cyan);">${formatCurrency(order.finalAmount)}</span>
          </div>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="/dashboard" class="btn btn-primary" style="flex-grow: 1; text-align: center;">
            Go to My Dashboard 🚀
          </a>
          <button type="button" class="btn btn-outline" onclick="devcraftShop.hideModal('order-success-modal')">
            Close
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    openProductModal,
    openShareModal,
    openCheckoutModal,
    applyCoupon,
    removeCoupon,
    submitCheckout,
    copyShareLink,
    triggerNativeShare,
    trackShare,
    showToast,
    hideModal,
    formatCurrency
  };
})();
