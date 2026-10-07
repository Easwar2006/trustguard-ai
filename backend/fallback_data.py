"""TrustGuard AI - Fallback Intelligence & Baseline Single-Modality Contracts.

Provides dedicated single-modality templates:
- IMAGE_FALLBACK
- VIDEO_FALLBACK
- AUDIO_FALLBACK
- TEXT_FALLBACK
Along with get_fallback_by_modality() and backward-compatible FALLBACK_RESPONSE.
"""

from datetime import datetime, timezone
import copy
from typing import Any, Dict, Optional


def get_fresh_timestamp() -> str:
    """Return current UTC ISO-8601 formatted timestamp string."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# 1. IMAGE / DOCUMENT FALLBACK (Single Modality)
def create_image_fallback() -> Dict[str, Any]:
    ts = get_fresh_timestamp()
    return {
        "incidentId": "TG-2026-9041X",
        "id": "TG-2026-9041X",
        "timestamp": ts,
        "created_at": ts,
        "file_name": "aadhaar_identity_tampered_specimen.jpg",
        "file_type": "doc",
        "selectedModality": "doc",
        "pHash": "pHash: 8f3a91bc7d20",
        "phash": "pHash: 8f3a91bc7d20",
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "overallRisk": 88,
        "overall_risk": 88,
        "riskLevel": "HIGH",
        "risk_level": "HIGH",
        "containmentStatus": "BLOCKED AT INGRESS",
        "containment_status": "BLOCKED AT INGRESS",
        "policyAction": "Block inside platform & quarantine document specimen",
        "subScores": [
            {
                "id": "document-forgery",
                "vector": "Document / Image Forgery",
                "vector_name": "Document / Image Forgery",
                "checkpoint": "trustguard/docu-tamper-vit-ocr",
                "score": 88,
                "status": "High Risk Block",
                "statusType": "high",
                "latency": "118ms",
                "details": "Font mismatch, spliced photo boundary, and edge compression artifacts detected."
            }
        ],
        "traceMatches": [
            {
                "id": "trace-match-1",
                "source": "Known Telegram Phishing Archive #4",
                "source_name": "Known Telegram Phishing Archive #4",
                "similarity": 94,
                "earliestSeen": "14 hours ago",
                "earliest_seen": "14 hours ago"
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


# 2. VIDEO FALLBACK (Single Modality)
def create_video_fallback() -> Dict[str, Any]:
    ts = get_fresh_timestamp()
    return {
        "incidentId": "TG-2026-9041X",
        "id": "TG-2026-9041X",
        "timestamp": ts,
        "created_at": ts,
        "file_name": "executive_face_swap_timesformer.mp4",
        "file_type": "video",
        "selectedModality": "video",
        "pHash": "pHash: 8f3a91bc7d20",
        "phash": "pHash: 8f3a91bc7d20",
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "overallRisk": 82,
        "overall_risk": 82,
        "riskLevel": "HIGH",
        "risk_level": "HIGH",
        "containmentStatus": "BLOCKED AT INGRESS",
        "containment_status": "BLOCKED AT INGRESS",
        "policyAction": "Block inside platform & isolate ingress socket",
        "subScores": [
            {
                "id": "video-temporal",
                "vector": "Video & Temporal Deepfake",
                "vector_name": "Video & Temporal Deepfake",
                "checkpoint": "trustguard/timesformer-deepfake-v1",
                "score": 82,
                "status": "High Risk Block",
                "statusType": "high",
                "latency": "142ms",
                "details": "High-frequency texture warping along jawline contour across 32 consecutive frames."
            }
        ],
        "traceMatches": [
            {
                "id": "trace-match-2",
                "source": "Public Video Mirror Syndicate",
                "source_name": "Public Video Mirror Syndicate",
                "similarity": 87,
                "earliestSeen": "2 days ago",
                "earliest_seen": "2 days ago"
            }
        ]
    }


# 3. AUDIO FALLBACK (Single Modality)
def create_audio_fallback() -> Dict[str, Any]:
    ts = get_fresh_timestamp()
    return {
        "incidentId": "TG-2026-9041X",
        "id": "TG-2026-9041X",
        "timestamp": ts,
        "created_at": ts,
        "file_name": "telephony_cloned_voice_wav2vec2.wav",
        "file_type": "audio",
        "selectedModality": "audio",
        "pHash": "pHash: 8f3a91bc7d20",
        "phash": "pHash: 8f3a91bc7d20",
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "overallRisk": 76,
        "overall_risk": 76,
        "riskLevel": "HIGH",
        "risk_level": "HIGH",
        "containmentStatus": "BLOCKED AT INGRESS",
        "containment_status": "BLOCKED AT INGRESS",
        "policyAction": "Block inside platform & isolate ingress socket",
        "subScores": [
            {
                "id": "voice-synthesis",
                "vector": "Voice Synthesis",
                "vector_name": "Voice Synthesis",
                "checkpoint": "trustguard/wav2vec2-synthetic-voice",
                "score": 76,
                "status": "High Risk Block",
                "statusType": "high",
                "latency": "89ms",
                "details": "Spectral flatness and robotic phase continuity matching neural voice cloning signatures."
            }
        ],
        "traceMatches": [
            {
                "id": "trace-match-1",
                "source": "Known Telegram Phishing Archive #4",
                "source_name": "Known Telegram Phishing Archive #4",
                "similarity": 84,
                "earliestSeen": "1 day ago",
                "earliest_seen": "1 day ago"
            }
        ]
    }


# 4. TEXT FALLBACK (Single Modality)
def create_text_fallback() -> Dict[str, Any]:
    ts = get_fresh_timestamp()
    return {
        "incidentId": "TG-2026-9041X",
        "id": "TG-2026-9041X",
        "timestamp": ts,
        "created_at": ts,
        "file_name": "scam_message_payload.txt",
        "file_type": "text",
        "selectedModality": "text",
        "pHash": "pHash: 8f3a91bc7d20",
        "phash": "pHash: 8f3a91bc7d20",
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "overallRisk": 91,
        "overall_risk": 91,
        "riskLevel": "HIGH",
        "risk_level": "HIGH",
        "containmentStatus": "BLOCKED AT INGRESS",
        "containment_status": "BLOCKED AT INGRESS",
        "policyAction": "Block inside platform & flag sender account",
        "subScores": [
            {
                "id": "phishing-lexical",
                "vector": "Phishing / Lexical",
                "vector_name": "Phishing / Lexical",
                "checkpoint": "trustguard/scam-deberta-v3-intent",
                "score": 91,
                "status": "High Risk Block",
                "statusType": "high",
                "latency": "34ms",
                "details": "Urgent wire transfer request impersonating executive authority."
            }
        ],
        "traceMatches": [
            {
                "id": "trace-match-1",
                "source": "Known Telegram Phishing Archive #4",
                "source_name": "Known Telegram Phishing Archive #4",
                "similarity": 94,
                "earliestSeen": "14 hours ago",
                "earliest_seen": "14 hours ago"
            }
        ]
    }


# Exported instances
IMAGE_FALLBACK = create_image_fallback()
VIDEO_FALLBACK = create_video_fallback()
AUDIO_FALLBACK = create_audio_fallback()
TEXT_FALLBACK = create_text_fallback()


def get_fallback_by_modality(modality: str = "doc") -> Dict[str, Any]:
    """Return a fresh single-modality template matching the incoming input type."""
    mod = (modality or "").lower()
    if mod in ("doc", "image", "document", "picture"):
        return create_image_fallback()
    elif mod == "video":
        return create_video_fallback()
    elif mod == "audio":
        return create_audio_fallback()
    elif mod == "text":
        return create_text_fallback()
    # Default to image/document fallback
    return create_image_fallback()


def get_fresh_fallback_response(modality: Optional[str] = None) -> Dict[str, Any]:
    """Helper returning a fresh fallback copy for the target modality."""
    return get_fallback_by_modality(modality or "doc")


# Backward-compatible global default export
FALLBACK_RESPONSE = IMAGE_FALLBACK
