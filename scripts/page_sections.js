const servicesSectionContent = (fullPage = false) => `
  <section class="section" id="services">
    <div class="container">
      <div class="section-header">
        <div class="section-badge">Client Services</div>
        <h2 class="section-title">Engineered For <span class="text-gradient">Real Business Impact</span></h2>
        <p class="section-desc">
          High-performance development services tailored for startups, founders, and growing enterprises.
        </p>
      </div>

      <div class="services-grid">
        <!-- 1. Website Development -->
        <div class="glass-card service-card">
          <div>
            <div class="service-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <h3 class="service-title">1. Website Development</h3>
            <p class="service-desc">Modern, responsive, ultra-fast websites designed with pixel precision, fluid animations, and conversion-focused architectures.</p>
            <div class="service-techs">
              <span class="service-tech-tag">HTML5/CSS3</span>
              <span class="service-tech-tag">JavaScript</span>
              <span class="service-tech-tag">Tailwind</span>
              <span class="service-tech-tag">SEO</span>
            </div>
          </div>
          <button onclick="requestService('Website Development')" class="btn btn-outline btn-sm service-btn">Request This Service →</button>
        </div>

        <!-- 2. Web Application Development -->
        <div class="glass-card service-card">
          <div>
            <div class="service-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            </div>
            <h3 class="service-title">2. Web Application Development</h3>
            <p class="service-desc">Scalable, dynamic full-stack web applications with authentication, reactive state management, and real-time data sync.</p>
            <div class="service-techs">
              <span class="service-tech-tag">React</span>
              <span class="service-tech-tag">Node.js</span>
              <span class="service-tech-tag">Express</span>
              <span class="service-tech-tag">WebSockets</span>
            </div>
          </div>
          <button onclick="requestService('Web Application Development')" class="btn btn-outline btn-sm service-btn">Request This Service →</button>
        </div>

        <!-- 3. Android App Development -->
        <div class="glass-card service-card">
          <div>
            <div class="service-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            </div>
            <h3 class="service-title">3. Android App Development</h3>
            <p class="service-desc">Native & cross-platform mobile applications with smooth gestures, local caching, push notifications, and API integrations.</p>
            <div class="service-techs">
              <span class="service-tech-tag">Android</span>
              <span class="service-tech-tag">React Native</span>
              <span class="service-tech-tag">Mobile UI</span>
              <span class="service-tech-tag">REST APIs</span>
            </div>
          </div>
          <button onclick="requestService('Android App Development')" class="btn btn-outline btn-sm service-btn">Request This Service →</button>
        </div>

        <!-- 4. AI Integration -->
        <div class="glass-card service-card">
          <div>
            <div class="service-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"></path><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
            </div>
            <h3 class="service-title">4. AI Integration</h3>
            <p class="service-desc">Empower your software with LLM agents, OpenAI APIs, automated workflows, intelligent chatbots, and predictive vector search.</p>
            <div class="service-techs">
              <span class="service-tech-tag">OpenAI API</span>
              <span class="service-tech-tag">LangChain</span>
              <span class="service-tech-tag">Embeddings</span>
              <span class="service-tech-tag">Python/Node</span>
            </div>
          </div>
          <button onclick="requestService('AI Integration')" class="btn btn-outline btn-sm service-btn">Request This Service →</button>
        </div>

        <!-- 5. UI/UX Design -->
        <div class="glass-card service-card">
          <div>
            <div class="service-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
            </div>
            <h3 class="service-title">5. UI/UX Design</h3>
            <p class="service-desc">Human-centered digital product interfaces with modern dark mode aesthetic, glassmorphism, responsive grids, and design systems.</p>
            <div class="service-techs">
              <span class="service-tech-tag">Figma</span>
              <span class="service-tech-tag">Wireframing</span>
              <span class="service-tech-tag">Prototyping</span>
              <span class="service-tech-tag">Design Systems</span>
            </div>
          </div>
          <button onclick="requestService('UI/UX Design')" class="btn btn-outline btn-sm service-btn">Request This Service →</button>
        </div>

        <!-- 6. E-Commerce Development -->
        <div class="glass-card service-card">
          <div>
            <div class="service-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </div>
            <h3 class="service-title">6. E-Commerce Development</h3>
            <p class="service-desc">High-converting online shopping platforms featuring seamless payment gateways, cart management, and inventory tracking.</p>
            <div class="service-techs">
              <span class="service-tech-tag">Payment APIs</span>
              <span class="service-tech-tag">Catalog Engine</span>
              <span class="service-tech-tag">Node.js</span>
              <span class="service-tech-tag">MongoDB</span>
            </div>
          </div>
          <button onclick="requestService('E-Commerce Development')" class="btn btn-outline btn-sm service-btn">Request This Service →</button>
        </div>

        <!-- 7. Admin Dashboard Development -->
        <div class="glass-card service-card">
          <div>
            <div class="service-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>
            </div>
            <h3 class="service-title">7. Admin Dashboard Development</h3>
            <p class="service-desc">Custom data control centers with telemetry charts, client CRM management, role-based access control, and CSV export.</p>
            <div class="service-techs">
              <span class="service-tech-tag">Data Visuals</span>
              <span class="service-tech-tag">JWT Security</span>
              <span class="service-tech-tag">CRUD Engine</span>
              <span class="service-tech-tag">Chart.js</span>
            </div>
          </div>
          <button onclick="requestService('Admin Dashboard Development')" class="btn btn-outline btn-sm service-btn">Request This Service →</button>
        </div>

        <!-- 8. Website Maintenance -->
        <div class="glass-card service-card">
          <div>
            <div class="service-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            </div>
            <h3 class="service-title">8. Website Maintenance</h3>
            <p class="service-desc">Proactive speed optimizations, security hardening, bug fixing, dependency updates, and 99.9% uptime monitoring.</p>
            <div class="service-techs">
              <span class="service-tech-tag">Audit</span>
              <span class="service-tech-tag">Security Patches</span>
              <span class="service-tech-tag">Speed Tuning</span>
              <span class="service-tech-tag">Backup</span>
            </div>
          </div>
          <button onclick="requestService('Website Maintenance')" class="btn btn-outline btn-sm service-btn">Request This Service →</button>
        </div>

        <!-- 9. API / Backend Development -->
        <div class="glass-card service-card">
          <div>
            <div class="service-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
            </div>
            <h3 class="service-title">9. API / Backend Development</h3>
            <p class="service-desc">Enterprise-grade REST APIs, microservices, secure authentication layers, rate-limiting, and resilient database modeling.</p>
            <div class="service-techs">
              <span class="service-tech-tag">Express.js</span>
              <span class="service-tech-tag">MongoDB</span>
              <span class="service-tech-tag">JWT</span>
              <span class="service-tech-tag">RESTful</span>
            </div>
          </div>
          <button onclick="requestService('API / Backend Development')" class="btn btn-outline btn-sm service-btn">Request This Service →</button>
        </div>

        <!-- 10. Custom Software Development -->
        <div class="glass-card service-card">
          <div>
            <div class="service-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <h3 class="service-title">10. Custom Software Development</h3>
            <p class="service-desc">Tailor-made digital products built from the ground up to automate complex operational workflows and scale your business.</p>
            <div class="service-techs">
              <span class="service-tech-tag">Custom Specs</span>
              <span class="service-tech-tag">System Design</span>
              <span class="service-tech-tag">Full-Stack</span>
              <span class="service-tech-tag">Clean Code</span>
            </div>
          </div>
          <button onclick="requestService('Custom Software Development')" class="btn btn-outline btn-sm service-btn">Request This Service →</button>
        </div>
      </div>
    </div>
  </section>
`;

