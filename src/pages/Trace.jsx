import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, 
  Check, 
  Copy, 
  ArrowRight, 
  GitBranch, 
  ShieldAlert, 
  Database, 
  Clock, 
  Info, 
  Layers, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { DEFAULT_INCIDENT } from '../data/demoData';

export default function Trace() {
  const navigate = useNavigate();
  const location = useLocation();
  const incident = location.state?.incidentData || DEFAULT_INCIDENT;
  const [copied, setCopied] = useState(false);

  const copyHash = () => {
    navigator.clipboard.writeText(incident.pHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09071E] text-white p-4 sm:p-6 md:p-12 font-sans space-y-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-holoBorder">
          <div>
            <span className="font-mono text-xs text-cyanGlow uppercase tracking-widest block">
              Stage 4 // Attribution & Forensics
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-white">
              Perceptual Hash & Source Tracing
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Matching content fingerprints against indexed scam repositories and modified document mirrors.
            </p>
          </div>

          <div className="text-xs font-mono text-gray-400">
            Incident Ref: <span className="text-cyanGlow font-bold">{incident.incidentId}</span>
          </div>
        </div>

        {/* Fingerprint Digital Signature Card */}
        <div className="bg-[#130E38] border border-cyan-500/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-cyan-950 flex items-center justify-center border border-cyan-500/60 shadow-cyan-sm shrink-0">
              <Fingerprint className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Content Digital Signature (pHash & DCT Matrix)
              </span>
              <span className="text-xl font-mono font-bold text-cyan-300">
                {incident.pHash}
              </span>
              <span className="text-xs font-mono text-gray-400 block mt-0.5">
                SHA-256: {incident.sha256 ? `${incident.sha256.substring(0, 28)}...` : 'e3b0c44298fc1c149afbf4c8996fb924...'}
              </span>
            </div>
          </div>

          <div className="relative self-stretch md:self-auto flex items-center justify-end">
            <button 
              onClick={copyHash}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 font-mono text-xs text-gray-200 transition-all border border-gray-700 active:scale-95 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emeraldAllow" /> : <Copy className="w-4 h-4 text-cyanGlow" />}
              <span>{copied ? "Hash Copied!" : "Copy pHash Signature"}</span>
            </button>

            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -8 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-10 right-0 px-3 py-1.5 rounded-lg bg-emeraldAllow text-black text-xs font-mono font-bold shadow-lg pointer-events-none"
                >
                  ✓ Copied to clipboard
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Visual Attribution Tree: Content -> pHash -> Similarity Clusters */}
        <div className="p-6 sm:p-8 rounded-2xl bg-holoCard border border-holoBorder shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-holoBorder pb-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyanGlow" />
              <h3 className="font-mono font-bold text-white text-base">
                Hierarchical Attribution Graph
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-400">
              Cluster Search Window: Hamming Distance &le; 4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Stage 1 */}
            <div className="p-5 rounded-xl bg-holoSurface border border-holoBorder flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span>STAGE 1: SPECIMEN</span>
                  <span className="text-crimsonBlock font-bold">Inbound</span>
                </div>
                <h4 className="font-mono font-bold text-white text-sm">
                  Specimen #{incident.incidentId}
                </h4>
                <p className="text-xs text-gray-300 mt-1 font-sans">
                  {incident.uploadedFileName || "Multimodal deepfake & document forgery payload"} ingested at perimeter gateway.
                </p>
              </div>
              <div className="text-[11px] font-mono text-cyanGlow bg-holoDark px-2.5 py-1 rounded border border-gray-700">
                Risk Rating: {incident.overallRisk}%
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-5 rounded-xl bg-holoSurface border border-cyanGlow/40 shadow-cyan-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span>STAGE 2: EXTRACTION</span>
                  <span className="text-cyanGlow font-bold">Quantized</span>
                </div>
                <h4 className="font-mono font-bold text-cyanGlow text-sm">
                  64-bit Perceptual Hash
                </h4>
                <p className="text-xs text-gray-300 mt-1 font-sans">
                  Discrete cosine transform extracting frequency invariant landmarks across noise and resampling.
                </p>
              </div>
              <div className="text-[11px] font-mono text-cyanGlow bg-holoDark px-2.5 py-1 rounded border border-cyanGlow/30 truncate">
                {incident.pHash}
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-5 rounded-xl bg-holoSurface border border-amberWarn/40 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span>STAGE 3: SYNDICATES</span>
                  <span className="text-amberWarn font-bold">{incident.traceMatches?.length || 2} Matches</span>
                </div>
                <h4 className="font-mono font-bold text-white text-sm">
                  Indexed Cluster Matches
                </h4>
                <p className="text-xs text-gray-300 mt-1 font-sans">
                  Cross-referenced against dark web repositories, Telegram leak channels, and document forgery caches.
                </p>
              </div>
              <div className="text-[11px] font-mono text-amberWarn bg-holoDark px-2.5 py-1 rounded border border-amberWarn/30">
                Top Attribution: 94% Match
              </div>
            </div>

          </div>
        </div>

        {/* Candidate Matching Threat Sources */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-cyanGlow" />
              <h3 className="font-mono font-bold text-white text-lg">
                Candidate Matching Threat Sources
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-400">
              Sync Node: global-threat-intel-01
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incident.traceMatches?.map((match, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-holoCard border border-holoBorder hover:border-gray-600 shadow-xl space-y-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-crimsonBlock/20 text-crimsonBlock text-xs font-mono font-bold border border-crimsonBlock/40">
                    {match.similarity}% Similarity Match
                  </span>
                  <span className="text-xs font-mono text-gray-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Seen {match.earliestSeen}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">
                    {match.source}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 font-sans leading-relaxed">
                    Identified in indexed syndicate feeds with high correlation in structural micro-features and compression signatures.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-holoSurface border border-holoBorder font-mono text-xs text-gray-400 space-y-1">
                  <div>Actor Cluster: <strong className="text-gray-200">{match.actorCluster || "APT-UNC3881 (ScamBot)"}</strong></div>
                  <div>Confidence: <span className="text-cyanGlow font-bold">{match.fingerprintConfidence || "Cryptographic Perceptual Match"}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explicit Disclaimer */}
        <div className="rounded-xl bg-holoSurface/80 border border-amberWarn/40 p-4 sm:p-5 flex items-start space-x-3.5 shadow-md">
          <div className="p-2 rounded-lg bg-amberWarn/20 text-amberWarn border border-amberWarn/40 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-amberWarn uppercase tracking-wider">
              ATTRIBUTION JURISDICTION & FORENSIC DISCLAIMER
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Reports reflect earliest known or matching indexed copies; not a definitive creator origin.
              Perceptual hashing correlates visual/spectral similarity across decentralized syndicates. Adversarial re-encoding or re-uploading across relays does not establish original hardware authorship.
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate('/results', { state: { incidentData: incident } })}
            className="text-xs font-mono text-gray-400 hover:text-white"
          >
            ← Return to Forensic Results
          </button>

          <button
            onClick={() => navigate('/report', { state: { incidentData: incident } })}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyanGlow to-cyanAccent text-black font-mono font-bold text-xs shadow-cyan-glow hover:brightness-110 transition-all"
          >
            <span>Proceed to Incident Dossier & Export</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
