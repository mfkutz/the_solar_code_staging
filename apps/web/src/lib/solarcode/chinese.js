/**
 * Chinese zodiac — animal, element and polarity from the Gregorian year.
 *
 * Verified: 2024 -> Wood Yang Dragon (甲辰 Jia Chen). ✅
 *
 * NOTE / known limitation for MVP: the Chinese year actually turns at Chinese
 * New Year (late Jan / early Feb), not on Jan 1. People born in January or
 * early February may fall under the previous animal. Refining this needs a
 * Chinese New Year date table — flagged as a TODO to confirm with the partner.
 */

export const ANIMALS = [
  { key: 'rat', name: 'Rat' },
  { key: 'ox', name: 'Ox' },
  { key: 'tiger', name: 'Tiger' },
  { key: 'rabbit', name: 'Rabbit' },
  { key: 'dragon', name: 'Dragon' },
  { key: 'snake', name: 'Snake' },
  { key: 'horse', name: 'Horse' },
  { key: 'goat', name: 'Goat' },
  { key: 'monkey', name: 'Monkey' },
  { key: 'rooster', name: 'Rooster' },
  { key: 'dog', name: 'Dog' },
  { key: 'pig', name: 'Pig' },
];

export const CHINESE_ELEMENTS = [
  { key: 'wood', name: 'Wood' },
  { key: 'fire', name: 'Fire' },
  { key: 'earth', name: 'Earth' },
  { key: 'metal', name: 'Metal' },
  { key: 'water', name: 'Water' },
];

/**
 * @param {number} year - full Gregorian year
 * @returns {{ animal: object, element: object, polarity: 'yang'|'yin',
 *             approxYearOnly: boolean }}
 */
export function calcChinese(year) {
  const animalIndex = ((year - 4) % 12 + 12) % 12;
  const stem = ((year - 4) % 10 + 10) % 10; // 0..9 heavenly stem
  const elementIndex = Math.floor(stem / 2); // 0..4
  const polarity = stem % 2 === 0 ? 'yang' : 'yin';

  return {
    animal: ANIMALS[animalIndex],
    element: CHINESE_ELEMENTS[elementIndex],
    polarity,
    approxYearOnly: true, // see Chinese New Year note above
  };
}
