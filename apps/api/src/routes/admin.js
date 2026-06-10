import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();
router.use(requireAuth, requireAdmin);

// --- Stats overview ---
router.get('/stats', async (req, res) => {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const [
    usersTotal,
    usersThisWeek,
    leadsTotal,
    reportsSold,
    tennisReadings,
    creditsAvailable,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.lead.count(),
    prisma.user.count({ where: { fullReportPurchased: true } }),
    prisma.reading.count({ where: { input: { path: ['kind'], equals: 'tennis' } } }),
    prisma.user.aggregate({ _sum: { tennisCredits: true } }),
  ]);

  res.json({
    usersTotal,
    usersThisWeek,
    leadsTotal,
    reportsSold,
    tennisReadings,
    creditsAvailable: creditsAvailable._sum.tennisCredits ?? 0,
  });
});

// --- Users list ---
// filter: all | has-report | no-report | has-credits | no-credits
router.get('/users', async (req, res) => {
  const { filter = 'all', search = '', page = '1', limit = '50' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filterWhere = {
    'has-report':  { fullReportPurchased: true },
    'no-report':   { fullReportPurchased: false },
    'has-credits': { tennisCredits: { gt: 0 } },
    'no-credits':  { tennisCredits: 0 },
  }[filter] ?? {};

  const searchWhere = search.trim()
    ? { OR: [
        { email: { contains: search.trim(), mode: 'insensitive' } },
        { name:  { contains: search.trim(), mode: 'insensitive' } },
      ]}
    : {};

  const where = { AND: [filterWhere, searchWhere] };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, country: true,
        createdAt: true, fullReportPurchased: true, tennisCredits: true,
        _count: { select: { readings: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({ users, total, page: parseInt(page), limit: parseInt(limit) });
});

// --- Patch user (manual access) ---
router.patch('/users/:id', async (req, res) => {
  const { fullReportPurchased, tennisCredits } = req.body;
  const data = {};
  if (typeof fullReportPurchased === 'boolean') data.fullReportPurchased = fullReportPurchased;
  if (typeof tennisCredits === 'number' && tennisCredits >= 0) data.tennisCredits = tennisCredits;

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Nada que actualizar' });
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data,
    select: { id: true, name: true, email: true, fullReportPurchased: true, tennisCredits: true },
  });
  res.json({ user });
});

// --- Users list CSV export ---
router.get('/users/export', async (req, res) => {
  const { filter = 'all', search = '' } = req.query;

  const filterWhere = {
    'has-report':  { fullReportPurchased: true },
    'no-report':   { fullReportPurchased: false },
    'has-credits': { tennisCredits: { gt: 0 } },
    'no-credits':  { tennisCredits: 0 },
  }[filter] ?? {};

  const searchWhere = search.trim()
    ? { OR: [
        { email: { contains: search.trim(), mode: 'insensitive' } },
        { name:  { contains: search.trim(), mode: 'insensitive' } },
      ]}
    : {};

  const where = { AND: [filterWhere, searchWhere] };

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      name: true, email: true, country: true, createdAt: true,
      fullReportPurchased: true, tennisCredits: true,
      _count: { select: { readings: true } },
    },
  });

  const header = 'Nombre,Email,País,Registro,Informe,Créditos,Lecturas';
  const rows = users.map((u) =>
    [
      u.name ?? '',
      u.email,
      u.country ?? '',
      u.createdAt.toISOString().split('T')[0],
      u.fullReportPurchased ? 'Sí' : 'No',
      u.tennisCredits,
      u._count.readings,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="usuarios.csv"');
  res.send([header, ...rows].join('\n'));
});

// --- Leads list (with CSV export) ---
router.get('/leads', async (req, res) => {
  const { format = 'json', page = '1', limit = '100' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      skip: format === 'csv' ? 0 : skip,
      take: format === 'csv' ? undefined : parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.lead.count(),
  ]);

  if (format === 'csv') {
    const header = 'Nombre,Email,País,Fecha';
    const rows = leads.map((l) =>
      [l.name, l.email, l.country ?? '', l.createdAt.toISOString().split('T')[0]]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    return res.send([header, ...rows].join('\n'));
  }

  res.json({ leads, total, page: parseInt(page), limit: parseInt(limit) });
});

export default router;
