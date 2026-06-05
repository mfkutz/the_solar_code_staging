import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { legal } from '@/content/legal.js';

/**
 * Renders a legal document (Privacy / Terms) from the bilingual content layer.
 * @param {{ docKey: 'privacy' | 'terms' }} props
 */
const LegalPage = ({ docKey }) => {
  const { t, lang } = useI18n();
  const doc = legal[docKey][lang];

  return (
    <div className="min-h-screen pt-28 pb-24">
      <Helmet>
        <title>{`${doc.title} — THE SOLAR CODE`}</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          {doc.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">{doc.updated}</p>

        <p className="text-lg leading-relaxed text-foreground/90 mb-10">{doc.intro}</p>

        <div className="space-y-10">
          {doc.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold text-primary mb-3">{section.heading}</h2>
              {section.body?.map((p, j) => (
                <p key={j} className="text-base leading-relaxed text-foreground/80 mb-3">{p}</p>
              ))}
              {section.list && (
                <ul className="list-disc list-inside space-y-2 text-base text-foreground/80 ml-2">
                  {section.list.map((item, k) => <li key={k}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
