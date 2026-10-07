-- ====================================================================
-- TrustGuard AI: Supabase Complete Database Schema & Provisioning
-- Projects: Incidents, Forensic Vectors, Trace Attribution & Evidence Storage
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 2. Schema Definition: Incidents Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.incidents (
    id TEXT PRIMARY KEY, -- e.g. 'TG-2026-9041X'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    file_name TEXT,
    file_type TEXT NOT NULL DEFAULT 'multimodal', -- 'video', 'audio', 'document', 'text', 'multimodal'
    phash TEXT NOT NULL, -- e.g. 'pHash: 8f3a91bc7d20'
    overall_risk INTEGER NOT NULL CHECK (overall_risk >= 0 AND overall_risk <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('HIGH', 'MEDIUM', 'LOW')),
    containment_status TEXT NOT NULL CHECK (containment_status IN ('BLOCKED AT INGRESS', 'WARNED', 'ALLOWED', 'FLAGGED FOR REVIEW', 'PASSED AT INGRESS'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON public.incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_risk_level ON public.incidents(risk_level);
CREATE INDEX IF NOT EXISTS idx_incidents_phash ON public.incidents(phash);

-- ====================================================================
-- 3. Schema Definition: Incident Sub Scores Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.incident_sub_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id TEXT NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
    vector_name TEXT NOT NULL,
    checkpoint TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    status TEXT NOT NULL,
    latency TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sub_scores_incident_id ON public.incident_sub_scores(incident_id);

-- ====================================================================
-- 4. Schema Definition: Trace Matches Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.trace_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id TEXT NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    similarity INTEGER NOT NULL CHECK (similarity >= 0 AND similarity <= 100),
    earliest_seen TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trace_matches_incident_id ON public.trace_matches(incident_id);

-- ====================================================================
-- 5. Storage Bucket Provisioning: evidence-vault
-- ====================================================================
-- Create private storage bucket with 50MB limit and specific MIME types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'evidence-vault',
    'evidence-vault',
    false,
    52428800, -- 50MB (50 * 1024 * 1024 bytes)
    ARRAY[
        'video/mp4',
        'audio/wav',
        'audio/mpeg',
        'application/pdf',
        'image/png',
        'image/jpeg'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ====================================================================
-- 6. Row Level Security (RLS) Configuration
-- ====================================================================
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_sub_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trace_matches ENABLE ROW LEVEL SECURITY;

-- Allow public read access for dashboard / demo queries
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on incidents') THEN
        CREATE POLICY "Allow public select on incidents" ON public.incidents FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on incident_sub_scores') THEN
        CREATE POLICY "Allow public select on incident_sub_scores" ON public.incident_sub_scores FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on trace_matches') THEN
        CREATE POLICY "Allow public select on trace_matches" ON public.trace_matches FOR SELECT USING (true);
    END IF;
    -- Allow service role and anon insert for analysis ingestion
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on incidents') THEN
        CREATE POLICY "Allow insert on incidents" ON public.incidents FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on incident_sub_scores') THEN
        CREATE POLICY "Allow insert on incident_sub_scores" ON public.incident_sub_scores FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on trace_matches') THEN
        CREATE POLICY "Allow insert on trace_matches" ON public.trace_matches FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Storage RLS: allow authenticated and service role to upload / view evidence
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow evidence upload') THEN
        CREATE POLICY "Allow evidence upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'evidence-vault');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow evidence access') THEN
        CREATE POLICY "Allow evidence access" ON storage.objects FOR SELECT USING (bucket_id = 'evidence-vault');
    END IF;
END $$;

-- ====================================================================
-- 7. Database Seeding: Hackathon Primary Demo Incident
-- ====================================================================

-- Clean up any prior demo incident to ensure idempotency
DELETE FROM public.incidents WHERE id = 'TG-2026-9041X';

-- a. Seed incident
INSERT INTO public.incidents (
    id,
    phash,
    overall_risk,
    risk_level,
    containment_status,
    file_type,
    file_name,
    created_at
) VALUES (
    'TG-2026-9041X',
    'pHash: 8f3a91bc7d20',
    86,
    'HIGH',
    'BLOCKED AT INGRESS',
    'multimodal',
    'executive_wire_threat_specimen.mp4',
    now()
);

-- b. Seed incident_sub_scores
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

-- c. Seed trace_matches
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
