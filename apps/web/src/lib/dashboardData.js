// Dashboard data utilities
// Bridges the engine's computeSolarCode() output to the rich format
// expected by the dashboard UI components.

import { computeSolarCode } from './solarcode/index.js';
import { chineseAnimals, chineseElements } from '../content/chinese.js';
import { seals } from '../content/seals.js';
import { tones } from '../content/tones.js';
import { tramos, tramoColors } from '../content/tramos.js';
import { solarSignature } from './signature.js';

// ── Seal metadata (glyph + powers + archetype) keyed by engine seal names ──
const SEAL_META = {
  dragon:       { glyph: '☉', name: 'Dragón',              element: 'fire',  powers: ['Nacimiento','Nutrir','Ser'],               archetype: 'El Guardián del Origen' },
  wind:         { glyph: '✶', name: 'Viento',              element: 'air',   powers: ['Espíritu','Comunicar','Aliento'],          archetype: 'El Mensajero del Espíritu' },
  night:        { glyph: '☽', name: 'Noche',               element: 'water', powers: ['Abundancia','Soñar','Intuición'],          archetype: 'La Soñadora de Abundancia' },
  seed:         { glyph: '✷', name: 'Semilla',             element: 'earth', powers: ['Florecimiento','Apuntar','Conciencia'],    archetype: 'El Sembrador de Mundos' },
  serpent:      { glyph: '❂', name: 'Serpiente',           element: 'fire',  powers: ['Fuerza Vital','Sobrevivir','Instinto'],    archetype: 'La Llama Vital' },
  worldbridger: { glyph: '✺', name: 'Enlazador de Mundos', element: 'air',   powers: ['Muerte','Igualar','Oportunidad'],         archetype: 'El Puente entre Mundos' },
  hand:         { glyph: '✧', name: 'Mano',                element: 'water', powers: ['Realización','Conocer','Sanación'],        archetype: 'El Sanador de Manos Abiertas' },
  star:         { glyph: '✦', name: 'Estrella',            element: 'earth', powers: ['Elegancia','Embellecer','Arte'],          archetype: 'La Artista Estelar' },
  moon:         { glyph: '◐', name: 'Luna',                element: 'fire',  powers: ['Agua Universal','Purificar','Flujo'],      archetype: 'La Marea Universal' },
  dog:          { glyph: '✸', name: 'Perro',               element: 'air',   powers: ['Corazón','Amar','Lealtad'],               archetype: 'El Corazón Leal' },
  monkey:       { glyph: '✴', name: 'Mono',                element: 'water', powers: ['Magia','Jugar','Ilusión'],                archetype: 'El Tejedor de Magia' },
  human:        { glyph: '✵', name: 'Humano',              element: 'earth', powers: ['Libre Albedrío','Influir','Sabiduría'],   archetype: 'El Sabio del Libre Albedrío' },
  skywalker:    { glyph: '✹', name: 'Caminante del Cielo', element: 'fire',  powers: ['Espacio','Explorar','Vigilancia'],         archetype: 'El Explorador del Espacio' },
  wizard:       { glyph: '❉', name: 'Mago',                element: 'air',   powers: ['Atemporalidad','Encantar','Receptividad'],archetype: 'El Encantador Atemporal' },
  eagle:        { glyph: '✫', name: 'Águila',              element: 'water', powers: ['Visión','Crear','Mente'],                 archetype: 'La Visionaria Solar' },
  warrior:      { glyph: '✯', name: 'Guerrero',            element: 'earth', powers: ['Inteligencia','Cuestionar','Intrepidez'], archetype: 'El Guerrero de la Pregunta' },
  earth:        { glyph: '⊛', name: 'Tierra',              element: 'fire',  powers: ['Navegación','Evolucionar','Sincronía'],   archetype: 'La Navegante de la Sincronía' },
  mirror:       { glyph: '◈', name: 'Espejo',              element: 'air',   powers: ['Reflejo','Ordenar','Infinito'],           archetype: 'El Espejo del Infinito' },
  storm:        { glyph: '⚡', name: 'Tormenta',           element: 'water', powers: ['Autogeneración','Catalizar','Energía'],   archetype: 'La Catalizadora de Tormentas' },
  sun:          { glyph: '✲', name: 'Sol',                 element: 'earth', powers: ['Fuego Universal','Iluminar','Vida'],      archetype: 'El Portador del Fuego Solar' },
};

