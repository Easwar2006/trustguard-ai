/**
 * TrustGuard AI Frontend API Configuration
 * Supports VITE_API_URL environment variable for production hosting (Render.com)
 * and falls back to relative paths for local development proxy.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  ANALYZE: `${API_BASE_URL}/api/analyze`,
  TRACE: (phash) => `${API_BASE_URL}/api/trace/${encodeURIComponent(phash)}`,
  PROCTOR_VERIFY: `${API_BASE_URL}/api/proctor/verify-frame`,
};
