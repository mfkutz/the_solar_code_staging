import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';

// Every route here requires a logged-in user.
const router = Router();
router.use(requireAuth);

// A reading is what the user entered (input) + what the engine computed (result).
// Both are stored as-is (JSON); the front computes them today.
const readingSchema = z.object({
  input: z.record(z.any()),
  result: z.record(z.any()),
});

// Save a consultation to the user's history.
router.post('/', async (req, res) => {
  const parsed = readingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Datos de la lectura inválidos' });
  }
  const reading = await prisma.reading.create({
    data: { userId: req.user.id, input: parsed.data.input, result: parsed.data.result },
  });
  res.status(201).json({ reading });
});

// List the user's readings, newest first.
router.get('/', async (req, res) => {
  const readings = await prisma.reading.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ readings });
});

// Remove one of the user's readings. Scoped by userId so you can only delete
// your own (a reading id from someone else simply matches nothing).
router.delete('/:id', async (req, res) => {
  const { count } = await prisma.reading.deleteMany({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (count === 0) return res.status(404).json({ error: 'Lectura no encontrada' });
  res.json({ ok: true });
});

export default router;
