/**
 * DEVCRAFT - Master Products & Courses Catalog
 * Supports All App Products (50% OFF) and Aptitude Courses (30% OFF)
 * Categories: Android Apps, PC Software, AI Products, Utilities, Aptitude, Other Products
 */

function calculatePricing(item) {
  const isAptitude = item.type === 'aptitude' || 
                     item.category === 'Aptitude' || 
                     (item.category && item.category.toLowerCase().includes('aptitude'));
  const discountPercent = isAptitude ? 30 : 50;
  const originalPrice = Number(item.originalPrice) || 10000;
  const discountAmount = Math.round(originalPrice * (discountPercent / 100));
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  return {
    isAptitude,
    discountPercent,
    discountAmount,
    finalPrice
  };
}

const DEVCRAFT_PRODUCTS = [
  // ==========================================
  // 1. JOYA AI (ANDROID AI ASSISTANT)
  // ==========================================
  {
    id: 'joya-ai',
    name: 'Joya AI — Voice Assistant',
    type: 'app',
    category: 'Android Apps',
    platform: 'Android (Kotlin / Studio)',
    badge: '50% OFF • Full Source Code Included',
    originalPrice: 1999,
    shortDesc: 'Android AI voice assistant with wake word "Wake up Joya", voice commands, phone automation and smart assistant features.',
    detailedDesc: 'Customer gets the complete Joya Android source code after successful purchase. Joya AI transforms your Android smartphone into a responsive voice-commanded intelligence station. Powered by an on-device lightweight voice neural engine, Joya responds instantaneously to the wake phrase "Wake up Joya", executes multi-step app tasks (sending WhatsApp messages, making calls, setting alarms, taking voice memos), and operates seamlessly in the background without draining your battery.',
    features: [
      'Full Android Studio Kotlin project source code with complete build files',
      'Custom responsive wake word detection ("Wake up Joya")',
      'Hands-free app automation: WhatsApp, Phone Dialer, Music, Maps',
      'On-device offline voice synthesis & fast sub-100ms speech intent recognition',
      'Continuous background service with smart battery-saver sleeping states',
      'Context-aware conversational intelligence & memory store',
      'Zero analytics telemetry leakage — 100% private and customer-owned code'
    ],
    wakeWord: 'Wake up Joya',
    version: 'v2.4.0',
    requirements: 'Android Studio Hedgehog+, Android SDK 26+ (Oreo or higher), Kotlin 1.9+',
    changelog: [
      { version: 'v2.4.0', date: '2026-08-15', notes: 'Enhanced offline wake-word acoustic model; battery drain reduced by 35%.' },
      { version: 'v2.3.0', date: '2026-06-20', notes: 'Added direct WhatsApp message dictation and quick call triggers.' },
      { version: 'v2.0.0', date: '2026-03-10', notes: 'Major rewrite with Neural TTS audio synthesizer and modular skill engine.' }
    ],
    fileDetails: {
      filename: 'joya-ai-source-code-v2.4.0.zip',
      originalName: 'joya-ai-source-code-v2.4.0.zip',
      size: '12.4 MB',
      releaseDate: '2026-08-15',
      isFree: false,
      hasDownload: true,
      hasSourceCode: true
    },
    technologies: ['Kotlin', 'Android NDK', 'Porcupine Wake Word', 'TensorFlow Lite', 'Room DB', 'Coroutines'],
    image: '/assets/images/project-ai.svg',
    screenshots: ['/assets/images/project-ai.svg', '/assets/images/project-mobile.svg'],
    rating: '4.98 ★ (3,200+ Android users)'
  },

  // ==========================================
  // 2. JARVIS AI (PC/DESKTOP AI ASSISTANT)
  // ==========================================
  {
    id: 'jarvis-ai',
    name: 'Jarvis AI — PC Assistant',
    type: 'app',
    category: 'PC Software',
    platform: 'Windows / PC (Electron / Python)',
    badge: '50% OFF • Full Source Code Included',
    originalPrice: 3199,
    shortDesc: 'PC/Desktop AI assistant with voice control, automation, system interaction and productivity features.',
    detailedDesc: 'Customer gets the complete Jarvis PC source code after successful purchase. Take total command of your desktop computing environment. Jarvis AI integrates directly into your operating system to index your workspace files, launch apps, write and execute shell scripts, scrape dynamic web data, and query local LLMs (via Ollama or cloud models) without leaving your active workflow.',
    features: [
      'Full PC project source code: Electron desktop frontend + Python automation core',
      'Always-on desktop voice listener & global hotkey activation (Ctrl+Space)',
      'File System Sentinel: Instant semantic search, duplicate cleaner, file tagger',
      'Automated browser workflow executor for data scraping & form filling',
      'Seamless local LLM bridge (Ollama / Llama-3) and OpenAI / Claude fallback',
      'System telemetry monitoring: CPU/GPU temps, RAM usage, process killer',
      'Custom automation macro recorder & Python/Node.js script runner with full build instructions'
    ],
    version: 'v3.1.2',
    requirements: 'Windows 10/11 64-bit, macOS 12+, or Ubuntu 20.04+, Node.js 18+, Python 3.10+',
    changelog: [
      { version: 'v3.1.2', date: '2026-08-20', notes: 'Direct Ollama local model bridge; native Windows 11 Fluent dark glass UI.' },
      { version: 'v3.0.0', date: '2026-05-12', notes: 'Architectural overhaul: Multi-threaded voice agent and desktop vision preview.' },
      { version: 'v2.5.0', date: '2026-01-18', notes: 'Added automated browser scraping and macro recording engine.' }
    ],
    fileDetails: {
      filename: 'jarvis-ai-source-code-v3.1.2.zip',
      originalName: 'jarvis-ai-source-code-v3.1.2.zip',
      size: '18.6 MB',
      releaseDate: '2026-08-20',
      isFree: false,
      hasDownload: true,
      hasSourceCode: true
    },
    technologies: ['Electron', 'Node.js', 'Python', 'Ollama', 'PyAutoGUI', 'Prism.js'],
    image: '/assets/images/project-dashboard.svg',
    screenshots: ['/assets/images/project-dashboard.svg', '/assets/images/project-ai.svg'],
    rating: '4.99 ★ (1,850+ PC power users)'
  }
];

// Attach dynamic pricing properties to every product
const PRODUCTS_WITH_PRICING = DEVCRAFT_PRODUCTS.map(p => {
  const pricing = calculatePricing(p);
  return {
    ...p,
    ...pricing
  };
});

module.exports = {
  DEVCRAFT_PRODUCTS: PRODUCTS_WITH_PRICING,
  calculatePricing
};
