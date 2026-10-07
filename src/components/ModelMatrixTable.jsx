import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  CheckCircle, 
  Clock, 
  AlertOctagon,
  Fingerprint,
  Layers,
  Sparkles,
  Info,
  Database,
  Code2,
  Copy,
  Check
} from 'lucide-react';
import { DEFAULT_INCIDENT } from '../data/demoData';

export default function ModelMatrixTable({ incident = DEFAULT_INCIDENT }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const subScores = incident.subScores || [];
  const incidentId = incident.incidentId || incident.id || "TG-2026-9041X";
  const phash = incident.pHash || incident.phash || "pHash: 8f3a91bc7d20";
  const containment = incident.containmentStatus || incident.containment_status || "BLOCKED AT INGRESS";
  const overallRisk = incident.overallRisk ?? incident.overall_risk ?? 86;

  const sqlSample = `-- Supabase PostgreSQL Query:
SELECT i.id, i.phash, i.overall_risk, i.containment_status,
       s.vector_name, s.checkpoint, s.score, s.status, s.latency
FROM public.incidents i
JOIN public.incident_sub_scores s ON i.id = s.incident_id
WHERE i.id = '${incidentId}';`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-holoCard border border-holoBorder shadow-2xl">
      
      {/* Top Incident Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-holoSurface via-holoCard to-holoSurface border-b border-holoBorder flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
              INCIDENT ID:
            </span>
            <span className="font-mono font-bold text-white text-base tracking-wider bg-holoDark px-2.5 py-0.5 rounded border border-gray-700">
              {incidentId}
            </span>
            <span className="text-xs font-mono text-cyanGlow flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Multi-Modal Ingress Filter v1.0</span>
            </span>
            <button
              onClick={() => setShowSqlModal(true)}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/60 text-cyanGlow hover:bg-cyan-900/40 flex items-center space-x-1 transition-colors"
            >
              <Database className="w-3 h-3" />
              <span>Supabase Record</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
            <Fingerprint className="w-3.5 h-3.5 text-cyanGlow" />
            <span className="text-gray-300">{phash}</span>
            <span className="text-gray-600">•</span>
            <span>Recorded: {incident.timestamp || incident.created_at || "2026-10-06T00:15:22Z"}</span>
          </div>
        </div>

        {/* Glowing Red/Amber/Green Containment Badge */}
        <div className="flex items-center space-x-3 self-stretch md:self-auto justify-between md:justify-end">
          <div className="relative group">
            <div className={`absolute -inset-0.5 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300 ${
              overallRisk >= 70 ? 'bg-crimsonBlock' : overallRisk >= 40 ? 'bg-amberWarn' : 'bg-emeraldAllow'
            }`}></div>
            <div className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg bg-holoDark border font-mono font-bold text-xs tracking-wider uppercase shadow-sm ${
              overallRisk >= 70 ? 'border-crimsonBlock text-crimsonBlock shadow-crimson-sm' : overallRisk >= 40 ? 'border-amberWarn text-amberWarn' : 'border-emeraldAllow text-emeraldAllow'
            }`}>
              <AlertOctagon className="w-4 h-4 animate-pulse" />
              <span>{containment}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Table: Detection Vector, Neural Model Checkpoint, Score, Status, Latency */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-holoSurface/80 text-gray-400 uppercase tracking-wider text-[11px] border-b border-holoBorder">
            <tr>
              <th scope="col" className="px-5 py-3">Detection Vector</th>
              <th scope="col" className="px-5 py-3">Neural Model Checkpoint</th>
              <th scope="col" className="px-5 py-3 text-center">Score</th>
              <th scope="col" className="px-5 py-3 text-center">Status</th>
              <th scope="col" className="px-5 py-3 text-right">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-holoBorder/60">
            {subScores.map((item, index) => {
              const vectorName = item.vector || item.vector_name || "Unknown Vector";
              const score = item.score ?? 0;
              const isHigh = item.statusType === 'high' || score >= 70;
              const isMed = item.statusType === 'med' || (score >= 40 && score < 70);

              return (
                <tr 
                  key={item.id || vectorName} 
                  className={`hover:bg-holoSurface/40 transition-colors ${
                    isHigh ? 'bg-crimsonBlock/5' : ''
                  }`}
                >
                  {/* Detection Vector */}
                  <td className="px-5 py-4 font-semibold text-white flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                      isHigh ? 'bg-crimsonBlock animate-pulse' : isMed ? 'bg-amberWarn' : 'bg-emeraldAllow'
                    }`} />
                    <span>{vectorName}</span>
                  </td>

                  {/* Neural Model Checkpoint */}
                  <td className="px-5 py-4 text-gray-300 font-mono">
                    <span className="px-2 py-1 rounded bg-holoSurface border border-holoBorder text-cyanAccent text-[11px]">
                      {item.checkpoint}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-5 py-4 text-center">
                    <span className={`text-sm font-extrabold ${
                      isHigh ? 'text-crimsonBlock' : isMed ? 'text-amberWarn' : 'text-emeraldAllow'
                    }`}>
                      {score}%
                    </span>
                  </td>

                  {/* Status Pill Badge */}
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isHigh 
                        ? 'bg-crimsonBlock/20 border border-crimsonBlock/50 text-crimsonBlock shadow-crimson-sm'
                        : isMed
                        ? 'bg-amberWarn/20 border border-amberWarn/50 text-amberWarn'
                        : 'bg-emeraldAllow/20 border border-emeraldAllow/50 text-emeraldAllow'
                    }`}>
                      <ShieldAlert className="w-3 h-3" />
                      <span>{item.status}</span>
                    </span>
                  </td>

                  {/* Latency */}
                  <td className="px-5 py-4 text-right text-gray-400">
                    <span className="inline-flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>{item.latency}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Collapsible Lower Panel: Flagged Forensic Indicator Cards */}
      <div className="border-t border-holoBorder">
        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full px-5 py-3 flex items-center justify-between text-xs font-mono text-gray-400 hover:text-white bg-holoSurface/40 hover:bg-holoSurface transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyanGlow" />
            <span className="font-semibold text-gray-300">
              Flagged Forensic Indicators ({subScores.length} Neural Vectors Analyzed)
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{isDetailsOpen ? 'Hide Forensic Details' : 'Expand Forensic Details'}</span>
            {isDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isDetailsOpen && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-holoDark/60">
            {subScores.map((item) => {
              const vectorName = item.vector || item.vector_name;
              const isHigh = item.statusType === 'high' || (item.score >= 70);
              return (
                <div 
                  key={`detail-${item.id || vectorName}`}
                  className="p-4 rounded-xl bg-holoCard/80 border border-holoBorder hover:border-cyanGlow/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-xs flex items-center space-x-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-crimsonBlock' : 'bg-amberWarn'}`} />
                      <span>{vectorName}</span>
                    </span>
                    <span className={`text-xs font-mono font-bold ${isHigh ? 'text-crimsonBlock' : 'text-amberWarn'}`}>
                      {item.score}% Risk
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {item.details}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-gray-500">
                    <span>Model: {item.checkpoint}</span>
                    <span>Latency: {item.latency}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Supabase Schema / Record Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0B0E17] border border-cyanGlow/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2 text-cyanGlow font-mono font-bold text-sm uppercase">
                <Database className="w-4 h-4" />
                <span>Supabase PostgreSQL Record Preview</span>
              </div>
              <button 
                onClick={() => setShowSqlModal(false)}
                className="text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <p className="text-gray-300">
                This incident is mapped to Supabase tables <code className="text-cyanAccent">incidents</code>, <code className="text-cyanAccent">incident_sub_scores</code>, and evidence bucket <code className="text-purple-400">evidence-vault</code>.
              </p>
              
              <div className="relative">
                <pre className="p-3.5 rounded-xl bg-black/90 border border-gray-800 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
                  {sqlSample}
                </pre>
                <button
                  onClick={copySql}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 text-[10px] flex items-center space-x-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emeraldAllow" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-cyanGlow text-black font-bold text-xs font-mono hover:brightness-110"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
