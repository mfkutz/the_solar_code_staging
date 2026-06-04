/**
 * Tzolk'in / Dreamspell Kin calculation.
 *
 * System: José Argüelles "Dreamspell" 13:20 count — the same one used by
 * mayankin.com (the reference our partner gave us).
 *
 * Formula (verified against two independent anchors):
 *   kin = (yearCode + monthCode + day) mod 260      (0 -> 260)
 *   yearCode = (232 + 105 * gregorianYear) mod 260
 *
 *   monthCode = days elapsed before the 1st of that month in a 28-day-February
 *   year (the Dreamspell never counts Feb 29, "0.0 Hunab Ku", so the same table
 *   works every year and the leap day is simply skipped).
 *
 * Verified test vectors:
 *   1987-07-26 -> kin 34  (official Dreamspell start, White Galactic Wizard)
 *   1995-06-13 -> kin 51  (documented worked example, Blue Crystal Monkey)
 */

// Cumulative days before each month (index 0 = January) assuming a 28-day Feb.
const MONTH_CODE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

// 20 Solar Seals, in order 1..20. `color` cycles Red/White/Blue/Yellow.
// `name` is the canonical English key; localized text lives in the content layer.
export const SEALS = [
  { n: 1, key: 'dragon', name: 'Dragon', color: 'red' },
  { n: 2, key: 'wind', name: 'Wind', color: 'white' },
  { n: 3, key: 'night', name: 'Night', color: 'blue' },
  { n: 4, key: 'seed', name: 'Seed', color: 'yellow' },
  { n: 5, key: 'serpent', name: 'Serpent', color: 'red' },
  { n: 6, key: 'worldbridger', name: 'Worldbridger', color: 'white' },
  { n: 7, key: 'hand', name: 'Hand', color: 'blue' },
  { n: 8, key: 'star', name: 'Star', color: 'yellow' },
  { n: 9, key: 'moon', name: 'Moon', color: 'red' },
  { n: 10, key: 'dog', name: 'Dog', color: 'white' },
  { n: 11, key: 'monkey', name: 'Monkey', color: 'blue' },
  { n: 12, key: 'human', name: 'Human', color: 'yellow' },
  { n: 13, key: 'skywalker', name: 'Skywalker', color: 'red' },
  { n: 14, key: 'wizard', name: 'Wizard', color: 'white' },
  { n: 15, key: 'eagle', name: 'Eagle', color: 'blue' },
  { n: 16, key: 'warrior', name: 'Warrior', color: 'yellow' },
  { n: 17, key: 'earth', name: 'Earth', color: 'red' },
  { n: 18, key: 'mirror', name: 'Mirror', color: 'white' },
  { n: 19, key: 'storm', name: 'Storm', color: 'blue' },
  { n: 20, key: 'sun', name: 'Sun', color: 'yellow' },
];

// 13 Galactic Tones, in order 1..13.
export const TONES = [
  { n: 1, key: 'magnetic', name: 'Magnetic' },
  { n: 2, key: 'lunar', name: 'Lunar' },
  { n: 3, key: 'electric', name: 'Electric' },
  { n: 4, key: 'selfexisting', name: 'Self-Existing' },
  { n: 5, key: 'overtone', name: 'Overtone' },
  { n: 6, key: 'rhythmic', name: 'Rhythmic' },
  { n: 7, key: 'resonant', name: 'Resonant' },
  { n: 8, key: 'galactic', name: 'Galactic' },
  { n: 9, key: 'solar', name: 'Solar' },
  { n: 10, key: 'planetary', name: 'Planetary' },
  { n: 11, key: 'spectral', name: 'Spectral' },
  { n: 12, key: 'crystal', name: 'Crystal' },
  { n: 13, key: 'cosmic', name: 'Cosmic' },
];

/**
 * Compute the Dreamspell Kin for a Gregorian date.
 * @param {number} year  - full Gregorian year (e.g. 1995)
 * @param {number} month - 1..12
 * @param {number} day   - 1..31
 * @returns {{ kin: number, seal: object, tone: number, toneInfo: object,
 *             color: string, isHunabKu: boolean }}
 */
export function calcKin(year, month, day) {
  // Feb 29 has no Kin of its own in the Dreamspell ("0.0 Hunab Ku").
  // We surface a flag and compute it as Feb 28 so the UI can show a note.
  const isHunabKu = month === 2 && day === 29;
  const effectiveDay = isHunabKu ? 28 : day;

  const yearCode = (232 + 105 * year) % 260;
  const monthCode = MONTH_CODE[month - 1];

  let kin = (yearCode + monthCode + effectiveDay) % 260;
  if (kin === 0) kin = 260;

  const sealIndex = ((kin - 1) % 20); // 0..19
  const toneNumber = ((kin - 1) % 13) + 1; // 1..13
  const seal = SEALS[sealIndex];

  return {
    kin,
    seal,
    color: seal.color,
    tone: toneNumber,
    toneInfo: TONES[toneNumber - 1],
    isHunabKu,
  };
}
