/**
 * TrustGuard AI - Production-Grade Animated Cyber-Forensics Engine
 * Tagline: Detect. Block. Trace. Protect.
 */

// Global State
const state = {
  activeView: 'home',
  activeTab: 'video',
  incidentId: 'TG-2026-9041X',
  specimenHash: '8f3a91bc7d20e4a905a812',
  sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  scores: {
    overall: 86,
    video: 82,
    audio: 76,
    text: 91
  },
  threshold: 0.70,
  pHashSensitivity: 'Heuristic',
  hammingTolerance: 4,
  heatmapAlpha: 85,
  showHeatmap: true,
  showAttention: false,
  isPlayingAudio: false,
  isPlayingVideo: true,
  currentFrame: 14,
  splitSliderPos: 50,
  completedActions: 1
};

// Lucide Icon SVG Dictionary (Ensures 100% offline & instantaneous icon rendering)
const icons = {
  ShieldAlert: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  ShieldCheck: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  Fingerprint: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22A8 8 0 0 1 8 12a4 4 0 0 1 8 0c0 1.5-.5 3.5-1.5 5.5"/><path d="M14 18c-.5 1.5-1 2.5-1.5 3.5"/><path d="M17 19c.5-1 1-2.5 1-4.5a8 8 0 0 0-.6-3"/><path d="M19 12a7 7 0 0 0-.2-1.7"/><path d="M21 16c.3-1.2.5-2.5.5-4a9.5 9.5 0 0 0-.5-3"/></svg>`,
  FileText: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  Activity: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  Cpu: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
  UploadCloud: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="16 16 12 12 8 16"/></svg>`,
  Share2: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  CheckCircle2: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  AlertTriangle: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  Sliders: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  Download: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  Copy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  Terminal: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  Eye: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  Play: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  Pause: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  Zap: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  Crosshair: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`,
  Layers: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  Volume2: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
  Sparkles: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  Lock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  Check: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  ChevronDown: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
};

// Render icons into DOM elements with data-icon attribute
function initIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const iconName = el.getAttribute('data-icon');
    if (icons[iconName]) {
      el.innerHTML = icons[iconName];
    }
  });
}

// Background Interactive Cyber Particle Mesh Canvas
function initCyberMeshCanvas() {
  const canvas = document.getElementById('cyberMeshCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particleCount = 48;
  const particles = [];
  const maxDistance = 140;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: i % 4 === 0 ? '#EF4444' : (i % 3 === 0 ? '#3B82F6' : '#06B6D4')
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect proximate particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Proximity to mouse cursor
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 180) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        const mAlpha = (1 - mdist / 180) * 0.28;
        ctx.strokeStyle = `rgba(6, 182, 212, ${mAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

// 3D Tilt Micro-Interaction for Glass Cards
function initCard3DTilt() {
  const cards = document.querySelectorAll('.cyber-card, .threat-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

// Sliding Underline Tab Indicator on Navbar
function initNavUnderline() {
  const navLinks = document.querySelector('.nav-links');
  const indicator = document.querySelector('.nav-slider-indicator');
  const activeBtn = document.querySelector('.nav-btn.active');

  function updateIndicator(btn) {
    if (!btn || !indicator || !navLinks) return;
    const btnRect = btn.getBoundingClientRect();
    const parentRect = navLinks.getBoundingClientRect();

    indicator.style.width = `${btnRect.width}px`;
    indicator.style.left = `${btnRect.left - parentRect.left}px`;
  }

  if (activeBtn) updateIndicator(activeBtn);
  window.updateNavIndicator = updateIndicator;
}

// Dynamic Typewriter Mission Effect on Hero
function initTypewriterEffect() {
  const textElement = document.getElementById('typewriterText');
  if (!textElement) return;

  const phrases = [
    "Halting synthetic deepfakes, neural voice clones, and social engineering before distribution.",
    "Unified multimodal cross-inference identifying zero-day visual and acoustic deception.",
    "Autonomous zero-trust policy quarantine enforcing platform containment at ingress.",
    "Perceptual hash attribution cross-matching syndicated Telegram & WhatsApp fraud archives."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 38;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 18;
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 38;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2400; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }
  type();
}

// Toast Notification Manager
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? icons.CheckCircle2 : (type === 'error' ? icons.AlertTriangle : icons.Activity);
  toast.innerHTML = `
    <span style="color: var(--accent-cyan); display: flex; align-items: center;">${icon}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Navigation View Controller
function switchView(viewName) {
  document.querySelectorAll('.view-container').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active');
    state.activeView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update Nav links and sliding indicator
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-nav') === viewName) {
      btn.classList.add('active');
      if (window.updateNavIndicator) window.updateNavIndicator(btn);
    } else {
      btn.classList.remove('active');
    }
  });

  // Special triggers
  if (viewName === 'analyze' && state.activeTab === 'audio') {
    startAudioVisualizer();
  } else if (viewName === 'results') {
    animateResultsGauge();
  } else if (viewName === 'trace') {
    animateTerminalHash();
  }
}

