import React from 'react';
import { Link } from 'react-router-dom';
import HoloSphereHero from '../components/HoloSphereHero';
import ThreatVectorCards from '../components/ThreatVectorCards';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Terminal, 
  Lock, 
  Activity, 
  ArrowRight,
  Info,
  Radio,
  Clock,
  Layers,
  Camera
} from 'lucide-react';
import { INCIDENT_DATA } from '../data/demoData';

export default function Home() {
  const liveIncidents = [
    {
      id: "TG-2026-9041X",
      type: "CEO Synthetic Video Deepfake",
      vector: "Temporal Video (82%)",
      status: "BLOCKED AT INGRESS",
      time: "Just now",
      risk: 86
    },
    {
      id: "TG-2026-9040A",
      type: "Voice Cloned Audio Wire Instruction",
      vector: "Voice Synthesis (76%)",
      status: "BLOCKED AT INGRESS",
      time: "12m ago",
      risk: 79
    },
    {
      id: "TG-2026-9039F",
      type: "Executive Impersonation SMS Paylink",
      vector: "Phishing / Lexical (91%)",
      status: "BLOCKED AT INGRESS",
      time: "38m ago",
      risk: 91
    },
    {
      id: "TG-2026-9038C",
      type: "Supplier Billing Statement PDF",
      vector: "Document Scan (12%)",
      status: "ALLOWED / PASSED",
      time: "1h 14m ago",
      risk: 12
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* 3D Holographic Sphere Hero Component */}
      <HoloSphereHero />

      {/* Live Webcam Proctor Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-holoCard via-cyan-950/30 to-holoCard border border-cyanGlow/40 shadow-cyan-glow flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-cyanGlow/10 border border-cyanGlow/50 flex items-center justify-center text-cyanGlow shadow-cyan-sm shrink-0">
              <Camera className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase bg-cyanGlow/20 text-cyanGlow border border-cyanGlow/40">
                  NEW CAPABILITY
                </span>
                <span className="text-white font-mono font-bold text-base">
                  Live Webcam Proctor &amp; AI Anti-Cheat Monitor
                </span>
              </div>
              <p className="text-xs font-mono text-gray-400 mt-1 max-w-2xl">
                Continuous real-time candidate verification with Haar face tracking, 2D Moiré Fourier screen replay detection, and CMOS thermal noise validation.
              </p>
            </div>
          </div>

          <Link
            to="/proctor"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-cyanGlow hover:bg-cyanGlow/90 text-black font-mono font-bold text-xs flex items-center space-x-2 transition-all shadow-cyan-sm hover:scale-105"
          >
            <span>Launch Live Proctor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4-Card Threat Vector Cards Section */}
      <ThreatVectorCards />

      {/* Live Containment Feed & Policy Architecture Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Live Ingress Quarantine Stream (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-holoCard border border-holoBorder shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-holoBorder">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-cyanGlow" />
                <h3 className="font-mono font-bold text-white text-base">
                  Live Platform Ingress Quarantine Stream
                </h3>
              </div>
              <span className="flex items-center space-x-1.5 text-xs font-mono text-emeraldAllow">
                <span className="w-2 h-2 rounded-full bg-emeraldAllow animate-ping" />
                <span>ACTIVE MONITOR</span>
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {liveIncidents.map((inc) => {
                const isBlocked = inc.status.includes('BLOCK');
                return (
                  <div
                    key={inc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-holoSurface/80 border border-holoBorder hover:border-gray-600 transition-colors gap-2"
                  >
                    <div className="flex items-start sm:items-center space-x-3">
                      <span className="font-bold text-cyanGlow">{inc.id}</span>
                      <div>
                        <div className="font-semibold text-gray-200">{inc.type}</div>
                        <div className="text-[11px] text-gray-400">
                          {inc.vector} • <span className="text-gray-500">{inc.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <span className={`font-extrabold ${isBlocked ? 'text-crimsonBlock' : 'text-emeraldAllow'}`}>
                        {inc.risk}%
                      </span>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                        isBlocked
                          ? 'bg-crimsonBlock/20 border-crimsonBlock/50 text-crimsonBlock'
                          : 'bg-emeraldAllow/20 border-emeraldAllow/50 text-emeraldAllow'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tri-Tier Enforcement Overview (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-holoCard border border-holoBorder shadow-2xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 pb-3 border-b border-holoBorder">
                <Lock className="w-4 h-4 text-crimsonBlock" />
                <h3 className="font-mono font-bold text-white text-base">
                  Enforcement Thresholds
                </h3>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-emeraldAllow/10 border border-emeraldAllow/30">
                  <div className="flex justify-between font-bold text-emeraldAllow">
                    <span>0% – 39%</span>
                    <span>PASS / ALLOW</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-sans">
                    Media passes autonomous validation without quarantine.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amberWarn/10 border border-amberWarn/30">
                  <div className="flex justify-between font-bold text-amberWarn">
                    <span>40% – 69%</span>
                    <span>WARN & CHALLENGE</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-sans">
                    Flagged for secondary biometric or out-of-band auth.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-crimsonBlock/15 border border-crimsonBlock/40 shadow-crimson-sm">
                  <div className="flex justify-between font-bold text-crimsonBlock">
                    <span>70% – 100%</span>
                    <span>AUTONOMOUS BLOCK</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 font-sans">
                    Zero-trust ingress severance. Payloads quarantined instantly.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/results"
              className="mt-4 w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-holoSurface hover:bg-holoSurface/80 border border-holoBorder text-cyanGlow font-mono text-xs transition-colors"
            >
              <span>Examine Current Specimen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Architecture Limitations Disclaimer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-holoSurface/60 border border-holoBorder p-4 sm:p-5 flex items-start space-x-3.5">
          <div className="p-2 rounded-lg bg-amberWarn/15 text-amberWarn border border-amberWarn/30 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-gray-200 uppercase tracking-wider">
              OPERATIONAL FORENSIC NOTICE & ARCHITECTURE SCOPE
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Autonomous containment applies to controlled platform ingress; encrypted channels cannot be directly intercepted.
              TrustGuard AI operates at API gateways, enterprise file ingestion points, CDN perimeter webhooks, and telecommunications ingress gateways.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