// 13 galactic tones keyed by engine tone name (lowercase, no accents)
const TONE_META = {
  magnetic:    { name: 'Magnético',      essence: 'Propósito',     action: 'Unificar' },
  lunar:       { name: 'Lunar',          essence: 'Desafío',       action: 'Polarizar' },
  electric:    { name: 'Eléctrico',      essence: 'Servicio',      action: 'Activar' },
  selfexisting:{ name: 'Autoexistente',  essence: 'Forma',         action: 'Definir' },
  overtone:    { name: 'Entonado',       essence: 'Irradiación',   action: 'Comandar' },
  rhythmic:    { name: 'Rítmico',        essence: 'Igualdad',      action: 'Organizar' },
  resonant:    { name: 'Resonante',      essence: 'Sintonización', action: 'Inspirar' },
  galactic:    { name: 'Galáctico',      essence: 'Integridad',    action: 'Armonizar' },
  solar:       { name: 'Solar',          essence: 'Intención',     action: 'Pulsar' },
  planetary:   { name: 'Planetario',     essence: 'Manifestación', action: 'Perfeccionar' },
  spectral:    { name: 'Espectral',      essence: 'Liberación',    action: 'Disolver' },
  crystal:     { name: 'Cristal',        essence: 'Cooperación',   action: 'Dedicar' },
  cosmic:      { name: 'Cósmico',        essence: 'Presencia',     action: 'Trascender' },
};

const ELEMENT_DISPLAY = {
  fire:  { label: 'Fuego',  glyph: '△', desc: 'pasión, voluntad y transformación; la chispa que inicia todo movimiento' },
  air:   { label: 'Aire',   glyph: '○', desc: 'ideas, palabra y libertad; el aliento que da forma al espíritu' },
  water: { label: 'Agua',   glyph: '▽', desc: 'emoción, intuición y memoria; la corriente que conecta los mundos' },
  earth: { label: 'Tierra', glyph: '□', desc: 'cuerpo, sincronía y abundancia; las raíces que sostienen la visión' },
  ether: { label: 'Éter',   glyph: '✦', desc: 'espacio, presencia y trascendencia; el campo que contiene todo' },
};

// Element affinity matrix (engine keys: fire/air/water/earth/ether)
const ELEMENT_AFFINITY = {
  fire:  { fire: 70, air: 95, water: 35, earth: 60, ether: 80 },
  air:   { fire: 95, air: 70, water: 60, earth: 40, ether: 75 },
  water: { fire: 35, air: 60, water: 80, earth: 95, ether: 70 },
  earth: { fire: 60, air: 40, water: 95, earth: 80, ether: 65 },
  ether: { fire: 80, air: 75, water: 70, earth: 65, ether: 90 },
};


