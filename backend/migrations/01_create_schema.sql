-- Migration 01: Create TrustGuard AI Schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Incidents Table
CREATE TABLE IF NOT EXISTS public.incidents (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    file_name TEXT,
    file_type TEXT NOT NULL,
    phash TEXT NOT NULL,
    overall_risk INTEGER NOT NULL CHECK (overall_risk >= 0 AND overall_risk <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('HIGH', 'MEDIUM', 'LOW')),
    containment_status TEXT NOT NULL CHECK (containment_status IN ('BLOCKED AT INGRESS', 'WARNED', 'ALLOWED', 'FLAGGED FOR REVIEW', 'PASSED AT INGRESS'))
);

-- Sub-Scores Table
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

-- Trace Matches Table
CREATE TABLE IF NOT EXISTS public.trace_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id TEXT NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    similarity INTEGER NOT NULL CHECK (similarity >= 0 AND similarity <= 100),
    earliest_seen TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON public.incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sub_scores_incident_id ON public.incident_sub_scores(incident_id);
CREATE INDEX IF NOT EXISTS idx_trace_matches_incident_id ON public.trace_matches(incident_id);
