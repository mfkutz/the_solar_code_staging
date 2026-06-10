import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  accessCookieOptions,
  refreshCookieOptions,
  newId,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE_MS,
} from '../lib/auth.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const credentials = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().trim().min(1).optional(),
});

const publicUser = (u) => ({
  id: u.id, email: u.email, name: u.name,
  birthdate: u.birthdate ?? null,
  country: u.country ?? null,
  memberNumber: u.memberNumber,
  fullReportPurchased: u.fullReportPurchased ?? false,
});

// Start a new session (a refresh-token family) and set both cookies.
async function issueSession(res, user) {
  const familyId = newId();
  const jti = newId();
  const expiresAt = new Date(Date.now() + REFRESH_MAX_AGE_MS);
  await prisma.session.create({ data: { id: familyId, userId: user.id, currentJti: jti, expiresAt } });
  res.cookie(ACCESS_COOKIE, signAccessToken(user), accessCookieOptions());
  res.cookie(REFRESH_COOKIE, signRefreshToken({ userId: user.id, familyId, jti }), refreshCookieOptions());
}

function clearAuthCookies(res) {
  const { maxAge: _a, ...access } = accessCookieOptions();
  const { maxAge: _r, ...refresh } = refreshCookieOptions();
  res.clearCookie(ACCESS_COOKIE, access);
  res.clearCookie(REFRESH_COOKIE, refresh);
}

router.post('/register', async (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Ese email ya está registrado' });

  const user = await prisma.user.create({
    data: { email, passwordHash: await hashPassword(password), name: name ?? null },
  });
  await issueSession(res, user);
  res.status(201).json({ user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const parsed = credentials.pick({ email: true, password: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Email o contraseña inválidos' });
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  // Same response whether the email exists or the password is wrong (don't leak
  // which emails are registered).
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos' });
  }
  await issueSession(res, user);
  res.json({ user: publicUser(user) });
});

// Rotate: swap the refresh token for a fresh pair. Detects replay of an old
// (already-rotated) token and revokes the whole family if it sees one.
router.post('/refresh', async (req, res) => {
  const raw = req.cookies?.[REFRESH_COOKIE];
  if (!raw) return res.status(401).json({ error: 'No autenticado' });

  let payload;
  try {
    payload = verifyRefreshToken(raw);
  } catch {
    return res.status(401).json({ error: 'Sesión inválida' });
  }

  const session = await prisma.session.findUnique({ where: { id: payload.fam } });
  if (!session || session.userId !== payload.sub) {
    return res.status(401).json({ error: 'Sesión inválida' });
  }
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return res.status(401).json({ error: 'Sesión expirada' });
  }
  // The presented jti is no longer the current one → an old token was replayed.
  // Likely theft: kill the family so neither party can keep using it.
  if (session.currentJti !== payload.jti) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return res.status(401).json({ error: 'Sesión revocada' });
  }

  const jti = newId();
  await prisma.session.update({ where: { id: session.id }, data: { currentJti: jti } });
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  res.cookie(ACCESS_COOKIE, signAccessToken(user), accessCookieOptions());
  res.cookie(REFRESH_COOKIE, signRefreshToken({ userId: user.id, familyId: session.id, jti }), refreshCookieOptions());
  res.json({ user: publicUser(user) });
});

// Log out this device: revoke the current session and clear cookies.
router.post('/logout', async (req, res) => {
  const raw = req.cookies?.[REFRESH_COOKIE];
  if (raw) {
    try {
      const payload = verifyRefreshToken(raw);
      await prisma.session.deleteMany({ where: { id: payload.fam } });
    } catch {
      // Invalid token — nothing to revoke, just clear the cookies below.
    }
  }
  clearAuthCookies(res);
  res.json({ ok: true });
});

// Log out everywhere: revoke all of the user's sessions.
router.post('/logout-all', requireAuth, async (req, res) => {
  await prisma.session.deleteMany({ where: { userId: req.user.id } });
  clearAuthCookies(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, birthdate: true, country: true, memberNumber: true, fullReportPurchased: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ user });
});

router.patch('/profile', requireAuth, async (req, res) => {
  const schema = z.object({
    name: z.string().trim().min(1).optional(),
    birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido').optional(),
    country: z.string().trim().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: parsed.data,
    select: { id: true, email: true, name: true, birthdate: true, country: true, memberNumber: true, fullReportPurchased: true, createdAt: true },
  });
  res.json({ user });
});

export default router;
