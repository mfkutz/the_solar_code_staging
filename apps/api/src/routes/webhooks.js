import { Router } from 'express';
import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';

const router = Router();

// Stripe requires the raw (unparsed) request body to verify the webhook signature.
// express.raw() is applied only to this route — the global express.json() must be
// mounted AFTER this router in app.js.
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig    = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key    = process.env.STRIPE_SECRET_KEY;

  if (!secret || !key) {
    return res.status(500).json({ error: 'Stripe env vars not configured' });
  }

  let event;
  try {
    event = new Stripe(key).webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    return res.status(400).send(`Webhook signature invalid: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId  = session.client_reference_id;
    const product = session.metadata?.product; // 'personal_report' | 'tennis_credits'
    const credits = parseInt(session.metadata?.credits || '0', 10);

    if (userId) {
      if (product === 'tennis_credits' && credits > 0) {
        await prisma.user.update({
          where: { id: userId },
          data:  { tennisCredits: { increment: credits } },
        }).catch(() => {});
      } else if (product === 'couple_report') {
        await prisma.user.update({
          where: { id: userId },
          data:  { coupleReportPurchased: true },
        }).catch(() => {});
      } else if (product === 'group_report') {
        await prisma.user.update({
          where: { id: userId },
          data:  { groupReportPurchased: true },
        }).catch(() => {});
      } else {
        // Default: personal report (backwards compatible with existing links)
        await prisma.user.update({
          where: { id: userId },
          data:  { fullReportPurchased: true },
        }).catch(() => {});
      }
    }
  }

  res.json({ received: true });
});

export default router;