export function fmtSolar(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function firstName(name) {
  return (name || 'Esta persona').split(' ')[0];
}

// ── enrichCode: transform engine output → rich dashboard object ──
export function enrichCode(result, name) {
  if (!result) return null;

  // Engine returns seal/tone as objects {key, name, ...}
  const sealKey = result.seal?.key ?? result.seal;
  const toneKey = result.tone?.key ?? result.tone;

  // UI metadata (glyph, powers for attr cards)
  const sealMeta = SEAL_META[sealKey] || { glyph: '✦', name: result.seal?.name ?? sealKey, powers: [], archetype: '' };
  const toneMeta = TONE_META[toneKey] || { name: result.tone?.name ?? toneKey, essence: '', action: '' };
  const el = ELEMENT_DISPLAY[result.element] || ELEMENT_DISPLAY.ether;

  // Real content from the content layer (same source as ResultPage)
  const sealContent  = seals[sealKey]?.es   || {};
  const toneContent  = tones[toneKey]?.es   || {};
  const tramoN       = result.tramo?.n;
  const tramoContent = tramoN ? tramos[tramoN - 1]?.es || {} : {};
  const tramoColorEs = tramoColors[result.element]?.es?.name || '';

  // Solar Code number — real engine value (1..144,000)
  const sn = result.solarCode ?? result.kin;

  // Seal color (from engine: 'red'|'white'|'blue'|'yellow')
  const COLOR_NAMES = { red: 'Rojo', white: 'Blanco', blue: 'Azul', yellow: 'Amarillo' };
  const colorDisplay = COLOR_NAMES[result.color] || result.color || '';

  // Full galactic signature with gender agreement (e.g. "Viento Cósmico Blanco")
  const signature = solarSignature({ sealKey, sealName: sealMeta.name, toneName: toneMeta.name, colorName: colorDisplay, lang: 'es' });

  // Tone number (1–13) derived from kin
  const toneNum = result.kin ? ((result.kin - 1) % 13) + 1 : null;

  // Chinese zodiac — translated to Spanish
  let chineseLabel = '';
  if (result.chinese) {
    if (typeof result.chinese === 'string') {
      chineseLabel = result.chinese;
    } else if (result.chinese.animal) {
      const animalKey = result.chinese.animal?.key ?? result.chinese.animal;
      const elemKey   = result.chinese.element?.key ?? result.chinese.element;
      const animalEs  = chineseAnimals[animalKey]?.es?.name ?? animalKey;
      const elemEs    = chineseElements[elemKey]?.es?.name ?? elemKey;
      chineseLabel = elemEs ? `${elemEs} ${animalEs}` : animalEs;
    }
  }

  return {
    name: name || 'Anónimo',
    kin: result.kin,
    sealKey,
    toneKey,

    // UI metadata
    seal: sealMeta,
    tone: { ...toneMeta, meaning: toneContent.meaning || '' },
    element: result.element,
    elementDisplay: el,
    color: colorDisplay,
    tramoColor: tramoColorEs,

    // Real content (from content layer — same texts as ResultPage)
    archetype:   sealContent.archetype  || sealMeta.archetype,
    proposito:   sealContent.purpose    || '',
    toneMeaning: toneContent.meaning    || '',
    tramoEnergy: tramoContent.energy    || '',
    lectura:     tramoContent.description || '',
    gift:        sealContent.gift       || '',
    shadow:      sealContent.shadow     || '',

    tramo: result.tramo,
    chinese: chineseLabel,
    solarNumber: sn,
    solarStr: fmtSolar(sn),
    powers: sealMeta.powers,
    signature,
    toneNum,
  };
}

// ── getDailyCode: today's energy code (deterministic) ──
export function getDailyCode() {
  const now = new Date();
  const birthdate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const result = computeSolarCode({ birthdate, name: 'Energía del Día' });
  const rich = enrichCode(result, 'Energía del Día');
  rich.dateStr = now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return rich;
}

// ── computeResonance: affinity score between two enriched codes ──
export function computeResonance(a, b) {
  const affinity = (ELEMENT_AFFINITY[a.element] || {})[b.element] ?? 60;
  const toneNumA = a.kin ? ((a.kin - 1) % 13) + 1 : 1;
  const toneNumB = b.kin ? ((b.kin - 1) % 13) + 1 : 1;
  const toneGap = Math.abs(toneNumA - toneNumB);
  const toneScore = 100 - (toneGap / 12) * 60;
  const kinGap = Math.min(Math.abs(a.kin - b.kin), 260 - Math.abs(a.kin - b.kin));
  const kinScore = 100 - (kinGap / 130) * 50;
  let level = Math.round(affinity * 0.5 + toneScore * 0.3 + kinScore * 0.2);
  level = Math.max(28, Math.min(99, level));

  let label, tag;
  if (level >= 85)      { label = 'Armonía Cósmica';       tag = 'cosmic'; }
  else if (level >= 70) { label = 'Resonancia Alta';        tag = 'high'; }
  else if (level >= 52) { label = 'Equilibrio Dinámico';    tag = 'mid'; }
  else                  { label = 'Polaridad Desafiante';   tag = 'low'; }

  const compatible = affinity >= 60;
  const nameA = firstName(a.name);
  const nameB = firstName(b.name);
  const elA = a.elementDisplay?.label || a.element;
  const elB = b.elementDisplay?.label || b.element;

  const text = compatible
    ? `El elemento ${elA} de ${nameA} y el ${elB} de ${nameB} forman una corriente que se alimenta a sí misma. Sus tonos (${a.tone?.name} y ${b.tone?.name}) comparten un pulso que facilita el entendimiento sin esfuerzo. Es un vínculo donde ${a.seal?.name} y ${b.seal?.name} aprenden a crear juntos.`
    : `El ${elA} de ${nameA} encuentra fricción con el ${elB} de ${nameB}: una polaridad que, lejos de ser un obstáculo, es un espejo. Los tonos ${a.tone?.name} y ${b.tone?.name} piden conciencia y ritmo. Es un vínculo que enseña a través del contraste.`;

  return { level, label, tag, compatible, text, elementsLine: compatible ? `${elA} y ${elB} se nutren mutuamente` : `${elA} y ${elB} se tensionan y exigen conciencia` };
}

// ── computeAdvantage: sports/tennis advantage for today ──
function simpleHash(a, b, c) {
  let h = 2166136261 >>> 0;
  const s = `${a}-${b}-${c}`;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}

export function computeAdvantage(a, b, daily) {
  const ra = computeResonance(daily, a).level;
  const rb = computeResonance(daily, b).level;
  const kinA = a.kin || 1, kinB = b.kin || 1, dKin = daily.kin || 1;
  const ja = simpleHash(kinA, dKin, 0) % 7;
  const jb = simpleHash(kinB, dKin, 1) % 7;
  const sa = ra + ja, sb = rb + jb;
  const winner = sa >= sb ? a : b;
  const margin = Math.abs(sa - sb);
  let verdict;
  if (margin <= 3)      verdict = 'Partido parejo — la energía del día casi no inclina la balanza.';
  else if (margin <= 9) verdict = `${firstName(winner.name)} tiene una ventaja energética ligera hoy.`;
  else                  verdict = `${firstName(winner.name)} surfea la energía del día con clara ventaja.`;
  return {
    a: { ...a, todayScore: Math.min(99, Math.round(sa)) },
    b: { ...b, todayScore: Math.min(99, Math.round(sb)) },
    winnerName: firstName(winner.name),
    verdict,
  };
}

export { SEAL_META, TONE_META, ELEMENT_DISPLAY, ELEMENT_AFFINITY };
