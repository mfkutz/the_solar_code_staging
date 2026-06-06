import React from 'react';
import { Sun } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { seals } from '@/content/seals.js';
import { tones } from '@/content/tones.js';
import { colors } from '@/content/elements.js';
import { elements } from '@/content/elements.js';
import { tramoColors } from '@/content/tramos.js';
import { solarSignature } from '@/lib/signature.js';

// Compact per-person summary used in the relational result + report.
const PersonSolarCard = ({ result }) => {
  const { lang } = useI18n();
  const seal = seals[result.seal.key][lang];
  const tone = tones[result.tone.key][lang];
  const color = colors[result.color];
  const element = elements[result.element][lang];
  const tramoColor = tramoColors[result.tramo.element][lang];
  const locale = lang === 'es' ? 'es-ES' : 'en-US';

  const signature = solarSignature({
    sealKey: result.seal.key, sealName: seal.name, toneName: tone.name, colorName: color[lang].name, lang,
  });

  return (
    <div className="bg-card rounded-2xl p-6 border border-primary/20 text-center">
      <Sun className="w-10 h-10 mx-auto mb-3" style={{ color: color.hex }} />
      {result.input.name && <p className="text-base font-semibold text-foreground mb-1">{result.input.name}</p>}
      <p className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
        {result.solarCode.toLocaleString(locale)}
      </p>
      <p className="text-sm font-medium text-foreground/90">{signature}</p>
      <p className="text-xs text-muted-foreground mt-2">
        {element.name} · Tramo {result.tramo.n} · {tramoColor.name}
      </p>
    </div>
  );
};

export default PersonSolarCard;
