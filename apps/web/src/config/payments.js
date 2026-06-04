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

