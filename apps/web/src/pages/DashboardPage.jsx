import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sun, Zap, Sparkles, Wind, Droplet, Mountain, Flame, Circle } from 'lucide-react';
import RitualReveal from '@/components/RitualReveal.jsx';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { useAuth } from '@/auth/AuthProvider.jsx';
import { api } from '@/lib/api.js';
import { computeSolarCode } from '@/lib/solarcode/index.js';
import { pairCategory } from '@/lib/solarcode/relations.js';
import { seals } from '@/content/seals.js';
import { tones } from '@/content/tones.js';
import { tramos, tramoColors } from '@/content/tramos.js';
import { chineseAnimals, chineseElements } from '@/content/chinese.js';
import { home } from '@/content/home.js';
import { REPORT_STORAGE_KEY, PAYMENT_LINKS } from '@/config/payments.js';
import CountrySelect from '@/components/CountrySelect.jsx';

const ELEMENT_ICONS = { earth: Mountain, water: Droplet, air: Wind, fire: Flame, ether: Sparkles };
const ELEMENT_COLORS = {
  earth: 'text-amber-600', water: 'text-blue-400',
  air: 'text-cyan-400', fire: 'text-orange-400', ether: 'text-yellow-300',
};
const ELEMENT_NAMES = {
  en: { earth: 'Earth', water: 'Water', air: 'Air', fire: 'Fire', ether: 'Ether' },
  es: { earth: 'Tierra', water: 'Agua', air: 'Aire', fire: 'Fuego', ether: 'Éter' },
};
const SEAL_COLORS = {
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400' },
  white:  { bg: 'bg-slate-200/10',  border: 'border-slate-200/30',  text: 'text-slate-200' },
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
};

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getResonanceKey(userResult, todayResult) {
  if (userResult.seal.key === todayResult.seal.key) return 'sameSeal';
  if (userResult.seal.color === todayResult.seal.color) return 'sameColor';
  if (userResult.element === todayResult.element) return 'sameElement';
  const cat = pairCategory(userResult.element, todayResult.element);
  return cat === 'unifying' ? 'unifying' : cat === 'nourishing' ? 'nourishing' : 'balancing';
}

