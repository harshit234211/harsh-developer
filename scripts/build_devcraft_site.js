const fs = require('fs');
const path = require('path');

const DEVCRAFT_SERVICES = require('./data_services');
const DEVCRAFT_DEMOS = require('./data_demos');
const { DEVCRAFT_PRODUCTS, calculatePricing } = require('./data_products');
const { commonHead, navbar, floatingActions, footer } = require('./components');

const ROOT = path.join(__dirname, '..');
const FRONTEND = path.join(ROOT, 'frontend');
const PAGES = path.join(FRONTEND, 'pages');
const ASSETS_IMG = path.join(FRONTEND, 'assets', 'images');

if (!fs.existsSync(PAGES)) fs.mkdirSync(PAGES, { recursive: true });
if (!fs.existsSync(ASSETS_IMG)) fs.mkdirSync(ASSETS_IMG, { recursive: true });

// Function to generate futuristic animated SVG assets for Joya AI & Jarvis AI
function generateAnimatedSvgs() {
  const joyaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <defs>
    <radialGradient id="joyaCoreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#a855f7" stop-opacity="0.75"/>
      <stop offset="70%" stop-color="#3b82f6" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0b1120" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="joyaInnerOrb" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="25%" stop-color="#38bdf8" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#9333ea" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#090d16" stop-opacity="0.95"/>
    </radialGradient>
    <linearGradient id="joyaWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.2"/>
      <stop offset="50%" stop-color="#c084fc" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.2"/>
    </linearGradient>
    <linearGradient id="joyaRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <filter id="joyaGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="joyaSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <style>
      @keyframes joyaPulse {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 25px rgba(0,240,255,0.85)); }
      }
      @keyframes joyaRotateCW {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes joyaRotateCCW {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      @keyframes joyaWaveMove1 {
        0%, 100% { d: path('M 80 160 Q 180 110 300 160 T 520 160'); }
        50% { d: path('M 80 160 Q 180 210 300 160 T 520 160'); }
      }
      @keyframes joyaWaveMove2 {
        0%, 100% { d: path('M 80 160 Q 200 200 300 160 T 520 160'); }
        50% { d: path('M 80 160 Q 200 120 300 160 T 520 160'); }
      }
      @keyframes joyaBarBounce {
        0%, 100% { transform: scaleY(0.3); }
        50% { transform: scaleY(1.2); }
      }
      @keyframes joyaParticleFloat {
        0% { transform: translateY(0px) scale(0.8); opacity: 0.3; }
        50% { transform: translateY(-15px) scale(1.2); opacity: 0.95; }
        100% { transform: translateY(0px) scale(0.8); opacity: 0.3; }
      }
      @keyframes joyaRingsExpand {
        0% { r: 60px; opacity: 0.8; }
        50% { r: 90px; opacity: 0.3; }
        100% { r: 120px; opacity: 0; }
      }
      .joya-core { transform-origin: 300px 160px; animation: joyaPulse 3.5s ease-in-out infinite; }
      .joya-ring-cw { transform-origin: 300px 160px; animation: joyaRotateCW 18s linear infinite; }
      .joya-ring-ccw { transform-origin: 300px 160px; animation: joyaRotateCCW 12s linear infinite; }
      .joya-wave-1 { animation: joyaWaveMove1 4s ease-in-out infinite; }
      .joya-wave-2 { animation: joyaWaveMove2 3.2s ease-in-out infinite; }
      .joya-p1 { animation: joyaParticleFloat 3s ease-in-out infinite; }
      .joya-p2 { animation: joyaParticleFloat 4.2s ease-in-out 1s infinite; }
      .joya-p3 { animation: joyaParticleFloat 3.6s ease-in-out 0.5s infinite; }
      .joya-pulse-ring { animation: joyaRingsExpand 3s ease-out infinite; }
      .joya-pulse-ring-delayed { animation: joyaRingsExpand 3s ease-out 1.5s infinite; }
    </style>
  </defs>

  <rect width="600" height="320" rx="16" fill="#080d1a"/>
  
  <g opacity="0.1" stroke="#38bdf8" stroke-width="1">
    <line x1="0" y1="50" x2="600" y2="50"/>
    <line x1="0" y1="110" x2="600" y2="110"/>
    <line x1="0" y1="160" x2="600" y2="160"/>
    <line x1="0" y1="210" x2="600" y2="210"/>
    <line x1="0" y1="270" x2="600" y2="270"/>
    <line x1="100" y1="0" x2="100" y2="320"/>
    <line x1="200" y1="0" x2="200" y2="320"/>
    <line x1="300" y1="0" x2="300" y2="320"/>
    <line x1="400" y1="0" x2="400" y2="320"/>
    <line x1="500" y1="0" x2="500" y2="320"/>
  </g>

  <circle cx="300" cy="160" r="150" fill="url(#joyaCoreGlow)"/>

  <path class="joya-wave-1" d="M 80 160 Q 180 110 300 160 T 520 160" fill="none" stroke="url(#joyaWaveGrad)" stroke-width="3" filter="url(#joyaSoftGlow)"/>
  <path class="joya-wave-2" d="M 80 160 Q 200 200 300 160 T 520 160" fill="none" stroke="#00f0ff" stroke-opacity="0.4" stroke-width="2"/>

  <g transform="translate(85, 160)" fill="#00f0ff" opacity="0.85">
    <rect x="0" y="-14" width="4" height="28" rx="2" style="animation: joyaBarBounce 1.2s ease-in-out infinite; transform-origin: 2px 0;"/>
    <rect x="10" y="-25" width="4" height="50" rx="2" style="animation: joyaBarBounce 0.9s ease-in-out 0.2s infinite; transform-origin: 12px 0;"/>
    <rect x="20" y="-38" width="4" height="76" rx="2" style="animation: joyaBarBounce 1.5s ease-in-out 0.4s infinite; transform-origin: 22px 0;"/>
    <rect x="30" y="-20" width="4" height="40" rx="2" style="animation: joyaBarBounce 1.1s ease-in-out 0.1s infinite; transform-origin: 32px 0;"/>
    <rect x="40" y="-10" width="4" height="20" rx="2" style="animation: joyaBarBounce 1.4s ease-in-out 0.3s infinite; transform-origin: 42px 0;"/>
  </g>
  <g transform="translate(465, 160)" fill="#c084fc" opacity="0.85">
    <rect x="0" y="-10" width="4" height="20" rx="2" style="animation: joyaBarBounce 1.4s ease-in-out 0.3s infinite; transform-origin: 2px 0;"/>
    <rect x="10" y="-20" width="4" height="40" rx="2" style="animation: joyaBarBounce 1.1s ease-in-out 0.1s infinite; transform-origin: 12px 0;"/>
    <rect x="20" y="-38" width="4" height="76" rx="2" style="animation: joyaBarBounce 1.5s ease-in-out 0.4s infinite; transform-origin: 22px 0;"/>
    <rect x="30" y="-25" width="4" height="50" rx="2" style="animation: joyaBarBounce 0.9s ease-in-out 0.2s infinite; transform-origin: 32px 0;"/>
    <rect x="40" y="-14" width="4" height="28" rx="2" style="animation: joyaBarBounce 1.2s ease-in-out infinite; transform-origin: 42px 0;"/>
  </g>

  <circle cx="300" cy="160" class="joya-pulse-ring" fill="none" stroke="#00f0ff" stroke-width="1.8"/>
  <circle cx="300" cy="160" class="joya-pulse-ring-delayed" fill="none" stroke="#a855f7" stroke-width="1.8"/>

  <g class="joya-ring-cw">
    <circle cx="300" cy="160" r="95" fill="none" stroke="url(#joyaRingGrad)" stroke-width="2" stroke-dasharray="8 14 30 10 50 12" opacity="0.85"/>
    <circle cx="300" cy="65" r="4" fill="#00f0ff" filter="url(#joyaSoftGlow)"/>
    <circle cx="395" cy="160" r="3.5" fill="#a855f7"/>
    <circle cx="205" cy="160" r="3.5" fill="#ec4899"/>
  </g>

  <g class="joya-ring-ccw">
    <circle cx="300" cy="160" r="74" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 6 12 8" opacity="0.65"/>
    <circle cx="300" cy="234" r="3.5" fill="#38bdf8" filter="url(#joyaSoftGlow)"/>
  </g>

  <g class="joya-core">
    <circle cx="300" cy="160" r="54" fill="url(#joyaInnerOrb)" filter="url(#joyaGlowFilter)"/>
    
    <g transform="translate(286, 142)" fill="#ffffff">
      <rect x="8" y="4" width="12" height="20" rx="6" fill="#ffffff"/>
      <path d="M 3 16 A 11 11 0 0 0 25 16" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <line x1="14" y1="27" x2="14" y2="34" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <line x1="8" y1="34" x2="20" y2="34" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </g>
  </g>

  <circle cx="210" cy="95" r="3" fill="#00f0ff" class="joya-p1" filter="url(#joyaSoftGlow)"/>
  <circle cx="390" cy="80" r="2.5" fill="#c084fc" class="joya-p2" filter="url(#joyaSoftGlow)"/>
  <circle cx="370" cy="245" r="3.5" fill="#38bdf8" class="joya-p3" filter="url(#joyaSoftGlow)"/>
  <circle cx="225" cy="225" r="2.5" fill="#ec4899" class="joya-p1" filter="url(#joyaSoftGlow)"/>

  <g transform="translate(20, 18)">
    <rect x="0" y="0" width="165" height="26" rx="6" fill="rgba(168, 85, 247, 0.2)" stroke="rgba(168, 85, 247, 0.4)" stroke-width="1"/>
    <circle cx="14" cy="13" r="4" fill="#10b981"/>
    <text x="26" y="17" fill="#e9d5ff" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" letter-spacing="1">🎙️ JOYA AI ACTIVE</text>
  </g>

  <g transform="translate(410, 18)">
    <rect x="0" y="0" width="170" height="26" rx="6" fill="rgba(0, 240, 255, 0.15)" stroke="rgba(0, 240, 255, 0.35)" stroke-width="1"/>
    <text x="12" y="17" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" letter-spacing="1">"Wake up Joya"</text>
  </g>

  <path d="M 140 290 L 460 290" stroke="url(#joyaWaveGrad)" stroke-width="2" stroke-linecap="round"/>
  <text x="300" y="308" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="2">AUTONOMOUS VOICE AGENT • FULL SOURCE CODE</text>
</svg>`;

  const jarvisSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <defs>
    <radialGradient id="jarvisReactorGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.95"/>
      <stop offset="30%" stop-color="#3b82f6" stop-opacity="0.75"/>
      <stop offset="65%" stop-color="#1d4ed8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0b1120" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="jarvisCoreOrb" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="30%" stop-color="#00f0ff" stop-opacity="0.95"/>
      <stop offset="70%" stop-color="#1e40af" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#030712" stop-opacity="0.95"/>
    </radialGradient>
    <linearGradient id="jarvisTechGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="50%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
    <linearGradient id="jarvisCyanBlue" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.15"/>
      <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.15"/>
    </linearGradient>
    <filter id="jarvisGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="jarvisSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <style>
      @keyframes jarvisCorePulse {
        0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(0,240,255,0.7)); }
        50% { transform: scale(1.07); filter: drop-shadow(0 0 35px rgba(0,240,255,1)); }
      }
      @keyframes jarvisSpinFastCW {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes jarvisSpinSlowCCW {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      @keyframes jarvisRadarSweep {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes jarvisGridPulse {
        0%, 100% { opacity: 0.12; }
        50% { opacity: 0.25; }
      }
      @keyframes jarvisDataStream {
        0% { transform: translateY(0); opacity: 0.2; }
        50% { opacity: 0.85; }
        100% { transform: translateY(-26px); opacity: 0.1; }
      }
      .jarvis-core { transform-origin: 300px 160px; animation: jarvisCorePulse 3s ease-in-out infinite; }
      .jarvis-ring-cw { transform-origin: 300px 160px; animation: jarvisSpinFastCW 14s linear infinite; }
      .jarvis-ring-ccw { transform-origin: 300px 160px; animation: jarvisSpinSlowCCW 20s linear infinite; }
      .jarvis-radar { transform-origin: 300px 160px; animation: jarvisRadarSweep 6s linear infinite; }
      .jarvis-grid { animation: jarvisGridPulse 4s ease-in-out infinite; }
      .jarvis-stream-1 { animation: jarvisDataStream 2.5s linear infinite; }
      .jarvis-stream-2 { animation: jarvisDataStream 3.2s linear 0.8s infinite; }
    </style>
  </defs>

  <rect width="600" height="320" rx="16" fill="#080d1a"/>

  <g class="jarvis-grid" stroke="#00f0ff" stroke-width="0.8" fill="none">
    <line x1="50" y1="160" x2="550" y2="160" stroke-dasharray="4 8" opacity="0.4"/>
    <line x1="300" y1="30" x2="300" y2="290" stroke-dasharray="4 8" opacity="0.4"/>
    <circle cx="300" cy="160" r="130" stroke-dasharray="6 12" opacity="0.3"/>
  </g>

  <circle cx="300" cy="160" r="150" fill="url(#jarvisReactorGlow)"/>

  <g transform="translate(35, 80)" font-family="'JetBrains Mono', monospace" font-size="10" fill="#38bdf8" class="jarvis-stream-1">
    <text x="0" y="0">01 &gt; sys.init(pc_core)</text>
    <text x="0" y="18">02 &gt; ollama.bridge: OK</text>
    <text x="0" y="36">03 &gt; ctrl_space: ACTIVE</text>
    <text x="0" y="54">04 &gt; web_scraper: RUN</text>
    <text x="0" y="72">05 &gt; term_exec: READY</text>
    <text x="0" y="90">06 &gt; autostart: TRUE</text>
  </g>

  <g transform="translate(445, 80)" font-family="'JetBrains Mono', monospace" font-size="10" fill="#34d399" class="jarvis-stream-2">
    <text x="0" y="0">[HUD] CPU: 2.1% LOAD</text>
    <text x="0" y="18">[HUD] RAM: 142MB ALLOC</text>
    <text x="0" y="36">[HUD] LLM: Llama-3 8B</text>
    <text x="0" y="54">[HUD] VPA: 7017022966</text>
    <text x="0" y="72">[HUD] ENCRYPT: AES-256</text>
    <text x="0" y="90">[HUD] PORT: 5000 ONLINE</text>
  </g>

  <g class="jarvis-ring-cw">
    <circle cx="300" cy="160" r="105" fill="none" stroke="url(#jarvisTechGrad)" stroke-width="2.5" stroke-dasharray="15 10 40 8 80 12" opacity="0.9"/>
    <circle cx="300" cy="55" r="4.5" fill="#00f0ff" filter="url(#jarvisSoftGlow)"/>
    <circle cx="405" cy="160" r="4" fill="#10b981" filter="url(#jarvisSoftGlow)"/>
    <circle cx="195" cy="160" r="4" fill="#3b82f6" filter="url(#jarvisSoftGlow)"/>
  </g>

  <g class="jarvis-ring-ccw">
    <circle cx="300" cy="160" r="82" fill="none" stroke="#00f0ff" stroke-width="2" stroke-dasharray="6 6 25 10" opacity="0.75"/>
    <path d="M 235 160 A 65 65 0 0 1 365 160" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" filter="url(#jarvisSoftGlow)"/>
    <path d="M 365 160 A 65 65 0 0 1 235 160" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" filter="url(#jarvisSoftGlow)"/>
  </g>

  <g class="jarvis-radar">
    <line x1="300" y1="160" x2="300" y2="55" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" filter="url(#jarvisGlow)"/>
    <polygon points="300,160 270,60 300,55" fill="rgba(0, 240, 255, 0.15)"/>
  </g>

  <g class="jarvis-core">
    <circle cx="300" cy="160" r="50" fill="url(#jarvisCoreOrb)" filter="url(#jarvisGlow)"/>
    
    <g transform="translate(283, 143)" fill="#ffffff">
      <rect x="3" y="3" width="28" height="18" rx="3" fill="none" stroke="#ffffff" stroke-width="2.5"/>
      <line x1="0" y1="25" x2="34" y2="25" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <path d="M 9 9 L 14 12 L 9 15" fill="none" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="17" y1="15" x2="24" y2="15" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
    </g>
  </g>

  <g transform="translate(20, 18)">
    <rect x="0" y="0" width="180" height="26" rx="6" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" stroke-width="1"/>
    <circle cx="14" cy="13" r="4" fill="#00f0ff"/>
    <text x="26" y="17" fill="#93c5fd" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" letter-spacing="1">💻 JARVIS PC AGENT</text>
  </g>

  <g transform="translate(405, 18)">
    <rect x="0" y="0" width="175" height="26" rx="6" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1"/>
    <text x="12" y="17" fill="#34d399" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" letter-spacing="1">HOTKEY: Ctrl+Space</text>
  </g>

  <path d="M 140 290 L 460 290" stroke="url(#jarvisCyanBlue)" stroke-width="2" stroke-linecap="round"/>
  <text x="300" y="308" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="2">ELECTRON + PYTHON PC DESKTOP SOFTWARE</text>
</svg>`;

  fs.writeFileSync(path.join(ASSETS_IMG, 'joya-ai-animated.svg'), joyaSvg, 'utf8');
  fs.writeFileSync(path.join(ASSETS_IMG, 'jarvis-ai-animated.svg'), jarvisSvg, 'utf8');
  console.log('✓ Generated animated SVGs for Joya & Jarvis');
}

// Generate animated SVGs immediately
generateAnimatedSvgs();

// Helper to escape JSON for safe script tag embedding
const safeJsonServices = JSON.stringify(DEVCRAFT_SERVICES).replace(/</g, '\\u003c');
const safeJsonDemos = JSON.stringify(DEVCRAFT_DEMOS).replace(/</g, '\\u003c');
const safeJsonProducts = JSON.stringify(DEVCRAFT_PRODUCTS).replace(/</g, '\\u003c');

// ==========================================
// 1. ALL 16 SECTIONS GENERATORS
// ==========================================

// Section 2: Hero
function renderHeroSection() {
  return `
  <header class="hero-section" id="hero">
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="status-pill-online"><span class="status-dot"></span> Available for Production Sprints</span>
        </div>

        <div class="hero-tagline-lead">DEVCRAFT • IDEAS → CODE → REAL SOLUTIONS</div>
        <h1 class="hero-headline">
          DevCraft
        </h1>
        <p class="hero-subheadline text-gradient" style="font-size: 1.6rem; font-weight: 700; margin-bottom: 16px;">
          Ideas → Code → Real Solutions
        </p>

        <p class="hero-bio">
          We build powerful AI tools, mobile apps, desktop software and custom solutions to help you work smarter, faster and grow.
        </p>

        <!-- Service Offering Pills -->
        <div class="hero-offerings-pills">
          <span class="pill-tag">📱 Android Apps</span>
          <span class="pill-tag">🌐 Websites</span>
          <span class="pill-tag">⚡ Web Apps</span>
          <span class="pill-tag">💻 Custom Software</span>
          <span class="pill-tag">🤖 AI Solutions</span>
          <span class="pill-tag">⚙️ Automation</span>
          <span class="pill-tag">🔗 API Integration</span>
          <span class="pill-tag">🎨 UI/UX</span>
        </div>

        <!-- Primary CTAs -->
        <div class="hero-cta-group">
          <a href="/products" class="btn btn-primary btn-lg">
            <span>Explore Products</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          <a href="/services" class="btn btn-outline btn-lg">
            <span>Our Services</span>
          </a>
        </div>

        <!-- Trust Stats -->
        <div class="hero-stats-strip">
          <div class="hero-stat-item">
            <span class="stat-number text-gradient">2</span>
            <span class="stat-label">Flagship AI Apps</span>
          </div>
          <div class="hero-stat-item">
            <span class="stat-number text-cyan">9</span>
            <span class="stat-label">Core Services</span>
          </div>
          <div class="hero-stat-item">
            <span class="stat-number text-emerald">&lt;50ms</span>
            <span class="stat-label">Sub-Second Speed</span>
          </div>
          <div class="hero-stat-item">
            <span class="stat-number text-warning">100%</span>
            <span class="stat-label">IP & Code Ownership</span>
          </div>
        </div>
      </div>

      <!-- Hero Visual / 3D Canvas Anchor -->
      <div class="hero-visual">
        <div class="three-canvas-container" id="three-container">
          <canvas id="three-canvas" class="three-canvas"></canvas>
          <div id="three-fallback" class="three-fallback" style="display: none;">
            <div class="fallback-glow"></div>
            <div class="fallback-avatar-graphic">
              <div class="brand-badge-icon" style="width: 80px; height: 80px; font-size: 2rem;">⚡</div>
            </div>
          </div>
        </div>
        <div class="hero-card-floating hero-card-top-right">
          <div class="floating-icon">⚡</div>
          <div>
            <strong>100% Production Ready</strong>
            <small>Zero placeholder code</small>
          </div>
        </div>
        <div class="hero-card-floating hero-card-bottom-left">
          <div class="floating-icon">🛡️</div>
          <div>
            <strong>Enterprise Security</strong>
            <small>OWASP compliant architectures</small>
          </div>
        </div>
      </div>
    </div>
  </header>
  `;
}

// Section 2.5: Flagship Autonomous AI Agents (Joya AI & Jarvis AI)
function renderFlagshipsSection() {
  return `
  <section class="section" id="products" style="background: rgba(11, 17, 32, 0.4); border-top: 1px solid var(--border-glass); border-bottom: 1px solid var(--border-glass);">
    <div class="container">
      <div class="section-header text-center" style="margin-bottom: 40px;">
        <div class="section-badge" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.3); color: #d8b4fe;">Digital Products</div>
        <h2 class="section-title">Flagship <span class="text-gradient">AI Software</span></h2>
        <p class="section-desc">Production-ready voice and desktop AI software. Verified full source code included with instant commercial download access.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 28px;">
        <!-- Card 1: Joya AI -->
        <div class="glass-card" style="padding: 24px; border-radius: 20px; border: 1px solid rgba(168, 85, 247, 0.3); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <!-- Animated Graphic Banner -->
            <div style="width: 100%; border-radius: 14px; overflow: hidden; margin-bottom: 18px; border: 1px solid rgba(168, 85, 247, 0.3); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4); background: #080d1a;">
              <img src="/assets/images/joya-ai-animated.svg" alt="Joya AI Voice Assistant Animated Core" style="width: 100%; height: auto; display: block;" loading="lazy" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
              <span class="flagship-hero-badge">🎙️ Android Native • Full Source Code</span>
              <span class="pill-tag" style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 700;">50% OFF</span>
            </div>

            <h3 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 4px;">Joya AI</h3>
            <div style="color: var(--cyan); font-weight: 700; font-size: 0.95rem; margin-bottom: 12px;">Wake up Joya</div>
            <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">
              Autonomous on-device voice assistant for Android with custom wake word <strong>"Wake up Joya"</strong>. Hands-free WhatsApp messaging, calls, alarms, and offline speech recognition. Full Kotlin source code included.
            </p>

            <!-- Interactive Voice Waveform Simulator -->
            <div class="voice-wave-simulator">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--cyan); text-transform: uppercase;">Wake Word: "Wake up Joya"</span>
                <span class="status-pill-online" style="font-size: 0.7rem;"><span class="status-dot"></span> Active</span>
              </div>
              <div class="voice-bars-wrap">
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
                <span class="voice-bar"></span>
              </div>
              <button type="button" class="btn btn-xs btn-outline" onclick="devcraftShop.simulateJoyaWakeWord()">
                Test Wake Word ("Wake up Joya") 🎙️
              </button>
              <div id="joya-voice-status" style="margin-top: 10px; font-size: 0.82rem; min-height: 20px;"></div>
            </div>

            <ul class="product-features-list" style="margin-top: 18px;">
              <li><span class="check-icon">✓</span> Complete Android Studio Kotlin project source code (.ZIP)</li>
              <li><span class="check-icon">✓</span> Responsive wake word detection ("Wake up Joya")</li>
              <li><span class="check-icon">✓</span> WhatsApp &amp; Phone Dialer hands-free automation</li>
              <li><span class="check-icon">✓</span> 100% On-device privacy &amp; offline voice synthesis</li>
            </ul>
          </div>

          <div style="margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <del style="color: var(--text-muted); font-size: 0.95rem;">₹1,999</del>
                <span style="color: #10b981; font-size: 0.82rem; font-weight: 700; margin-left: 6px;">50% OFF</span>
                <div style="font-size: 1.5rem; font-weight: 800; color: var(--cyan);">₹999</div>
              </div>
              <span style="font-size: 0.78rem; color: #10b981; font-weight: 600;">Full Source Code Included</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <a href="https://api.whatsapp.com/send?phone=918630976928&text=Hello%20DevCraft%20%F0%9F%91%8B%20I%20want%20to%20buy%20Joya%20AI%20Voice%20Assistant%20(%E2%82%B9999)%20Full%20Source%20Code." target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm" style="justify-content: center; font-weight: 700; text-decoration: none;">💬 Buy on WhatsApp (₹999)</a>
              <a href="/joya" class="btn btn-outline btn-sm" style="justify-content: center; text-decoration: none;">View Details →</a>
            </div>
          </div>
        </div>

        <!-- Card 2: Jarvis AI -->
        <div class="glass-card" style="padding: 24px; border-radius: 20px; border: 1px solid rgba(59, 130, 246, 0.3); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <!-- Animated Graphic Banner -->
            <div style="width: 100%; border-radius: 14px; overflow: hidden; margin-bottom: 18px; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4); background: #080d1a;">
              <img src="/assets/images/jarvis-ai-animated.svg" alt="Jarvis AI PC Assistant Animated Core" style="width: 100%; height: auto; display: block;" loading="lazy" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
              <span class="flagship-hero-badge" style="background: rgba(59, 130, 246, 0.15); color: #93c5fd; border-color: rgba(59, 130, 246, 0.4);">💻 PC Desktop • Full Source Code</span>
              <span class="pill-tag" style="background: rgba(0, 240, 255, 0.15); color: var(--cyan); font-weight: 700;">50% OFF</span>
            </div>

            <h3 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 4px;">Jarvis AI</h3>
            <div style="color: var(--cyan); font-weight: 700; font-size: 0.95rem; margin-bottom: 12px;">Your PC Voice Assistant</div>
            <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">
              Autonomous desktop assistant for PC (Windows/Mac/Linux). Executes terminal scripts, automates web browser workflows, indexes workspace files, and connects to local LLMs (Ollama). Full source code included.
            </p>

            <!-- Interactive Terminal Sandbox Mockup -->
            <div class="terminal-mockup">
              <div class="terminal-mockup-header">
                <span class="term-dot red"></span>
                <span class="term-dot yellow"></span>
                <span class="term-dot green"></span>
                <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 6px;">jarvis-core — bash</span>
              </div>
              <div class="terminal-mockup-body" id="jarvis-terminal-output">
                <div class="cmd-line">[Ready] Jarvis PC Agent v3.1.2 online...</div>
                <div class="out-line">Hotkeys enabled: Ctrl+Space listener active.</div>
              </div>
              <div style="padding: 8px 14px; background: #0b1120; border-top: 1px solid rgba(255, 255, 255, 0.06); display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('index')">Index Files</button>
                <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('scrape')">Web Scraper</button>
                <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('diag')">Diagnostics</button>
              </div>
            </div>

            <ul class="product-features-list" style="margin-top: 18px;">
              <li><span class="check-icon">✓</span> Complete PC Desktop project source code (.ZIP: Electron + Python)</li>
              <li><span class="check-icon">✓</span> Voice &amp; Hotkey (Ctrl+Space) desktop command center</li>
              <li><span class="check-icon">✓</span> Local LLM bridge (Ollama / Llama-3) &amp; script executor</li>
              <li><span class="check-icon">✓</span> Automated web scraper and file organization sentinel</li>
            </ul>
          </div>

          <div style="margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <del style="color: var(--text-muted); font-size: 0.95rem;">₹3,199</del>
                <span style="color: #10b981; font-size: 0.82rem; font-weight: 700; margin-left: 6px;">50% OFF</span>
                <div style="font-size: 1.5rem; font-weight: 800; color: var(--cyan);">₹1,599</div>
              </div>
              <span style="font-size: 0.78rem; color: #10b981; font-weight: 600;">Full Source Code Included</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <a href="https://api.whatsapp.com/send?phone=918630976928&text=Hello%20DevCraft%20%F0%9F%91%8B%20I%20want%20to%20buy%20Jarvis%20AI%20PC%20Assistant%20(%E2%82%B91,599)%20Full%20Source%20Code." target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm" style="justify-content: center; font-weight: 700; text-decoration: none;">💬 Buy on WhatsApp (₹1,599)</a>
              <a href="/jarvis" class="btn btn-outline btn-sm" style="justify-content: center; text-decoration: none;">View Details →</a>
            </div>
          </div>
      </div>
    </div>
  </section>
  `;
}

// Section 3: Services Showcase
function renderServicesSection() {
  return `
  <section class="section" id="services">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Engineering Services • Under ₹5,000</div>
        <h2 class="section-title">Need an App or <span class="text-gradient">Software?</span></h2>
        <p class="section-desc">
          We build custom, production-ready solutions for your business at accessible pricing — all services under ₹5,000.
        </p>
      </div>

      <!-- Service Cards Grid -->
      <div class="services-catalog-grid" id="services-catalog-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
        ${DEVCRAFT_SERVICES.map(service => {
          const waBookingUrl = `https://api.whatsapp.com/send?phone=918630976928&text=${encodeURIComponent('Hello DevCraft 👋 I want to book ' + service.name + ' (' + service.pricingStarting + ')')}`;
          return `
          <div class="service-card" style="display: flex; flex-direction: column; justify-content: space-between; border-radius: 18px;">
            <div class="service-card-top">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <span class="service-badge" style="background: rgba(59, 130, 246, 0.15); color: #93c5fd; border-color: rgba(59, 130, 246, 0.3);">${service.category} • ${service.badge}</span>
                <span style="font-size: 1.1rem; font-weight: 800; color: #10b981;">${service.pricingStarting}</span>
              </div>
              <h3 class="service-title" style="font-size: 1.3rem; margin-bottom: 8px;">${service.name}</h3>
              <p class="service-desc" style="font-size: 0.92rem; line-height: 1.6; margin-bottom: 14px;">${service.shortDesc}</p>
              
              <ul class="product-features-list" style="margin-bottom: 14px; font-size: 0.85rem;">
                ${(service.features || []).slice(0, 3).map(f => `<li><span class="check-icon" style="color: #10b981;">✓</span> ${f}</li>`).join('')}
              </ul>

              <div class="service-tech-pills">
                ${(service.technologies || []).slice(0, 4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
              </div>
            </div>

            <div class="service-card-bottom" style="margin-top: 18px; border-top: 1px solid var(--border-glass); padding-top: 14px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <a href="${waBookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm" style="justify-content: center;">
                  ⚡ Book on WhatsApp
                </a>
                <a href="#contact" onclick="document.getElementById('project-service') ? document.getElementById('project-service').value = '${service.name}' : null;" class="btn btn-outline btn-sm" style="justify-content: center;">
                  Request Quote →
                </a>
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>

      <!-- Start Your Project Prominent CTA -->
      <div style="text-align: center; margin-top: 48px;">
        <a href="#contact" class="btn btn-primary btn-lg" style="padding: 16px 36px; font-weight: 800; font-size: 1.1rem; box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);">
          🚀 START YOUR PROJECT TODAY
        </a>
      </div>
    </div>
  </section>
  `;
}

// Section: Aptitude & Placement Hub (Requirement 2: 30% DISCOUNT)
function renderAptitudeSection() {
  const aptitudeProducts = DEVCRAFT_PRODUCTS.filter(p => p.type === 'aptitude');

  return `
  <section class="section" id="aptitude" style="background: radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.08) 0%, transparent 70%);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge" style="border-color: rgba(168, 85, 247, 0.4); color: #c084fc; background: rgba(168, 85, 247, 0.1);">
          Campus &amp; Technical Placement Hub • 30% OFF
        </div>
        <h2 class="section-title">Developer Aptitude &amp; <span class="text-gradient" style="background: linear-gradient(135deg, #c084fc, #00f0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Placement Prep</span></h2>
        <p class="section-desc">
          Master technical screening rounds required by product startups, FAANG, and top IT recruiters. Speed math shortcuts, logical reasoning drills, CS fundamentals, and timed test simulators with an <strong>exclusive 30% discount</strong>.
        </p>
      </div>

      <!-- 5 Aptitude Cards Grid (Requirement 2: 30% OFF) -->
      <div class="services-catalog-grid" id="aptitude-catalog-grid">
        ${aptitudeProducts.map(item => `
          <div class="service-card" style="border-color: rgba(168, 85, 247, 0.25);">
            <div class="service-card-top">
              <span class="service-badge" style="background: rgba(168, 85, 247, 0.12); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3);">
                ${item.category} • ${item.badge}
              </span>
              <h3 class="service-title">${item.name}</h3>
              <p class="service-desc">${item.shortDesc}</p>
              <div class="service-tech-pills">
                ${(item.technologies || []).slice(0, 4).map(t => `<span class="tech-tag" style="border-color: rgba(168, 85, 247, 0.3); color: #e9d5ff;">${t}</span>`).join('')}
              </div>
            </div>

            <div class="service-card-bottom">
              <!-- Requirement 2: Original Price -> 30% OFF -> Final Price -->
              <div class="card-pricing-block" style="border-color: rgba(168, 85, 247, 0.2); background: rgba(168, 85, 247, 0.04);">
                <div class="price-top-row">
                  <span class="price-label">Original Price:</span>
                  <del class="price-original">₹${item.originalPrice.toLocaleString('en-IN')}</del>
                  <span class="badge-discount pill-aptitude">30% OFF</span>
                </div>
                <div class="price-bottom-row">
                  <span class="price-final-label">Final Price:</span>
                  <span class="price-final-value" style="color: #c084fc;">₹${item.finalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <!-- WhatsApp Enrollment Action -->
              <div class="card-shop-actions" style="display: flex; gap: 8px;">
                <a href="https://api.whatsapp.com/send?phone=918630976928&text=${encodeURIComponent('Hello DevCraft 👋 I want to enroll in ' + item.name + ' (₹' + item.finalPrice.toLocaleString('en-IN') + ')')}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-xs btn-buy" style="background: linear-gradient(135deg, #a855f7, #00f0ff); border: none; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; flex: 1;">
                  💬 Enroll on WhatsApp (₹${item.finalPrice.toLocaleString('en-IN')})
                </a>
                <button class="btn btn-outline btn-xs" onclick="devcraftShop.openProductModal('${item.id}')">
                  Syllabus
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 4: Featured Projects & Demos (All 10 Demos)
function renderFeaturedDemosSection() {
  const demoFilters = ['ALL', 'MOBILE APPS', 'WEB APPS', 'WEBSITES', 'AI', 'DASHBOARDS', 'BUSINESS SOFTWARE', 'AUTOMATION'];

  return `
  <section class="section" id="demos">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Live Interactive Showcase</div>
        <h2 class="section-title">10 Production <span class="text-gradient">Demo Applications</span></h2>
        <p class="section-desc">
          Every demo below is a fully functional simulated software application. Click "View Demo" to interact live, test features, and inspect real case studies.
        </p>
      </div>

      <!-- Portfolio Dynamic Filter Bar -->
      <div class="filter-bar" id="portfolio-filter-bar">
        ${demoFilters.map(f => `
          <button class="filter-pill ${f === 'ALL' ? 'active' : ''}" onclick="filterDemosCategory('${f}')">${f}</button>
        `).join('')}
      </div>

      <!-- 10 Demo Cards Grid -->
      <div class="demos-catalog-grid" id="demos-catalog-grid">
        ${DEVCRAFT_DEMOS.map(demo => `
          <div class="demo-card" data-category="${demo.category}">
            <div class="demo-media-wrap">
              <span class="demo-badge-pill">${demo.badge}</span>
              <img src="${demo.image}" alt="${demo.title} Preview" loading="lazy" />
            </div>

            <div class="demo-card-body">
              <h3 class="demo-title">${demo.title}</h3>
              <div class="demo-subtitle">${demo.subtitle}</div>
              <p class="demo-desc">${demo.shortDesc}</p>

              <!-- Metrics Strip -->
              <div class="demo-metrics-strip">
                ${demo.metrics.map(m => `
                  <div>
                    <div class="demo-metric-val text-gradient">${m.value}</div>
                    <div class="demo-metric-lbl">${m.label}</div>
                  </div>
                `).join('')}
              </div>

              <!-- Tech Tags -->
              <div class="service-tech-pills" style="margin-bottom: 16px;">
                ${demo.technologies.slice(0, 4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
              </div>

              <!-- Actions -->
              <div class="demo-card-actions">
                <div class="demo-btn-group-row">
                  <button class="btn btn-primary btn-sm" onclick="devcraftDemos.openDemoModal('${demo.id}')">
                    <span>⚡ View Live Demo</span>
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="devcraftDemos.openCaseStudyModal('${demo.id}')">
                    <span>📖 Case Study</span>
                  </button>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center;">
                  <button class="btn btn-ghost btn-xs text-muted" style="flex-grow: 1; text-align: left;" onclick="devcraftDemos.startProjectFor('${demo.title}')">
                    Start Similar Project →
                  </button>
                  <button type="button" class="btn-share-icon" title="Share Demo" onclick="devcraftShop.openShareModal('${demo.id}')">
                    🔗 Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 5: Live Interactive Demo Lab
function renderDemoLabSection() {
  return `
  <section class="section" id="demo-lab" style="background: rgba(255, 255, 255, 0.01);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Direct Application Launchpad</div>
        <h2 class="section-title">Interactive <span class="text-gradient">Demo Lab</span></h2>
        <p class="section-desc">
          Instant one-click access to all 10 interactive application simulators. Experience genuine user flows, real-time data calculations, and simulated state changes.
        </p>
      </div>

      <div class="demo-lab-tiles-grid">
        ${DEVCRAFT_DEMOS.map((demo, idx) => `
          <div class="demo-lab-tile" onclick="devcraftDemos.openDemoModal('${demo.id}')">
            <div class="tile-header">
              <span class="tile-number">0${idx + 1}</span>
              <span class="status-pill-online"><span class="status-dot"></span> Interactive</span>
            </div>
            <h4 class="tile-title">${demo.title}</h4>
            <div class="tile-sub">${demo.subtitle}</div>
            <div class="tile-action">
              <span>Launch Simulator</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 6: Why DevCraft
function renderWhySection() {
  const pillars = [
    { icon: '💎', title: 'Production-Grade Code', desc: 'Zero shortcuts. We write clean, strongly typed TypeScript and modular code architectures designed to survive heavy scale and team growth.' },
    { icon: '⚡', title: 'Rapid Agile Sprints', desc: 'Bi-weekly working releases with interactive staging URLs. You test real features constantly, keeping surprises to absolute zero.' },
    { icon: '🌐', title: 'Full-Stack Mastery', desc: 'Seamless end-to-end execution across React Native mobile apps, Next.js web applications, high-concurrency Node.js APIs, and AI models.' },
    { icon: '🚀', title: 'Sub-Second Performance', desc: 'Obsessive optimization: Redis caching, relational database indexing, and adaptive CDNs yielding sub-50ms latency and 99/100 Lighthouse scores.' },
    { icon: '🔒', title: '100% IP & Code Ownership', desc: 'You own everything we build. Full copyright transfer, clean Git repositories, complete documentation, and zero proprietary lock-in.' },
    { icon: '⏰', title: '24/7 DevOps & Uptime', desc: 'Continuous cloud uptime monitoring, self-healing Docker containers, automated SSL renewals, and rapid developer response SLAs.' }
  ];

  return `
  <section class="section" id="why-devcraft">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">The DevCraft Difference</div>
        <h2 class="section-title">Why Ambitious Teams <span class="text-gradient">Choose DevCraft</span></h2>
        <p class="section-desc">
          We combine the velocity of a boutique dev lab with the engineering standards of an enterprise tech consultancy.
        </p>
      </div>

      <div class="why-grid">
        ${pillars.map(p => `
          <div class="why-card">
            <div class="why-icon">${p.icon}</div>
            <h3 class="service-title">${p.title}</h3>
            <p class="service-desc">${p.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 7: Development Process
function renderProcessSection() {
  const steps = [
    { num: '01', title: 'Discovery & Scope', desc: 'We dissect your business goals, user journeys, functional constraints, and technical feasibility to produce a fixed timeline and milestone roadmap.' },
    { num: '02', title: 'Architecture & UI/UX', desc: 'We design database schemas, REST/WebSocket API contracts, and high-fidelity interactive component wireframes before writing code.' },
    { num: '03', title: 'Agile Full-Stack Sprints', desc: 'Development in 1-to-2 week sprints with CI/CD continuous deployment to password-protected staging preview environments.' },
    { num: '04', title: 'Rigorous QA & Security', desc: 'Comprehensive testing: unit suites, responsive cross-device validation, OWASP security audits, and load/stress testing.' },
    { num: '05', title: 'Cloud Production Launch', desc: 'Zero-downtime deployment to Render, AWS, or Vercel, paired with automated SSL certificates, CDN caching, and domain DNS routing.' },
    { num: '06', title: 'Continuous Scale & Support', desc: 'Post-launch 24/7 health pings, database telemetry optimization, regular backups, and seamless feature iteration.' }
  ];

  return `
  <section class="section" id="process" style="background: rgba(255, 255, 255, 0.01);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Predictable Execution</div>
        <h2 class="section-title">Our 6-Step <span class="text-gradient">Engineering Lifecycle</span></h2>
        <p class="section-desc">
          A disciplined, transparent software delivery framework that takes your project from napkin sketch to rock-solid production reality.
        </p>
      </div>

      <div class="process-grid">
        ${steps.map(s => `
          <div class="process-card">
            <div class="process-num">${s.num}</div>
            <h3 class="service-title">${s.title}</h3>
            <p class="service-desc">${s.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 8: Technologies & Stack
function renderTechSection() {
  const stacks = [
    { title: 'Frontend & UI', items: ['React 18', 'Next.js 14', 'TypeScript', 'TailwindCSS', 'Three.js WebGL', 'Vite', 'HTML5/SCSS', 'Framer Motion'] },
    { title: 'Mobile Applications', items: ['React Native', 'Android SDK', 'Kotlin', 'Flutter', 'Jetpack Compose', 'Expo', 'Room DB', 'iOS Swift Bridge'] },
    { title: 'Backend & Real-Time APIs', items: ['Node.js', 'Express.js', 'Python FastAPI', 'Socket.IO', 'GraphQL', 'BullMQ Workers', 'RESTful Services', 'JWT/OAuth2'] },
    { title: 'Databases & Storage', items: ['PostgreSQL', 'MongoDB', 'Redis In-Memory', 'Prisma ORM', 'Pinecone Vector DB', 'AWS S3', 'SQLite/Room'] },
    { title: 'Cloud & DevOps Infrastructure', items: ['Docker Containers', 'Render Cloud', 'AWS (EC2, S3, CloudFront)', 'Vercel', 'Cloudflare CDN', 'GitHub Actions CI/CD', 'Linux / NGINX'] },
    { title: 'AI, LLMs & Automation', items: ['OpenAI GPT-4 API', 'LangChain Agents', 'Vector Embeddings', 'Anthropic Claude', 'Puppeteer Scraping', 'Twilio Webhooks', 'Stripe Payments'] }
  ];

  return `
  <section class="section" id="technologies">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Production Tooling</div>
        <h2 class="section-title">Modern <span class="text-gradient">Technology Stack</span></h2>
        <p class="section-desc">
          We deliberately choose proven, future-proof technologies that offer exceptional performance, active ecosystem support, and zero technical debt.
        </p>
      </div>

      <div class="tech-category-grid">
        ${stacks.map(s => `
          <div class="tech-cat-card">
            <h3 class="tech-cat-title">${s.title}</h3>
            <div class="tech-items-wrap">
              ${s.items.map(i => `<span class="tech-badge-item">${i}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 9: Case Studies Spotlight
function renderCaseStudiesSection() {
  const spotlights = [
    {
      id: 'cravex',
      client: 'CraveX Logistics Corp',
      service: 'Native Android & React Native Delivery Platform',
      metrics: ['83% Faster App Launch', '64% Conversion Surge', '4.9 ★ Rating'],
      highlight: 'Engineered sub-50ms live courier GPS tracking that transformed food delivery conversions and eliminated drop-offs.'
    },
    {
      id: 'fitcore',
      client: 'FitCore Franchises',
      service: 'Gym & Fitness Operations SaaS',
      metrics: ['₹3.8L Saved Monthly', '0.4s Check-in Speed', '45+ Gym Locations'],
      highlight: 'Replaced paper registers and WhatsApp renewals with automated Stripe subscription billing and contactless QR turnstile passes.'
    },
    {
      id: 'jarvis-ai',
      client: 'Apex Software Labs',
      service: 'Enterprise AI Assistant Workspace',
      metrics: ['11.5 hrs Saved/Dev', '42% Higher Test Coverage', '500k+ Inferences'],
      highlight: 'Built secure private multi-agent engineering assistant integrated with OpenAI models and corporate vector search.'
    }
  ];

  return `
  <section class="section" id="case-studies" style="background: rgba(255, 255, 255, 0.01);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Demonstrated Impact</div>
        <h2 class="section-title">Case Studies & <span class="text-gradient">Proven Outcomes</span></h2>
        <p class="section-desc">
          See how DevCraft transforms business challenges into high-performing, revenue-generating software systems.
        </p>
      </div>

      <div class="case-studies-spotlight-grid">
        ${spotlights.map(s => `
          <div class="cs-spotlight-card">
            <div class="cs-spot-header">
              <span class="badge-subtle">${s.client}</span>
              <h3 class="service-title" style="margin-top: 8px;">${s.service}</h3>
            </div>
            <p class="service-desc">${s.highlight}</p>
            <div class="cs-spot-metrics">
              ${s.metrics.map(m => `<span class="cs-pill">${m}</span>`).join('')}
            </div>
            <div class="cs-spot-actions">
              <button class="btn btn-outline btn-sm" onclick="devcraftDemos.openCaseStudyModal('${s.id}')">
                Read Detailed Case Study →
              </button>
              <button class="btn btn-primary btn-sm" onclick="devcraftDemos.openDemoModal('${s.id}')">
                Launch Live Demo
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 10: About DevCraft
function renderAboutSection() {
  return `
  <section class="section" id="about">
    <div class="container">
      <div class="about-grid-layout">
        <div class="about-text-col">
          <div class="section-badge">Studio Story & Ethos</div>
          <h2 class="section-title">Ideas → Code → <span class="text-gradient">Real Solutions</span></h2>
          <p class="service-desc">
            DevCraft was founded by lead software engineer Harshit with a single mission: to eliminate the friction, delays, and bloat that plague modern software development.
          </p>
          <p class="service-desc">
            We operate as an elite engineering strike team. Rather than handing your project to junior developers or layers of non-technical account managers, every line of code at DevCraft is designed, built, and reviewed by experienced software architects.
          </p>
          <p class="service-desc">
            From our core engineering hub, we serve clients worldwide across startups, retail brands, healthcare companies, and high-growth platforms.
          </p>

          <div class="about-pillars-row">
            <div class="about-pillar-item">
              <strong>Direct Engineering Access</strong>
              <small>Speak directly with the architects building your product.</small>
            </div>
            <div class="about-pillar-item">
              <strong>Transparent Git Delivery</strong>
              <small>Commit logs, PR reviews, and live preview staging at every step.</small>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <a href="#contact" class="btn btn-primary">Work With DevCraft</a>
          </div>
        </div>

        <div class="about-card-col">
          <div class="about-profile-card">
            <div class="profile-avatar-wrap">
              <img src="/assets/images/avatar-harshit.svg" alt="Harshit - Lead Software Architect" />
            </div>
            <h3 class="profile-name">Harshit</h3>
            <div class="profile-role text-gradient">Lead Software Architect & Founder</div>
            <p class="profile-bio">
              Full-stack engineer passionate about high-concurrency architectures, 3D WebGL interfaces, native Android systems, and autonomous AI pipelines.
            </p>

            <div class="profile-skills-pills">
              <span class="tech-tag">React / Next.js</span>
              <span class="tech-tag">Node.js</span>
              <span class="tech-tag">Kotlin / Android</span>
              <span class="tech-tag">PostgreSQL</span>
              <span class="tech-tag">Docker / DevOps</span>
              <span class="tech-tag">OpenAI LLMs</span>
            </div>

            <div class="profile-social-links">
              <a href="https://wa.me/918630976928" target="_blank" rel="noopener noreferrer" class="channel-btn whatsapp">WhatsApp</a>
              <a href="tel:+917017022966" class="channel-btn call">Call</a>
              <a href="https://www.instagram.com/kiro_mage/" target="_blank" rel="noopener noreferrer" class="channel-btn instagram">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}

// Section 11: Client Testimonials
function renderTestimonialsSection() {
  const reviews = [
    {
      name: 'Rohan Malhotra',
      role: 'Co-Founder & COO, CraveX Logistics',
      rating: '5.0 ★',
      text: 'DevCraft built our food delivery app from the ground up in just 6 weeks. The sub-50ms live courier GPS tracking transformed customer retention. Our checkout conversion rate jumped 64% in the first month!'
    },
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Director of Operations, CareFirst Wellness',
      rating: '5.0 ★',
      text: 'TimeSlot Pro completely removed booking headaches for our 8 clinics. Automated Google Calendar syncing and WhatsApp reminders reduced our patient no-show rate to under 2%. Exceptional engineering quality.'
    },
    {
      name: 'Vikramaditya Rao',
      role: 'Head of Technology, VentureScale',
      rating: '5.0 ★',
      text: 'The Nexus Admin Dashboard DevCraft delivered handles over 50k events per second without breaking a sweat. Clean code, comprehensive documentation, and zero maintenance issues over 12 months in production.'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Founder, Nova Trends E-Commerce',
      rating: '5.0 ★',
      text: 'Our previous Shopify setup was sluggish and losing mobile shoppers. DevCraft engineered a custom headless store with sub-second page loads. Our average order value increased by 28% immediately!'
    }
  ];

  return `
  <section class="section" id="testimonials" style="background: rgba(255, 255, 255, 0.01);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Client Trust</div>
        <h2 class="section-title">What Founders Say About <span class="text-gradient">DevCraft</span></h2>
        <p class="section-desc">
          Real feedback from founders, executives, and product leaders who rely on DevCraft to build and scale their software.
        </p>
      </div>

      <div class="testimonials-grid">
        ${reviews.map(r => `
          <div class="testimonial-card">
            <div class="testimonial-rating text-warning">${r.rating}</div>
            <p class="testimonial-text">"${r.text}"</p>
            <div class="testimonial-author">
              <strong>${r.name}</strong>
              <small>${r.role}</small>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 12: Interactive FAQ Accordion
function renderFaqSection() {
  const faqs = [
    {
      q: 'How does DevCraft manage project milestones and delivery timelines?',
      a: 'Every project begins with a crystal-clear technical specification, fixed deliverables, and bi-weekly sprint milestones. You receive access to a dedicated client staging environment where you can review live working builds at the end of every sprint.'
    },
    {
      q: 'Do I get complete ownership of the source code and intellectual property (IP)?',
      a: 'Yes, 100%. Upon final project milestone completion, all copyright and intellectual property rights are formally transferred to your entity. You receive clean, well-documented Git repositories with zero proprietary dependencies or vendor lock-in.'
    },
    {
      q: 'Can DevCraft refactor, modernize, or take over an existing troubled codebase?',
      a: 'Yes. We regularly conduct comprehensive Code Audits to inspect performance bottlenecks, security vulnerabilities, and outdated dependencies. We then formulate a safe, phased migration plan to modernize your software without interrupting live production users.'
    },
    {
      q: 'Which cloud infrastructure platforms and databases do you deploy to?',
      a: 'We deploy to Render, AWS (EC2, S3, CloudFront, RDS), Vercel, and Cloudflare. For databases, we specialize in PostgreSQL, MongoDB, Redis caching, and vector stores such as Pinecone.'
    },
    {
      q: 'Do you sign Non-Disclosure Agreements (NDAs) before discussing project details?',
      a: 'Absolutely. We routinely sign bilateral NDAs before scoping calls to guarantee your proprietary business logic, algorithms, and intellectual property remain strictly confidential.'
    },
    {
      q: 'What happens after deployment? Do you offer post-launch maintenance & support?',
      a: 'Yes. Every project includes 30 days of complimentary post-launch warranty support. Beyond that, we provide monthly retainer packages covering 24/7 server monitoring, automated backups, security patches, and on-demand feature additions.'
    }
  ];

  return `
  <section class="section" id="faq">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Common Inquiries</div>
        <h2 class="section-title">Frequently Asked <span class="text-gradient">Questions</span></h2>
        <p class="section-desc">
          Clear, straightforward answers about how we collaborate, bill, engineer, and support your software.
        </p>
      </div>

      <div class="faq-accordion" id="faq-accordion">
        ${faqs.map((faq, i) => `
          <div class="faq-item ${i === 0 ? 'active' : ''}" onclick="toggleFaq(this)">
            <div class="faq-question">
              <span>${faq.q}</span>
              <span class="faq-toggle-icon">+</span>
            </div>
            <div class="faq-answer">
              <p>${faq.a}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

// Section 13: Transparent Pricing & Project Estimator
function renderPricingSection() {
  return `
  <section class="section" id="pricing" style="background: rgba(255, 255, 255, 0.01);">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Transparent Investment</div>
        <h2 class="section-title">Straightforward <span class="text-gradient">Pricing Tiers</span></h2>
        <p class="section-desc">
          No hidden fees or unexpected billing spikes. Fixed milestones, dedicated sprints, and predictable ROI.
        </p>
      </div>

      <!-- Pricing Cards -->
      <div class="pricing-tiers-grid">
        <!-- Tier 1 -->
        <div class="pricing-card">
          <div class="pricing-badge">Bug Fix &amp; Integration</div>
          <h3 class="pricing-title">Starter Sprint</h3>
          <div class="pricing-price-num text-gradient">₹999 – ₹1,999</div>
          <p class="pricing-desc">Ideal for rapid bug fixing, payment gateway API setup, or background workflow automation.</p>
          <ul class="pricing-features-list">
            <li><span>✓</span> Emergency bug triage &amp; UI fixes</li>
            <li><span>✓</span> Payment gateway API (TranzUPI / Razorpay)</li>
            <li><span>✓</span> Automated WhatsApp / Email alert triggers</li>
            <li><span>✓</span> Same-day or 48-hour delivery</li>
            <li><span>✓</span> 100% source code handover</li>
          </ul>
          <a href="https://api.whatsapp.com/send?phone=918630976928&text=Hello%20DevCraft%20%F0%9F%91%8B%20I%20want%20to%20book%20Starter%20Sprint%20(Under%20%E2%82%B92,000)" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-block" style="justify-content: center;">Book Starter Sprint ⚡</a>
        </div>

        <!-- Tier 2 (Featured) -->
        <div class="pricing-card featured">
          <div class="pricing-badge-popular">Most Popular</div>
          <div class="pricing-badge">Full Solution</div>
          <h3 class="pricing-title">App &amp; Website Sprint</h3>
          <div class="pricing-price-num text-gradient">₹2,499 – ₹3,999</div>
          <p class="pricing-desc">Complete high-speed business website, native Android app, or custom conversational AI solution.</p>
          <ul class="pricing-features-list">
            <li><span>✓</span> Responsive Next.js / React Website or Android App</li>
            <li><span>✓</span> On-device or cloud AI bot integration</li>
            <li><span>✓</span> Instant WhatsApp inquiry funnel &amp; lead capture</li>
            <li><span>✓</span> Free hosting &amp; custom domain setup</li>
            <li><span>✓</span> Complete source code ownership (.ZIP)</li>
          </ul>
          <a href="https://api.whatsapp.com/send?phone=918630976928&text=Hello%20DevCraft%20%F0%9F%91%8B%20I%20want%20to%20book%20App%20%26%20Website%20Sprint%20(Under%20%E2%82%B94,000)" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block" style="justify-content: center;">Book App/Website Sprint 🚀</a>
        </div>

        <!-- Tier 3 -->
        <div class="pricing-card">
          <div class="pricing-badge">Full-Stack Custom</div>
          <h3 class="pricing-title">Custom Software Suite</h3>
          <div class="pricing-price-num text-gradient">₹4,499 – ₹4,999</div>
          <p class="pricing-desc">Full-stack web application, client portal with database, or custom desktop software (Electron/Python).</p>
          <ul class="pricing-features-list">
            <li><span>✓</span> Full-stack Web App or Desktop Software (PC/Mac)</li>
            <li><span>✓</span> User authentication, databases (PostgreSQL/MongoDB)</li>
            <li><span>✓</span> Interactive management dashboards &amp; tables</li>
            <li><span>✓</span> Dynamic NPCI UPI QR &amp; instant payment verification</li>
            <li><span>✓</span> Full commercial IP transfer &amp; setup guide</li>
          </ul>
          <a href="https://api.whatsapp.com/send?phone=918630976928&text=Hello%20DevCraft%20%F0%9F%91%8B%20I%20want%20to%20book%20Custom%20Software%20Suite%20(Under%20%E2%82%B95,000)" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-block" style="justify-content: center;">Book Custom Suite 💻</a>
        </div>
      </div>

      <!-- Interactive Project Cost Estimator -->
      <div class="pricing-estimator-box" style="margin-top: 50px;">
        <div class="estimator-header text-center">
          <h3>Interactive Project Cost Estimator</h3>
          <p class="text-secondary">Get an instant preliminary estimate tailored to your project scope.</p>
        </div>

        <div class="estimator-controls-grid">
          <div class="est-control">
            <label class="input-label">Project Type</label>
            <select class="form-control" id="est-type" onchange="calculateEstimate()">
              <option value="web">Full-Stack Web App</option>
              <option value="mobile">Mobile App (iOS & Android)</option>
              <option value="ai">AI Agent & LLM Automation</option>
              <option value="dashboard">Admin Operations Dashboard</option>
              <option value="website">High-Speed Business Website</option>
            </select>
          </div>

          <div class="est-control">
            <label class="input-label">Complexity Level</label>
            <select class="form-control" id="est-complexity" onchange="calculateEstimate()">
              <option value="mvp">Lean MVP (Fast to market)</option>
              <option value="standard" selected>Production Standard (Auth, DB, APIs)</option>
              <option value="enterprise">Enterprise Grade (High concurrency, AI, SLA)</option>
            </select>
          </div>

          <div class="est-control">
            <label class="input-label">Desired Delivery Window</label>
            <select class="form-control" id="est-speed" onchange="calculateEstimate()">
              <option value="normal">Standard (4 - 6 Weeks)</option>
              <option value="express">Express Sprint (2 - 3 Weeks)</option>
              <option value="flexible">Flexible (8+ Weeks)</option>
            </select>
          </div>
        </div>

        <div class="estimator-result-bar">
          <div>
            <div class="est-label">Estimated Investment Range:</div>
            <div class="est-value text-gradient" id="est-result-val">₹45,000 – ₹75,000</div>
          </div>
          <button class="btn btn-primary" onclick="devcraftDemos.startProjectFor('Custom Estimator Quote')">
            Claim This Estimate →
          </button>
        </div>
      </div>
    </div>
  </section>
  `;
}

// Section 14: Project Inquiry Form
function renderContactSection() {
  return `
  <section class="section" id="contact">
    <div class="container">
      <div class="contact-grid">
        <!-- Contact Info Column -->
        <div class="contact-info-col">
          <div class="section-badge">Let's Build Together</div>
          <h2 class="section-title">Start Your <span class="text-gradient">DevCraft Project</span></h2>
          <p class="service-desc">
            Tell us what you want to build. We will review your requirements, prepare a comprehensive technical architecture proposal, and respond within 24 hours.
          </p>

          <div class="contact-methods-list">
            <a href="https://wa.me/918630976928?text=Hi%20DevCraft,%20I'd%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" class="contact-method-card">
              <div class="method-icon wa-icon">💬</div>
              <div>
                <strong>Chat Directly on WhatsApp</strong>
                <small>+91 8630976928 • Typically replies in 15 minutes</small>
              </div>
            </a>

            <a href="tel:+917017022966" class="contact-method-card">
              <div class="method-icon call-icon">📞</div>
              <div>
                <strong>Direct Studio Call</strong>
                <small>+91 7017022966 • Available 09:00 - 21:00 IST</small>
              </div>
            </a>

            <a href="mailto:shakyaharshit683@gmail.com" class="contact-method-card">
              <div class="method-icon mail-icon">✉️</div>
              <div>
                <strong>Direct Email Address</strong>
                <small>shakyaharshit683@gmail.com • Strict NDA compliant</small>
              </div>
            </a>
          </div>

          <div class="contact-trust-points">
            <div>✓ Strict Non-Disclosure Agreement (NDA) on request</div>
            <div>✓ Detailed scope & fixed-cost quotation guarantee</div>
            <div>✓ Direct communication with Senior Software Architect</div>
          </div>
        </div>

        <!-- Working Inquiry Form -->
        <div class="contact-form-card">
          <h3 class="form-title">Send Project Inquiry</h3>
          <p class="form-subtitle">Fill in the specifications below to initiate your sprint.</p>

          <form id="project-inquiry-form" onsubmit="submitInquiry(event)">
            <div class="form-row">
              <div class="form-group">
                <label class="input-label" for="client-name">Your Full Name *</label>
                <input type="text" id="client-name" name="name" class="form-control" placeholder="e.g. Rahul Sharma" required />
              </div>
              <div class="form-group">
                <label class="input-label" for="client-email">Work Email *</label>
                <input type="email" id="client-email" name="email" class="form-control" placeholder="rahul@company.com" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="input-label" for="client-phone">Phone / WhatsApp *</label>
                <input type="tel" id="client-phone" name="phone" class="form-control" placeholder="+91 98765 43210" required />
              </div>
              <div class="form-group">
                <label class="input-label" for="project-service">Primary Service Required *</label>
                <select id="project-service" name="service" class="form-control" required>
                  <option value="" disabled selected>Select a Service</option>
                  ${DEVCRAFT_SERVICES.map(s => `
                    <option value="${s.name}">${s.name}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="input-label" for="project-budget">Estimated Budget Range *</label>
                <select id="project-budget" name="budget" class="form-control" required>
                  <option value="Under ₹25,000">Under ₹25,000 (MVP / Starter)</option>
                  <option value="₹25,000 - ₹60,000" selected>₹25,000 - ₹60,000 (Standard Sprints)</option>
                  <option value="₹60,000 - ₹1,50,000">₹60,000 - ₹1,50,000 (Full-Stack Platform)</option>
                  <option value="₹1,50,000+">₹1,50,000+ (Enterprise Custom / AI)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="input-label" for="project-timeline">Target Timeline</label>
                <select id="project-timeline" name="timeline" class="form-control">
                  <option value="Immediate Sprint (1-2 Weeks)">Immediate Sprint (1-2 Weeks)</option>
                  <option value="Standard Window (3-4 Weeks)" selected>Standard Window (3-4 Weeks)</option>
                  <option value="Quarterly Roadmap (1-2 Months)">Quarterly Roadmap (1-2 Months)</option>
                  <option value="Flexible Schedule">Flexible Schedule</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="input-label" for="project-type">Requirement Type</label>
                <select id="project-type" name="projectType" class="form-control">
                  <option value="New App" selected>New Mobile App (Android / iOS)</option>
                  <option value="Website">Website Development</option>
                  <option value="Web App">Web Application / SaaS Portal</option>
                  <option value="Custom Software">Custom Enterprise Software</option>
                  <option value="AI / Machine Learning">AI Assistant &amp; Machine Learning</option>
                  <option value="Business Automation">Business Automation Pipeline</option>
                  <option value="Feature Request">Feature Request / Enhancements</option>
                  <option value="Bug Fix">Codebase Rescue / Bug Fix</option>
                  <option value="Maintenance">Ongoing Maintenance &amp; Cloud Support</option>
                  <option value="Feedback">Strategic Technical Consultation</option>
                </select>
              </div>
              <div class="form-group">
                <label class="input-label" for="tech-preference">Preferred Tech Stack (Optional)</label>
                <input type="text" id="tech-preference" name="techPreference" class="form-control" placeholder="e.g. React, Node.js, Kotlin, Python, Next.js" />
              </div>
            </div>

            <div class="form-group">
              <label class="input-label" for="project-details">Project Summary & Technical Requirements *</label>
              <textarea id="project-details" name="message" class="form-control" rows="4" placeholder="Briefly describe what you'd like to build, your target audience, existing stack, or any specific demo you want similar to..." required></textarea>
            </div>

            <button type="submit" id="submit-inquiry-btn" class="btn btn-primary btn-block">
              <span>Send Project Inquiry Now →</span>
            </button>
            <div id="form-feedback-msg" class="form-feedback"></div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `;
}

// Section 15: Final High-Impact CTA Banner
function renderFinalCtaSection() {
  return `
  <section class="section final-cta-section" style="padding: 70px 0;">
    <div class="container">
      <div class="final-cta-banner">
        <div class="final-cta-content">
          <div class="section-badge">Accelerate Delivery</div>
          <h2 class="final-cta-title">Have a Software Concept You Need <span class="text-gradient">Shipped Fast?</span></h2>
          <p class="final-cta-desc">
            Let’s turn your vision into high-performance code. Book a free technical architecture consultation with our lead engineer today.
          </p>
          <div class="final-cta-buttons">
            <a href="#contact" class="btn btn-primary">Start Your Project</a>
            <a href="https://wa.me/918630976928?text=Hi%20DevCraft,%20let's%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" class="btn btn-emerald">
              Chat on WhatsApp
            </a>
            <a href="tel:+917017022966" class="btn btn-outline">Call +91 7017022966</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}

// Modals Wrapper (Demo modal, Case Study modal, Service modal, Confirmation modal)
function renderModalsMarkup() {
  return `
  <!-- 1. Interactive Demo Simulator Modal -->
  <div class="devcraft-modal" id="demo-modal">
    <div class="devcraft-modal-dialog">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <h3 id="demo-modal-title">DevCraft Interactive Demo</h3>
          <p id="demo-modal-subtitle">Live simulated application environment</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn btn-xs btn-primary" id="demo-modal-cta">Start Similar Project →</button>
          <button class="devcraft-modal-close" onclick="devcraftDemos.hideModal('demo-modal')" aria-label="Close modal">&times;</button>
        </div>
      </div>
      <div class="devcraft-modal-body" id="demo-interactive-stage">
        <!-- Interactive demo contents rendered here by devcraft-demos.js -->
      </div>
    </div>
  </div>

  <!-- 2. Case Study Modal -->
  <div class="devcraft-modal" id="case-study-modal">
    <div class="devcraft-modal-dialog">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <h3>Client Case Study & Architecture</h3>
          <p>Real challenges, engineering solutions, and measurable impact</p>
        </div>
        <button class="devcraft-modal-close" onclick="devcraftDemos.hideModal('case-study-modal')" aria-label="Close modal">&times;</button>
      </div>
      <div class="devcraft-modal-body" id="case-study-modal-body">
        <!-- Case study details rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- 3. Service Details Modal -->
  <div class="devcraft-modal" id="service-modal">
    <div class="devcraft-modal-dialog">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <h3>Development Service Specification</h3>
          <p>Features, use-cases, and production architectures</p>
        </div>
        <button class="devcraft-modal-close" onclick="devcraftDemos.hideModal('service-modal')" aria-label="Close modal">&times;</button>
      </div>
      <div class="devcraft-modal-body" id="service-modal-body">
        <!-- Service details rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- 4. Inquiry Success Confirmation Modal -->
  <div class="devcraft-modal" id="inquiry-success-modal">
    <div class="devcraft-modal-dialog" style="max-width: 500px; text-align: center;">
      <div class="devcraft-modal-body" style="padding: 40px 30px;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Inquiry Received Successfully!</h3>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5;">
          Thank you for reaching out to <strong>DEVCRAFT</strong>. Our lead software architect will review your project requirements and connect with you via email and WhatsApp within 24 hours.
        </p>
        <div style="background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px; margin: 20px 0; font-family: var(--font-mono); font-size: 0.85rem;" id="inquiry-ref-box">
          Inquiry Ref: DC-INQ-705532
        </div>
        <button class="btn btn-primary btn-block" onclick="devcraftDemos.hideModal('inquiry-success-modal')">
          Back to DevCraft Studio
        </button>
      </div>
    </div>
  </div>

  <!-- 5. Product Detail Modal (Requirement 9) -->
  <div class="devcraft-modal" id="product-detail-modal">
    <div class="devcraft-modal-dialog product-modal-dialog">
      <button class="devcraft-modal-close" onclick="devcraftShop.hideModal('product-detail-modal')" aria-label="Close modal">&times;</button>
      <div class="devcraft-modal-body" id="product-detail-modal-body">
        <!-- Rendered dynamically by devcraftShop.openProductModal -->
      </div>
    </div>
  </div>

  <!-- 6. Share Product Modal (Requirement 5, 6, 7) -->
  <div class="devcraft-modal" id="share-product-modal">
    <div class="devcraft-modal-dialog share-modal-dialog">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <h3>Share with Network</h3>
          <p>Spread the word via WhatsApp, Telegram, X, or direct link</p>
        </div>
        <button class="devcraft-modal-close" onclick="devcraftShop.hideModal('share-product-modal')" aria-label="Close modal">&times;</button>
      </div>
      <div class="devcraft-modal-body" id="share-product-modal-body">
        <!-- Rendered dynamically by devcraftShop.openShareModal -->
      </div>
    </div>
  </div>

  <!-- 7. Checkout & Coupon Order Modal (Requirement 3 & 4) -->
  <div class="devcraft-modal" id="checkout-order-modal">
    <div class="devcraft-modal-dialog checkout-modal-dialog">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <h3>Order &amp; Project Checkout</h3>
          <p>Instant booking with automatic discounts and secure coupon verification</p>
        </div>
        <button class="devcraft-modal-close" onclick="devcraftShop.hideModal('checkout-order-modal')" aria-label="Close modal">&times;</button>
      </div>
      <div class="devcraft-modal-body" id="checkout-order-modal-body">
        <!-- Rendered dynamically by devcraftShop.openCheckoutModal -->
      </div>
    </div>
  </div>

  <!-- 8. Order Success Modal -->
  <div class="devcraft-modal" id="order-success-modal">
    <div class="devcraft-modal-dialog" style="max-width: 540px;">
      <div class="devcraft-modal-body" id="order-success-modal-body">
        <!-- Rendered dynamically by devcraftShop.showOrderSuccess -->
      </div>
    </div>
  </div>

  <!-- 9. Dynamic UPI Payment & Verification Modal -->
  <div class="devcraft-modal" id="upi-payment-modal">
    <div class="devcraft-modal-dialog upi-modal-dialog" style="max-width: 560px;">
      <div class="devcraft-modal-header">
        <div class="modal-header-text">
          <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #10b981; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            <span class="status-dot"></span> Secure UPI Payment Gateway
          </div>
          <h3 id="upi-modal-title" style="margin-top: 4px;">Dynamic UPI QR &amp; Verification</h3>
          <p id="upi-modal-subtitle">Pay securely via any UPI App or scan QR to unlock instant source code download</p>
        </div>
        <button class="devcraft-modal-close" onclick="devcraftShop.hideModal('upi-payment-modal')" aria-label="Close modal">&times;</button>
      </div>
      <div class="devcraft-modal-body" id="upi-payment-modal-body">
        <!-- Rendered dynamically by devcraftShop.openUpiPaymentModal -->
      </div>
    </div>
  </div>
  `;
}

// Embedded Data & Scripts
function renderClientDataScripts() {
  return `
  <!-- Embed Catalogs in Client Window for Zero-Lag Execution -->
  <script>
    window.DEVCRAFT_SERVICES_DATA = ${safeJsonServices};
    window.DEVCRAFT_DEMOS_DATA = ${safeJsonDemos};
    window.DEVCRAFT_PRODUCTS_DATA = ${safeJsonProducts};
  </script>

  <!-- External CDNs for Three.js WebGL (Safe fallback handled in three-scene.js) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <!-- DevCraft Core Scripts -->
  <script src="/js/api.js"></script>
  <script src="/js/devcraft-auth.js"></script>
  <script src="/js/devcraft-demos.js"></script>
  <script src="/js/devcraft-shop.js"></script>
  <script src="/js/three-scene.js"></script>
  <script src="/js/main.js"></script>
  <script src="/js/form.js"></script>
  `;
}

// ==========================================
// 2. BUILD FRONTEND / INDEX.HTML
// ==========================================
function buildIndexHtml() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('DEVCRAFT Studio', 'Ideas → Code → Real Solutions. High-performance software engineering studio offering Android & mobile apps, full-stack web applications, AI automation, and custom software.')}
</head>
<body>
  ${navbar('home')}

  <main>
    ${renderHeroSection()}
    ${renderFlagshipsSection()}
    ${renderServicesSection()}
    ${renderWhySection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(FRONTEND, 'index.html'), html, 'utf8');
  console.log('✓ Generated frontend/index.html with streamlined structure.');
}

// ==========================================
// 3. BUILD SUBPAGES (SERVICES, PROJECTS, ABOUT, CONTACT, PORTAL, ADMIN)
// ==========================================
function buildServicesPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('All 20 Development Services & Aptitude Hub', 'Explore DevCraft’s comprehensive catalog of 20 software development services (50% OFF) and Campus Aptitude & Placement Prep courses (30% OFF).')}
</head>
<body>
  ${navbar('services')}

  <main style="padding-top: 100px;">
    ${renderServicesSection()}
    ${renderAptitudeSection()}
    ${renderPricingSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'services.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/services.html');
}

function buildProjectsPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('Interactive Demos & Portfolio', 'Explore 10 interactive application demos engineered by DevCraft across Mobile, Web, AI, and Dashboards.')}
</head>
<body>
  ${navbar('demos')}

  <main style="padding-top: 100px;">
    ${renderFeaturedDemosSection()}
    ${renderDemoLabSection()}
    ${renderCaseStudiesSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'projects.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/projects.html');
}

function buildAboutPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('About DevCraft Studio', 'Learn about DevCraft’s software engineering philosophy, lead architect Harshit, and our production standards.')}
</head>
<body>
  ${navbar('about')}

  <main style="padding-top: 100px;">
    ${renderAboutSection()}
    ${renderWhySection()}
    ${renderProcessSection()}
    ${renderTechSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'about.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/about.html');
}

function buildContactPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('Contact & Project Inquiry', 'Start your software project with DevCraft. Request a quote or schedule a technical scoping call.')}
</head>
<body>
  ${navbar('contact')}

  <main style="padding-top: 100px;">
    ${renderContactSection()}
    ${renderFaqSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'contact.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/contact.html');
}

function buildClientPortalPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('Client Portal & Authentication', 'Access your live DevCraft sprint milestones, staging links, invoices, and project roadmap.')}
</head>
<body>
  ${navbar('portal')}

  <main style="padding: 120px 0 80px; min-height: 80vh; display: flex; align-items: center;">
    <div class="container" style="max-width: 540px;">
      <div class="glass-card" style="padding: 36px; border-radius: 24px; border: 1px solid var(--border-glow); box-shadow: 0 20px 50px rgba(0,0,0,0.4);">
        
        <!-- Tab Navigation -->
        <div style="display: flex; background: rgba(0,0,0,0.25); padding: 4px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--border-glass);">
          <button type="button" id="tab-btn-login" class="btn btn-sm" style="flex: 1; border-radius: 8px; background: var(--accent); color: #fff; border: none; font-weight: 700;" onclick="switchAuthTab('login')">
            Sign In
          </button>
          <button type="button" id="tab-btn-register" class="btn btn-sm" style="flex: 1; border-radius: 8px; background: transparent; color: var(--text-secondary); border: none; font-weight: 700;" onclick="switchAuthTab('register')">
            Create Account
          </button>
          <button type="button" id="tab-btn-forgot" class="btn btn-sm" style="flex: 1; border-radius: 8px; background: transparent; color: var(--text-secondary); border: none; font-weight: 700;" onclick="switchAuthTab('forgot')">
            Reset Password
          </button>
        </div>

        <div id="portal-alert" class="auth-alert" style="display: none; margin-bottom: 18px;"></div>

        <!-- 1. Sign In Tab -->
        <div id="auth-panel-login">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">Client Sign In</h2>
            <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">Sign in to view your projects, invoices &amp; downloads.</p>
          </div>

          <form id="portal-login-form" onsubmit="handlePortalLogin(event)">
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="input-label">Email Address</label>
              <input type="email" id="portal-login-email" class="form-control" placeholder="name@company.com" required autocomplete="email" />
            </div>
            <div class="form-group" style="margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="input-label" style="margin-bottom: 0;">Password</label>
                <a href="javascript:void(0)" onclick="switchAuthTab('forgot')" style="font-size: 0.8rem; color: var(--cyan); text-decoration: none;">Forgot password?</a>
              </div>
              <input type="password" id="portal-login-password" class="form-control" placeholder="••••••••" required autocomplete="current-password" />
            </div>
            <button type="submit" id="portal-login-submit" class="btn btn-primary btn-block" style="padding: 12px; font-weight: 700;">
              Sign In to Client Portal →
            </button>
          </form>
        </div>

        <!-- 2. Create Account Tab -->
        <div id="auth-panel-register" style="display: none;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">Create Client Account</h2>
            <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">Instant access to invoices, project tracking &amp; code downloads.</p>
          </div>

          <form id="portal-register-form" onsubmit="handlePortalRegister(event)">
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="input-label">Full Name *</label>
              <input type="text" id="portal-reg-name" class="form-control" placeholder="Harshit Shakya" required autocomplete="name" />
            </div>
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="input-label">Email Address *</label>
              <input type="email" id="portal-reg-email" class="form-control" placeholder="name@company.com" required autocomplete="email" />
            </div>
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="input-label">WhatsApp / Phone Number</label>
              <input type="tel" id="portal-reg-phone" class="form-control" placeholder="+91 8630976928" autocomplete="tel" />
            </div>
            <div class="form-group" style="margin-bottom: 18px;">
              <label class="input-label">Create Password (min 8 chars, letters &amp; numbers) *</label>
              <input type="password" id="portal-reg-password" class="form-control" placeholder="••••••••" required autocomplete="new-password" />
            </div>
            <button type="submit" id="portal-reg-submit" class="btn btn-emerald btn-block" style="padding: 12px; font-weight: 700;">
              Register Client Account 🚀
            </button>
          </form>
        </div>

        <!-- 3. Forgot Password Tab -->
        <div id="auth-panel-forgot" style="display: none;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">Reset Password</h2>
            <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">Enter your email to receive a secure password reset link.</p>
          </div>

          <form id="portal-forgot-form" onsubmit="handlePortalForgot(event)">
            <div class="form-group" style="margin-bottom: 18px;">
              <label class="input-label">Registered Email Address</label>
              <input type="email" id="portal-forgot-email" class="form-control" placeholder="name@company.com" required autocomplete="email" />
            </div>
            <button type="submit" id="portal-forgot-submit" class="btn btn-primary btn-block" style="padding: 12px; font-weight: 700;">
              Send Reset Link →
            </button>
          </form>
        </div>

        <div style="margin-top: 24px; text-align: center; font-size: 0.82rem; color: var(--text-muted); border-top: 1px solid var(--border-glass); padding-top: 16px;">
          Need immediate support? <a href="https://wa.me/918630976928" target="_blank" style="color: var(--cyan); font-weight: 600;">Chat on WhatsApp (+91 8630976928)</a>
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
  <script src="/js/devcraft-auth.js"></script>

  <script>
    function switchAuthTab(tab) {
      document.getElementById('auth-panel-login').style.display = tab === 'login' ? 'block' : 'none';
      document.getElementById('auth-panel-register').style.display = tab === 'register' ? 'block' : 'none';
      document.getElementById('auth-panel-forgot').style.display = tab === 'forgot' ? 'block' : 'none';

      const btnLogin = document.getElementById('tab-btn-login');
      const btnReg = document.getElementById('tab-btn-register');
      const btnForgot = document.getElementById('tab-btn-forgot');

      btnLogin.style.background = tab === 'login' ? 'var(--accent)' : 'transparent';
      btnLogin.style.color = tab === 'login' ? '#fff' : 'var(--text-secondary)';

      btnReg.style.background = tab === 'register' ? 'var(--accent)' : 'transparent';
      btnReg.style.color = tab === 'register' ? '#fff' : 'var(--text-secondary)';

      btnForgot.style.background = tab === 'forgot' ? 'var(--accent)' : 'transparent';
      btnForgot.style.color = tab === 'forgot' ? '#fff' : 'var(--text-secondary)';

      const alertBox = document.getElementById('portal-alert');
      if (alertBox) alertBox.style.display = 'none';
    }

    function showPortalAlert(msg, type = 'danger') {
      const alertBox = document.getElementById('portal-alert');
      if (!alertBox) return;
      alertBox.textContent = msg;
      alertBox.className = 'auth-alert ' + type;
      alertBox.style.display = 'block';
    }

    async function handlePortalLogin(e) {
      e.preventDefault();
      const email = document.getElementById('portal-login-email').value.trim();
      const password = document.getElementById('portal-login-password').value;
      const btn = document.getElementById('portal-login-submit');

      btn.disabled = true;
      btn.textContent = 'Authenticating...';

      try {
        await DevCraftAuth.login(email, password, true);
        showPortalAlert('Login successful! Redirecting to Dashboard...', 'success');
        setTimeout(() => { window.location.href = '/dashboard'; }, 600);
      } catch (err) {
        showPortalAlert(err.message || 'Invalid email or password.');
        btn.disabled = false;
        btn.textContent = 'Sign In to Client Portal →';
      }
    }

    async function handlePortalRegister(e) {
      e.preventDefault();
      const name = document.getElementById('portal-reg-name').value.trim();
      const email = document.getElementById('portal-reg-email').value.trim();
      const phone = document.getElementById('portal-reg-phone').value.trim();
      const password = document.getElementById('portal-reg-password').value;
      const btn = document.getElementById('portal-reg-submit');

      btn.disabled = true;
      btn.textContent = 'Creating Account...';

      try {
        await DevCraftAuth.register({ name, email, phone, password });
        showPortalAlert('Account created successfully! Loading Dashboard...', 'success');
        setTimeout(() => { window.location.href = '/dashboard'; }, 700);
      } catch (err) {
        showPortalAlert(err.message || 'Registration failed. Please check your details.');
        btn.disabled = false;
        btn.textContent = 'Register Client Account 🚀';
      }
    }

    async function handlePortalForgot(e) {
      e.preventDefault();
      const email = document.getElementById('portal-forgot-email').value.trim();
      const btn = document.getElementById('portal-forgot-submit');

      btn.disabled = true;
      btn.textContent = 'Generating Link...';

      try {
        const res = await DevCraftAuth.forgotPassword(email);
        showPortalAlert(res.message || 'Password reset link sent to your email.', 'success');
      } catch (err) {
        showPortalAlert(err.message || 'Could not process password reset.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Reset Link →';
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      if (window.DevCraftAuth && DevCraftAuth.isAuthenticated()) {
        window.location.href = '/dashboard';
      }
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'client-portal.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'client-portal.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/client-portal.html');
}

function buildAdminLoginPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('Studio Admin Portal', 'DevCraft Internal Operations Cockpit & Inquiry Manager')}
</head>
<body>
  ${navbar()}

  <main style="padding: 120px 0 80px; min-height: 80vh; display: flex; align-items: center;">
    <div class="container" style="max-width: 500px;">
      <div class="glass-card" style="padding: 40px; border-radius: 20px; border: 1px solid var(--border-glow);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div class="brand-badge-icon" style="margin: 0 auto 16px; background: #f59e0b;">
            🔒
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 700;">Studio Admin Authentication</h2>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">Authorized engineering personnel only</p>
        </div>

        <form id="admin-login-form" onsubmit="handleAdminLogin(event)">
          <div class="form-group" style="margin-bottom: 16px;">
            <label class="input-label">Admin Email</label>
            <input type="email" id="admin-email-input" class="form-control" placeholder="shakyaharshit683@gmail.com" value="shakyaharshit683@gmail.com" required />
          </div>
          <div class="form-group" style="margin-bottom: 20px;">
            <label class="input-label">Admin Password</label>
            <input type="password" id="admin-password-input" class="form-control" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Authenticate Session 🔒</button>
        </form>

        <div id="admin-login-feedback" style="margin-top: 15px; text-align: center; font-size: 0.85rem;"></div>
      </div>
    </div>
  </main>

  ${footer()}
  ${renderClientDataScripts()}
  <script>
    async function handleAdminLogin(e) {
      e.preventDefault();
      const email = document.getElementById('admin-email-input').value;
      const password = document.getElementById('admin-password-input').value;
      const fb = document.getElementById('admin-login-feedback');
      fb.innerHTML = '<span style="color: var(--cyan);">Authenticating...</span>';

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem('admin_token', data.token);
          fb.innerHTML = '<span style="color: #10b981;">Access Granted! Redirecting...</span>';
          setTimeout(() => { window.location.href = '/admin/'; }, 600);
        } else {
          fb.innerHTML = '<span style="color: #ef4444;">' + (data.message || 'Invalid admin credentials') + '</span>';
        }
      } catch (err) {
        fb.innerHTML = '<span style="color: #ef4444;">Server connection error. Please try again.</span>';
      }
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'admin-login.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/admin-login.html');
}

// ==========================================
// 4. DEDICATED PRODUCTS CATALOG PAGE
// ==========================================
function buildProductsPage() {
  const categories = ['All', 'Android Apps', 'PC Software', 'AI Products', 'Utilities', 'Aptitude', 'Other Products'];

  const productCardsHtml = DEVCRAFT_PRODUCTS.map(p => {
    const isAptitude = p.type === 'aptitude' || p.category === 'Aptitude';
    const discountPercent = isAptitude ? 30 : 50;
    const originalPrice = Number(p.originalPrice) || 10000;
    const finalPrice = p.finalPrice !== undefined ? p.finalPrice : Math.round(originalPrice * (1 - discountPercent / 100));

    let detailsLink = '/products';
    if (p.id === 'joya-ai') detailsLink = '/joya';
    else if (p.id === 'jarvis-ai') detailsLink = '/jarvis';
    else if (isAptitude) detailsLink = '/aptitude';

    return `
    <div class="product-shop-card" data-category="${p.category || 'Other'}" data-name="${(p.name || '').toLowerCase()}" data-price="${finalPrice}">
      ${p.id === 'joya-ai' ? `
      <div style="width: 100%; border-radius: 10px; overflow: hidden; margin-bottom: 12px; border: 1px solid rgba(168, 85, 247, 0.3); background: #080d1a;">
        <img src="/assets/images/joya-ai-animated.svg" alt="Joya AI Voice Assistant" style="width: 100%; height: auto; display: block;" loading="lazy" />
      </div>
      ` : p.id === 'jarvis-ai' ? `
      <div style="width: 100%; border-radius: 10px; overflow: hidden; margin-bottom: 12px; border: 1px solid rgba(59, 130, 246, 0.3); background: #080d1a;">
        <img src="/assets/images/jarvis-ai-animated.svg" alt="Jarvis AI PC Assistant" style="width: 100%; height: auto; display: block;" loading="lazy" />
      </div>
      ` : ''}
      <div class="product-card-top">
        <div class="product-card-meta">
          <span class="product-category-chip">${p.category}</span>
          <span class="product-discount-chip ${isAptitude ? 'chip-aptitude' : 'chip-app'}">
            ${discountPercent}% OFF
          </span>
        </div>
        ${p.platform ? `<span class="product-platform-tag">${p.platform}</span>` : ''}
      </div>

      <div class="product-card-info">
        <h3 class="product-card-title">${p.name}</h3>
        <p class="product-card-desc">${p.shortDesc}</p>
        
        <ul class="product-card-features">
          ${(p.features || []).slice(0, 3).map(f => `<li><span class="check-icon">✓</span> ${f}</li>`).join('')}
        </ul>

        <div class="product-tech-stack">
          ${(p.technologies || []).slice(0, 4).map(t => `<span class="tech-mini-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="product-card-pricing-footer">
        <div class="product-price-block">
          <div class="product-price-orig">
            <span>Original:</span>
            <del>₹${originalPrice.toLocaleString('en-IN')}</del>
          </div>
          <div class="product-price-final">
            <span class="price-val text-gradient">₹${finalPrice.toLocaleString('en-IN')}</span>
            <span class="price-save-badge">Save ${discountPercent}%</span>
          </div>
        </div>

        <div class="product-card-btn-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <a href="https://api.whatsapp.com/send?phone=918630976928&text=${encodeURIComponent('Hello DevCraft 👋 I want to buy ' + p.name + ' (₹' + finalPrice.toLocaleString('en-IN') + ') Full Source Code.')}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm" style="justify-content: center; font-weight: 700; text-decoration: none;">
            💬 WhatsApp Buy
          </a>
          <a href="${detailsLink}" class="btn btn-outline btn-sm" style="justify-content: center; text-decoration: none;">
            View Details →
          </a>
        </div>
      </div>
    </div>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('All App Products & Courses (50% & 30% OFF)', 'Browse DevCraft’s complete marketplace of Android Apps, PC Software, AI Agents, Utilities, and Aptitude courses with automatic 50% & 30% discounts.')}
</head>
<body>
  ${navbar('products')}

  <main style="padding: 120px 0 80px;">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">Full Production Marketplace • Direct Downloads</div>
        <h1 class="section-title">DevCraft <span class="text-gradient">Products &amp; Software</span></h1>
        <p class="section-desc">
          High-performance Android APKs, PC desktop applications, autonomous AI agents, and campus placement courses. All app products feature an automatic <strong>50% discount</strong> and all aptitude courses feature a <strong>30% discount</strong>.
        </p>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="catalog-toolbar" style="margin-bottom: 30px; display: flex; flex-wrap: wrap; gap: 14px; justify-content: space-between; align-items: center;">
        <div class="category-filters-wrap" style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${categories.map(c => `
            <button class="filter-chip-btn ${c === 'All' ? 'active' : ''}" onclick="filterProductsCategory('${c}', this)">
              ${c}
            </button>
          `).join('')}
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          <input type="text" id="catalog-search-input" class="form-control" style="width: 240px; padding: 8px 14px; font-size: 0.85rem;" placeholder="Search products..." oninput="filterProductsSearch(this.value)" />
          <select id="catalog-sort-select" class="form-control" style="width: 170px; padding: 8px 14px; font-size: 0.85rem;" onchange="sortProducts(this.value)">
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="products-grid" id="products-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px;">
        ${productCardsHtml}
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}

  <script>
    let activeCat = 'All';
    let searchQuery = '';

    function filterProductsCategory(category, btn) {
      activeCat = category;
      document.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      applyProductFilters();
    }

    function filterProductsSearch(q) {
      searchQuery = (q || '').trim().toLowerCase();
      applyProductFilters();
    }

    function applyProductFilters() {
      const cards = document.querySelectorAll('.product-shop-card');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const name = card.getAttribute('data-name') || '';

        const catMatches = activeCat === 'All' || cat.toLowerCase().includes(activeCat.toLowerCase());
        const searchMatches = !searchQuery || name.includes(searchQuery) || cat.toLowerCase().includes(searchQuery);

        card.style.display = (catMatches && searchMatches) ? 'flex' : 'none';
      });
    }

    function sortProducts(val) {
      const grid = document.getElementById('products-grid-container');
      const cards = Array.from(grid.querySelectorAll('.product-shop-card'));

      if (val === 'price-low') {
        cards.sort((a, b) => Number(a.getAttribute('data-price')) - Number(b.getAttribute('data-price')));
      } else if (val === 'price-high') {
        cards.sort((a, b) => Number(b.getAttribute('data-price')) - Number(a.getAttribute('data-price')));
      }

      cards.forEach(c => grid.appendChild(c));
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'products.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'products.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/products.html and frontend/products.html');
}

// ==========================================
// 5. JOYA AI DEDICATED FLAGSHIP PAGE
// ==========================================
function buildJoyaPage() {
  const joya = DEVCRAFT_PRODUCTS.find(p => p.id === 'joya-ai') || {};

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('Joya AI — Full Source Code (Android Studio / Kotlin)', 'Customer gets the complete Joya Android source code after successful purchase. Joya AI is an autonomous on-device personal voice assistant for Android with custom wake word "Wake up Joya", WhatsApp automation, and offline neural synthesis.')}
</head>
<body>
  ${navbar('joya')}

  <main style="padding: 120px 0 80px;">
    <div class="container">
      <!-- Hero Section -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: center; margin-bottom: 60px;">
        <div>
          <div class="flagship-hero-badge">🎙️ Android Native (Kotlin) • Full Source Code Included</div>
          <h1 style="font-size: 2.8rem; font-weight: 800; line-height: 1.2; margin-bottom: 16px;">
            Joya AI — <span class="text-gradient">Full Source Code</span> (Android)
          </h1>
          <p style="color: var(--text-secondary); font-size: 1.1rem; line-height: 1.7; margin-bottom: 24px;">
            Customer gets the complete Joya Android source code after successful purchase. Say <span class="wake-word-highlight">"Wake up Joya"</span> to awaken a completely private, on-device mobile assistant. Joya dictates WhatsApp messages, initiates phone calls, creates voice memos, and schedules alarms with zero cloud dependence.
          </p>

          <!-- Interactive Voice Waveform Simulator -->
          <div class="voice-wave-simulator" style="margin-bottom: 28px; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--cyan); text-transform: uppercase;">Acoustic Wake Word Engine: "Wake up Joya"</span>
              <span class="status-pill-online"><span class="status-dot"></span> Sentinel Active</span>
            </div>
            <div class="voice-bars-wrap" style="justify-content: flex-start;">
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
              <span class="voice-bar"></span>
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
              <button type="button" class="btn btn-sm btn-outline" onclick="devcraftShop.simulateJoyaWakeWord()">
                Simulate Wake Word ("Wake up Joya") 🎙️
              </button>
              <div id="joya-voice-status" style="font-size: 0.85rem;"></div>
            </div>
          </div>

          <!-- Pricing & Direct CTAs -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 16px; padding: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Special Promotional Discount (50% OFF):</div>
              <div style="display: flex; align-items: baseline; gap: 10px;">
                <del style="color: var(--text-muted); font-size: 1.2rem;">₹1,999</del>
                <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 800; padding: 2px 8px; border-radius: 6px; font-size: 0.85rem;">50% OFF</span>
                <span class="text-gradient" style="font-size: 2.2rem; font-weight: 800;">₹999</span>
              </div>
              <div style="font-size: 0.82rem; color: #10b981; font-weight: 600; margin-top: 4px;">✓ Full Android Studio Source Code Included</div>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <a href="https://api.whatsapp.com/send?phone=918630976928&text=Hello%20DevCraft%20%F0%9F%91%8B%20I%20want%20to%20buy%20Joya%20AI%20Voice%20Assistant%20(%E2%82%B9999)%20Full%20Source%20Code." target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-lg" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 800; padding: 14px 28px; text-decoration: none;">
                💬 Buy Full Source Code on WhatsApp (₹999) ⚡
              </a>
            </div>
          </div>
        </div>

        <!-- Right Side: Package & Technical Specs -->
        <div class="glass-card" style="padding: 24px; border-radius: 20px; border: 1px solid rgba(168, 85, 247, 0.3);">
          <div style="width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 20px; border: 1px solid rgba(168, 85, 247, 0.3); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4); background: #080d1a;">
            <img src="/assets/images/joya-ai-animated.svg" alt="Joya AI Voice Assistant Animated Core" style="width: 100%; height: auto; display: block;" />
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 20px; color: #ffffff;">Package Technical Specifications</h3>
          
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Delivered Package:</span>
              <strong style="color: var(--cyan);">Full Source Code (.ZIP) + Demo APK</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Target Platform:</span>
              <strong>Android 8.0+ (API 26 to 34, Android 14/15)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Source Package:</span>
              <strong style="font-family: var(--font-mono); color: var(--cyan);">joya-ai-source-code-v2.4.0.zip</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Wake Engine:</span>
              <strong>Porcupine Micro-Wake ("Wake up Joya")</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Automation Core:</span>
              <strong>WhatsApp Dispatch, Dialer, Alarms, TTS</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">License &amp; Ownership:</span>
              <strong style="color: #10b981;">100% Commercial Source Code Handover</strong>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 10px;">Architecture Technologies:</h4>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${(joya.technologies || ['Kotlin', 'Android NDK', 'Porcupine Wake Word', 'TensorFlow Lite', 'Room DB', 'Coroutines']).map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Features Deep Dive -->
      <div style="margin-bottom: 60px;">
        <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 24px; text-align: center;">What You Receive with <span class="text-gradient">Joya AI Source Code</span></h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">📁</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Complete Android Studio Project</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Ready-to-compile Gradle project with Kotlin 1.9, modern ViewBinding / Jetpack Compose layouts, and clean architecture.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🎙️</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Custom Wake Word Engine</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Complete foreground audio service with low battery drain and Porcupine acoustic model tuned for "Wake up Joya".</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">💬</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">WhatsApp &amp; App Automation</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Hands-free voice messaging, automated contact matching, and phone dialer integrations ready to customize.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">📖</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Build Docs &amp; Developer Guide</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Comprehensive README.md with compilation steps, permission guides, and instructions to retrain the wake word.</p>
          </div>
        </div>
      </div>

      <!-- Android Modern Storage & SAF Compliance (Section 7) -->
      <div class="glass-card" style="padding: 30px; border-radius: 20px; margin-bottom: 40px; border-left: 4px solid var(--cyan);">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <span style="font-size: 1.5rem;">🛡️</span>
          <h3 style="font-size: 1.3rem; font-weight: 800; margin: 0;">Android Storage Access Framework (SAF) &amp; OS Compliance</h3>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">
          Unlike amateur projects making unrealistic claims of "unrestricted silent background access", Joya AI strictly respects modern Android operating system security models (Android 11, 12, 13, and 14/15 Scoped Storage).
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">
          <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; padding: 18px;">
            <strong style="color: var(--cyan); display: block; margin-bottom: 6px;">📁 Storage Access Framework (SAF)</strong>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0;">Uses native Android document picker intents allowing users to grant legitimate access to specific directories (e.g. Documents, WhatsApp Voice Notes, Downloads).</p>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; padding: 18px;">
            <strong style="color: var(--cyan); display: block; margin-bottom: 6px;">🔑 Persisted URI Permissions</strong>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0;">Leverages <code>takePersistableUriPermission</code> so the user only grants access once; Joya maintains permanent read/write access across app restarts and device reboots.</p>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; padding: 18px;">
            <strong style="color: var(--cyan); display: block; margin-bottom: 6px;">🎵 MediaStore API Integration</strong>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0;">Integrates modern <code>MediaStore.Audio</code> and <code>MediaStore.Downloads</code> collections for audio recording exports and voice memos without broad disk access.</p>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; padding: 18px;">
            <strong style="color: var(--cyan); display: block; margin-bottom: 6px;">✅ 100% Google Play Compliant</strong>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0;">Zero dangerous root exploits or MANAGE_EXTERNAL_STORAGE rejection risks. Safe and ready for immediate Google Play Store publishing.</p>
          </div>
        </div>
      </div>

      <!-- FAQ Section (Requirement 18) -->
      <div class="glass-card" style="padding: 30px; border-radius: 20px; margin-bottom: 40px;">
        <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 20px;">Frequently Asked Questions — Joya AI</h3>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: How does Joya AI handle file storage permissions on Android 11 to 14?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Joya AI utilizes Android's official Storage Access Framework (SAF) and MediaStore APIs. Once the user approves a directory via the native Android folder picker, the app invokes <code>takePersistableUriPermission</code> so permission persists seamlessly without repeated prompts.</p>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: Do I get the complete source code?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Yes! Immediately after your payment is verified, you receive download access to the complete Android Studio Kotlin project zip archive (all code, layouts, and build files).</p>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: Can I change the wake word to something else?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Yes. The project includes modular acoustic model binding so you can retrain or swap the wake word model to any custom name of your choice.</p>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: What are the minimum requirements to build?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Android Studio Hedgehog or higher, Android SDK 26+, and Kotlin 1.9+. Compiles cleanly with zero missing dependencies.</p>
          </div>
        </div>
      </div>

      <!-- Version Changelog -->
      <div class="glass-card" style="padding: 30px; border-radius: 20px;">
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 18px;">Changelog &amp; Release History</h3>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${(joya.changelog || [
            { version: 'v2.4.0', date: '2026-08-15', notes: 'Enhanced offline wake-word acoustic model; battery drain reduced by 35%.' },
            { version: 'v2.3.0', date: '2026-06-20', notes: 'Added direct WhatsApp message dictation and quick call triggers.' }
          ]).map(c => `
            <div style="border-left: 2px solid var(--cyan); padding-left: 14px;">
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 4px;">
                <strong style="color: var(--cyan); font-family: var(--font-mono);">${c.version}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${c.date}</span>
              </div>
              <p style="color: var(--text-secondary); font-size: 0.88rem; margin: 0;">${c.notes}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'joya.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'joya.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/joya.html and frontend/joya.html');
}

// ==========================================
// 6. JARVIS AI DEDICATED FLAGSHIP PAGE
// ==========================================
function buildJarvisPage() {
  const jarvis = DEVCRAFT_PRODUCTS.find(p => p.id === 'jarvis-ai') || {};

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('Jarvis AI — Full Source Code & Desktop Automation Agent', 'Jarvis AI is an autonomous desktop computing assistant for PC with terminal command execution, active workspace file indexing, web scraping, and local LLM bridge. Full source code included.')}
</head>
<body>
  ${navbar('jarvis')}

  <main style="padding: 120px 0 80px;">
    <div class="container">
      <!-- Hero Section -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: center; margin-bottom: 60px;">
        <div>
          <div class="flagship-hero-badge" style="background: rgba(59, 130, 246, 0.15); color: #93c5fd; border-color: rgba(59, 130, 246, 0.4);">
            💻 PC Desktop Intelligence • Full Source Code Included • 50% OFF
          </div>
          <h1 style="font-size: 2.8rem; font-weight: 800; line-height: 1.2; margin-bottom: 16px;">
            Jarvis AI — <span class="text-gradient">Full Source Code</span>
          </h1>
          <p style="color: var(--text-secondary); font-size: 1.1rem; line-height: 1.7; margin-bottom: 24px;">
            Take commanding control of your PC workflow. Activated via global hotkey <span class="wake-word-highlight">Ctrl + Space</span>, Jarvis indexes your hard drive, writes and tests shell scripts, automates browser data scraping, and bridges local LLMs (Ollama) into your editor.
          </p>

          <!-- Interactive Terminal Sandbox Mockup -->
          <div class="terminal-mockup" style="margin-bottom: 28px;">
            <div class="terminal-mockup-header">
              <span class="term-dot red"></span>
              <span class="term-dot yellow"></span>
              <span class="term-dot green"></span>
              <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 6px;">jarvis-core — desktop agent terminal</span>
            </div>
            <div class="terminal-mockup-body" id="jarvis-terminal-output" style="max-height: 180px; overflow-y: auto;">
              <div class="cmd-line">[Ready] Jarvis PC Agent v3.1.2 online...</div>
              <div class="out-line">Global Hotkey Ctrl+Space registered. Listening on local IPC bridge.</div>
            </div>
            <div style="padding: 8px 14px; background: #0b1120; border-top: 1px solid rgba(255, 255, 255, 0.06); display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('index')">Index Files</button>
              <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('scrape')">Web Scraper</button>
              <button type="button" class="btn btn-xs btn-ghost" onclick="devcraftShop.simulateJarvisCommand('diag')">Diagnostics</button>
            </div>
          </div>

          <!-- Pricing & Direct CTAs -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 16px; padding: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Special Promotional Discount:</div>
              <div style="display: flex; align-items: baseline; gap: 10px;">
                <del style="color: var(--text-muted); font-size: 1.1rem;">₹3,199</del>
                <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 800; padding: 2px 8px; border-radius: 6px; font-size: 0.85rem;">50% OFF</span>
                <span class="text-gradient" style="font-size: 2rem; font-weight: 800;">₹1,599</span>
              </div>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <a href="https://api.whatsapp.com/send?phone=918630976928&text=Hello%20DevCraft%20%F0%9F%91%8B%20I%20want%20to%20buy%20Jarvis%20AI%20PC%20Assistant%20(%E2%82%B91,599)%20Full%20Source%20Code." target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-lg" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 800; padding: 14px 28px; text-decoration: none;">
                💬 Buy Full Source Code on WhatsApp (₹1,599) ⚡
              </a>
            </div>
          </div>
        </div>

        <!-- Right Side: Specs & Features -->
        <div class="glass-card" style="padding: 24px; border-radius: 20px; border: 1px solid rgba(59, 130, 246, 0.3);">
          <div style="width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 20px; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4); background: #080d1a;">
            <img src="/assets/images/jarvis-ai-animated.svg" alt="Jarvis AI PC Assistant Animated Core" style="width: 100%; height: auto; display: block;" />
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 20px; color: #ffffff;">Desktop Environment Specifications</h3>
          
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Delivered Package:</span>
              <strong style="color: var(--cyan);">Full Source Code (.ZIP) + PC Installer</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Source Package:</span>
              <strong style="font-family: var(--font-mono); color: var(--cyan);">jarvis-ai-source-code-v3.1.2.zip</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Operating Systems:</span>
              <strong>Windows 10/11 64-bit, macOS 12+, Ubuntu</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">Local LLM Integration:</span>
              <strong style="color: #10b981;">Ollama (Llama-3, Mistral, Phi-3, DeepSeek)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">PC Installer Artifact:</span>
              <strong style="font-family: var(--font-mono); color: var(--cyan);">jarvis-ai-desktop-v3.1.2.exe</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
              <span style="color: var(--text-secondary);">License &amp; Ownership:</span>
              <strong style="color: #10b981;">100% Commercial Source Code Handover</strong>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 10px;">Core Engineering Stack:</h4>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${(jarvis.technologies || ['Electron', 'Node.js', 'Python', 'Ollama', 'PyAutoGUI', 'SQLite']).map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Features Deep Dive -->
      <div style="margin-bottom: 60px;">
        <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 24px; text-align: center;">What You Receive with <span class="text-gradient">Jarvis AI Source Code</span></h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">💻</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Complete Electron &amp; Node.js Project</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Production Electron desktop architecture with translucent glass HUD, system tray integration, and native IPC bridges.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🧠</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Local Ollama &amp; Cloud LLM Core</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Zero-cloud-cost inference pipeline connecting to local LLMs via Ollama, plus extensible hooks for OpenAI, Claude, and Gemini.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">⚙️</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Python Automation &amp; Terminal Runner</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Autonomous terminal execution scripts, desktop PyAutoGUI clickers, web scrapers, and filesystem search indexers.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">📖</div>
            <h4 style="font-weight: 700; margin-bottom: 8px;">Developer Documentation &amp; Setup</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">Step-by-step developer guide to package .exe for Windows, .dmg for macOS, and configure custom system triggers.</p>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="glass-card" style="padding: 30px; border-radius: 20px; margin-bottom: 40px;">
        <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 20px;">Frequently Asked Questions — Jarvis AI</h3>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: Do I get the complete Jarvis AI source code?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Yes! Upon payment confirmation, you receive immediate download access to the complete source package zip (Electron frontend, Python automation engines, and package build configurations).</p>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: Does it require paid third-party API subscriptions?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">No. Jarvis is built with a local LLM bridge to Ollama (Llama 3, Mistral, DeepSeek), allowing 100% private, offline execution without monthly subscription costs.</p>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">Q: Can I build installers for Windows and macOS?</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">Yes. The project includes cross-platform electron-builder scripts configured to produce Windows .exe installers and macOS .dmg packages.</p>
          </div>
        </div>
      </div>

      <!-- Version Changelog -->
      <div class="glass-card" style="padding: 30px; border-radius: 20px;">
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 18px;">Changelog &amp; Release History</h3>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${(jarvis.changelog || [
            { version: 'v3.1.2', date: '2026-08-20', notes: 'Direct Ollama local model bridge; native Windows 11 Fluent dark glass UI.' },
            { version: 'v3.0.0', date: '2026-05-12', notes: 'Architectural overhaul: Multi-threaded voice agent and desktop vision preview.' }
          ]).map(c => `
            <div style="border-left: 2px solid var(--cyan); padding-left: 14px;">
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 4px;">
                <strong style="color: var(--cyan); font-family: var(--font-mono);">${c.version}</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${c.date}</span>
              </div>
              <p style="color: var(--text-secondary); font-size: 0.88rem; margin: 0;">${c.notes}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'jarvis.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'jarvis.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/jarvis.html and frontend/jarvis.html');
}

