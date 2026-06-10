// Relational report content (Couple / Family / Team) — ES/EN.
// DRAFT in the author's affirmative voice, for the partner to refine.
// Templates use {placeholders}: {nameA} {nameB} {elementA} {elementB} {element}
// {meaning} {size} {resonance}. Filled at render time.

export const relationContent = {
  en: {
    types: {
      couple: { label: 'Couple', tagline: 'The resonance between two souls', minNote: '2 people' },
      group: { label: 'Group', tagline: 'The harmony of your circle, family or team', minNote: '3 or more people' },
    },
    addPerson: 'Add a person',
    removePerson: 'Remove',
    personN: 'Person',
    people: 'people',
    freeCalc: 'Try it free',
    freeCalcSub: 'Calculate the resonance at no cost',
    optionalReport: 'Optional full report',
    priceBySize: 'Price by group size',
    twoPeopleHint: 'Just two people? Use the Couple report.',
    calcCta: 'Reveal the resonance',
    bondLabel: 'Bond',
    resonanceLabel: 'Resonance',
    dominantLabel: 'Shared element',
    bondsTitle: 'The Bonds Between You',
    groupTitle: 'Your Shared Field',
    // Pairwise bond by element category.
    category: {
      same: '{nameA} and {nameB} share the element of {elementA}: a deep, instinctive understanding — they speak the same energetic language.',
      unifying: '{nameA} and {nameB} are joined through Ether, the element of connection: one weaves the other into a greater whole.',
      nourishing: 'The {elementA} of {nameA} and the {elementB} of {nameB} feed each other — complementary strengths that grow when they meet.',
      balancing: 'The {elementA} of {nameA} and the {elementB} of {nameB} are different currents that balance and teach one another.',
    },
    groupIntro: 'Together you weave a field of {size} frequencies within the 144,000 matrix.',
    groupDominant: 'Your shared field leans toward {element} — {meaning}',
    synthesis: {
      high: 'Your codes resonate strongly: there is a natural ease between you, a current that flows almost without effort. Tend it with presence and it becomes a source of light for everyone around you.',
      balanced: 'Your codes form a rich, balanced field: different energies that complete one another. The contrast is not distance — it is the very material from which a deeper harmony is built.',
    },
    closing: 'May your codes shine brighter together than apart.',
  },
  es: {
    types: {
      couple: { label: 'Pareja', tagline: 'La resonancia entre dos almas', minNote: '2 personas' },
      group: { label: 'Grupal', tagline: 'La armonía de tu círculo, familia o equipo', minNote: '3 o más personas' },
    },
    addPerson: 'Agregar persona',
    removePerson: 'Quitar',
    personN: 'Persona',
    people: 'personas',
    freeCalc: 'Probalo gratis',
    freeCalcSub: 'Calculá la resonancia sin costo',
    optionalReport: 'Informe completo opcional',
    priceBySize: 'Precio según el tamaño del grupo',
    twoPeopleHint: '¿Solo dos personas? Usá el informe de Pareja.',
    calcCta: 'Revelar la resonancia',
    bondLabel: 'Vínculo',
    resonanceLabel: 'Resonancia',
    dominantLabel: 'Elemento compartido',
    bondsTitle: 'Los Vínculos Entre Ustedes',
    groupTitle: 'Su Campo Compartido',
    category: {
      same: '{nameA} y {nameB} comparten el elemento {elementA}: un entendimiento profundo e instintivo — hablan el mismo lenguaje energético.',
      unifying: '{nameA} y {nameB} se unen a través del Éter, el elemento de la conexión: uno integra al otro en un todo mayor.',
      nourishing: 'El {elementA} de {nameA} y el {elementB} de {nameB} se alimentan mutuamente — fuerzas complementarias que crecen al encontrarse.',
      balancing: 'El {elementA} de {nameA} y el {elementB} de {nameB} son corrientes distintas que se equilibran y se enseñan entre sí.',
    },
    groupIntro: 'Juntos tejen un campo de {size} frecuencias dentro de la matriz de los 144.000.',
    groupDominant: 'Su campo compartido se inclina hacia el {element} — {meaning}',
    synthesis: {
      high: 'Sus códigos resuenan con fuerza: hay una facilidad natural entre ustedes, una corriente que fluye casi sin esfuerzo. Cuídenla con presencia y se vuelve una fuente de luz para todos a su alrededor.',
      balanced: 'Sus códigos forman un campo rico y equilibrado: energías distintas que se completan. El contraste no es distancia — es el material mismo con el que se construye una armonía más profunda.',
    },
    closing: 'Que sus códigos brillen más juntos que separados.',
  },
};
