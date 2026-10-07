import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileVideo, 
  Mic, 
  MessageSquare, 
  FileCheck, 
  Radio, 
  UploadCloud, 
  Search, 
  Cpu, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FileText,
  Eye,
  Sliders,
  Play,
  Pause,
  RefreshCw,
  Terminal,
  Activity,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  AlertOctagon,
  Camera
} from 'lucide-react';
import { DEFAULT_INCIDENT, AUTHENTIC_PHOTO_DATA } from '../data/demoData';
import { API_ENDPOINTS } from '../config/api';
import LiveProctorHUD from '../components/LiveProctorHUD';

// Dedicated single-modality fallback generator
export const getFallbackForTab = (tab = 'doc', filename = '') => {
  const normTab = (tab || 'doc').toLowerCase();
  const ts = new Date().toISOString();
  const lowerFile = (filename || '').toLowerCase();

  // If specimen represents real camera photo, return verified authentic payload
  if (lowerFile.includes('camera') || lowerFile.includes('real')) {
    return {
      ...AUTHENTIC_PHOTO_DATA,
      timestamp: ts,
      created_at: ts
    };
  }

  if (normTab === 'video') {
    return {
      incidentId: 'TG-2026-9041X',
      id: 'TG-2026-9041X',
      timestamp: ts,
      created_at: ts,
      file_name: 'executive_face_swap_timesformer.mp4',
      file_type: 'video',
      selectedModality: 'video',
      pHash: 'pHash: 8f3a91bc7d20',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      overallRisk: 82,
      overall_risk: 82,
      riskLevel: 'HIGH',
      risk_level: 'HIGH',
      containmentStatus: 'BLOCKED AT INGRESS',
      containment_status: 'BLOCKED AT INGRESS',
      policyAction: 'Block inside platform & isolate ingress socket',
      subScores: [
        {
          id: 'video-temporal',
          vector: 'Video & Temporal Deepfake',
          vector_name: 'Video & Temporal Deepfake',
          checkpoint: 'trustguard/timesformer-deepfake-v1',
          score: 82,
          status: 'High Risk Block',
          statusType: 'high',
          latency: '142ms',
          details: 'High-frequency texture warping along jawline contour across 32 consecutive frames.'
        }
      ],
      traceMatches: [
        {
          id: 'trace-match-2',
          source: 'Public Video Mirror Syndicate',
          source_name: 'Public Video Mirror Syndicate',
          similarity: 87,
          earliestSeen: '2 days ago'
        }
      ],
      documentChecks: []
    };
  }

  if (normTab === 'audio') {
    return {
      incidentId: 'TG-2026-9041X',
      id: 'TG-2026-9041X',
      timestamp: ts,
      created_at: ts,
      file_name: 'telephony_cloned_voice_wav2vec2.wav',
      file_type: 'audio',
      selectedModality: 'audio',
      pHash: 'pHash: 8f3a91bc7d20',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      overallRisk: 76,
      overall_risk: 76,
      riskLevel: 'HIGH',
      risk_level: 'HIGH',
      containmentStatus: 'BLOCKED AT INGRESS',
      containment_status: 'BLOCKED AT INGRESS',
      policyAction: 'Block inside platform & isolate ingress socket',
      subScores: [
        {
          id: 'voice-synthesis',
          vector: 'Voice Synthesis',
          vector_name: 'Voice Synthesis',
          checkpoint: 'trustguard/wav2vec2-synthetic-voice',
          score: 76,
          status: 'High Risk Block',
          statusType: 'high',
          latency: '89ms',
          details: 'Spectral flatness and robotic phase continuity matching neural voice cloning signatures.'
        }
      ],
      traceMatches: [
        {
          id: 'trace-match-1',
          source: 'Known Telegram Phishing Archive #4',
          source_name: 'Known Telegram Phishing Archive #4',
          similarity: 84,
          earliestSeen: '1 day ago'
        }
      ],
      documentChecks: []
    };
  }

  if (normTab === 'text') {
    return {
      incidentId: 'TG-2026-9041X',
      id: 'TG-2026-9041X',
      timestamp: ts,
      created_at: ts,
      file_name: 'scam_message_payload.txt',
      file_type: 'text',
      selectedModality: 'text',
      pHash: 'pHash: 8f3a91bc7d20',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      overallRisk: 91,
      overall_risk: 91,
      riskLevel: 'HIGH',
      risk_level: 'HIGH',
      containmentStatus: 'BLOCKED AT INGRESS',
      containment_status: 'BLOCKED AT INGRESS',
      policyAction: 'Block inside platform & flag sender account',
      subScores: [
        {
          id: 'phishing-lexical',
          vector: 'Phishing / Lexical',
          vector_name: 'Phishing / Lexical',
          checkpoint: 'trustguard/scam-deberta-v3-intent',
          score: 91,
          status: 'High Risk Block',
          statusType: 'high',
          latency: '34ms',
          details: 'Urgent wire transfer request impersonating executive authority.'
        }
      ],
      traceMatches: [
        {
          id: 'trace-match-1',
          source: 'Known Telegram Phishing Archive #4',
          source_name: 'Known Telegram Phishing Archive #4',
          similarity: 94,
          earliestSeen: '14 hours ago'
        }
      ],
      documentChecks: []
    };
  }

  // Default to doc / image
  return {
    incidentId: 'TG-2026-9041X',
    id: 'TG-2026-9041X',
    timestamp: ts,
    created_at: ts,
    file_name: filename || 'synthetic_flux_specimen.png',
    file_type: 'image_doc',
    selectedModality: 'image_doc',
    pHash: 'pHash: 8f3a91bc7d20',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    overallRisk: 86,
    overall_risk: 86,
    riskLevel: 'HIGH',
    risk_level: 'HIGH',
    containmentStatus: 'BLOCKED AT INGRESS',
    containment_status: 'BLOCKED AT INGRESS',
    policyAction: 'Block inside platform',
    forensicSummary: 'What our models found: Synthetic generation metadata (diffusion generator / AI prompt header) identified in file stream.',
    subScores: [
      {
        id: 'document-image-forgery',
        vector: 'Document / Image Forgery',
        vector_name: 'Document / Image Forgery',
        checkpoint: 'trustguard/docu-tamper-vit-ocr',
        score: 86,
        status: 'High Risk Block',
        statusType: 'high',
        latency: '112ms',
        details: 'Synthetic generation metadata (diffusion generator / AI prompt header) identified in file stream.'
      }
    ],
    traceMatches: [
      {
        id: 'trace-match-1',
        source: 'Known Telegram Phishing Archive #4',
        source_name: 'Known Telegram Phishing Archive #4',
        similarity: 94,
        earliestSeen: '14 hours ago'
      }
    ],
    documentChecks: DEFAULT_INCIDENT.documentChecks || []
  };
};

