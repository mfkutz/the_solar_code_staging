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

/**
 * The site's 5 Universal Elements (Earth, Water, Air, Fire, Ether).
 * This maps each of the 20 Mayan seals to one element.
 *
 * ⚠️ PLACEHOLDER MAPPING — this belongs to the partner's symbolic system.
 * Default below is a simple rotation; confirm the intended seal→element
 * mapping with the partner and edit this single array.
 * Index = sealIndex (0..19). Values: earth | water | air | fire | ether
 */
export const ELEMENT_BY_SEAL = [
  'fire', 'air', 'ether', 'earth', 'fire', // dragon, wind, night, seed, serpent
  'water', 'air', 'fire', 'water', 'earth', // worldbridger, hand, star, moon, dog
  'air', 'ether', 'air', 'ether', 'air', // monkey, human, skywalker, wizard, eagle
  'fire', 'earth', 'ether', 'fire', 'fire', // warrior, earth, mirror, storm, sun
];

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
  const chinese = calcChinese(year);
  const solarCode = calcSolarNumber(tz.kin, year);
  const element = ELEMENT_BY_SEAL[tz.seal.n - 1];

  return {
    input: { name, birthdate, time, country, city, year, month, day },
    solarCode, // 1..144,000 — the headline number
    matrixSize: MATRIX_SIZE,
    kin: tz.kin, // 1..260
    seal: tz.seal, // { n, key, name, color } — the "solar archetype"
    tone: tz.toneInfo, // { n, key, name }
    color: tz.color, // red | white | blue | yellow
    element, // earth | water | air | fire | ether (5-element system)
    chinese, // { animal, element, polarity, approxYearOnly }
    isHunabKu: tz.isHunabKu, // Feb 29 special case
  };
}
