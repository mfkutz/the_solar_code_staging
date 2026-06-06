// Builds the localized "galactic signature" shown as the Solar Archetype.
//   EN: Color · Tone · Seal   → "Yellow Planetary Star"
//   ES: Seal · Tone · Color   → "Estrella Planetaria Amarilla"  (Sello + Tono + Color,
//        with gender agreement when the seal is feminine, per the partner's request).
import { FEMININE_SEALS } from '@/content/seals.js';

// Spanish adjective gender: feminine turns a trailing -o into -a
// (Amarillo→Amarilla, Planetario→Planetaria, Rítmico→Rítmica). Others (Azul, Solar,
// Lunar, Espectral, Cristal, Autoexistente, Resonante) stay unchanged.
const feminize = (word) => (word.endsWith('o') ? `${word.slice(0, -1)}a` : word);

/**
 * @param {Object} p
 * @param {string} p.sealKey   - engine seal key (e.g. 'star')
 * @param {string} p.sealName  - localized seal name (e.g. 'Estrella' / 'Star')
 * @param {string} p.toneName  - localized tone name (e.g. 'Planetario' / 'Planetary')
 * @param {string} p.colorName - localized color name (e.g. 'Amarillo' / 'Yellow')
 * @param {string} p.lang      - 'es' | 'en'
 * @returns {string}
 */
export function solarSignature({ sealKey, sealName, toneName, colorName, lang }) {
  if (lang === 'es') {
    const feminine = FEMININE_SEALS.has(sealKey);
    const tone = feminine ? feminize(toneName) : toneName;
    const color = feminine ? feminize(colorName) : colorName;
    return `${sealName} ${tone} ${color}`;
  }
  return `${colorName} ${toneName} ${sealName}`;
}
