// Thin fetch wrapper for the backend API.
//
// - credentials:'include' so the httpOnly auth cookies travel with every request.
// - Transparent refresh: if a request comes back 401 (access token expired), it
//   hits POST /auth/refresh once and replays the original request. The rotation
//   is invisible to the rest of the app.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4100';

// On these endpoints a 401 means "bad credentials / not logged in", not "token
// expired", so we must not try to refresh-and-retry them.
const NO_REFRESH = new Set(['/auth/refresh', '/auth/login', '/auth/register']);

async function request(path, { method = 'GET', body, _retry = false } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err = new Error('No se pudo conectar con el servidor. Verificá tu conexión.');
    err.status = 0;
    throw err;
  }

  if (res.status === 401 && !_retry && !NO_REFRESH.has(path)) {
    const refreshed = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshed.ok) return request(path, { method, body, _retry: true });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};
