// The 20 Solar Seals = the "solar archetypes". Keyed by the engine's seal.key.
// DRAFT content in the site's voice — for the partner to review and refine.
// Each: { name, archetype (tagline), purpose (paragraph) } per language.

// Seals whose Spanish name is feminine — used to agree the tone/color adjectives
// in the galactic signature (e.g. "Estrella Planetaria Amarilla", not "...Planetario Amarillo").
export const FEMININE_SEALS = new Set([
  'night', 'seed', 'serpent', 'hand', 'star', 'moon', 'eagle', 'earth', 'storm',
]);

export const seals = {
  dragon: {
    en: { name: 'Dragon', archetype: 'The Primordial Nurturer', purpose: 'You carry the energy of beginnings — the womb of creation. Your purpose is to nurture life into form, to trust being over doing, and to remind others that they are held by the source.' },
    es: { name: 'Dragón', archetype: 'El Nutridor Primordial', purpose: 'Llevas la energía de los comienzos — el vientre de la creación. Tu propósito es nutrir la vida hasta darle forma, confiar en el ser antes que en el hacer, y recordarle a otros que la fuente los sostiene.' },
  },
  wind: {
    en: { name: 'Wind', archetype: 'The Breath of Spirit', purpose: 'You are a channel for spirit and truth. Your purpose is to communicate what is sacred, to inspire through your words and presence, and to let life force breathe through you.' },
    es: { name: 'Viento', archetype: 'El Aliento del Espíritu', purpose: 'Eres un canal para el espíritu y la verdad. Tu propósito es comunicar lo sagrado, inspirar con tus palabras y tu presencia, y dejar que la fuerza vital respire a través de ti.' },
  },
  night: {
    en: { name: 'Night', archetype: 'The Dreamer of Abundance', purpose: 'You travel the inner worlds of dream and intuition. Your purpose is to turn the dream of abundance into reality and to guide others into the richness of their own inner sanctuary.' },
    es: { name: 'Noche', archetype: 'El Soñador de la Abundancia', purpose: 'Viajas por los mundos internos del sueño y la intuición. Tu propósito es convertir el sueño de la abundancia en realidad y guiar a otros hacia la riqueza de su propio santuario interior.' },
  },
  seed: {
    en: { name: 'Seed', archetype: 'The Awakener of Potential', purpose: 'You hold the blueprint of what wants to flower. Your purpose is to awaken potential — in yourself and others — and to target your awareness toward conscious growth.' },
    es: { name: 'Semilla', archetype: 'El Despertador del Potencial', purpose: 'Guardas el plano de lo que quiere florecer. Tu propósito es despertar el potencial — en ti y en otros — y dirigir tu consciencia hacia el crecimiento consciente.' },
  },
  serpent: {
    en: { name: 'Serpent', archetype: 'The Keeper of Life Force', purpose: 'You move through pure vitality, instinct and passion. Your purpose is to master your life force, transmute desire into power, and teach others to inhabit their bodies fully.' },
    es: { name: 'Serpiente', archetype: 'El Guardián de la Fuerza Vital', purpose: 'Te mueves a través de la vitalidad pura, el instinto y la pasión. Tu propósito es dominar tu fuerza vital, transmutar el deseo en poder y enseñar a otros a habitar plenamente su cuerpo.' },
  },
  worldbridger: {
    en: { name: 'Worldbridger', archetype: 'The Bridge Between Worlds', purpose: 'You connect what is separate. Your purpose is to build bridges — between people, between worlds, between life and death — through surrender, equality and letting go.' },
    es: { name: 'Enlazador de Mundos', archetype: 'El Puente Entre Mundos', purpose: 'Conectas lo que está separado. Tu propósito es tender puentes — entre personas, entre mundos, entre la vida y la muerte — a través de la entrega, la igualdad y el soltar.' },
  },
  hand: {
    en: { name: 'Hand', archetype: 'The Healer', purpose: 'You accomplish and you heal. Your purpose is to bring things to completion with your hands and your knowing, and to be a channel of healing for those around you.' },
    es: { name: 'Mano', archetype: 'El Sanador', purpose: 'Realizas y sanas. Tu propósito es llevar las cosas a su culminación con tus manos y tu saber, y ser un canal de sanación para quienes te rodean.' },
  },
  star: {
    en: { name: 'Star', archetype: 'The Artist of Harmony', purpose: 'You radiate beauty and elegance. Your purpose is to bring art, harmony and proportion into the world, and to remind humanity of its own brilliance.' },
    es: { name: 'Estrella', archetype: 'El Artista de la Armonía', purpose: 'Irradias belleza y elegancia. Tu propósito es traer arte, armonía y proporción al mundo, y recordarle a la humanidad su propio brillo.' },
  },
  moon: {
    en: { name: 'Moon', archetype: 'The Purifier', purpose: 'You flow with emotion and water. Your purpose is to purify — to feel deeply, cleanse what is stagnant, and let universal water move through you.' },
    es: { name: 'Luna', archetype: 'El Purificador', purpose: 'Fluyes con la emoción y el agua. Tu propósito es purificar — sentir profundamente, limpiar lo estancado y dejar que el agua universal se mueva a través de ti.' },
  },
  dog: {
    en: { name: 'Dog', archetype: 'The Heart of Loyalty', purpose: 'You embody love and loyalty. Your purpose is to lead with the heart, to love unconditionally, and to remind others that connection is the true measure of a life.' },
    es: { name: 'Perro', archetype: 'El Corazón de la Lealtad', purpose: 'Encarnas el amor y la lealtad. Tu propósito es guiar desde el corazón, amar incondicionalmente y recordarle a otros que el vínculo es la verdadera medida de una vida.' },
  },
  monkey: {
    en: { name: 'Monkey', archetype: 'The Magician of Play', purpose: 'You see through illusion with magic and play. Your purpose is to bring joy and spontaneity, to dissolve the false with humor, and to keep the divine child alive.' },
    es: { name: 'Mono', archetype: 'El Mago del Juego', purpose: 'Atraviesas la ilusión con magia y juego. Tu propósito es traer alegría y espontaneidad, disolver lo falso con humor y mantener vivo al niño divino.' },
  },
  human: {
    en: { name: 'Human', archetype: 'The Wise One of Free Will', purpose: 'You hold wisdom and free will. Your purpose is to choose consciously, to influence through wisdom rather than force, and to embody what it means to be fully human.' },
    es: { name: 'Humano', archetype: 'El Sabio del Libre Albedrío', purpose: 'Sostienes la sabiduría y el libre albedrío. Tu propósito es elegir conscientemente, influir desde la sabiduría y no desde la fuerza, y encarnar lo que significa ser plenamente humano.' },
  },
  skywalker: {
    en: { name: 'Skywalker', archetype: 'The Explorer of Heaven', purpose: 'You bridge heaven and earth. Your purpose is to explore new spaces, to be a pillar between the cosmic and the earthly, and to walk your prophecy awake.' },
    es: { name: 'Caminante del Cielo', archetype: 'El Explorador del Cielo', purpose: 'Unes el cielo y la tierra. Tu propósito es explorar nuevos espacios, ser un pilar entre lo cósmico y lo terrenal, y caminar despierto tu profecía.' },
  },
  wizard: {
    en: { name: 'Wizard', archetype: 'The Timeless Enchanter', purpose: 'You hold timelessness and receptivity. Your purpose is to enchant from the heart, to listen to the invisible, and to hold the magic of the eternal present.' },
    es: { name: 'Mago', archetype: 'El Encantador Atemporal', purpose: 'Sostienes la atemporalidad y la receptividad. Tu propósito es encantar desde el corazón, escuchar lo invisible y sostener la magia del presente eterno.' },
  },
  eagle: {
    en: { name: 'Eagle', archetype: 'The Visionary', purpose: 'You see far with the mind and the spirit. Your purpose is to hold the greater vision, to create from a planetary perspective, and to guide others to lift their sight.' },
    es: { name: 'Águila', archetype: 'El Visionario', purpose: 'Ves lejos con la mente y el espíritu. Tu propósito es sostener la visión mayor, crear desde una perspectiva planetaria y guiar a otros a elevar la mirada.' },
  },
  warrior: {
    en: { name: 'Warrior', archetype: 'The Fearless Questioner', purpose: 'You move with intelligence and fearlessness. Your purpose is to question what must be questioned, to act with courage, and to clear the path with your wisdom.' },
    es: { name: 'Guerrero', archetype: 'El Cuestionador Sin Miedo', purpose: 'Te mueves con inteligencia y sin miedo. Tu propósito es cuestionar lo que debe cuestionarse, actuar con valentía y despejar el camino con tu sabiduría.' },
  },
  earth: {
    en: { name: 'Earth', archetype: 'The Navigator of Synchronicity', purpose: 'You move with the rhythms of the planet. Your purpose is to navigate by synchronicity, to evolve consciously, and to align human life with the living Earth.' },
    es: { name: 'Tierra', archetype: 'El Navegante de la Sincronía', purpose: 'Te mueves con los ritmos del planeta. Tu propósito es navegar por la sincronía, evolucionar conscientemente y alinear la vida humana con la Tierra viva.' },
  },
  mirror: {
    en: { name: 'Mirror', archetype: 'The Reflector of Truth', purpose: 'You reflect what is real. Your purpose is to bring order and clarity, to cut through illusion with truth, and to hold the endless reflection of the infinite.' },
    es: { name: 'Espejo', archetype: 'El Reflejo de la Verdad', purpose: 'Reflejas lo que es real. Tu propósito es traer orden y claridad, atravesar la ilusión con la verdad y sostener el reflejo sin fin de lo infinito.' },
  },
  storm: {
    en: { name: 'Storm', archetype: 'The Catalyst of Transformation', purpose: 'You generate energy and change. Your purpose is to catalyze transformation, to self-generate from within, and to release the storm that renews everything.' },
    es: { name: 'Tormenta', archetype: 'El Catalizador de la Transformación', purpose: 'Generas energía y cambio. Tu propósito es catalizar la transformación, autogenerarte desde dentro y liberar la tormenta que todo lo renueva.' },
  },
  sun: {
    en: { name: 'Sun', archetype: 'The Enlightened One', purpose: 'You carry the universal fire. Your purpose is to embody enlightenment, to radiate unconditional life, and to ascend while lifting all of humanity with you.' },
    es: { name: 'Sol', archetype: 'El Iluminado', purpose: 'Llevas el fuego universal. Tu propósito es encarnar la iluminación, irradiar vida incondicional y ascender elevando contigo a toda la humanidad.' },
  },
};
