import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { useAuth } from '@/auth/AuthProvider.jsx';
import { api } from '@/lib/api.js';
import { seals } from '@/content/seals.js';
import { tones } from '@/content/tones.js';
import { colors } from '@/content/elements.js';
import { solarSignature } from '@/lib/signature.js';

// Rebuild the localized archetype name from a stored reading's result, so the
// history reads in the current language (same approach as ResultPage).
function signatureOf(result, lang) {
  try {
    const seal = seals[result.seal.key][lang];
    const tone = tones[result.tone.key][lang];
    const color = colors[result.color][lang];
    return solarSignature({
      sealKey: result.seal.key, sealName: seal.name, toneName: tone.name, colorName: color.name, lang,
    });
  } catch {
    return '';
  }
}

const HistoryPage = () => {
  const { t, lang } = useI18n();
  const { user, loading: authLoading, openAuth } = useAuth();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const locale = lang === 'es' ? 'es-ES' : 'en-US';

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    api.get('/readings')
      .then((d) => setReadings(d.readings))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user]);

  const remove = async (id) => {
    try {
      await api.del(`/readings/${id}`);
      setReadings((rs) => rs.filter((r) => r.id !== id));
    } catch {
      toast.error(t('history.loadError'));
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <Helmet><title>{`${t('history.title')} — The Solar Code`}</title></Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('history.title')}
          </h1>
          <p className="text-lg text-muted-foreground">{t('history.subtitle')}</p>
        </motion.div>

        {/* Not logged in */}
        {!authLoading && !user && (
          <div className="text-center bg-card rounded-2xl p-10 border border-primary/20">
            <Sun className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">{t('history.loginRequired')}</p>
            <Button onClick={() => openAuth('login')} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t('history.loginCta')}
            </Button>
          </div>
        )}

        {/* Logged in */}
        {user && !loading && error && (
          <p className="text-center text-destructive">{t('history.loadError')}</p>
        )}

        {user && !loading && !error && readings.length === 0 && (
          <div className="text-center bg-card rounded-2xl p-10 border border-primary/20">
            <p className="text-muted-foreground mb-6">{t('history.empty')}</p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/#discover">{t('history.emptyCta')}</Link>
            </Button>
          </div>
        )}

        {user && !loading && readings.length > 0 && (
          <div className="flex flex-col gap-4">
            {readings.map((r) => {
              const sig = signatureOf(r.result, lang);
              const name = r.input?.name;
              const date = new Date(r.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
              const query = new URLSearchParams(r.input || {}).toString();
              return (
                <div key={r.id} className="bg-card rounded-2xl p-5 border border-primary/20 flex items-center gap-4">
                  <div className="text-center shrink-0 w-24">
                    <p className="text-2xl font-bold text-primary">{r.result?.solarCode?.toLocaleString(locale)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Kin {r.result?.kin}</p>
                  </div>
                  <div className="flex-grow min-w-0">
                    {name && <p className="font-medium truncate">{name}</p>}
                    {sig && <p className="text-sm text-primary truncate">{sig}</p>}
                    <p className="text-xs text-muted-foreground">{date}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Link to={`/code?${query}&saved=1`}>{t('history.open')} <ArrowRight className="w-4 h-4 ml-1" /></Link>
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => remove(r.id)}
                      aria-label={t('history.delete')}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
