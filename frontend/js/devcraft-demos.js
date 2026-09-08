/**
 * DEVCRAFT - Interactive Demos, Case Studies & Services Controller
 * Powers live simulated applications inside modal environments
 */

window.devcraftDemos = (function() {
  'use strict';

  // Internal State
  let activeDemoId = null;
  let simulatedTimers = [];

  // Demo State Stores
  const state = {
    cravex: {
      category: 'all',
      cart: [
        { id: 1, name: 'Truffle Smash Burger', price: 449, qty: 1, note: 'Medium spice' },
        { id: 4, name: 'Matcha Boba Float', price: 219, qty: 1, note: 'Less ice' }
      ],
      currentStep: 'menu', // 'menu' or 'tracking'
      courierProgress: 65,
      deliveryStatus: 'Courier is 4 minutes away'
    },
    fitcore: {
      viewMode: 'member', // 'member' or 'admin'
      checkedIn: false,
      members: [
        { id: 'FC-101', name: 'Aarav Sharma', plan: 'Pro Athlete', status: 'Active', renewal: '18 Days' },
        { id: 'FC-102', name: 'Elena Rostova', plan: 'CrossFit Elite', status: 'Active', renewal: '24 Days' },
        { id: 'FC-103', name: 'Marcus Vance', plan: 'Monthly Standard', status: 'Pending', renewal: '2 Days' },
        { id: 'FC-104', name: 'Priya Patel', plan: 'Pro Athlete', status: 'Active', renewal: '45 Days' }
      ],
      bookedSlot: null
    },
    edunova: {
      activeLesson: 2,
      isPlaying: false,
      progress: 68,
      quizAnswers: {},
      quizSubmitted: false,
      quizScore: 0,
      notes: 'Key architectural insight: Separate read and write paths using CQRS for high throughput.'
    },
    estatex: {
      filterType: 'all',
      maxPrice: 80000000,
      selectedProperty: null,
      tourDate: '',
      tourBooked: false,
      loanAmount: 25000000,
      interestRate: 8.5,
      loanTenure: 20
    },
    jarvis: {
      persona: 'architect',
      messages: [
        {
          sender: 'ai',
          text: 'Hello! I am **Jarvis AI**, DevCraft’s Multi-Agent Engineering Assistant. I am currently running in **System Architect** mode. How can I assist with your infrastructure or full-stack design today?'
        }
      ],
      isTyping: false
    },
    business: {
      theme: 'executive-dark',
      monthlyVisitors: 45000,
      conversionRate: 2.8,
      avgOrderValue: 3500
    },
    novacart: {
      category: 'all',
      cartOpen: false,
      cart: [
        { id: 101, name: 'DevCraft Precision Mechanical Keyboard', price: 8999, qty: 1 },
        { id: 103, name: 'Spatial Audio Noise-Canceling Headphones', price: 14999, qty: 1 }
      ],
      couponApplied: false,
      discountPercent: 0,
      orderSuccess: null
    },
    timeslot: {
      selectedService: 'Tech Architecture & System Blueprint',
      serviceDuration: '60 mins',
      servicePrice: 'Free Consultation',
      selectedDate: '',
      selectedTime: '02:00 PM',
      confirmedBooking: null
    },
    nexus: {
      timeframe: 'weekly',
      users: [
        { id: 'USR-8901', name: 'Kavita Sundaram', role: 'DevOps Lead', email: 'kavita@nexus.io', status: 'Active', mfa: 'Enabled' },
        { id: 'USR-8902', name: 'Liam Gallagher', role: 'Security Architect', email: 'liam@nexus.io', status: 'Active', mfa: 'Enabled' },
        { id: 'USR-8903', name: 'David Chen', role: 'Data Engineer', email: 'david@nexus.io', status: 'Suspended', mfa: 'Disabled' },
        { id: 'USR-8904', name: 'Rohan Mehta', role: 'Product Manager', email: 'rohan@nexus.io', status: 'Active', mfa: 'Enabled' }
      ],
      serverStatus: 'Optimal'
    },
    flowcraft: {
      isRunning: false,
      activeStep: 0,
      logs: [
        '[Ready] FlowCraft Pipeline initialized: Ready to execute automation nodes.'
      ]
    }
  };

  // Clear timers when switching or closing
  function clearSimulations() {
    simulatedTimers.forEach(t => clearInterval(t));
    simulatedTimers = [];
  }

  // Generic modal opening helper
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    clearSimulations();
  }

  // Pre-fill and scroll to inquiry form
  function startProjectFor(serviceOrDemoTitle) {
    hideModal('demo-modal');
    hideModal('case-study-modal');
    hideModal('service-modal');

    const select = document.getElementById('project-service');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.toLowerCase().includes(serviceOrDemoTitle.toLowerCase()) ||
            serviceOrDemoTitle.toLowerCase().includes(select.options[i].value.toLowerCase())) {
          select.selectedIndex = i;
          break;
        }
      }
    }

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Pulse animation on form container
      const card = contactSection.querySelector('.contact-form-card');
      if (card) {
        card.classList.remove('form-highlight-pulse');
        void card.offsetWidth; // trigger reflow
        card.classList.add('form-highlight-pulse');
      }
    }
  }

  // ==========================================
  // 1. CRAVEX DEMO CONTROLLER
  // ==========================================
  const cravexCatalog = [
    { id: 1, name: 'Truffle Smash Burger', category: 'burgers', price: 449, desc: 'Double smashed Angus patty, black truffle aioli, aged cheddar & brioche', rating: 4.9, time: '20m' },
    { id: 2, name: 'Crispy Chipotle Chicken Sandwich', category: 'burgers', price: 379, desc: 'Buttermilk fried chicken, chipotle slaw, house pickles & toasted bun', rating: 4.8, time: '18m' },
    { id: 3, name: 'Teriyaki Salmon Poke Bowl', category: 'bowls', price: 549, desc: 'Wild caught salmon, avocado, edamame, furikake jasmine rice & ponzu', rating: 4.9, time: '22m' },
    { id: 4, name: 'Matcha Boba Cloud Float', category: 'shakes', price: 219, desc: 'Ceremonial grade Uji matcha, organic milk & slow-cooked honey pearls', rating: 4.7, time: '12m' },
    { id: 5, name: 'Spicy Tuna Crunch Roll', category: 'sushi', price: 499, desc: 'Yellowfin tuna, cucumber, sriracha emulsion, tempura flakes & sesame', rating: 4.9, time: '25m' },
    { id: 6, name: 'Mediterranean Grain Bowl', category: 'bowls', price: 399, desc: 'Herbed quinoa, roasted chickpeas, whipped feta, kalamata & sumac vinaigrette', rating: 4.8, time: '15m' }
  ];

  function renderCraveX() {
    const container = document.getElementById('demo-interactive-stage');
    if (!container) return;

    const s = state.cravex;
    const subtotal = s.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const deliveryFee = subtotal > 0 ? 49 : 0;
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + taxes;

    if (s.currentStep === 'tracking') {
      container.innerHTML = `
        <div class="cravex-tracking-view">
          <div class="cravex-header">
            <button class="btn btn-xs btn-outline" onclick="devcraftDemos.cravexSetStep('menu')">← Back to Menu</button>
            <div class="cravex-badge"><span class="pulse-dot"></span> Live Courier GPS Stream</div>
          </div>

          <div class="simulated-gps-map">
            <div class="map-grid-lines"></div>
            <div class="gps-route-line"></div>
            <div class="restaurant-pin">
              <span class="pin-icon">🍳</span>
              <span class="pin-label">CraveX Kitchen</span>
            </div>
            <div class="destination-pin">
              <span class="pin-icon">📍</span>
              <span class="pin-label">Delivery Address</span>
            </div>
            <div class="courier-pin" style="left: ${s.courierProgress}%; top: 48%;">
              <span class="scooter-icon">🛵</span>
              <span class="courier-tooltip">Rider Rohan (Hero Splendor)</span>
            </div>
          </div>

          <div class="tracking-meta-grid">
            <div class="tracking-card">
              <div class="meta-label">Estimated Delivery</div>
              <div class="meta-value text-gradient">12 - 14 Mins</div>
              <div class="meta-sub">Courier speed: 38 km/h • On schedule</div>
            </div>
            <div class="tracking-card">
              <div class="meta-label">Order #CX-88914</div>
              <div class="meta-value">${s.cart.length} Items (₹${total})</div>
              <div class="meta-sub">Prepaid via UPI • Contactless dropoff</div>
            </div>
            <div class="tracking-card">
              <div class="meta-label">Courier Status</div>
              <div class="meta-value text-emerald">En Route</div>
              <div class="meta-sub">"At crossroad signal, arriving shortly"</div>
            </div>
          </div>

          <div class="order-timeline-steps">
            <div class="timeline-step completed">
              <div class="step-circle">✓</div>
              <div class="step-text"><strong>Order Confirmed</strong><small>14:22</small></div>
            </div>
            <div class="timeline-step completed">
              <div class="step-circle">✓</div>
              <div class="step-text"><strong>Chef Prepared</strong><small>14:31</small></div>
            </div>
            <div class="timeline-step active">
              <div class="step-circle pulse">🛵</div>
              <div class="step-text"><strong>Courier On Way</strong><small>Live Now</small></div>
            </div>
            <div class="timeline-step">
              <div class="step-circle">🏠</div>
              <div class="step-text"><strong>Delivered</strong><small>Est 14:45</small></div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Menu View
    const filteredItems = s.category === 'all' 
      ? cravexCatalog 
      : cravexCatalog.filter(item => item.category === s.category);

    container.innerHTML = `
      <div class="cravex-stage-layout">
        <div class="cravex-main-column">
          <!-- Filter Tabs -->
          <div class="cravex-category-bar">
            <button class="pill-btn ${s.category === 'all' ? 'active' : ''}" onclick="devcraftDemos.cravexFilter('all')">All Dishes</button>
            <button class="pill-btn ${s.category === 'burgers' ? 'active' : ''}" onclick="devcraftDemos.cravexFilter('burgers')">Burgers</button>
            <button class="pill-btn ${s.category === 'bowls' ? 'active' : ''}" onclick="devcraftDemos.cravexFilter('bowls')">Healthy Bowls</button>
            <button class="pill-btn ${s.category === 'sushi' ? 'active' : ''}" onclick="devcraftDemos.cravexFilter('sushi')">Sushi & Rolls</button>
            <button class="pill-btn ${s.category === 'shakes' ? 'active' : ''}" onclick="devcraftDemos.cravexFilter('shakes')">Beverages</button>
          </div>

          <!-- Dishes Grid -->
          <div class="cravex-dishes-grid">
            ${filteredItems.map(item => `
              <div class="cravex-dish-card">
                <div class="dish-header">
                  <span class="dish-badge">${item.rating} ★ (${item.time})</span>
                  <span class="dish-price">₹${item.price}</span>
                </div>
                <h4 class="dish-name">${item.name}</h4>
                <p class="dish-desc">${item.desc}</p>
                <div class="dish-footer">
                  <button class="btn btn-xs btn-primary" onclick="devcraftDemos.cravexAddToCart(${item.id})">
                    + Add to Cart
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Sidebar Cart -->
        <div class="cravex-cart-sidebar">
          <div class="cart-header">
            <h4>Your Food Basket (${s.cart.reduce((a, b) => a + b.qty, 0)})</h4>
            ${s.cart.length > 0 ? `<button class="btn btn-xs btn-ghost text-muted" onclick="devcraftDemos.cravexClearCart()">Clear</button>` : ''}
          </div>

          <div class="cart-items-list">
            ${s.cart.length === 0 ? `
              <div class="empty-cart-state">
                <p>Your basket is empty. Click "+ Add to Cart" on any dish to taste the experience!</p>
              </div>
            ` : s.cart.map(item => `
              <div class="cart-item-row">
                <div class="item-info">
                  <span class="item-title">${item.name}</span>
                  <span class="item-meta">₹${item.price} × ${item.qty}</span>
                </div>
                <div class="item-qty-controls">
                  <button class="qty-btn" onclick="devcraftDemos.cravexUpdateQty(${item.id}, -1)">−</button>
                  <span class="qty-count">${item.qty}</span>
                  <button class="qty-btn" onclick="devcraftDemos.cravexUpdateQty(${item.id}, 1)">+</button>
                </div>
              </div>
            `).join('')}
          </div>

          ${s.cart.length > 0 ? `
            <div class="cart-totals-summary">
              <div class="summary-line"><span>Subtotal</span><span>₹${subtotal}</span></div>
              <div class="summary-line"><span>Delivery Fee</span><span>₹${deliveryFee}</span></div>
              <div class="summary-line"><span>GST (5%)</span><span>₹${taxes}</span></div>
              <div class="summary-line total-line"><span>Total Due</span><span class="text-gradient">₹${total}</span></div>

              <button class="btn btn-emerald btn-block" onclick="devcraftDemos.cravexSetStep('tracking')">
                Place Order & Track Live 🛵
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 2. FITCORE DEMO CONTROLLER
  // ==========================================
  function renderFitCore() {
    const container = document.getElementById('demo-interactive-stage');
    if (!container) return;
    const s = state.fitcore;

    container.innerHTML = `
      <div class="fitcore-stage">
        <div class="fitcore-nav-toggle">
          <div class="switch-badge-group">
            <button class="btn btn-sm ${s.viewMode === 'member' ? 'btn-primary' : 'btn-outline'}" onclick="devcraftDemos.fitcoreSetView('member')">
              👤 Member App View
            </button>
            <button class="btn btn-sm ${s.viewMode === 'admin' ? 'btn-primary' : 'btn-outline'}" onclick="devcraftDemos.fitcoreSetView('admin')">
              📊 Gym Owner Admin Cockpit
            </button>
          </div>
          <span class="fitcore-status-tag"><span class="pulse-dot"></span> Franchise Node #04 (Gurugram)</span>
        </div>

        ${s.viewMode === 'member' ? `
          <div class="fitcore-member-view">
            <div class="fitcore-kpi-grid">
              <div class="fitcore-card">
                <div class="card-label">Membership Tier</div>
                <div class="card-val text-gradient">Pro All-Access</div>
                <div class="card-sub">Renews in 18 days (Auto-debit active)</div>
              </div>
              <div class="fitcore-card">
                <div class="card-label">Monthly Workouts</div>
                <div class="card-val text-emerald">14 / 20 Days</div>
                <div class="card-sub">Top 5% gym consistency this month</div>
              </div>
              <div class="fitcore-card">
                <div class="card-label">Assigned Coach</div>
                <div class="card-val">Coach Vikram</div>
                <div class="card-sub">Next session: Tomorrow 07:00 AM</div>
              </div>
            </div>

            <div class="fitcore-action-grid">
              <!-- QR Check-in Simulator -->
              <div class="fitcore-card qr-checkin-card">
                <h4>Contactless QR Turnstile Check-in</h4>
                <p>Simulate walking past the optical turnstiles at the gym entrance.</p>
                <div class="simulated-qr-box">
                  <div class="qr-crosshairs"></div>
                  <div class="qr-code-graphic"></div>
                </div>
                <button class="btn ${s.checkedIn ? 'btn-emerald' : 'btn-primary'} btn-block" onclick="devcraftDemos.fitcoreToggleCheckIn()">
                  ${s.checkedIn ? '✓ Turnstile Unlocked (Checked In)' : 'Scan Pass at Turnstile'}
                </button>
                ${s.checkedIn ? `<div class="checkin-alert text-emerald">Gate opened! Welcome back, Aarav. Streak: 14 Days.</div>` : ''}
              </div>

              <!-- Personal Trainer Booking -->
              <div class="fitcore-card">
                <h4>Book Trainer Slot</h4>
                <div class="trainer-slot-picker">
                  <label class="input-label">Select Session Type</label>
                  <select class="form-control" id="fc-session-type">
                    <option>HIIT & Functional Circuit (45m)</option>
                    <option>Powerlifting & Deadlift Technique (60m)</option>
                    <option>Mobility & Post-Workout Rehab (30m)</option>
                  </select>

                  <label class="input-label" style="margin-top: 10px;">Available Tomorrow</label>
                  <div class="slots-pill-group">
                    <button class="slot-pill active" onclick="this.classList.toggle('active')">07:00 AM</button>
                    <button class="slot-pill" onclick="this.classList.toggle('active')">09:30 AM</button>
                    <button class="slot-pill" onclick="this.classList.toggle('active')">05:30 PM</button>
                    <button class="slot-pill" onclick="this.classList.toggle('active')">07:00 PM</button>
                  </div>

                  <button class="btn btn-outline btn-block" style="margin-top: 15px;" onclick="alert('Session Confirmed with Coach Vikram! Added to your Google Calendar.')">
                    Confirm Trainer Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        ` : `
          <div class="fitcore-admin-view">
            <div class="fitcore-kpi-grid">
              <div class="fitcore-card">
                <div class="card-label">Monthly Recurring Revenue (MRR)</div>
                <div class="card-val text-gradient">₹4,82,500</div>
                <div class="card-sub text-emerald">▲ +18.4% vs last month</div>
              </div>
              <div class="fitcore-card">
                <div class="card-label">Active Paid Subscribers</div>
                <div class="card-val text-cyan">412 Members</div>
                <div class="card-sub">Churn rate: 1.8% (Industry avg 8%)</div>
              </div>
              <div class="fitcore-card">
                <div class="card-label">Today Turnstile Traffic</div>
                <div class="card-val text-emerald">184 Check-ins</div>
                <div class="card-sub">Peak hour: 06:30 PM – 08:30 PM</div>
              </div>
            </div>

            <!-- Member Management Table -->
            <div class="fitcore-card" style="margin-top: 15px;">
              <div class="table-header-flex">
                <h4>Subscriber Roster & Auto-Renewals</h4>
                <button class="btn btn-xs btn-primary" onclick="devcraftDemos.fitcoreAddMockMember()">+ Quick Add Member</button>
              </div>
              <div class="table-responsive">
                <table class="devcraft-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Member Name</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Renewal In</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${s.members.map(m => `
                      <tr>
                        <td><code>${m.id}</code></td>
                        <td><strong>${m.name}</strong></td>
                        <td><span class="badge-subtle">${m.plan}</span></td>
                        <td>
                          <span class="status-chip ${m.status === 'Active' ? 'chip-active' : 'chip-pending'}">
                            ${m.status}
                          </span>
                        </td>
                        <td>${m.renewal}</td>
                        <td>
                          <button class="btn btn-xs btn-outline" onclick="devcraftDemos.fitcoreToggleMemberStatus('${m.id}')">
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `}
      </div>
    `;
  }

  // ==========================================
  // 3. EDUNOVA LMS CONTROLLER
  // ==========================================
  function renderEduNova() {
    const container = document.getElementById('demo-interactive-stage');
    if (!container) return;
    const s = state.edunova;

    container.innerHTML = `
      <div class="edunova-stage">
        <!-- Progress Ribbon -->
        <div class="edunova-progress-ribbon">
          <div class="course-meta">
            <h4>Full-Stack Cloud Architecture & Microservices Mastery</h4>
            <span class="badge-subtle">Instructor: DevCraft Principal Engineer</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-label">Course Progress: <strong>${s.progress}%</strong></div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${s.progress}%;"></div>
            </div>
          </div>
        </div>

        <div class="edunova-grid">
          <!-- Video Player Stage -->
          <div class="edunova-player-box">
            <div class="simulated-video-screen">
              <div class="video-overlay">
                <div class="video-watermark">DEVCRAFT EDUNOVA LMS • 1080p HD</div>
                <div class="video-center-controls">
                  <button class="video-play-btn" onclick="devcraftDemos.edunovaTogglePlay()">
                    ${s.isPlaying ? '❚❚ Pause' : '▶ Play Stream'}
                  </button>
                </div>
                <div class="video-scrubber-bar">
                  <div class="video-scrubber-fill" style="width: 58%;"></div>
                </div>
                <div class="video-bottom-hud">
                  <span>14:20 / 24:45</span>
                  <span>Lesson 2.4: Redis Geo-Spatial Indexing for Courier Routing</span>
                  <span class="badge-xs">Adaptive HLS</span>
                </div>
              </div>
            </div>

            <!-- Notes Notepad -->
            <div class="edunova-notes-card">
              <div class="notes-header">
                <strong>📝 Interactive Student Notepad</strong>
                <small class="text-muted">Auto-saves to browser storage</small>
              </div>
              <textarea class="form-control" rows="2" onchange="devcraftDemos.edunovaSaveNotes(this.value)">${s.notes}</textarea>
            </div>
          </div>

          <!-- Knowledge Check Quiz -->
          <div class="edunova-quiz-card">
            <h4>Knowledge Checkpoint Quiz</h4>
            <p class="quiz-sub">Answer correctly to unlock the graduation certificate.</p>

            <div class="quiz-questions-list">
              <div class="quiz-q-block">
                <p><strong>Q1: Which database engine is optimal for sub-millisecond courier geospatial radius queries?</strong></p>
                <label class="quiz-opt">
                  <input type="radio" name="q1" value="redis" ${s.quizAnswers.q1 === 'redis' ? 'checked' : ''} onchange="devcraftDemos.edunovaAnswer('q1', 'redis')" />
                  <span>Redis (GEOADD / GEORADIUS)</span>
                </label>
                <label class="quiz-opt">
                  <input type="radio" name="q1" value="sqlite" ${s.quizAnswers.q1 === 'sqlite' ? 'checked' : ''} onchange="devcraftDemos.edunovaAnswer('q1', 'sqlite')" />
                  <span>Flat SQLite file</span>
                </label>
              </div>

              <div class="quiz-q-block">
                <p><strong>Q2: What is the main security purpose of Content Security Policy (CSP)?</strong></p>
                <label class="quiz-opt">
                  <input type="radio" name="q2" value="csp_xss" ${s.quizAnswers.q2 === 'csp_xss' ? 'checked' : ''} onchange="devcraftDemos.edunovaAnswer('q2', 'csp_xss')" />
                  <span>Prevent Cross-Site Scripting (XSS) & unauthorized script injection</span>
                </label>
                <label class="quiz-opt">
                  <input type="radio" name="q2" value="csp_gzip" ${s.quizAnswers.q2 === 'csp_gzip' ? 'checked' : ''} onchange="devcraftDemos.edunovaAnswer('q2', 'csp_gzip')" />
                  <span>Compress static images</span>
                </label>
              </div>
            </div>

            <button class="btn btn-primary btn-block" style="margin-top: 15px;" onclick="devcraftDemos.edunovaSubmitQuiz()">
              Submit Knowledge Check
            </button>

            ${s.quizSubmitted ? `
              <div class="quiz-result-banner ${s.quizScore === 2 ? 'result-success' : 'result-partial'}">
                <strong>Score: ${s.quizScore}/2 Correct!</strong>
                ${s.quizScore === 2 
                  ? `<p>Outstanding! You have qualified for your verified certificate.</p><button class="btn btn-xs btn-emerald" onclick="devcraftDemos.edunovaShowCertificate()">View Certificate of Completion</button>`
                  : `<p>Review the questions above and try again to score 100%.</p>`}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 4. ESTATEX REAL ESTATE CONTROLLER
  // ==========================================
  const estatexProperties = [
    { id: 1, title: 'The Sky Penthouse at Golf Links', type: 'penthouse', price: 68000000, priceFormatted: '₹6.80 Cr', beds: 4, baths: 5, area: '5,200 sq.ft', location: 'DLF Phase V, Gurugram', rating: 5.0 },
    { id: 2, title: 'The Azure Waterfront Villa', type: 'villa', price: 42000000, priceFormatted: '₹4.20 Cr', beds: 5, baths: 6, area: '4,800 sq.ft', location: 'Goa Coastal Enclave', rating: 4.9 },
    { id: 3, title: 'Apex Industrial Loft Suite', type: 'loft', price: 18500000, priceFormatted: '₹1.85 Cr', beds: 2, baths: 2, area: '1,950 sq.ft', location: 'Indiranagar, Bengaluru', rating: 4.8 },
    { id: 4, title: 'Serene Hills Eco Manor', type: 'villa', price: 34000000, priceFormatted: '₹3.40 Cr', beds: 4, baths: 4, area: '3,800 sq.ft', location: 'Kasauli Hills, HP', rating: 4.9 }
  ];

  function renderEstateX() {
    const container = document.getElementById('demo-interactive-stage');
    if (!container) return;
    const s = state.estatex;

    const filtered = estatexProperties.filter(p => {
      const matchType = s.filterType === 'all' || p.type === s.filterType;
      const matchPrice = p.price <= s.maxPrice;
      return matchType && matchPrice;
    });

    // EMI Calculation
    const P = s.loanAmount;
    const r = (s.interestRate / 12) / 100;
    const n = s.loanTenure * 12;
    const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    container.innerHTML = `
      <div class="estatex-stage">
        <!-- Filter Controls -->
        <div class="estatex-controls-bar">
          <div class="filter-pills">
            <button class="pill-btn ${s.filterType === 'all' ? 'active' : ''}" onclick="devcraftDemos.estatexSetFilter('all')">All Estates</button>
            <button class="pill-btn ${s.filterType === 'penthouse' ? 'active' : ''}" onclick="devcraftDemos.estatexSetFilter('penthouse')">Penthouses</button>
            <button class="pill-btn ${s.filterType === 'villa' ? 'active' : ''}" onclick="devcraftDemos.estatexSetFilter('villa')">Villas</button>
            <button class="pill-btn ${s.filterType === 'loft' ? 'active' : ''}" onclick="devcraftDemos.estatexSetFilter('loft')">Designer Lofts</button>
          </div>
          <div class="price-slider-wrap">
            <span class="slider-label">Max Budget: <strong>₹${(s.maxPrice / 10000000).toFixed(1)} Cr</strong></span>
            <input type="range" min="15000000" max="80000000" step="5000000" value="${s.maxPrice}" oninput="devcraftDemos.estatexSetMaxPrice(this.value)" />
          </div>
        </div>

        <div class="estatex-grid">
          <!-- Property Listings -->
          <div class="estatex-cards-col">
            ${filtered.map(prop => `
              <div class="estatex-card">
                <div class="estatex-card-header">
                  <span class="badge-subtle">${prop.type.toUpperCase()}</span>
                  <span class="estatex-price">${prop.priceFormatted}</span>
                </div>
                <h4 class="prop-title">${prop.title}</h4>
                <div class="prop-location">📍 ${prop.location}</div>
                <div class="prop-specs-row">
                  <span>🛏 ${prop.beds} Beds</span>
                  <span>🛁 ${prop.baths} Baths</span>
                  <span>📐 ${prop.area}</span>
                </div>
                <div class="prop-actions">
                  <button class="btn btn-xs btn-primary" onclick="devcraftDemos.estatexBookTour('${prop.title}')">
                    Schedule Private Tour
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Mortgage Calculator -->
          <div class="estatex-calc-card">
            <h4>Interactive Mortgage Calculator</h4>
            <p class="calc-sub">Estimate monthly EMI for institutional lenders.</p>

            <div class="calc-field">
              <label>Loan Amount: <strong>₹${(s.loanAmount / 100000).toFixed(1)} Lakhs</strong></label>
              <input type="range" min="5000000" max="60000000" step="1000000" value="${s.loanAmount}" oninput="devcraftDemos.estatexSetLoan(this.value)" />
            </div>

            <div class="calc-field">
              <label>Interest Rate: <strong>${s.interestRate}%</strong></label>
              <input type="range" min="6.5" max="12.0" step="0.1" value="${s.interestRate}" oninput="devcraftDemos.estatexSetRate(this.value)" />
            </div>

            <div class="calc-field">
              <label>Tenure: <strong>${s.loanTenure} Years</strong></label>
              <input type="range" min="5" max="30" step="1" value="${s.loanTenure}" oninput="devcraftDemos.estatexSetTenure(this.value)" />
            </div>

            <div class="calc-result-box">
              <div class="result-label">Estimated Monthly EMI</div>
              <div class="result-value text-gradient">₹${emi.toLocaleString('en-IN')} / Mo</div>
              <div class="result-sub">Principal + Interest (Zero Prepayment Penalty)</div>
            </div>

            ${s.tourBooked ? `
              <div class="tour-confirmation-banner text-emerald">
                ✓ Private Tour Scheduled for <strong>${s.selectedProperty}</strong>! Our estate concierge will contact you via WhatsApp.
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 5. JARVIS AI WORKSPACE CONTROLLER
  // ==========================================
  const jarvisResponses = {
    architect: {
      default: "From an architectural perspective, we should decouple client state from persistent databases using an event-driven pub/sub bus (such as Kafka or Redis Streams). This guarantees 99.99% uptime and shields downstream services from burst traffic.",
      db: "For high-concurrency relational queries with geo-spatial filtering, I recommend PostgreSQL 16 with the PostGIS extension, paired with Redis for sub-10ms caching of warm read queries.",
      auth: "For enterprise security, enforce short-lived (15 min) asymmetric RS256 JWT access tokens stored in HttpOnly SameSite=Strict cookies, paired with encrypted sliding refresh tokens in Redis."
    },
    reviewer: {
      default: "Code Review Alert: Ensure all asynchronous handlers in Express.js are wrapped with central error middleware to prevent unhandled promise rejections that crash Node.js processes.",
      db: "Potential bottleneck detected: Missing compound indexes on `[tenant_id, created_at]`. Without this, queries on multi-tenant tables cause full table scans under load.",
      auth: "Security vulnerability notice: Never store raw passwords or API keys in code repositories. Always pass them through environment variables with automated secret scanning in CI/CD."
    },
    analyst: {
      default: "Telemetry telemetry indicates: Average API response latency is 68ms (p95: 142ms). Memory footprint is steady at 240MB across 4 worker threads. Conversion funnel dropoff is 3.1%.",
      db: "Query performance metrics: The top slow query is `SELECT * FROM audits WHERE timestamp > NOW() - 30d`. Adding a partitioned monthly table will drop query time by 82%.",
      auth: "Login analytics: 94.2% of users successfully authenticate via Google OAuth in under 1.2 seconds. Failed attempts have dropped below 0.4% following rate limiter activation."
    }
  };

  function renderJarvisAI() {
    const container = document.getElementById('demo-interactive-stage');
    if (!container) return;
    const s = state.jarvis;

    container.innerHTML = `
      <div class="jarvis-stage">
        <!-- Persona Bar -->
        <div class="jarvis-header-bar">
          <div class="persona-pills">
            <button class="pill-btn ${s.persona === 'architect' ? 'active' : ''}" onclick="devcraftDemos.jarvisSetPersona('architect')">
              🏛 System Architect
            </button>
            <button class="pill-btn ${s.persona === 'reviewer' ? 'active' : ''}" onclick="devcraftDemos.jarvisSetPersona('reviewer')">
              🔍 Senior Code Reviewer
            </button>
            <button class="pill-btn ${s.persona === 'analyst' ? 'active' : ''}" onclick="devcraftDemos.jarvisSetPersona('analyst')">
              📊 Data & Telemetry Analyst
            </button>
          </div>
          <div class="jarvis-telemetry-pill">
            <span class="pulse-dot"></span> Model: GPT-4o Enterprise (120ms Latency)
          </div>
        </div>

        <!-- Chat Feed -->
        <div class="jarvis-chat-feed" id="jarvis-chat-feed">
          ${s.messages.map(m => `
            <div class="jarvis-msg ${m.sender === 'user' ? 'user-msg' : 'ai-msg'}">
              <div class="msg-avatar">${m.sender === 'user' ? '👤' : '🤖'}</div>
              <div class="msg-bubble">
                <div class="msg-meta">${m.sender === 'user' ? 'You' : `Jarvis AI (${s.persona})`}</div>
                <div class="msg-content">${m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
              </div>
            </div>
          `).join('')}
          ${s.isTyping ? `
            <div class="jarvis-msg ai-msg">
              <div class="msg-avatar">🤖</div>
              <div class="msg-bubble">
                <div class="typing-indicator"><span></span><span></span><span></span></div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Prompt Suggestions -->
        <div class="jarvis-suggestions">
          <button class="sug-btn" onclick="devcraftDemos.jarvisAsk('How should we structure multi-tenant PostgreSQL databases?')">
            💡 DB Indexing Strategy
          </button>
          <button class="sug-btn" onclick="devcraftDemos.jarvisAsk('What are the best practices for secure JWT authentication in 2026?')">
            🔐 JWT Security Audit
          </button>
          <button class="sug-btn" onclick="devcraftDemos.jarvisAsk('How can we reduce React re-renders in real-time dashboards?')">
            ⚡ React Performance
          </button>
        </div>

        <!-- Input Bar -->
        <div class="jarvis-input-bar">
          <input type="text" id="jarvis-user-input" class="form-control" placeholder="Ask Jarvis anything about architecture, full-stack code, or deployment..." onkeydown="if(event.key === 'Enter') devcraftDemos.jarvisSend()" />
          <button class="btn btn-primary" onclick="devcraftDemos.jarvisSend()">Send Prompt →</button>
        </div>
      </div>
    `;

    // Scroll chat to bottom
    const feed = document.getElementById('jarvis-chat-feed');
    if (feed) feed.scrollTop = feed.scrollHeight;
  }

  // ==========================================
  // 6. BUSINESS WEBSITE / NEXUS CORP CONTROLLER
  // ==========================================
  function renderBusinessWebsite() {
    const container = document.getElementById('demo-interactive-stage');
    if (!container) return;
    const s = state.business;

    // ROI Calculation
    const currentLeads = Math.round((s.monthlyVisitors * s.conversionRate) / 100);
    const optimizedRate = (s.conversionRate * 1.8).toFixed(1);
    const optimizedLeads = Math.round((s.monthlyVisitors * optimizedRate) / 100);
    const extraLeads = optimizedLeads - currentLeads;
    const extraRevenue = Math.round((extraLeads * s.avgOrderValue) / 100000);

    container.innerHTML = `
      <div class="business-stage theme-${s.theme}">
        <!-- Theme Controls -->
        <div class="business-controls">
          <span class="control-label">Corporate Visual Style:</span>
          <button class="btn btn-xs ${s.theme === 'executive-dark' ? 'btn-primary' : 'btn-outline'}" onclick="devcraftDemos.businessSetTheme('executive-dark')">Executive Dark</button>
          <button class="btn btn-xs ${s.theme === 'cyber-sapphire' ? 'btn-primary' : 'btn-outline'}" onclick="devcraftDemos.businessSetTheme('cyber-sapphire')">Cyber Sapphire</button>
          <button class="btn btn-xs ${s.theme === 'luxury-gold' ? 'btn-primary' : 'btn-outline'}" onclick="devcraftDemos.businessSetTheme('luxury-gold')">Luxury Gold</button>
        </div>

        <!-- Simulated Corporate Hero -->
        <div class="business-preview-hero">
          <div class="biz-badge">NEXUS GLOBAL ENTERPRISE SOLUTIONS</div>
          <h2 class="biz-title">Accelerating Digital Transformation With Production Code</h2>
          <p class="biz-desc">We build enterprise software, secure financial architectures, and conversion-optimized websites that scale to millions of users.</p>
        </div>

        <!-- Interactive ROI Calculator -->
        <div class="business-roi-card">
          <h4>Interactive Website ROI & Conversion Uplift Calculator</h4>
          <p class="roi-sub">See how DevCraft’s sub-second performance directly impacts your bottom line.</p>

          <div class="roi-inputs-grid">
            <div class="roi-input-field">
              <label>Monthly Website Traffic: <strong>${s.monthlyVisitors.toLocaleString()} Visitors</strong></label>
              <input type="range" min="5000" max="250000" step="5000" value="${s.monthlyVisitors}" oninput="devcraftDemos.businessSetVisitors(this.value)" />
            </div>
            <div class="roi-input-field">
              <label>Current Conversion Rate: <strong>${s.conversionRate}%</strong></label>
              <input type="range" min="0.5" max="8.0" step="0.1" value="${s.conversionRate}" oninput="devcraftDemos.businessSetRate(this.value)" />
            </div>
            <div class="roi-input-field">
              <label>Average Deal / Order Value: <strong>₹${s.avgOrderValue.toLocaleString()}</strong></label>
              <input type="range" min="1000" max="25000" step="500" value="${s.avgOrderValue}" oninput="devcraftDemos.businessSetAOV(this.value)" />
            </div>
          </div>

          <div class="roi-results-grid">
            <div class="roi-res-box">
              <div class="roi-res-num">${currentLeads} / mo</div>
              <div class="roi-res-lbl">Current Qualified Leads</div>
            </div>
            <div class="roi-res-box highlight">
              <div class="roi-res-num text-emerald">${optimizedLeads} / mo (+${extraLeads})</div>
              <div class="roi-res-lbl">Projected Leads With DevCraft</div>
            </div>
            <div class="roi-res-box highlight-revenue">
              <div class="roi-res-num text-gradient">+ ₹${extraRevenue} Lakhs / Mo</div>
              <div class="roi-res-lbl">Estimated Extra Monthly Revenue</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 7. NOVACART E-COMMERCE CONTROLLER
  // ==========================================
  const novacartProducts = [
    { id: 101, name: 'DevCraft Precision Mechanical Keyboard', category: 'hardware', price: 8999, originalPrice: 11999, rating: 4.9, reviews: 248, desc: 'Hot-swappable tactile switches, CNC aluminum chassis, wireless 2.4GHz & Bluetooth 5.2', inStock: 14 },
    { id: 102, name: 'Ergonomic Vertical Carbon Mouse', category: 'hardware', price: 4499, originalPrice: 5999, rating: 4.8, reviews: 112, desc: 'Natural 57-degree handshake grip, PixArt 16,000 DPI optical sensor & silent clicks', inStock: 28 },
    { id: 103, name: 'Spatial Audio Noise-Canceling Headphones', category: 'audio', price: 14999, originalPrice: 18999, rating: 5.0, reviews: 490, desc: 'Hybrid active noise cancellation, custom 40mm beryllium drivers & 40-hour battery life', inStock: 8 },
    { id: 104, name: 'Developer Smart Chronograph Watch', category: 'wearables', price: 19999, originalPrice: 24999, rating: 4.9, reviews: 174, desc: 'Sapphire glass, titanium casing, automated GitHub commit push notifications & heart sensor', inStock: 5 },
    { id: 105, name: 'Studio Monitoring Desktop Speakers', category: 'audio', price: 12499, originalPrice: 15499, rating: 4.7, reviews: 88, desc: 'True bi-amplified studio acoustic curve, aptX HD Bluetooth & balanced TRS inputs', inStock: 12 }
  ];

  function renderNovaCart() {
    const container = document.getElementById('demo-interactive-stage');
    if (!container) return;
    const s = state.novacart;

    const filtered = s.category === 'all'
      ? novacartProducts
      : novacartProducts.filter(p => p.category === s.category);

    const subtotal = s.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountAmount = s.couponApplied ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
    const grandTotal = subtotal - discountAmount + shipping;

    container.innerHTML = `
      <div class="novacart-stage">
        <!-- Store Header -->
        <div class="novacart-header">
          <div class="filter-pills">
            <button class="pill-btn ${s.category === 'all' ? 'active' : ''}" onclick="devcraftDemos.novacartFilter('all')">All Products</button>
            <button class="pill-btn ${s.category === 'hardware' ? 'active' : ''}" onclick="devcraftDemos.novacartFilter('hardware')">Developer Hardware</button>
            <button class="pill-btn ${s.category === 'audio' ? 'active' : ''}" onclick="devcraftDemos.novacartFilter('audio')">Acoustic Audio</button>
            <button class="pill-btn ${s.category === 'wearables' ? 'active' : ''}" onclick="devcraftDemos.novacartFilter('wearables')">Smart Wearables</button>
          </div>

          <button class="btn btn-sm btn-primary novacart-cart-trigger" onclick="devcraftDemos.novacartToggleCart()">
            🛒 View Cart (${s.cart.reduce((a, b) => a + b.qty, 0)}) • ₹${grandTotal}
          </button>
        </div>

        <div class="novacart-body-grid">
          <!-- Products Catalog -->
          <div class="novacart-catalog-grid">
            ${filtered.map(p => `
              <div class="novacart-product-card">
                <div class="prod-badge-row">
                  <span class="badge-subtle">${p.category.toUpperCase()}</span>
                  <span class="stock-badge">${p.inStock} Left</span>
                </div>
                <h4 class="prod-title">${p.name}</h4>
                <p class="prod-desc">${p.desc}</p>
                <div class="prod-price-row">
                  <div>
                    <span class="price-current">₹${p.price.toLocaleString()}</span>
                    <span class="price-original">₹${p.originalPrice.toLocaleString()}</span>
                  </div>
                  <span class="prod-rating">★ ${p.rating} (${p.reviews})</span>
                </div>
                <button class="btn btn-xs btn-primary btn-block" onclick="devcraftDemos.novacartAddToCart(${p.id})">
                  Add to Cart 🛍
                </button>
              </div>
            `).join('')}
          </div>

          <!-- Slide-out Cart Drawer -->
          <div class="novacart-cart-drawer ${s.cartOpen ? 'open' : ''}">
            <div class="cart-drawer-header">
              <h4>Shopping Cart (${s.cart.reduce((a, b) => a + b.qty, 0)})</h4>
              <button class="drawer-close" onclick="devcraftDemos.novacartToggleCart()">&times;</button>
            </div>

            <div class="drawer-items-list">
              ${s.cart.length === 0 ? `
                <div class="empty-cart-state">
                  <p>Your shopping cart is currently empty. Click "Add to Cart" on any product!</p>
                </div>
              ` : s.cart.map(item => `
                <div class="drawer-item-row">
                  <div class="item-meta">
                    <strong>${item.name}</strong>
                    <small>₹${item.price.toLocaleString()} each</small>
                  </div>
                  <div class="item-qty-controls">
                    <button class="qty-btn" onclick="devcraftDemos.novacartUpdateQty(${item.id}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="devcraftDemos.novacartUpdateQty(${item.id}, 1)">+</button>
                  </div>
                </div>
              `).join('')}
            </div>

            ${s.cart.length > 0 ? `
              <!-- Coupon Box -->
              <div class="coupon-box">
                <input type="text" id="novacart-coupon-input" class="form-control" placeholder="Promo code (try DEVCRAFT10)" />
                <button class="btn btn-xs btn-outline" onclick="devcraftDemos.novacartApplyCoupon()">Apply</button>
              </div>
              ${s.couponApplied ? `<div class="coupon-success text-emerald">✓ Coupon DEVCRAFT10 applied: 10% OFF!</div>` : ''}

              <div class="drawer-summary">
                <div class="summary-line"><span>Subtotal</span><span>₹${subtotal.toLocaleString()}</span></div>
                ${s.couponApplied ? `<div class="summary-line text-emerald"><span>Discount (10%)</span><span>- ₹${discountAmount.toLocaleString()}</span></div>` : ''}
                <div class="summary-line"><span>Express Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
                <div class="summary-line total-line"><span>Total</span><span class="text-gradient">₹${grandTotal.toLocaleString()}</span></div>

                <button class="btn btn-emerald btn-block" onclick="devcraftDemos.novacartCheckout()">
                  Simulate Express Checkout ⚡
                </button>
              </div>
            ` : ''}
          </div>
        </div>

        ${s.orderSuccess ? `
          <div class="novacart-order-modal">
            <div class="order-modal-card">
              <div class="modal-icon">🎉</div>
              <h3>Order Placed Successfully!</h3>
              <p>Tracking Number: <strong>${s.orderSuccess.tracking}</strong></p>
              <p>Amount Paid: <strong>₹${s.orderSuccess.total.toLocaleString()}</strong> via Razorpay Secure Gateway</p>
              <button class="btn btn-primary" onclick="devcraftDemos.novacartDismissOrder()">Back to Shop</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // ==========================================
  // 8. TIMESLOT PRO CONTROLLER
  // ==========================================
  function renderTimeSlotPro() {
    const container = document.getElementById('demo-interactive-stage');
    if (!container) return;
    const s = state.timeslot;

    container.innerHTML = `
      <div class="timeslot-stage">
        <div class="timeslot-wizard-header">
          <div class="wizard-step active"><span>1</span> Select Session</div>
          <div class="wizard-step ${s.selectedDate ? 'active' : ''}"><span>2</span> Pick Date & Slot</div>
          <div class="wizard-step ${s.confirmedBooking ? 'active' : ''}"><span>3</span> Instant Confirmation</div>
        </div>

        ${s.confirmedBooking ? `
          <div class="timeslot-confirmed-card">
            <div class="confirmed-icon">📅</div>
            <h3>Appointment Confirmed!</h3>
            <div class="confirmed-details">
              <div><strong>Service:</strong> ${s.confirmedBooking.service}</div>
              <div><strong>Scheduled For:</strong> ${s.confirmedBooking.date} at ${s.confirmedBooking.time}</div>
              <div><strong>Invitee:</strong> ${s.confirmedBooking.name} (${s.confirmedBooking.email})</div>
              <div><strong>Meeting Room:</strong> Google Meet (Link sent to inbox)</div>
            </div>
            <button class="btn btn-primary" onclick="devcraftDemos.timeslotReset()">Book Another Consultation</button>
          </div>
        ` : `
          <div class="timeslot-grid">
            <!-- Step 1 & 2 Inputs -->
            <div class="timeslot-card">
              <h4>1. Choose Consultation Type</h4>
              <div class="service-options-list">
                <label class="service-radio-card ${s.selectedService.includes('Architecture') ? 'selected' : ''}">
                  <input type="radio" name="ts-service" checked onchange="devcraftDemos.timeslotSetService('Tech Architecture & System Blueprint', '60 mins')" />
                  <div>
                    <strong>Tech Architecture & System Blueprint</strong>
                    <small>60 mins • Free Strategy Call with Senior Architect</small>
                  </div>
                </label>
                <label class="service-radio-card ${s.selectedService.includes('Code Review') ? 'selected' : ''}">
                  <input type="radio" name="ts-service" onchange="devcraftDemos.timeslotSetService('Full-Stack Code Audit & Optimization', '45 mins')" />
                  <div>
                    <strong>Full-Stack Code Audit & Optimization</strong>
                    <small>45 mins • Performance bottleneck inspection</small>
                  </div>
                </label>
                <label class="service-radio-card ${s.selectedService.includes('Mobile') ? 'selected' : ''}">
                  <input type="radio" name="ts-service" onchange="devcraftDemos.timeslotSetService('Mobile App Scoping & Cost Estimation', '30 mins')" />
                  <div>
                    <strong>Mobile App Scoping & Cost Estimation</strong>
                    <small>30 mins • React Native & Android feasibility review</small>
                  </div>
                </label>
              </div>

              <h4 style="margin-top: 20px;">2. Pick Available Date</h4>
              <input type="date" id="ts-date-picker" class="form-control" value="${s.selectedDate || '2026-09-15'}" onchange="devcraftDemos.timeslotSetDate(this.value)" />

              <h4 style="margin-top: 20px;">3. Select Time Window</h4>
              <div class="slots-pill-group">
                <button class="slot-pill ${s.selectedTime === '10:00 AM' ? 'active' : ''}" onclick="devcraftDemos.timeslotSetTime('10:00 AM')">10:00 AM</button>
                <button class="slot-pill ${s.selectedTime === '11:30 AM' ? 'active' : ''}" onclick="devcraftDemos.timeslotSetTime('11:30 AM')">11:30 AM</button>
                <button class="slot-pill ${s.selectedTime === '02:00 PM' ? 'active' : ''}" onclick="devcraftDemos.timeslotSetTime('02:00 PM')">02:00 PM</button>
                <button class="slot-pill ${s.selectedTime === '04:30 PM' ? 'active' : ''}" onclick="devcraftDemos.timeslotSetTime('04:30 PM')">04:30 PM</button>
                <button class="slot-pill ${s.selectedTime === '06:00 PM' ? 'active' : ''}" onclick="devcraftDemos.timeslotSetTime('06:00 PM')">06:00 PM</button>
              </div>
            </div>

            <!-- Step 3 User Info -->
            <div class="timeslot-card">
              <h4>Your Contact Information</h4>
              <div class="form-group">
                <label class="input-label">Your Full Name *</label>
                <input type="text" id="ts-name" class="form-control" placeholder="e.g. Rahul Verma" value="Rahul Verma" />
              </div>
              <div class="form-group">
                <label class="input-label">Work Email *</label>
                <input type="email" id="ts-email" class="form-control" placeholder="rahul@company.com" value="rahul@company.com" />
              </div>
              <div class="form-group">
                <label class="input-label">Project Summary / Questions</label>
                <textarea id="ts-notes" class="form-control" rows="3" placeholder="Briefly describe what you'd like to build...">We are planning to build a cross-platform mobile delivery app and need high-level architecture validation.</textarea>
              </div>

              <div class="booking-summary-pill">
                <strong>Selected:</strong> ${s.selectedService} on <strong>${s.selectedDate || '2026-09-15'}</strong> at <strong>${s.selectedTime}</strong>
              </div>

              <button class="btn btn-primary btn-block" style="margin-top: 15px;" onclick="devcraftDemos.timeslotSubmit()">
                Confirm & Sync with Google Calendar →
              </button>
            </div>
          </div>
        `}
      </div>
    `;
  }

  // ==========================================
  // 9. NEXUS ADMIN DASHBOARD CONTROLLER
  // ==========================================
  function renderNexusAdmin() {
    const container = document.getElementById('demo-interactive-stage');
    if (!container) return;
    const s = state.nexus;

    const metricMultiplier = s.timeframe === 'daily' ? 0.15 : (s.timeframe === 'weekly' ? 1 : 4.2);
    const revenueFormatted = Math.round(14200000 * metricMultiplier).toLocaleString('en-IN');
    const apiRequests = (48.9 * metricMultiplier).toFixed(1);

    container.innerHTML = `
      <div class="nexus-admin-stage">
        <!-- Top Toolbar -->
        <div class="nexus-toolbar">
          <div class="timeframe-toggle">
            <button class="btn btn-xs ${s.timeframe === 'daily' ? 'btn-primary' : 'btn-outline'}" onclick="devcraftDemos.nexusSetTimeframe('daily')">Today</button>
            <button class="btn btn-xs ${s.timeframe === 'weekly' ? 'btn-primary' : 'btn-outline'}" onclick="devcraftDemos.nexusSetTimeframe('weekly')">Last 7 Days</button>
            <button class="btn btn-xs ${s.timeframe === 'monthly' ? 'btn-primary' : 'btn-outline'}" onclick="devcraftDemos.nexusSetTimeframe('monthly')">Last 30 Days</button>
          </div>
          <div class="server-telemetry-pill">
            <span class="pulse-dot"></span> Cluster: 4 Nodes • Uptime 99.99% • Latency 12ms
          </div>
        </div>

        <!-- Metrics Cards -->
        <div class="nexus-kpi-grid">
          <div class="nexus-kpi-card">
            <div class="kpi-label">Gross Processed Volume</div>
            <div class="kpi-value text-gradient">₹${revenueFormatted}</div>
            <div class="kpi-sub text-emerald">▲ +22.4% vs previous window</div>
          </div>
          <div class="nexus-kpi-card">
            <div class="kpi-label">API Throughput</div>
            <div class="kpi-value text-cyan">${apiRequests}M Requests</div>
            <div class="kpi-sub">Avg Error Rate: 0.002%</div>
          </div>
          <div class="nexus-kpi-card">
            <div class="kpi-label">Active Workspaces</div>
            <div class="kpi-value text-emerald">2,419 Organizations</div>
            <div class="kpi-sub">89 enterprise contracts active</div>
          </div>
          <div class="nexus-kpi-card">
            <div class="kpi-label">CPU / RAM Utilization</div>
            <div class="kpi-value text-warning">28% CPU • 4.2GB RAM</div>
            <div class="kpi-sub">Zero scaling bottlenecks</div>
          </div>
        </div>

        <!-- Interactive SVG Chart -->
        <div class="nexus-chart-card">
          <div class="chart-header">
            <h4>Real-Time Ingestion & Transaction Volume</h4>
            <span class="badge-subtle">Aggregated WebSocket Feed</span>
          </div>
          <div class="simulated-svg-chart">
            <svg viewBox="0 0 800 160" class="chart-svg">
              <defs>
                <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.4"/>
                  <stop offset="100%" stop-color="#9d4edd" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0 130 Q 100 80 200 100 T 400 60 T 600 90 T 800 30 L 800 160 L 0 160 Z" fill="url(#chartGrad)"></path>
              <path d="M 0 130 Q 100 80 200 100 T 400 60 T 600 90 T 800 30" fill="none" stroke="#00f2fe" stroke-width="3"></path>
              <circle cx="200" cy="100" r="4" fill="#00f2fe"></circle>
              <circle cx="400" cy="60" r="4" fill="#00f2fe"></circle>
              <circle cx="600" cy="90" r="4" fill="#00f2fe"></circle>
              <circle cx="800" cy="30" r="5" fill="#9d4edd"></circle>
            </svg>
          </div>
        </div>

        <!-- User Management Table -->
        <div class="nexus-users-card">
          <div class="table-header-flex">
            <h4>Enterprise User Access Controls (RBAC)</h4>
            <span class="text-muted" style="font-size: 0.85rem;">Showing ${s.users.length} Active System Administrators</span>
          </div>
          <div class="table-responsive">
            <table class="devcraft-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>MFA</th>
                  <th>Security Action</th>
                </tr>
              </thead>
              <tbody>
                ${s.users.map(u => `
                  <tr>
                    <td><code>${u.id}</code></td>
                    <td><strong>${u.name}</strong></td>
                    <td><span class="badge-subtle">${u.role}</span></td>
                    <td>${u.email}</td>
                    <td>
                      <span class="status-chip ${u.status === 'Active' ? 'chip-active' : 'chip-pending'}">
                        ${u.status}
                      </span>
                    </td>
                    <td>${u.mfa}</td>
                    <td>
                      <button class="btn btn-xs btn-outline" onclick="devcraftDemos.nexusToggleUser('${u.id}')">
                        ${u.status === 'Active' ? 'Suspend Access' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 10. FLOWCRAFT AI AUTOMATION CONTROLLER
  // ==========================================
  function renderFlowCraftAI() {
    const container = document.getElementById('demo-interactive-stage');
    if (!container) return;
    const s = state.flowcraft;

    const pipelineNodes = [
      { id: 1, title: 'Webhook Trigger', desc: 'Inbound Contact Inquiry Received', badge: 'HTTP POST /webhook/lead' },
      { id: 2, title: 'Validation & Filter', desc: 'Verify email & budget threshold', badge: 'Rule: Budget > ₹50,000' },
      { id: 3, title: 'OpenAI GPT-4 Agent', desc: 'Extract intent, categorize tech, write brief', badge: 'Prompt: Senior Tech Scoper' },
      { id: 4, title: 'Multi-Channel Dispatch', desc: 'Slack alert + HubSpot deal created', badge: 'Dispatched to #sales-leads' }
    ];

    container.innerHTML = `
      <div class="flowcraft-stage">
        <div class="flowcraft-header">
          <div class="pipeline-title">
            <h4>Autonomous Lead Enrichment & Routing Pipeline</h4>
            <span class="badge-subtle">Engine: BullMQ + Redis + OpenAI GPT-4</span>
          </div>
          <button class="btn ${s.isRunning ? 'btn-disabled' : 'btn-primary'}" onclick="devcraftDemos.flowcraftRunSimulation()" ${s.isRunning ? 'disabled' : ''}>
            ${s.isRunning ? '⚡ Executing Nodes...' : '▶ Run Workflow Simulation'}
          </button>
        </div>

        <!-- Node Graph -->
        <div class="flowcraft-nodes-grid">
          ${pipelineNodes.map((node, idx) => `
            <div class="flowcraft-node ${s.activeStep === idx + 1 ? 'node-active' : (s.activeStep > idx + 1 ? 'node-completed' : '')}">
              <div class="node-header">
                <span class="node-step-badge">Step ${node.id}</span>
                <span class="node-status-icon">
                  ${s.activeStep > idx + 1 ? '✓' : (s.activeStep === idx + 1 ? '●' : '○')}
                </span>
              </div>
              <h5 class="node-title">${node.title}</h5>
              <p class="node-desc">${node.desc}</p>
              <div class="node-tech-tag"><code>${node.badge}</code></div>
            </div>
          `).join('')}
        </div>

        <!-- Terminal Execution Log -->
        <div class="flowcraft-terminal">
          <div class="terminal-bar">
            <div class="terminal-dots"><span></span><span></span><span></span></div>
            <div class="terminal-title">flowcraft-worker-01: stdout</div>
          </div>
          <div class="terminal-body" id="flowcraft-log-feed">
            ${s.logs.map(log => `
              <div class="terminal-line ${log.includes('SUCCESS') ? 'text-emerald' : ''}">${log}</div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const feed = document.getElementById('flowcraft-log-feed');
    if (feed) feed.scrollTop = feed.scrollHeight;
  }

  // ==========================================
  // PUBLIC MODAL ORCHESTRATION
  // ==========================================
  function openDemoModal(demoId) {
    activeDemoId = demoId;
    clearSimulations();

    const titleEl = document.getElementById('demo-modal-title');
    const subtitleEl = document.getElementById('demo-modal-subtitle');
    const ctaEl = document.getElementById('demo-modal-cta');

    // Title mapping
    const titles = {
      'cravex': { title: 'CraveX — Food Delivery Mobile Experience', sub: 'Native React Native UI, sub-50ms live GPS courier tracking & one-tap order flow' },
      'fitcore': { title: 'FitCore — Gym & Fitness Operations SaaS', sub: 'Dual member & admin portals, contactless QR check-in & automated billing' },
      'edunova': { title: 'EduNova — Interactive Learning Platform', sub: 'Modular video player, instant knowledge quizzes & automated certificate generator' },
      'estatex': { title: 'EstateX — Modern Real Estate Experience', sub: 'Sub-second luxury property search, private tour bookings & live mortgage calculator' },
      'jarvis-ai': { title: 'Jarvis AI — Multi-Agent Engineering Assistant', sub: 'Real-time contextual conversational intelligence, persona switching & code generation' },
      'business-website': { title: 'Nexus Corp — Modern Corporate Studio', sub: 'Interactive corporate theme engine & client ROI / cost savings calculator' },
      'novacart': { title: 'NovaCart — Full Digital Commerce Store', sub: 'Slide-out cart drawer, live discount engine & simulated 3-step checkout' },
      'timeslot-pro': { title: 'TimeSlot Pro — Appointment & Booking Engine', sub: '4-step friction-free schedule selector with timezone & calendar sync' },
      'nexus-admin': { title: 'Nexus Admin — Enterprise Operations Dashboard', sub: 'Interactive SVG metric visualizer, user RBAC controls & telemetry gauges' },
      'flowcraft-ai': { title: 'FlowCraft AI — Autonomous Workflow Engine', sub: 'Visual node pipeline connecting webhooks, LLM agents & multi-channel alerts' }
    };

    const info = titles[demoId] || { title: 'DevCraft Interactive Demo', sub: 'Production-grade software application simulation' };
    if (titleEl) titleEl.textContent = info.title;
    if (subtitleEl) subtitleEl.textContent = info.sub;

    if (ctaEl) {
      ctaEl.onclick = function() {
        startProjectFor(info.title);
      };
    }

    showModal('demo-modal');

    // Mount corresponding interactive view
    switch(demoId) {
      case 'cravex': renderCraveX(); break;
      case 'fitcore': renderFitCore(); break;
      case 'edunova': renderEduNova(); break;
      case 'estatex': renderEstateX(); break;
      case 'jarvis-ai': renderJarvisAI(); break;
      case 'business-website': renderBusinessWebsite(); break;
      case 'novacart': renderNovaCart(); break;
      case 'timeslot-pro': renderTimeSlotPro(); break;
      case 'nexus-admin': renderNexusAdmin(); break;
      case 'flowcraft-ai': renderFlowCraftAI(); break;
      default: renderCraveX(); break;
    }
  }

  // Open Case Study Modal
  function openCaseStudyModal(demoId) {
    const demosData = window.DEVCRAFT_DEMOS_DATA || [];
    const demo = demosData.find(d => d.id === demoId) || demosData[0];
    if (!demo || !demo.caseStudy) return;

    const cs = demo.caseStudy;
    const body = document.getElementById('case-study-modal-body');
    if (body) {
      body.innerHTML = `
        <div class="case-study-hero">
          <div class="badge-subtle">${demo.badge}</div>
          <h2 class="case-study-title">${demo.title} — Case Study</h2>
          <p class="case-study-subtitle">${demo.subtitle} • Client: <strong>${cs.client}</strong> (Timeline: ${cs.timeline})</p>
        </div>

        <div class="case-study-stats-row">
          ${demo.metrics.map(m => `
            <div class="cs-stat-card">
              <div class="cs-stat-val text-gradient">${m.value}</div>
              <div class="cs-stat-lbl">${m.label}</div>
            </div>
          `).join('')}
        </div>

        <div class="case-study-section">
          <h4 class="cs-heading"><span class="cs-icon">🚨</span> The Business Challenge</h4>
          <p class="cs-text">${cs.problem}</p>
        </div>

        <div class="case-study-section">
          <h4 class="cs-heading"><span class="cs-icon">💡</span> The DevCraft Solution</h4>
          <p class="cs-text">${cs.solution}</p>
        </div>

        <div class="case-study-section">
          <h4 class="cs-heading"><span class="cs-icon">⚙️</span> Architecture & Engineering Highlights</h4>
          <ul class="cs-list">
            ${cs.architecture.map(a => `<li><strong>${a}</strong></li>`).join('')}
          </ul>
        </div>

        <div class="case-study-section">
          <h4 class="cs-heading"><span class="cs-icon">📈</span> Measurable Results & ROI</h4>
          <ul class="cs-list results-list">
            ${cs.results.map(r => `<li>✓ ${r}</li>`).join('')}
          </ul>
        </div>

        <div class="case-study-cta-box">
          <div>
            <h4>Ready to achieve similar results for your business?</h4>
            <p>We build production-ready software solutions tailored to your unique requirements.</p>
          </div>
          <button class="btn btn-primary" onclick="devcraftDemos.startProjectFor('${demo.title}')">
            Start a Similar Project →
          </button>
        </div>
      `;
    }

    showModal('case-study-modal');
  }

  // Open Service Detail Modal
  function openServiceModal(serviceId) {
    const servicesData = window.DEVCRAFT_SERVICES_DATA || [];
    const service = servicesData.find(s => s.id === serviceId) || servicesData[0];
    if (!service) return;

    const body = document.getElementById('service-modal-body');
    if (body) {
      body.innerHTML = `
        <div class="service-modal-hero">
          <div class="badge-subtle">${service.category} • ${service.badge}</div>
          <h2 class="service-modal-title">${service.name}</h2>
          <p class="service-modal-desc">${service.detailedDesc}</p>
          <div class="service-pricing-pill">Starting from <strong>${service.pricingStarting}</strong> • Custom Quote Available</div>
        </div>

        <div class="service-modal-grid">
          <div class="service-modal-col">
            <h4>Key Features & Capabilities</h4>
            <ul class="service-feat-list">
              ${service.features.map(f => `<li>✓ ${f}</li>`).join('')}
            </ul>
          </div>
          <div class="service-modal-col">
            <h4>Typical Use Cases</h4>
            <ul class="service-feat-list use-cases">
              ${service.useCases.map(u => `<li>➔ ${u}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="service-modal-techs">
          <h4>Technologies & Frameworks Deployed</h4>
          <div class="tech-tags-list">
            ${service.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>

        <div class="service-modal-actions">
          <button class="btn btn-primary" onclick="devcraftDemos.startProjectFor('${service.name}')">
            Start This Project With DevCraft →
          </button>
          <button class="btn btn-outline" onclick="devcraftDemos.openDemoModal('${service.linkedDemoId}')">
            Launch Linked Interactive Demo 🚀
          </button>
        </div>
      `;
    }

    showModal('service-modal');
  }

  // ==========================================
  // ACTION HANDLERS FOR INDIVIDUAL DEMOS
  // ==========================================

  // CraveX
  function cravexFilter(cat) {
    state.cravex.category = cat;
    renderCraveX();
  }

  function cravexAddToCart(id) {
    const item = cravexCatalog.find(c => c.id === id);
    if (!item) return;
    const existing = state.cravex.cart.find(c => c.id === id);
    if (existing) {
      existing.qty++;
    } else {
      state.cravex.cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    }
    renderCraveX();
  }

  function cravexUpdateQty(id, delta) {
    const item = state.cravex.cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      state.cravex.cart = state.cravex.cart.filter(c => c.id !== id);
    }
    renderCraveX();
  }

  function cravexClearCart() {
    state.cravex.cart = [];
    renderCraveX();
  }

  function cravexSetStep(step) {
    state.cravex.currentStep = step;
    renderCraveX();
    if (step === 'tracking') {
      // Simulate courier movement
      clearSimulations();
      state.cravex.courierProgress = 20;
      const t = setInterval(() => {
        if (state.cravex.courierProgress < 82) {
          state.cravex.courierProgress += 8;
          const pin = document.querySelector('.courier-pin');
          if (pin) pin.style.left = state.cravex.courierProgress + '%';
        }
      }, 1000);
      simulatedTimers.push(t);
    }
  }

  // FitCore
  function fitcoreSetView(view) {
    state.fitcore.viewMode = view;
    renderFitCore();
  }

  function fitcoreToggleCheckIn() {
    state.fitcore.checkedIn = !state.fitcore.checkedIn;
    renderFitCore();
  }

  function fitcoreToggleMemberStatus(id) {
    const m = state.fitcore.members.find(x => x.id === id);
    if (m) {
      m.status = m.status === 'Active' ? 'Suspended' : 'Active';
      renderFitCore();
    }
  }

  function fitcoreAddMockMember() {
    const names = ['Karan Singhania', 'Sara Lindqvist', 'Tanya Kapoor', 'David Okonjo'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newId = 'FC-' + (100 + state.fitcore.members.length + 1);
    state.fitcore.members.unshift({
      id: newId,
      name: randomName,
      plan: 'Pro Athlete',
      status: 'Active',
      renewal: '30 Days'
    });
    renderFitCore();
  }

  // EduNova
  function edunovaTogglePlay() {
    state.edunova.isPlaying = !state.edunova.isPlaying;
    renderEduNova();
  }

  function edunovaAnswer(q, val) {
    state.edunova.quizAnswers[q] = val;
  }

  function edunovaSubmitQuiz() {
    const a = state.edunova.quizAnswers;
    let score = 0;
    if (a.q1 === 'redis') score++;
    if (a.q2 === 'csp_xss') score++;
    state.edunova.quizSubmitted = true;
    state.edunova.quizScore = score;
    renderEduNova();
  }

  function edunovaSaveNotes(val) {
    state.edunova.notes = val;
  }

  function edunovaShowCertificate() {
    alert('🏆 Certificate Generated for "Full-Stack Cloud Architecture & Microservices"! Verified Credential ID: DC-ED-988421');
  }

  // EstateX
  function estatexSetFilter(type) {
    state.estatex.filterType = type;
    renderEstateX();
  }

  function estatexSetMaxPrice(val) {
    state.estatex.maxPrice = Number(val);
    renderEstateX();
  }

  function estatexSetLoan(val) {
    state.estatex.loanAmount = Number(val);
    renderEstateX();
  }

  function estatexSetRate(val) {
    state.estatex.interestRate = Number(val);
    renderEstateX();
  }

  function estatexSetTenure(val) {
    state.estatex.loanTenure = Number(val);
    renderEstateX();
  }

  function estatexBookTour(title) {
    state.estatex.selectedProperty = title;
    state.estatex.tourBooked = true;
    renderEstateX();
  }

  // Jarvis AI
  function jarvisSetPersona(persona) {
    state.jarvis.persona = persona;
    renderJarvisAI();
  }

  function jarvisAsk(promptText) {
    const input = document.getElementById('jarvis-user-input');
    if (input) input.value = promptText;
    jarvisSend();
  }

  function jarvisSend() {
    const input = document.getElementById('jarvis-user-input');
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = '';

    // Add user message
    state.jarvis.messages.push({ sender: 'user', text: query });
    state.jarvis.isTyping = true;
    renderJarvisAI();

    // Determine response
    setTimeout(() => {
      state.jarvis.isTyping = false;
      const personaDict = jarvisResponses[state.jarvis.persona] || jarvisResponses.architect;
      let reply = personaDict.default;
      const qLower = query.toLowerCase();

      if (qLower.includes('db') || qLower.includes('database') || qLower.includes('postgres') || qLower.includes('sql') || qLower.includes('query')) {
        reply = personaDict.db;
      } else if (qLower.includes('auth') || qLower.includes('jwt') || qLower.includes('security') || qLower.includes('token') || qLower.includes('login')) {
        reply = personaDict.auth;
      }

      state.jarvis.messages.push({ sender: 'ai', text: reply });
      renderJarvisAI();
    }, 600);
  }

  // Business Website
  function businessSetTheme(theme) {
    state.business.theme = theme;
    renderBusinessWebsite();
  }

  function businessSetVisitors(val) {
    state.business.monthlyVisitors = Number(val);
    renderBusinessWebsite();
  }

  function businessSetRate(val) {
    state.business.conversionRate = Number(val);
    renderBusinessWebsite();
  }

  function businessSetAOV(val) {
    state.business.avgOrderValue = Number(val);
    renderBusinessWebsite();
  }

  // NovaCart
  function novacartFilter(cat) {
    state.novacart.category = cat;
    renderNovaCart();
  }

  function novacartToggleCart() {
    state.novacart.cartOpen = !state.novacart.cartOpen;
    renderNovaCart();
  }

  function novacartAddToCart(id) {
    const p = novacartProducts.find(x => x.id === id);
    if (!p) return;
    const existing = state.novacart.cart.find(x => x.id === id);
    if (existing) {
      existing.qty++;
    } else {
      state.novacart.cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
    }
    state.novacart.cartOpen = true;
    renderNovaCart();
  }

  function novacartUpdateQty(id, delta) {
    const item = state.novacart.cart.find(x => x.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      state.novacart.cart = state.novacart.cart.filter(x => x.id !== id);
    }
    renderNovaCart();
  }

  function novacartApplyCoupon() {
    const input = document.getElementById('novacart-coupon-input');
    if (input && input.value.trim().toUpperCase() === 'DEVCRAFT10') {
      state.novacart.couponApplied = true;
      renderNovaCart();
    } else {
      alert('Invalid coupon. Try code "DEVCRAFT10" for 10% off!');
    }
  }

  function novacartCheckout() {
    const subtotal = state.novacart.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discount = state.novacart.couponApplied ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal - discount;

    state.novacart.orderSuccess = {
      tracking: 'DC-TRACK-' + Math.floor(100000 + Math.random() * 900000),
      total: total
    };
    state.novacart.cart = [];
    state.novacart.cartOpen = false;
    renderNovaCart();
  }

  function novacartDismissOrder() {
    state.novacart.orderSuccess = null;
    renderNovaCart();
  }

  // TimeSlot Pro
  function timeslotSetService(name, dur) {
    state.timeslot.selectedService = name;
    state.timeslot.serviceDuration = dur;
  }

  function timeslotSetDate(date) {
    state.timeslot.selectedDate = date;
  }

  function timeslotSetTime(t) {
    state.timeslot.selectedTime = t;
    renderTimeSlotPro();
  }

  function timeslotSubmit() {
    const name = document.getElementById('ts-name') ? document.getElementById('ts-name').value : 'Rahul Verma';
    const email = document.getElementById('ts-email') ? document.getElementById('ts-email').value : 'rahul@company.com';

    state.timeslot.confirmedBooking = {
      service: state.timeslot.selectedService,
      date: state.timeslot.selectedDate || '2026-09-15',
      time: state.timeslot.selectedTime,
      name: name,
      email: email
    };
    renderTimeSlotPro();
  }

  function timeslotReset() {
    state.timeslot.confirmedBooking = null;
    renderTimeSlotPro();
  }

  // Nexus Admin
  function nexusSetTimeframe(tf) {
    state.nexus.timeframe = tf;
    renderNexusAdmin();
  }

  function nexusToggleUser(id) {
    const u = state.nexus.users.find(x => x.id === id);
    if (u) {
      u.status = u.status === 'Active' ? 'Suspended' : 'Active';
      renderNexusAdmin();
    }
  }

  // FlowCraft AI
  function flowcraftRunSimulation() {
    if (state.flowcraft.isRunning) return;
    state.flowcraft.isRunning = true;
    state.flowcraft.activeStep = 1;
    state.flowcraft.logs = [
      `[${new Date().toLocaleTimeString()}] Pipeline started: Listening for inbound webhooks...`,
      `[${new Date().toLocaleTimeString()}] Node 1: Webhook received -> { client: "Enterprise Lead", budget: "₹1,50,000+" }`
    ];
    renderFlowCraftAI();

    // Step 2
    setTimeout(() => {
      state.flowcraft.activeStep = 2;
      state.flowcraft.logs.push(`[${new Date().toLocaleTimeString()}] Node 2: Email syntax validated, budget verified (> threshold)`);
      renderFlowCraftAI();
    }, 700);

    // Step 3
    setTimeout(() => {
      state.flowcraft.activeStep = 3;
      state.flowcraft.logs.push(`[${new Date().toLocaleTimeString()}] Node 3: GPT-4 Agent synthesized technical specification and executive deal brief`);
      renderFlowCraftAI();
    }, 1500);

    // Step 4
    setTimeout(() => {
      state.flowcraft.activeStep = 4;
      state.flowcraft.logs.push(`[${new Date().toLocaleTimeString()}] Node 4: Dispatched priority notification to Slack #devcraft-deals & CRM`);
      state.flowcraft.logs.push(`[SUCCESS] End-to-end workflow completed in 1,840ms with 0 exceptions`);
      state.flowcraft.isRunning = false;
      renderFlowCraftAI();
    }, 2300);
  }

  // Escape key handler for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideModal('demo-modal');
      hideModal('case-study-modal');
      hideModal('service-modal');
    }
  });

  return {
    openDemoModal,
    openCaseStudyModal,
    openServiceModal,
    hideModal,
    startProjectFor,

    // CraveX
    cravexFilter,
    cravexAddToCart,
    cravexUpdateQty,
    cravexClearCart,
    cravexSetStep,

    // FitCore
    fitcoreSetView,
    fitcoreToggleCheckIn,
    fitcoreToggleMemberStatus,
    fitcoreAddMockMember,

    // EduNova
    edunovaTogglePlay,
    edunovaAnswer,
    edunovaSubmitQuiz,
    edunovaSaveNotes,
    edunovaShowCertificate,

    // EstateX
    estatexSetFilter,
    estatexSetMaxPrice,
    estatexSetLoan,
    estatexSetRate,
    estatexSetTenure,
    estatexBookTour,

    // Jarvis AI
    jarvisSetPersona,
    jarvisAsk,
    jarvisSend,

    // Business
    businessSetTheme,
    businessSetVisitors,
    businessSetRate,
    businessSetAOV,

    // NovaCart
    novacartFilter,
    novacartToggleCart,
    novacartAddToCart,
    novacartUpdateQty,
    novacartApplyCoupon,
    novacartCheckout,
    novacartDismissOrder,

    // TimeSlot Pro
    timeslotSetService,
    timeslotSetDate,
    timeslotSetTime,
    timeslotSubmit,
    timeslotReset,

    // Nexus Admin
    nexusSetTimeframe,
    nexusToggleUser,

    // FlowCraft AI
    flowcraftRunSimulation
  };
})();
