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

      // Hand off to dynamic UPI Payment & Verification
      if (data.payment && data.payment.upiUri) {
        openUpiPaymentModal(data.order, data.payment);
      } else {
        showOrderSuccess(data.order);
      }
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
            <strong style="font-family: var(--font-mono); color: var(--cyan);">${escapeHtml(order.orderId)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-secondary); font-size: 0.85rem;">Product / Course:</span>
            <strong>${escapeHtml(order.productName)}</strong>
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
            <span style="font-size: 0.85rem;">Coupon (${escapeHtml(order.couponCodeMask)}):</span>
            <strong>${order.couponDiscountPercent}% OFF (- ${formatCurrency(order.couponDiscountAmount)})</strong>
          </div>
          ` : ''}
          <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700;">Final Amount:</span>
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

    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.add('active'); }, 20);
  }

  // ==========================================
  // DYNAMIC UPI PAYMENT & VERIFICATION ENGINE
  // ==========================================
  let upiPollingTimer = null;
  let upiCountdownTimer = null;
  let activePaymentOrder = null;

  function openUpiPaymentModal(order, payment) {
    activePaymentOrder = order;
    const modal = document.getElementById('upi-payment-modal');
    const body = document.getElementById('upi-payment-modal-body');
    if (!modal || !body) return;

    if (upiPollingTimer) clearInterval(upiPollingTimer);
    if (upiCountdownTimer) clearInterval(upiCountdownTimer);

    try {
      localStorage.setItem('devcraft_last_order', JSON.stringify({
        orderId: order.orderId,
        productId: order.productId,
        email: order.clientEmail
      }));
    } catch (_) {}

    const upiUri = payment.upiUri || `upi://pay?pa=devcraft@upi&pn=DEVCRAFT%20STUDIO&am=${Number(order.finalAmount).toFixed(2)}&cu=INR&tr=${encodeURIComponent(order.orderId)}&tn=${encodeURIComponent('DevCraft ' + order.orderId)}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}`;

    body.innerHTML = `
      <div style="text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; text-align: left;">
          <div>
            <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Order Reference</div>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
              <strong style="font-family: var(--font-mono); color: var(--cyan); font-size: 0.95rem;">${escapeHtml(order.orderId)}</strong>
              <button type="button" class="btn btn-ghost btn-xs" onclick="navigator.clipboard.writeText('${escapeHtml(order.orderId)}'); devcraftShop.showToast('Order ID copied!');" title="Copy Order ID" style="padding: 2px 6px;">📋</button>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Amount Payable</div>
            <div class="text-gradient" style="font-size: 1.4rem; font-weight: 800;">${formatCurrency(order.finalAmount)}</div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">${escapeHtml(order.productName)}</h4>
          <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span id="upi-status-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); padding: 3px 12px; border-radius: 9999px; font-weight: 700; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 6px;">
              <span class="status-dot" style="background: #fbbf24;"></span> Awaiting UPI Payment
            </span>
            <span id="upi-countdown-timer" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
              Expires in: 15:00
            </span>
          </div>
        </div>

        <div id="upi-qr-container" style="background: #0f172a; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 16px; padding: 20px; display: inline-block; margin-bottom: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="background: #ffffff; padding: 10px; border-radius: 12px; display: inline-block;">
            <img id="upi-qr-image" src="${qrUrl}" alt="Dynamic UPI QR Code" style="width: 200px; height: 200px; display: block; border-radius: 6px;" />
          </div>
          <div style="margin-top: 12px; font-size: 0.82rem; color: #94a3b8;">
            Merchant UPI ID: <strong style="color: var(--cyan); font-family: var(--font-mono);">${escapeHtml(payment.merchantVpa || 'devcraft@upi')}</strong>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
            Scan with GPay, PhonePe, Paytm, BHIM, Cred or any bank UPI app
          </div>
        </div>

        <div id="upi-pay-app-btn-wrap" style="margin-bottom: 20px;">
          <a href="${upiUri}" class="btn btn-primary btn-block" style="display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; text-decoration: none; padding: 12px;">
            <span>⚡ Pay via UPI App (GPay / PhonePe / Paytm)</span>
          </a>
        </div>

        <div id="upi-utr-form-wrap" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 14px; padding: 16px; text-align: left; margin-bottom: 16px;">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">
            Verify Payment (Enter 12-digit UPI Ref / UTR):
          </label>
          <div style="display: flex; gap: 8px;">
            <input type="text" id="upi-utr-input" placeholder="e.g. 423589123456" maxlength="24" style="flex-grow: 1; padding: 10px 14px; background: rgba(0,0,0,0.5); border: 1px solid var(--border-glass); border-radius: 8px; color: #fff; font-family: var(--font-mono); font-size: 0.9rem;" />
            <button id="upi-verify-btn" type="button" class="btn btn-emerald" onclick="devcraftShop.verifyUpiPayment('${escapeHtml(order.orderId)}')">
              Verify Payment →
            </button>
          </div>
          <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 6px;">
            Found in your UPI app payment receipt (UTR / UPI Transaction ID / Ref No).
          </div>
          <div id="upi-verify-feedback" style="display: none; margin-top: 12px; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem;"></div>
        </div>

        <div id="upi-success-panel" style="display: none;"></div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
          <button type="button" class="btn btn-ghost btn-sm" onclick="devcraftShop.hideModal('upi-payment-modal')">
            ✕ Pay Later / Close
          </button>
          <a href="/dashboard" class="btn btn-outline btn-sm">
            View in Dashboard →
          </a>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.add('active'); }, 20);

    let totalSeconds = 15 * 60;
    upiCountdownTimer = setInterval(() => {
      totalSeconds--;
      if (totalSeconds <= 0) {
        clearInterval(upiCountdownTimer);
        const timerEl = document.getElementById('upi-countdown-timer');
        if (timerEl) {
          timerEl.textContent = 'Payment window expired. Please re-order.';
          timerEl.style.color = '#ef4444';
        }
        return;
      }
      const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
      const secs = (totalSeconds % 60).toString().padStart(2, '0');
      const timerEl = document.getElementById('upi-countdown-timer');
      if (timerEl) timerEl.textContent = `Expires in: ${mins}:${secs}`;
    }, 1000);

    upiPollingTimer = setInterval(async () => {
      await checkUpiStatus(order.orderId, false);
    }, 7000);
  }

  async function verifyUpiPayment(orderId) {
    const utrInput = document.getElementById('upi-utr-input');
    const verifyBtn = document.getElementById('upi-verify-btn');
    const feedback = document.getElementById('upi-verify-feedback');
    const utr = utrInput ? utrInput.value.trim() : '';

    if (!utr) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(239, 68, 68, 0.15)';
        feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        feedback.style.color = '#fca5a5';
        feedback.textContent = 'Please enter the 12-digit UPI Reference Number / UTR from your payment app.';
      }
      return;
    }

    if (verifyBtn) {
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Verifying with Bank...';
    }

    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.background = 'rgba(59, 130, 246, 0.15)';
      feedback.style.border = '1px solid rgba(59, 130, 246, 0.3)';
      feedback.style.color = '#93c5fd';
      feedback.textContent = 'Contacting Tranz UPI gateway & verifying cryptographic ledger...';
    }

    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('devcraft_user_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/payments/verify/${encodeURIComponent(orderId)}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ utr })
      });

      const data = await res.json();

      if (data.verified || data.success) {
        handleUpiSuccess(data.order || activePaymentOrder || { orderId });
      } else {
        if (verifyBtn) {
          verifyBtn.disabled = false;
          verifyBtn.textContent = 'Retry Verification';
        }
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.background = 'rgba(245, 158, 11, 0.15)';
          feedback.style.border = '1px solid rgba(245, 158, 11, 0.3)';
          feedback.style.color = '#fcd34d';
          feedback.innerHTML = `<strong>Payment Recorded:</strong> ${escapeHtml(data.message || 'Payment reference submitted and queued for review.')}`;
        }
        const badge = document.getElementById('upi-status-badge');
        if (badge) {
          badge.style.background = 'rgba(59, 130, 246, 0.15)';
          badge.style.borderColor = 'rgba(59, 130, 246, 0.4)';
          badge.style.color = '#60a5fa';
          badge.innerHTML = '<span class="status-dot" style="background: #60a5fa;"></span> Payment Under Verification';
        }
      }
    } catch (err) {
      if (verifyBtn) {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify Payment →';
      }
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(239, 68, 68, 0.15)';
        feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        feedback.style.color = '#fca5a5';
        feedback.textContent = `Verification error: ${err.message}`;
      }
    }
  }

  async function checkUpiStatus(orderId, silent = true) {
    try {
      const res = await fetch(`/api/payments/status/${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (data.success && data.isPaid) {
        handleUpiSuccess(data.order || activePaymentOrder || { orderId });
      }
    } catch (_) {}
  }

  function handleUpiSuccess(order) {
    if (upiPollingTimer) clearInterval(upiPollingTimer);
    if (upiCountdownTimer) clearInterval(upiCountdownTimer);

    const badge = document.getElementById('upi-status-badge');
    if (badge) {
      badge.style.background = 'rgba(16, 185, 129, 0.2)';
      badge.style.borderColor = 'rgba(16, 185, 129, 0.5)';
      badge.style.color = '#34d399';
      badge.innerHTML = '✓ Payment Verified &amp; Paid';
    }

    const timerEl = document.getElementById('upi-countdown-timer');
    if (timerEl) timerEl.innerHTML = '<strong style="color: #34d399;">Order Fulfilled</strong>';

    const qrBox = document.getElementById('upi-qr-container');
    if (qrBox) qrBox.style.display = 'none';
    const utrBox = document.getElementById('upi-utr-form-wrap');
    if (utrBox) utrBox.style.display = 'none';
    const payAppBtn = document.getElementById('upi-pay-app-btn-wrap');
    if (payAppBtn) payAppBtn.style.display = 'none';

    const successPanel = document.getElementById('upi-success-panel');
    if (successPanel) {
      const productId = order.productId || (activePaymentOrder && activePaymentOrder.productId) || 'joya-ai';
      const isFlagship = productId === 'joya-ai' || productId === 'jarvis-ai';
      const downloadLabel = isFlagship ? '⬇️ Download Full Source Code (.ZIP)' : '⬇️ Download Purchased Package';
      const emailParam = order.clientEmail || (activePaymentOrder && activePaymentOrder.clientEmail) || '';

      successPanel.style.display = 'block';
      successPanel.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; text-align: center; margin-top: 16px;">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🎉</div>
          <h3 style="color: #34d399; font-size: 1.3rem; font-weight: 800; margin-bottom: 6px;">Payment Confirmed!</h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 16px;">
            Your transaction has been verified server-side. Your commercial license and full source code entitlements have been activated.
          </p>

          <a href="/api/downloads/${encodeURIComponent(productId)}?orderId=${encodeURIComponent(order.orderId)}&email=${encodeURIComponent(emailParam)}" class="btn btn-emerald btn-lg btn-block" style="display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 800; font-size: 1rem; text-decoration: none; padding: 14px; margin-bottom: 12px; box-shadow: 0 0 24px rgba(16, 185, 129, 0.4);">
            <span>${downloadLabel}</span>
          </a>

          <a href="/dashboard" class="btn btn-outline btn-sm btn-block" style="text-decoration: none;">
            Go to My Client Workspace Dashboard →
          </a>
        </div>
      `;
    }
  }

  // ==========================================
  // 4. SHOPPING CART ENGINE
  // ==========================================
  function getCart() {
    try {
      const stored = localStorage.getItem('devcraft_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem('devcraft_cart', JSON.stringify(cart));
      updateCartBadges();
    } catch (_) {}
  }

  function addToCart(productId, quantity = 1) {
    const p = getProduct(productId);
    if (!p) return;

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
    } else {
      cart.push({ productId, quantity: Math.max(1, quantity) });
    }

    saveCart(cart);
    showToast(`Added "${p.name.split('—')[0].trim()}" to Cart! 🛒`);

    // If on cart page, refresh view
    if (document.getElementById('cart-items-container')) {
      renderCartPage();
    }
  }

  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
    showToast('Item removed from cart.');
    if (document.getElementById('cart-items-container')) {
      renderCartPage();
    }
  }

  function updateQuantity(productId, delta) {
    let cart = getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) {
      item.quantity = Math.max(1, (item.quantity || 1) + delta);
      saveCart(cart);
      if (document.getElementById('cart-items-container')) {
        renderCartPage();
      }
    }
  }

  function clearCart() {
    saveCart([]);
    if (document.getElementById('cart-items-container')) {
      renderCartPage();
    }
  }

  function updateCartBadges() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const desktopBadge = document.getElementById('nav-cart-badge');
    if (desktopBadge) {
      desktopBadge.textContent = totalCount;
      desktopBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    const mobileBadge = document.getElementById('mobile-cart-count');
    if (mobileBadge) {
      mobileBadge.textContent = totalCount;
    }
  }

  async function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const summaryBox = document.getElementById('cart-summary-box');
    if (!container) return;

    const cart = getCart();
    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state" style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 3.5rem; margin-bottom: 14px;">🛒</div>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">Your Cart is Empty</h3>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">Explore our catalog of Android Apps, PC Software, and Aptitude courses.</p>
          <a href="/products" class="btn btn-primary">Browse All Products (50% OFF) →</a>
        </div>
      `;
      if (summaryBox) {
        summaryBox.style.display = 'none';
      }
      return;
    }

    if (summaryBox) summaryBox.style.display = 'block';

    // Fetch authoritative cart calculation from backend
    try {
      const token = localStorage.getItem('devcraft_user_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          cartItems: cart,
          couponCode: appliedCouponCode || null
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Cart calculation error.');
      }

      cachedCalculation = data.summary;

      // Render table
      let tableHtml = `
        <div class="table-responsive">
          <table class="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price & Discount</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
      `;

      data.items.forEach(item => {
        tableHtml += `
          <tr>
            <td>
              <div class="cart-item-name">${escapeHtml(item.productName)}</div>
              <div class="cart-item-cat">${escapeHtml(item.productCategory || 'DevCraft Product')} • <span class="text-cyan">${item.productDiscountPercent}% OFF</span></div>
            </td>
            <td>
              <div><del style="color: var(--text-muted); font-size: 0.85rem;">${formatCurrency(item.originalPrice)}</del></div>
              <strong style="color: #ffffff;">${formatCurrency(item.discountedPrice)}</strong>
            </td>
            <td>
              <div class="cart-qty-ctrl">
                <button class="cart-qty-btn" onclick="devcraftShop.updateQuantity('${item.productId}', -1)">-</button>
                <span class="cart-qty-num">${item.quantity}</span>
                <button class="cart-qty-btn" onclick="devcraftShop.updateQuantity('${item.productId}', 1)">+</button>
              </div>
            </td>
            <td>
              <strong style="color: var(--cyan);">${formatCurrency(item.finalTotal)}</strong>
            </td>
            <td>
              <button class="cart-remove-link" onclick="devcraftShop.removeFromCart('${item.productId}')">Remove</button>
            </td>
          </tr>
        `;
      });

      tableHtml += `
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = tableHtml;

      // Render Summary
      if (summaryBox) {
        const s = data.summary;
        summaryBox.innerHTML = `
          <h3>Order Summary</h3>
          <div class="cart-sum-line">
            <span>Total Original Value:</span>
            <del>${formatCurrency(s.totalOriginalPrice)}</del>
          </div>
          <div class="cart-sum-line" style="color: #10b981;">
            <span>Catalog Discounts Applied:</span>
            <strong>- ${formatCurrency(s.totalProductDiscount)}</strong>
          </div>
          <div class="cart-sum-line">
            <span>Subtotal (After Catalog Off):</span>
            <strong>${formatCurrency(s.subtotalDiscounted)}</strong>
          </div>
          ${s.couponCodeMask ? `
          <div class="cart-sum-line" style="color: #a855f7;">
            <span>Coupon (${s.couponCodeMask}) ${s.couponDiscountPercent}% OFF:</span>
            <strong>- ${formatCurrency(s.couponDiscountAmount)}</strong>
          </div>
          ` : ''}
          <div class="cart-sum-total cart-sum-line">
            <span>Payable Amount:</span>
            <span class="text-gradient" style="font-size: 1.4rem;">${formatCurrency(s.finalAmount)}</span>
          </div>

          <!-- Coupon Input Form -->
          <div style="margin-top: 20px;">
            <label style="font-size: 0.82rem; color: var(--text-secondary); display: block; margin-bottom: 6px;">Have a Private Coupon?</label>
            <div class="coupon-input-wrap">
              <input type="text" id="cart-coupon-input" class="coupon-input" placeholder="e.g. DEV-XXXX-XXXX-XXXX" value="${appliedCouponCode}" />
              <button type="button" class="btn btn-outline" id="cart-coupon-btn" onclick="devcraftShop.applyCartCoupon()">Apply</button>
            </div>
            <div id="cart-coupon-feedback" style="margin-top: 8px; font-size: 0.82rem;"></div>
          </div>

          <!-- Client Details & Checkout Form -->
          <form id="cart-checkout-form" onsubmit="devcraftShop.submitCartCheckout(event)" style="margin-top: 24px;">
            <div class="form-group" style="margin-bottom: 12px;">
              <label class="input-label" style="font-size: 0.82rem;">Your Name *</label>
              <input type="text" id="cart-client-name" class="form-control" placeholder="Full Name" required />
            </div>
            <div class="form-group" style="margin-bottom: 12px;">
              <label class="input-label" style="font-size: 0.82rem;">Your Email *</label>
              <input type="email" id="cart-client-email" class="form-control" placeholder="name@example.com" required />
            </div>
            <div class="form-group" style="margin-bottom: 12px;">
              <label class="input-label" style="font-size: 0.82rem;">Phone / WhatsApp</label>
              <input type="tel" id="cart-client-phone" class="form-control" placeholder="+91 9876543210" />
            </div>
            <div class="form-group" style="margin-bottom: 18px;">
              <label class="input-label" style="font-size: 0.82rem;">Special Instructions / Requirements</label>
              <textarea id="cart-client-notes" class="form-control" rows="2" placeholder="Customization details or questions..."></textarea>
            </div>
            <button type="submit" id="cart-submit-btn" class="btn btn-primary btn-block" style="width: 100%; justify-content: center; font-weight: 700;">
              Confirm &amp; Place Order (${formatCurrency(s.finalAmount)}) →
            </button>
          </form>
        `;

        // Pre-fill user details if logged in
        if (window.DevCraftAuth && DevCraftAuth.isAuthenticated()) {
          const u = DevCraftAuth.getUser() || {};
          const nameInput = document.getElementById('cart-client-name');
          const emailInput = document.getElementById('cart-client-email');
          const phoneInput = document.getElementById('cart-client-phone');
          if (nameInput && u.name) nameInput.value = u.name;
          if (emailInput && u.email) emailInput.value = u.email;
          if (phoneInput && u.phone) phoneInput.value = u.phone;
        }
      }
    } catch (err) {
      container.innerHTML = `<div class="coupon-feedback-box error" style="display:block;">${escapeHtml(err.message)}</div>`;
    }
  }

  async function applyCartCoupon() {
    const input = document.getElementById('cart-coupon-input');
    const feedback = document.getElementById('cart-coupon-feedback');
    if (!input || !input.value.trim()) {
      if (feedback) feedback.innerHTML = '<span style="color: #ef4444;">Please enter coupon code.</span>';
      return;
    }
    appliedCouponCode = input.value.trim();
    if (feedback) feedback.innerHTML = '<span style="color: var(--cyan);">Verifying coupon with cryptographic ledger...</span>';
    await renderCartPage();
  }

  async function submitCartCheckout(e) {
    e.preventDefault();
    const clientName = document.getElementById('cart-client-name').value.trim();
    const clientEmail = document.getElementById('cart-client-email').value.trim();
    const clientPhone = document.getElementById('cart-client-phone').value.trim();
    const notes = document.getElementById('cart-client-notes').value.trim();
    const submitBtn = document.getElementById('cart-submit-btn');

    if (!clientName || !clientEmail) {
      alert('Please provide your name and email address.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Secure Checkout...';

    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('devcraft_user_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          cartItems: getCart(),
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

      // Clear Cart
      clearCart();

      // Hand off to dynamic UPI Payment & Verification
      if (data.payment && data.payment.upiUri) {
        openUpiPaymentModal(data.order, data.payment);
      } else {
        showOrderSuccess(data.order);
      }
    } catch (err) {
      alert(`Checkout failed: ${err.message}`);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Retry Order Placement →';
    }
  }

  // ==========================================
  // 5. SEARCH SYSTEM
  // ==========================================
  function openSearchModal() {
    const modal = document.getElementById('devcraft-search-modal');
    if (modal) {
      modal.style.display = 'flex';
      setTimeout(() => {
        modal.classList.add('active');
        const input = document.getElementById('devcraft-search-input');
        if (input) {
          input.value = '';
          input.focus();
        }
      }, 50);
      renderSearchResults('');
    }
  }

  function closeSearchModal() {
    const modal = document.getElementById('devcraft-search-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => { modal.style.display = 'none'; }, 200);
    }
  }

  function applySearchTag(tag) {
    const input = document.getElementById('devcraft-search-input');
    if (input) {
      input.value = tag;
      renderSearchResults(tag);
    }
  }

  function renderSearchResults(query) {
    const resultsContainer = document.getElementById('devcraft-search-results');
    if (!resultsContainer) return;

    const q = (query || '').trim().toLowerCase();
    const products = window.DEVCRAFT_PRODUCTS_DATA || [];
    const services = window.DEVCRAFT_SERVICES_DATA || [];

    if (!q) {
      resultsContainer.innerHTML = '<div class="search-empty-state">Type a keyword to discover DevCraft apps, services, and courses.</div>';
      return;
    }

    const matchedProducts = products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.shortDesc && p.shortDesc.toLowerCase().includes(q))
    );

    const matchedServices = services.filter(s =>
      s.title.toLowerCase().includes(q) ||
      (s.category && s.category.toLowerCase().includes(q)) ||
      (s.shortDesc && s.shortDesc.toLowerCase().includes(q))
    );

    if (matchedProducts.length === 0 && matchedServices.length === 0) {
      resultsContainer.innerHTML = `<div class="search-empty-state">No matching software or services found for "${escapeHtml(query)}".</div>`;
      return;
    }

    let html = '';

    if (matchedProducts.length > 0) {
      html += `<div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin: 10px 6px 6px;">Products & Apps (${matchedProducts.length})</div>`;
      matchedProducts.forEach(p => {
        const isAptitude = p.type === 'aptitude' || p.category === 'Aptitude';
        const discountPercent = isAptitude ? 30 : 50;
        const orig = Number(p.originalPrice) || 10000;
        const final = Math.round(orig * (1 - discountPercent / 100));

        let pageLink = '/products';
        if (p.id === 'joya-ai') pageLink = '/joya';
        else if (p.id === 'jarvis-ai') pageLink = '/jarvis';
        else if (isAptitude) pageLink = '/aptitude';

        html += `
          <a href="${pageLink}" class="search-result-row">
            <div>
              <div class="search-result-title">${escapeHtml(p.name)}</div>
              <div class="search-result-meta">${escapeHtml(p.category)} • <span style="color: var(--cyan);">${discountPercent}% OFF</span></div>
            </div>
            <div class="search-result-price">
              <del>${formatCurrency(orig)}</del>
              <strong>${formatCurrency(final)}</strong>
            </div>
          </a>
        `;
      });
    }

    if (matchedServices.length > 0) {
      html += `<div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin: 14px 6px 6px;">Services (${matchedServices.length})</div>`;
      matchedServices.forEach(s => {
        html += `
          <a href="/services" class="search-result-row">
            <div>
              <div class="search-result-title">${escapeHtml(s.title)}</div>
              <div class="search-result-meta">${escapeHtml(s.category)} • Full-Cycle Delivery</div>
            </div>
            <div class="search-result-price">
              <span style="color: var(--emerald); font-weight: 600; font-size: 0.85rem;">${escapeHtml(s.timeline || 'Sprint')}</span>
            </div>
          </a>
        `;
      });
    }

    resultsContainer.innerHTML = html;
  }

  // ==========================================
  // 6. JOYA & JARVIS SIMULATORS & DOWNLOADS
  // ==========================================
  function simulateJoyaWakeWord() {
    const bars = document.querySelectorAll('.voice-bar');
    bars.forEach(b => b.classList.add('active'));

    const statusEl = document.getElementById('joya-voice-status');
    if (statusEl) {
      statusEl.innerHTML = '<span style="color: var(--cyan);">🎙️ Wake word detected: "Wake up Joya"! Joya is listening...</span>';
    }

    // Web Speech synthesis if available
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Hello Harshit! Joya is online and ready for your command.");
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (_) {}

    setTimeout(() => {
      bars.forEach(b => b.classList.remove('active'));
      if (statusEl) {
        statusEl.innerHTML = '<span style="color: #10b981;">✓ Command executed: Assistant standing by in background.</span>';
      }
    }, 3500);
  }

  function simulateJarvisCommand(cmdName) {
    const terminal = document.getElementById('jarvis-terminal-output');
    if (!terminal) return;

    const timestamp = new Date().toLocaleTimeString();
    let outputLines = '';

    if (cmdName === 'index') {
      outputLines = `
<div class="cmd-line">[${timestamp}] jarvis --index-workspace</div>
<div class="out-line">Scanning active project filesystem...</div>
<div class="out-line">Indexed 248 source modules (.js, .json, .html, .css)</div>
<div class="highlight-line">✓ Semantic index updated in 38ms. Memory footprint: 14.2MB</div>`;
    } else if (cmdName === 'scrape') {
      outputLines = `
<div class="cmd-line">[${timestamp}] jarvis --run-workflow dynamic-web-scraper</div>
<div class="out-line">Launching headless browser sandbox...</div>
<div class="out-line">Target: API telemetry endpoints</div>
<div class="highlight-line">✓ Extracted 1,420 records. CSV bundle created in /downloads</div>`;
    } else {
      outputLines = `
<div class="cmd-line">[${timestamp}] jarvis --diagnostics</div>
<div class="out-line">CPU Usage: 4.2% | RAM: 340MB | Latency: 12ms</div>
<div class="highlight-line">✓ All background daemons running smoothly.</div>`;
    }

    terminal.innerHTML += outputLines;
    terminal.scrollTop = terminal.scrollHeight;
  }

  function downloadProduct(productId) {
    let orderId = '';
    let email = '';
    try {
      const stored = localStorage.getItem('devcraft_last_order');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.productId === productId || parsed.orderId) {
          orderId = parsed.orderId;
          email = parsed.email || '';
        }
      }
    } catch (_) {}

    showToast('Initiating secure direct download...');
    let url = `/api/downloads/${encodeURIComponent(productId)}`;
    const params = new URLSearchParams();
    if (orderId) params.append('orderId', orderId);
    if (email) params.append('email', email);
    const qs = params.toString();
    if (qs) url += `?${qs}`;

    window.location.href = url;
  }

  // Keyboard shortcut listener for Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
    }
  });

  // Search input typing listener
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();
    const searchInput = document.getElementById('devcraft-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderSearchResults(e.target.value);
      });
    }

    if (document.getElementById('cart-items-container')) {
      renderCartPage();
    }
  });

  function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      if (modalId === 'upi-payment-modal') {
        if (upiPollingTimer) clearInterval(upiPollingTimer);
        if (upiCountdownTimer) clearInterval(upiCountdownTimer);
      }
      setTimeout(() => {
        modal.style.display = 'none';
      }, 200);
    }
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
    formatCurrency,
    // Cart
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateCartBadges,
    renderCartPage,
    applyCartCoupon,
    submitCartCheckout,
    // Search
    openSearchModal,
    closeSearchModal,
    applySearchTag,
    renderSearchResults,
    // Flagships & Downloads
    simulateJoyaWakeWord,
    simulateJarvisCommand,
    downloadProduct,
    // Dynamic UPI Payment & Verification
    openUpiPaymentModal,
    verifyUpiPayment,
    checkUpiStatus
  };
})();

