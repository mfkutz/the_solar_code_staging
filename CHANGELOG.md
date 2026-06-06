# Changelog

All notable changes to THE SOLAR CODE are documented here.
The version shown in the site footer (`vX.Y.Z · date · commit`) matches these entries.

Format: [Keep a Changelog](https://keepachangelog.com/). Versioning: SemVer (pre-1.0, so `0.MINOR.PATCH`).

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
