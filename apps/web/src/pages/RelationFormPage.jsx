import React, { useState } from 'react';
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

  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <p className="text-lg text-muted-foreground mb-6">404</p>
        <Button asChild><Link to="/informes">{t('reports.title')}</Link></Button>
      </div>
    );
  }

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
    navigate(`/conjunto/${type}/resultado`);
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <Helmet><title>{`${meta.label} — The Solar Code`}</title></Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/informes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('reports.title')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {meta.label}
          </h1>
          <p className="text-muted-foreground">{meta.tagline} · {relationPricing(type, people.length).price.display}</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
        </form>
      </div>
    </div>
  );
};

export default RelationFormPage;