const projectsSectionContent = () => `
  <section class="section" id="projects" style="background: rgba(11, 17, 32, 0.4);">
    <div class="container">
      <div class="section-header">
        <div class="section-badge">Selected Portfolio</div>
        <h2 class="section-title">Engineered <span class="text-gradient">Case Studies</span></h2>
        <p class="section-desc">
          Explore interactive showcase solutions built across modern full-stack architectures.
        </p>
      </div>

      <div class="project-filters">
        <button class="filter-btn active" data-category="All">All Projects</button>
        <button class="filter-btn" data-category="AI Solutions">AI Solutions</button>
        <button class="filter-btn" data-category="Web Applications">Web Apps</button>
        <button class="filter-btn" data-category="E-Commerce">E-Commerce</button>
        <button class="filter-btn" data-category="Admin Dashboards">Dashboards</button>
        <button class="filter-btn" data-category="Android Applications">Android</button>
        <button class="filter-btn" data-category="Websites">Websites</button>
      </div>

      <div class="projects-grid" id="projects-grid"></div>
    </div>
  </section>
`;

const aboutSectionContent = () => `
  <section class="section" id="about">
    <div class="container">
      <div class="about-grid">
        <div class="glass-card about-profile-card">
          <div class="profile-avatar-wrap">
            <img src="/assets/images/avatar-harshit.svg" alt="Harshit - Harsh Developer" class="profile-avatar" />
          </div>
          <h3 class="profile-name">Harshit</h3>
          <div class="profile-title">Full-Stack & WebGL Developer</div>
          <div class="availability-tag">
            <span class="pulse-dot"></span>
            <span>Open for Client Engagements</span>
          </div>

          <div style="margin-top: 30px; text-align: left; border-top: 1px solid var(--border-glass); padding-top: 20px;">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Direct Developer Contacts:</div>
            <div style="font-size: 0.92rem; margin-bottom: 6px;">📧 shakyaharshit683@gmail.com</div>
            <div style="font-size: 0.92rem; margin-bottom: 6px;">💬 WhatsApp: +91 8791984082</div>
            <div style="font-size: 0.92rem;">📞 Call: +91 7017022966</div>
          </div>
        </div>

        <div class="about-details">
          <div class="section-badge">About Harshit</div>
          <h3>Crafting High-Performance Code With Modern Aesthetics</h3>
          <p class="about-bio-text">
            I'm Harshit, the developer behind <strong>Harsh Developer</strong>.
            I specialize in architecting responsive web applications, integrating practical AI workflows,
            and creating immersive 3D WebGL experiences that captivate users and drive real conversion.
          </p>
          <p class="about-bio-text">
            My development focus centers on clean, maintainable architecture, robust security, fast page load speeds,
            and intuitive user interfaces. Whether you need a brand-defining website, a custom software product, or an end-to-end admin portal, I engineer solutions built to last.
          </p>

          <div class="skills-category-group">
            <div class="skills-category-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              Core Technologies & Skills
            </div>
            <div class="skills-pills">
              <span class="skill-pill">JavaScript (ES6+)</span>
              <span class="skill-pill">React</span>
              <span class="skill-pill">Node.js</span>
              <span class="skill-pill">Express.js</span>
              <span class="skill-pill">Three.js / WebGL</span>
              <span class="skill-pill">MongoDB & Mongoose</span>
              <span class="skill-pill">RESTful API Design</span>
              <span class="skill-pill">Android / React Native</span>
              <span class="skill-pill">OpenAI & LLM Integration</span>
              <span class="skill-pill">HTML5 & CSS3 Architecture</span>
              <span class="skill-pill">Git & Version Control</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Development Workflow -->
      <div style="margin-top: 70px;">
        <div class="section-header" style="margin-bottom: 30px;">
          <h3 style="font-size: 1.8rem;">Engineered <span class="text-gradient">Project Workflow</span></h3>
          <p class="section-desc">From initial requirement analysis to live production launch.</p>
        </div>

        <div class="workflow-timeline">
          <div class="workflow-step">
            <div class="step-num">01</div>
            <h4 class="step-title">Discovery & Strategy</h4>
            <p class="step-desc">Aligning on your business goals, target audience, feature scope, and technology roadmap.</p>
          </div>
          <div class="workflow-step">
            <div class="step-num">02</div>
            <h4 class="step-title">Architecture & UX</h4>
            <p class="step-desc">Structuring database schemas, API contracts, glassmorphic UI components, and user flows.</p>
          </div>
          <div class="workflow-step">
            <div class="step-num">03</div>
            <h4 class="step-title">Development & 3D</h4>
            <p class="step-desc">Writing modular, type-safe full-stack code with real Three.js WebGL and interactive animations.</p>
          </div>
          <div class="workflow-step">
            <div class="step-num">04</div>
            <h4 class="step-title">QA & Launch</h4>
            <p class="step-desc">Rigorous device testing, performance tuning, security checks, and seamless live deployment.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const contactSectionContent = () => `
  <section class="section" id="contact" style="background: rgba(8, 12, 22, 0.6);">
    <div class="container">
      <div class="section-header">
        <div class="section-badge">Start Your Project</div>
        <h2 class="section-title">Let's Build Something <span class="text-gradient">Extraordinary</span></h2>
        <p class="section-desc">
          Fill out the project enquiry form below or connect with Harshit instantly across your favorite messaging channels.
        </p>
      </div>

      <div class="contact-grid">
        <!-- Direct Contact Channels -->
        <div class="glass-card contact-info-card">
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Direct Contact</h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Have an urgent timeline or prefer a quick chat? Reach out directly to Harshit:
          </p>

          <div class="contact-channel-list">
            <a href="https://wa.me/918791984082?text=Hi%20Harshit,%20I'd%20like%20to%20hire%20you%20for%20a%20project." target="_blank" rel="noopener noreferrer" class="contact-channel-item">
              <div class="contact-channel-icon icon-wa">WA</div>
              <div class="contact-channel-text">
                <span class="contact-channel-title">WhatsApp</span>
                <span class="contact-channel-val">+91 8791984082</span>
              </div>
            </a>

            <a href="tel:+917017022966" class="contact-channel-item">
              <div class="contact-channel-icon icon-phone">TEL</div>
              <div class="contact-channel-text">
                <span class="contact-channel-title">Direct Call</span>
                <span class="contact-channel-val">+91 7017022966</span>
              </div>
            </a>

            <a href="mailto:shakyaharshit683@gmail.com" class="contact-channel-item">
              <div class="contact-channel-icon icon-mail">MAIL</div>
              <div class="contact-channel-text">
                <span class="contact-channel-title">Email</span>
                <span class="contact-channel-val">shakyaharshit683@gmail.com</span>
              </div>
            </a>

            <a href="https://www.instagram.com/kiro_mage/" target="_blank" rel="noopener noreferrer" class="contact-channel-item">
              <div class="contact-channel-icon icon-ig">IG</div>
              <div class="contact-channel-text">
                <span class="contact-channel-title">Instagram</span>
                <span class="contact-channel-val">@kiro_mage</span>
              </div>
            </a>

            <a href="https://t.me/harshuuu1123" target="_blank" rel="noopener noreferrer" class="contact-channel-item">
              <div class="contact-channel-icon icon-tg">TG</div>
              <div class="contact-channel-text">
                <span class="contact-channel-title">Telegram</span>
                <span class="contact-channel-val">@harshuuu1123</span>
              </div>
            </a>
          </div>
        </div>

        <!-- Working Project Enquiry Form -->
        <div class="glass-card form-card" id="contact-form-section">
          <h3 style="font-size: 1.5rem; margin-bottom: 20px;">Send Project Request</h3>
          
          <div id="form-status-msg" class="form-status-msg"></div>

          <form id="enquiry-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="form-name" class="form-label">Full Name <span class="req">*</span></label>
                <input type="text" id="form-name" class="form-control" placeholder="e.g. Alex Smith" required />
              </div>

              <div class="form-group">
                <label for="form-email" class="form-label">Email Address <span class="req">*</span></label>
                <input type="email" id="form-email" class="form-control" placeholder="alex@company.com" required />
              </div>

              <div class="form-group">
                <label for="form-phone" class="form-label">Phone Number <span class="req">*</span></label>
                <input type="tel" id="form-phone" class="form-control" placeholder="+91 9876543210" required />
              </div>

              <div class="form-group">
                <label for="form-whatsapp" class="form-label">WhatsApp (Optional)</label>
                <input type="tel" id="form-whatsapp" class="form-control" placeholder="Same as phone or custom" />
              </div>

              <div class="form-group">
                <label for="form-service" class="form-label">Service Needed <span class="req">*</span></label>
                <select id="form-service" class="form-control" required>
                  <option value="" disabled selected>Select a Service</option>
                  <option value="Website Development">Website Development</option>
                  <option value="Web Application Development">Web Application Development</option>
                  <option value="Android App Development">Android App Development</option>
                  <option value="AI Integration">AI Integration</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="E-Commerce Development">E-Commerce Development</option>
                  <option value="Admin Dashboard Development">Admin Dashboard Development</option>
                  <option value="Website Maintenance">Website Maintenance</option>
                  <option value="API / Backend Development">API / Backend Development</option>
                  <option value="Custom Software Development">Custom Software Development</option>
                </select>
              </div>

              <div class="form-group">
                <label for="form-budget" class="form-label">Approximate Budget</label>
                <select id="form-budget" class="form-control">
                  <option value="Flexible">Flexible / Discuss Later</option>
                  <option value="₹15,000 - ₹35,000 / $200 - $450">₹15,000 - ₹35,000 / $200 - $450</option>
                  <option value="₹35,000 - ₹75,000 / $450 - $950">₹35,000 - ₹75,000 / $450 - $950</option>
                  <option value="₹75,000 - ₹1,50,000 / $950 - $1,800">₹75,000 - ₹1,50,000 / $950 - $1,800</option>
                  <option value="₹1,50,000+ / $1,800+">₹1,50,000+ / $1,800+</option>
                </select>
              </div>

              <div class="form-group">
                <label for="form-type" class="form-label">Project Type</label>
                <select id="form-type" class="form-control">
                  <option value="New Project">New Project from Scratch</option>
                  <option value="Redesign / Modernization">Redesign / Modernization</option>
                  <option value="Feature Addition">Feature Addition / Bug Fixes</option>
                  <option value="Performance & 3D Polish">Performance & 3D Polish</option>
                  <option value="Consultation">Technical Consultation</option>
                </select>
              </div>

              <div class="form-group">
                <label for="form-deadline" class="form-label">Target Deadline</label>
                <select id="form-deadline" class="form-control">
                  <option value="Flexible">Flexible Timeline</option>
                  <option value="1-2 Weeks (Urgent)">1-2 Weeks (Urgent)</option>
                  <option value="1 Month">1 Month</option>
                  <option value="2-3 Months">2-3 Months</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label for="form-ref" class="form-label">Reference / Inspiration URL (Optional)</label>
                <input type="url" id="form-ref" class="form-control" placeholder="https://example.com/inspiration" />
              </div>

              <div class="form-group full-width">
                <label for="form-desc" class="form-label">Project Description <span class="req">*</span></label>
                <textarea id="form-desc" class="form-control" placeholder="Briefly describe what you would like to build, key features, and your requirements..." required></textarea>
              </div>

              <div class="form-group full-width">
                <label for="form-notes" class="form-label">Additional Notes (Optional)</label>
                <input type="text" id="form-notes" class="form-control" placeholder="Any specific requirements or questions..." />
              </div>

              <div class="form-group full-width" style="margin-top: 10px;">
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                  <span>Send Project Request</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
`;

module.exports = {
  servicesSectionContent,
  projectsSectionContent,
  aboutSectionContent,
  contactSectionContent
};
