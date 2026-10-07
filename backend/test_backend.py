"""TrustGuard AI - Backend Single-Modality Routing Verification Suite.

Tests:
1. Health check (GET /api/health)
2. Image upload (.png) -> returns ONLY "Document / Image Forgery" (1 row)
3. Video upload (.mp4) -> returns ONLY "Video & Temporal Deepfake" (1 row)
4. Audio upload (.wav) -> returns ONLY "Voice Synthesis" (1 row)
5. Text scam payload -> returns ONLY "Phishing / Lexical" (1 row)
6. Text benign payload -> returns ONLY "Phishing / Lexical" with score < 40 and "PASSED AT INGRESS"
7. Single modality fallback templates
"""

import sys
import io
import os
from fastapi.testclient import TestClient
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app
from fallback_data import (
    IMAGE_FALLBACK,
    VIDEO_FALLBACK,
    AUDIO_FALLBACK,
    TEXT_FALLBACK,
    get_fallback_by_modality
)

client = TestClient(app)


def test_health_check():
    print("=" * 60)
    print("TEST 1: Health Check Endpoint (GET /api/health)")
    print("=" * 60)
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "active"
    assert data["engine"] == "TrustGuard v1.0"
    assert data["connected_db"] == "Supabase"
    print("[PASS] Health response matches specification:", data)


def test_image_modality_routing():
    print("\n" + "=" * 60)
    print("TEST 2: Strict Image / Document Modality Routing")
    print("=" * 60)
    img = Image.new("RGB", (256, 256), color=(200, 100, 50))
    img_bytes = io.BytesIO()
    img.save(img_bytes, format="PNG")
    img_bytes.seek(0)

    res = client.post(
        "/api/analyze",
        files={"file": ("national_id_tamper.png", img_bytes, "image/png")},
        data={"modality": "doc"}
    )
    assert res.status_code == 200
    data = res.json()
    assert len(data["subScores"]) == 1, f"Expected 1 subScore, got {len(data['subScores'])}"
    assert data["subScores"][0]["vector_name"] == "Document / Image Forgery"
    assert data["overallRisk"] == data["subScores"][0]["score"]
    assert data["overallRisk"] in (86, 88)
    assert data["containmentStatus"] == "BLOCKED AT INGRESS"
    assert data["pHash"].startswith("pHash: ")
    print(f"[PASS] Image routed strictly to Document / Image Forgery: Score={data['overallRisk']}%, subScores count={len(data['subScores'])}")


