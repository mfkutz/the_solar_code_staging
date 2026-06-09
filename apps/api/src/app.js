import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { prisma } from './lib/prisma.js';
import authRouter from './routes/auth.js';
import readingsRouter from './routes/readings.js';
import leadsRouter from './routes/leads.js';

// Shared rate-limit factory — returns a configured limiter middleware.
function makeLimit({ windowMin, max, message }) {
  return rateLimit({
    windowMs: windowMin * 60 * 1000,
    max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: message },
  });
}

export function createApp() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';

  // --- CORS -----------------------------------------------------------------
  const origins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (isProd && origins.length === 0) {
    throw new Error('CORS_ORIGIN env var must be set in production');
  }

  app.use(cors({ origin: origins.length ? origins : true, credentials: true }));

  // --- Security headers (Helmet) --------------------------------------------
  // Content-Security-Policy omitted intentionally: the API only serves JSON,
  // not HTML, so CSP has no effect here. All other Helmet defaults apply.
  app.use(helmet({ contentSecurityPolicy: false }));

  // --- Body / cookies -------------------------------------------------------
  app.use(express.json({ limit: '64kb' }));
  app.use(cookieParser());

  // --- Global rate limit (100 req / 1 min per IP) ---------------------------
  app.use(makeLimit({ windowMin: 1, max: 100, message: 'Demasiadas solicitudes, intentá en un minuto.' }));

  // --- Routes ---------------------------------------------------------------
  app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

  app.get('/stats', async (req, res) => {
    const userCount = await prisma.user.count();
    res.json({ userCount });
  });

  // Tight limits on auth endpoints to block brute-force and account flooding.
  const loginLimit    = makeLimit({ windowMin: 15, max: 10,  message: 'Demasiados intentos. Esperá 15 minutos.' });
  const registerLimit = makeLimit({ windowMin: 60, max: 5,   message: 'Demasiados registros. Esperá una hora.' });
  const leadsLimit    = makeLimit({ windowMin: 60, max: 5,   message: 'Demasiados envíos. Esperá una hora.' });

  app.use('/auth/login',    loginLimit);
  app.use('/auth/register', registerLimit);
  app.use('/leads',         leadsLimit);

  app.use('/auth', authRouter);
  app.use('/readings', readingsRouter);
  app.use('/leads', leadsRouter);

  return app;
}
