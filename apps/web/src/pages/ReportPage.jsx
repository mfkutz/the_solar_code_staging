import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Sun, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { computeSolarCode } from '@/lib/solarcode';
import { REPORT_STORAGE_KEY } from '@/config/payments.js';
import { seals } from '@/content/seals.js';
import { tones } from '@/content/tones.js';
import { elements, colors } from '@/content/elements.js';
import { chineseAnimals, chineseElements } from '@/content/chinese.js';
import { reportContent } from '@/content/report.js';

function readStoredInput() {
  try {
    const raw = window.localStorage.getItem(REPORT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const Section = ({ title, children }) => (
  <section className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm mb-6 report-section">
    <h2 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h2>
    {children}
  </section>
);

const ReportPage = () => {
  const { t, lang } = useI18n();
  const input = useMemo(readStoredInput, []);

  const result = useMemo(() => {
    if (!input?.birthdate) return null;
    try {
      return computeSolarCode(input);
    } catch {
      return null;
    }
  }, [input]);

  // Mark as unlocked on arrival (e.g. returning from the Stripe redirect).
  useEffect(() => {
    if (result) window.localStorage.setItem('solarCodePaidAt', new Date().toISOString());
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <Sun className="w-16 h-16 text-primary mb-6" />
        <p className="text-lg text-muted-foreground mb-6">{t('report.calcFirst')}</p>
        <Button asChild><Link to="/#discover">{t('report.goCalc')}</Link></Button>
      </div>
    );
  }

  const seal = seals[result.seal.key][lang];
  const tone = tones[result.tone.key][lang];
  const element = elements[result.element][lang];
  const color = colors[result.color];
  const animal = chineseAnimals[result.chinese.animal.key][lang];
  const chineseEl = chineseElements[result.chinese.element.key][lang];
  const polarity = t(`common.${result.chinese.polarity}`);
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  const rc = reportContent[lang];

  const synthesis = rc.synthesis
    .replace('{seal}', seal.name)
    .replace('{tone}', tone.name)
    .replace('{element}', element.name)
    .replace('{animal}', animal.name)
    .replace('{chineseElement}', chineseEl.name)
    .replace('{code}', result.solarCode.toLocaleString(locale));

  const practices = rc.practices[result.element] || [];
  const name = result.input.name;

  return (
    <div className="min-h-screen pt-28 pb-24 report-page">
      <Helmet>
        <title>{`${t('report.title')} — ${result.solarCode.toLocaleString(locale)}`}</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Branded header — printed PDF only */}
        <div className="print-only print-header">
          <span className="brand">THE SOLAR CODE</span>
          <span className="url">thesolarcode.com</span>
        </div>

        {/* Header / actions (hidden in print) */}
        <div className="flex items-center justify-between mb-8 no-print">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary border border-primary/40 rounded-full px-3 py-1">
            <Sparkles className="w-3 h-3" /> {t('report.badge')}
          </span>
          <Button onClick={() => window.print()} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" /> {t('report.downloadPdf')}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-8 no-print">{t('report.unlockedNote')}</p>

        {/* Title */}
        <div className="text-center mb-12">
          <Sun className="w-16 h-16 mx-auto mb-4" style={{ color: color.hex }} />
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('report.title')}
          </h1>
          {name && <p className="text-muted-foreground">{t('report.forName')} {name}</p>}
          <p className="text-5xl md:text-6xl font-bold text-primary text-glow mt-4">
            {result.solarCode.toLocaleString(locale)}
          </p>
          <p className="text-lg text-foreground/80 mt-2">
            {color[lang].name} {tone.name} {seal.name}
          </p>
        </div>

        <Section title={t('report.archetypeSection')}>
          <p className="text-lg font-medium text-foreground mb-3">{seal.archetype}</p>
          <p className="text-lg leading-relaxed">{seal.purpose}</p>
        </Section>

        <Section title={t('report.toneSection')}>
          <p className="text-lg leading-relaxed">
            <strong>{result.tone.n} · {tone.name}.</strong> {tone.meaning}
          </p>
        </Section>

        <Section title={t('report.elementSection')}>
          <p className="text-lg leading-relaxed">
            <strong>{element.name}.</strong> {element.meaning}
          </p>
        </Section>

        <Section title={t('report.chineseSection')}>
          <p className="text-lg leading-relaxed">
            <strong>{chineseEl.name} {animal.name} ({polarity}).</strong> {animal.trait}
          </p>
        </Section>

        <Section title={t('report.synthesisSection')}>
          <p className="text-lg leading-relaxed">{synthesis}</p>
        </Section>

        <Section title={t('report.activationSection')}>
          <p className="text-muted-foreground mb-4">{t('report.activationIntro')}</p>
          <ul className="space-y-4">
            {practices.map((p, i) => (
              <li key={i}>
                <p className="font-semibold text-foreground">{p.name}</p>
                <p className="text-muted-foreground leading-relaxed">{p.description}</p>
              </li>
            ))}
          </ul>
        </Section>

        <div className="bg-secondary text-secondary-foreground rounded-2xl p-8 text-center border border-primary/20 report-section">
          <h2 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('report.closingSection')}
          </h2>
          <p className="text-lg leading-relaxed">{rc.closing}</p>
        </div>

        <div className="text-center mt-10 no-print">
          <Button asChild variant="ghost">
            <Link to="/#discover">{t('common.back')}</Link>
          </Button>
        </div>

        {/* Branded footer — printed PDF only */}
        <div className="print-only print-footer">
          The Solar Code · Remember your frequency, activate your inner Sun · thesolarcode.com
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
