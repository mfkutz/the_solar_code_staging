// Dashboard data utilities
// Bridges the engine's computeSolarCode() output to the rich format
// expected by the dashboard UI components.

import { computeSolarCode } from './solarcode/index.js';
import { chineseAnimals, chineseElements } from '../content/chinese.js';
import { seals } from '../content/seals.js';
import { tones } from '../content/tones.js';
import { tramos, tramoColors } from '../content/tramos.js';
import { solarSignature } from './signature.js';

// Ordered by number 1-20 — used for Pablo's formula: sealA + sealB (mod 20)
const SEAL_KEYS = [
  'dragon','wind','night','seed','serpent',
  'worldbridger','hand','star','moon','dog',
  'monkey','human','skywalker','wizard','eagle',
  'warrior','earth','mirror','storm','sun',
];

// ── Seal metadata (glyph + bilingual powers) keyed by engine seal key ──
const SEAL_META = {
  dragon:       { glyph: '☉', es: { name: 'Dragón',              powers: ['Nacimiento','Nutrir','Ser']               }, en: { name: 'Dragon',            powers: ['Birth','Nurture','Being']              } },
  wind:         { glyph: '✶', es: { name: 'Viento',              powers: ['Espíritu','Comunicar','Aliento']          }, en: { name: 'Wind',              powers: ['Spirit','Communicate','Breath']        } },
  night:        { glyph: '☽', es: { name: 'Noche',               powers: ['Abundancia','Soñar','Intuición']          }, en: { name: 'Night',             powers: ['Abundance','Dream','Intuition']        } },
  seed:         { glyph: '✷', es: { name: 'Semilla',             powers: ['Florecimiento','Apuntar','Conciencia']    }, en: { name: 'Seed',              powers: ['Flowering','Target','Awareness']       } },
  serpent:      { glyph: '❂', es: { name: 'Serpiente',           powers: ['Fuerza Vital','Sobrevivir','Instinto']    }, en: { name: 'Serpent',           powers: ['Life Force','Survive','Instinct']      } },
  worldbridger: { glyph: '✺', es: { name: 'Enlazador de Mundos', powers: ['Muerte','Igualar','Oportunidad']         }, en: { name: 'Worldbridger',      powers: ['Death','Equalize','Opportunity']       } },
  hand:         { glyph: '✧', es: { name: 'Mano',                powers: ['Realización','Conocer','Sanación']        }, en: { name: 'Hand',              powers: ['Accomplishment','Know','Healing']      } },
  star:         { glyph: '✦', es: { name: 'Estrella',            powers: ['Elegancia','Embellecer','Arte']          }, en: { name: 'Star',              powers: ['Elegance','Beautify','Art']            } },
  moon:         { glyph: '◐', es: { name: 'Luna',                powers: ['Agua Universal','Purificar','Flujo']      }, en: { name: 'Moon',              powers: ['Universal Water','Purify','Flow']      } },
  dog:          { glyph: '✸', es: { name: 'Perro',               powers: ['Corazón','Amar','Lealtad']               }, en: { name: 'Dog',               powers: ['Heart','Love','Loyalty']               } },
  monkey:       { glyph: '✴', es: { name: 'Mono',                powers: ['Magia','Jugar','Ilusión']                }, en: { name: 'Monkey',            powers: ['Magic','Play','Illusion']              } },
  human:        { glyph: '✵', es: { name: 'Humano',              powers: ['Libre Albedrío','Influir','Sabiduría']   }, en: { name: 'Human',             powers: ['Free Will','Influence','Wisdom']       } },
  skywalker:    { glyph: '✹', es: { name: 'Caminante del Cielo', powers: ['Espacio','Explorar','Vigilancia']         }, en: { name: 'Skywalker',         powers: ['Space','Explore','Vigilance']          } },
  wizard:       { glyph: '❉', es: { name: 'Mago',                powers: ['Atemporalidad','Encantar','Receptividad']}, en: { name: 'Wizard',            powers: ['Timelessness','Enchant','Receptivity'] } },
  eagle:        { glyph: '✫', es: { name: 'Águila',              powers: ['Visión','Crear','Mente']                 }, en: { name: 'Eagle',             powers: ['Vision','Create','Mind']               } },
  warrior:      { glyph: '✯', es: { name: 'Guerrero',            powers: ['Inteligencia','Cuestionar','Intrepidez'] }, en: { name: 'Warrior',           powers: ['Intelligence','Question','Fearlessness']} },
  earth:        { glyph: '⊛', es: { name: 'Tierra',              powers: ['Navegación','Evolucionar','Sincronía']   }, en: { name: 'Earth',             powers: ['Navigation','Evolve','Synchrony']      } },
  mirror:       { glyph: '◈', es: { name: 'Espejo',              powers: ['Reflejo','Ordenar','Infinito']           }, en: { name: 'Mirror',            powers: ['Reflection','Order','Infinity']        } },
  storm:        { glyph: '⚡', es: { name: 'Tormenta',           powers: ['Autogeneración','Catalizar','Energía']   }, en: { name: 'Storm',             powers: ['Self-Generation','Catalyze','Energy']  } },
  sun:          { glyph: '✲', es: { name: 'Sol',                 powers: ['Fuego Universal','Iluminar','Vida']      }, en: { name: 'Sun',               powers: ['Universal Fire','Illuminate','Life']   } },
};

