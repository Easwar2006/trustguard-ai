import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Video, 
  Mic, 
  MessageSquare, 
  Fingerprint, 
  ShieldAlert, 
  ArrowRight, 
  Layers, 
  Activity,
  Terminal,
  ChevronRight
} from 'lucide-react';

export default function HoloSphereHero() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle high DPI
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate ~280 particles on a sphere surface (Fibonacci sphere algorithm)
    const particleCount = 280;
    const radius = 140;
    const particles = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      particles.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseSize: Math.random() * 1.5 + 1.2,
        colorType: Math.random() > 0.4 ? 'cyan' : 'violet'
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Ambient radial gradient: Electric Cyan fading to Deep Violet / HoloDark
      const bgGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius * 1.7);
      bgGlow.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
      bgGlow.addColorStop(0.45, 'rgba(147, 51, 234, 0.15)');
      bgGlow.addColorStop(0.85, 'rgba(9, 7, 30, 0.05)');
      bgGlow.addColorStop(1, 'rgba(9, 7, 30, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Rotate angles
      angleX += 0.002;
      angleY += 0.004;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const fov = 350;

      // Project and draw particles
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Rotation around Y axis
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotation around X axis
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective projection formula
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y1 * scale;

        projected.push({
          x: projX,
          y: projY,
          z: z2,
          scale,
          colorType: p.colorType,
          baseSize: p.baseSize
        });
      }

      // Sort back-to-front
      projected.sort((a, b) => b.z - a.z);

      // Draw particle connections / neural web
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i += 2) {
        for (let j = i + 1; j < Math.min(i + 5, projected.length); j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 42) {
            const alpha = (1 - dist / 42) * 0.25 * ((projected[i].z + radius) / (radius * 2));
            ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, alpha)})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const alpha = Math.min(1, Math.max(0.15, (p.z + radius) / (radius * 1.8)));
        const size = Math.max(0.8, p.baseSize * p.scale);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

        if (p.colorType === 'cyan') {
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.shadowColor = '#9333EA';
          ctx.shadowBlur = 6;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      // Draw faint holographic orbital rings around equator
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 1.15, radius * 0.35, angleY * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative overflow-hidden py-10 lg:py-16">
      {/* Background radial glow accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyanGlow/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violetGlow/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT: 3D Holographic Sphere Canvas & Floating Hex HUD Chips */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px]">
            
            {/* The 3D Canvas */}
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full pointer-events-none z-10"
              />

              {/* Floating Framer Motion Hexagonal HUD Chips placed around the sphere */}

              {/* Chip 1: Top-Left - TEMPORAL VIDEO -> 82% Deepfake */}
              <motion.div
                initial={{ opacity: 0, y: -20, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -8, 0],
                  x: [0, 4, 0]
                }}
                transition={{ 
                  duration: 4.2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute -top-2 left-2 z-20"
              >
                <div className="backdrop-blur-md bg-holoCard/90 border border-crimsonBlock/70 shadow-crimson-glow rounded-xl p-3 flex items-center space-x-3 text-xs">
                  <div className="p-2 rounded-lg bg-crimsonBlock/20 text-crimsonBlock border border-crimsonBlock/40">
                    <Video className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 tracking-wider">TEMPORAL VIDEO</div>
                    <div className="font-mono font-bold text-crimsonBlock text-sm flex items-center space-x-1">
                      <span>82%</span>
                      <span className="text-[10px] uppercase font-normal text-gray-300">Deepfake</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Chip 2: Top-Right - VOICE CLONE -> 76% Synthetic */}
              <motion.div
                initial={{ opacity: 0, y: -15, x: 15 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, 8, 0],
                  x: [0, -6, 0]
                }}
                transition={{ 
                  duration: 4.8, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.6 
                }}
                className="absolute -top-1 right-2 z-20"
              >
                <div className="backdrop-blur-md bg-holoCard/90 border border-amberWarn/70 shadow-lg rounded-xl p-3 flex items-center space-x-3 text-xs">
                  <div className="p-2 rounded-lg bg-amberWarn/20 text-amberWarn border border-amberWarn/40">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 tracking-wider">VOICE CLONE</div>
                    <div className="font-mono font-bold text-amberWarn text-sm flex items-center space-x-1">
                      <span>76%</span>
                      <span className="text-[10px] uppercase font-normal text-gray-300">Synthetic</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Chip 3: Bottom-Left - FRAUD MESSAGE -> 91% Phishing */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: -15 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, 7, 0],
                  x: [0, 5, 0]
                }}
                transition={{ 
                  duration: 5.2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1.2 
                }}
                className="absolute bottom-2 -left-2 z-20"
              >
                <div className="backdrop-blur-md bg-holoCard/90 border border-crimsonBlock/70 shadow-crimson-glow rounded-xl p-3 flex items-center space-x-3 text-xs">
                  <div className="p-2 rounded-lg bg-crimsonBlock/20 text-crimsonBlock border border-crimsonBlock/40">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 tracking-wider">FRAUD MESSAGE</div>
                    <div className="font-mono font-bold text-crimsonBlock text-sm flex items-center space-x-1">
                      <span>91%</span>
                      <span className="text-[10px] uppercase font-normal text-gray-300">Phishing</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Chip 4: Bottom-Right - PERCEPTUAL HASH -> pHash: 8f3a91 */}
              <motion.div
                initial={{ opacity: 0, y: 15, x: 15 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -9, 0],
                  x: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1.8 
                }}
                className="absolute -bottom-2 right-1 z-20"
              >
                <div className="backdrop-blur-md bg-holoCard/90 border border-cyanGlow/60 shadow-cyan-sm rounded-xl p-3 flex items-center space-x-3 text-xs">
                  <div className="p-2 rounded-lg bg-cyanGlow/20 text-cyanGlow border border-cyanGlow/40">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 tracking-wider">PERCEPTUAL HASH</div>
                    <div className="font-mono font-bold text-cyanGlow text-xs">
                      pHash: 8f3a91
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* RIGHT: Hero Narrative & Pipeline */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Badge: MULTIMODAL FORENSIC ENGINE ACTIVE */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-holoSurface border border-cyanGlow/40 text-cyanGlow shadow-cyan-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyanGlow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyanGlow"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase">
                MULTIMODAL FORENSIC ENGINE ACTIVE
              </span>
            </div>

            {/* Headline: Detect. Block. Trace. Protect. */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Detect. Block.<br />
              <span className="bg-gradient-to-r from-cyanGlow via-cyanAccent to-violetGlow bg-clip-text text-transparent">
                Trace. Protect.
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Real-time deepfake defense and neural forensic command center. Analyzes spatial-temporal video warping, synthetic voice cloned spectrograms, and algorithmic scam payloads before they breach your platform ingress.
            </p>

            {/* Stepper Pipeline: Detect → Assess → Block (86%) → Trace → Report */}
            <div className="p-4 rounded-xl bg-holoCard/80 border border-holoBorder backdrop-blur-md">
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>INGRESS TELEMETRY PIPELINE</span>
                <span className="text-emeraldAllow font-semibold">ONLINE • 142ms</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-holoSurface text-gray-300 border border-gray-700">Detect</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                <span className="px-2.5 py-1 rounded bg-holoSurface text-gray-300 border border-gray-700">Assess</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                <span className="px-2.5 py-1 rounded bg-crimsonBlock/20 text-crimsonBlock border border-crimsonBlock/50 font-bold shadow-sm">
                  Block (86%)
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                <span className="px-2.5 py-1 rounded bg-holoSurface text-cyanAccent border border-cyanAccent/40">Trace</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                <span className="px-2.5 py-1 rounded bg-holoSurface text-gray-300 border border-gray-700">Report</span>
              </div>
            </div>

            {/* CTAs: Launch Forensic Scanner & Live Threat Registry */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/analyze')}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyanGlow to-cyanAccent text-black font-bold text-sm tracking-wide shadow-cyan-glow hover:shadow-cyan-glow hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Launch Forensic Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/results"
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-holoCard/90 hover:bg-holoSurface border border-holoBorder hover:border-cyanGlow/50 text-gray-200 hover:text-white font-mono text-sm transition-all"
              >
                <Terminal className="w-4 h-4 text-cyanGlow" />
                <span>Live Threat Registry</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
