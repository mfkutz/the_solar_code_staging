/**
 * Verification of the Solar Code engine against known reference points.
 * Run:  node apps/web/src/lib/solarcode/verify.test.mjs
 */
import { calcKin } from './tzolkin.js';
import { calcChinese } from './chinese.js';
import { computeSolarCode, calcTramo } from './index.js';
import { computeRelation, pairCategory } from './relations.js';
import { relationPricing, relationFromPrice } from '../../config/payments.js';

let pass = 0;
let fail = 0;
function check(label, got, expected) {
  const ok = JSON.stringify(got) === JSON.stringify(expected);
  console.log(`${ok ? '✅' : '❌'} ${label} → got ${JSON.stringify(got)}${ok ? '' : ` (expected ${JSON.stringify(expected)})`}`);
  ok ? pass++ : fail++;
}

// --- Tzolk'in / Kin (verified Dreamspell anchors) ---
const a = calcKin(1987, 7, 26); // official start: Kin 34 White Galactic Wizard
check('1987-07-26 kin', a.kin, 34);
check('1987-07-26 seal', a.seal.name, 'Wizard');
check('1987-07-26 color', a.color, 'white');
check('1987-07-26 tone', a.toneInfo.name, 'Galactic');

const b = calcKin(1995, 6, 13); // worked example: Kin 51 Blue Crystal Monkey
check('1995-06-13 kin', b.kin, 51);
check('1995-06-13 seal', b.seal.name, 'Monkey');
check('1995-06-13 color', b.color, 'blue');
check('1995-06-13 tone', b.toneInfo.name, 'Crystal');

// --- Continuity across year + leap boundaries ---
check('1987-12-31 kin', calcKin(1987, 12, 31).kin, 192);
check('1988-01-01 kin', calcKin(1988, 1, 1).kin, 193); // +1, no gap
check('1988-02-28 kin', calcKin(1988, 2, 28).kin, 251);
check('1988-03-01 kin', calcKin(1988, 3, 1).kin, 252); // +1: Feb 29 skipped (0.0)
check('1988-02-29 isHunabKu', calcKin(1988, 2, 29).isHunabKu, true);

// --- Chinese zodiac ---
const c = calcChinese(2024); // Wood Yang Dragon
check('2024 animal', c.animal.name, 'Dragon');
check('2024 element', c.element.name, 'Wood');
check('2024 polarity', c.polarity, 'yang');

// Chinese New Year boundary (CNY 2024 = Feb 10):
const beforeCny = calcChinese(2024, 2, 9); // still the 2023 year → Water Yin Rabbit
check('2024-02-09 animal', beforeCny.animal.name, 'Rabbit');
check('2024-02-09 element', beforeCny.element.name, 'Water');
check('2024-02-09 polarity', beforeCny.polarity, 'yin');
check('2024-02-09 exact', beforeCny.approxYearOnly, false);

const onCny = calcChinese(2024, 2, 10); // new year starts → Wood Yang Dragon
check('2024-02-10 animal', onCny.animal.name, 'Dragon');
check('2024-02-10 element', onCny.element.name, 'Wood');

// --- Full Solar Code (range + determinism) ---
const r = computeSolarCode({ birthdate: '1995-06-13' });
check('solarCode = kin*year mod 144000', r.solarCode, (51 * 1995) % 144000);
check('solarCode in range', r.solarCode >= 1 && r.solarCode <= 144000, true);

// --- Tramo: element from the Solar Code, not the seal (book Chapter 7) ---
// Tramos run from 144,000 downward in blocks of 2,400. Element cycles E/W/A/F/Et.
check('tramo of 144000', calcTramo(144000), { n: 1, element: 'earth', rangeHigh: 144000, rangeLow: 141601 });
check('tramo of 141601', calcTramo(141601).n, 1);
check('tramo of 141600', calcTramo(141600).n, 2); // next block
check('tramo 2 element', calcTramo(141600).element, 'water');
check('tramo of 1', calcTramo(1), { n: 60, element: 'ether', rangeHigh: 2400, rangeLow: 1 });

// --- Real validation vectors given by the partner / the book ---
// Pablo: 1989-02-03 → Kin 71 (Blue Rhythmic Monkey), code 141,219, Earth Dragon.
const pablo = computeSolarCode({ birthdate: '1989-02-03' });
check('Pablo kin', pablo.kin, 71);
check('Pablo seal', pablo.seal.name, 'Monkey');
check('Pablo tone', pablo.tone.name, 'Rhythmic');
check('Pablo solarCode', pablo.solarCode, 141219);
check('Pablo tramo', pablo.tramo.n, 2);
check('Pablo element', pablo.element, 'water');
check('Pablo chinese animal', pablo.chinese.animal.name, 'Dragon');
check('Pablo chinese element', pablo.chinese.element.name, 'Earth');
check('Pablo chinese exact', pablo.chinese.approxYearOnly, false);

// Book example: 1982-03-05 → Kin 146 (White Electric Worldbridger), Tramo 60.
// (The printed book has an arithmetic typo: 146×1982 = 289,372 → code 1,372, not 1,772;
//  both fall in Tramo 60, so the book's conclusion holds.)
const book = computeSolarCode({ birthdate: '1982-03-05' });
check('Book kin', book.kin, 146);
check('Book seal', book.seal.name, 'Worldbridger');
check('Book solarCode', book.solarCode, (146 * 1982) % 144000);
check('Book tramo', book.tramo.n, 60);
check('Book element', book.element, 'ether');

// --- Relational engine (Couple / Family / Team) ---
check('pairCategory same', pairCategory('fire', 'fire'), 'same');
check('pairCategory ether', pairCategory('ether', 'water'), 'unifying');
check('pairCategory nourishing', pairCategory('earth', 'water'), 'nourishing');
check('pairCategory balancing', pairCategory('fire', 'water'), 'balancing');

const couple = computeRelation([{ birthdate: '1989-02-03', name: 'A' }, { birthdate: '1990-07-15', name: 'B' }]);
check('couple has 2 people', couple.people.length, 2);
check('couple has 1 pair', couple.pairs.length, 1);
check('couple resonance in range', couple.group.resonance >= 1 && couple.group.resonance <= 100, true);

const family = computeRelation([
  { birthdate: '1989-02-03' }, { birthdate: '1990-07-15' }, { birthdate: '2015-09-01' },
]);
check('family has 3 pairs', family.pairs.length, 3); // 3 choose 2
check('family dominant element is a string', typeof family.group.dominantElement, 'string');

// --- Grupal tiered pricing (€66 up to 5, €88 for 6–8) ---
check('pareja price', relationPricing('pareja', 2).price.amount, 44);
check('grupal 3 people → €66', relationPricing('grupal', 3).price.amount, 66);
check('grupal 5 people → €66', relationPricing('grupal', 5).price.amount, 66);
check('grupal 6 people → €88', relationPricing('grupal', 6).price.amount, 88);
check('grupal 8 people → €88', relationPricing('grupal', 8).price.amount, 88);
check('grupal "from" price is €66', relationFromPrice('grupal').price.amount, 66);
check('grupal is tiered', relationFromPrice('grupal').tiered, true);
check('pareja is not tiered', relationFromPrice('pareja').tiered, false);

// --- Solar Code of the Day (fixed vector: Pablo's example 2026-06-07) ---
const day = computeSolarCode({ birthdate: '2026-06-07' });
check('2026-06-07 kin', day.kin, 180); // Sol Espectral Amarillo
check('2026-06-07 seal', day.seal.key, 'sun');
check('2026-06-07 tone', day.tone.key, 'spectral');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