// 13 galactic tones — bilingual essence/action
const TONE_META = {
  magnetic:    { es: { name: 'Magnético',     essence: 'Propósito',     action: 'Unificar'    }, en: { name: 'Magnetic',     essence: 'Purpose',       action: 'Unify'    } },
  lunar:       { es: { name: 'Lunar',         essence: 'Desafío',       action: 'Polarizar'   }, en: { name: 'Lunar',        essence: 'Challenge',     action: 'Polarize' } },
  electric:    { es: { name: 'Eléctrico',     essence: 'Servicio',      action: 'Activar'     }, en: { name: 'Electric',     essence: 'Service',       action: 'Activate' } },
  selfexisting:{ es: { name: 'Autoexistente', essence: 'Forma',         action: 'Definir'     }, en: { name: 'Self-Existing',essence: 'Form',          action: 'Define'   } },
  overtone:    { es: { name: 'Entonado',      essence: 'Irradiación',   action: 'Comandar'    }, en: { name: 'Overtone',     essence: 'Radiance',      action: 'Command'  } },
  rhythmic:    { es: { name: 'Rítmico',       essence: 'Igualdad',      action: 'Organizar'   }, en: { name: 'Rhythmic',     essence: 'Equality',      action: 'Organize' } },
  resonant:    { es: { name: 'Resonante',     essence: 'Sintonización', action: 'Inspirar'    }, en: { name: 'Resonant',     essence: 'Attunement',    action: 'Channel'  } },
  galactic:    { es: { name: 'Galáctico',     essence: 'Integridad',    action: 'Armonizar'   }, en: { name: 'Galactic',     essence: 'Integrity',     action: 'Harmonize'} },
  solar:       { es: { name: 'Solar',         essence: 'Intención',     action: 'Pulsar'      }, en: { name: 'Solar',        essence: 'Intention',     action: 'Pulse'    } },
  planetary:   { es: { name: 'Planetario',    essence: 'Manifestación', action: 'Perfeccionar'}, en: { name: 'Planetary',    essence: 'Manifestation', action: 'Perfect'  } },
  spectral:    { es: { name: 'Espectral',     essence: 'Liberación',    action: 'Disolver'    }, en: { name: 'Spectral',     essence: 'Liberation',    action: 'Dissolve' } },
  crystal:     { es: { name: 'Cristal',       essence: 'Cooperación',   action: 'Dedicar'     }, en: { name: 'Crystal',      essence: 'Cooperation',   action: 'Dedicate' } },
  cosmic:      { es: { name: 'Cósmico',       essence: 'Presencia',     action: 'Trascender'  }, en: { name: 'Cosmic',       essence: 'Presence',      action: 'Transcend'} },
};