// Ingestion Tabs Controller
function switchIngestionTab(tabName) {
  state.activeTab = tabName;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const previewVideo = document.getElementById('previewVideo');
  const previewAudio = document.getElementById('previewAudio');
  const previewText = document.getElementById('previewText');
  const dropzoneTitle = document.getElementById('dropzoneTitle');
  const dropzoneDesc = document.getElementById('dropzoneDesc');

  previewVideo.style.display = 'none';
  previewAudio.style.display = 'none';
  previewText.style.display = 'none';

  if (tabName === 'video') {
    previewVideo.style.display = 'block';
    dropzoneTitle.textContent = 'Drop Media File (MP4, PNG, JPG)';
    dropzoneDesc.textContent = 'High-resolution frame boundary & corneal specular reflections scanner';
  } else if (tabName === 'audio') {
    previewAudio.style.display = 'block';
    dropzoneTitle.textContent = 'Drop Audio Recording (WAV, MP3, FLAC)';
    dropzoneDesc.textContent = 'Neural vocal tract resonance & pitch contour flattening detector';
    startAudioVisualizer();
  } else if (tabName === 'text') {
    previewText.style.display = 'block';
    dropzoneTitle.textContent = 'Drop Phishing / Wire Scam Payload';
    dropzoneDesc.textContent = 'Social engineering urgency heuristics & executive spoofing parser';
  } else if (tabName === 'bundle') {
    previewVideo.style.display = 'block';
    dropzoneTitle.textContent = 'Drop Multimodal Forensic Archive (.ZIP, .TG)';
    dropzoneDesc.textContent = 'Unified cross-modal evaluation combining video, cloned audio, and scam text';
  }
}

// Preset Payloads Quick Loader
function loadPreset(presetKey) {
  if (presetKey === 'deepfake_exec') {
    switchIngestionTab('video');
    document.getElementById('scrubberVal').textContent = 'Frame 014 / 032';
    document.getElementById('frameScrubber').value = 14;
    showToast('Loaded Specimen: Simulated AI-Generated Executive Portrait', 'info');
  } else if (presetKey === 'voice_clone') {
    switchIngestionTab('audio');
    state.isPlayingAudio = true;
    showToast('Loaded Audio: Neural Acoustic Clone (Sample: CEO Wire Request)', 'info');
  } else if (presetKey === 'wire_scam') {
    switchIngestionTab('text');
    showToast('Loaded Text Payload: High-Urgency Executive Wire Extraction', 'info');
  } else if (presetKey === 'multimodal_bundle') {
    switchIngestionTab('bundle');
    showToast('Loaded Full Bundle: Deepfake Video + Synced Neural Voice + Telegram Text', 'info');
  }
}

// Scrubber Controller for Video / Frame preview
function initVideoScrubber() {
  const scrubber = document.getElementById('frameScrubber');
  const scrubberVal = document.getElementById('scrubberVal');
  const frameArtifactBox = document.getElementById('frameArtifactBox');

  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      state.currentFrame = e.target.value;
      const formatted = String(state.currentFrame).padStart(3, '0');
      scrubberVal.textContent = `Frame ${formatted} / 032`;
      
      if (frameArtifactBox) {
        const offsetLeft = 45 + Math.sin(state.currentFrame * 0.4) * 6;
        const offsetTop = 24 + Math.cos(state.currentFrame * 0.3) * 5;
        frameArtifactBox.style.left = `${offsetLeft}%`;
        frameArtifactBox.style.top = `${offsetTop}%`;
      }
    });
  }
}

