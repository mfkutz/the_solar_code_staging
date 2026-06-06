import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { computeRelation } from '@/lib/solarcode/relations.js';
import PersonSolarCard from '@/components/PersonSolarCard.jsx';
import { isRelationType, RELATION_STORAGE_KEY } from '@/config/payments.js';
import { relationContent } from '@/content/relations.js';
import { elements } from '@/content/elements.js';

const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));

function readStored() {
  try {
    const raw = window.localStorage.getItem(RELATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

const Section = ({ title, children }) => (
  <section className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm mb-6">
    <h2 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h2>
    {children}
  </section>
);

const RelationReportPage = () => {
  const { t, lang } = useI18n();
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
        <Button asChild><Link to="/informes">{t('reports.title')}</Link></Button>
      </div>
    );
  }

  const meta = rc.types[type];
  const nameOf = (idx, raw) => raw || `${rc.personN} ${idx + 1}`;
  const dominant = elements[relation.group.dominantElement][lang];
  const band = relation.group.resonance >= 85 ? 'high' : 'balanced';

  return (
    <div className="min-h-screen pt-28 pb-24">
      <Helmet><title>{`${meta.label} — ${t('relation.reportBadge')}`}</title></Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-primary mb-2">{t('relation.reportBadge')}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
            {meta.label}
          </h1>
          <p className="text-5xl md:text-6xl font-bold text-primary text-glow mt-4">{relation.group.resonance}%</p>
        </div>

        {/* The codes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {relation.people.map((p, i) => <PersonSolarCard key={i} result={p} />)}
        </div>

        {/* Bonds */}
        <Section title={rc.bondsTitle}>
          <ul className="space-y-4">
            {relation.pairs.map((pair, idx) => (
              <li key={idx} className="text-lg leading-relaxed">
                {fill(rc.category[pair.category], {
                  nameA: nameOf(pair.i, pair.nameA),
                  nameB: nameOf(pair.j, pair.nameB),
                  elementA: elements[pair.elementA][lang].name,
                  elementB: elements[pair.elementB][lang].name,
                })}
              </li>
            ))}
          </ul>
        </Section>

        {/* Shared field */}
        <Section title={rc.groupTitle}>
          <p className="text-lg leading-relaxed mb-4">{fill(rc.groupIntro, { size: relation.group.size })}</p>
          <p className="text-lg leading-relaxed mb-4">
            {fill(rc.groupDominant, { element: dominant.name, meaning: dominant.meaning })}
          </p>
          <p className="text-lg leading-relaxed">{rc.synthesis[band]}</p>
        </Section>

        <div className="text-center text-lg text-foreground/80 italic my-10">{rc.closing}</div>

        <div className="flex justify-center">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link to="/informes"><Sparkles className="w-4 h-4 mr-2" /> {t('reports.title')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RelationReportPage;
