// Stripe Payment Links (no backend). Paste the URL copied from the Stripe
// dashboard into `fullReport` below.
//
// While the link is empty, the "unlock" button navigates straight to the report
// page so the whole flow can be previewed locally without a real payment. Once
// you paste the live link, the button will send users to Stripe to pay, and
// Stripe's "after payment" redirect (set to /code/report) brings them back.

export const PAYMENT_LINKS = {
  // Set VITE_STRIPE_* in your .env to enable Stripe redirects.
  // Leave empty to bypass Stripe and preview flows locally without paying.
  fullReport:     import.meta.env.VITE_STRIPE_FULL_REPORT      || '',
  tennisCredits:  import.meta.env.VITE_STRIPE_TENNIS_CREDITS   || '',
  // Stripe metadata required: product=couple_report / product=group_report
  coupleReport:   import.meta.env.VITE_STRIPE_COUPLE           || '',
  groupReport:    import.meta.env.VITE_STRIPE_GROUP_5          || '',
};

export const PRICES = {
  fullReport: { amount: 22, currency: 'EUR', display: '€22' },
};

export const isPaymentConfigured = (key) => Boolean(PAYMENT_LINKS[key]);

// Where we stash the birth data before sending the user to Stripe, so the
// report page can read it back after the payment redirect (same browser/origin).
export const REPORT_STORAGE_KEY = 'solarCodeReport';

// --- Relational reports (Couple / Group) — Fase 2, still no backend. ---
// Pablo (2026-06-07) unified Family + Team into a single "Grupal" report: it is
// the same reading for any group, priced by size (€66 up to 5 people, €88 up to
// 8). So there are 3 reports total: Individual, Pareja, Grupal.
//
// Each price point is a separate Stripe Payment Link (no backend → one fixed
// link per price). "Grupal" carries tiers; the form picks the link that matches
// how many people were added.
//
// price  = { amount, currency, display }
// link   = Stripe Payment Link (empty → preview without paying)
// people = { min, max } number of people the form allows
// tiers  = (grupal only) [{ maxPeople, price, link }] sorted ascending
export const RELATIONAL_PRODUCTS = {
  couple: {
    price: { amount: 44, currency: 'EUR', display: '€44' },
    link: import.meta.env.VITE_STRIPE_COUPLE || '',
    people: { min: 2, max: 2 },
  },
  group: {
    // Couple already covers 2 people, so Group starts at 3 (confirm with Pablo).
    people: { min: 3, max: 8 },
    tiers: [
      { maxPeople: 5, price: { amount: 66, currency: 'EUR', display: '€66' }, link: import.meta.env.VITE_STRIPE_GROUP_5 || '' },
      { maxPeople: 8, price: { amount: 88, currency: 'EUR', display: '€88' }, link: import.meta.env.VITE_STRIPE_GROUP_8 || '' },
    ],
  },
  // tenis (€33, 2 people) — phase 2 expansion, not wired yet.
};

export const RELATION_TYPES = Object.keys(RELATIONAL_PRODUCTS);
export const isRelationType = (type) => Object.prototype.hasOwnProperty.call(RELATIONAL_PRODUCTS, type);

// Resolve the price + Stripe link for a relational product. "Grupal" scales by
// group size via tiers; the others have a single price/link.
export function relationPricing(type, peopleCount = 0) {
  const product = RELATIONAL_PRODUCTS[type];
  if (!product) return null;
  if (product.tiers) {
    const tier = product.tiers.find((tr) => peopleCount <= tr.maxPeople)
      || product.tiers[product.tiers.length - 1];
    return { price: tier.price, link: tier.link };
  }
  return { price: product.price, link: product.link };
}

// Lowest price of a product — used for "from €66" labels on the chooser.
// Returns { price, tiered } so the UI can show "from" only when it varies.
export function relationFromPrice(type) {
  const product = RELATIONAL_PRODUCTS[type];
  if (!product) return null;
  if (product.tiers) return { price: product.tiers[0].price, tiered: true };
  return { price: product.price, tiered: false };
}

// Where we stash the people's birth data before the Stripe redirect.
export const RELATION_STORAGE_KEY = 'solarCodeRelation';