// Audio Spectrogram Canvas Visualizer
let audioAnimFrame = null;
function startAudioVisualizer() {
  const canvas = document.getElementById('audioCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  const barCount = 52;
  const bars = Array.from({ length: barCount }, () => Math.random() * 0.4 + 0.1);

  function draw() {
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(31, 41, 55, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 30; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const barWidth = (canvas.width / barCount) - 3;

    for (let i = 0; i < barCount; i++) {
      if (state.isPlayingAudio) {
        bars[i] += (Math.random() - 0.5) * 0.14;
        if (bars[i] < 0.08) bars[i] = 0.08;
        if (bars[i] > 0.95) bars[i] = 0.95;
      }

      const h = bars[i] * (canvas.height - 24);
      const x = i * (barWidth + 3);
      const y = canvas.height - h;

      const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
      grad.addColorStop(0, '#06B6D4');
      grad.addColorStop(0.5, '#3B82F6');
      grad.addColorStop(1, '#8B5CF6');

      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
      ctx.shadowBlur = 8;
      ctx.fillRect(x, y, barWidth, h);
      ctx.shadowBlur = 0;
    }

    audioAnimFrame = requestAnimationFrame(draw);
  }

  if (audioAnimFrame) cancelAnimationFrame(audioAnimFrame);
  draw();
}

// Real-Time Regex Pattern Highlighter and Token Counter in Text Preview
function initTextEditorAnalysis() {
  const textConsole = document.querySelector('.text-console-box');
  const tokenCountEl = document.getElementById('tokenCountVal');
  const entropyValEl = document.getElementById('entropyVal');

  if (textConsole && tokenCountEl) {
    const rawText = textConsole.innerText;
    const tokens = Math.round(rawText.split(/\s+/).length * 1.35);
    tokenCountEl.textContent = `${tokens} Tokens (approx)`;
    if (entropyValEl) entropyValEl.textContent = 'Shannon Entropy: 4.82 bits';
  }
}

// Multi-stage Animated Analyze Execution with Sequential Checkmarks
function executeForensicAnalysis() {
  const btn = document.getElementById('btnExecuteAnalysis');
  const btnText = document.getElementById('btnExecuteText');
  const progressBar = document.getElementById('btnProgressBar');
  const previewer = document.querySelector('.media-stage');

  btn.disabled = true;
  if (previewer) previewer.classList.add('scanning');

  // Stage 1: Ingesting media (0.6s)
  btnText.innerHTML = `${icons.Activity} <span>1/4 Ingesting media payload... (0.6s)</span>`;
  progressBar.style.width = '25%';

  setTimeout(() => {
    // Stage 2: Extracting perceptual embeddings (1.0s)
    btnText.innerHTML = `${icons.Cpu} <span>2/4 Extracting embeddings &amp; spectrograms... (1.0s)</span>`;
    progressBar.style.width = '60%';
    showToast('Extracted 86M vision tokens & 16kHz spectrogram features', 'info');

    setTimeout(() => {
      // Stage 3: Executing cross-model risk engine (0.8s)
      btnText.innerHTML = `${icons.ShieldAlert} <span>3/4 Executing cross-model risk engine... (0.8s)</span>`;
      progressBar.style.width = '85%';

      setTimeout(() => {
        // Stage 4: Synthesizing forensic verdict (0.6s)
        btnText.innerHTML = `${icons.CheckCircle2} <span>4/4 Synthesizing forensic verdict... (0.6s)</span>`;
        progressBar.style.width = '100%';

        setTimeout(() => {
          btn.disabled = false;
          progressBar.style.width = '0%';
          btnText.innerHTML = `${icons.Zap} <span>Execute Neural Forensic Scan</span>`;
          if (previewer) previewer.classList.remove('scanning');

          // Auto-navigate to Results View
          switchView('results');
          showToast('Autonomous Defense: Incident TG-2026-9041X Blocked at Ingress!', 'error');
        }, 600);

      }, 800);
    }, 1000);
  }, 600);
}

// Animate Central Radial Gauge on Results View
function animateResultsGauge() {
  const circle = document.getElementById('gaugeCircle');
  const scoreText = document.getElementById('gaugeScoreText');
  if (!circle || !scoreText) return;

  const targetScore = state.scores.overall;
  const circumference = 565.48; // 2 * PI * 90
  const offset = circumference * (1 - targetScore / 100);

  circle.style.strokeDashoffset = circumference;
  scoreText.textContent = '0%';

  let current = 0;
  const interval = setInterval(() => {
    current += 2;
    if (current >= targetScore) {
      current = targetScore;
      clearInterval(interval);
    }
    scoreText.textContent = `${current}%`;
  }, 22);

  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 80);
}

// Animated Terminal Typing Effect for pHash Display on Trace View
function animateTerminalHash() {
  const pHashDisplay = document.getElementById('terminalPHash');
  if (!pHashDisplay) return;

  const fullText = "pHash: 8f3a91bc7d20e4a905a812";
  pHashDisplay.textContent = "";
  let idx = 0;

  const timer = setInterval(() => {
    if (idx < fullText.length) {
      pHashDisplay.textContent += fullText[idx];
      idx++;
    } else {
      clearInterval(timer);
    }
  }, 35);
}

// Split Comparison Slider (Specimen vs Archive)
function initSplitSlider() {
  const container = document.getElementById('splitSliderWrapper');
  const layerIndexed = document.getElementById('layerIndexed');
  const handle = document.getElementById('splitHandle');
  if (!container || !layerIndexed || !handle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let posX = x - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;
    
    const percentage = (posX / rect.width) * 100;
    state.splitSliderPos = percentage;

    layerIndexed.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (isDragging) setSliderPosition(e.clientX);
  });

  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length > 0) {
      setSliderPosition(e.touches[0].clientX);
    }
  });

  container.addEventListener('click', (e) => {
    setSliderPosition(e.clientX);
  });
}

