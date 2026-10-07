-- Migration 02: Storage Bucket Creation for Evidence Vault
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'evidence-vault',
    'evidence-vault',
    false,
    52428800, -- 50MB
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
