"""TrustGuard AI - Central Fallback Data Contract.

Matches the frontend schema and provides a rock-solid safety net ensuring
the frontend demo never breaks, even during unhandled exceptions or memory pressure.
"""

from datetime import datetime, timezone
from typing import Any, Dict
import copy

def get_current_iso_timestamp() -> str:
    """Return current UTC time in ISO-8601 format."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

FALLBACK_RESPONSE: Dict[str, Any] = {
    "incidentId": "TG-2026-9041X",
    "timestamp": get_current_iso_timestamp(),
    "pHash": "pHash: 8f3a91bc7d20",
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "containmentStatus": "BLOCKED AT INGRESS",
    "overallRisk": 86,
    "riskLevel": "HIGH",
    "policyAction": "Block inside platform",
    "selectedModality": "multimodal",
    "subScores": [
        {
            "id": "video-temporal",
            "vector": "Video & Temporal Deepfake",
            "checkpoint": "trustguard/timesformer-deepfake-v1",
            "score": 82,
            "status": "High Risk Block",
            "statusType": "high",
            "latency": "142ms",
            "details": "High-frequency texture warping identified along jawline contour across 32 consecutive video frames."
        },
        {
            "id": "voice-synthesis",
            "vector": "Voice Synthesis",
            "checkpoint": "trustguard/wav2vec2-synthetic-voice",
            "score": 76,
            "status": "Warn / Verify",
            "statusType": "med",
            "latency": "89ms",
            "details": "Spectral flatness and missing vocal tract micro-tremors consistent with neural voice cloning."
        },
        {
            "id": "phishing-lexical",
            "vector": "Phishing / Lexical",
            "checkpoint": "trustguard/scam-deberta-v3-intent",
            "score": 91,
            "status": "High Risk Block",
            "statusType": "high",
            "latency": "34ms",
            "details": "Urgent unverified wire transfer request impersonating executive authority."
        },
        {
            "id": "doc-forgery",
            "vector": "Document / ID Forgery",
            "checkpoint": "trustguard/docu-tamper-vit-ocr",
            "score": 88,
            "status": "High Risk Block",
            "statusType": "high",
            "latency": "118ms",
            "details": "Font mismatch in DOB block and spliced boundary artifacts on Aadhaar/Certificate scan."
        }
    ],
    "traceMatches": [
        {
            "id": "match-1",
            "source": "Known Telegram Phishing Archive #4",
            "similarity": 94,
            "earliestSeen": "14 hours ago",
            "actorCluster": "APT-UNC3881",
            "fingerprintConfidence": "Cryptographic Perceptual Match"
        },
        {
            "id": "match-2",
            "source": "Public Video Mirror Syndicate",
            "similarity": 87,
            "earliestSeen": "2 days ago",
            "actorCluster": "DeepClone-Syndicate",
            "fingerprintConfidence": "Heuristic Frame Align"
        }
    ],
    "documentChecks": [
        {
            "id": "check-1",
            "name": "Font & Typographic Inconsistency",
            "description": "Detects post-facto text insertion and mismatched font kerning or anti-aliasing.",
            "status": "TAMPERED",
            "risk": 92,
            "details": "Date of Birth (DOB) field rendered in Arial 10pt with uneven baseline vs OCR-B template standard."
        },
        {
            "id": "check-2",
            "name": "Digital Tampering & Edge Artifacts (ELA)",
            "description": "Error Level Analysis simulating JPEG compression gradient disparities.",
            "status": "TAMPERED",
            "risk": 88,
            "details": "High-contrast error delta around photo bounding box and national ID emblem boundary."
        },
        {
            "id": "check-3",
            "name": "QR Code & Barcode Decoupling",
            "description": "Cross-verifies cryptographic QR payload against optical OCR text.",
            "status": "MISMATCH",
            "risk": 95,
            "details": "Decoded QR string UID resolves to 'XXXX-XXXX-4109', whereas visual print displays 'XXXX-XXXX-9921'."
        },
        {
            "id": "check-4",
            "name": "Micro-print & Hologram Integrity",
            "description": "Validates guilloche pattern continuity and holographic foil boundary response.",
            "status": "ANOMALY",
            "risk": 74,
            "details": "Guilloche wave line broken around the left security perimeter; synthetic clone stamp artifact."
        }
    ]
}

def get_fresh_fallback_response() -> Dict[str, Any]:
    """Return a fresh copy of FALLBACK_RESPONSE with an updated timestamp."""
    resp = copy.deepcopy(FALLBACK_RESPONSE)
    resp["timestamp"] = get_current_iso_timestamp()
    return resp
