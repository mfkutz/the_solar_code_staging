import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { computeRelation } from '@/lib/solarcode/relations.js';
import PersonSolarCard from '@/components/PersonSolarCard.jsx';
import { RELATIONAL_PRODUCTS, isRelationType, RELATION_STORAGE_KEY } from '@/config/payments.js';
import { relationContent } from '@/content/relations.js';

const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));

function readStored() {
  try {
    const raw = window.localStorage.getItem(RELATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

const RelationResultPage = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { type } = useParams();
  const stored = useMemo(readStored, []);
  const rc = relationContent[lang];

  const relation = useMemo(() => {
    if (!stored?.people?.length) return null;
    try { return computeRelation(stored.people); } catch { return null; }
  }, [stored]);

  if (!isRelationType(type) || !relation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <p className="text-lg text-muted-foreground mb-6">{t('relation.calcFirst')}</p>
        <Button asChild><Link to={`/conjunto/${isRelationType(type) ? type : ''}`}>{t('reports.startCta')}</Link></Button>
      </div>
    );
  }

  const meta = rc.types[type];
  const product = RELATIONAL_PRODUCTS[type];

  const handleUnlock = () => {
    if (product.link) {
      window.location.href = product.link; // → Stripe → redirect back to the report
    } else {
      navigate(`/conjunto/${type}/informe`); // no live link yet: preview
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <Helmet><title>{`${meta.label} — The Solar Code`}</title></Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/conjunto/${type}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('relation.backToForm')}
        </Link>

        {/* Headline: shared resonance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">{meta.label}</p>
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-1">{t('relation.resultGreeting')}</p>
          <h1 className="text-6xl md:text-7xl font-bold text-primary text-glow mb-2">{relation.group.resonance}%</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{fill(rc.groupIntro, { size: relation.group.size })}</p>
        </motion.div>

        {/* The codes */}
        <h2 className="text-xl font-bold text-primary mb-4">{t('relation.peopleTitle')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {relation.people.map((p, i) => <PersonSolarCard key={i} result={p} />)}
        </div>

        {/* Paid upsell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="bg-secondary text-secondary-foreground rounded-2xl p-8 md:p-10 text-center border border-primary/20"
        >
          <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            {fill(t('relation.unlockTitle'), { label: meta.label })}
          </h3>
          <p className="max-w-xl mx-auto mb-6 opacity-90 leading-relaxed">{t('relation.unlockText')}</p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleUnlock}>
            <Sparkles className="w-4 h-4 mr-2" /> {t('relation.unlockCta')} · {product.price.display}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RelationResultPage;
