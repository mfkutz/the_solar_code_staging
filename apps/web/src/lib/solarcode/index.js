/**
 * THE SOLAR CODE — core calculation engine.
 *
 * Pure, deterministic, runs entirely in the browser (no backend needed).
 * Returns language-neutral keys + numbers; the localized text (ES/EN) lives in
 * the content layer so non-developers can edit it without touching this file.
 */
import { calcKin } from './tzolkin.js';
import { calcChinese } from './chinese.js';

export const MATRIX_SIZE = 144000;
export const TRAMO_SIZE = 2400; // codes per tramo
export const TRAMO_COUNT = 60; // 5 elements × 12

/**
 * The site's 5 Universal Elements, cycling Earth→Water→Air→Fire→Ether.
 * The element is NOT derived from the Mayan seal — it comes from the TRAMO
 * (the position of the final Solar Code in the 1..144,000 matrix), per the
 * book's Chapter 7. Tramo color follows the element (Red/Blue/White/Green/Gold).
 */
const TRAMO_ELEMENTS = ['earth', 'water', 'air', 'fire', 'ether'];

/**
 * Solar Code = (Kin × birthYear) reduced into the 1..144,000 matrix.
 * (The site's formula: subtract 144,000 until within range — i.e. modulo.)
 */
function calcSolarNumber(kin, year) {
  let code = (kin * year) % MATRIX_SIZE;
  if (code === 0) code = MATRIX_SIZE;
  return code;
}

/**
 * Locate a Solar Code (1..144,000) within the 60 tramos.
 * Tramos run from 144,000 downward: tramo 1 = 144,000..141,601, tramo 60 = 2,400..1.
 * @returns {{ n, element, rangeHigh, rangeLow }}
 */
export function calcTramo(code) {
  const n = Math.floor((MATRIX_SIZE - code) / TRAMO_SIZE) + 1; // 1..60
  return {
    n,
    element: TRAMO_ELEMENTS[(n - 1) % 5], // earth | water | air | fire | ether
    rangeHigh: MATRIX_SIZE - (n - 1) * TRAMO_SIZE,
    rangeLow: MATRIX_SIZE - n * TRAMO_SIZE + 1,
  };
}

/**
 * @param {Object} input
 * @param {string} [input.name]
 * @param {string} input.birthdate - ISO 'YYYY-MM-DD'
 * @param {string} [input.time]    - 'HH:MM' (optional, reserved for future use)
 * @param {string} [input.country]
 * @param {string} [input.city]
 * @returns {Object} full language-neutral result
 */
export function computeSolarCode({ name = '', birthdate, time = '', country = '', city = '' } = {}) {
  if (!birthdate) throw new Error('birthdate is required');

  const [year, month, day] = birthdate.split('-').map(Number);
  if (!year || !month || !day) throw new Error(`invalid birthdate: ${birthdate}`);

  const tz = calcKin(year, month, day);
  const chinese = calcChinese(year, month, day);
  const solarCode = calcSolarNumber(tz.kin, year);
  const tramo = calcTramo(solarCode); // { n, element, rangeHigh, rangeLow }

  return {
    input: { name, birthdate, time, country, city, year, month, day },
    solarCode, // 1..144,000 — the headline number
    matrixSize: MATRIX_SIZE,
    kin: tz.kin, // 1..260
    seal: tz.seal, // { n, key, name, color } — the "solar archetype"
    tone: tz.toneInfo, // { n, key, name }
    color: tz.color, // red | white | blue | yellow (the seal color)
    tramo, // { n: 1..60, element, rangeHigh, rangeLow }
    element: tramo.element, // earth | water | air | fire | ether — derived from the tramo
    chinese, // { animal, element, polarity, approxYearOnly }
    isHunabKu: tz.isHunabKu, // Feb 29 special case
  };
}
