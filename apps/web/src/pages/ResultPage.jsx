import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, ArrowLeft, Lock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { computeSolarCode } from '@/lib/solarcode';
import { PAYMENT_LINKS, PRICES, REPORT_STORAGE_KEY } from '@/config/payments.js';
import { seals } from '@/content/seals.js';
import { tones } from '@/content/tones.js';
import { elements, colors } from '@/content/elements.js';
import { tramos, tramoColors } from '@/content/tramos.js';
import { chineseAnimals, chineseElements } from '@/content/chinese.js';
import { solarSignature } from '@/lib/signature.js';

const Stat = ({ label, value, sub }) => (
  <div className="bg-muted rounded-xl p-5 text-center">
    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
    <p className="text-lg font-bold text-foreground">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </div>
);

const ResultPage = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const birthdate = params.get('birthdate');
  const name = params.get('name') || '';

  const result = useMemo(() => {
    if (!birthdate) return null;
    try {
      return computeSolarCode({
        name,
        birthdate,
        time: params.get('time') || '',
        country: params.get('country') || '',
        city: params.get('city') || '',
      });
    } catch {
      return null;
    }
  }, [birthdate, name, params]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <Sun className="w-16 h-16 text-primary mb-6" />
        <p className="text-lg text-muted-foreground mb-6">{t('form.errorBirthdate')}</p>
        <Button asChild><Link to="/#discover">{t('common.back')}</Link></Button>
      </div>
    );
  }

  const seal = seals[result.seal.key][lang];
  const tone = tones[result.tone.key][lang];
  const element = elements[result.element][lang];
  const color = colors[result.color];
  const tramoData = tramos[result.tramo.n - 1][lang];
  const tramoColor = tramoColors[result.tramo.element][lang];
  const animal = chineseAnimals[result.chinese.animal.key][lang];
  const chineseEl = chineseElements[result.chinese.element.key][lang];
  const polarity = t(`common.${result.chinese.polarity}`);
  const locale = lang === 'es' ? 'es-ES' : 'en-US';

  // Solar archetype name: EN "Yellow Planetary Star" / ES "Estrella Planetaria Amarilla".
  const signature = solarSignature({
    sealKey: result.seal.key, sealName: seal.name, toneName: tone.name, colorName: color[lang].name, lang,
  });

  // Purpose = the seal's archetypal purpose, colored by the galactic tone.
  const purpose = `${seal.purpose} ${tone.meaning}`;

  // Solar reading = where the Solar Code sits in the 144,000 matrix (its tramo + element).
  const reading = lang === 'es'
    ? `Tu Código Solar te ubica en el Tramo ${result.tramo.n} de la matriz de los 144.000, dentro del elemento ${element.name} (${tramoColor.name}): ${tramoData.energy}. ${tramoData.description} ${element.meaning}`
    : `Your Solar Code places you in Tramo ${result.tramo.n} of the 144,000 matrix, within the element of ${element.name} (${tramoColor.name}): ${tramoData.energy}. ${tramoData.description} ${element.meaning}`;

  const handleUnlock = () => {
    // Stash the birth data so the report page can read it after payment.
    window.localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(result.input));
    if (PAYMENT_LINKS.fullReport) {
      window.location.href = PAYMENT_LINKS.fullReport; // → Stripe → redirects back to /codigo/informe
    } else {
      // No live link yet: preview the report flow locally.
      navigate('/codigo/informe');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: t('result.title'), url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('🔗');
      }
    } catch { /* user cancelled */ }
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <Helmet>
        <title>{`${t('result.title')} — ${result.solarCode.toLocaleString(locale)}`}</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/#discover" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
        </Link>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {name && <p className="text-lg text-muted-foreground mb-2">{t('result.greeting')}, {name}</p>}
          <Sun className="w-20 h-20 mx-auto mb-6" style={{ color: color.hex }} />
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">{t('result.yourNumber')}</p>
          <h1 className="text-6xl md:text-8xl font-bold text-primary text-glow mb-2">
            {result.solarCode.toLocaleString(locale)}
          </h1>
          <p className="text-muted-foreground">{t('result.ofMatrix')}</p>
        </motion.div>

        {/* Archetype */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-card rounded-2xl p-8 border border-primary/30 shadow-lg text-center mb-8 cosmic-glow"
        >
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">{t('result.sealLabel')}</p>
          <h2 className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            {signature}
          </h2>
          <p className="text-lg text-foreground/80">{seal.archetype}</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label={t('result.kinLabel')} value={result.kin} sub={t('result.kinOf')} />
          <Stat label={t('result.toneLabel')} value={`${result.tone.n} · ${tone.name}`} />
          <Stat label={t('result.elementLabel')} value={element.name} sub={`Tramo ${result.tramo.n} · ${tramoColor.name}`} />
          <Stat label={t('result.chineseLabel')} value={`${chineseEl.name} ${animal.name}`} sub={polarity} />
        </div>

        {/* Purpose */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="bg-muted rounded-2xl p-8 mb-6"
        >
          <h3 className="text-xl font-bold text-primary mb-4">{t('result.purposeTitle')}</h3>
          <p className="text-lg leading-relaxed">{purpose}</p>
        </motion.div>

        {/* Free reading */}
        <div className="bg-muted rounded-2xl p-8 mb-6">
          <h3 className="text-xl font-bold text-primary mb-4">{t('result.readingTitle')}</h3>
          <p className="text-lg leading-relaxed text-foreground/90">{reading}</p>
          {result.isHunabKu && <p className="text-sm text-muted-foreground mt-4 italic">{t('result.hunabKuNote')}</p>}
          {result.chinese.approxYearOnly && <p className="text-sm text-muted-foreground mt-2 italic">{t('result.chineseApproxNote')}</p>}
        </div>

        {/* Paid upsell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="bg-secondary text-secondary-foreground rounded-2xl p-8 md:p-10 text-center border border-primary/20"
        >
          <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('result.unlockTitle')}
          </h3>
          <p className="max-w-xl mx-auto mb-6 opacity-90 leading-relaxed">{t('result.unlockText')}</p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleUnlock}>
            {t('result.unlockCta')} · {PRICES.fullReport.display}
          </Button>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Button variant="outline" onClick={handleShare} className="border-primary text-primary hover:bg-primary/10">
            <Share2 className="w-4 h-4 mr-2" /> {t('result.shareCta')}
          </Button>
          <Button asChild variant="ghost">
            <Link to="/#discover">{t('common.recalculate')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
