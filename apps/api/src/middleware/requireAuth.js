import { verifyAccessToken, ACCESS_COOKIE } from '../lib/auth.js';

// Gate for protected routes: reads the access cookie, verifies the JWT and
// attaches req.user. Responds 401 if missing or invalid/expired. When the access
// token is expired the front calls POST /auth/refresh to get a fresh one.
export function requireAuth(req, res, next) {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) return res.status(401).json({ error: 'No autenticado' });
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión inválida' });
  }
}
