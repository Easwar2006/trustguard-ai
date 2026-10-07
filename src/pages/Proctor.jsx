import React from 'react';
import LiveProctorHUD from '../components/LiveProctorHUD';
import { ShieldCheck, Eye, Lock, Camera, Cpu, Terminal } from 'lucide-react';

export default function Proctor() {
  return (
    <div className="min-h-screen bg-[#09071E] text-slate-100 cyber-grid py-6 sm:py-8">
      {/* HUD Proctor Container */}
      <LiveProctorHUD standalone={true} />

      {/* Cyber Forensic Technical Architecture Specs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="p-6 rounded-2xl bg-holoCard border border-holoBorder shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-holoBorder pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-cyanGlow/10 border border-cyanGlow/40 text-cyanGlow">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                  Real-Time Biometric & Anti-Cheat Pipeline Architecture
                </h2>
                <p className="text-xs font-mono text-gray-400">
                  Sub-50ms heuristic decision tree enforcing proctoring integrity across high-stakes exams
                </p>
              </div>
            </div>

            <span className="hidden sm:inline px-3 py-1 rounded-full bg-emeraldAllow/10 border border-emeraldAllow/40 text-emeraldAllow font-mono text-[11px] font-bold">
              HEURISTIC ENGINE: ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            {/* Box 1 */}
            <div className="p-4 rounded-xl bg-holoSurface/60 border border-holoBorder space-y-2">
              <div className="flex items-center space-x-2 text-cyanGlow font-bold">
                <Eye className="w-4 h-4" />
                <span>1. Haar Face Tracking</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                OpenCV Haar Cascade evaluates frontal facial geometry every 1.5s. Flags candidate absence (&lt;1) or unauthorized assistance (&gt;1).
              </p>
              <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-800">
                Risk Penalty: <span className="text-crimsonBlock font-bold">85 - 95%</span>
              </div>
            </div>

            {/* Box 2 */}
            <div className="p-4 rounded-xl bg-holoSurface/60 border border-holoBorder space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>2. Moiré Frequency FFT</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                2D Fast Fourier Transform analyzes subpixel interference fringes and periodic scanlines generated when filming secondary screens or phones.
              </p>
              <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-800">
                Risk Penalty: <span className="text-crimsonBlock font-bold">92% Block</span>
              </div>
            </div>

            {/* Box 3 */}
            <div className="p-4 rounded-xl bg-holoSurface/60 border border-holoBorder space-y-2">
              <div className="flex items-center space-x-2 text-amberWarn font-bold">
                <Lock className="w-4 h-4" />
                <span>3. Virtual Cam Loop</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Perceptual hash hamming distance and Gaussian noise residuals isolate frozen photographs or pre-recorded OBS video loop replays.
              </p>
              <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-800">
                Risk Penalty: <span className="text-crimsonBlock font-bold">90% Block</span>
              </div>
            </div>

            {/* Box 4 */}
            <div className="p-4 rounded-xl bg-holoSurface/60 border border-holoBorder space-y-2">
              <div className="flex items-center space-x-2 text-emeraldAllow font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>4. Authentic Baseline</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Single face centered within optimal reticle bounds exhibiting organic CMOS thermal noise patterns and natural micro-saccades.
              </p>
              <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-800">
                Baseline Risk: <span className="text-emeraldAllow font-bold">8% Nominal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
