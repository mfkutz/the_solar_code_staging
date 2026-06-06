/**
 * Relational engine — Couple / Family / Team readings.
 *
 * Pure, browser-side. Takes several people's birth inputs, computes each one's
 * Solar Code, and derives a symbolic compatibility between them from the 5 Solar
 * Elements (Earth · Water · Air · Fire · Ether).
 *
 * ⚠️ DRAFT symbolic model — the affinity rules and weights are a reasonable
 * default in the book's spirit, for the partner to confirm and refine. Readings
 * are intentionally all affirmative (no "incompatible" verdicts).
 */
import { computeSolarCode } from './index.js';

// Complementary "nourishing" element pairs (each strengthens the other).
const NOURISHING = new Set(['earth-water', 'air-fire']);

const CATEGORY_WEIGHT = {
  same: 85, // same element → deep, instinctive understanding
  unifying: 92, // Ether connects with everything
  nourishing: 88, // complementary strengths that feed each other
  balancing: 76, // different energies that teach and balance
};

/** Symbolic category between two elements. */
export function pairCategory(e1, e2) {
  if (e1 === e2) return 'same';
  if (e1 === 'ether' || e2 === 'ether') return 'unifying';
  const key = [e1, e2].sort().join('-');
  return NOURISHING.has(key) ? 'nourishing' : 'balancing';
}

/**
 * @param {Array<Object>} inputs - birth inputs ({ name, birthdate, ... }), 2+.
 * @returns {{ people, pairs, group }}
 */
export function computeRelation(inputs) {
  const people = inputs.map((input) => computeSolarCode(input));

  // All unordered pairs (i < j).
  const pairs = [];
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const a = people[i];
      const b = people[j];
      const category = pairCategory(a.element, b.element);
      pairs.push({
        i, j,
        nameA: a.input.name || '', nameB: b.input.name || '',
        elementA: a.element, elementB: b.element,
        category,
        weight: CATEGORY_WEIGHT[category],
        sameTramo: a.tramo.n === b.tramo.n,
        sameSeal: a.seal.key === b.seal.key,
      });
    }
  }

  // Group element distribution.
  const elementCounts = {};
  for (const p of people) elementCounts[p.element] = (elementCounts[p.element] || 0) + 1;
  const dominantElement = Object.entries(elementCounts)
    .sort((x, y) => y[1] - x[1])[0][0];
  const diversity = Object.keys(elementCounts).length;

  // Group resonance = average pair affinity (1..100). With 2+ people there is ≥1 pair.
  const resonance = Math.round(pairs.reduce((s, p) => s + p.weight, 0) / pairs.length);

  // Strongest bond (highest weight; ties broken by order).
  const strongestPair = pairs.reduce((best, p) => (p.weight > best.weight ? p : best), pairs[0]);

  return {
    people,
    pairs,
    group: { elementCounts, dominantElement, diversity, resonance, strongestPair, size: people.length },
  };
}