// ==========================================
// 7. APTITUDE DEDICATED PAGE (30% DISCOUNT)
// ==========================================
function buildAptitudePage() {
  const aptitudeProducts = DEVCRAFT_PRODUCTS.filter(p => p.type === 'aptitude' || p.category === 'Aptitude');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('Campus Placement & Aptitude Hub (30% OFF)', 'Crack technical interviews, quantitative aptitude, and logical puzzle rounds for TCS NQT, Infosys, Wipro, and Amazon with structured courses.')}
</head>
<body>
  ${navbar('aptitude')}

  <main style="padding: 120px 0 80px;">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.4);">
          🎓 All Aptitude Courses • Flat 30% OFF
        </div>
        <h1 class="section-title">Campus Placement &amp; <span class="text-gradient">Aptitude Hub</span></h1>
        <p class="section-desc">
          Engineered specifically for engineering graduates and software developers. Master cognitive aptitude, quantitative problem solving, and logical coding puzzles.
        </p>

        <div style="margin-top: 16px;">
          <button class="btn btn-outline" onclick="devcraftShop.downloadProduct('aptitude-syllabus')">
            Download Comprehensive Syllabus (PDF) 📄
          </button>
        </div>
      </div>

      <!-- Courses Grid with 30% Discount -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin-top: 40px;">
        ${aptitudeProducts.map(p => {
          const originalPrice = Number(p.originalPrice) || 5000;
          const finalPrice = Math.round(originalPrice * 0.70);

          return `
          <div class="product-shop-card" style="border-color: rgba(16, 185, 129, 0.3);">
            <div class="product-card-top">
              <span class="product-category-chip" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">${p.category}</span>
              <span class="product-discount-chip chip-aptitude">30% OFF</span>
            </div>

            <div class="product-card-info">
              <h3 class="product-card-title">${p.name}</h3>
              <p class="product-card-desc">${p.shortDesc}</p>

              <ul class="product-card-features">
                ${(p.features || []).map(f => `<li><span class="check-icon" style="color: #10b981;">✓</span> ${f}</li>`).join('')}
              </ul>
            </div>

            <div class="product-card-pricing-footer">
              <div class="product-price-block">
                <div class="product-price-orig">
                  <span>Original:</span>
                  <del>₹${originalPrice.toLocaleString('en-IN')}</del>
                </div>
                <div class="product-price-final">
                  <span class="price-val" style="color: #34d399;">₹${finalPrice.toLocaleString('en-IN')}</span>
                  <span class="price-save-badge">Save 30%</span>
                </div>
              </div>

              <div class="product-card-btn-grid" style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <a href="https://api.whatsapp.com/send?phone=918630976928&text=${encodeURIComponent('Hello DevCraft 👋 I want to enroll in ' + p.name + ' (₹' + finalPrice.toLocaleString('en-IN') + ')')}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm" style="justify-content: center; font-weight: 700; text-decoration: none;">
                  💬 Enroll on WhatsApp (₹${finalPrice.toLocaleString('en-IN')})
                </a>
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'aptitude.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'aptitude.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/aptitude.html and frontend/aptitude.html');
}

// ==========================================
// 8. PORTFOLIO & INTERACTIVE SIMULATORS PAGE
// ==========================================
function buildPortfolioPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('Interactive Portfolio & Live Simulators', 'Explore 10+ interactive application demos engineered by DevCraft across Mobile, Web, AI, and Dashboards.')}
</head>
<body>
  ${navbar('portfolio')}

  <main style="padding-top: 100px;">
    ${renderFeaturedDemosSection()}
    ${renderDemoLabSection()}
    ${renderCaseStudiesSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'portfolio.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'portfolio.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/portfolio.html and frontend/portfolio.html');
}

// ==========================================
// 9. CART & CHECKOUT PAGE
// ==========================================
function buildCartPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('Shopping Cart & Secure Checkout', 'Review your selected DevCraft products and services, apply cryptographic coupons, and complete your order.')}
</head>
<body>
  ${navbar()}

  <main class="cart-page-wrap">
    <div class="container">
      <div class="section-header" style="margin-bottom: 30px;">
        <h1 style="font-size: 2.2rem; font-weight: 800;">Shopping Cart &amp; <span class="text-gradient">Checkout</span></h1>
        <p style="color: var(--text-secondary);">Verify items, apply valid private coupons, and confirm your direct booking.</p>
      </div>

      <div class="cart-grid-layout">
        <!-- Cart Items List Container -->
        <div class="cart-items-panel" id="cart-items-container">
          <div style="text-align: center; padding: 40px; color: var(--text-muted);">
            Loading cart contents...
          </div>
        </div>

        <!-- Order Summary & Checkout Panel -->
        <div class="cart-summary-panel" id="cart-summary-box">
          <!-- Rendered dynamically by devcraftShop.renderCartPage() -->
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      devcraftShop.renderCartPage();
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'cart.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'cart.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/cart.html and frontend/cart.html');
}

// ==========================================
// 10. LEGAL & POLICY PAGES (PRIVACY, TERMS, REFUND, LICENSE)
// ==========================================
function buildLegalPages() {
  const legalPages = [
    {
      file: 'privacy.html',
      title: 'Privacy Policy',
      content: `
        <h2>Privacy Policy</h2>
        <p><strong>Last Updated: August 2026</strong></p>
        <p>At DevCraft Studio, accessible from harsh-developer.onrender.com, privacy and cryptographic security are paramount. This policy outlines how user credentials, order histories, and telemetry are processed.</p>
        <h3>1. Authentication &amp; Password Security</h3>
        <p>Passwords are never stored in plaintext. They are salted and hashed using standard bcrypt algorithms. User tokens use signed HMAC-SHA256 JWTs.</p>
        <h3>2. Coupon Code Verification</h3>
        <p>Promotional coupon codes are verified strictly server-side using secure SHA-256 HMAC digest validation. Codes are never stored or exposed in client bundles.</p>
        <h3>3. Data Telemetry &amp; Offline AI</h3>
        <p>Our flagship AI software (Joya AI and Jarvis AI) utilizes on-device neural inferencing. Voice acoustic processing and local desktop commands remain 100% on your machine.</p>
      `
    },
    {
      file: 'terms.html',
      title: 'Terms of Service',
      content: `
        <h2>Terms of Service</h2>
        <p><strong>Last Updated: August 2026</strong></p>
        <p>Welcome to DevCraft Studio. By purchasing our software products, downloading packages, or contracting our development services, you agree to these terms.</p>
        <h3>1. Development Sprints &amp; Deliverables</h3>
        <p>All custom client work is executed under agreed milestones. 100% intellectual property ownership of bespoke source code is transferred upon final sprint settlement.</p>
        <h3>2. Software Distribution</h3>
        <p>Purchased binaries (APKs, EXEs, and ZIP packages) include a personal or enterprise non-transferable license as specified during checkout.</p>
      `
    },
    {
      file: 'refund.html',
      title: 'Refund & Cancellation Policy',
      content: `
        <h2>Refund &amp; Cancellation Policy</h2>
        <p><strong>Last Updated: August 2026</strong></p>
        <h3>1. Custom Engineering Sprints</h3>
        <p>Milestone payments for custom development are protected. In the unlikely event that sprint criteria cannot be met, unworked milestone funds will be refunded within 7 business days.</p>
        <h3>2. Digital Software Downloads &amp; Courses</h3>
        <p>Because software downloads (APKs, EXEs) provide immediate access, refunds are evaluated on technical grounds within 7 days if the software does not function according to documented specifications.</p>
      `
    },
    {
      file: 'license.html',
      title: 'Software Licensing & IP Ownership',
      content: `
        <h2>Software Licensing &amp; IP Ownership</h2>
        <p><strong>Last Updated: August 2026</strong></p>
        <p>DevCraft Studio grants clients full commercial ownership of bespoke custom code developed under contract. Our commercial off-the-shelf software packages are licensed under perpetual commercial licenses.</p>
      `
    }
  ];

  legalPages.forEach(p => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead(p.title, 'Official policy and legal documentation for DevCraft Studio.')}
</head>
<body>
  ${navbar()}

  <main style="padding: 120px 0 80px;">
    <div class="container" style="max-width: 800px;">
      <div class="glass-card" style="padding: 40px; border-radius: 20px; line-height: 1.8;">
        ${p.content}
        <div style="margin-top: 30px; border-top: 1px solid var(--border-glass); padding-top: 18px;">
          <a href="/" class="btn btn-outline btn-sm">← Back to DevCraft Home</a>
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

    fs.writeFileSync(path.join(PAGES, p.file), html, 'utf8');
    fs.writeFileSync(path.join(FRONTEND, p.file), html, 'utf8');
    console.log(`✓ Generated ${p.file}`);
  });
}

function buildFaqPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('Frequently Asked Questions (FAQ) & Knowledge Base', 'Comprehensive questions and answers regarding DevCraft software development sprints, source code ownership, Joya & Jarvis AI, Tranz UPI payments, and referral commissions.', '/faq')}
</head>
<body>
  ${navbar('faq')}

  <main style="padding-top: 100px;">
    ${renderFaqSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, 'faq.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, 'faq.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/faq.html & frontend/faq.html');
}

function build404Page() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead('404 - Page Not Found', 'The requested page or resource could not be found on DevCraft Studio.', '/404')}
</head>
<body>
  ${navbar('')}

  <main style="padding: 140px 0 100px; min-height: 80vh; display: flex; align-items: center;">
    <div class="container" style="max-width: 720px; text-align: center;">
      <div class="glass-card" style="padding: 50px 30px; border-radius: 24px; border: 1px solid var(--border-glass);">
        <div style="font-family: var(--font-mono); font-size: 5rem; font-weight: 900; line-height: 1; color: var(--accent); margin-bottom: 16px;">
          404
        </div>
        <div style="display: inline-block; padding: 4px 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 9999px; color: #1d4ed8; font-weight: 700; font-size: 0.82rem; margin-bottom: 16px;">
          PAGE NOT FOUND
        </div>
        <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 14px; color: var(--text-primary);">
          Lost in Cyberspace?
        </h1>
        <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; margin-bottom: 30px; max-width: 540px; margin-left: auto; margin-right: auto;">
          The route you navigated to does not exist or has been relocated. Explore our production software products, development services, or return to home.
        </p>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px;">
          <a href="/" class="btn btn-primary" style="padding: 12px 24px;">
            ← Return to Home
          </a>
          <a href="/products" class="btn btn-emerald" style="padding: 12px 24px;">
            Software Products (50% OFF) ⚡
          </a>
          <a href="/services" class="btn btn-outline" style="padding: 12px 24px;">
            View Services
          </a>
          <a href="/contact" class="btn btn-outline" style="padding: 12px 24px;">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

  fs.writeFileSync(path.join(PAGES, '404.html'), html, 'utf8');
  fs.writeFileSync(path.join(FRONTEND, '404.html'), html, 'utf8');
  console.log('✓ Generated frontend/pages/404.html & frontend/404.html');
}

function buildServiceSubPages() {
  const SERVICES_PAGES = path.join(PAGES, 'services');
  if (!fs.existsSync(SERVICES_PAGES)) fs.mkdirSync(SERVICES_PAGES, { recursive: true });

  const subServices = [
    {
      slug: 'android-development',
      name: 'Android App Development',
      category: 'Mobile Engineering',
      badge: 'Native Android Kotlin',
      headline: 'Native Android Apps Built with Kotlin & Jetpack Compose',
      subtitle: 'From conceptual wireframes to Google Play Store launch. We engineer reactive, high-performance native Android apps with sub-100ms startup times, offline-first Room caching, and seamless UPI payments.',
      heroStat1: '100% Native Kotlin',
      heroStat2: 'API 26-34 Ready',
      heroStat3: '60 FPS Smooth UI',
      heroStat4: '100% Code Handover',
      capabilities: [
        { title: 'Jetpack Compose UI', desc: 'Modern declarative UI components with Material Design 3, fluid animations, and dark/light themes.' },
        { title: 'Offline-First Room DB', desc: 'Robust local data persistence, SQLite synchronization, and offline mutation queues.' },
        { title: 'Payment & UPI Integration', desc: 'In-app purchases, Google Play Billing, and dynamic NPCI UPI QR code generation.' },
        { title: 'Firebase Cloud Messaging', desc: 'Real-time targeted push notifications, deep links, analytics, and crash reporting.' },
        { title: 'Hardware Sensors & GPS', desc: 'Precision geolocation, background tracking, Bluetooth BLE, camera, and biometric authentication.' },
        { title: 'Play Store Publishing', desc: 'Complete APK/AAB signing, Google Play Store compliance, review assistance, and CI/CD.' }
      ],
      techStack: ['Kotlin', 'Android Studio', 'Jetpack Compose', 'Room DB', 'Retrofit', 'Coroutines', 'Flow', 'Hilt', 'Firebase'],
      pricing: 'Starting at ₹3,999'
    },
    {
      slug: 'web-development',
      name: 'Website & Web App Development',
      category: 'Full-Stack Web',
      badge: 'Next.js & React',
      headline: 'Ultra-Fast, High-Converting Websites & Web Applications',
      subtitle: 'Bespoke corporate websites, SaaS landing portals, and responsive web applications engineered for 100/100 Core Web Vitals, organic search dominance, and conversion architectures.',
      heroStat1: '99+ Lighthouse Score',
      heroStat2: '<50ms Response',
      heroStat3: '100% Responsive',
      heroStat4: 'Zero Vendor Lock-in',
      capabilities: [
        { title: 'Server-Side Rendering (SSR)', desc: 'Next.js dynamic rendering and edge routing for instant page loads and premier SEO indexing.' },
        { title: 'Design System & Tailwind', desc: 'Modular, accessible design components built with Tailwind CSS and clean typography.' },
        { title: 'E-Commerce & Dynamic UPI', desc: 'High-speed headless commerce cart, express checkout, and instant payment verification.' },
        { title: 'Headless CMS Integration', desc: 'Easy content management with Strapi, Sanity, or custom markdown database backends.' },
        { title: 'Edge CDN & SSL Shielding', desc: 'Cloudflare enterprise caching, automated DDoS protection, and SSL certificates.' },
        { title: 'Automated Lead Funnels', desc: 'High-converting lead capture forms with instant WhatsApp and email notifications.' }
      ],
      techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Cloudflare'],
      pricing: 'Starting at ₹2,499'
    },
    {
      slug: 'software-development',
      name: 'Custom Software Development',
      category: 'Custom Engineering',
      badge: 'Enterprise & Desktop',
      headline: 'Enterprise-Grade Custom Software Built for Your Exact Workflow',
      subtitle: 'Replace fragmented SaaS tools and fragile spreadsheets with unified, proprietary software systems. Full intellectual property ownership, zero recurring user licenses.',
      heroStat1: '100% IP Ownership',
      heroStat2: 'Zero Seat Licenses',
      heroStat3: 'Cross-Platform',
      heroStat4: 'Bespoke Architecture',
      capabilities: [
        { title: 'Multi-Tenant Client Portals', desc: 'Secure web portals with role-based access control (RBAC), audit logging, and isolated client data.' },
        { title: 'Desktop Software (Electron)', desc: 'Cross-platform desktop executables for Windows, macOS, and Linux with local file access.' },
        { title: 'Custom Relational DBs', desc: 'PostgreSQL database modeling, migrations, ACID transaction safety, and indexing.' },
        { title: 'Background Task Workers', desc: 'Asynchronous task processing, scheduled reporting jobs, and automated PDF invoice engines.' },
        { title: 'Biometric & Local Security', desc: 'Encrypted token storage, zero-knowledge credentials, and tamper-resistant licensing.' },
        { title: 'Git & Complete Docs', desc: 'Clean, modular codebase handed over with full developer architecture documentation.' }
      ],
      techStack: ['Node.js', 'Electron', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'TypeScript'],
      pricing: 'Starting at ₹4,999'
    },
    {
      slug: 'ai-solutions',
      name: 'AI Solutions & Agent Development',
      category: 'Artificial Intelligence',
      badge: 'Autonomous AI & LLMs',
      headline: 'Autonomous AI Agents, Custom LLM Bridges & Neural Assistants',
      subtitle: 'Harness the power of cutting-edge generative AI and lightweight on-device models. We develop autonomous agent workflows, RAG vector pipelines, and voice assistants like Joya AI and Jarvis AI.',
      heroStat1: 'On-Device Inference',
      heroStat2: 'Zero Cloud Leakage',
      heroStat3: 'Multi-Model Fallback',
      heroStat4: 'Voice & Automation',
      capabilities: [
        { title: 'Local Offline LLM Bridges', desc: 'Ollama local model integration (Llama 3, Mistral, DeepSeek) for zero-cost, private inference.' },
        { title: 'Acoustic Wake Word Systems', desc: 'Lightweight on-device wake-word detection (e.g. "Wake up Joya") and neural voice processing.' },
        { title: 'Retrieval-Augmented Generation', desc: 'Vector database search over internal business manuals, FAQs, and product catalogs.' },
        { title: 'Multi-Agent Tool Orchestration', desc: 'Collaborative autonomous agents that read databases, call APIs, and execute desktop actions.' },
        { title: 'Desktop & Mobile Voice HUDs', desc: 'Always-listening background voice companions with hotkey toggles and floating UI.' },
        { title: 'Full Source Code Licensing', desc: 'Deploy proprietary AI pipelines with 100% source ownership and zero recurring token markup.' }
      ],
      techStack: ['Python', 'Ollama', 'LangChain', 'PyTorch', 'OpenAI API', 'TensorFlow Lite', 'Porcupine', 'Node.js'],
      pricing: 'Starting at ₹3,499'
    },
    {
      slug: 'automation',
      name: 'Workflow Automation',
      category: 'Business Automation',
      badge: 'Zero-Touch Workflows',
      headline: 'Eliminate Repetitive Tasks with Bulletproof Business Automation',
      subtitle: 'Connect fragmented software, automate customer messaging, and orchestrate complex multi-step data pipelines. We build webhook listeners, WhatsApp bots, and background task queues that run 24/7.',
      heroStat1: '24/7 Zero-Touch',
      heroStat2: '100% Reliable Queues',
      heroStat3: 'Multi-Channel Bots',
      heroStat4: 'Automated Alerts',
      capabilities: [
        { title: 'WhatsApp Business Cloud API', desc: 'Automated instant notifications, order alerts, transactional receipts, and interactive menu bots.' },
        { title: 'Distributed Job Queues', desc: 'High-throughput BullMQ and Redis queues with automatic retry exponential backoff policies.' },
        { title: 'Webhook Data Pipelines', desc: 'Real-time event receivers reconciling payment gateways, CRM contacts, and ERP inventories.' },
        { title: 'Headless Web Scraping', desc: 'Puppeteer and Playwright scrapers extracting dynamic web data and competitive intelligence.' },
        { title: 'Spreadsheet & Google Sheets Sync', desc: 'Automatic bidirectional data synchronization with Excel, Google Sheets, and Airtable.' },
        { title: 'Incident & Failure Alerts', desc: 'Immediate alerting via Telegram, WhatsApp, and Slack when critical pipeline thresholds breach.' }
      ],
      techStack: ['Node.js', 'BullMQ', 'Redis', 'Puppeteer', 'WhatsApp Cloud API', 'Docker', 'Webhooks'],
      pricing: 'Starting at ₹1,999'
    },
    {
      slug: 'api-integration',
      name: 'API Integration & Microservices',
      category: 'Backend & APIs',
      badge: 'High Throughput Microservices',
      headline: 'High-Performance REST & GraphQL APIs with Sub-50ms Latency',
      subtitle: 'Connect third-party payment gateways, CRM databases, logistics partners, and external SaaS platforms. We build bulletproof endpoints protected by cryptographic signatures, rate limiting, and Redis caching.',
      heroStat1: '<50ms Response Latency',
      heroStat2: 'HMAC-SHA256 Security',
      heroStat3: 'Swagger / OpenAPI Ready',
      heroStat4: 'Zero Downtime',
      capabilities: [
        { title: 'Payment Gateway Integration', desc: 'NPCI UPI dynamic QR, Razorpay, Cashfree, and Stripe integrations with webhook reconciliation.' },
        { title: 'Redis Cache Acceleration', desc: 'Sub-50ms query caching, token bucket rate limiting, and distributed session storage.' },
        { title: 'Cryptographic Verification', desc: 'HMAC-SHA256 request signatures, JWT authentication, and AES-256 payload encryption.' },
        { title: 'Interactive API Documentation', desc: 'Full Swagger/OpenAPI interactive specifications with mock request generators.' },
        { title: 'Bi-Directional WebSockets', desc: 'Sub-second real-time event streaming for chat, live bidding, and telemetry monitors.' },
        { title: 'Microservice Containerization', desc: 'Dockerized microservice deployments with health check probes and automated restart policies.' }
      ],
      techStack: ['Express', 'Node.js', 'Redis', 'PostgreSQL', 'GraphQL', 'JWT', 'HMAC-SHA256', 'OpenAPI/Swagger'],
      pricing: 'Starting at ₹1,499'
    },
    {
      slug: 'ui-ux',
      name: 'UI/UX Design & Frontend Engineering',
      category: 'Design & Frontend',
      badge: 'Design Systems & Modern UI',
      headline: 'Intuitive, Accessible & High-Conversion Digital Interfaces',
      subtitle: 'Transform complex software products into delightful, intuitive user journeys. We engineer cohesive design systems in Figma, build production-grade HTML/CSS components, and create cinematic micro-interactions.',
      heroStat1: 'WCAG 2.1 AA Compliant',
      heroStat2: '30+ Devices Tested',
      heroStat3: 'Figma Design System',
      heroStat4: 'Production Code Ready',
      capabilities: [
        { title: 'Figma Design Systems', desc: 'Comprehensive Figma component libraries, typography hierarchies, and reusable design tokens.' },
        { title: 'Responsive Multi-Device Layouts', desc: 'Pixel-perfect interfaces verified across smartphones, tablets, laptops, and ultra-wide displays.' },
        { title: 'Micro-Interactions & Transitions', desc: 'High-speed CSS animations, buttery hover states, and smooth modal transitions.' },
        { title: 'Accessibility & Reduced Motion', desc: 'WCAG 2.1 AA compliant color contrast, keyboard navigation, and prefers-reduced-motion support.' },
        { title: 'Interactive Prototypes', desc: 'Clickable client prototypes allowing stakeholder alignment prior to writing production code.' },
        { title: 'Zero-Bloat Frontend Code', desc: 'Clean, semantic HTML5, CSS3, and Vanilla JS with zero unnecessary bundle bloat.' }
      ],
      techStack: ['Figma', 'CSS Grid/Flexbox', 'Tailwind CSS', 'Three.js', 'SVG Animation', 'Design Tokens'],
      pricing: 'Starting at ₹1,999'
    },
    {
      slug: 'maintenance',
      name: 'Maintenance & Project Improvements',
      category: 'Support & DevOps',
      badge: '24/7 Reliability & SLA',
      headline: '24/7 Software Maintenance, Bug Fixing & Production Upgrades',
      subtitle: 'Keep your live applications fast, secure, and bug-free. We provide emergency bug fixing, security patching, cloud database optimization, memory leak debugging, and 24/7 uptime monitoring.',
      heroStat1: '24/7 Server Monitoring',
      heroStat2: '<15m Urgent Response',
      heroStat3: 'Weekly Security Patches',
      heroStat4: 'Direct WhatsApp Line',
      capabilities: [
        { title: '24/7 Automated Uptime Pings', desc: 'Continuous health check pings preventing server sleep and notifying architects on anomalies.' },
        { title: 'Security Vulnerability Patching', desc: 'Continuous auditing of npm and pip dependencies with prompt patching of discovered CVEs.' },
        { title: 'Database Optimization & Indexing', desc: 'Query profiling, index creation, table vacuuming, and memory caching to eliminate lag.' },
        { title: 'Code Refactoring & Debt Payoff', desc: 'Cleaning legacy antipatterns, upgrading deprecated frameworks, and adding test suites.' },
        { title: 'Zero-Downtime Deployments', desc: 'Seamless rolling releases, container restarts, automated daily database backups, and rollback safeguards.' },
        { title: 'Direct Engineer Standby', desc: 'Direct WhatsApp and phone access to our lead software architect for mission-critical emergencies.' }
      ],
      techStack: ['Docker', 'GitHub Actions', 'PM2', 'New Relic', 'Linux Servers', 'Sentry', 'Redis', 'Nginx'],
      pricing: 'Starting at ₹999'
    }
  ];

  subServices.forEach(srv => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${commonHead(`${srv.name} Services`, srv.subtitle, `/services/${srv.slug}`)}
</head>
<body>
  ${navbar('services')}

  <main style="padding-top: 100px;">
    <!-- Service Subpage Hero -->
    <section class="section" style="padding-bottom: 40px;">
      <div class="container">
        <nav style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; margin-bottom: 24px;">
          <a href="/" style="color: var(--text-muted); text-decoration: none;">Home</a>
          <span style="color: var(--card-border);">/</span>
          <a href="/services" style="color: var(--text-muted); text-decoration: none;">Services</a>
          <span style="color: var(--card-border);">/</span>
          <span style="color: var(--accent); font-weight: 600;">${srv.name}</span>
        </nav>

        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 9999px; color: #1d4ed8; font-weight: 700; font-size: 0.85rem; margin-bottom: 16px;">
          <span>⚡ ${srv.category}</span> • <span>${srv.badge}</span>
        </div>

        <h1 style="font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; line-height: 1.15; color: var(--text-primary); margin-bottom: 20px;">
          ${srv.headline}
        </h1>

        <p style="font-size: 1.15rem; line-height: 1.7; color: var(--text-secondary); max-width: 820px; margin-bottom: 32px;">
          ${srv.subtitle}
        </p>

        <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin-bottom: 40px;">
          <a href="https://api.whatsapp.com/send?phone=918630976928&text=${encodeURIComponent('Hello DevCraft 👋 I want to book ' + srv.name + ' (' + srv.pricing + ')')}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald" style="padding: 12px 28px;">
            Book on WhatsApp (${srv.pricing}) ⚡
          </a>
          <a href="/contact?service=${srv.slug}" class="btn btn-primary" style="padding: 12px 28px;">
            Request Custom Scope →
          </a>
          <a href="/products" class="btn btn-outline" style="padding: 12px 24px;">
            Explore Software Products (50% OFF) ⚡
          </a>
          <a href="/services" class="btn btn-ghost" style="padding: 12px 24px;">
            All Services Catalog
          </a>
        </div>

        <!-- Trust Stats Strip -->
        <div class="hero-stats-strip" style="background: var(--bg-card); border: 1px solid var(--card-border); border-radius: 16px; padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px;">
          <div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent);">${srv.heroStat1}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">Architectural Baseline</div>
          </div>
          <div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--emerald);">${srv.heroStat2}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">Engineered Capability</div>
          </div>
          <div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--cyan);">${srv.heroStat3}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">Performance Target</div>
          </div>
          <div>
            <div style="font-size: 1.3rem; font-weight: 800; color: #f59e0b;">${srv.heroStat4}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">IP Transfer &amp; Rights</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Capabilities Grid -->
    <section class="section" style="padding-top: 20px; padding-bottom: 40px;">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">Core Architecture</div>
          <h2 class="section-title">What We Build &amp; <span class="text-gradient">Deliver</span></h2>
          <p class="section-desc">Production-grade engineering standards applied to every layer of your ${srv.name.toLowerCase()} sprint.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          ${srv.capabilities.map((c, i) => `
            <div class="glass-card" style="padding: 28px; border-radius: 18px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: #eff6ff; border: 1px solid #bfdbfe; color: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; margin-bottom: 16px;">
                0${i + 1}
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
                ${c.title}
              </h3>
              <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
                ${c.desc}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Technologies Strip -->
    <section class="section" style="padding-top: 20px; padding-bottom: 40px; background: #f1f5f9;">
      <div class="container">
        <div style="text-align: center; margin-bottom: 24px;">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            Battle-Tested Tech Stack
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Modern tooling selected for speed, security, and developer ergonomics.</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
          ${srv.techStack.map(t => `
            <span style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; background: #ffffff; border: 1px solid var(--card-border); border-radius: 9999px; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <span style="color: var(--accent);">⚡</span> ${t}
            </span>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 5-Step Sprint Process -->
    <section class="section" style="padding-top: 40px; padding-bottom: 40px;">
      <div class="container">
        <div class="section-header text-center">
          <div class="section-badge">Sprint Methodology</div>
          <h2 class="section-title">How We Ship Your <span class="text-gradient">Project</span></h2>
          <p class="section-desc">From initial requirement analysis to live production launch with zero ambiguity.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--accent); margin-bottom: 6px;">STEP 01</div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Scoping &amp; Architecture</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Technical specification, milestones breakdown, and NDA execution.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--accent); margin-bottom: 6px;">STEP 02</div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Wireframes &amp; Design</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Component system, responsive UI layouts, and prototype validation.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--accent); margin-bottom: 6px;">STEP 03</div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Bi-Weekly Sprints</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Rapid full-stack coding with live staging deployments at every milestone.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--accent); margin-bottom: 6px;">STEP 04</div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Automated QA &amp; Audit</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Security hardening, load stress tests, and cross-device testing.</p>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 16px; border-color: #86efac;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--emerald); margin-bottom: 6px;">STEP 05</div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Launch &amp; 100% IP Handover</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Production cutover, DNS routing, and complete Git repo transfer.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing & Inquiries -->
    ${renderPricingSection()}
    ${renderContactSection()}
  </main>

  ${floatingActions()}
  ${footer()}
  ${renderModalsMarkup()}
  ${renderClientDataScripts()}
</body>
</html>`;

    fs.writeFileSync(path.join(SERVICES_PAGES, `${srv.slug}.html`), html, 'utf8');
    // Also save in root PAGES and FRONTEND with hyphenated name for flat routing fallbacks
    fs.writeFileSync(path.join(PAGES, `${srv.slug}.html`), html, 'utf8');
    fs.writeFileSync(path.join(FRONTEND, `${srv.slug}.html`), html, 'utf8');
    console.log(`✓ Generated service page: ${srv.slug}.html`);
  });
}

// Master execution
function buildAll() {
  console.log('🚀 Starting DEVCRAFT Master Site Generation...');
  buildIndexHtml();
  buildProductsPage();
  buildJoyaPage();
  buildJarvisPage();
  buildAptitudePage();
  buildPortfolioPage();
  buildServicesPage();
  buildProjectsPage();
  buildAboutPage();
  buildContactPage();
  buildCartPage();
  buildLegalPages();
  buildClientPortalPage();
  buildAdminLoginPage();
  buildFaqPage();
  build404Page();
  buildServiceSubPages();
  console.log('🎉 All DevCraft HTML pages generated successfully!');
}

if (require.main === module) {
  buildAll();
}

module.exports = { buildAll };



