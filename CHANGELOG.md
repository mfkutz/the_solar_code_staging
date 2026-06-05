# Changelog

All notable changes to THE SOLAR CODE are documented here.
The version shown in the site footer (`vX.Y.Z · date · commit`) matches these entries.

Format: [Keep a Changelog](https://keepachangelog.com/). Versioning: SemVer (pre-1.0, so `0.MINOR.PATCH`).

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
