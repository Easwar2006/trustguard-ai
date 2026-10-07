"""Comprehensive test suite for TrustGuard AI backend."""

import io
import json
from fastapi.testclient import TestClient
import numpy as np
from PIL import Image

from app.main import app
from app.core.hasher import compute_image_phash, compute_audio_spectral_hash, find_matches, hamming_distance
from app.models.text_detector import analyze_text
from app.models.video_detector import analyze_video
from app.models.audio_detector import analyze_audio
from app.models.doc_detector import analyze_document
from app.core.risk_engine import calculate_composite_risk, evaluate_containment_tier

client = TestClient(app)

def test_health():
    print("Testing GET /api/health...")
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"
    assert data["engine"] == "TrustGuard v1.0"
    assert data["active_models"] == 4
    print("[PASS] Health check passed:", data)

def test_hasher():
    print("\nTesting Perceptual Hasher & Attribution...")
    # Test image phash
    img = Image.new("RGB", (128, 128), color=(200, 100, 50))
    h = compute_image_phash(img)
    assert len(h) >= 8
    print("[PASS] Image pHash computed:", h)

    # Test audio spectral hash
    audio_dummy = np.sin(np.linspace(0, 100, 16000)).astype(np.float32)
    audio_hash = compute_audio_spectral_hash(audio_dummy)
    assert len(audio_hash) == 16
    print("[PASS] Audio spectral hash computed:", audio_hash)

    # Test attribution matching
    matches = find_matches("8f3a91bc7d20")
    assert len(matches) > 0
    assert "source" in matches[0]
    assert "similarity" in matches[0]
    print(f"[PASS] Attribution find_matches returned {len(matches)} matches. Top match: {matches[0]['source']} ({matches[0]['similarity']}%)")

def test_text_detector():
    print("\nTesting Text Detector...")
    scam_text = "CONFIDENTIAL & IMMEDIATE: Executive settlement authorization required. Wire $480,000 to offshore escrow account before 15:00 UTC."
    res = analyze_text(scam_text)
    assert res["score"] >= 70
    assert res["statusType"] == "high"
    assert len(res["flagged_keywords"]) > 0
    print(f"[PASS] Scam text flagged with score {res['score']}, status: {res['status']}, keywords: {res['flagged_keywords']}")

    benign_text = "Hello, can we schedule the weekly engineering sync tomorrow at 10 AM?"
    res_benign = analyze_text(benign_text)
    assert res_benign["score"] < 40
    print(f"[PASS] Benign text scored safely: {res_benign['score']}")

def test_risk_engine():
    print("\nTesting Unified Risk Engine & 3-Tier Governance...")
    # High risk test
    high_tier = evaluate_containment_tier(86)
    assert high_tier["riskLevel"] == "HIGH"
    assert high_tier["containmentStatus"] == "BLOCKED AT INGRESS"
    
    # Medium risk test
    med_tier = evaluate_containment_tier(55)
    assert med_tier["riskLevel"] == "MEDIUM"
    assert med_tier["containmentStatus"] == "FLAGGED FOR REVIEW"

    # Low risk test
    low_tier = evaluate_containment_tier(25)
    assert low_tier["riskLevel"] == "LOW"
    assert low_tier["containmentStatus"] == "PASSED AT INGRESS"

    # Composite risk calculation
    composite = calculate_composite_risk(82, 76, 91, 88)
    assert 80 <= composite <= 90
    print(f"[PASS] Composite calculation verified: {composite}/100")

def test_analyze_endpoint_text():
    print("\nTesting POST /api/analyze with text payload...")
    response = client.post(
        "/api/analyze",
        data={
            "text_payload": "Urgent executive wire transfer requested immediately to bypass standard dual approval.",
            "modality": "text"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "incidentId" in data
    assert "overallRisk" in data
    assert "subScores" in data
    assert len(data["subScores"]) == 4
    print(f"[PASS] Analyze text returned incident {data['incidentId']}, overallRisk: {data['overallRisk']}, containment: {data['containmentStatus']}")

def test_analyze_endpoint_image():
    print("\nTesting POST /api/analyze with specimen image...")
    # Generate in-memory specimen image
    img = Image.new("RGB", (200, 200), color=(120, 180, 240))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)

    response = client.post(
        "/api/analyze",
        files={"file": ("aadhaar_specimen.jpg", img_byte_arr, "image/jpeg")},
        data={"modality": "doc"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "documentChecks" in data
    assert len(data["documentChecks"]) == 4
    print(f"[PASS] Analyze document returned overallRisk: {data['overallRisk']}, ELA / Document checks: {len(data['documentChecks'])} checks")

def test_trace_endpoint():
    print("\nTesting GET /api/trace/{phash}...")
    response = client.get("/api/trace/8f3a91bc7d20")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["traceMatches"]) > 0
    print(f"[PASS] Trace endpoint verified with {data['totalMatches']} matches.")

if __name__ == "__main__":
    print("=" * 60)
    print("RUNNING TRUSTGUARD AI BACKEND VERIFICATION SUITE")
    print("=" * 60)
    test_health()
    test_hasher()
    test_text_detector()
    test_risk_engine()
    test_analyze_endpoint_text()
    test_analyze_endpoint_image()
    test_trace_endpoint()
    print("\n" + "=" * 60)
    print("ALL TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)