def test_real_image_routing_and_evaluation():
    print("\n" + "=" * 60)
    print("TEST 2b: Real Image Evaluation & Mismatched Hint Override")
    print("=" * 60)
    img = Image.new("RGB", (256, 256), color=(100, 150, 200))
    img_bytes = io.BytesIO()
    img.save(img_bytes, format="JPEG")
    img_bytes.seek(0)

    # Send with mismatched hint: video
    res = client.post(
        "/api/analyze",
        files={"file": ("real_user_photo.jpg", img_bytes, "image/jpeg")},
        data={"modality_hint": "video"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["selectedModality"] == "image_doc"
    assert len(data["subScores"]) == 1
    assert data["subScores"][0]["vector_name"] == "Document / Image Forgery"
    assert data["overallRisk"] < 40, f"Expected benign risk < 40, got {data['overallRisk']}"
    assert data["containmentStatus"] in ("INGRESS PASSED", "PASSED AT INGRESS")
    print(f"[PASS] Real image evaluated as benign: Score={data['overallRisk']}%, Containment={data['containmentStatus']}")


def test_video_modality_routing():
    print("\n" + "=" * 60)
    print("TEST 3: Strict Video Modality Routing")
    print("=" * 60)
    dummy_video_bytes = io.BytesIO(b"\x00\x00\x00\x20ftypmp42" + b"\x00" * 1024)
    res = client.post(
        "/api/analyze",
        files={"file": ("deepfake_speech.mp4", dummy_video_bytes, "video/mp4")},
        data={"modality": "video"}
    )
    assert res.status_code == 200
    data = res.json()
    assert len(data["subScores"]) == 1, f"Expected 1 subScore, got {len(data['subScores'])}"
    assert data["subScores"][0]["vector_name"] == "Video & Temporal Deepfake"
    assert 88 <= data["overallRisk"] <= 94
    assert data["containmentStatus"] == "BLOCKED AT INGRESS"
    assert data["label"] == "DEEPFAKE / SYNTHETIC AI VIDEO DETECTED"
    assert data["verdict"] == "Synthetic generative diffusion signatures and static model watermark detected."
    assert "breakdown" in data
    assert any(b["name"] == "Watermark Footprint" for b in data["breakdown"])
    assert any(b["name"] == "Facial Morphing Dynamics" for b in data["breakdown"])
    assert any(b["name"] == "Temporal Velocity" for b in data["breakdown"])
    print(f"[PASS] Video routed strictly to Video & Temporal Deepfake: Score={data['overallRisk']}%, subScores count={len(data['subScores'])}")


def test_audio_modality_routing():
    print("\n" + "=" * 60)
    print("TEST 4: Strict Audio Modality Routing")
    print("=" * 60)
    dummy_audio_bytes = io.BytesIO(b"RIFF" + b"\x00" * 500)
    res = client.post(
        "/api/analyze",
        files={"file": ("voice_clone.wav", dummy_audio_bytes, "audio/wav")},
        data={"modality": "audio"}
    )
    assert res.status_code == 200
    data = res.json()
    assert len(data["subScores"]) == 1, f"Expected 1 subScore, got {len(data['subScores'])}"
    assert data["subScores"][0]["vector_name"] == "Voice Synthesis"
    assert data["overallRisk"] == data["subScores"][0]["score"]
    assert data["containmentStatus"] in ("FLAGGED FOR REVIEW", "BLOCKED AT INGRESS")
    print(f"[PASS] Audio routed strictly to Voice Synthesis: Score={data['overallRisk']}%, subScores count={len(data['subScores'])}, Containment={data['containmentStatus']}")


def test_text_modality_routing():
    print("\n" + "=" * 60)
    print("TEST 5: Strict Text Modality Routing (Scam vs Benign)")
    print("=" * 60)
    # 1. Urgent scam
    res_scam = client.post(
        "/api/analyze",
        data={
            "text_payload": "URGENT: Executive settlement wire transfer required immediately to bypass security.",
            "modality": "text"
        }
    )
    assert res_scam.status_code == 200
    data_scam = res_scam.json()
    assert len(data_scam["subScores"]) == 1
    assert data_scam["subScores"][0]["vector_name"] == "Phishing / Lexical"
    assert data_scam["overallRisk"] >= 70
    assert data_scam["containmentStatus"] == "BLOCKED AT INGRESS"
    print(f"[PASS] Scam text flagged: Score={data_scam['overallRisk']}%, Containment={data_scam['containmentStatus']}")

    # 2. Benign conversational
    res_benign = client.post(
        "/api/analyze",
        data={
            "text_payload": "Hello, scheduling our team standup for tomorrow morning at 10 AM.",
            "modality": "text"
        }
    )
    assert res_benign.status_code == 200
    data_benign = res_benign.json()
    assert len(data_benign["subScores"]) == 1
    assert data_benign["subScores"][0]["vector_name"] == "Phishing / Lexical"
    assert data_benign["overallRisk"] <= 39
    assert data_benign["containmentStatus"] == "PASSED AT INGRESS"
    print(f"[PASS] Benign text passed: Score={data_benign['overallRisk']}%, Containment={data_benign['containmentStatus']}")


def test_single_modality_fallbacks():
    print("\n" + "=" * 60)
    print("TEST 6: Dedicated Single-Modality Fallbacks")
    print("=" * 60)
    assert len(IMAGE_FALLBACK["subScores"]) == 1
    assert IMAGE_FALLBACK["subScores"][0]["vector"] == "Document / Image Forgery"
    assert IMAGE_FALLBACK["overallRisk"] == 88

    assert len(VIDEO_FALLBACK["subScores"]) == 1
    assert VIDEO_FALLBACK["subScores"][0]["vector"] == "Video & Temporal Deepfake"
    assert VIDEO_FALLBACK["overallRisk"] == 82

    assert len(AUDIO_FALLBACK["subScores"]) == 1
    assert AUDIO_FALLBACK["subScores"][0]["vector"] == "Voice Synthesis"
    assert AUDIO_FALLBACK["overallRisk"] == 76

    assert len(TEXT_FALLBACK["subScores"]) == 1
    assert TEXT_FALLBACK["subScores"][0]["vector"] == "Phishing / Lexical"
    assert TEXT_FALLBACK["overallRisk"] == 91

    img_f = get_fallback_by_modality("image")
    assert len(img_f["subScores"]) == 1
    assert img_f["subScores"][0]["vector"] == "Document / Image Forgery"
    print("[PASS] All 4 single-modality fallback templates validated successfully!")


def test_dual_signal_image_detector():
    print("\n" + "=" * 60)
    print("TEST 7: Dual-Signal Image Detector (decode_image_doc)")
    print("=" * 60)
    import numpy as np
    from main import decode_image_doc

    keywords = [
        'dall-e', 'midjourney', 'stablediffusion', 'comfyui', 'c2pa',
        'synthetic', 'flux', 'ai', 'fake', 'tampered', 'generated'
    ]

    # 1. Test keyword triggers in filename
    for kw in keywords:
        fn = f"sample_{kw}_specimen.png"
        img = Image.new("RGB", (300, 300), color=(120, 120, 120))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        res = decode_image_doc(buf.getvalue(), filename=fn)
        expected_risk = 88 if kw in ('fake', 'tampered') else 86
        assert res["overallRisk"] == expected_risk, f"Failed for keyword {kw}: risk={res['overallRisk']}"
        assert res["containmentStatus"] == "BLOCKED AT INGRESS", f"Failed for {kw}: status={res['containmentStatus']}"
        assert res["riskLevel"] == "HIGH"
        assert res["policyAction"] == "Block inside platform"
        assert res["subScores"][0]["score"] == expected_risk
        assert res["subScores"][0]["checkpoint"] == "trustguard/docu-tamper-vit-ocr"
        assert res["subScores"][0]["status"] == "High Risk Block"
        assert res["subScores"][0]["latency"] in ("112ms", "98ms")
        assert res["forensicSummary"].startswith("What our models found: ")
    print(f"[PASS] All {len(keywords)} AI/tamper keywords in filename properly triggered High Risk BLOCKED AT INGRESS")

    # 2. Test keyword in header/stream payload
    raw_payload_with_header = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR" + b"stablediffusion prompt: hyperrealistic portrait" + b"\x00" * 200
    res_stream = decode_image_doc(raw_payload_with_header, filename="unnamed.png")
    assert res_stream["overallRisk"] == 86
    assert res_stream["containmentStatus"] == "BLOCKED AT INGRESS"
    print("[PASS] Embedded synthetic metadata header in raw stream triggered 86% BLOCKED AT INGRESS")

    # 3. Test Layer 2: 1024x1024 generator resolution without camera EXIF
    img_1024 = Image.new("RGB", (1024, 1024), color=(100, 120, 140))
    buf_1024 = io.BytesIO()
    img_1024.save(buf_1024, format="JPEG")
    res_1024 = decode_image_doc(buf_1024.getvalue(), filename="landscape_photo.jpg")
    assert res_1024["overallRisk"] == 86
    assert res_1024["containmentStatus"] == "BLOCKED AT INGRESS"
    print("[PASS] 1024x1024 canvas lacking camera EXIF triggered 86% BLOCKED AT INGRESS")

    # 4. Test Layer 2: Flat noise texture (< 35.0) without camera EXIF
    img_flat = Image.new("RGB", (640, 480), color=(180, 180, 180))
    buf_flat = io.BytesIO()
    img_flat.save(buf_flat, format="JPEG")
    res_flat = decode_image_doc(buf_flat.getvalue(), filename="snapshot.jpg")
    assert res_flat["overallRisk"] == 86
    assert res_flat["containmentStatus"] == "BLOCKED AT INGRESS"
    print("[PASS] Unnaturally flat noise texture lacking camera EXIF triggered 86% BLOCKED AT INGRESS")

    # 5. Test Genuine Camera Photo with EXIF and natural noise
    noise_arr = np.random.randint(0, 256, (400, 400, 3), dtype=np.uint8)
    img_real = Image.fromarray(noise_arr)
    # Add authentic camera EXIF
    exif = img_real.getexif()
    exif[271] = "Apple"
    exif[272] = "iPhone 15 Pro"
    exif[33434] = (1, 120)  # ExposureTime 1/120s
    buf_real = io.BytesIO()
    img_real.save(buf_real, format="JPEG", exif=exif)

    res_real = decode_image_doc(buf_real.getvalue(), filename="IMG_4821.jpg")
    assert res_real["overallRisk"] == 12, f"Expected 12, got {res_real['overallRisk']}"
    assert res_real["containmentStatus"] == "INGRESS PASSED"
    assert res_real["riskLevel"] == "LOW"
    assert res_real["policyAction"] == "Allow"
    assert res_real["subScores"][0]["score"] == 12
    assert res_real["subScores"][0]["checkpoint"] == "trustguard/docu-tamper-vit-ocr"
    assert res_real["subScores"][0]["status"] == "Safe"
    assert res_real["subScores"][0]["latency"] == "84ms"
    assert res_real["forensicSummary"] == "What our models found: Authentic image structure verified. Uniform noise variance and pixel grid continuity indicate untampered media."
    print("[PASS] Authentic camera photo verified: 12% INGRESS PASSED with full model profile")


def test_document_and_certificate_tamper_forensics():
    print("\n" + "=" * 60)
    print("TEST 9: Document & Certificate Tamper Forensics (decode_image_doc)")
    print("=" * 60)
    from main import decode_image_doc

    # 1. Authentic PDF document
    authentic_pdf = b"%PDF-1.5\n%Header info\n1 0 obj\n<< /Type /Catalog >>\nendobj\nxref\n0 2\n0000000000 65535 f \ntrailer\n<< /Size 2 >>\nstartxref\n50\n%%EOF\n"
    res_auth = decode_image_doc(authentic_pdf, filename="official_university_transcript.pdf")
    assert res_auth["overallRisk"] == 11, f"Expected 11, got {res_auth['overallRisk']}"
    assert res_auth["containmentStatus"] == "INGRESS PASSED"
    assert res_auth["riskLevel"] == "LOW"
    assert res_auth["policyAction"] == "Allow"
    assert res_auth["subScores"][0]["score"] == 11
    assert res_auth["subScores"][0]["checkpoint"] == "trustguard/docu-tamper-vit-ocr"
    assert res_auth["subScores"][0]["status"] == "Safe"
    assert res_auth["subScores"][0]["latency"] == "78ms"
    assert "Authentic digital document verified" in res_auth["forensicSummary"]
    print("[PASS] Authentic PDF document passed: 11% INGRESS PASSED")

    # 2. Tampered PDF with editing software footprints (Canva / iLovePDF)
    tamper_producers = ['photoshop', 'canva', 'ilovepdf', 'sejda', 'pdfescape', 'nitro', 'foxit', 'inkscape', 'gimp', 'illustrator']
    for prod in tamper_producers:
        tampered_pdf_software = b"%PDF-1.4\nProducer: " + prod.encode('latin-1') + b" Studio\n%%EOF"
        res_soft = decode_image_doc(tampered_pdf_software, filename="certificate_scan.pdf")
        assert res_soft["overallRisk"] == 89, f"Failed for producer {prod}: risk={res_soft['overallRisk']}"
        assert res_soft["containmentStatus"] == "BLOCKED AT INGRESS"
        assert res_soft["riskLevel"] == "HIGH"
        assert res_soft["policyAction"] == "Block inside platform"
        assert res_soft["subScores"][0]["score"] == 89
        assert res_soft["subScores"][0]["checkpoint"] == "trustguard/docu-tamper-vit-ocr"
        assert res_soft["subScores"][0]["status"] == "High Risk Block"
        assert res_soft["subScores"][0]["latency"] == "94ms"
        assert prod in res_soft["forensicSummary"].lower()
    print(f"[PASS] All {len(tamper_producers)} PDF editing software footprints triggered 89% BLOCKED AT INGRESS")

    # 3. Tampered PDF with incremental update (multiple %%EOF or /ByteRange)
    tampered_pdf_multieof = b"%PDF-1.4\n1 0 obj\nOriginal Content\nendobj\n%%EOF\n2 0 obj\nModified Content Spliced\nendobj\n%%EOF\n"
    res_multieof = decode_image_doc(tampered_pdf_multieof, filename="contract_signed.pdf")
    assert res_multieof["overallRisk"] == 89
    assert res_multieof["containmentStatus"] == "BLOCKED AT INGRESS"
    assert "Incremental revision" in res_multieof["subScores"][0]["details"]
    print("[PASS] Multi-layer incremental revision PDF (/%%EOF > 1) triggered 89% BLOCKED AT INGRESS")

    tampered_pdf_byterange = b"%PDF-1.4\n/ByteRange [0 100 200 500]\n/ByteRange [500 100 700 300]\n%%EOF"
    res_byterange = decode_image_doc(tampered_pdf_byterange, filename="invoice_revised.pdf")
    assert res_byterange["overallRisk"] == 89
    assert res_byterange["containmentStatus"] == "BLOCKED AT INGRESS"
    print("[PASS] Multi-layer ByteRange splice PDF (/ByteRange > 1) triggered 89% BLOCKED AT INGRESS")

    # 4. Tampered PDF with filename flag
    tamper_filenames = ['fake_passport.pdf', 'tampered_id.pdf', 'forged_degree.pdf', 'sample_altered_license.pdf', 'test_fake_cert.pdf']
    for fn in tamper_filenames:
        clean_bytes = b"%PDF-1.7\nLinearized document\n%%EOF"
        res_fn = decode_image_doc(clean_bytes, filename=fn)
        assert res_fn["overallRisk"] == 89
        assert res_fn["containmentStatus"] == "BLOCKED AT INGRESS"
    print(f"[PASS] All {len(tamper_filenames)} PDF tamper filename flags triggered 89% BLOCKED AT INGRESS")

    # 5. Scanned image certificate with tamper keyword ('tampered', 'fake', 'forged') -> 88%
    img = Image.new("RGB", (300, 300), color=(120, 120, 120))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    res_tamper_img = decode_image_doc(buf.getvalue(), filename="aadhaar_card_tampered.jpg")
    assert res_tamper_img["overallRisk"] == 88
    assert res_tamper_img["containmentStatus"] == "BLOCKED AT INGRESS"
    assert res_tamper_img["riskLevel"] == "HIGH"
    assert res_tamper_img["subScores"][0]["score"] == 88
    print("[PASS] Scanned certificate with tamper filename triggered 88% BLOCKED AT INGRESS")

    # 6. Guarded fallback for unreadable/corrupt bytes on non-PDF
    res_fallback = decode_image_doc(b"corrupt_binary_data_\x00\xff\xfe", filename="real_scanned_receipt.bin")
    assert res_fallback["overallRisk"] == 14
    assert res_fallback["containmentStatus"] == "INGRESS PASSED"
    assert res_fallback["riskLevel"] == "LOW"
    assert res_fallback["policyAction"] == "Allow"
    assert res_fallback["subScores"][0]["score"] == 14
    assert res_fallback["subScores"][0]["status"] == "Safe"
    print("[PASS] Unreadable/corrupted bytes safely defaulted to 14% LOW RISK INGRESS PASSED")


def test_video_deepfake_analysis():
    print("\n" + "=" * 60)
    print("TEST 10: Video Deepfake & Temporal Forensics (decode_video)")
    print("=" * 60)
    from main import decode_video

    synthetic_tokens = [
        'sora', 'runway', 'gen2', 'gen3', 'pika', 'kling', 'luma',
        'haiper', 'viggle', 'synthetic', 'deepfake', 'ai', 'faceswap',
        'generated', 'fake'
    ]

    # 1. Test synthetic tokens in filename
    for tok in synthetic_tokens:
        fn = f"sample_{tok}_specimen.mp4"
        res_tok = decode_video(b"\x00\x00\x00\x20ftypmp42" + b"\x00" * 512, filename=fn)
        assert 88 <= res_tok["overallRisk"] <= 94, f"Failed for token {tok}: risk={res_tok['overallRisk']}"
        assert res_tok["containmentStatus"] == "BLOCKED AT INGRESS"
        assert res_tok["riskLevel"] == "HIGH"
        assert res_tok["policyAction"] == "Block inside platform"
        assert res_tok["label"] == "DEEPFAKE / SYNTHETIC AI VIDEO DETECTED"
        assert res_tok["verdict"] == "Synthetic generative diffusion signatures and static model watermark detected."
        assert res_tok["syntheticScore"] >= 60
        assert res_tok["subScores"][0]["status"] == "DEEPFAKE / SYNTHETIC AI VIDEO DETECTED"
        assert 88 <= res_tok["subScores"][0]["score"] <= 94
        assert res_tok["subScores"][0]["checkpoint"] == "trustguard/timesformer-deepfake-v1"
        assert res_tok["subScores"][0]["latency"] == "142ms"
        assert "DEEPFAKE / SYNTHETIC AI VIDEO DETECTED" in res_tok["forensicSummary"]
        assert any(b["name"] == "Watermark Footprint" for b in res_tok["breakdown"])
        assert any(b["name"] == "Facial Morphing Dynamics" for b in res_tok["breakdown"])
        assert any(b["name"] == "Temporal Velocity" for b in res_tok["breakdown"])
    print(f"[PASS] All {len(synthetic_tokens)} synthetic video tokens in filename triggered 88-94% BLOCKED AT INGRESS (DEEPFAKE / SYNTHETIC AI VIDEO DETECTED)")

    # 2. Test synthetic token in container header (first 4096 bytes)
    header_with_ai = b"\x00\x00\x00\x20ftypmp42" + b"Encoded by Runway Gen-2 AI neural pipeline" + b"\x00" * 500
    res_hdr = decode_video(header_with_ai, filename="interview_recording.mp4")
    assert 88 <= res_hdr["overallRisk"] <= 94
    assert res_hdr["containmentStatus"] == "BLOCKED AT INGRESS"
    assert res_hdr["label"] == "DEEPFAKE / SYNTHETIC AI VIDEO DETECTED"
    assert res_hdr["verdict"] == "Synthetic generative diffusion signatures and static model watermark detected."
    assert res_hdr["subScores"][0]["status"] == "DEEPFAKE / SYNTHETIC AI VIDEO DETECTED"
    print("[PASS] Video container header matching synthetic token triggered 88-94% BLOCKED AT INGRESS")

    # 3. Dynamic temporal jitter detection with synthesized video frames
    import tempfile
    import cv2
    import numpy as np
    import os

    # 3a. Deepfake erratic frame transitions (temporal jitter > 8.0)
    with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as f:
        tmp_jitter = f.name
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out_jitter = cv2.VideoWriter(tmp_jitter, fourcc, 10, (100, 100))
    jump_values = [0, 250, 10, 240, 20, 230, 30, 220, 40, 210, 50, 200]
    for val in jump_values:
        img = np.full((100, 100, 3), val, dtype=np.uint8)
        out_jitter.write(img)
    out_jitter.release()

    with open(tmp_jitter, 'rb') as f:
        jitter_bytes = f.read()
    try:
        os.unlink(tmp_jitter)
    except Exception:
        pass

    res_jitter = decode_video(jitter_bytes, filename="surveillance_feed.mp4")
    assert 88 <= res_jitter["overallRisk"] <= 94
    assert res_jitter["containmentStatus"] == "BLOCKED AT INGRESS"
    assert res_jitter["riskLevel"] == "HIGH"
    assert res_jitter["label"] == "DEEPFAKE / SYNTHETIC AI VIDEO DETECTED"
    assert res_jitter["verdict"] == "Synthetic generative diffusion signatures and static model watermark detected."
    assert res_jitter["subScores"][0]["status"] == "DEEPFAKE / SYNTHETIC AI VIDEO DETECTED"
    print("[PASS] Erratic frame jitter (> 11.0) dynamically triggered 88-94% BLOCKED AT INGRESS")

    # 3b. Watermark detection: Persistent static high-contrast stamp in bottom-right corner
    with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as f:
        tmp_watermark = f.name
    out_wm = cv2.VideoWriter(tmp_watermark, fourcc, 10, (100, 100))
    for i in range(12):
        # Moving background
        img = np.full((100, 100, 3), 40 + (i * 15) % 150, dtype=np.uint8)
        # Static bright watermark text/logo stamp in bottom-right corner (last 20% width, bottom 15% height: [85:100, 80:100])
        img[86:98, 82:98] = 255
        out_wm.write(img)
    out_wm.release()

    with open(tmp_watermark, 'rb') as f:
        wm_bytes = f.read()
    try:
        os.unlink(tmp_watermark)
    except Exception:
        pass

    res_wm = decode_video(wm_bytes, filename="clip_rendered.mp4")
    assert 88 <= res_wm["overallRisk"] <= 94
    assert res_wm["containmentStatus"] == "BLOCKED AT INGRESS"
    assert res_wm["label"] == "DEEPFAKE / SYNTHETIC AI VIDEO DETECTED"
    assert res_wm["verdict"] == "Synthetic generative diffusion signatures and static model watermark detected."
    assert any(b["name"] == "Watermark Footprint" for b in res_wm["breakdown"])
    print("[PASS] Corner inspection static watermark detection dynamically triggered 88-94% BLOCKED AT INGRESS")

    # 3c. WhatsApp / Generic Name Flagging: Not assumed clean, evaluated on visual forensics
    res_wa_fake = decode_video(jitter_bytes, filename="WhatsApp Video 2026-03-01 at 12.30.00.mp4")
    assert 88 <= res_wa_fake["overallRisk"] <= 94
    assert res_wa_fake["label"] == "DEEPFAKE / SYNTHETIC AI VIDEO DETECTED"
    assert res_wa_fake["containmentStatus"] == "BLOCKED AT INGRESS"
    print("[PASS] WhatsApp video with synthetic motion flagged as DEEPFAKE / SYNTHETIC AI VIDEO DETECTED")

    # 3d. Authentic smooth video with natural camera CMOS noise (temporal jitter <= 8.0, natural ISO texture)
    with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as f:
        tmp_clean = f.name
    out_clean = cv2.VideoWriter(tmp_clean, fourcc, 10, (100, 100))
    # Generate frames with realistic optical sensor noise so laplacian variance >= 40.0
    np.random.seed(42)
    base_frame = np.random.randint(60, 180, (100, 100, 3), dtype=np.uint8)
    for i in range(15):
        # Frame with slight natural handheld shift and camera sensor grain
        noise = np.random.randint(-3, 4, (100, 100, 3), dtype=np.int16)
        frame = np.clip(base_frame.astype(np.int16) + noise + i, 0, 255).astype(np.uint8)
        out_clean.write(frame)
    out_clean.release()

    with open(tmp_clean, 'rb') as f:
        clean_bytes = f.read()
    try:
        os.unlink(tmp_clean)
    except Exception:
        pass

    res_clean = decode_video(clean_bytes, filename="authentic_webcam_clip.mp4")
    assert 14 <= res_clean["overallRisk"] <= 22, f"Expected 14-22, got {res_clean['overallRisk']}"
    assert res_clean["overallRisk"] < 40, "Authentic camera video must score below 40"
    assert res_clean["containmentStatus"] == "INGRESS PASSED"
    assert res_clean["riskLevel"] == "LOW"
    assert res_clean["policyAction"] == "Allow"
    assert res_clean["label"] == "AUTHENTIC / REAL VIDEO"
    assert res_clean["verdict"] == "Natural frame dynamics and continuous camera sensor noise verified."
    assert res_clean["syntheticScore"] < 60
    assert res_clean["subScores"][0]["score"] == res_clean["overallRisk"]
    assert res_clean["subScores"][0]["checkpoint"] == "trustguard/timesformer-deepfake-v1"
    assert res_clean["subScores"][0]["status"] == "AUTHENTIC / REAL VIDEO"
    assert res_clean["subScores"][0]["latency"] == "116ms"
    assert "AUTHENTIC / REAL VIDEO" in res_clean["forensicSummary"]
    assert res_clean["breakdown"][0]["name"] == "Sensor Noise Profile"
    assert res_clean["breakdown"][1]["name"] == "Temporal Integrity"
    print("[PASS] Authentic video stream verified dynamically: Score < 40 (14-22%), AUTHENTIC / REAL VIDEO")

    # 3e. Test genuine WhatsApp video with natural sensor noise scores < 40
    res_wa_real = decode_video(clean_bytes, filename="WhatsApp Video 2026-03-01 at 09.15.22.mp4")
    assert 14 <= res_wa_real["overallRisk"] <= 22, f"Expected real WhatsApp video risk 14-22, got {res_wa_real['overallRisk']}"
    assert res_wa_real["label"] == "AUTHENTIC / REAL VIDEO"
    assert res_wa_real["verdict"] == "Natural frame dynamics and continuous camera sensor noise verified."
    print(f"[PASS] Real WhatsApp video with camera sensor grain correctly passed: Score={res_wa_real['overallRisk']}% (< 40)")

    # 4. Graceful handling of corrupted/unreadable bytes
    res_corrupt = decode_video(b"\xff\xff\xff_not_a_valid_video_stream", filename="customer_id_clip.mp4")
    assert res_corrupt["overallRisk"] == 14
    assert res_corrupt["overallRisk"] < 40
    assert res_corrupt["containmentStatus"] == "INGRESS PASSED"
    assert res_corrupt["riskLevel"] == "LOW"
    assert res_corrupt["policyAction"] == "Allow"
    assert res_corrupt["label"] == "AUTHENTIC / REAL VIDEO"
    assert res_corrupt["verdict"] == "Natural frame dynamics and continuous camera sensor noise verified."
    print("[PASS] Corrupted video stream safely handled without crashing: 14% LOW RISK INGRESS PASSED")


if __name__ == "__main__":
    print("\n============================================================")
    print("RUNNING TRUSTGUARD AI SINGLE-MODALITY TEST SUITE")
    print("============================================================")
    test_health_check()
    test_image_modality_routing()
    test_real_image_routing_and_evaluation()
    test_video_modality_routing()
    test_audio_modality_routing()
    test_text_modality_routing()
    test_single_modality_fallbacks()
    test_dual_signal_image_detector()
    test_document_and_certificate_tamper_forensics()
    test_video_deepfake_analysis()
    print("\n" + "=" * 60)
    print("ALL TESTS PASSED (10/10)")
    print("=" * 60 + "\n")

