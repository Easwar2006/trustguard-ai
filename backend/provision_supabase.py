"""TrustGuard AI - Supabase Provisioning & Seeding Script.

Executes schema setup, storage bucket provisioning, and demo incident seeding
either through the Supabase Python SDK or direct Supabase PostgREST & Storage REST API.
"""

import os
import sys
import json
import logging
from typing import Optional, Dict, Any

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("trustguard.provision")

# Try importing supabase-py, or fall back to httpx for universal compatibility
try:
    from supabase import create_client, Client
    HAS_SUPABASE_SDK = True
except ImportError:
    HAS_SUPABASE_SDK = False

try:
    import httpx
    HAS_HTTPX = True
except ImportError:
    HAS_HTTPX = False

DEMO_INCIDENT = {
    "id": "TG-2026-9041X",
    "phash": "pHash: 8f3a91bc7d20",
    "overall_risk": 86,
    "risk_level": "HIGH",
    "containment_status": "BLOCKED AT INGRESS",
    "file_type": "multimodal",
    "file_name": "executive_wire_threat_specimen.mp4"
}

DEMO_SUB_SCORES = [
    {
        "incident_id": "TG-2026-9041X",
        "vector_name": "Video & Temporal Deepfake",
        "checkpoint": "trustguard/timesformer-deepfake-v1",
        "score": 82,
        "status": "High Risk Block",
        "latency": "142ms",
        "details": "High-frequency texture warping along jawline contour across 32 consecutive frames."
    },
    {
        "incident_id": "TG-2026-9041X",
        "vector_name": "Voice Synthesis",
        "checkpoint": "trustguard/wav2vec2-synthetic-voice",
        "score": 76,
        "status": "Warn / Verify",
        "latency": "89ms",
        "details": "Spectral flatness and robotic phase continuity matching neural voice cloning signatures."
    },
    {
        "incident_id": "TG-2026-9041X",
        "vector_name": "Phishing / Lexical",
        "checkpoint": "trustguard/scam-deberta-v3-intent",
        "score": 91,
        "status": "High Risk Block",
        "latency": "34ms",
        "details": "Urgent wire transfer request impersonating executive authority with high social engineering pressure."
    },
    {
        "incident_id": "TG-2026-9041X",
        "vector_name": "Document / ID Forgery",
        "checkpoint": "trustguard/docu-tamper-vit-ocr",
        "score": 88,
        "status": "High Risk Block",
        "latency": "118ms",
        "details": "Font mismatch in DOB field, spliced photo boundary, and checksum algorithm failure on identity card/certificate scan."
    }
]

DEMO_TRACE_MATCHES = [
    {
        "incident_id": "TG-2026-9041X",
        "source_name": "Known Telegram Phishing Archive #4",
        "similarity": 94,
        "earliest_seen": "14 hours ago"
    },
    {
        "incident_id": "TG-2026-9041X",
        "source_name": "Public Video Mirror Syndicate",
        "similarity": 87,
        "earliest_seen": "2 days ago"
    }
]


def load_env_file(filepath: str = ".env"):
    """Lightweight .env parser without external dependencies."""
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if key not in os.environ:
                os.environ[key] = val


def provision_storage_bucket_rest(supabase_url: str, supabase_key: str):
    """Ensure evidence-vault private bucket exists via Storage REST API."""
    if not HAS_HTTPX:
        logger.warning("httpx not available; skipping REST storage bucket check")
        return False
    
    url = f"{supabase_url.rstrip('/')}/storage/v1/bucket"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }

    try:
        # Check existing buckets
        resp = httpx.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            buckets = resp.json()
            bucket_names = [b.get("id") or b.get("name") for b in buckets if isinstance(b, dict)]
            if "evidence-vault" in bucket_names:
                logger.info("Storage bucket 'evidence-vault' already exists.")
                return True

        # Create bucket
        payload = {
            "id": "evidence-vault",
            "name": "evidence-vault",
            "public": False,
            "file_size_limit": 52428800,  # 50MB
            "allowed_mime_types": [
                "video/mp4",
                "audio/wav",
                "audio/mpeg",
                "application/pdf",
                "image/png",
                "image/jpeg"
            ]
        }
        create_resp = httpx.post(url, headers=headers, json=payload, timeout=10)
        if create_resp.status_code in (200, 201):
            logger.info("Successfully provisioned storage bucket 'evidence-vault' (private, 50MB limit).")
            return True
        elif create_resp.status_code == 400 and "already exists" in create_resp.text.lower():
            logger.info("Storage bucket 'evidence-vault' already exists (400 response).")
            return True
        else:
            logger.warning(f"Could not provision bucket via REST API: HTTP {create_resp.status_code} - {create_resp.text}")
            return False
    except Exception as e:
        logger.warning(f"Storage provisioning exception: {e}")
        return False


def seed_database_rest(supabase_url: str, supabase_key: str):
    """Seed demo incident records via PostgREST API."""
    if not HAS_HTTPX:
        logger.warning("httpx not available; skipping REST database seeding")
        return False

    base_url = f"{supabase_url.rstrip('/')}/rest/v1"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    try:
        # 1. Upsert incident
        resp = httpx.post(f"{base_url}/incidents", headers=headers, json=DEMO_INCIDENT, timeout=10)
        logger.info(f"Upsert incident TG-2026-9041X: HTTP {resp.status_code}")

        # 2. Insert sub scores
        for score in DEMO_SUB_SCORES:
            httpx.post(f"{base_url}/incident_sub_scores", headers=headers, json=score, timeout=10)
        logger.info(f"Seeded {len(DEMO_SUB_SCORES)} incident sub-scores.")

        # 3. Insert trace matches
        for match in DEMO_TRACE_MATCHES:
            httpx.post(f"{base_url}/trace_matches", headers=headers, json=match, timeout=10)
        logger.info(f"Seeded {len(DEMO_TRACE_MATCHES)} trace matches.")

        return True
    except Exception as e:
        logger.warning(f"Database seeding exception: {e}")
        return False


def run_provisioning():
    """Main provisioning execution entrypoint."""
    load_env_file()
    load_env_file(os.path.join(os.path.dirname(__file__), ".env"))

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        logger.info("====================================================================")
        logger.info("SUPABASE PROVISIONING CONFIGURATION NOTICE")
        logger.info("====================================================================")
        logger.info("SUPABASE_URL or SUPABASE_KEY environment variable not currently set.")
        logger.info("To connect your live Supabase project:")
        logger.info("  1. Copy backend/.env.example to backend/.env")
        logger.info("  2. Add your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
        logger.info("  3. Run: python backend/provision_supabase.py")
        logger.info("Alternatively, run the DDL in backend/supabase_schema.sql directly in")
        logger.info("the Supabase SQL Editor.")
        logger.info("====================================================================")
        return False

    logger.info(f"Connecting to Supabase at: {supabase_url}")

    # Provision storage bucket
    provision_storage_bucket_rest(supabase_url, supabase_key)

    # Seed demo records
    seed_database_rest(supabase_url, supabase_key)

    logger.info("Supabase provisioning routine finished.")
    return True


if __name__ == "__main__":
    run_provisioning()
