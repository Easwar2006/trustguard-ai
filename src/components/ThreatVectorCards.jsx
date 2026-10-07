import React from 'react';
import { 
  Video, 
  Mic, 
  MessageSquare, 
  Share2, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Search, 
  Lock, 
  Layers,
  FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ThreatVectorCards() {
  const cards = [
    {
      id: "deepfakes",
      icon: Video,
      title: "Deepfake Video Warping",
      tagline: "Bi-directional Spatiotemporal Analysis",
      description: "Detects neural face-swaps, diffusion artifacts, jawline seam jitter, and unnatural micro-expressions across high-frequency 60 FPS temporal keyframes.",
      metric: "TimeSformer-v1",
      confidence: "99.4% Bench Accuracy",
      glowColor: "border-crimsonBlock/50 hover:border-crimsonBlock",
      iconBg: "bg-crimsonBlock/20 text-crimsonBlock",
      actionLink: "/results"
    },
    {
      id: "voice-clones",
      icon: Mic,
      title: "Voice Clone Synthesis",
      tagline: "Spectral Flatness & Mel-Spectrograms",
      description: "Identifies text-to-speech vocoders and neural voice conversion by analyzing missing biological vocal tract resonances and harmonic phase distortion.",
      metric: "Wav2Vec2-Synthetic",
      confidence: "89ms Ingress Latency",
      glowColor: "border-amberWarn/50 hover:border-amberWarn",
      iconBg: "bg-amberWarn/20 text-amberWarn",
      actionLink: "/results"
    },
    {
      id: "ai-images-docs",
      icon: FileCheck,
      title: "AI Image & Doc Forgery",
      tagline: "Dual-Signal Ingress Inspection",
      description: "Inspects Layer 1 AI prompt/exif footprints and Layer 2 Laplacian noise variance to block synthetic media and forged identity documents.",
      metric: "DocViT-v2 Dual-Signal",
      confidence: "112ms Ingress Verdict",
      glowColor: "border-crimsonBlock/50 hover:border-crimsonBlock",
      iconBg: "bg-crimsonBlock/20 text-crimsonBlock",
      actionLink: "/analyze"
    },
    {
      id: "fraud-messages",
      icon: MessageSquare,
      title: "Fraud & Social Engineering",
      tagline: "DeBERTa-v3 Intent & Urgency Heuristics",
      description: "Parses lexical urgency, spoofed executive authority, phishing hyperlinks, and malicious wire transfer coercion triggers inside chat, email, and SMS streams.",
      metric: "Scam-DeBERTa-v3",
      confidence: "34ms Token Classify",
      glowColor: "border-crimsonBlock/50 hover:border-crimsonBlock",
      iconBg: "bg-crimsonBlock/20 text-crimsonBlock",
      actionLink: "/analyze"
    },
    {
      id: "syndicated-exploits",
      icon: Share2,
      title: "Syndicated Exploits",
      tagline: "Perceptual Hash Cluster Attribution",
      description: "Computes robust pHash fingerprints to match inbound payloads against known threat syndicates, Telegram dark-web archives, and mirror campaigns.",
      metric: "Perceptual Hash Engine",
      confidence: "Near-Zero Collision Rate",
      glowColor: "border-cyanGlow/50 hover:border-cyanGlow",
      iconBg: "bg-cyanGlow/20 text-cyanGlow",
      actionLink: "/trace"
    }
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-holoBorder">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyanGlow uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>DEFENSE MATRIX CAPABILITIES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Multimodal Ingress Threat Vectors
            </h2>
          </div>
          <p className="text-sm font-mono text-gray-400 mt-2 md:mt-0">
            Automated deep learning defenses executing synchronously at platform boundary.
          </p>
        </div>

        {/* 5 Threat Vector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className={`relative rounded-xl bg-holoCard/90 border ${c.glowColor} p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${c.iconBg} border border-current/20`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 bg-holoSurface px-2 py-0.5 rounded border border-holoBorder">
                      {c.metric}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyanGlow transition-colors">
                    {c.title}
                  </h3>
                  <div className="text-[11px] font-mono text-cyanAccent/90 mt-0.5 mb-2.5">
                    {c.tagline}
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {c.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-holoBorder/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400">
                    {c.confidence}
                  </span>
                  <Link
                    to={c.actionLink}
                    className="flex items-center space-x-1 text-xs font-mono font-bold text-cyanGlow hover:text-white transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
