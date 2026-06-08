# Changelog

All notable changes to THE SOLAR CODE are documented here.
The version shown in the site footer (`vX.Y.Z · date · commit`) matches these entries.

Format: [Keep a Changelog](https://keepachangelog.com/). Versioning: SemVer (pre-1.0, so `0.MINOR.PATCH`).

## [0.9.0] — 2026-06-07
### Changed
- **Navbar redesigned** to reduce clutter: the homepage anchors are grouped into two
  dropdowns — "El Código / The Code" (What is it, 144,000 Codes, Elements, Activation)
  and "Movimiento / Movement" (Golden Dragon, Datong, Join). "Discover Your Code" stays
  flat and **Informes / Reports** is now a highlighted gold button (the CTA).
- **Nav is centered** in the bar (logo left, nav center, language toggle right) for symmetry.
- **Mobile menu** uses collapsible accordions for the two groups, with Informes as a button.
- **Reports cards** are now centered with flexbox (the lone Grupal card no longer sits
  off to the left), and their price line was simplified to a single **"Gratis"** pill —
  the full-report price lives inside each form, where it's already explained.
- **Solar Code of the Day** moved to a slim, tappable ribbon at the very top of the hero
  (expands to show the day's reading), so it's visible on load instead of buried below
  the form.
### Fixed
- **Dropdown menus no longer shift the page sideways** when opened (`modal={false}` stops
  Radix from locking the scrollbar).
- **"Discover Your Code" / "Inicio" now scroll to the very top** (title + form together)
  instead of jumping down to the form and clipping the title — fixed both on click and on
  reload of `/#discover` (via `ScrollToTop`).

## [0.8.0] — 2026-06-07
### Added
- **Expanded individual Full Report (€22)** so it feels complete, drawn from the book
  (derivative text in the author's voice, not copied):
  - "Your Gift & Your Growth Edge" — a strength + a constructive growth edge per Solar Seal
    (all 20 archetypes).
  - "Your Number in the Matrix" — explains the person's exact code, tramo and range within
    the 144,000.
  - "Your Daily Solar Practice" — the book's concrete rituals (SŌL mantra, 5:5:5:5 breathing,
    solar vowels / 369 Hz, greeting the Sun).
  - A symbolic/educational disclaimer (mirrors the book's).
### Fixed
- **Toast notifications now actually show** — the `Toaster` was never mounted, so form
  validation errors (e.g. a missing date of birth) failed silently. This is why the
  relational "calculate" button appeared to do nothing.
### Changed
- **Forms use the horizontal space on large screens**: the group form lays people out in two
  columns (one column on phones); the individual form arranges its fields in two columns on
  larger screens. Actions/headers stay centered and narrow.
- **Native inputs match the dark theme**: `color-scheme: dark` + gold `accent-color` so the
  time/date pickers, their highlight and the autofill background no longer turn white/blue
  (the PDF stays light).
- **Clearer pricing on the chooser**: cards now say "Free result/preview · full report €X"
  instead of a bare price, so it's obvious what's free and what the paid report costs.

## [0.7.0] — 2026-06-07
### Changed
- **Family and Team unified into a single "Grupal" report** (Pablo's call after seeing the
  staging Reports page). Now 3 reports total: Individual, Couple, Group. The group reading
  is the same for any group; price scales with size — **€66 up to 5 people, €88 for 6–8**
  (the form picks the matching Stripe link, still no backend). The chooser shows "from €66".
### Added
- **Solar Code of the Day** ("oráculo del día"): the day's Mayan Kin energy shown under the
  calculator, so people return daily to check the energy. Computed by the same engine, no
  external source. Validated: 2026-06-07 → Kin 180, Yellow Spectral Sun.
- Pricing helpers `relationPricing` / `relationFromPrice` and 12 new engine checks (63/63 pass).

## [0.6.0] — 2026-06-06
### Added
- **Relational reports (Couple / Family / Team)** — Fase 2, still no backend:
  - Reports chooser page (`/informes`) with the 4 options + a "more options" link from
    the individual result and an "Informes" entry in the nav.
  - Multi-person form (`/conjunto/:type`): Couple = 2 people, Family/Team add people
    dynamically (Family up to 8, Team up to 12).
  - Relational engine (`lib/solarcode/relations.js`): symbolic compatibility from the 5
    Solar Elements (same / unifying / nourishing / balancing), group resonance score and
    dominant element. Draft model + content (ES/EN) for the partner to refine.
  - Free teaser (each person's code + shared resonance) → paid report (every bond in
    depth + shared field + synthesis). One Stripe Payment Link per tier (€44/€66/€88),
    links pending.
- Reusable `PersonFields` and `PersonSolarCard` components. 52/52 engine checks pass.

## [0.5.0] — 2026-06-05
### Changed
- **The element now comes from the Solar Code's tramo, not the Mayan seal** (book Chapter 7).
  The 144,000 matrix is read as 60 tramos of 2,400 codes, cycling Earth/Water/Air/Fire/Ether.
  Removed the placeholder seal→element mapping.
- **Solar archetype name fixed in Spanish:** now "Estrella Planetaria Amarilla" (Seal · Tone ·
  Color, with gender agreement) instead of the literal English order. English unchanged.
- **Purpose** and **Solar Reading** reworked so they no longer repeat: Purpose = seal + tone;
  Solar Reading = the person's tramo, element and energy (drawn from the book, in the author's voice).
### Added
- The 60 tramos content (ES/EN): energy name, description and color per tramo.
- Tramo shown on the result (under Element) and a tramo paragraph in the paid report.
- Engine validated against real vectors: Pablo 1989-02-03 → Kin 71 / code 141,219 / Earth Dragon,
  and the book's 1982-03-05 → Kin 146 / Tramo 60. 43/43 engine checks pass.

## [0.4.0] — 2026-06-05
### Added
- Privacy Policy and Terms of Service pages (bilingual ES/EN), reachable from the footer.
  Drafted to match the site (no backend, Stripe payments, browser-side data, Spanish company).
  Pending review by the business owner and a few `[completar: ...]` fields.

## [0.3.0] — 2026-06-05
### Added
- Visible version stamp in the footer (`version · build date · commit`).
### Changed
- The birth-data calculator now sits at the very top of the home page (first thing visitors see).
### Fixed
- Chinese zodiac sign now respects the Chinese New Year boundary. People born in January or
  early February were getting the previous year's animal/element; added a 1920–2031 New Year
  date table so the sign is correct.

## [0.2.0] — earlier
### Added
- Paid Full Report (€22) via Stripe Payment Link, no backend (birth data carried across the
  redirect in localStorage).
- Downloadable, branded PDF of the report (clean light print layout).

## [0.1.0] — earlier
### Added
- Bilingual (ES/EN) site with the Solar Code calculator: Mayan Kin (Dreamspell/Tzolk'in),
  Chinese sign, 5-element system and the 1–144,000 Solar Code, with a free personalized result.
