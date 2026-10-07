import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Eye, 
  RefreshCw, 
  Play, 
  Pause, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Users, 
  Monitor, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Terminal,
  Zap
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

export default function LiveProctorHUD({ standalone = false }) {
  // Camera & Stream States
  const [streamActive, setStreamActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState('idle'); // 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'
  const [errorMessage, setErrorMessage] = useState('');
  const [useSimulator, setUseSimulator] = useState(false);
  const [simPreset, setSimPreset] = useState('clean'); // 'clean' | 'no_face' | 'multiple_faces' | 'screen_replay' | 'virtual_loop'
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Live Proctor Telemetry & Decision States
  const [statusVerdict, setStatusVerdict] = useState('SECURE'); // 'SECURE' | 'VIOLATION'
  const [riskScore, setRiskScore] = useState(8);
  const [activeViolation, setActiveViolation] = useState(null);
  const [violationAlert, setViolationAlert] = useState(null);
  const [faceCount, setFaceCount] = useState(1);
  const [faces, setFaces] = useState([
    { rel_x: 0.35, rel_y: 0.22, rel_w: 0.30, rel_h: 0.42 }
  ]);
  const [telemetry, setTelemetry] = useState({
    sensorNoise: 4.82,
    moireIndex: 1.18,
    gradientVariance: 1840.5,
    isCentered: true,
    consecutiveStaticFrames: 0
  });
  const [details, setDetails] = useState([
    'Biometric and optical integrity verified.',
    'Candidate face centered within optimal reticle.',
    'Organic CMOS sensor noise baseline nominal.'
  ]);

  // Performance metrics
  const [fps, setFps] = useState(30);
  const [pingLatency, setPingLatency] = useState(38);
  const [totalInspections, setTotalInspections] = useState(0);
  const [violationCount, setViolationCount] = useState(0);
  const [auditLog, setAuditLog] = useState([
    {
      id: 'log-init',
      timestamp: new Date().toLocaleTimeString(),
      status: 'SECURE',
      score: 8,
      event: 'Proctor Session Initialized - Ingress Optical Node Online'
    }
  ]);

  // DOM Refs
  const videoRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const fpsCounterRef = useRef({ lastTime: performance.now(), frames: 0 });
  const sessionIdRef = useRef(`proctor_${Math.random().toString(36).substring(2, 9)}`);

  // Audio Beep on Violation Trigger
  const playAlertSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(820, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(410, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.19);
    } catch {
      // Audio context policy safe ignore
    }
  }, [soundEnabled]);

  // 1. Initialize Real Webcam Stream
  const startCamera = async () => {
    try {
      setCameraPermission('requesting');
      setErrorMessage('');

      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Webcam mediaDevices API not supported in this environment');
      }

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Video auto-play warning:', e));
      }

      setStreamActive(true);
      setCameraPermission('granted');
      setUseSimulator(false);
    } catch (err) {
      console.warn('Camera request error:', err);
      setCameraPermission('denied');
      setErrorMessage(err.message || 'Camera permission denied or camera device busy.');
      // Auto-fallback to simulator mode so candidate / evaluator can still test
      setUseSimulator(true);
      setStreamActive(true);
    }
  };

  // 2. Stop Camera & Cleanup Tracks
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Track stop error:', e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  // 3. Generate Simulated Canvas Specimen for Fallback / Preset Testing
  const drawSimulatorFrame = useCallback((ctx, width, height, preset) => {
    // Cyber dark background
    ctx.fillStyle = '#0c0f1d';
    ctx.fillRect(0, 0, width, height);

    // Subtle background mesh
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const t = Date.now() / 1000;
    const microShake = (preset === 'virtual_loop') ? 0 : Math.sin(t * 8) * 1.5;

    if (preset === 'no_face') {
      // Empty chair / room background (Candidate Left)
      ctx.fillStyle = '#161d31';
      ctx.beginPath();
      ctx.roundRect(width * 0.35, height * 0.45, width * 0.3, height * 0.5, 20);
      ctx.fill();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('[ OPTICAL FIELD VACANT ]', width * 0.32, height * 0.35);
      return;
    }

    // Helper to draw realistic stylized face geometry
    const drawFace = (cx, cy, scale = 1, isIntruder = false) => {
      ctx.save();
      ctx.translate(cx + microShake, cy);

      // Head oval
      ctx.fillStyle = isIntruder ? '#d97706' : '#d1a884';
      ctx.beginPath();
      ctx.ellipse(0, 0, 75 * scale, 100 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = isIntruder ? '#451a03' : '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(0, -65 * scale, 80 * scale, 55 * scale, 0, Math.PI, 0);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-28 * scale, -15 * scale, 14 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.ellipse(28 * scale, -15 * scale, 14 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupils (track slightly)
      ctx.fillStyle = '#0f172a';
      const pupilShift = Math.sin(t * 2) * 3;
      ctx.beginPath();
      ctx.arc((-28 + pupilShift) * scale, -15 * scale, 5 * scale, 0, Math.PI * 2);
      ctx.arc((28 + pupilShift) * scale, -15 * scale, 5 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Eyebrows
      ctx.strokeStyle = '#33271e';
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.moveTo(-42 * scale, -32 * scale);
      ctx.lineTo(-14 * scale, -30 * scale);
      ctx.moveTo(14 * scale, -30 * scale);
      ctx.lineTo(42 * scale, -32 * scale);
      ctx.stroke();

      // Nose
      ctx.strokeStyle = '#b28662';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(0, -10 * scale);
      ctx.lineTo(-4 * scale, 15 * scale);
      ctx.lineTo(6 * scale, 18 * scale);
      ctx.stroke();

      // Mouth
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.arc(0, 42 * scale, 18 * scale, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Shoulders / Torso
      ctx.fillStyle = isIntruder ? '#7c2d12' : '#0369a1';
      ctx.beginPath();
      ctx.ellipse(0, 160 * scale, 140 * scale, 70 * scale, 0, 0, Math.PI);
      ctx.fill();

      ctx.restore();
    };

    if (preset === 'multiple_faces') {
      // Primary Candidate
      drawFace(width * 0.36, height * 0.52, 0.95, false);
      // Secondary Unauthorized Intruder
      drawFace(width * 0.74, height * 0.56, 0.85, true);
      // Warning flag
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('[ SECONDARY INTRUDER ]', width * 0.62, height * 0.22);
    } else {
      // Single centered face
      drawFace(width * 0.5, height * 0.5, 1.05, false);
    }

    if (preset === 'screen_replay') {
      // Draw screen border / display bezels
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Camera lens glare / monitor reflections
      const glareGradient = ctx.createLinearGradient(0, 0, width, height);
      glareGradient.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
      glareGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
      glareGradient.addColorStop(0.5, 'transparent');
      glareGradient.addColorStop(0.8, 'rgba(0, 240, 255, 0.12)');
      ctx.fillStyle = glareGradient;
      ctx.fillRect(10, 10, width - 20, height - 20);

      // Repetitive horizontal scanline banding (LCD refresh)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let y = 14; y < height - 14; y += 12) {
        ctx.fillRect(14, y, width - 28, 4);
      }
    }

    // Add sensor thermal noise (Poisson/Gaussian grain) except in virtual loop
    if (preset !== 'virtual_loop') {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 16) {
        const noise = (Math.random() - 0.5) * 12;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }, []);

  // 4. Capture Frame & POST to /api/proctor/verify-frame
  const captureAndVerifyFrame = useCallback(async () => {
    if (isPaused) return;

    const canvas = hiddenCanvasRef.current;
    if (!canvas) return;

    const captureWidth = 640;
    const captureHeight = 480;
    canvas.width = captureWidth;
    canvas.height = captureHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Capture from real webcam OR render simulator preset
    if (!useSimulator && videoRef.current && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, captureWidth, captureHeight);
    } else {
      drawSimulatorFrame(ctx, captureWidth, captureHeight, simPreset);
    }

    // Base64 JPEG frame payload
    const base64Data = canvas.toDataURL('image/jpeg', 0.82);
    const startPing = performance.now();

    try {
      const response = await fetch(API_ENDPOINTS.PROCTOR_VERIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: base64Data,
          session_id: sessionIdRef.current
        })
      });

      const elapsed = Math.round(performance.now() - startPing);
      setPingLatency(elapsed);

      if (response.ok) {
        const data = await response.json();
        
        setStatusVerdict(data.status || 'SECURE');
        setRiskScore(typeof data.riskScore === 'number' ? data.riskScore : 8);
        setActiveViolation(data.violation || null);
        setViolationAlert(data.alert || null);
        setFaceCount(typeof data.faceCount === 'number' ? data.faceCount : 1);
        
        if (Array.isArray(data.faces) && data.faces.length > 0) {
          setFaces(data.faces);
        } else if (data.status === 'SECURE') {
          setFaces([{ rel_x: 0.35, rel_y: 0.22, rel_w: 0.30, rel_h: 0.42 }]);
        } else {
          setFaces([]);
        }

        if (data.telemetry) {
          setTelemetry(prev => ({ ...prev, ...data.telemetry }));
        }

        if (Array.isArray(data.details)) {
          setDetails(data.details);
        }

        setTotalInspections(prev => prev + 1);

        // Track violations and trigger sound alert
        if (data.status === 'VIOLATION') {
          setViolationCount(prev => prev + 1);
          playAlertSound();

          setAuditLog(prev => [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              status: 'VIOLATION',
              score: data.riskScore,
              event: `VIOLATION: ${data.alert || data.violation || 'Ingress Anomaly'}`
            },
            ...prev.slice(0, 24)
          ]);
        } else {
          // Add periodic heartbeat log
          setAuditLog(prev => {
            if (prev.length === 0 || prev[0].status === 'VIOLATION') {
              return [
                {
                  id: `log-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString(),
                  status: 'SECURE',
                  score: data.riskScore,
                  event: 'Integrity Nominal: Single Candidate Biometrics Verified'
                },
                ...prev.slice(0, 24)
              ];
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.warn('Frame verification connection error:', err);
    }
  }, [useSimulator, simPreset, isPaused, drawSimulatorFrame, playAlertSound]);

  // 5. Setup 1.5 Second Capture Interval & Render FPS loop
  useEffect(() => {
    // Start webcam automatically on mount
    startCamera();

    // 1.5 second verification cadence (every 1500ms)
    intervalRef.current = setInterval(() => {
      captureAndVerifyFrame();
    }, 1500);

    // Dynamic FPS measurement loop via requestAnimationFrame
    let animId;
    const calcFps = (time) => {
      fpsCounterRef.current.frames++;
      if (time - fpsCounterRef.current.lastTime >= 1000) {
        setFps(Math.min(60, fpsCounterRef.current.frames));
        fpsCounterRef.current.frames = 0;
        fpsCounterRef.current.lastTime = time;
      }
      animId = requestAnimationFrame(calcFps);
    };
    animId = requestAnimationFrame(calcFps);

    // Component Cleanup on Unmount
    return () => {
      stopCamera();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // When switching simulator preset, trigger immediate verify
  useEffect(() => {
    if (useSimulator) {
      // Reset session to test consecutive effects cleanly
      sessionIdRef.current = `proctor_${Math.random().toString(36).substring(2, 9)}`;
      captureAndVerifyFrame();
    }
  }, [simPreset, useSimulator]);

  const isViolation = statusVerdict === 'VIOLATION';

  return (
    <div className={`space-y-6 ${standalone ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
      
      {/* 1. Header Banner & Cyber Command Ribbon */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-holoCard border border-holoBorder shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyanGlow/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center space-x-3.5 z-10">
          <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
            isViolation 
              ? 'bg-crimsonBlock/20 border-crimsonBlock/50 text-crimsonBlock shadow-crimson-sm'
              : 'bg-cyanGlow/10 border-cyanGlow/40 text-cyanGlow shadow-cyan-sm'
          }`}>
            <Camera className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-wider font-mono">
                AI WEBCAM PROCTOR <span className="text-cyanGlow">&amp; ANTI-CHEAT</span>
              </h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase border ${
                isViolation
                  ? 'bg-crimsonBlock/20 border-crimsonBlock text-crimsonBlock'
                  : 'bg-emeraldAllow/20 border-emeraldAllow text-emeraldAllow'
              }`}>
                {isViolation ? 'THREAT DETECTED' : 'LIVE MONITORING'}
              </span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              Haar biometric tracking • 2D Moiré Fourier analysis • CMOS thermal sensor noise verification
            </p>
          </div>
        </div>

        {/* Action Controls & Sound Toggle */}
        <div className="flex items-center space-x-2 z-10">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
              soundEnabled
                ? 'bg-cyanGlow/20 border-cyanGlow text-cyanGlow'
                : 'bg-holoSurface border-holoBorder text-gray-400 hover:text-white'
            }`}
            title="Toggle cyber alarm sound on violation"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'ALARM ON' : 'MUTED'}</span>
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
              isPaused 
                ? 'bg-amberWarn/20 border-amberWarn text-amberWarn' 
                : 'bg-holoSurface border-holoBorder text-gray-300 hover:text-white'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'RESUME' : 'FREEZE'}</span>
          </button>

          <button
            onClick={() => {
              if (useSimulator) {
                startCamera();
              } else {
                setUseSimulator(true);
              }
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
              useSimulator
                ? 'bg-purple-950/40 border-purple-500 text-purple-300 shadow-purple-sm'
                : 'bg-holoSurface border-holoBorder text-gray-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{useSimulator ? 'SIMULATOR ACTIVE' : 'TEST PRESETS'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Flashing Red Warning Banner (When Violation Triggered) */}
      <AnimatePresence>
        {isViolation && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-xl bg-gradient-to-r from-red-950/90 via-crimsonBlock/20 to-red-950/90 border-2 border-crimsonBlock shadow-crimson-glow flex items-center justify-between gap-4 animate-pulse"
          >
            <div className="flex items-center space-x-3 text-crimsonBlock">
              <div className="p-2 rounded-lg bg-crimsonBlock/20 border border-crimsonBlock">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-sm uppercase tracking-widest text-white">
                    VIOLATION DETECTED:
                  </span>
                  <span className="font-mono font-bold text-sm text-red-200 bg-crimsonBlock/40 px-2 py-0.5 rounded border border-crimsonBlock/60">
                    {activeViolation || 'SECURITY_POLICY_BREACH'}
                  </span>
                </div>
                <p className="text-xs font-mono text-red-200/90 mt-0.5">
                  {violationAlert || details[0] || 'Ingress optical monitor flagged an unauthorized exam anomaly.'}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-black/60 border border-crimsonBlock/50 text-crimsonBlock font-bold">
                RISK: {riskScore}%
              </span>
              <span className="px-2.5 py-1 rounded bg-black/60 border border-red-800 text-gray-300">
                STRIKE #{violationCount}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Stage: Futuristic HUD Video Container & Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center (8 cols): Futuristic HUD Webcam Container */}
        <div className="lg:col-span-8 space-y-4">
          <div className={`relative rounded-2xl bg-black border-2 overflow-hidden shadow-2xl transition-all ${
            isViolation 
              ? 'border-crimsonBlock shadow-crimson-glow' 
              : 'border-cyanGlow/50 shadow-cyan-glow'
          }`}>
            
            {/* Real Video Element */}
            {!useSimulator && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full aspect-[4/3] sm:aspect-video object-cover transition-opacity duration-300 ${
                  streamActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}

            {/* Fallback Simulator / Hidden Capture Canvas */}
            <canvas
              ref={hiddenCanvasRef}
              className={useSimulator ? 'w-full aspect-[4/3] sm:aspect-video object-cover block' : 'hidden'}
            />

            {/* Futuristic HUD Framing Brackets */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner reticles */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-cyanGlow" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-cyanGlow" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-cyanGlow" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-cyanGlow" />

              {/* Scanning laser beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyanGlow to-transparent opacity-80 animate-laser" />

              {/* CRT Scanline & grid overlay */}
              <div className="absolute inset-0 scanline-overlay opacity-40" />
              <div className="absolute inset-0 cyber-grid-dense opacity-20" />
            </div>

            {/* Top-Left HUD Info */}
            <div className="absolute top-4 left-4 z-20 flex flex-col space-y-1 text-[11px] font-mono pointer-events-none">
              <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-holoBorder">
                <span className={`w-2 h-2 rounded-full ${isViolation ? 'bg-crimsonBlock animate-ping' : 'bg-emeraldAllow animate-pulse'}`} />
                <span className="text-white font-bold tracking-wider">
                  NODE: TG-PROCTOR-CAM-01
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-cyanGlow">{fps} FPS</span>
              </div>
              <span className="text-[10px] text-gray-400 pl-1">
                {useSimulator ? `SIMULATED: ${simPreset.toUpperCase()}` : 'HARDWARE SENSOR: ACTIVE'}
              </span>
            </div>

            {/* Top-Right Corner Live Telemetry Stats */}
            <div className="absolute top-4 right-4 z-20 flex flex-col items-end space-y-1.5 text-xs font-mono pointer-events-none">
              
              {/* Status Badge */}
              <div className={`px-3 py-1 rounded-lg border backdrop-blur-md font-bold tracking-widest shadow-lg flex items-center space-x-1.5 ${
                isViolation
                  ? 'bg-crimsonBlock/30 border-crimsonBlock text-white shadow-crimson-sm'
                  : 'bg-emeraldAllow/20 border-emeraldAllow/60 text-emeraldAllow shadow-emerald-sm'
              }`}>
                {isViolation ? <XCircle className="w-3.5 h-3.5 text-crimsonBlock" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emeraldAllow" />}
                <span>{statusVerdict}</span>
              </div>

              {/* Risk Level Badge */}
              <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-holoBorder flex items-center space-x-2.5">
                <span className="text-gray-400 text-[10px] uppercase">Risk Level:</span>
                <div className="w-16 h-2 rounded-full bg-gray-800 overflow-hidden border border-gray-700">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      riskScore >= 70 ? 'bg-crimsonBlock' : riskScore >= 40 ? 'bg-amberWarn' : 'bg-emeraldAllow'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, riskScore))}%` }}
                  />
                </div>
                <span className={`font-bold text-xs ${
                  riskScore >= 70 ? 'text-crimsonBlock' : riskScore >= 40 ? 'text-amberWarn' : 'text-emeraldAllow'
                }`}>
                  {riskScore}%
                </span>
              </div>

              {/* Verification Latency */}
              <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-gray-400 border border-gray-800">
                Latency: <span className="text-cyanGlow">{pingLatency}ms</span> • Cadence: 1.5s
              </div>
            </div>

            {/* Active Facial Bounding Box HUD Reticles */}
            <div className="absolute inset-0 pointer-events-none">
              {faceCount > 0 ? (
                faces.map((f, idx) => {
                  const isPrimary = idx === 0 && faceCount === 1;
                  const isIntruder = idx > 0 || (isViolation && activeViolation === 'MULTIPLE_FACES_DETECTED');
                  
                  // Use relative percentages returned by backend Haar detection
                  const left = Math.max(2, Math.min(80, (f.rel_x || 0.35) * 100));
                  const top = Math.max(2, Math.min(80, (f.rel_y || 0.22) * 100));
                  const width = Math.max(15, Math.min(70, (f.rel_w || 0.30) * 100));
                  const height = Math.max(20, Math.min(70, (f.rel_h || 0.42) * 100));

                  return (
                    <motion.div
                      key={`face-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute border-2 transition-all duration-300"
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${width}%`,
                        height: `${height}%`,
                        borderColor: isIntruder ? '#EF4444' : '#00F0FF',
                        boxShadow: isIntruder 
                          ? '0 0 15px rgba(239, 68, 68, 0.6)' 
                          : '0 0 15px rgba(0, 240, 255, 0.4)'
                      }}
                    >
                      {/* Targeting Corner Brackets */}
                      <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                      <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />

                      {/* Header Tag */}
                      <div className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center space-x-1 uppercase tracking-wider text-black ${
                        isIntruder ? 'bg-crimsonBlock text-white' : 'bg-cyanGlow'
                      }`}>
                        <span>{isIntruder ? 'UNAUTHORIZED PERSON' : 'CANDIDATE_01'}</span>
                        <span>•</span>
                        <span>{isIntruder ? 'FLAGGED' : 'LOCK'}</span>
                      </div>

                      {/* Biometric crosshair center */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-40">
                        <div className="w-3 h-3 border border-white/60 rounded-full" />
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                /* No face detected: Pulsing search reticle */
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full border-2 border-dashed border-crimsonBlock/70 animate-pulse flex flex-col items-center justify-center p-4 bg-crimsonBlock/10 text-center">
                    <AlertTriangle className="w-8 h-8 text-crimsonBlock mb-2 animate-bounce" />
                    <span className="text-xs font-mono font-bold text-white tracking-widest">
                      TARGET LOST
                    </span>
                    <span className="text-[10px] font-mono text-red-300 mt-1">
                      NO CANDIDATE IN FRAME
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom HUD Telemetry Strip */}
            <div className="absolute bottom-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-holoBorder text-[11px] font-mono">
              <div className="flex flex-wrap items-center gap-3 text-gray-300">
                <span className="flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyanGlow" />
                  <span>Noise: <strong className="text-white">{telemetry.sensorNoise} σ</strong></span>
                </span>
                <span>•</span>
                <span>Moiré: <strong className={telemetry.moireIndex > 1.35 ? 'text-crimsonBlock' : 'text-emeraldAllow'}>{telemetry.moireIndex}</strong></span>
                <span>•</span>
                <span>Faces: <strong className={faceCount === 1 ? 'text-emeraldAllow' : 'text-crimsonBlock'}>{faceCount}</strong></span>
                <span>•</span>
                <span>Centered: <strong className={telemetry.isCentered ? 'text-emeraldAllow' : 'text-amberWarn'}>{telemetry.isCentered ? 'YES' : 'MARGINAL'}</strong></span>
              </div>

              {/* Anomaly Tags */}
              <div className="flex items-center space-x-1.5">
                {activeViolation ? (
                  <span className="px-2 py-0.5 rounded bg-crimsonBlock/30 border border-crimsonBlock text-white text-[10px] font-bold">
                    FLAG: {activeViolation}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-emeraldAllow/20 border border-emeraldAllow/50 text-emeraldAllow text-[10px] font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>OPTICAL INTEGRITY VERIFIED</span>
                  </span>
                )}
              </div>
            </div>

            {/* Permission Denied / Camera Off Overlay */}
            {!streamActive && !useSimulator && (
              <div className="absolute inset-0 bg-holoDark/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-30">
                <div className="p-4 rounded-2xl bg-holoCard border border-cyanGlow/30 text-cyanGlow">
                  <CameraOff className="w-10 h-10 animate-pulse" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-lg font-bold font-mono text-white">
                    Webcam Access Required
                  </h3>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    {errorMessage || 'TrustGuard AI requires webcam access for real-time exam biometric verification.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-cyanGlow text-black font-bold text-xs font-mono hover:brightness-110 transition-all shadow-cyan-sm"
                  >
                    Grant Webcam Access
                  </button>
                  <button
                    onClick={() => {
                      setUseSimulator(true);
                      setStreamActive(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-holoSurface border border-holoBorder text-gray-300 font-bold text-xs font-mono hover:text-white transition-all"
                  >
                    Use Simulation Mode
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Simulator Presets Bar (For instant testing without special props) */}
          <div className="p-4 rounded-xl bg-holoCard border border-holoBorder space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-300 font-bold flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyanGlow" />
                <span>Anti-Cheat Simulation Presets (Heuristic Test Harness):</span>
              </span>
              <span className="text-gray-500 text-[11px]">Click preset to verify backend detection</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                onClick={() => {
                  setUseSimulator(true);
                  setSimPreset('clean');
                }}
                className={`p-2 rounded-lg border text-left text-xs font-mono transition-all ${
                  useSimulator && simPreset === 'clean'
                    ? 'bg-emeraldAllow/20 border-emeraldAllow text-emeraldAllow shadow-emerald-sm'
                    : 'bg-holoSurface/60 border-holoBorder text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emeraldAllow" />
                  <span>1. Normal Clean</span>
                </div>
                <div className="text-[10px] text-gray-500 truncate mt-0.5">1 Centered Face</div>
              </button>

              <button
                onClick={() => {
                  setUseSimulator(true);
                  setSimPreset('no_face');
                }}
                className={`p-2 rounded-lg border text-left text-xs font-mono transition-all ${
                  useSimulator && simPreset === 'no_face'
                    ? 'bg-crimsonBlock/20 border-crimsonBlock text-crimsonBlock shadow-crimson-sm'
                    : 'bg-holoSurface/60 border-holoBorder text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center space-x-1">
                  <XCircle className="w-3 h-3 text-crimsonBlock" />
                  <span>2. Candidate Left</span>
                </div>
                <div className="text-[10px] text-gray-500 truncate mt-0.5">0 Faces Detected</div>
              </button>

              <button
                onClick={() => {
                  setUseSimulator(true);
                  setSimPreset('multiple_faces');
                }}
                className={`p-2 rounded-lg border text-left text-xs font-mono transition-all ${
                  useSimulator && simPreset === 'multiple_faces'
                    ? 'bg-crimsonBlock/20 border-crimsonBlock text-crimsonBlock shadow-crimson-sm'
                    : 'bg-holoSurface/60 border-holoBorder text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center space-x-1">
                  <Users className="w-3 h-3 text-crimsonBlock" />
                  <span>3. Multi Person</span>
                </div>
                <div className="text-[10px] text-gray-500 truncate mt-0.5">2 Concurrent Faces</div>
              </button>

              <button
                onClick={() => {
                  setUseSimulator(true);
                  setSimPreset('screen_replay');
                }}
                className={`p-2 rounded-lg border text-left text-xs font-mono transition-all ${
                  useSimulator && simPreset === 'screen_replay'
                    ? 'bg-crimsonBlock/20 border-crimsonBlock text-crimsonBlock shadow-crimson-sm'
                    : 'bg-holoSurface/60 border-holoBorder text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center space-x-1">
                  <Monitor className="w-3 h-3 text-crimsonBlock" />
                  <span>4. Screen Replay</span>
                </div>
                <div className="text-[10px] text-gray-500 truncate mt-0.5">Moiré &amp; Monitor Bezels</div>
              </button>

              <button
                onClick={() => {
                  setUseSimulator(true);
                  setSimPreset('virtual_loop');
                }}
                className={`p-2 rounded-lg border text-left text-xs font-mono transition-all ${
                  useSimulator && simPreset === 'virtual_loop'
                    ? 'bg-crimsonBlock/20 border-crimsonBlock text-crimsonBlock shadow-crimson-sm'
                    : 'bg-holoSurface/60 border-holoBorder text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center space-x-1">
                  <Copy className="w-3 h-3 text-crimsonBlock" />
                  <span>5. Virtual Loop</span>
                </div>
                <div className="text-[10px] text-gray-500 truncate mt-0.5">Identical Hash / Freeze</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Forensic Inspection Telemetry & Audit Stream */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Diagnostic Inspection Summary Card */}
          <div className="p-5 rounded-2xl bg-holoCard border border-holoBorder space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-holoBorder pb-3 text-xs font-mono">
              <span className="text-cyanGlow font-bold flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>ACTIVE HEURISTIC STATUS</span>
              </span>
              <span className="text-gray-400 font-bold">
                TOTAL: {totalInspections} FRAMES
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              {/* Check 1: Face Count */}
              <div className="p-2.5 rounded-xl bg-holoSurface/80 border border-holoBorder flex items-center justify-between">
                <span className="text-gray-300">Haar Face Count:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  faceCount === 1 ? 'bg-emeraldAllow/20 text-emeraldAllow' : 'bg-crimsonBlock/20 text-crimsonBlock'
                }`}>
                  {faceCount === 1 ? '1 Face (Pass)' : `${faceCount} Faces (${activeViolation || 'Anomaly'})`}
                </span>
              </div>

              {/* Check 2: Optical Sensor Noise */}
              <div className="p-2.5 rounded-xl bg-holoSurface/80 border border-holoBorder flex items-center justify-between">
                <span className="text-gray-300">CMOS Sensor Noise (σ):</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  telemetry.sensorNoise >= 0.35 ? 'text-emeraldAllow' : 'text-crimsonBlock bg-crimsonBlock/20'
                }`}>
                  {telemetry.sensorNoise} σ ({telemetry.sensorNoise >= 0.35 ? 'Natural' : 'Frozen / Replay'})
                </span>
              </div>

              {/* Check 3: Moiré Interference */}
              <div className="p-2.5 rounded-xl bg-holoSurface/80 border border-holoBorder flex items-center justify-between">
                <span className="text-gray-300">Moiré Harmonic Peak:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  telemetry.moireIndex <= 1.35 ? 'text-emeraldAllow' : 'text-crimsonBlock bg-crimsonBlock/20'
                }`}>
                  {telemetry.moireIndex} ({telemetry.moireIndex <= 1.35 ? 'Normal Lens' : 'Monitor Screen'})
                </span>
              </div>

              {/* Check 4: Biometric Centering */}
              <div className="p-2.5 rounded-xl bg-holoSurface/80 border border-holoBorder flex items-center justify-between">
                <span className="text-gray-300">Biometric Centering:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  telemetry.isCentered ? 'text-emeraldAllow' : 'text-amberWarn'
                }`}>
                  {telemetry.isCentered ? 'Centered (Nominal)' : 'Off-Axis'}
                </span>
              </div>
            </div>

            {/* Explanatory Details List */}
            <div className="p-3 rounded-xl bg-black/60 border border-holoBorder text-[11px] font-mono space-y-1.5 text-gray-300">
              <span className="text-cyanGlow font-bold block mb-1">
                Optical Assessment Details:
              </span>
              {details.map((d, i) => (
                <div key={i} className="flex items-start space-x-1.5 text-gray-300">
                  <span className={isViolation ? 'text-crimsonBlock' : 'text-emeraldAllow'}>•</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Forensic Log Tape */}
          <div className="p-5 rounded-2xl bg-holoCard border border-holoBorder space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white font-bold flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyanGlow" />
                <span>PROCTOR EVENT STREAM</span>
              </span>
              <span className="text-[10px] text-gray-500">Live 1.5s Loop</span>
            </div>

            <div className="h-56 overflow-y-auto space-y-1.5 pr-1 font-mono text-[10px]">
              {auditLog.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-2 rounded-lg border transition-all ${
                    log.status === 'VIOLATION'
                      ? 'bg-crimsonBlock/10 border-crimsonBlock/40 text-red-200'
                      : 'bg-holoSurface/40 border-holoBorder text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] text-gray-400 mb-0.5">
                    <span>{log.timestamp}</span>
                    <span className={`font-bold ${log.status === 'VIOLATION' ? 'text-crimsonBlock' : 'text-emeraldAllow'}`}>
                      {log.status} • Risk: {log.score}%
                    </span>
                  </div>
                  <p className="truncate">{log.event}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
