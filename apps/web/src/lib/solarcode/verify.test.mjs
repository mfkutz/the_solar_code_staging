/**
 * Verification of the Solar Code engine against known reference points.
 * Run:  node apps/web/src/lib/solarcode/verify.test.mjs
 */
import { calcKin } from './tzolkin.js';
import { calcChinese } from './chinese.js';
import { computeSolarCode } from './index.js';

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

// --- Full Solar Code (range + determinism) ---
const r = computeSolarCode({ birthdate: '1995-06-13' });
check('solarCode = kin*year mod 144000', r.solarCode, (51 * 1995) % 144000);
check('solarCode in range', r.solarCode >= 1 && r.solarCode <= 144000, true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
