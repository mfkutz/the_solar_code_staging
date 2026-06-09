import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Two-token scheme:
//   access  — short-lived (15m), sent on every request, path '/'.
//   refresh — long-lived (30d), only sent to /auth, rotated on each use.
const ACCESS_TTL = '15m';
const ACCESS_MAX_AGE_MS = 15 * 60 * 1000;
export const REFRESH_TTL_DAYS = 30;
export const REFRESH_MAX_AGE_MS = REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000;

export const ACCESS_COOKIE = 'access';
export const REFRESH_COOKIE = 'refresh';

export const hashPassword = (plain) => bcrypt.hash(plain, 12);
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

export const newId = () => crypto.randomUUID();

const secret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not set');
  return s;
};

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, typ: 'access' }, secret(), {
    expiresIn: ACCESS_TTL,
  });
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, secret());
  if (payload.typ !== 'access') throw new Error('not an access token');
  return payload;
}

export function signRefreshToken({ userId, familyId, jti }) {
  return jwt.sign({ sub: userId, fam: familyId, jti, typ: 'refresh' }, secret(), {
    expiresIn: `${REFRESH_TTL_DAYS}d`,
  });
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, secret());
  if (payload.typ !== 'refresh') throw new Error('not a refresh token');
  return payload;
}

// Cross-site cookies (front on Vercel, API on Railway) need SameSite=None +
// Secure in production; local dev (http) falls back to Lax.
function baseCookie() {
  const isProd = process.env.NODE_ENV === 'production';
  return { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd };
}

export const accessCookieOptions = () => ({ ...baseCookie(), path: '/', maxAge: ACCESS_MAX_AGE_MS });
// Scoped to /auth so the refresh token is never sent to /readings etc.
export const refreshCookieOptions = () => ({ ...baseCookie(), path: '/auth', maxAge: REFRESH_MAX_AGE_MS });
