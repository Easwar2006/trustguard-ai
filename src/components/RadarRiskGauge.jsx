import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Lock, Share2, Ban } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RadarRiskGauge({ 
  riskScore = 86, 
  riskLevel = 'HIGH', 
  policyVerdict = 'Blocked at Ingress',
  allowSharing = false,
  size = 280
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Smooth count-up animation
  useEffect(() => {
    let start = 0;
    const end = riskScore;
    const duration = 1500;
    const intervalTime = 20;
    const increment = end / (duration / intervalTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [riskScore]);

  // SVG Geometry Calculation
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Let's use 270 degree arc gauge or full circle with gap
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine colors based on tri-tier policy
  let themeColor = '#EF4444'; // Crimson
  let glowColor = 'rgba(239, 68, 68, 0.4)';
  let bgArcColor = 'rgba(239, 68, 68, 0.15)';
  let tierLabel = 'HIGH RISK';
  let tierBadgeClass = 'bg-red-950/80 text-red-400 border-red-500/50 shadow-crimson-sm';

  if (riskScore < 40) {
    themeColor = '#10B981'; // Emerald
    glowColor = 'rgba(16, 185, 129, 0.3)';
    bgArcColor = 'rgba(16, 185, 129, 0.15)';
    tierLabel = 'LOW RISK';
    tierBadgeClass = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50';
  } else if (riskScore < 70) {
    themeColor = '#F59E0B'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.35)';
    bgArcColor = 'rgba(245, 158, 11, 0.15)';
    tierLabel = 'MEDIUM RISK';
    tierBadgeClass = 'bg-amber-950/80 text-amber-400 border-amber-500/50';
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-obsidian-card rounded-2xl border border-gray-800 shadow-hud overflow-hidden">
      
      {/* Background Radar concentric rings */}
      <div className="absolute inset-0 cyber-dots opacity-20 pointer-events-none" />

      {/* Pulsing shockwave halo behind gauge */}
      <div 
        className="absolute w-[240px] h-[240px] rounded-full animate-shockwave pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Outer Radar Sweeping Blade */}
      <div className="absolute w-[270px] h-[270px] rounded-full border border-gray-800/60 pointer-events-none flex items-center justify-center">
        <div className="w-full h-full rounded-full animate-radar opacity-25"
             style={{
               background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${themeColor} 360deg)`
             }}
        />
      </div>

      {/* Radial SVG Gauge Container */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90"
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#111827"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Secondary tick-mark ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - 12}
            stroke="#1F2937"
            strokeWidth="1.5"
            strokeDasharray="3 6"
            fill="transparent"
          />

          {/* Animated active progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={themeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 10px ${themeColor})`,
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </svg>

        {/* Center Telemetry Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="text-[11px] font-mono tracking-widest text-gray-400 uppercase">
            Aggregated Risk
          </span>
          
          <div className="flex items-baseline justify-center">
            <span 
              className="text-5xl font-black font-mono tracking-tight"
              style={{ color: themeColor, textShadow: `0 0 20px ${glowColor}` }}
            >
              {animatedScore}
            </span>
            <span className="text-xl font-bold font-mono ml-0.5 text-gray-400">%</span>
          </div>

          <span className={`mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${tierBadgeClass}`}>
            {tierLabel} ({riskScore}%)
          </span>
        </div>
      </div>

      {/* Tri-tier Policy Enforcement Verdict Badges */}
      <div className="mt-5 w-full space-y-3">
        
        {/* Active Policy Action Badge */}
        <div className={`flex items-center justify-between p-3 rounded-xl border ${
          riskScore >= 70 
            ? 'bg-red-950/40 border-red-500/50 shadow-crimson-sm' 
            : riskScore >= 40 
              ? 'bg-amber-950/40 border-amber-500/40' 
              : 'bg-emerald-950/40 border-emerald-500/40'
        }`}>
          <div className="flex items-center space-x-2.5">
            {riskScore >= 70 ? (
              <div className="p-1.5 rounded-lg bg-red-900/60 border border-red-500 text-red-400">
                <Ban className="w-4 h-4 animate-pulse" />
              </div>
            ) : riskScore >= 40 ? (
              <div className="p-1.5 rounded-lg bg-amber-900/60 border border-amber-500 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-500 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Enforcement Verdict</div>
              <div className={`text-sm font-bold font-mono ${
                riskScore >= 70 ? 'text-red-400' : riskScore >= 40 ? 'text-amber-300' : 'text-emerald-400'
              }`}>
                {policyVerdict}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-400 block">THRESHOLD</span>
            <span className="text-xs font-mono font-bold text-gray-200">
              {riskScore >= 70 ? '≥ 70% (Tier 3)' : riskScore >= 40 ? '40-69% (Tier 2)' : '< 40% (Tier 1)'}
            </span>
          </div>
        </div>

        {/* Sharing State Banner */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/70 border border-gray-800 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Share2 className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-400">Downstream Sharing:</span>
          </div>
          {allowSharing ? (
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span>UNRESTRICTED</span>
            </span>
          ) : (
            <span className="text-red-400 font-bold flex items-center space-x-1">
              <Lock className="w-3 h-3 text-red-400 inline" />
              <span>REVOKED & QUARANTINED</span>
            </span>
          )}
        </div>

      </div>

    </div>
  );
}
