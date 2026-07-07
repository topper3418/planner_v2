// API base configuration for New World / subpath deployments.
// In production the platform sets VITE_API_BASE_URL to e.g. "/apps/planner-v2/api"
// In dev it falls back to "/api" (which the vite proxy handles by stripping /api).
export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

// Helper: turn a dev-style /api/... path into the correct deployed path.
// Keeps all the existing "/api/..." constants working in both dev and prod.
export function withApiBase(path) {
  if (!path) return API_BASE;
  if (path.startsWith('/api')) {
    return API_BASE + path.slice(4);  // remove leading /api , API_BASE already has the right prefix
  }
  if (path.startsWith('api')) {
    return API_BASE + path.slice(3);
  }
  // already a full or other path
  return path.startsWith('/') ? path : '/' + path;
}

// Build an absolute URL for apiFetch, honoring subpath deployment.
export function buildApiUrl(path) {
  return new URL(withApiBase(path), window.location.origin);
}
