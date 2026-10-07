import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, 
  AlertTriangle, 
  Layers, 
  Maximize2, 
  Eye, 
  CheckCircle2, 
  Play, 
  Pause,
  Scan
} from 'lucide-react';

export default function VideoLaserScanner() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState(3); // default to F13 (compromised frame)

  // 8 Keyframe buckets representing 32 frames (F1, F5, F9, F13, F17, F21, F25, F29)
  const buckets = [
    { label: "F1", frameRange: "01-04", status: "nominal", risk: 24, artifact: "Clear" },
    { label: "F5", frameRange: "05-08", status: "nominal", risk: 31, artifact: "Clear" },
    { label: "F9", frameRange: "09-12", status: "anomaly", risk: 68, artifact: "Auricular Jitter" },
    { label: "F13", frameRange: "13-16", status: "breached", risk: 89, artifact: "Jawline Warping" },
    { label: "F17", frameRange: "17-20", status: "breached", risk: 94, artifact: "Texture Smearing" },
    { label: "F21", frameRange: "21-24", status: "anomaly", risk: 73, artifact: "Eye Blinking Lag" },
    { label: "F25", frameRange: "25-28", status: "nominal", risk: 42, artifact: "Clear" },
    { label: "F29", frameRange: "29-32", status: "nominal", risk: 28, artifact: "Clear" }
  ];

  return (
    <div className="rounded-xl overflow-hidden bg-holoCard border border-holoBorder shadow-2xl flex flex-col">
      
      {/* Top HUD overlay */}
      <div className="px-4 py-3 bg-holoSurface/90 border-b border-holoBorder flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyanGlow/10 border border-cyanGlow/40">
            <Radar className="w-4 h-4 text-cyanGlow animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center space-x-2">
              <span>TEMPORAL FRAME EXTRACTION (32 FRAMES)</span>
              <span className="px-1.5 py-0.2 rounded bg-cyanGlow/20 text-cyanGlow text-[10px]">TimeSformer-v1</span>
            </div>
            <div className="text-[11px] font-mono text-gray-400">
              Bi-directional attention matrix • 60 FPS interpolation
            </div>
          </div>
        </div>

        {/* Warping detected alert badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-crimsonBlock/20 border border-crimsonBlock/60 text-crimsonBlock">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">
            WARPING DETECTED
          </span>
        </div>
      </div>

      {/* Dark video canvas viewport (h-64) with continuous cyan laser scanline sweeping */}
      <div className="relative h-64 bg-[#050414] overflow-hidden flex items-center justify-center group select-none">
        
        {/* Holographic matrix background grid inside viewport */}
        <div className="absolute inset-0 cyber-grid-dense opacity-40 pointer-events-none" />
        <div className="absolute inset-0 scanline-overlay opacity-50 pointer-events-none" />

        {/* Simulated forensic facial mesh / suspect specimen illustration */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="relative w-48 h-48 rounded-full border border-cyanGlow/20 flex items-center justify-center">
            {/* Target crosshairs */}
            <div className="absolute inset-0 border-t border-b border-dashed border-cyanGlow/30" />
            <div className="absolute inset-0 border-l border-r border-dashed border-cyanGlow/30" />

            {/* Neural facial contour mesh illustration */}
            <svg className="w-40 h-40 text-cyanGlow/60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
              {/* Face contour */}
              <ellipse cx="50" cy="50" rx="34" ry="42" stroke="rgba(0, 240, 255, 0.4)" strokeDasharray="2 2" />
              {/* Eye regions */}
              <circle cx="36" cy="42" r="5" stroke="rgba(0, 240, 255, 0.7)" />
              <circle cx="64" cy="42" r="5" stroke="rgba(0, 240, 255, 0.7)" />
              {/* Nose bridge */}
              <line x1="50" y1="38" x2="50" y2="54" stroke="rgba(0, 240, 255, 0.5)" />
              {/* Mouth line */}
              <path d="M 38 66 Q 50 72 62 66" stroke="rgba(0, 240, 255, 0.7)" />
              
              {/* Warping anomaly highlighted in crimson */}
              <path 
                d="M 28 62 Q 22 75 38 84" 
                stroke="#EF4444" 
                strokeWidth="2.5"
                strokeDasharray="4 2" 
                className="animate-pulse"
              />
              <circle cx="28" cy="74" r="7" stroke="#EF4444" strokeWidth="1.2" fill="rgba(239, 68, 68, 0.2)" />
            </svg>

            {/* Anomaly annotation box */}
            <div className="absolute -bottom-2 -left-6 bg-crimsonBlock/90 backdrop-blur-md px-2.5 py-1 rounded border border-crimsonBlock text-[10px] font-mono text-white shadow-crimson-sm animate-pulse">
              JAW WARP: 89% Conf.
            </div>

            {/* Auricular edge anomaly */}
            <div className="absolute -top-1 -right-8 bg-amberWarn/90 backdrop-blur-md px-2.5 py-1 rounded border border-amberWarn text-[10px] font-mono text-black font-bold shadow-md">
              EAR EDGE: 73%
            </div>
          </div>
        </div>

        {/* Continuous Framer Motion vertical cyan laser scanline sweeping: y: [0, 220, 0] */}
        {isPlaying && (
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyanGlow to-transparent shadow-[0_0_15px_#00F0FF] z-20 pointer-events-none"
            animate={{
              y: [0, 220, 0]
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}

        {/* Viewport controls overlay */}
        <div className="absolute bottom-3 right-3 z-30 flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-holoDark/80 hover:bg-holoSurface border border-holoBorder text-cyanGlow transition-colors"
            title={isPlaying ? "Pause Laser Scanner" : "Resume Laser Scanner"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <div className="px-2 py-1 rounded bg-holoDark/80 border border-holoBorder text-[10px] font-mono text-gray-300">
            {isPlaying ? "SCANNING ACTIVE" : "PAUSED"}
          </div>
        </div>

      </div>

      {/* Bottom 32-frame timeline strip: 8 grid blocks (F1, F5, F9... F29) with alternating status */}
      <div className="p-4 bg-holoCard/95 border-t border-holoBorder">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
          <span className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-cyanGlow" />
            <span className="text-gray-300 font-semibold">32-FRAME TEMPORAL DISSECTION BUCKETS</span>
          </span>
          <span className="text-[11px] text-gray-500">Click bucket to inspect localized warping</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {buckets.map((b, idx) => {
            const isSelected = selectedBucket === idx;
            const isBreached = b.status === "breached";
            const isAnomaly = b.status === "anomaly";

            return (
              <button
                key={b.label}
                onClick={() => setSelectedBucket(idx)}
                className={`flex flex-col items-center justify-between p-2 rounded-lg border font-mono text-xs transition-all ${
                  isSelected 
                    ? 'ring-2 ring-cyanGlow' 
                    : 'hover:border-gray-500'
                } ${
                  isBreached
                    ? 'bg-crimsonBlock/15 border-crimsonBlock/60 text-crimsonBlock shadow-crimson-sm'
                    : isAnomaly
                    ? 'bg-amberWarn/15 border-amberWarn/60 text-amberWarn'
                    : 'bg-holoSurface border-holoBorder text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px]">
                  <span className="font-bold">{b.label}</span>
                  {/* Blinking indicator light */}
                  <span className={`w-2 h-2 rounded-full ${
                    isBreached 
                      ? 'bg-crimsonBlock animate-ping' 
                      : isAnomaly 
                      ? 'bg-amberWarn animate-pulse' 
                      : 'bg-cyanGlow/60'
                  }`} />
                </div>
                <div className="text-[10px] text-gray-400 my-1">
                  {b.frameRange}
                </div>
                <div className={`text-[11px] font-bold ${
                  isBreached ? 'text-crimsonBlock' : isAnomaly ? 'text-amberWarn' : 'text-emeraldAllow'
                }`}>
                  {b.risk}%
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Bucket Details Banner */}
        <div className="mt-3 px-3 py-2 rounded-lg bg-holoSurface border border-holoBorder flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Selected:</span>
            <span className="text-cyanGlow font-bold">{buckets[selectedBucket].label} (Frames {buckets[selectedBucket].frameRange})</span>
            <span className="text-gray-500">•</span>
            <span className={buckets[selectedBucket].status === 'breached' ? 'text-crimsonBlock font-bold' : 'text-gray-300'}>
              {buckets[selectedBucket].artifact}
            </span>
          </div>
          <span className="text-gray-400">Risk Confidence: <strong className="text-white">{buckets[selectedBucket].risk}%</strong></span>
        </div>

      </div>

    </div>
  );
}
