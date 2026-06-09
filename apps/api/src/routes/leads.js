import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

// Public route: the "Join the 144,000" form. No auth — anyone can sign up.
const router = Router();

const leadSchema = z.object({
  name: z.string().trim().min(1, 'Nombre requerido'),
  email: z.string().trim().email('Email inválido'),
  country: z.string().trim().optional(),
  birthdate: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

router.post('/', async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { name, email, country, birthdate, message } = parsed.data;

  // Upsert by email: re-submitting updates the existing lead instead of
  // creating a duplicate.
  await prisma.lead.upsert({
    where: { email },
    update: { name, country, birthdate, message },
    create: { name, email, country, birthdate, message },
  });
  res.status(201).json({ ok: true });
});

export default router;
