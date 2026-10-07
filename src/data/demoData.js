/**
 * TrustGuard AI - Central Incident Data Contract
 * Forensic specimen payload: TG-2026-9041X
 * Multimodal threat intelligence: Deepfake, Voice Clone, Scam Lexical & Document/ID Forgery
 */

export const INCIDENT_DATA = {
  incidentId: "TG-2026-9041X",
  timestamp: "2026-10-06T00:15:22Z",
  pHash: "pHash: 8f3a91bc7d20",
  sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  containmentStatus: "BLOCKED AT INGRESS",
  overallRisk: 86,
  riskLevel: "HIGH",
  policyAction: "Block inside platform",
  selectedModality: "video",
  forensicSummary: "What our models found: Synthetic generation footprint, anomalous frequency distribution, or spliced compression artifacts detected.",
  subScores: [
    {
      id: "video-temporal",
      vector: "Video & Temporal Deepfake",
      checkpoint: "trustguard/timesformer-deepfake-v1",
      score: 82,
      status: "High Risk Block",
      statusType: "high",
      latency: "142ms",
      details: "High-frequency texture warping identified along jawline contour across 32 video frames."
    },
    {
      id: "document-forgery",
      vector: "Document / Image Forgery",
      checkpoint: "trustguard/docu-tamper-vit-ocr",
      score: 86,
      status: "High Risk Block",
      statusType: "high",
      latency: "112ms",
      details: "Synthetic generation footprint, anomalous frequency distribution, or spliced compression artifacts detected."
    },
    {
      id: "voice-synthesis",
      vector: "Voice Synthesis",
      checkpoint: "trustguard/wav2vec2-synthetic-voice",
      score: 76,
      status: "Warn / Verify",
      statusType: "med",
      latency: "89ms",
      details: "Spectral flatness and missing vocal tract micro-tremors consistent with neural voice cloning."
    },
    {
      id: "phishing-lexical",
      vector: "Phishing / Lexical",
      checkpoint: "trustguard/scam-deberta-v3-intent",
      score: 91,
      status: "High Risk Block",
      statusType: "high",
      latency: "34ms",
      details: "Urgent unverified wire transfer request impersonating executive authority."
    }
  ],
  traceMatches: [
    {
      id: "match-1",
      source: "Known Telegram Phishing Archive #4",
      similarity: 94,
      earliestSeen: "14 hours ago",
      actorCluster: "APT-UNC3881",
      fingerprintConfidence: "Cryptographic Perceptual Match"
    },
    {
      id: "match-2",
      source: "Public Video Mirror Syndicate",
      similarity: 87,
      earliestSeen: "2 days ago",
      actorCluster: "DeepClone-Syndicate",
      fingerprintConfidence: "Heuristic Frame Align"
    }
  ],
  // Dedicated document verification checks
  documentChecks: [
    {
      id: "check-1",
      name: "Font & Typographic Inconsistency",
      description: "Detects post-facto text insertion and mismatched font kerning or anti-aliasing.",
      status: "TAMPERED",
      risk: 92,
      details: "Date of Birth (DOB) field rendered in Arial 10pt with uneven baseline vs OCR-B template standard."
    },
    {
      id: "check-2",
      name: "Digital Tampering & Edge Artifacts (ELA)",
      description: "Error Level Analysis simulating JPEG compression gradient disparities.",
      status: "TAMPERED",
      risk: 88,
      details: "High-contrast error delta around photo bounding box and national ID emblem boundary."
    },
    {
      id: "check-3",
      name: "QR Code & Barcode Decoupling",
      description: "Cross-verifies cryptographic QR payload against optical OCR text.",
      status: "MISMATCH",
      risk: 95,
      details: "Decoded QR string UID resolves to 'XXXX-XXXX-4109', whereas visual print displays 'XXXX-XXXX-9921'."
    },
    {
      id: "check-4",
      name: "Micro-print & Hologram Integrity",
      description: "Validates guilloche pattern continuity and holographic foil boundary response.",
      status: "ANOMALY",
      risk: 74,
      details: "Guilloche wave line broken around the left security perimeter; synthetic clone stamp artifact."
    }
  ]
};

// Default export alias for seamless consumer compatibility
export const DEFAULT_INCIDENT = INCIDENT_DATA;

// Specimen contract for genuine human camera photos (Ingress Passed, Risk 12%)
export const AUTHENTIC_PHOTO_DATA = {
  incidentId: "TG-2026-9042P",
  timestamp: "2026-10-06T00:20:15Z",
  pHash: "pHash: a4f2c9183d90",
  sha256: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  containmentStatus: "INGRESS PASSED",
  overallRisk: 12,
  riskLevel: "LOW",
  policyAction: "Allow",
  selectedModality: "image_doc",
  forensicSummary: "What our models found: Authentic image structure verified. Uniform noise variance and pixel grid continuity indicate untampered media.",
  subScores: [
    {
      id: "document-forgery",
      vector: "Document / Image Forgery",
      checkpoint: "trustguard/docu-tamper-vit-ocr",
      score: 12,
      status: "Safe",
      statusType: "low",
      latency: "84ms",
      details: "Uniform sensor noise, natural optical grain, authentic camera profile verified."
    }
  ],
  traceMatches: [],
  documentChecks: [
    {
      id: "check-1",
      name: "Metadata & Signature Inspection",
      description: "Scans for AI diffusion generator headers, C2PA claims, or prompt signatures.",
      status: "VERIFIED",
      risk: 10,
      details: "No synthetic diffusion footprints or prompt injection markers found."
    },
    {
      id: "check-2",
      name: "Frequency & Texture Noise (Laplacian Filter)",
      description: "High-frequency edge and sensor noise density analysis.",
      status: "VERIFIED",
      risk: 12,
      details: "Uniform sensor noise and natural optical grain verified (Laplacian variance: 142.3)."
    },
    {
      id: "check-3",
      name: "Digital Tampering & Edge Artifacts (ELA)",
      description: "Error Level Analysis simulating JPEG compression gradient disparities.",
      status: "VERIFIED",
      risk: 12,
      details: "Uniform compression levels observed across all document sectors."
    },
    {
      id: "check-4",
      name: "Micro-print & Optical Grid Integrity",
      description: "Validates optical pattern continuity and pixel grid alignment.",
      status: "VERIFIED",
      risk: 12,
      details: "Pixel grid continuity and sensor profile verified."
    }
  ]
};
