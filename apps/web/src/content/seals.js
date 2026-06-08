// The 20 Solar Seals = the "solar archetypes". Keyed by the engine's seal.key.
// DRAFT content in the site's voice — for the partner to review and refine.
// Each: { name, archetype (tagline), purpose (paragraph), gift, shadow } per language.
//   gift   = the strength this archetype radiates
//   shadow = the growth edge / challenge (kept constructive, never a verdict)

// Seals whose Spanish name is feminine — used to agree the tone/color adjectives
// in the galactic signature (e.g. "Estrella Planetaria Amarilla", not "...Planetario Amarillo").
export const FEMININE_SEALS = new Set([
  'night', 'seed', 'serpent', 'hand', 'star', 'moon', 'eagle', 'earth', 'storm',
]);

export const seals = {
  dragon: {
    en: { name: 'Dragon', archetype: 'The Primordial Nurturer', purpose: 'You carry the energy of beginnings — the womb of creation. Your purpose is to nurture life into form, to trust being over doing, and to remind others that they are held by the source.', gift: 'Your gift is the power to begin and to nurture — you make others feel safe enough to grow.', shadow: 'Your edge is learning to receive care as freely as you give it, and to rest without guilt.' },
    es: { name: 'Dragón', archetype: 'El Nutridor Primordial', purpose: 'Llevas la energía de los comienzos — el vientre de la creación. Tu propósito es nutrir la vida hasta darle forma, confiar en el ser antes que en el hacer, y recordarle a otros que la fuente los sostiene.', gift: 'Tu don es el poder de iniciar y nutrir — haces que otros se sientan a salvo para crecer.', shadow: 'Tu desafío es aprender a recibir cuidado con la misma libertad con que lo das, y descansar sin culpa.' },
  },
  wind: {
    en: { name: 'Wind', archetype: 'The Breath of Spirit', purpose: 'You are a channel for spirit and truth. Your purpose is to communicate what is sacred, to inspire through your words and presence, and to let life force breathe through you.', gift: 'Your gift is the inspired word — when you speak from spirit, you move and awaken people.', shadow: 'Your edge is grounding your inspiration into action instead of scattering it on the wind.' },
    es: { name: 'Viento', archetype: 'El Aliento del Espíritu', purpose: 'Eres un canal para el espíritu y la verdad. Tu propósito es comunicar lo sagrado, inspirar con tus palabras y tu presencia, y dejar que la fuerza vital respire a través de ti.', gift: 'Tu don es la palabra inspirada — cuando hablas desde el espíritu, mueves y despiertas a la gente.', shadow: 'Tu desafío es aterrizar tu inspiración en acción en lugar de dispersarla en el viento.' },
  },
  night: {
    en: { name: 'Night', archetype: 'The Dreamer of Abundance', purpose: 'You travel the inner worlds of dream and intuition. Your purpose is to turn the dream of abundance into reality and to guide others into the richness of their own inner sanctuary.', gift: 'Your gift is a rich inner world that can dream abundance into being.', shadow: 'Your edge is bringing your dreams out of the dark and into shared daylight.' },
    es: { name: 'Noche', archetype: 'El Soñador de la Abundancia', purpose: 'Viajas por los mundos internos del sueño y la intuición. Tu propósito es convertir el sueño de la abundancia en realidad y guiar a otros hacia la riqueza de su propio santuario interior.', gift: 'Tu don es un mundo interior fértil que puede soñar la abundancia hasta hacerla real.', shadow: 'Tu desafío es sacar tus sueños de la oscuridad y traerlos a la luz compartida.' },
  },
  seed: {
    en: { name: 'Seed', archetype: 'The Awakener of Potential', purpose: 'You hold the blueprint of what wants to flower. Your purpose is to awaken potential — in yourself and others — and to target your awareness toward conscious growth.', gift: 'Your gift is seeing the potential in everything before it flowers.', shadow: 'Your edge is patience — letting things ripen instead of forcing the bloom.' },
    es: { name: 'Semilla', archetype: 'El Despertador del Potencial', purpose: 'Guardas el plano de lo que quiere florecer. Tu propósito es despertar el potencial — en ti y en otros — y dirigir tu consciencia hacia el crecimiento consciente.', gift: 'Tu don es ver el potencial en todo antes de que florezca.', shadow: 'Tu desafío es la paciencia — dejar madurar en lugar de forzar la floración.' },
  },
  serpent: {
    en: { name: 'Serpent', archetype: 'The Keeper of Life Force', purpose: 'You move through pure vitality, instinct and passion. Your purpose is to master your life force, transmute desire into power, and teach others to inhabit their bodies fully.', gift: 'Your gift is raw vitality and instinct — a body that knows.', shadow: 'Your edge is channeling your intensity so passion serves you instead of consuming you.' },
    es: { name: 'Serpiente', archetype: 'El Guardián de la Fuerza Vital', purpose: 'Te mueves a través de la vitalidad pura, el instinto y la pasión. Tu propósito es dominar tu fuerza vital, transmutar el deseo en poder y enseñar a otros a habitar plenamente su cuerpo.', gift: 'Tu don es la vitalidad y el instinto puros — un cuerpo que sabe.', shadow: 'Tu desafío es canalizar tu intensidad para que la pasión te sirva en vez de consumirte.' },
  },
  worldbridger: {
    en: { name: 'Worldbridger', archetype: 'The Bridge Between Worlds', purpose: 'You connect what is separate. Your purpose is to build bridges — between people, between worlds, between life and death — through surrender, equality and letting go.', gift: 'Your gift is connecting what is separate and making peace between opposites.', shadow: 'Your edge is learning to let go and to bridge others without losing yourself.' },
    es: { name: 'Enlazador de Mundos', archetype: 'El Puente Entre Mundos', purpose: 'Conectas lo que está separado. Tu propósito es tender puentes — entre personas, entre mundos, entre la vida y la muerte — a través de la entrega, la igualdad y el soltar.', gift: 'Tu don es conectar lo separado y hacer las paces entre los opuestos.', shadow: 'Tu desafío es aprender a soltar y tender puentes sin perderte en el proceso.' },
  },
  hand: {
    en: { name: 'Hand', archetype: 'The Healer', purpose: 'You accomplish and you heal. Your purpose is to bring things to completion with your hands and your knowing, and to be a channel of healing for those around you.', gift: 'Your gift is healing hands and the power to bring things to completion.', shadow: 'Your edge is healing yourself with the same devotion you give to others.' },
    es: { name: 'Mano', archetype: 'El Sanador', purpose: 'Realizas y sanas. Tu propósito es llevar las cosas a su culminación con tus manos y tu saber, y ser un canal de sanación para quienes te rodean.', gift: 'Tu don son las manos que sanan y el poder de llevar las cosas a su culminación.', shadow: 'Tu desafío es sanarte a ti mismo con la misma devoción que ofreces a los demás.' },
  },
  star: {
    en: { name: 'Star', archetype: 'The Artist of Harmony', purpose: 'You radiate beauty and elegance. Your purpose is to bring art, harmony and proportion into the world, and to remind humanity of its own brilliance.', gift: 'Your gift is beauty — you bring harmony and elegance wherever you go.', shadow: 'Your edge is shining your own light instead of only beautifying things for others.' },
    es: { name: 'Estrella', archetype: 'El Artista de la Armonía', purpose: 'Irradias belleza y elegancia. Tu propósito es traer arte, armonía y proporción al mundo, y recordarle a la humanidad su propio brillo.', gift: 'Tu don es la belleza — traes armonía y elegancia a donde vas.', shadow: 'Tu desafío es brillar con luz propia y no solo embellecer para los demás.' },
  },
  moon: {
    en: { name: 'Moon', archetype: 'The Purifier', purpose: 'You flow with emotion and water. Your purpose is to purify — to feel deeply, cleanse what is stagnant, and let universal water move through you.', gift: 'Your gift is deep feeling — you sense and cleanse what others cannot.', shadow: 'Your edge is letting emotion flow through you without drowning in it.' },
    es: { name: 'Luna', archetype: 'El Purificador', purpose: 'Fluyes con la emoción y el agua. Tu propósito es purificar — sentir profundamente, limpiar lo estancado y dejar que el agua universal se mueva a través de ti.', gift: 'Tu don es el sentir profundo — percibes y limpias lo que otros no pueden.', shadow: 'Tu desafío es dejar fluir la emoción sin ahogarte en ella.' },
  },
  dog: {
    en: { name: 'Dog', archetype: 'The Heart of Loyalty', purpose: 'You embody love and loyalty. Your purpose is to lead with the heart, to love unconditionally, and to remind others that connection is the true measure of a life.', gift: 'Your gift is loyal, unconditional love that holds people together.', shadow: 'Your edge is loving yourself as fiercely as you love everyone else.' },
    es: { name: 'Perro', archetype: 'El Corazón de la Lealtad', purpose: 'Encarnas el amor y la lealtad. Tu propósito es guiar desde el corazón, amar incondicionalmente y recordarle a otros que el vínculo es la verdadera medida de una vida.', gift: 'Tu don es el amor leal e incondicional que mantiene unida a la gente.', shadow: 'Tu desafío es amarte a ti mismo con la misma fuerza con que amas a los demás.' },
  },
  monkey: {
    en: { name: 'Monkey', archetype: 'The Magician of Play', purpose: 'You see through illusion with magic and play. Your purpose is to bring joy and spontaneity, to dissolve the false with humor, and to keep the divine child alive.', gift: 'Your gift is magic and play — you dissolve heaviness with joy.', shadow: 'Your edge is using humor to open the truth, not to avoid it.' },
    es: { name: 'Mono', archetype: 'El Mago del Juego', purpose: 'Atraviesas la ilusión con magia y juego. Tu propósito es traer alegría y espontaneidad, disolver lo falso con humor y mantener vivo al niño divino.', gift: 'Tu don es la magia y el juego — disuelves la pesadez con alegría.', shadow: 'Tu desafío es usar el humor para abrir la verdad, no para evitarla.' },
  },
  human: {
    en: { name: 'Human', archetype: 'The Wise One of Free Will', purpose: 'You hold wisdom and free will. Your purpose is to choose consciously, to influence through wisdom rather than force, and to embody what it means to be fully human.', gift: 'Your gift is wisdom and the power of conscious choice.', shadow: 'Your edge is trusting your own knowing instead of absorbing everyone’s opinions.' },
    es: { name: 'Humano', archetype: 'El Sabio del Libre Albedrío', purpose: 'Sostienes la sabiduría y el libre albedrío. Tu propósito es elegir conscientemente, influir desde la sabiduría y no desde la fuerza, y encarnar lo que significa ser plenamente humano.', gift: 'Tu don es la sabiduría y el poder de la elección consciente.', shadow: 'Tu desafío es confiar en tu propio saber en lugar de absorber las opiniones de todos.' },
  },
  skywalker: {
    en: { name: 'Skywalker', archetype: 'The Explorer of Heaven', purpose: 'You bridge heaven and earth. Your purpose is to explore new spaces, to be a pillar between the cosmic and the earthly, and to walk your prophecy awake.', gift: 'Your gift is courage to explore and to bridge heaven and earth.', shadow: 'Your edge is staying rooted while you reach for the sky.' },
    es: { name: 'Caminante del Cielo', archetype: 'El Explorador del Cielo', purpose: 'Unes el cielo y la tierra. Tu propósito es explorar nuevos espacios, ser un pilar entre lo cósmico y lo terrenal, y caminar despierto tu profecía.', gift: 'Tu don es el coraje de explorar y unir el cielo con la tierra.', shadow: 'Tu desafío es mantenerte enraizado mientras alcanzas el cielo.' },
  },
  wizard: {
    en: { name: 'Wizard', archetype: 'The Timeless Enchanter', purpose: 'You hold timelessness and receptivity. Your purpose is to enchant from the heart, to listen to the invisible, and to hold the magic of the eternal present.', gift: 'Your gift is presence and timeless inner magic.', shadow: 'Your edge is acting in the world, not only enchanting from within.' },
    es: { name: 'Mago', archetype: 'El Encantador Atemporal', purpose: 'Sostienes la atemporalidad y la receptividad. Tu propósito es encantar desde el corazón, escuchar lo invisible y sostener la magia del presente eterno.', gift: 'Tu don es la presencia y la magia interior atemporal.', shadow: 'Tu desafío es actuar en el mundo y no solo encantar desde adentro.' },
  },
  eagle: {
    en: { name: 'Eagle', archetype: 'The Visionary', purpose: 'You see far with the mind and the spirit. Your purpose is to hold the greater vision, to create from a planetary perspective, and to guide others to lift their sight.', gift: 'Your gift is vision — you see far and hold the bigger picture.', shadow: 'Your edge is coming back to the ground to live what you envision.' },
    es: { name: 'Águila', archetype: 'El Visionario', purpose: 'Ves lejos con la mente y el espíritu. Tu propósito es sostener la visión mayor, crear desde una perspectiva planetaria y guiar a otros a elevar la mirada.', gift: 'Tu don es la visión — ves lejos y sostienes el panorama mayor.', shadow: 'Tu desafío es bajar a tierra para vivir lo que visualizas.' },
  },
  warrior: {
    en: { name: 'Warrior', archetype: 'The Fearless Questioner', purpose: 'You move with intelligence and fearlessness. Your purpose is to question what must be questioned, to act with courage, and to clear the path with your wisdom.', gift: 'Your gift is fearless intelligence that clears the path.', shadow: 'Your edge is questioning with compassion, not only with force.' },
    es: { name: 'Guerrero', archetype: 'El Cuestionador Sin Miedo', purpose: 'Te mueves con inteligencia y sin miedo. Tu propósito es cuestionar lo que debe cuestionarse, actuar con valentía y despejar el camino con tu sabiduría.', gift: 'Tu don es la inteligencia sin miedo que despeja el camino.', shadow: 'Tu desafío es cuestionar con compasión, no solo con fuerza.' },
  },
  earth: {
    en: { name: 'Earth', archetype: 'The Navigator of Synchronicity', purpose: 'You move with the rhythms of the planet. Your purpose is to navigate by synchronicity, to evolve consciously, and to align human life with the living Earth.', gift: 'Your gift is moving in tune with the rhythms of life and synchronicity.', shadow: 'Your edge is trusting the flow even when the signs are quiet.' },
    es: { name: 'Tierra', archetype: 'El Navegante de la Sincronía', purpose: 'Te mueves con los ritmos del planeta. Tu propósito es navegar por la sincronía, evolucionar conscientemente y alinear la vida humana con la Tierra viva.', gift: 'Tu don es moverte en sintonía con los ritmos de la vida y la sincronía.', shadow: 'Tu desafío es confiar en el flujo aun cuando las señales callan.' },
  },
  mirror: {
    en: { name: 'Mirror', archetype: 'The Reflector of Truth', purpose: 'You reflect what is real. Your purpose is to bring order and clarity, to cut through illusion with truth, and to hold the endless reflection of the infinite.', gift: 'Your gift is clarity — you reflect truth and cut through illusion.', shadow: 'Your edge is softening truth with warmth so it can be received.' },
    es: { name: 'Espejo', archetype: 'El Reflejo de la Verdad', purpose: 'Reflejas lo que es real. Tu propósito es traer orden y claridad, atravesar la ilusión con la verdad y sostener el reflejo sin fin de lo infinito.', gift: 'Tu don es la claridad — reflejas la verdad y atraviesas la ilusión.', shadow: 'Tu desafío es suavizar la verdad con calidez para que pueda recibirse.' },
  },
  storm: {
    en: { name: 'Storm', archetype: 'The Catalyst of Transformation', purpose: 'You generate energy and change. Your purpose is to catalyze transformation, to self-generate from within, and to release the storm that renews everything.', gift: 'Your gift is the power to catalyze change and renew what is stuck.', shadow: 'Your edge is bringing the calm after your storm, not only the lightning.' },
    es: { name: 'Tormenta', archetype: 'El Catalizador de la Transformación', purpose: 'Generas energía y cambio. Tu propósito es catalizar la transformación, autogenerarte desde dentro y liberar la tormenta que todo lo renueva.', gift: 'Tu don es el poder de catalizar el cambio y renovar lo estancado.', shadow: 'Tu desafío es traer la calma después de tu tormenta, no solo el rayo.' },
  },
  sun: {
    en: { name: 'Sun', archetype: 'The Enlightened One', purpose: 'You carry the universal fire. Your purpose is to embody enlightenment, to radiate unconditional life, and to ascend while lifting all of humanity with you.', gift: 'Your gift is radiance — you warm and enlighten everyone around you.', shadow: 'Your edge is shining without burning out, honoring your own night too.' },
    es: { name: 'Sol', archetype: 'El Iluminado', purpose: 'Llevas el fuego universal. Tu propósito es encarnar la iluminación, irradiar vida incondicional y ascender elevando contigo a toda la humanidad.', gift: 'Tu don es la irradiación — das calor e iluminas a todos a tu alrededor.', shadow: 'Tu desafío es brillar sin consumirte, honrando también tu propia noche.' },
  },
};
