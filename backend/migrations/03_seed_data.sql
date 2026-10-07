-- Migration 03: Seed Hackathon Primary Demo Incident
DELETE FROM public.incidents WHERE id = 'TG-2026-9041X';

-- 1. Insert Incident
INSERT INTO public.incidents (
    id,
    phash,
    overall_risk,
    risk_level,
    containment_status,
    file_type,
    created_at
) VALUES (
    'TG-2026-9041X',
    'pHash: 8f3a91bc7d20',
    86,
    'HIGH',
    'BLOCKED AT INGRESS',
    'multimodal',
    now()
);

-- 2. Insert Sub-Scores
INSERT INTO public.incident_sub_scores (
    incident_id,
    vector_name,
    checkpoint,
    score,
    status,
    latency,
    details
) VALUES 
(
    'TG-2026-9041X',
    'Video & Temporal Deepfake',
    'trustguard/timesformer-deepfake-v1',
    82,
    'High Risk Block',
    '142ms',
    'High-frequency texture warping along jawline contour across 32 consecutive frames.'
),
(
    'TG-2026-9041X',
    'Voice Synthesis',
    'trustguard/wav2vec2-synthetic-voice',
    76,
    'Warn / Verify',
    '89ms',
    'Spectral flatness and robotic phase continuity matching neural voice cloning signatures.'
),
(
    'TG-2026-9041X',
    'Phishing / Lexical',
    'trustguard/scam-deberta-v3-intent',
    91,
    'High Risk Block',
    '34ms',
    'Urgent wire transfer request impersonating executive authority with high social engineering pressure.'
),
(
    'TG-2026-9041X',
    'Document / ID Forgery',
    'trustguard/docu-tamper-vit-ocr',
    88,
    'High Risk Block',
    '118ms',
    'Font mismatch in DOB field, spliced photo boundary, and checksum algorithm failure on identity card/certificate scan.'
);

-- 3. Insert Trace Matches
INSERT INTO public.trace_matches (
    incident_id,
    source_name,
    similarity,
    earliest_seen
) VALUES 
(
    'TG-2026-9041X',
    'Known Telegram Phishing Archive #4',
    94,
    '14 hours ago'
),
(
    'TG-2026-9041X',
    'Public Video Mirror Syndicate',
    87,
    '2 days ago'
);