const ELEMENT_DISPLAY = {
  fire:  { glyph: '△', es: { label: 'Fuego',  desc: 'pasión, voluntad y transformación; la chispa que inicia todo movimiento'      }, en: { label: 'Fire',  desc: 'passion, will and transformation; the spark that ignites all movement'         } },
  air:   { glyph: '○', es: { label: 'Aire',   desc: 'ideas, palabra y libertad; el aliento que da forma al espíritu'              }, en: { label: 'Air',   desc: 'ideas, word and freedom; the breath that gives form to spirit'                } },
  water: { glyph: '▽', es: { label: 'Agua',   desc: 'emoción, intuición y memoria; la corriente que conecta los mundos'           }, en: { label: 'Water', desc: 'emotion, intuition and memory; the current that connects the worlds'          } },
  earth: { glyph: '□', es: { label: 'Tierra', desc: 'cuerpo, sincronía y abundancia; las raíces que sostienen la visión'          }, en: { label: 'Earth', desc: 'body, synchrony and abundance; the roots that sustain the vision'             } },
  ether: { glyph: '✦', es: { label: 'Éter',   desc: 'espacio, presencia y trascendencia; el campo que contiene todo'              }, en: { label: 'Ether', desc: 'space, presence and transcendence; the field that contains all'                } },
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

export function fmtDate(ts, lang = 'es') {
  const locale = lang === 'en' ? 'en-US' : 'es-AR';
  return new Date(ts).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
}

function firstName(name) {
  return (name || 'Esta persona').split(' ')[0];
}

// ── enrichCode: transform engine output → rich dashboard object ──
export function enrichCode(result, name, lang = 'es') {
  if (!result) return null;
  const L = lang === 'en' ? 'en' : 'es';

  const sealKey = result.seal?.key ?? result.seal;
  const toneKey = result.tone?.key ?? result.tone;

  const sealMeta  = SEAL_META[sealKey]  || { glyph: '✦', es: { name: sealKey, powers: [] }, en: { name: sealKey, powers: [] } };
  const toneMeta  = TONE_META[toneKey]  || { es: { name: toneKey, essence: '', action: '' }, en: { name: toneKey, essence: '', action: '' } };
  const elMeta    = ELEMENT_DISPLAY[result.element] || ELEMENT_DISPLAY.ether;
  const sealL     = sealMeta[L]  || sealMeta.es;
  const toneL     = toneMeta[L]  || toneMeta.es;
  const elL       = elMeta[L]    || elMeta.es;

  const sealContent  = seals[sealKey]?.[L]            || {};
  const toneContent  = tones[toneKey]?.[L]            || {};
  const tramoN       = result.tramo?.n;
  const tramoContent = tramoN ? tramos[tramoN - 1]?.[L] || {} : {};
  const tramoColor   = tramoColors[result.element]?.[L]?.name || '';

  const sn = result.solarCode ?? result.kin;

  const COLOR_NAMES = {
    es: { red: 'Rojo', white: 'Blanco', blue: 'Azul', yellow: 'Amarillo' },
    en: { red: 'Red',  white: 'White',  blue: 'Blue', yellow: 'Yellow'   },
  };
  const colorDisplay = COLOR_NAMES[L][result.color] || result.color || '';

  const signature = solarSignature({ sealKey, sealName: sealL.name, toneName: toneL.name, colorName: colorDisplay, lang: L });

  const toneNum = result.kin ? ((result.kin - 1) % 13) + 1 : null;

  let chineseLabel = '';
  if (result.chinese) {
    if (typeof result.chinese === 'string') {
      chineseLabel = result.chinese;
    } else if (result.chinese.animal) {
      const animalKey = result.chinese.animal?.key ?? result.chinese.animal;
      const elemKey   = result.chinese.element?.key ?? result.chinese.element;
      const animal    = chineseAnimals[animalKey]?.[L]?.name ?? animalKey;
      const elem      = chineseElements[elemKey]?.[L]?.name  ?? elemKey;
      chineseLabel = elem ? `${elem} ${animal}` : animal;
    }
  }

  return {
    name: name || (L === 'en' ? 'Anonymous' : 'Anónimo'),
    kin: result.kin,
    sealKey,
    toneKey,

    seal: { glyph: sealMeta.glyph, name: sealL.name, powers: sealL.powers },
    tone: { name: toneL.name, essence: toneL.essence, action: toneL.action, meaning: toneContent.meaning || '' },
    element: result.element,
    elementDisplay: { glyph: elMeta.glyph, label: elL.label, desc: elL.desc },
    color: colorDisplay,
    tramoColor,

    archetype:   sealContent.archetype   || sealL.name,
    proposito:   sealContent.purpose     || '',
    toneMeaning: toneContent.meaning     || '',
    tramoEnergy: tramoContent.energy     || '',
    lectura:     tramoContent.description || '',
    gift:        sealContent.gift        || '',
    shadow:      sealContent.shadow      || '',

    tramo: result.tramo,
    chinese: chineseLabel,
    solarNumber: sn,
    solarStr: fmtSolar(sn),
    powers: sealL.powers,
    signature,
    toneNum,
    sealNum: SEAL_KEYS.indexOf(sealKey) + 1, // 1-20 per Pablo's formula
  };
}

// ── getDailyCode: today's energy code (deterministic) ──
export function getDailyCode(lang = 'es') {
  const now = new Date();
  const birthdate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const dayName = lang === 'en' ? "Today's Energy" : 'Energía del Día';
  const result = computeSolarCode({ birthdate, name: dayName });
  const rich = enrichCode(result, dayName, lang);
  const locale = lang === 'en' ? 'en-US' : 'es-AR';
  rich.dateStr = now.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return rich;
}

// ── computeResonance: affinity score between two enriched codes ──
export function computeResonance(a, b, lang = 'es') {
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
  if (lang === 'en') {
    if (level >= 85)      { label = 'Cosmic Harmony';        tag = 'cosmic'; }
    else if (level >= 70) { label = 'High Resonance';         tag = 'high'; }
    else if (level >= 52) { label = 'Dynamic Balance';        tag = 'mid'; }
    else                  { label = 'Challenging Polarity';   tag = 'low'; }
  } else {
    if (level >= 85)      { label = 'Armonía Cósmica';        tag = 'cosmic'; }
    else if (level >= 70) { label = 'Resonancia Alta';         tag = 'high'; }
    else if (level >= 52) { label = 'Equilibrio Dinámico';     tag = 'mid'; }
    else                  { label = 'Polaridad Desafiante';    tag = 'low'; }
  }

  const compatible = affinity >= 60;
  const nameA = firstName(a.name);
  const nameB = firstName(b.name);
  const elA = a.elementDisplay?.label || a.element;
  const elB = b.elementDisplay?.label || b.element;

  const text = lang === 'en'
    ? (compatible
        ? `The ${elA} element of ${nameA} and the ${elB} of ${nameB} form a current that feeds itself. Their tones (${a.tone?.name} and ${b.tone?.name}) share a pulse that makes understanding effortless. This is a bond where ${a.seal?.name} and ${b.seal?.name} learn to create together.`
        : `The ${elA} of ${nameA} meets friction with the ${elB} of ${nameB}: a polarity that, far from being an obstacle, is a mirror. The tones ${a.tone?.name} and ${b.tone?.name} call for awareness and rhythm. This is a bond that teaches through contrast.`)
    : (compatible
        ? `El elemento ${elA} de ${nameA} y el ${elB} de ${nameB} forman una corriente que se alimenta a sí misma. Sus tonos (${a.tone?.name} y ${b.tone?.name}) comparten un pulso que facilita el entendimiento sin esfuerzo. Es un vínculo donde ${a.seal?.name} y ${b.seal?.name} aprenden a crear juntos.`
        : `El ${elA} de ${nameA} encuentra fricción con el ${elB} de ${nameB}: una polaridad que, lejos de ser un obstáculo, es un espejo. Los tonos ${a.tone?.name} y ${b.tone?.name} piden conciencia y ritmo. Es un vínculo que enseña a través del contraste.`);

  const elementsLine = lang === 'en'
    ? (compatible ? `${elA} and ${elB} nourish each other` : `${elA} and ${elB} create tension and call for awareness`)
    : (compatible ? `${elA} y ${elB} se nutren mutuamente`  : `${elA} y ${elB} se tensionan y exigen conciencia`);

  return { level, label, tag, compatible, text, elementsLine };
}

// ── computeAdvantage: sports/tennis H2H using Pablo's formula ──
// selloA + selloB (mod 20, range 1-20) = energía combinada
// energía combinada + sello del día = energía final del partido
export function computeAdvantage(a, b, daily, lang = 'es') {
  const L = lang === 'en' ? 'en' : 'es';

  const snA = a.sealNum || 1;
  const snB = b.sealNum || 1;
  const snD = daily.sealNum || 1;

  const combinedNum = ((snA + snB - 1) % 20) + 1;
  const finalNum    = ((combinedNum + snD - 1) % 20) + 1;

  function sealInfo(num) {
    const key   = SEAL_KEYS[num - 1];
    const meta  = SEAL_META[key];
    const metaL = meta?.[L] || meta?.es || {};
    return { num, key, glyph: meta?.glyph || '✦', name: metaL.name || key, powers: metaL.powers || [] };
  }

  // Resonance with today (for the sync bars — informative, not a winner declaration)
  const ra = computeResonance(daily, a, lang).level;
  const rb = computeResonance(daily, b, lang).level;

  return {
    a: { ...a, todayScore: ra },
    b: { ...b, todayScore: rb },
    snA, snB, snD,
    combined: sealInfo(combinedNum),
    final:    sealInfo(finalNum),
  };
}

export { SEAL_META, TONE_META, ELEMENT_DISPLAY, ELEMENT_AFFINITY };
