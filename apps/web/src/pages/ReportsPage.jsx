import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Users, Home as HomeIcon, Briefcase, ArrowRight } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { PRICES, RELATIONAL_PRODUCTS } from '@/config/payments.js';
import { relationContent } from '@/content/relations.js';

const RELATION_ICONS = { pareja: Users, familiar: HomeIcon, laboral: Briefcase };

const Card = ({ icon: Icon, title, tagline, price, to, cta }) => (
  <Link to={to}
    className="group bg-card rounded-2xl p-8 border border-primary/20 hover:border-primary/60 transition-all duration-300 flex flex-col text-center items-center hover:-translate-y-1">
    <Icon className="w-12 h-12 text-primary mb-4" />
    <h3 className="text-2xl font-bold text-primary mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h3>
    <p className="text-muted-foreground mb-4 flex-grow">{tagline}</p>
    <p className="text-lg font-semibold text-foreground mb-4">{price}</p>
    <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
      {cta} <ArrowRight className="w-4 h-4" />
    </span>
  </Link>
);

const ReportsPage = () => {
  const { t, lang } = useI18n();
  const rc = relationContent[lang];

  return (
    <div className="min-h-screen pt-28 pb-24">
      <Helmet><title>{`${t('reports.title')} — The Solar Code`}</title></Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('reports.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('reports.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            icon={Sun}
            title={t('reports.individualLabel')}
            tagline={t('reports.individualTagline')}
            price={`${t('common.free')} · ${PRICES.fullReport.display}`}
            to="/#discover"
            cta={t('reports.startCta')}
          />
          {Object.entries(RELATIONAL_PRODUCTS).map(([type, product]) => {
            const meta = rc.types[type];
            return (
              <Card
                key={type}
                icon={RELATION_ICONS[type]}
                title={meta.label}
                tagline={meta.tagline}
                price={product.price.display}
                to={`/conjunto/${type}`}
                cta={t('reports.startCta')}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