// Forensic Heatmap Modal Controller
function openHeatmapModal() {
  const modal = document.getElementById('heatmapModal');
  if (modal) modal.classList.add('active');
}

function closeHeatmapModal() {
  const modal = document.getElementById('heatmapModal');
  if (modal) modal.classList.remove('active');
}

// Copy to Clipboard with Toast
function copyText(text, label = 'Content') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${label} to clipboard!`, 'success');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(`Copied ${label} to clipboard!`, 'success');
  });
}

// Generate STIX 2.1 JSON Payload
function exportJsonPayload() {
  const btn = event?.currentTarget;
  if (btn) {
    btn.innerHTML = `<span data-icon="Activity"></span> Serializing Payload...`;
    initIcons();
  }

  setTimeout(() => {
    const payload = {
      type: "report",
      spec_version: "2.1",
      id: `report--${state.incidentId}`,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      name: "TrustGuard AI Forensic Incident Report",
      description: "Multimodal AI forensic platform identifying synthetic deepfakes, neural voice clones, and social engineering scam vectors.",
      report_types: ["threat-actor", "malicious-media", "synthetic-impersonation"],
      threat_assessment: {
        incident_id: state.incidentId,
        overall_risk_score: state.scores.overall,
        risk_classification: "HIGH_RISK_BLOCK",
        autonomous_containment: "INTERNAL_DISTRIBUTION_BLOCKED",
        pHash: state.specimenHash,
        sha256: state.sha256,
        hamming_distance: state.hammingTolerance,
        transparency_notice: "Detection relies on probabilistic neural inference. End-to-end encrypted tunnels require ingress client integration.",
        corroborated_sources: [
          { name: "Telegram Fraud Ring Archive #4", similarity: 0.94, indexed_hours_ago: 14 },
          { name: "Syndicated WhatsApp Forward Network", similarity: 0.87, indexed_days_ago: 2 }
        ],
        multimodal_matrix: {
          visual_deepfake_confidence: state.scores.video / 100,
          neural_acoustic_confidence: state.scores.audio / 100,
          lexical_social_engineering: state.scores.text / 100
        },
        model_metadata: {
          vision_checkpoint: "trustguard/deepfake-vit-base (224x224)",
          audio_checkpoint: "trustguard/wav2vec2-synthetic-voice (16kHz)",
          nlp_checkpoint: "trustguard/scam-deberta-v3-intent (512 ctx)"
        }
      }
    };

    const jsonString = JSON.stringify(payload, null, 2);
    copyText(jsonString, 'STIX 2.1 Forensic JSON Evidence');

    if (btn) {
      btn.innerHTML = `<span data-icon="Copy"></span> Copy JSON Evidence Payload`;
      initIcons();
    }
  }, 400);
}

// Simulate SIEM / Webhook Dispatch with Spinner Feedback
function triggerAlertWebhook() {
  const btn = event?.currentTarget;
  if (btn) {
    btn.innerHTML = `<span data-icon="Activity"></span> Dispatching to SIEM...`;
    initIcons();
  }

  setTimeout(() => {
    showToast('HTTP 200 OK: Incident TG-2026-9041X dispatched to PagerDuty & Splunk SOAR', 'success');
    if (btn) {
      btn.innerHTML = `<span data-icon="Share2"></span> Dispatch Webhook Alert`;
      initIcons();
    }
  }, 1000);
}

// Interactive Recommended Actions Checklist Controller
function toggleChecklistAction(el) {
  const checkbox = el.querySelector('input[type="checkbox"]');
  if (!checkbox) return;

  // Toggle state
  checkbox.checked = !checkbox.checked;
  if (checkbox.checked) {
    el.classList.add('checked');
  } else {
    el.classList.remove('checked');
  }

  // Update actions counter
  const total = document.querySelectorAll('.checklist-item').length;
  const checked = document.querySelectorAll('.checklist-item input:checked').length;
  state.completedActions = checked;

  const counterEl = document.getElementById('actionCountBadge');
  if (counterEl) {
    counterEl.textContent = `${checked} of ${total} Actions Completed`;
    if (checked === total) {
      counterEl.style.color = 'var(--risk-low)';
      showToast('All containment incident actions marked completed!', 'success');
    } else {
      counterEl.style.color = 'var(--accent-cyan)';
    }
  }
}

// Sliders Reaction Controller (Hugging Face Drawer)
function initModelSliders() {
  const thresholdSlider = document.getElementById('thresholdSlider');
  const thresholdVal = document.getElementById('thresholdVal');
  const hammingSlider = document.getElementById('hammingSlider');
  const hammingVal = document.getElementById('hammingVal');
  const alphaSlider = document.getElementById('heatmapAlphaSlider');
  const alphaVal = document.getElementById('heatmapAlphaVal');

  if (thresholdSlider) {
    thresholdSlider.addEventListener('input', (e) => {
      state.threshold = parseFloat(e.target.value);
      if (thresholdVal) thresholdVal.textContent = state.threshold.toFixed(2);
      
      const dynamicOverall = Math.round(86 * (state.threshold / 0.70));
      state.scores.overall = Math.min(99, Math.max(25, dynamicOverall));
      
      const badge = document.getElementById('overallScoreMetric');
      if (badge) badge.textContent = `${state.scores.overall}%`;
    });
  }

  if (hammingSlider) {
    hammingSlider.addEventListener('input', (e) => {
      state.hammingTolerance = parseInt(e.target.value, 10);
      if (hammingVal) hammingVal.textContent = `d_H \u2264 ${state.hammingTolerance}`;
    });
  }

  if (alphaSlider) {
    alphaSlider.addEventListener('input', (e) => {
      state.heatmapAlpha = parseInt(e.target.value, 10);
      if (alphaVal) alphaVal.textContent = `${state.heatmapAlpha}%`;
    });
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initCyberMeshCanvas();
  initCard3DTilt();
  initNavUnderline();
  initTypewriterEffect();
  initVideoScrubber();
  initSplitSlider();
  initModelSliders();
  initTextEditorAnalysis();

  window.addEventListener('resize', () => {
    if (state.activeTab === 'audio') startAudioVisualizer();
  });

  const scrubber = document.getElementById('frameScrubber');
  if (scrubber) scrubber.value = 14;

  console.log("TrustGuard AI Live Guard Engine initialized.");
});
