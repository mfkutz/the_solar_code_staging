import React, { useMemo, useState } from 'react';
import { ChevronDown, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { computeSolarCode } from '@/lib/solarcode';
import { seals } from '@/content/seals.js';
import { tones } from '@/content/tones.js';
import { elements, colors } from '@/content/elements.js';
import { solarSignature } from '@/lib/signature.js';

// Local YYYY-MM-DD for "today" (avoids UTC off-by-one from toISOString()).
const todayISO = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

/**
 * "Oráculo del día" — the day's Mayan Kin energy, computed by the same engine.
 * No backend / no external source: it's the calculation run on today's date so
 * people return to the site each day to check the energy.
 *
 * `variant`:
 *   'card'   → full panel (default)
 *   'ribbon' → a slim banner for the top of the hero; tap to expand the reading.
 */
const SolarCodeOfDay = ({ variant = 'card' }) => {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);

  const { result, dateLabel } = useMemo(() => {
    const r = computeSolarCode({ birthdate: todayISO() });
    const dateLabel = new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    return { result: r, dateLabel };
  }, [lang]);

  const seal = seals[result.seal.key][lang];
  const tone = tones[result.tone.key][lang];
  const color = colors[result.color][lang];
  const element = elements[result.element][lang];
  const signature = solarSignature({
    sealKey: result.seal.key,
    sealName: seal.name,
    toneName: tone.name,
    colorName: color.name,
    lang,
  });

  if (variant === 'ribbon') {
    return (
      <div className="bg-card/70 backdrop-blur-sm rounded-full sm:rounded-2xl border border-primary/30 overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors"
        >
          <Sun className="w-4 h-4 text-primary shrink-0" />
          <span className="text-muted-foreground hidden sm:inline">{t('oracle.intro')}:</span>
          <span className="font-semibold text-primary">{signature}</span>
          <span className="text-muted-foreground">· {t('oracle.kinLabel')} {result.kin}</span>
          <ChevronDown className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-4 pt-1 text-center">
                <p className="text-xs text-muted-foreground mb-2">{dateLabel} · {element.name}</p>
                <p className="text-sm text-foreground/80 max-w-md mx-auto">{tone.meaning}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="bg-card/70 backdrop-blur-sm rounded-2xl px-6 py-5 border border-primary/30 text-center">
      <div className="flex items-center justify-center gap-2 text-primary mb-1">
        <Sun className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest">{t('oracle.title')}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{t('oracle.intro')} · {dateLabel}</p>
      <p className="text-xl md:text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
        {signature}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        {t('oracle.kinLabel')} {result.kin} · {element.name}
      </p>
      <p className="text-sm text-foreground/80 mt-2 max-w-md mx-auto">{tone.meaning}</p>
    </div>
  );
};

export default SolarCodeOfDay;