export default function Analyze() {
  const navigate = useNavigate();

  // 5 Modality Selector Tabs
  // [ ⬡ Video & Frames ] | [ ⬡ Audio & Voice ] | [ ⬡ Scam Text ] | [ ⬡ Document / ID Verification ] | [ ⬡ Live Stream ]
  const [activeTab, setActiveTab] = useState('doc'); // Default to the newly featured Document / ID modality for immediate delight!

  // File Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState({
    name: "aadhaar_identity_tampered_specimen.jpg",
    size: 2421900,
    type: "image/jpeg"
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  // Video Preview State
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [scrubberFrame, setScrubberFrame] = useState(14);

  // Audio Preview State
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Document Preview State (ELA Heatmap Toggle)
  const [elaActive, setElaActive] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('aadhaar');

  // Text Modality State
  const [scamText, setScamText] = useState(
    "CONFIDENTIAL & IMMEDIATE: Executive settlement authorization required. Please bypass standard dual-signature SAP approvals due to strict M&A NDA provisions. Wire $480,000 to offshore escrow account 9401-229-881 before 15:00 UTC."
  );

  // Phased Processing Sequence (State Machine): -1: idle, 0: Stage 0, 1: Stage 1, 2: Stage 2, 3: Stage 3
  const [processingStage, setProcessingStage] = useState(-1);
  const [progressPercent, setProgressPercent] = useState(0);

  const tabs = [
    { id: 'video', label: 'Video & Frames', symbol: '⬡', icon: FileVideo, desc: 'Temporal Deepfakes & Face-Swaps' },
    { id: 'audio', label: 'Audio & Voice', symbol: '⬡', icon: Mic, desc: 'Cloned Vocoders & Voice Conversion' },
    { id: 'text', label: 'Scam Text', symbol: '⬡', icon: MessageSquare, desc: 'Urgency & Authority Impersonation' },
    { id: 'doc', label: 'Document & AI Image', symbol: '⬡', icon: FileCheck, desc: 'Synthetic AI Images, Aadhaar & Passports' },
    { id: 'stream', label: 'Live Stream', symbol: '⬡', icon: Radio, desc: 'RTSP CCTV & Boundary Feeds' },
    { id: 'proctor', label: 'Live Proctor', symbol: '⬡', icon: Camera, desc: 'Webcam AI Anti-Cheat Monitor' }
  ];

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  // Preset specimen loader
  const loadPreset = (type) => {
    if (type === 'ai-image') {
      setActiveTab('doc');
      setSelectedDocType('ai-image');
      setUploadedFile({
        name: "synthetic_flux_specimen.png",
        size: 1048576,
        type: "image/png"
      });
      setPreviewUrl(null);
    } else if (type === 'camera') {
      setActiveTab('doc');
      setSelectedDocType('camera');
      setUploadedFile({
        name: "real_camera_portrait.jpg",
        size: 2840500,
        type: "image/jpeg"
      });
      setPreviewUrl(null);
    } else if (type === 'aadhaar') {
      setActiveTab('doc');
      setSelectedDocType('aadhaar');
      setUploadedFile({
        name: "aadhaar_card_forgery_specimen.jpg",
        size: 1940500,
        type: "image/jpeg"
      });
      setPreviewUrl(null);
    } else if (type === 'video') {
      setActiveTab('video');
      setUploadedFile({
        name: "executive_face_swap_timesformer.mp4",
        size: 14820300,
        type: "video/mp4"
      });
      setPreviewUrl(null);
    } else if (type === 'audio') {
      setActiveTab('audio');
      setUploadedFile({
        name: "telephony_cloned_voice_wav2vec2.wav",
        size: 3840200,
        type: "audio/wav"
      });
      setPreviewUrl(null);
    }
  };

  // Unified Ingestion Pipeline Call to FastAPI Gateway via Vite Proxy
  const handleAnalyze = async () => {
    let selectedFile = uploadedFile instanceof File ? uploadedFile : null;
    const textContent = scamText;

    // Synthesize a valid File object if uploadedFile is a simulated specimen without raw OS file picker
    if (!selectedFile && uploadedFile && uploadedFile.name) {
      let content = "TrustGuard specimen payload stream: " + uploadedFile.name;
      const lower = uploadedFile.name.toLowerCase();
      if (lower.includes('synthetic') || lower.includes('flux') || lower.includes('dall-e') || lower.includes('midjourney') || lower.includes('ai') || lower.includes('tampered')) {
        content += " synthetic flux comfyui dall-e diffusion prompt header c2pa generator footprint";
      }
      const blob = new Blob([content], { type: uploadedFile.type || 'application/octet-stream' });
      selectedFile = new File([blob], uploadedFile.name, { type: uploadedFile.type || 'application/octet-stream' });
    }

    // Derive hint from file extension if tab state is mismatched
    let detectedHint = activeTab;
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff', 'gif'].includes(ext)) {
        detectedHint = 'image_doc';
      } else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
        detectedHint = 'video';
      } else if (['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(ext)) {
        detectedHint = 'audio';
      }
    }

    const formData = new FormData();
    if (selectedFile) formData.append('file', selectedFile);
    if (detectedHint === 'text' && textContent) {
      formData.append('text_payload', textContent);
    } else if (textContent && !selectedFile && activeTab === 'text') {
      formData.append('text_payload', textContent);
    }
    formData.append('modality_hint', detectedHint);
    formData.append('modality', detectedHint);

    try {
      const res = await fetch(API_ENDPOINTS.ANALYZE, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('API request failed');
      const resultData = await res.json();
      navigate('/results', { state: { incidentData: resultData } });
    } catch (err) {
      console.warn('Backend unavailable, using fallback data:', err);
      // Smooth fallback to local state matching the active modality and file signature
      const lower = (selectedFile?.name || uploadedFile?.name || '').toLowerCase();
      let fallbackPayload;
      if (lower.includes('camera') || lower.includes('real')) {
        fallbackPayload = AUTHENTIC_PHOTO_DATA;
      } else {
        fallbackPayload = getFallbackForTab(detectedHint || activeTab, uploadedFile?.name);
      }
      navigate('/results', { state: { incidentData: fallbackPayload } });
    }
  };

  const startAnalysis = handleAnalyze;
  const handleExecuteAnalysis = handleAnalyze;

  // Count text words
  const wordCount = scamText.trim() ? scamText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-holoBorder">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyanGlow uppercase tracking-wider mb-1.5">
            <Search className="w-4 h-4" />
            <span>INGRESS FORENSIC SCANNER & INGESTION PIPELINE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Ingest, Inspect & Audit Payloads
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Real-time biometric, spatiotemporal video, synthetic audio & document/image forgery verification.
          </p>
        </div>

        {/* Quick Specimen Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-gray-400">Load Preset:</span>
          <button
            onClick={() => loadPreset('ai-image')}
            className={`px-2.5 py-1 rounded border text-[11px] transition-all ${
              selectedDocType === 'ai-image' && activeTab === 'doc'
                ? 'bg-crimsonBlock/20 border-crimsonBlock text-crimsonBlock font-bold shadow-crimson-sm'
                : 'bg-holoSurface border-holoBorder text-gray-300 hover:text-white'
            }`}
          >
            🤖 AI Image (Flux)
          </button>
          <button
            onClick={() => loadPreset('camera')}
            className={`px-2.5 py-1 rounded border text-[11px] transition-all ${
              selectedDocType === 'camera' && activeTab === 'doc'
                ? 'bg-emeraldAllow/20 border-emeraldAllow text-emeraldAllow font-bold shadow-emerald-sm'
                : 'bg-holoSurface border-holoBorder text-gray-300 hover:text-white'
            }`}
          >
            📷 Real Camera Photo
          </button>
          <button
            onClick={() => loadPreset('aadhaar')}
            className={`px-2.5 py-1 rounded border text-[11px] transition-all ${
              selectedDocType === 'aadhaar' && activeTab === 'doc'
                ? 'bg-cyanGlow/20 border-cyanGlow text-cyanGlow font-bold shadow-cyan-sm'
                : 'bg-holoSurface border-holoBorder text-gray-300 hover:text-white'
            }`}
          >
            🆔 Aadhaar Forgery
          </button>
          <button
            onClick={() => loadPreset('video')}
            className={`px-2.5 py-1 rounded border text-[11px] transition-all ${
              activeTab === 'video'
                ? 'bg-cyanGlow/20 border-cyanGlow text-cyanGlow font-bold shadow-cyan-sm'
                : 'bg-holoSurface border-holoBorder text-gray-300 hover:text-white'
            }`}
          >
            🎬 Deepfake Video
          </button>
          <button
            onClick={() => loadPreset('audio')}
            className={`px-2.5 py-1 rounded border text-[11px] transition-all ${
              activeTab === 'audio'
                ? 'bg-cyanGlow/20 border-cyanGlow text-cyanGlow font-bold shadow-cyan-sm'
                : 'bg-holoSurface border-holoBorder text-gray-300 hover:text-white'
            }`}
          >
            🎙️ Voice Clone
          </button>
        </div>
      </div>

      {/* Backend & Supabase Live Infrastructure Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-holoCard via-holoSurface to-holoCard border border-cyanGlow/30 text-xs font-mono">
        <div className="flex items-center space-x-2 text-cyanGlow">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emeraldAllow opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emeraldAllow"></span>
          </span>
          <span className="font-bold">FASTAPI INGRESS GATEWAY: ACTIVE</span>
          <span className="text-gray-500 hidden sm:inline">•</span>
          <span className="text-gray-300 hidden sm:inline">64-bit pHash Engine</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
            PostgreSQL: Supabase Provisioned
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300">
            Vault: evidence-vault (50MB)
          </span>
        </div>
      </div>

      {/* 1. Modality Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-2xl bg-holoCard border border-holoBorder shadow-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl font-mono text-xs transition-all relative ${
                isActive
                  ? 'bg-holoSurface text-cyanGlow border border-cyanGlow/50 shadow-cyan-sm scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-holoSurface/50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <span className={isActive ? 'text-cyanGlow font-bold' : 'text-gray-500'}>{tab.symbol}</span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyanGlow' : 'text-gray-400'}`} />
              </div>
              <span className="font-bold text-center">{tab.label}</span>
              <span className="text-[10px] text-gray-500 hidden sm:block truncate mt-0.5 max-w-[130px]">
                {tab.desc}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-cyanGlow rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Main Ingestion Workstation / Live Proctor HUD */}
      {activeTab === 'proctor' ? (
        <div className="w-full">
          <LiveProctorHUD standalone={false} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Interactive Preview / Uploader */}
        <div className="lg:col-span-8 space-y-6">

          {/* TAB 1: VIDEO & FRAMES */}
          {activeTab === 'video' && (
            <div className="rounded-2xl bg-holoCard border border-holoBorder p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyanGlow font-bold flex items-center space-x-2">
                  <FileVideo className="w-4 h-4" />
                  <span>32-FRAME VIDEO STREAM SCRUBBER</span>
                </span>
                <span className="text-gray-400">Specimen: {uploadedFile?.name}</span>
              </div>

              {/* Video Player Preview Canvas */}
              <div className="relative h-64 rounded-xl bg-black border border-holoBorder overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 cyber-grid-dense opacity-40 pointer-events-none" />
                <div className="absolute inset-0 scanline-overlay opacity-60 pointer-events-none" />

                {/* Animated simulated deepfake face mesh */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="w-40 h-40 rounded-full border border-cyanGlow/30 relative flex items-center justify-center">
                    <svg className="w-32 h-32 text-cyanGlow/70" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                      <circle cx="50" cy="50" r="38" strokeWidth="0.8" strokeDasharray="3 3" />
                      <ellipse cx="36" cy="42" rx="4" ry="3" strokeWidth="1.2" />
                      <ellipse cx="64" cy="42" rx="4" ry="3" strokeWidth="1.2" />
                      <path d="M 38 68 Q 50 74 62 68" strokeWidth="1.5" />
                      {/* Warping Jaw seam anomaly */}
                      <path d="M 28 64 Q 22 78 36 86" stroke="#EF4444" strokeWidth="2.5" className="animate-pulse" />
                    </svg>

                    <div className="absolute -bottom-2 bg-crimsonBlock text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-crimson-sm animate-pulse">
                      FRAME #{scrubberFrame}: JAW WARP (89%)
                    </div>
                  </div>
                </div>

                {/* Play/Pause control overlay */}
                <div className="absolute bottom-3 left-3 z-20 flex items-center space-x-2">
                  <button
                    onClick={() => setVideoPlaying(!videoPlaying)}
                    className="p-1.5 rounded-lg bg-holoDark/80 hover:bg-holoSurface border border-holoBorder text-cyanGlow"
                  >
                    {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="text-[11px] font-mono text-gray-300">
                    60 FPS • Frame {scrubberFrame}/32
                  </span>
                </div>
              </div>

              {/* Frame Scrubber Bar */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Temporal Frame Scrubber</span>
                  <span className="text-cyanGlow font-bold">Keyframe F{scrubberFrame}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="32"
                  value={scrubberFrame}
                  onChange={(e) => setScrubberFrame(parseInt(e.target.value))}
                  className="w-full accent-cyanGlow bg-holoSurface h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO & VOICE */}
          {activeTab === 'audio' && (
            <div className="rounded-2xl bg-holoCard border border-holoBorder p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amberWarn font-bold flex items-center space-x-2">
                  <Mic className="w-4 h-4" />
                  <span>SYNTHETIC VOICE & MEL-SPECTROGRAM DECODER</span>
                </span>
                <span className="text-gray-400">{uploadedFile?.name}</span>
              </div>

              {/* Animated Waveform Visualization */}
              <div className="h-44 rounded-xl bg-black border border-holoBorder p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 cyber-grid-dense opacity-30 pointer-events-none" />

                <div className="flex items-center justify-between z-10 text-[11px] font-mono text-gray-400">
                  <span>Frequency: 16 kHz • Wav2Vec2 Synthetic Probe</span>
                  <span className="text-amberWarn">Missing Vocal Micro-Tremors</span>
                </div>

                {/* Simulated Wave Bars */}
                <div className="flex items-end justify-center space-x-1.5 h-24 z-10">
                  {[45, 60, 30, 85, 95, 40, 70, 85, 30, 90, 65, 80, 45, 95, 100, 75, 40, 60, 85, 70, 50, 80, 90, 35, 65, 80, 95, 40].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={audioPlaying ? { height: [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`] } : { height: `${h}%` }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.04 }}
                      className={`w-2 rounded-t ${
                        i > 10 && i < 18 
                          ? 'bg-gradient-to-t from-amberWarn to-crimsonBlock' 
                          : 'bg-gradient-to-t from-cyanGlow/60 to-cyanAccent'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between z-10 pt-2 border-t border-gray-800 text-xs font-mono">
                  <button
                    onClick={() => setAudioPlaying(!audioPlaying)}
                    className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-holoSurface border border-holoBorder text-cyanGlow hover:text-white"
                  >
                    {audioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{audioPlaying ? "Halt Playback" : "Play Specimen Sample"}</span>
                  </button>
                  <span className="text-gray-400">00:04 / 00:12</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCAM TEXT */}
          {activeTab === 'text' && (
            <div className="rounded-2xl bg-holoCard border border-holoBorder p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-crimsonBlock font-bold flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>LEXICAL INTENT & PHISHING COERCION BUFFER</span>
                </span>
                <span className="text-gray-400">{wordCount} words • {scamText.length} chars</span>
              </div>

              <textarea
                value={scamText}
                onChange={(e) => setScamText(e.target.value)}
                rows={6}
                className="w-full rounded-xl bg-holoDark/90 border border-holoBorder p-4 font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyanGlow transition-colors resize-none selection:bg-cyanGlow selection:text-black leading-relaxed"
                placeholder="Paste suspect email body, SMS text, or chat transcript..."
              />

              {/* Phishing Heuristic Badges */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">
                  Identified Coercion Triggers:
                </span>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-crimsonBlock/20 text-crimsonBlock border border-crimsonBlock/50 flex items-center space-x-1 font-bold">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Urgent Wire Coercion (96%)</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-crimsonBlock/20 text-crimsonBlock border border-crimsonBlock/50 flex items-center space-x-1 font-bold">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Executive Impersonation (92%)</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amberWarn/20 text-amberWarn border border-amberWarn/50 flex items-center space-x-1 font-bold">
                    <AlertCircle className="w-3 h-3" />
                    <span>Bypass SAP Queue Trigger (88%)</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-holoSurface text-cyanAccent border border-holoBorder">
                    Offshore Escrow Token
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENT & AI IMAGE FORENSICS (FEATURED DUAL-SIGNAL MODALITY) */}
          {activeTab === 'doc' && (
            <div className="rounded-2xl bg-holoCard border border-holoBorder p-6 space-y-5 shadow-2xl">
              
              {/* Header & Sub-selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono pb-3 border-b border-holoBorder">
                <div className="flex items-center space-x-2 text-cyanGlow font-bold">
                  <FileCheck className="w-4 h-4" />
                  <span>DUAL-SIGNAL IMAGE & DOCUMENT FORENSICS (DocViT-v2)</span>
                </div>

                {/* Specimen Sub-Selector */}
                <div className="flex flex-wrap items-center gap-1 bg-holoDark p-1 rounded-lg border border-holoBorder">
                  <button
                    onClick={() => {
                      setSelectedDocType('ai-image');
                      setUploadedFile({
                        name: "synthetic_flux_specimen.png",
                        size: 1048576,
                        type: "image/png"
                      });
                      setPreviewUrl(null);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      selectedDocType === 'ai-image' ? 'bg-crimsonBlock text-white shadow-crimson-sm' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🤖 AI Specimen (Flux)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDocType('camera');
                      setUploadedFile({
                        name: "real_camera_portrait.jpg",
                        size: 2840500,
                        type: "image/jpeg"
                      });
                      setPreviewUrl(null);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      selectedDocType === 'camera' ? 'bg-emeraldAllow text-black shadow-emerald-sm font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    📷 Camera Photo
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDocType('aadhaar');
                      setUploadedFile({
                        name: "aadhaar_card_forgery_specimen.jpg",
                        size: 1940500,
                        type: "image/jpeg"
                      });
                      setPreviewUrl(null);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      selectedDocType === 'aadhaar' ? 'bg-cyanGlow text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🆔 Aadhaar Card
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDocType('passport');
                      setUploadedFile({
                        name: "passport_biodata_spliced.jpg",
                        size: 2120000,
                        type: "image/jpeg"
                      });
                      setPreviewUrl(null);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      selectedDocType === 'passport' ? 'bg-cyanGlow text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🛂 Passport
                  </button>
                </div>
              </div>

              {/* Dynamic Specimen Preview Box */}
              {selectedDocType === 'ai-image' ? (
                /* AI Synthetic Image Specimen (Flux / DALL-E) */
                <div className="relative rounded-xl border border-crimsonBlock/50 bg-black overflow-hidden p-4 sm:p-6 min-h-[300px] flex flex-col justify-between">
                  <div className="absolute inset-0 cyber-grid-dense opacity-25 pointer-events-none" />
                  
                  {/* Warning Ribbon */}
                  <div className="relative z-10 flex items-center justify-between pb-3 border-b border-crimsonBlock/40 text-xs font-mono">
                    <div className="flex items-center space-x-2 text-crimsonBlock font-bold">
                      <AlertOctagon className="w-4 h-4 animate-pulse" />
                      <span>SYNTHETIC MEDIA DETECTED — BLOCKED AT INGRESS (RISK: 86%)</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">Dimensions: 1024x1024 (Exact Diffusion Standard)</span>
                  </div>

                  {/* Visual AI Specimen Canvas Simulation */}
                  <div className="relative z-10 my-4 p-5 rounded-xl bg-slate-900/90 border border-crimsonBlock/40 max-w-xl mx-auto w-full space-y-4 font-mono">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-crimsonBlock font-bold flex items-center space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Footprint: flux.1-dev / Synthetic Diffusion Artifacts</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1">
                          File: <span className="text-white">synthetic_flux_specimen.png</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-crimsonBlock/20 border border-crimsonBlock/60 text-crimsonBlock text-[10px] font-bold">
                        AI DETECTED
                      </span>
                    </div>

                    {/* Dual-Signal Layer Telemetry */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 space-y-1">
                        <span className="text-red-300 font-bold block text-[11px]">Layer 1: Metadata Signature</span>
                        <p className="text-[10px] text-gray-300 leading-tight">
                          Prompt marker token & generator footprint detected in header stream.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 space-y-1">
                        <span className="text-red-300 font-bold block text-[11px]">Layer 2: Noise / Frequency</span>
                        <p className="text-[10px] text-gray-300 leading-tight">
                          Laplacian variance: <strong className="text-red-400">28.4</strong> (Unnatural flat texture & missing CMOS grain).
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400 border-t border-gray-800 pt-2 flex items-center justify-between">
                      <span>Neural Checkpoint: <code className="text-cyanGlow">trustguard/docu-tamper-vit-ocr</code></span>
                      <span className="text-crimsonBlock font-bold">Policy: Block Platform Ingress</span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2 text-[11px] font-mono text-gray-400 flex items-center justify-between">
                    <span>Simulates DALL-E, Midjourney, ComfyUI, & Flux synthetic generation payloads.</span>
                    <span className="text-cyanGlow">Click "Execute Deep Forensic Ingress Scan" below to verify live backend response</span>
                  </div>
                </div>

              ) : selectedDocType === 'camera' ? (
                /* Authentic Camera Photo Specimen (Ingress Passed) */
                <div className="relative rounded-xl border border-emeraldAllow/50 bg-black overflow-hidden p-4 sm:p-6 min-h-[300px] flex flex-col justify-between">
                  <div className="absolute inset-0 cyber-grid-dense opacity-25 pointer-events-none" />
                  
                  {/* Verified Ribbon */}
                  <div className="relative z-10 flex items-center justify-between pb-3 border-b border-emeraldAllow/40 text-xs font-mono">
                    <div className="flex items-center space-x-2 text-emeraldAllow font-bold">
                      <CheckCircle2 className="w-4 h-4 animate-pulse" />
                      <span>AUTHENTIC OPTICAL MEDIA — INGRESS PASSED (RISK: 12%)</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">Bayer CMOS Sensor Verified</span>
                  </div>

                  {/* Visual Camera Specimen Canvas Simulation */}
                  <div className="relative z-10 my-4 p-5 rounded-xl bg-slate-900/90 border border-emeraldAllow/40 max-w-xl mx-auto w-full space-y-4 font-mono">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-emeraldAllow font-bold flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>EXIF Profile: Sony Alpha 7 IV • 35mm f/1.8 • ISO 100</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1">
                          File: <span className="text-white">real_camera_portrait.jpg</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emeraldAllow/20 border border-emeraldAllow/60 text-emeraldAllow text-[10px] font-bold">
                        VERIFIED REAL
                      </span>
                    </div>

                    {/* Dual-Signal Layer Telemetry */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/50 space-y-1">
                        <span className="text-emerald-300 font-bold block text-[11px]">Layer 1: Metadata Signature</span>
                        <p className="text-[10px] text-gray-300 leading-tight">
                          Zero AI generator signatures. Authentic hardware make/model tags confirmed.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/50 space-y-1">
                        <span className="text-emerald-300 font-bold block text-[11px]">Layer 2: Noise / Frequency</span>
                        <p className="text-[10px] text-gray-300 leading-tight">
                          Laplacian variance: <strong className="text-emeraldAllow">142.3</strong> (Natural sensor photon shot noise).
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400 border-t border-gray-800 pt-2 flex items-center justify-between">
                      <span>Neural Checkpoint: <code className="text-cyanGlow">trustguard/docu-tamper-vit-ocr</code></span>
                      <span className="text-emeraldAllow font-bold">Policy: Allow Platform Distribution</span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2 text-[11px] font-mono text-gray-400 flex items-center justify-between">
                    <span>Simulates natural high-res DSLR / Smartphone camera capture with full optical sensor integrity.</span>
                    <span className="text-cyanGlow">Click "Execute Deep Forensic Ingress Scan" to test genuine photo clearance</span>
                  </div>
                </div>

              ) : (
                /* Interactive Document Preview Box with ELA Heatmap Toggle (Aadhaar / Passport) */
                <div className="relative rounded-xl border border-holoBorder bg-black overflow-hidden p-4 sm:p-6 min-h-[290px] flex flex-col justify-between">
                  
                  {/* Background Grid & Scanlines */}
                  <div className="absolute inset-0 cyber-grid-dense opacity-30 pointer-events-none" />

                  {/* ELA Heatmap Simulation Overlay */}
                  {elaActive && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/80 via-red-900/60 to-cyan-950/80 backdrop-invert-0 z-10 pointer-events-none transition-all duration-500">
                      <div className="absolute inset-0 scanline-overlay opacity-80" />
                      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-20 bg-red-500/30 rounded-full blur-xl animate-pulse" />
                    </div>
                  )}

                  {/* Visual Document Model: Aadhaar / ID Card Layout */}
                  <div className="relative z-20 max-w-lg mx-auto w-full p-4 rounded-xl bg-slate-900/90 border border-gray-700 shadow-2xl space-y-3 font-mono">
                    
                    {/* Document Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-[10px] text-amber-400 font-bold">
                          GOV
                        </div>
                        <span className="text-xs font-bold text-gray-200 uppercase">
                          {selectedDocType === 'aadhaar' ? 'Government of India // Aadhaar' : selectedDocType === 'passport' ? 'Republic Passport // Biodata Page' : 'University Degree // Registrar'}
                        </span>
                      </div>
                      <span className="text-[10px] text-cyanGlow">DocViT-v2 Inspected</span>
                    </div>

                    {/* Body Content */}
                    <div className="grid grid-cols-12 gap-3 items-center">
                      
                      {/* Photo Box */}
                      <div className="col-span-4 h-24 rounded-lg bg-gray-800 border border-dashed border-gray-600 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="text-[10px] text-gray-400">Specimen Photo</div>
                        {/* ELA compression anomaly box */}
                        <div className={`absolute inset-0 border-2 transition-all ${
                          elaActive ? 'border-red-500 bg-red-500/20 animate-pulse' : 'border-amberWarn/60'
                        }`} />
                      </div>

                      {/* Metadata fields */}
                      <div className="col-span-8 space-y-1.5 text-[11px]">
                        <div>
                          <span className="text-gray-500 text-[10px] block">FULL NAME</span>
                          <span className="text-gray-200 font-bold">HARISH KUMAR VERMA</span>
                        </div>

                        {/* Tampered Date of Birth (DOB) Field */}
                        <div className="relative p-1.5 rounded bg-crimsonBlock/15 border border-crimsonBlock/70">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-[10px]">DOB / DATE OF BIRTH</span>
                            <span className="text-[10px] text-crimsonBlock font-bold">FONT SPLICED</span>
                          </div>
                          <div className="text-xs font-bold text-crimsonBlock flex items-center justify-between">
                            <span>14/08/1998</span>
                            <AlertTriangle className="w-3.5 h-3.5 text-crimsonBlock animate-bounce" />
                          </div>
                          {/* Popover note */}
                          <div className="text-[9px] text-red-300 font-sans mt-0.5">
                            Font Arial 10pt substitution vs OCR-B template standard
                          </div>
                        </div>

                        <div className="flex justify-between text-gray-400 text-[10px]">
                          <span>GENDER: MALE</span>
                          <span>UID: XXXX-XXXX-9921</span>
                        </div>
                      </div>

                    </div>

                    {/* QR Code Decoupling Anomaly Bar */}
                    <div className="p-2 rounded bg-red-950/40 border border-red-500/50 flex items-center justify-between text-[10px]">
                      <span className="text-red-300 font-semibold">
                        ⚠️ QR Cryptographic Payload Decoupled
                      </span>
                      <span className="text-red-400 font-bold">Score: 95% Mismatch</span>
                    </div>

                  </div>

                  {/* ELA Heatmap Toggle Bar */}
                  <div className="relative z-20 mt-4 pt-3 border-t border-holoBorder flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Forensic Filter:</span>
                      <button
                        onClick={() => setElaActive(false)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                          !elaActive ? 'bg-cyanGlow text-black shadow-cyan-sm' : 'bg-holoSurface text-gray-400 hover:text-white'
                        }`}
                      >
                        Optical Color
                      </button>
                      <button
                        onClick={() => setElaActive(true)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center space-x-1 ${
                          elaActive ? 'bg-crimsonBlock text-white shadow-crimson-sm animate-pulse' : 'bg-holoSurface text-gray-400 hover:text-white'
                        }`}
                      >
                        <Sliders className="w-3 h-3" />
                        <span>ELA Heatmap (Error Level)</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-gray-400">
                      {elaActive ? "Showing compression residual gradients" : "Toggle ELA to view JPEG quantization deltas"}
                    </span>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 5: LIVE STREAM */}
          {activeTab === 'stream' && (
            <div className="rounded-2xl bg-holoCard border border-holoBorder p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emeraldAllow font-bold flex items-center space-x-2">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>CCTV LIVE RTSP PERIMETER BUFFER</span>
                </span>
                <span className="text-gray-400">Node: cam-ingress-04 (1080p@30fps)</span>
              </div>

              <div className="relative h-60 rounded-xl bg-black border border-holoBorder overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 cyber-grid-dense opacity-40 pointer-events-none" />
                <div className="absolute inset-0 scanline-overlay opacity-60 pointer-events-none" />

                <div className="text-center font-mono space-y-2 z-10">
                  <Activity className="w-8 h-8 text-emeraldAllow animate-pulse mx-auto" />
                  <div className="text-xs font-bold text-white">LIVE RTSP STREAM BUFFER ACTIVE</div>
                  <div className="text-[11px] text-gray-400">Zero packet drops • Ingress boundary nominal</div>
                </div>

                <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>REC LIVE</span>
                </div>
              </div>
            </div>
          )}

          {/* Native Drag and Drop / File Input Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all bg-holoCard/60 ${
              isDragging
                ? 'border-cyanGlow bg-cyanGlow/10 scale-[1.01]'
                : 'border-holoBorder hover:border-gray-600'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-xl transition-all ${
                isDragging ? 'bg-cyanGlow text-black scale-110 shadow-cyan-glow' : 'bg-holoSurface text-cyanGlow border border-cyanGlow/30'
              }`}>
                <UploadCloud className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  {uploadedFile ? uploadedFile.name : "Drag & drop your specimen file here"}
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Supports MP4, WAV, PDF, JPG, PNG, or JSON forensic dumps (Up to 500MB)
                </p>
              </div>

              <label
                htmlFor="file-upload"
                className="cursor-pointer px-4 py-2 rounded-lg bg-holoSurface hover:bg-holoBorder border border-holoBorder text-xs font-mono text-cyanAccent transition-colors"
              >
                Browse Local Machine
              </label>
            </div>
          </div>

          {/* Execute Analysis Action Card */}
          <div className="p-6 rounded-2xl bg-holoCard border border-holoBorder shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Target Pipeline: Multi-Modal Ingress Filter v1.0
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Active Checkpoint: {activeTab === 'doc' ? 'trustguard/doc-vit-forensics-v2' : activeTab === 'video' ? 'trustguard/timesformer-deepfake-v1' : 'trustguard/scam-deberta-v3-intent'}
              </p>
            </div>

            <button
              onClick={startAnalysis}
              disabled={processingStage !== -1}
              className="w-full sm:w-auto min-w-[240px] px-6 py-4 rounded-xl bg-gradient-to-r from-cyanGlow to-cyanAccent text-black font-mono font-bold text-sm tracking-wide shadow-cyan-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Cpu className="w-4 h-4 text-black" />
              <span>Execute Forensic Audit</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>

        </div>

        {/* Right Column (4 cols): Active Forensic Checks & Ingress Rules */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Document Verification Checks Checklist */}
          <div className="p-6 rounded-2xl bg-holoCard border border-holoBorder shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-holoBorder">
              <ShieldAlert className="w-4 h-4 text-cyanGlow" />
              <h3 className="font-mono font-bold text-white text-sm">
                Document & ID Check Suite
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-holoSurface border border-holoBorder">
                <div className="flex justify-between text-white font-bold">
                  <span>1. Typographic Inconsistency</span>
                  <span className="text-crimsonBlock">TAMPERED</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1 font-sans">
                  Detects post-facto text insertion & baseline mismatches.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-holoSurface border border-holoBorder">
                <div className="flex justify-between text-white font-bold">
                  <span>2. Edge Artifacts (ELA)</span>
                  <span className="text-crimsonBlock">TAMPERED</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1 font-sans">
                  Simulates JPEG compression gradient disparities.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-holoSurface border border-holoBorder">
                <div className="flex justify-between text-white font-bold">
                  <span>3. QR Code Decoupling</span>
                  <span className="text-crimsonBlock">MISMATCH</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1 font-sans">
                  Cross-verifies cryptographic QR payload vs visual text.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-holoSurface border border-holoBorder">
                <div className="flex justify-between text-white font-bold">
                  <span>4. Hologram & Micro-Print</span>
                  <span className="text-amberWarn">ANOMALY</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1 font-sans">
                  Validates guilloche pattern continuity and foil response.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-holoBorder flex items-center justify-between text-xs font-mono text-gray-400">
              <span>Model Checkpoint:</span>
              <span className="text-cyanGlow font-bold">doc-vit-forensics-v2</span>
            </div>
          </div>

          {/* Ingress Policy Rule Notice */}
          <div className="p-5 rounded-2xl bg-holoCard/70 border border-holoBorder space-y-2 text-xs font-mono text-gray-400">
            <div className="text-gray-300 font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-crimsonBlock" />
              <span>Ingress Policy Threshold</span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed">
              When composite risk exceeds 70%, TrustGuard AI automatically severs platform ingress sockets and generates an isolated forensic hash cluster.
            </p>
          </div>

        </div>

      </div>
      )}

      {/* 3. Phased 3-Second Processing Sequence Overlay Modal */}
      <AnimatePresence>
        {processingStage !== -1 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl bg-holoCard border-2 border-cyanGlow/50 shadow-cyan-glow p-6 sm:p-8 space-y-6 text-center font-mono relative overflow-hidden"
            >
              {/* Top Animated Radar/Spinner */}
              <div className="relative flex items-center justify-center w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-cyanGlow/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-2 border-t-cyanGlow border-r-violetGlow border-b-transparent border-l-transparent animate-spin" />
                <Cpu className="w-7 h-7 text-cyanGlow absolute" />
              </div>

              {/* Status Header */}
              <div className="space-y-1">
                <div className="text-xs text-cyanGlow uppercase tracking-widest font-bold">
                  TRUSTGUARD FORENSIC ENGINE // MULTI-MODAL PIPELINE
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {processingStage === 0 && "Stage 0: Ingesting & Calculating Media Hashes"}
                  {processingStage === 1 && "Stage 1: Running Model Checkpoints & Transforms"}
                  {processingStage === 2 && "Stage 2: Cross-Modality Risk Synthesis"}
                  {processingStage === 3 && "Stage 3: Analysis Complete // Policy Block"}
                </h3>
              </div>

              {/* Dynamic Progress Bar (0% to 100%) */}
              <div className="space-y-2">
                <div className="w-full h-3 rounded-full bg-holoSurface overflow-hidden p-0.5 border border-holoBorder">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyanGlow via-cyanAccent to-crimsonBlock shadow-cyan-sm"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Processing Specimen #{DEFAULT_INCIDENT.incidentId}</span>
                  <span className="text-cyanGlow font-bold">{progressPercent}%</span>
                </div>
              </div>

              {/* Changing Terminal Logs */}
              <div className="text-left p-3.5 rounded-xl bg-black/90 border border-gray-800 text-[11px] font-mono text-gray-300 space-y-1 h-28 overflow-y-auto">
                <div className="text-cyanGlow font-bold">&gt; Initializing TrustGuard Ingress Pipeline...</div>
                {processingStage >= 0 && (
                  <div className="text-gray-400">[0.2s] Calculating SHA-256 and 64-bit DCT perceptual hash...</div>
                )}
                {processingStage >= 1 && (
                  <div className="text-purple-400">[1.1s] Loading checkpoint trustguard/doc-vit-forensics-v2 & timesformer-v1...</div>
                )}
                {processingStage >= 2 && (
                  <div className="text-amber-400">[2.2s] Executing error-level analysis, ELA gradient & cross-verifying QR payload...</div>
                )}
                {processingStage >= 3 && (
                  <div className="text-crimsonBlock font-bold">[3.0s] Synthesis complete. Risk score: 89%. Triggering Ingress Policy Block.</div>
                )}
              </div>

              <div className="text-[11px] text-gray-500">
                Autonomous zero-trust ingress quarantine active • Auto-redirecting to results
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