// Counts a number up from start to end over durationMs
function useCountUp(target, durationMs = 900) {
  const [display, setDisplay] = useState(null);
  const prevTarget = useRef(null);
  useEffect(() => {
    if (target == null) return;
    if (prevTarget.current === target) return;
    prevTarget.current = target;
    const start = Math.max(0, target - 3000);
    const steps = 40;
    const step = (target - start) / steps;
    const interval = durationMs / steps;
    let current = start;
    let i = 0;
    setDisplay(start);
    const timer = setInterval(() => {
      i++;
      current = i >= steps ? target : Math.round(start + step * i);
      setDisplay(current);
      if (i >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [target, durationMs]);
  return display ?? target;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function DashboardPage() {
  const { t, lang } = useI18n();
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();
  const d = t('dashboard');

  const [memberCount, setMemberCount] = useState(null);
  const [bdParts, setBdParts] = useState({ d: '', m: '', y: '' });
  const [country, setCountry] = useState(user?.country || '');
  const [saving, setSaving] = useState(false);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    api.get('/stats').then((s) => setMemberCount(s.userCount)).catch(() => {});
  }, []);

  const handleBdChange = (part) => (e) => setBdParts((prev) => ({ ...prev, [part]: e.target.value }));

  const saveBirthdate = useCallback(async () => {
    const { d: day, m: month, y: year } = bdParts;
    if (!day || !month || !year) return;
    const birthdate = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
    setSaving(true);
    try {
      await api.patch('/auth/profile', { birthdate, ...(country && { country }) });
      const result = computeSolarCode({ birthdate, name: user.name || '' });
      await api.post('/readings', { input: result.input, result }).catch(() => {});
      setRevealing(true);
    } catch { setSaving(false); }
  }, [bdParts, country, user]);

  const goToReport = useCallback((reportKey) => {
    if (reportKey === 'compat') { navigate('/informes'); return; }
    if (user?.birthdate) {
      const r = computeSolarCode({ birthdate: user.birthdate, name: user.name || '' });
      window.localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(r.input));
    }
    if (PAYMENT_LINKS.fullReport) window.location.href = PAYMENT_LINKS.fullReport;
    else navigate('/codigo/informe');
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sun className="w-12 h-12 text-primary mx-auto" />
          <p className="text-lg text-muted-foreground">{t('history.loginRequired')}</p>
          <Button onClick={() => openAuth('login')} className="bg-primary text-primary-foreground">
            {t('history.loginCta')}
          </Button>
        </div>
      </div>
    );
  }

  const userResult = user.birthdate ? computeSolarCode({ birthdate: user.birthdate, name: user.name || '' }) : null;
  const todayResult = computeSolarCode({ birthdate: todayISO() });
  const resonanceKey = userResult ? getResonanceKey(userResult, todayResult) : null;

  const todaySealStyle = SEAL_COLORS[todayResult.seal.color];
  const TodayElemIcon = ELEMENT_ICONS[todayResult.element];
  const todaySealName = seals[todayResult.seal.key]?.[lang]?.name ?? todayResult.seal.name;
  const todayToneName = tones[todayResult.tone.key]?.[lang]?.name ?? todayResult.tone.name;

  return (
    <>
    <AnimatePresence>
      {revealing && (
        <RitualReveal variant="solo" onDone={() => window.location.reload()} />
      )}
    </AnimatePresence>
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            {user.name || user.email}
          </h1>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {d.member} #{user.memberNumber} {d.ofTheNetwork}
            </span>
          </div>
          {memberCount !== null && (
            <p className="text-sm text-muted-foreground">{d.totalMembers(memberCount)}</p>
          )}
        </motion.div>

        {/* Birthdate prompt */}
        {!userResult ? (
          <motion.div {...fadeUp(0.1)} className="bg-card border border-primary/30 rounded-2xl p-8 text-center space-y-6">
            <Sun className="w-12 h-12 text-primary mx-auto" />
            <div>
              <h2 className="text-xl font-semibold mb-1">{d.noBirthdate}</h2>
              <p className="text-muted-foreground text-sm">{d.birthdateLabel}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {(() => {
                const months = home[lang].join.months;
                const days = Array.from({ length: 31 }, (_, i) => i + 1);
                const years = Array.from({ length: new Date().getFullYear() - 1929 }, (_, i) => new Date().getFullYear() - i);
                return (
                  <>
                    <select value={bdParts.d} onChange={handleBdChange('d')}
                      className="bg-input text-foreground border border-input rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">{lang === 'es' ? 'Día' : 'Day'}</option>
                      {days.map((d) => <option key={d} value={String(d)}>{d}</option>)}
                    </select>
                    <select value={bdParts.m} onChange={handleBdChange('m')}
                      className="bg-input text-foreground border border-input rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">{lang === 'es' ? 'Mes' : 'Month'}</option>
                      {months.map((name, i) => <option key={i} value={String(i + 1)}>{name}</option>)}
                    </select>
                    <select value={bdParts.y} onChange={handleBdChange('y')}
                      className="bg-input text-foreground border border-input rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">{lang === 'es' ? 'Año' : 'Year'}</option>
                      {years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
                    </select>
                  </>
                );
              })()}
            </div>
            <div className="max-w-xs mx-auto w-full">
              <CountrySelect value={country} onChange={setCountry} />
            </div>
            <Button onClick={saveBirthdate} disabled={saving || !bdParts.d || !bdParts.m || !bdParts.y}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              {saving ? d.saving : d.saveProfile}
            </Button>
          </motion.div>
        ) : (
          <SolarCodeReveal
            userResult={userResult}
            lang={lang}
            d={d}
            goToReport={goToReport}
            resonanceKey={resonanceKey}
            todayResult={todayResult}
            todaySealStyle={todaySealStyle}
            TodayElemIcon={TodayElemIcon}
            todaySealName={todaySealName}
            todayToneName={todayToneName}
          />
        )}

      </div>
    </div>
    </>
  );
}

function SolarCodeReveal({ userResult, lang, d, goToReport, resonanceKey, todayResult, todaySealStyle, TodayElemIcon, todaySealName, todayToneName }) {
  const animatedCode = useCountUp(userResult.solarCode);
  const sealStyle = SEAL_COLORS[userResult.seal.color];
  const ElemIcon = ELEMENT_ICONS[userResult.element];

  const sealData = seals[userResult.seal.key]?.[lang];
  const toneData = tones[userResult.tone.key]?.[lang];
  const tramoData = tramos[userResult.tramo.n - 1]?.[lang];
  const tramoColor = tramoColors[userResult.element];
  const animalData = chineseAnimals[userResult.chinese.animal.key]?.[lang];
  const chineseElemData = chineseElements[userResult.chinese.element.key]?.[lang];
  const polarity = userResult.chinese.polarity === 'yin' ? 'Yin' : 'Yang';

  return (
    <div className="space-y-6">

      {/* Headline — same structure as ResultPage */}
      <motion.div {...fadeUp(0.1)} className="text-center">
        <Sun className="w-20 h-20 mx-auto mb-6 text-primary" />
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">{d.yourCode}</p>
        <h1 className="text-6xl md:text-8xl font-bold text-primary text-glow mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          {animatedCode?.toLocaleString(lang === 'es' ? 'es' : 'en')}
        </h1>
        <p className="text-muted-foreground">
          {lang === 'es' ? 'de la matriz de 144.000' : 'of the 144,000 matrix'}
        </p>
      </motion.div>

      {/* Archetype card — same as ResultPage */}
      <motion.div {...fadeUp(0.2)}
        className="bg-card rounded-2xl p-8 border border-primary/30 shadow-lg text-center cosmic-glow">
        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
          {lang === 'es' ? 'Tu Arquetipo Solar' : 'Your Solar Archetype'}
        </p>
        <h2 className={`text-3xl font-bold mb-1 ${sealStyle.text}`} style={{ fontFamily: 'Playfair Display, serif' }}>
          {sealData?.name}
        </h2>
        {sealData?.archetype && <p className="text-lg text-foreground/80">{sealData.archetype}</p>}
      </motion.div>

      {/* Stats grid — same as ResultPage */}
      <motion.div {...fadeUp(0.3)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: d.kin, value: userResult.kin, sub: '/ 260' },
          { label: d.tone, value: `${userResult.tone.n} · ${toneData?.name}` },
          {
            label: d.element,
            value: ELEMENT_NAMES[lang][userResult.element],
            sub: `${lang === 'es' ? 'Tramo' : 'Segment'} ${userResult.tramo.n} · ${tramoColor?.[lang]?.name}`,
            color: tramoColor?.hex,
          },
          { label: lang === 'es' ? 'Signo Chino' : 'Chinese Sign', value: `${chineseElemData?.name} ${animalData?.name}`, sub: polarity },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className="font-bold text-foreground" style={s.color ? { color: s.color } : {}}>{s.value}</p>
            {s.sub && <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </motion.div>

      {/* Purpose */}
      {sealData?.purpose && (
        <motion.div {...fadeUp(0.4)} className="bg-muted rounded-2xl p-8">
          <h3 className="text-xl font-bold text-primary mb-4">
            {lang === 'es' ? 'Tu Propósito' : 'Your Purpose'}
          </h3>
          <p className="text-lg leading-relaxed">{sealData.purpose}</p>
          {toneData?.meaning && (
            <p className="mt-3 text-muted-foreground leading-relaxed">{toneData.meaning}</p>
          )}
        </motion.div>
      )}

      {/* Tramo reading */}
      {tramoData && (
        <motion.div {...fadeUp(0.5)} className="bg-muted rounded-2xl p-8">
          <h3 className="text-xl font-bold text-primary mb-4">
            {lang === 'es' ? 'Lectura Solar' : 'Solar Reading'}
          </h3>
          <p className="font-semibold text-foreground mb-2">{tramoData.energy}</p>
          <p className="text-lg leading-relaxed text-foreground/90">{tramoData.description}</p>
        </motion.div>
      )}

      {/* Today's resonance */}
      <motion.div {...fadeUp(0.6)} className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold">{d.todayTitle}</h2>
        <div className={`flex items-center justify-between rounded-xl p-3 ${todaySealStyle.bg} border ${todaySealStyle.border}`}>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{d.todayKin}</p>
            <p className={`font-semibold text-sm ${todaySealStyle.text}`}>
              Kin {todayResult.kin} — {todaySealName} · {todayToneName}
            </p>
          </div>
          <TodayElemIcon className={`w-5 h-5 ${ELEMENT_COLORS[todayResult.element]}`} />
        </div>
        {resonanceKey && (
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
            <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm leading-relaxed">{d.resonance[resonanceKey]}</p>
          </div>
        )}
      </motion.div>

      {/* Locked upsell — same structure as ResultPage */}
      <motion.div {...fadeUp(0.7)}
        className="bg-secondary text-secondary-foreground rounded-2xl p-8 md:p-10 text-center border border-primary/20">
        <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-primary mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          {d.lockedTitle}
        </h3>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          {d.lockedReports.map((report) => (
            <Button key={report.key} size="lg" onClick={() => goToReport(report.key)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <span>{report.icon}</span> {report.title}
            </Button>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
