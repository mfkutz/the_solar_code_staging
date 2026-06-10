import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import PersonFields from '@/components/PersonFields.jsx';
import { RELATIONAL_PRODUCTS, isRelationType, relationPricing, RELATION_STORAGE_KEY } from '@/config/payments.js';
import { relationContent } from '@/content/relations.js';

const emptyPerson = () => ({ name: '', birthdate: '', time: '', city: '' });

const RelationFormPage = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { type } = useParams();

  const valid = isRelationType(type);
  const product = valid ? RELATIONAL_PRODUCTS[type] : null;
  const { min, max } = product ? product.people : { min: 2, max: 2 };
  const rc = relationContent[lang];
  const meta = valid ? rc.types[type] : null;

  const [people, setPeople] = useState(() => Array.from({ length: min }, emptyPerson));

  // Switching report type (e.g. Grupal → Pareja via the link) keeps this same
  // component mounted, so reset the people to the new type's minimum.
  useEffect(() => {
    setPeople(Array.from({ length: min }, emptyPerson));
  }, [type, min]);

  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <p className="text-lg text-muted-foreground mb-6">404</p>
        <Button asChild><Link to="/reports">{t('reports.title')}</Link></Button>
      </div>
    );
  }

  const pricing = relationPricing(type, people.length);
  const tierRows = product.tiers
    ? product.tiers.map((tr, i) => {
        const lo = i === 0 ? product.people.min : product.tiers[i - 1].maxPeople + 1;
        return { range: lo === tr.maxPeople ? `${lo}` : `${lo}–${tr.maxPeople}`, price: tr.price.display };
      })
    : null;

  const setField = (i, field, value) =>
    setPeople((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  const addPerson = () => setPeople((prev) => (prev.length < max ? [...prev, emptyPerson()] : prev));
  const removePerson = (i) => setPeople((prev) => (prev.length > min ? prev.filter((_, idx) => idx !== i) : prev));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (people.some((p) => !p.birthdate)) {
      toast.error(t('relation.errorPeople'));
      return;
    }
    window.localStorage.setItem(RELATION_STORAGE_KEY, JSON.stringify({ type, people }));
    navigate(`/relation/${type}/result`);
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <Helmet><title>{`${meta.label} — The Solar Code`}</title></Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/reports" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('reports.title')}
        </Link>

        {/* Header + price panel stay centered/narrow even on wide screens */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {meta.label}
            </h1>
            <p className="text-muted-foreground">{meta.tagline}</p>
          </motion.div>

          {/* Price panel — current price + (for Grupal) the price-by-size breakdown */}
          <div className="bg-card rounded-2xl p-5 border border-primary/20 mb-8 text-center">
            {/* The free preview is the hero — the price is a small, optional detail */}
            <p className="text-3xl font-bold text-primary">{rc.freeCalc}</p>
            <p className="text-sm text-muted-foreground mt-1">{rc.freeCalcSub} · {people.length} {rc.people}</p>

            <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              <p>
                {rc.optionalReport}: <span className="text-foreground font-semibold">{pricing.price.display}</span>
              </p>
              {tierRows && (
                <p className="mt-1">{tierRows.map((r) => `${r.range} ${rc.people}: ${r.price}`).join('  ·  ')}</p>
              )}
            </div>

            {type === 'group' && (
              <Link to="/relation/couple" className="inline-block mt-3 text-xs text-primary hover:underline">
                {rc.twoPeopleHint}
              </Link>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* People: single column on phones, two columns on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6 items-start">
            {people.map((person, i) => (
              <PersonFields
                key={i}
                index={i}
                person={person}
                label={`${rc.personN} ${i + 1}`}
                onChange={(field, value) => setField(i, field, value)}
                onRemove={people.length > min ? () => removePerson(i) : undefined}
              />
            ))}
          </div>

          {/* Actions stay narrow and centered */}
          <div className="max-w-md mx-auto space-y-5">
          {people.length < max && (
            <Button type="button" variant="outline" onClick={addPerson}
              className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/10">
              <Plus className="w-4 h-4 mr-2" /> {rc.addPerson}
            </Button>
          )}

          <Button type="submit" size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-[0.98]">
            {rc.calcCta}
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelationFormPage;
