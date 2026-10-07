import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  FileText,
  Database,
  Lock,
  Fingerprint,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Cpu,
  Sparkles,
  Server,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { DEFAULT_INCIDENT } from '../data/demoData';

export default function Results(props) {
  const navigate = useNavigate();
  const location = useLocation();

  // Support props and location.state parsing seamlessly
  const data =
    props?.incidentData ||
    props?.incident ||
    props?.data ||
    location.state?.incidentData ||
    location.state?.incident ||
    location.state ||
    DEFAULT_INCIDENT;

  // Determine overall risk score
  const overallRisk = Number(
    data.overallRisk !== undefined
      ? data.overallRisk
      : data.overall_risk !== undefined
      ? data.overall_risk
      : 82
  );

  // Accordion state for Technical Audit Data
  const [showTechnicalAudit, setShowTechnicalAudit] = useState(false);

  // Copy-to-clipboard state
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Top Verdict Banner config based on overallRisk
  let verdict;
  if (overallRisk >= 70) {
    verdict = {
      badge: "🚫 HIGH-RISK FAKE DETECTED — BLOCKED AT INGRESS",
      subtitle: "TrustGuard AI intercepted this content. It has been quarantined and denied platform distribution.",
      bgGradient: "bg-gradient-to-r from-red-950/70 to-slate-900",
      borderColor: "border-red-500/50",
      badgeClass: "bg-red-500/20 text-red-400 border border-red-500/40",
      glowClass: "shadow-crimson-glow",
      ringColor: "#EF4444",
      riskLevel: "HIGH",
      actionText: "BLOCKED & QUARANTINED",
      actionSubtitle: "Status: Quarantined to Vault #941X",
      actionIcon: ShieldAlert,
      actionIconColor: "text-red-400"
    };
  } else if (overallRisk >= 40) {
    verdict = {
      badge: "⚠️ SUSPICIOUS MEDIA — FLAGGED FOR REVIEW",
      subtitle: "Synthetic indicators detected. Requires manual security clearance.",
      bgGradient: "bg-gradient-to-r from-amber-950/70 to-slate-900",
      borderColor: "border-amber-500/50",
      badgeClass: "bg-amber-500/20 text-amber-400 border border-amber-500/40",
      glowClass: "shadow-[0_0_25px_-3px_rgba(245,158,11,0.45)]",
      ringColor: "#F59E0B",
      riskLevel: "MEDIUM",
      actionText: "FLAGGED FOR REVIEW",
      actionSubtitle: "Status: Quarantined pending clearance",
      actionIcon: AlertTriangle,
      actionIconColor: "text-amber-400"
    };
  } else {
    verdict = {
      badge: "✅ VERIFIED AUTHENTIC — INGRESS PASSED",
      subtitle: "No synthetic or manipulative artifacts found. Content cleared for ingress.",
      bgGradient: "bg-gradient-to-r from-emerald-950/70 to-slate-900",
      borderColor: "border-emerald-500/50",
      badgeClass: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
      glowClass: "shadow-[0_0_25px_-3px_rgba(16,185,129,0.45)]",
      ringColor: "#10B981",
      riskLevel: "LOW",
      actionText: "INGRESS PASSED",
      actionSubtitle: "Status: Cleared for platform distribution",
      actionIcon: ShieldCheck,
      actionIconColor: "text-emerald-400"
    };
  }

  // Active Inspection Vector details
  const primarySubScore = data.subScores?.[0];
  const testedModality =
    primarySubScore?.vector ||
    primarySubScore?.vector_name ||
    (data.selectedModality === 'video'
      ? 'Video & Temporal Deepfake'
      : data.selectedModality === 'audio'
      ? 'Voice Synthesis'
      : data.selectedModality === 'text'
      ? 'Phishing / Lexical'
      : data.selectedModality === 'doc' || data.selectedModality === 'image_doc' || data.selectedModality === 'image'
      ? 'Document / Image Forgery'
      : 'Video & Temporal Deepfake');

  const rawCheckpoint = primarySubScore?.checkpoint || 'trustguard/timesformer-deepfake-v1';
  const modelName = rawCheckpoint.includes('/') ? rawCheckpoint.split('/')[1] : rawCheckpoint;
  const latency = primarySubScore?.latency || '142ms';

  // Human-readable forensic explanation
  const defaultForensicExplanation =
    "High-frequency texture warping along jawline contour across 32 consecutive frames. The biometric patterns do not match authentic natural recording dynamics.";
  
  const rawForensicExplanation =
    data.forensicSummary ||
    (primarySubScore?.details
      ? primarySubScore.details.includes("biometric patterns")
        ? primarySubScore.details
        : `${primarySubScore.details} The biometric patterns do not match authentic natural recording dynamics.`
      : defaultForensicExplanation);

  // Clean duplicate "What our models found: " prefix if present in the explanation string
  const cleanForensicExplanation = rawForensicExplanation.replace(/^What our models found:\s*/i, '');

  // Technical audit fields
  const specimenId = data.incidentId || 'TG-2026-9041X';
  const pHash = data.pHash || data.phash || 'pHash: 8f3a91bc7d20';
  const vaultLocation = data.vaultLocation || 'evidence-vault/specimen';
  const databaseStatus = 'Connected to Supabase (public.incidents)';

  // SVG Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallRisk / 100) * circumference;

  const ActionIcon = verdict.actionIcon;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8">

      {/* 1. Top Verdict Banner */}
      <motion.section
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`rounded-2xl ${verdict.bgGradient} border-2 ${verdict.borderColor} ${verdict.glowClass} p-6 sm:p-7 backdrop-blur-md relative overflow-hidden`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            {/* Large Badge */}
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold tracking-wide shadow-sm">
              <span className={`px-3 py-1 rounded-full ${verdict.badgeClass}`}>
                {verdict.badge}
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-200 font-sans font-medium leading-relaxed max-w-2xl">
              {verdict.subtitle}
            </p>
          </div>

          {/* Quick Telemetry Pill */}
          <div className="flex items-center space-x-2 shrink-0 font-mono text-xs self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-lg bg-black/50 border border-gray-700/60 text-gray-300">
              Specimen: <strong className="text-white">{specimenId}</strong>
            </span>
          </div>
        </div>
      </motion.section>

      {/* 2. 3-Column Executive Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Card 1: Threat Score */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl bg-holoCard border border-holoBorder p-6 shadow-xl flex flex-col items-center justify-between relative overflow-hidden text-center group hover:border-gray-600 transition-colors"
        >
          <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">
            Threat Score
          </div>

          {/* Circular Ring Meter */}
          <div className="relative flex items-center justify-center w-28 h-28 my-1">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#1F2937"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                stroke={verdict.ringColor}
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{
                  filter: `drop-shadow(0 0 8px ${verdict.ringColor}aa)`
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono tracking-tight text-white">
                {overallRisk}%
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <div className="mt-3 text-xs font-mono font-bold uppercase tracking-wider" style={{ color: verdict.ringColor }}>
            Adversarial Risk Level: {verdict.riskLevel}
          </div>
        </motion.div>

        {/* Card 2: Ingress Action */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl bg-holoCard border border-holoBorder p-6 shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden group hover:border-gray-600 transition-colors"
        >
          <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">
            Ingress Action
          </div>

          <div className="my-auto flex flex-col items-center justify-center space-y-2.5">
            <div className={`p-3.5 rounded-2xl bg-holoSurface border border-holoBorder shadow-inner ${verdict.actionIconColor}`}>
              <ActionIcon className="w-8 h-8" />
            </div>
            <div className="text-lg font-black text-white font-mono tracking-tight">
              {verdict.actionText}
            </div>
          </div>

          {/* Subtitle */}
          <div className="mt-3 text-xs font-mono text-gray-400">
            {verdict.actionSubtitle}
          </div>
        </motion.div>

        {/* Card 3: Active Inspection Vector */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-2xl bg-holoCard border border-holoBorder p-6 shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden group hover:border-gray-600 transition-colors"
        >
          <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">
            Active Inspection Vector
          </div>

          <div className="my-auto flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-xl bg-holoSurface border border-holoBorder text-cyanGlow">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-white font-mono px-2">
              {testedModality}
            </div>
          </div>

          {/* Model & Latency info */}
          <div className="mt-3 text-xs font-mono text-gray-300 bg-holoSurface/80 px-3 py-1.5 rounded-lg border border-holoBorder/70">
            Model: <strong className="text-cyanAccent">"{modelName}"</strong> | Latency: <strong className="text-cyanGlow">"{latency}"</strong>
          </div>
        </motion.div>

      </section>

      {/* 3. Human-Readable Forensic Reason */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="rounded-2xl bg-holoCard border border-holoBorder p-6 sm:p-7 shadow-xl space-y-4"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-cyanGlow/10 border border-cyanGlow/30 text-cyanGlow">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white font-mono">
            Forensic Analysis Summary
          </h2>
        </div>

        {/* Direct explanation box */}
        <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans">
            <strong className="text-white font-semibold">What our models found: </strong>
            {cleanForensicExplanation}
          </p>
        </div>
      </motion.section>

      {/* 3.5 Multi-Point Forensic Checklist (for Documents & AI Images) */}
      {data.documentChecks && data.documentChecks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
          className="rounded-2xl bg-holoCard border border-holoBorder p-6 sm:p-7 shadow-xl space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-holoBorder gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyanGlow/10 border border-cyanGlow/30 text-cyanGlow">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                  Multi-Point Neural Checklist
                </h2>
                <span className="text-[11px] font-mono text-gray-400">
                  Granular Layer 1 & Layer 2 Forensic Inspection ({data.documentChecks.length} Vector Checks)
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-cyanAccent bg-holoSurface px-2.5 py-1 rounded border border-holoBorder self-start sm:self-auto">
              ViT-OCR Checkpoint
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono text-xs">
            {data.documentChecks.map((check) => {
              const isTampered = check.status === 'TAMPERED' || check.status === 'MISMATCH';
              const isAnomaly = check.status === 'ANOMALY';
              const isVerified = check.status === 'VERIFIED';

              return (
                <div
                  key={check.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    isTampered
                      ? 'bg-red-950/25 border-red-500/40 hover:border-red-500/60'
                      : isAnomaly
                      ? 'bg-amber-950/25 border-amber-500/40 hover:border-amber-500/60'
                      : 'bg-emerald-950/25 border-emerald-500/40 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-white text-xs tracking-wide">
                      {check.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                        isTampered
                          ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                          : isAnomaly
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      }`}
                    >
                      {check.status} {check.risk !== undefined ? `• ${check.risk}%` : ''}
                    </span>
                  </div>

                  <p className="text-[11px] font-sans text-gray-300 leading-relaxed">
                    {check.details || check.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* 4. Collapsible Technical Audit (Accordion / Toggle) */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="rounded-2xl bg-holoCard border border-holoBorder shadow-xl overflow-hidden"
      >
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setShowTechnicalAudit(!showTechnicalAudit)}
          className="w-full flex items-center justify-between p-5 bg-holoCard hover:bg-holoSurface transition-colors text-left font-mono text-xs sm:text-sm text-cyanAccent select-none group"
        >
          <span className="font-semibold text-gray-200 group-hover:text-cyanGlow">
            {showTechnicalAudit
              ? '▲ Hide Technical Audit Data (For Security Analysts)'
              : '▼ Show Technical Audit Data (For Security Analysts)'}
          </span>
          <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
            {showTechnicalAudit ? 'Click to collapse' : 'Click to inspect hashes & vault'}
          </span>
        </button>

        {/* Collapsible Content */}
        <AnimatePresence>
          {showTechnicalAudit && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-t border-holoBorder bg-holoDark/60 p-5 sm:p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                
                {/* Specimen ID */}
                <div className="p-4 rounded-xl bg-holoSurface border border-holoBorder space-y-1.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-gray-400 text-[11px]">
                    <span className="uppercase tracking-wider">Specimen ID</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(specimenId, 'specimenId')}
                      className="text-gray-400 hover:text-cyanGlow transition-colors"
                      title="Copy Specimen ID"
                    >
                      {copiedKey === 'specimenId' ? (
                        <Check className="w-3.5 h-3.5 text-emeraldAllow" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm font-bold text-white tracking-wide">
                    {specimenId}
                  </div>
                </div>

                {/* Perceptual Fingerprint */}
                <div className="p-4 rounded-xl bg-holoSurface border border-holoBorder space-y-1.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-gray-400 text-[11px]">
                    <span className="uppercase tracking-wider">Perceptual Fingerprint</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(pHash, 'pHash')}
                      className="text-gray-400 hover:text-cyanGlow transition-colors"
                      title="Copy Perceptual Fingerprint"
                    >
                      {copiedKey === 'pHash' ? (
                        <Check className="w-3.5 h-3.5 text-emeraldAllow" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm font-bold text-cyanGlow tracking-wide truncate">
                    {pHash}
                  </div>
                </div>

                {/* Cloud Vault Record */}
                <div className="p-4 rounded-xl bg-holoSurface border border-holoBorder space-y-1.5 flex flex-col justify-between">
                  <div className="text-gray-400 text-[11px] uppercase tracking-wider">
                    Cloud Vault Record
                  </div>
                  <div className="text-sm font-bold text-purple-300 tracking-wide truncate">
                    {vaultLocation}
                  </div>
                </div>

                {/* Database Status */}
                <div className="p-4 rounded-xl bg-holoSurface border border-holoBorder space-y-1.5 flex flex-col justify-between">
                  <div className="text-gray-400 text-[11px] uppercase tracking-wider">
                    Database Status
                  </div>
                  <div className="text-sm font-bold text-emeraldAllow tracking-wide flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emeraldAllow animate-ping" />
                    <span>{databaseStatus}</span>
                  </div>
                </div>

              </div>

              {/* Extended Telemetry Itemization (if multi-modal subscores exist) */}
              {data.subScores && data.subScores.length > 1 && (
                <div className="mt-4 pt-4 border-t border-holoBorder/70 space-y-2">
                  <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                    All Evaluated Forensic Vectors ({data.subScores.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {data.subScores.map((scoreItem) => (
                      <div
                        key={scoreItem.id || scoreItem.vector}
                        className="p-3 rounded-lg bg-holoSurface/60 border border-holoBorder flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-gray-200">
                            {scoreItem.vector || scoreItem.vector_name}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {scoreItem.checkpoint}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${
                            scoreItem.score >= 70 ? 'text-crimsonBlock' : scoreItem.score >= 40 ? 'text-amberWarn' : 'text-emeraldAllow'
                          }`}>
                            {scoreItem.score}%
                          </span>
                          <div className="text-[10px] text-gray-500">{scoreItem.latency}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* 5. Action Buttons */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2"
      >
        {/* [ ← Analyze Another File ] */}
        <button
          type="button"
          onClick={() => navigate('/analyze')}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-holoCard hover:bg-holoSurface border border-holoBorder hover:border-gray-600 text-gray-200 hover:text-white font-mono text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Analyze Another File</span>
        </button>

        {/* [ Download Audit Report ] */}
        <button
          type="button"
          onClick={() => navigate('/report', { state: { incidentData: data } })}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyanGlow to-cyanAccent text-black font-mono text-xs sm:text-sm font-bold shadow-cyan-glow hover:brightness-110 active:scale-95 transition-all"
        >
          <FileText className="w-4 h-4 text-black" />
          <span>Download Audit Report</span>
        </button>
      </motion.section>

    </div>
  );
}
