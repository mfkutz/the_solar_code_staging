// Legal pages content (ES/EN) — Privacy Policy and Terms of Service.
//
// These are tailored to how the site actually works (no backend, the Solar Code
// is calculated in the browser, payments go through Stripe, data stays in the
// visitor's browser via localStorage, the company is a Spanish SL → GDPR).
//
// ⚠️ DRAFT: have the business owner / an advisor review before going live and
// fill the [completar: ...] placeholders (contact email, refund policy, etc.).

export const COMPANY = {
  name: 'Elite Upgrade Consulting SL',
  site: 'thesolarcode.com',
  // TODO: confirm with Pablo and replace.
  email: '[completar: correo de contacto]',
};

const UPDATED = { es: '5 de junio de 2026', en: 'June 5, 2026' };

export const legal = {
  privacy: {
    es: {
      title: 'Política de Privacidad',
      updated: `Última actualización: ${UPDATED.es}`,
      intro: `En The Solar Code respetamos tu privacidad. Esta política explica qué datos tratamos, con qué finalidad y qué derechos tenés. El sitio (${COMPANY.site}) es operado por ${COMPANY.name}.`,
      sections: [
        {
          heading: 'Responsable del tratamiento',
          body: [
            `El responsable del tratamiento de tus datos es ${COMPANY.name}, titular del sitio ${COMPANY.site}. Para cualquier consulta sobre privacidad podés escribir a ${COMPANY.email}.`,
          ],
        },
        {
          heading: 'Qué datos recopilamos',
          body: ['Tratamos únicamente los datos que vos ingresás de forma voluntaria:'],
          list: [
            'Datos de nacimiento que cargás en la calculadora: nombre (opcional), fecha de nacimiento y, opcionalmente, hora, país y ciudad. Se usan para calcular tu Código Solar.',
            'Si te unís a la comunidad: tu nombre, correo electrónico y, opcionalmente, país, fecha de nacimiento y un mensaje.',
          ],
        },
        {
          heading: 'Dónde se procesan tus datos',
          body: [
            'El cálculo de tu Código Solar ocurre íntegramente en tu navegador. El sitio no cuenta con un servidor propio que almacene tu información: los datos que ingresás quedan en el almacenamiento local de tu dispositivo (localStorage) y no se envían a nuestros sistemas.',
            'La única excepción es el proceso de pago, que se realiza a través de Stripe (ver más abajo).',
          ],
        },
        {
          heading: 'Pagos',
          body: [
            'Los pagos del informe se procesan de forma segura mediante Stripe. Al pagar, sos redirigido a un entorno de Stripe; los datos de tu tarjeta los gestiona Stripe directamente y nosotros nunca los vemos ni los almacenamos.',
            'Podés consultar la política de privacidad de Stripe en stripe.com/privacy.',
          ],
        },
        {
          heading: 'Almacenamiento local y cookies',
          body: [
            'Usamos el almacenamiento local del navegador (localStorage) para recordar tu idioma y para conservar tus datos al volver de la pasarela de pago y poder mostrarte tu informe. No utilizamos cookies de seguimiento ni publicidad.',
            'Podés borrar estos datos en cualquier momento limpiando el almacenamiento del sitio desde tu navegador.',
          ],
        },
        {
          heading: 'Conservación',
          body: [
            'Como los datos quedan en tu navegador, permanecen allí hasta que vos los elimines. Los registros de pago los conserva Stripe según sus propias políticas y la normativa aplicable.',
          ],
        },
        {
          heading: 'Tus derechos',
          body: [
            'De acuerdo con el Reglamento General de Protección de Datos (RGPD), tenés derecho a:',
          ],
          list: [
            'Acceder a tus datos personales.',
            'Solicitar su rectificación o supresión.',
            'Oponerte o solicitar la limitación de su tratamiento.',
            'Presentar una reclamación ante la autoridad de control competente.',
          ],
        },
        {
          heading: 'Cambios en esta política',
          body: [
            'Podemos actualizar esta política para reflejar cambios en el servicio o en la normativa. Publicaremos siempre la versión vigente en esta misma página, con su fecha de actualización.',
          ],
        },
        {
          heading: 'Contacto',
          body: [`Para ejercer tus derechos o ante cualquier duda sobre privacidad, escribinos a ${COMPANY.email}.`],
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      updated: `Last updated: ${UPDATED.en}`,
      intro: `At The Solar Code we respect your privacy. This policy explains what data we process, for what purpose, and what rights you have. The site (${COMPANY.site}) is operated by ${COMPANY.name}.`,
      sections: [
        {
          heading: 'Data controller',
          body: [
            `The controller of your data is ${COMPANY.name}, owner of the site ${COMPANY.site}. For any privacy enquiry you can write to ${COMPANY.email}.`,
          ],
        },
        {
          heading: 'What we collect',
          body: ['We only process the data you voluntarily enter:'],
          list: [
            'Birth data you enter in the calculator: name (optional), date of birth and, optionally, time, country and city. Used to calculate your Solar Code.',
            'If you join the community: your name, email and, optionally, country, date of birth and a message.',
          ],
        },
        {
          heading: 'Where your data is processed',
          body: [
            'Your Solar Code is calculated entirely in your browser. The site has no server of its own storing your information: the data you enter stays in your device’s local storage (localStorage) and is not sent to our systems.',
            'The only exception is the payment process, handled by Stripe (see below).',
          ],
        },
        {
          heading: 'Payments',
          body: [
            'Report payments are processed securely through Stripe. When you pay you are redirected to a Stripe environment; your card details are handled by Stripe directly and we never see or store them.',
            'You can review Stripe’s privacy policy at stripe.com/privacy.',
          ],
        },
        {
          heading: 'Local storage and cookies',
          body: [
            'We use the browser’s local storage (localStorage) to remember your language and to keep your data when you return from the payment page so we can show your report. We do not use tracking or advertising cookies.',
            'You can delete this data at any time by clearing the site’s storage in your browser.',
          ],
        },
        {
          heading: 'Retention',
          body: [
            'Because the data stays in your browser, it remains there until you delete it. Payment records are kept by Stripe according to its own policies and applicable law.',
          ],
        },
        {
          heading: 'Your rights',
          body: ['Under the General Data Protection Regulation (GDPR) you have the right to:'],
          list: [
            'Access your personal data.',
            'Request its rectification or erasure.',
            'Object to or request restriction of its processing.',
            'Lodge a complaint with the competent supervisory authority.',
          ],
        },
        {
          heading: 'Changes to this policy',
          body: [
            'We may update this policy to reflect changes in the service or in the law. The current version will always be published on this page, with its update date.',
          ],
        },
        {
          heading: 'Contact',
          body: [`To exercise your rights or for any privacy question, write to us at ${COMPANY.email}.`],
        },
      ],
    },
  },

  terms: {
    es: {
      title: 'Términos del Servicio',
      updated: `Última actualización: ${UPDATED.es}`,
      intro: `Al usar The Solar Code (${COMPANY.site}) aceptás estos términos. Te pedimos que los leas con atención. El sitio es operado por ${COMPANY.name}.`,
      sections: [
        {
          heading: 'Naturaleza del servicio',
          body: [
            'The Solar Code es un sistema simbólico y espiritual con fines de autoconocimiento, reflexión y entretenimiento. La información, los cálculos y los informes que ofrecemos no constituyen asesoramiento médico, psicológico, legal, financiero ni profesional de ningún tipo, y no deben usarse como sustituto de él.',
          ],
        },
        {
          heading: 'Uso del sitio',
          body: [
            'Podés usar la calculadora y el contenido del sitio para fines personales y no comerciales. Te comprometés a ingresar información veraz y a no usar el sitio de forma fraudulenta o que perjudique su funcionamiento.',
          ],
        },
        {
          heading: 'Informes de pago',
          body: [
            'Ofrecemos informes ampliados de pago. El precio se muestra en euros (EUR) antes de confirmar la compra (por ejemplo, el informe individual cuesta 22 €). El pago es único y se procesa a través de Stripe. Tras el pago, accedés a tu informe completo, que podés descargar en PDF.',
          ],
        },
        {
          heading: 'Reembolsos',
          body: [
            'Los informes son productos digitales de entrega inmediata. [completar: indicar la política de reembolsos —por ejemplo, condiciones y plazo para solicitar la devolución, o que por tratarse de contenido digital descargable no se admiten reembolsos una vez accedido el informe].',
          ],
        },
        {
          heading: 'Propiedad intelectual',
          body: [
            `El sistema The Solar Code, sus textos, descripciones, marca, diseño y demás contenidos son propiedad de ${COMPANY.name} o de sus titulares y están protegidos por la normativa de propiedad intelectual. No podés reproducirlos, distribuirlos ni explotarlos comercialmente sin autorización previa por escrito. Los informes que adquirís son para tu uso personal.`,
          ],
        },
        {
          heading: 'Limitación de responsabilidad',
          body: [
            'El servicio se ofrece "tal cual". En la medida permitida por la ley, no nos hacemos responsables de las decisiones que tomes a partir del contenido ni de daños indirectos derivados del uso del sitio. Vos sos responsable del uso que hagas de la información.',
          ],
        },
        {
          heading: 'Enlaces a terceros',
          body: [
            'El sitio puede contener enlaces a servicios de terceros (por ejemplo, Stripe o sitios del ecosistema). No controlamos esos servicios y no respondemos por sus contenidos ni sus políticas.',
          ],
        },
        {
          heading: 'Ley aplicable',
          body: [
            'Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa aplicable.',
          ],
        },
        {
          heading: 'Contacto',
          body: [`Para cualquier consulta sobre estos términos, escribinos a ${COMPANY.email}.`],
        },
      ],
    },
    en: {
      title: 'Terms of Service',
      updated: `Last updated: ${UPDATED.en}`,
      intro: `By using The Solar Code (${COMPANY.site}) you accept these terms. Please read them carefully. The site is operated by ${COMPANY.name}.`,
      sections: [
        {
          heading: 'Nature of the service',
          body: [
            'The Solar Code is a symbolic and spiritual system for self-knowledge, reflection and entertainment. The information, calculations and reports we provide do not constitute medical, psychological, legal, financial or any other professional advice, and should not be used as a substitute for it.',
          ],
        },
        {
          heading: 'Use of the site',
          body: [
            'You may use the calculator and the site’s content for personal, non-commercial purposes. You agree to enter truthful information and not to use the site fraudulently or in a way that harms its operation.',
          ],
        },
        {
          heading: 'Paid reports',
          body: [
            'We offer extended paid reports. The price is shown in euros (EUR) before you confirm the purchase (for example, the individual report costs €22). Payment is one-off and processed through Stripe. After payment you can access your full report and download it as a PDF.',
          ],
        },
        {
          heading: 'Refunds',
          body: [
            'Reports are digital products delivered immediately. [completar: state the refund policy — e.g. conditions and time frame to request a refund, or that as downloadable digital content no refunds are granted once the report has been accessed].',
          ],
        },
        {
          heading: 'Intellectual property',
          body: [
            `The Solar Code system, its texts, descriptions, brand, design and other content are owned by ${COMPANY.name} or its rights holders and are protected by intellectual property law. You may not reproduce, distribute or commercially exploit them without prior written permission. The reports you purchase are for your personal use.`,
          ],
        },
        {
          heading: 'Limitation of liability',
          body: [
            'The service is provided "as is". To the extent permitted by law, we are not liable for decisions you make based on the content, nor for indirect damages arising from use of the site. You are responsible for how you use the information.',
          ],
        },
        {
          heading: 'Third-party links',
          body: [
            'The site may contain links to third-party services (for example, Stripe or ecosystem sites). We do not control those services and are not responsible for their content or policies.',
          ],
        },
        {
          heading: 'Governing law',
          body: [
            'These terms are governed by Spanish law. For any dispute, the parties submit to the courts that apply under the relevant regulations.',
          ],
        },
        {
          heading: 'Contact',
          body: [`For any question about these terms, write to us at ${COMPANY.email}.`],
        },
      ],
    },
  },
};
