// Stripe Payment Links (no backend). Paste the URL copied from the Stripe
// dashboard into `fullReport` below.
//
// While the link is empty, the "unlock" button navigates straight to the report
// page so the whole flow can be previewed locally without a real payment. Once
// you paste the live link, the button will send users to Stripe to pay, and
// Stripe's "after payment" redirect (set to /codigo/informe) brings them back.

export const PAYMENT_LINKS = {
  // TEST-mode link whose Stripe "after payment" redirect points at the staging
  // Vercel URL (…vercel.app/codigo/informe), so the full pay→report flow can be
  // tested on staging. When going Live, create the equivalent link in Live mode
  // (redirecting to https://thesolarcode.com/codigo/informe) and replace this.
  fullReport: 'https://buy.stripe.com/test_8x200keWA3yK6Eke1Ka3u01',
};

export const PRICES = {
  fullReport: { amount: 22, currency: 'EUR', display: '€22' },
};

export const isPaymentConfigured = (key) => Boolean(PAYMENT_LINKS[key]);

// Where we stash the birth data before sending the user to Stripe, so the
// report page can read it back after the payment redirect (same browser/origin).
export const REPORT_STORAGE_KEY = 'solarCodeReport';

// --- Relational reports (Couple / Family / Team) — Fase 2, still no backend. ---
// Each tier is a separate Stripe Payment Link. Paste the URLs below when ready
// (create them in the same Stripe account, redirecting "after payment" to
// /codigo/conjunto/informe). While a link is empty, the flow previews locally.
//
// price  = { amount, currency, display }
// link   = Stripe Payment Link (empty → preview without paying)
// people = { min, max } number of people the form allows
export const RELATIONAL_PRODUCTS = {
  pareja: {
    price: { amount: 44, currency: 'EUR', display: '€44' },
    link: 'https://buy.stripe.com/test_dRm8wQ4hW1qC7Io2j2a3u02',
    people: { min: 2, max: 2 },
  },
  familiar: {
    price: { amount: 66, currency: 'EUR', display: '€66' },
    link: 'https://buy.stripe.com/test_00w5kE15K2uG1k02j2a3u03',
    people: { min: 2, max: 8 },
  },
  laboral: {
    price: { amount: 88, currency: 'EUR', display: '€88' },
    link: 'https://buy.stripe.com/test_bJedRacOsb1c0fW0aUa3u04',
    people: { min: 2, max: 12 },
  },
  // tenis (€33, 2 people) — phase 2 expansion, not wired yet.
};

export const RELATION_TYPES = Object.keys(RELATIONAL_PRODUCTS);
export const isRelationType = (type) => Object.prototype.hasOwnProperty.call(RELATIONAL_PRODUCTS, type);

// Where we stash the people's birth data before the Stripe redirect.
export const RELATION_STORAGE_KEY = 'solarCodeRelation';

