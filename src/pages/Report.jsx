import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Share2, 
  ShieldCheck, 
  AlertOctagon, 
  CheckSquare, 
  Square, 
  Printer, 
  Clock, 
  Fingerprint, 
  Cpu,
  CheckCircle2,
  FileCode,
  Lock,
  ArrowLeft,
  Layers
} from 'lucide-react';
import { DEFAULT_INCIDENT } from '../data/demoData';

export default function Report() {
  const navigate = useNavigate();
  const location = useLocation();
  const incident = location.state?.incidentData || DEFAULT_INCIDENT;

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [exportingJson, setExportingJson] = useState(false);

  // Interactive triage checklist
  const [triageItems, setTriageItems] = useState([
    { id: 't1', label: 'Quarantine completed: Sockets severed & media isolated in air-gapped storage.', checked: true },
    { id: 't2', label: 'Security escalation: SOC incident response ticket created (Ticket #SOC-89104).', checked: true },
    { id: 't3', label: 'Document fraud verification: Notified identity registry authority & flagged specimen DOB hash.', checked: true },
    { id: 't4', label: 'Out-of-band verification: Secondary telephonic confirmation with spoofed executive.', checked: false },
    { id: 't5', label: 'Perimeter firewall rule update: Ingress pHash signature pushed to edge CDN nodes.', checked: true }
  ]);

  const toggleChecklist = (id) => {
    setTriageItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Simulated PDF download
  const handleDownloadPdf = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
      window.print();
    }, 800);
  };

  // Simulated JSON evidence export
  const handleExportJson = () => {
    setExportingJson(true);
    setTimeout(() => {
      setExportingJson(false);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incident, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `TrustGuard_ForensicAudit_${incident.incidentId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }, 700);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-holoBorder">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/results', { state: { incidentData: incident } })}
            className="p-2 rounded-xl bg-holoCard hover:bg-holoSurface border border-holoBorder text-gray-400 hover:text-white transition-colors"
            title="Back to Results"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyanGlow uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>INCIDENT FORENSIC DOSSIER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cryptographic Audit & Quarantine Report
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyanGlow to-cyanAccent text-black font-mono text-xs font-bold shadow-cyan-glow hover:brightness-110 active:scale-95 transition-all"
          >
            {downloadingPdf ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF Audit</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportJson}
            disabled={exportingJson}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-holoCard hover:bg-holoSurface border border-holoBorder text-gray-200 font-mono text-xs font-semibold transition-all"
          >
            {exportingJson ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-cyanGlow border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileCode className="w-4 h-4 text-cyanGlow" />
                <span>Export JSON Evidence</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dossier Container with Subtle "CONFIDENTIAL // FORENSIC AUDIT" Watermark */}
      <div className="relative rounded-2xl bg-holoCard border border-holoBorder shadow-2xl p-6 sm:p-10 space-y-8 overflow-hidden print:bg-white print:text-black print:border-gray-400">
        
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-5">
          <div className="text-6xl sm:text-8xl font-black text-white font-mono tracking-widest uppercase transform -rotate-25 whitespace-nowrap">
            CONFIDENTIAL // FORENSIC AUDIT
          </div>
        </div>

        {/* Dossier Header Banner */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-holoBorder print:border-gray-400 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyanGlow print:text-blue-700 uppercase tracking-widest">
              <span>TRUSTGUARD AI FORENSICS ARCHIVE</span>
              <span>•</span>
              <span>SECURITY INCIDENT DOSSIER</span>
            </div>
            <h2 className="text-2xl font-black text-white print:text-black tracking-tight">
              Incident {incident.incidentId}
            </h2>
            <p className="text-xs font-mono text-gray-400 print:text-gray-600">
              SHA-256 Digest: {incident.sha256}
            </p>
          </div>

          <div className="flex flex-col sm:items-end font-mono text-xs space-y-1">
            <div className={`px-3 py-1 rounded border font-bold uppercase tracking-wider ${
              (incident.overallRisk ?? 86) >= 70
                ? 'bg-crimsonBlock/20 border-crimsonBlock/50 text-crimsonBlock print:bg-red-100 print:text-red-700'
                : (incident.overallRisk ?? 86) >= 40
                ? 'bg-amberWarn/20 border-amberWarn/50 text-amberWarn print:bg-yellow-100 print:text-yellow-800'
                : 'bg-emeraldAllow/20 border-emeraldAllow/50 text-emeraldAllow print:bg-green-100 print:text-green-700'
            }`}>
              {incident.containmentStatus || "BLOCKED AT INGRESS"}
            </div>
            <div className="text-gray-400 print:text-gray-600 text-[11px]">
              Ingress Evaluated: {incident.timestamp || "2026-10-06T00:15:22Z"}
            </div>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-holoSurface print:bg-gray-100 border border-holoBorder print:border-gray-300 font-mono text-xs">
          <div>
            <span className="text-[10px] text-gray-400 print:text-gray-600 uppercase block">Composite Risk</span>
            <span className={`text-2xl font-black ${
              (incident.overallRisk ?? 86) >= 70
                ? 'text-crimsonBlock print:text-red-700'
                : (incident.overallRisk ?? 86) >= 40
                ? 'text-amberWarn print:text-yellow-800'
                : 'text-emeraldAllow print:text-green-700'
            }`}>
              {incident.overallRisk ?? 86}%
            </span>
            <span className="text-[10px] text-gray-400 print:text-gray-600 block">
              {(incident.overallRisk ?? 86) >= 70 ? 'Critical Threshold' : (incident.overallRisk ?? 86) >= 40 ? 'Review Threshold' : 'Passed Nominal'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 print:text-gray-600 uppercase block">Perceptual Hash</span>
            <span className="text-sm font-bold text-cyanGlow print:text-blue-700 truncate block mt-1">
              {incident.pHash || "pHash: 8f3a91bc7d20"}
            </span>
            <span className="text-[10px] text-gray-400 print:text-gray-600 block">DCT 64-bit Quantized</span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 print:text-gray-600 uppercase block">Policy Action</span>
            <span className="text-sm font-bold text-white print:text-black block mt-1">
              {incident.policyAction || "Block inside platform"}
            </span>
            <span className="text-[10px] text-emeraldAllow print:text-green-700 block">Ingress Enforcement</span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 print:text-gray-600 uppercase block">Attribution Cluster</span>
            <span className="text-sm font-bold text-amberWarn print:text-yellow-800 block mt-1">
              {incident.traceMatches?.[0]?.actorCluster || "APT-UNC3881"}
            </span>
            <span className="text-[10px] text-gray-400 print:text-gray-600 block">Indexed Threat Cache</span>
          </div>
        </div>

        {/* Forensic Model Findings Summary */}
        {incident.forensicSummary && (
          <div className="relative z-10 p-4 rounded-xl bg-slate-900/90 print:bg-gray-50 border border-slate-700/80 print:border-gray-300 font-sans text-xs">
            <span className="font-bold text-white print:text-black font-mono block mb-1">
              Neural Forensic Assessment Finding:
            </span>
            <p className="text-gray-200 print:text-gray-800 leading-relaxed">
              {incident.forensicSummary}
            </p>
          </div>
        )}

        {/* Itemized Model Breakdown Table */}
        <div className="relative z-10 space-y-3">
          <h3 className="text-sm font-bold text-white print:text-black font-mono uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyanGlow print:text-blue-700" />
            <span>Neural Vector Forensic Telemetry (All 4 Modalities)</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-holoBorder print:border-gray-300">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-holoSurface print:bg-gray-100 text-gray-400 print:text-gray-700 text-[11px] uppercase border-b border-holoBorder print:border-gray-300">
                <tr>
                  <th className="p-3">Vector</th>
                  <th className="p-3">Neural Checkpoint</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3 text-center">Disposition</th>
                  <th className="p-3 text-right">Inference Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-holoBorder print:divide-gray-200">
                {incident.subScores.map((score) => (
                  <tr key={score.id || score.vector} className="print:text-black">
                    <td className="p-3 font-semibold text-white print:text-black">{score.vector}</td>
                    <td className="p-3 text-cyanAccent print:text-blue-700">{score.checkpoint}</td>
                    <td className="p-3 text-center font-bold text-crimsonBlock print:text-red-700">{score.score}%</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-crimsonBlock/20 print:bg-red-100 text-crimsonBlock print:text-red-700 text-[10px] font-bold">
                        {score.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-gray-400 print:text-gray-600">{score.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnostic Narrative & Artifact Catalog */}
        <div className="relative z-10 space-y-3">
          <h3 className="text-sm font-bold text-white print:text-black font-mono uppercase tracking-wider">
            Diagnostic Narrative & Artifact Catalog
          </h3>

          <div className="space-y-3 text-xs text-gray-300 print:text-gray-800 font-sans leading-relaxed">
            {incident.subScores.map((score) => (
              <div key={`narrative-${score.id || score.vector}`} className="p-3.5 rounded-xl bg-holoSurface/60 print:bg-gray-50 border border-holoBorder print:border-gray-300">
                <span className="font-bold text-white print:text-black font-mono block mb-1">
                  [{score.vector}] — Anomaly Log:
                </span>
                <p>{score.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Point Forensic Checklist (for Image / Document Analysis) */}
        {incident.documentChecks && incident.documentChecks.length > 0 && (
          <div className="relative z-10 space-y-3">
            <h3 className="text-sm font-bold text-white print:text-black font-mono uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyanGlow print:text-blue-700" />
              <span>Multi-Point Forensic Checklist Findings ({incident.documentChecks.length} Vector Checks)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {incident.documentChecks.map((chk) => {
                const isTampered = chk.status === 'TAMPERED' || chk.status === 'MISMATCH';
                const isAnomaly = chk.status === 'ANOMALY';
                return (
                  <div key={chk.id} className="p-3.5 rounded-xl bg-holoSurface/60 print:bg-gray-50 border border-holoBorder print:border-gray-300 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white print:text-black">{chk.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isTampered
                          ? 'bg-crimsonBlock/20 text-crimsonBlock print:bg-red-100 print:text-red-700'
                          : isAnomaly
                          ? 'bg-amberWarn/20 text-amberWarn print:bg-yellow-100 print:text-yellow-800'
                          : 'bg-emeraldAllow/20 text-emeraldAllow print:bg-green-100 print:text-green-700'
                      }`}>
                        {chk.status} {chk.risk !== undefined ? `• ${chk.risk}%` : ''}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-gray-300 print:text-gray-700 leading-relaxed">
                      {chk.details || chk.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Interactive Triage Checklist */}
        <div className="relative z-10 space-y-3 pt-2 border-t border-holoBorder print:border-gray-300">
          <h3 className="text-sm font-bold text-white print:text-black font-mono uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emeraldAllow print:text-green-700" />
            <span>Forensic Incident Triage Checklist</span>
          </h3>

          <div className="space-y-2.5">
            {triageItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                  item.checked
                    ? 'bg-holoSurface border-emeraldAllow/40 print:bg-gray-50 print:border-gray-300'
                    : 'bg-holoDark border-holoBorder print:bg-white print:border-gray-200 opacity-70'
                }`}
              >
                <div className="mt-0.5">
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-emeraldAllow print:text-green-700" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="text-xs font-mono">
                  <span className={item.checked ? 'text-gray-200 print:text-black font-medium' : 'text-gray-400 print:text-gray-600 line-through'}>
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Sign-Off Footer */}
        <div className="relative z-10 pt-6 border-t border-holoBorder print:border-gray-400 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-gray-400 print:text-gray-600 gap-4">
          <div>
            <div>Auditor Engine: <strong>TrustGuard Multi-Modal Core v1.0.4</strong></div>
            <div>Verification Key: <code>0x981F4B92C...77A1</code></div>
          </div>
          <div className="text-left sm:text-right">
            <div>Cryptographic Status: <span className="text-emeraldAllow print:text-green-700 font-bold">VERIFIED AUTHENTIC</span></div>
            <div>Platform Ingress: Nominal Containment</div>
          </div>
        </div>

      </div>

    </div>
  );
}
