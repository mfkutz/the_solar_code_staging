import { useState, useContext } from 'react';
import { DashCtx } from './DashCtx.js';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import HarmonyMeter from '@/components/dashboard/HarmonyMeter.jsx';
import DashboardIcon from '@/components/dashboard/DashboardIcon.jsx';
import { MdSportsTennis } from 'react-icons/md';
import { enrichCode, computeResonance, computeAdvantage } from '@/lib/dashboardData.js';
import { computeSolarCode } from '@/lib/solarcode/index.js';
import { api } from '@/lib/api.js';
import { useAuth } from '@/auth/AuthProvider.jsx';

const TENNIS_FREE_LIMIT = 1;

function elementDot(element) {
  return {
    fire: 'var(--db-red)', air: 'hsl(200 60% 70%)',
    water: 'var(--db-blue)', earth: 'var(--db-gold)', ether: 'var(--db-gold-2)',
  }[element] || 'var(--db-gold-2)';
}

function PersonForm({ value, onChange, prefix, s }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="db-stack" style={{ gap: 14 }}>
      <div className="db-field">
        <label>{prefix ? `${prefix} · ` : ''}{s.formName}</label>
        <input
          className="db-input"
          placeholder={s.formNamePh}
          value={value.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </div>
      <div className="db-field">
        <label>{s.formBirthdate}</label>
        <div className="db-date-row">
          <input
            className="db-input"
            placeholder={s.formDayPh}
            inputMode="numeric"
            value={value.day}
            onChange={(e) => set('day', e.target.value.replace(/\D/g, '').slice(0, 2))}
          />
          <select
            className="db-select"
            value={value.month}
            onChange={(e) => set('month', e.target.value)}
          >
            <option value="">{s.formMonthPh}</option>
            {s.months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <input
            className="db-input"
            placeholder={s.formYearPh}
            inputMode="numeric"
            value={value.year}
            onChange={(e) => set('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
          />
        </div>
      </div>
    </div>
  );
}

function isValid(p) {
  const d = +p.day, y = +p.year;
  return p.name.trim() && d >= 1 && d <= 31 && p.month && y >= 1900 && y <= 2030;
}

export default function CompatibilidadSection() {
  const { userCode, dailyCode, addHistory, openPayment, toast, tennisUsed, incTennisUsed, lang } = useContext(DashCtx);
  const { user, updateUser } = useAuth();
  const { t } = useI18n();
  const s  = t('dashboard.compat');
  const sb = t('dashboard.sidebar');

  const [mode, setMode] = useState('personal');
  const [p1, setP1] = useState({ name: '', day: '', month: '', year: '' });
  const [p2, setP2] = useState({ name: '', day: '', month: '', year: '' });
  const [phase, setPhase] = useState('form');
  const [result, setResult] = useState(null);

  const reset = () => { setPhase('form'); setResult(null); };

  const mkCode = (p) => {
    const birthdate = `${String(p.year).padStart(4,'0')}-${String(p.month).padStart(2,'0')}-${String(p.day).padStart(2,'0')}`;
    const raw = computeSolarCode({ birthdate, name: p.name.trim() });
    return enrichCode(raw, p.name.trim(), lang);
  };

  const runPersonal = () => {
    if (!isValid(p1) || !userCode) { setPhase('error'); return; }
    setPhase('loading');
    setTimeout(() => {
      try {
        const birthdate = `${String(p1.year).padStart(4,'0')}-${String(p1.month).padStart(2,'0')}-${String(p1.day).padStart(2,'0')}`;
        const raw = computeSolarCode({ birthdate, name: p1.name.trim() });
        const other = enrichCode(raw, p1.name.trim(), lang);
        const res = computeResonance(userCode, other, lang);
        setResult({ kind: 'personal', other, res });
        setPhase('result');
        addHistory({ kind: 'compat', code: other, resonance: res, createdAt: Date.now() });
        api.post('/readings', { input: { kind: 'compat', name: p1.name.trim(), birthdate }, result: raw }).catch(() => {});
        toast(s.toastSaved, 'check');
      } catch { setPhase('error'); }
    }, 1400);
  };

  const runSports = () => {
    if (!isValid(p1) || !isValid(p2)) { setPhase('error'); return; }
    setPhase('loading');
    setTimeout(() => {
      try {
        const a = mkCode(p1);
        const b = mkCode(p2);
        const adv = computeAdvantage(a, b, dailyCode, lang);
        const res = computeResonance(a, b, lang);
        setResult({ kind: 'sports', adv, a, b });
        setPhase('result');
        addHistory({ kind: 'tennis', code: a, codeB: b, adv, resonance: res, createdAt: Date.now() });
        api.post('/readings', {
          input: { kind: 'tennis', p1: p1.name, p2: p2.name },
          result: { adv },
        }).catch(() => {});
        incTennisUsed();
        if (tennisUsed >= TENNIS_FREE_LIMIT && (user?.tennisCredits ?? 0) > 0) {
          updateUser({ tennisCredits: (user.tennisCredits ?? 0) - 1 });
        }
        toast(s.toastDuelSaved, 'check');
      } catch { setPhase('error'); }
    }, 1400);
  };

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">{s.eyebrow}</div>
        <h1>{sb.nav['compatibilidad']}</h1>
        <p className="db-sub">{s.subtitle}</p>
      </div>

      <div className="db-tabs">
        <button className={`db-tab${mode === 'personal' ? ' active' : ''}`} onClick={() => { setMode('personal'); reset(); }}>
          {s.tabPersonal}
        </button>
        <button className={`db-tab${mode === 'sports' ? ' active' : ''}`} onClick={() => { setMode('sports'); reset(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {s.tabTennis}
          <MdSportsTennis size={16} />
          {tennisUsed >= TENNIS_FREE_LIMIT && (user?.tennisCredits ?? 0) > 0 && (
            <span className="db-kind-pill" style={{ fontSize: 10, padding: '1px 6px', background: mode === 'sports' ? 'var(--db-bg)' : undefined, color: mode === 'sports' ? 'var(--db-gold-2)' : undefined }}>
              {user.tennisCredits} {s.creditsLeft}
            </span>
          )}
        </button>
      </div>

      {phase === 'form' && (
        <div className="db-card glow" style={{ padding: 32 }}>
          {mode === 'personal' ? (
            <>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'var(--db-gold-2)', marginBottom: 16 }}>
                {s.personalFormTitle}
              </div>
              <PersonForm value={p1} onChange={setP1} s={s} />
              {!userCode && (
                <p className="db-muted" style={{ marginTop: 14, fontSize: 13.5 }}>{s.noCodeWarning}</p>
              )}
              <div style={{ marginTop: 24 }}>
                <button className="db-btn db-btn-gold" onClick={runPersonal} disabled={!userCode}>
                  <span className="db-shine" />
                  <DashboardIcon name="infinity" style={{ width: 17, height: 17 }} />
                  {s.calcBtn}
                </button>
              </div>
            </>
          ) : (tennisUsed >= TENNIS_FREE_LIMIT && (user?.tennisCredits ?? 0) <= 0) ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <MdSportsTennis size={42} style={{ color: 'var(--db-gold-2)', marginBottom: 14 }} />
              <div className="db-serif" style={{ fontSize: 20, marginBottom: 8 }}>{s.tennisLimitTitle}</div>
              <p className="db-muted" style={{ fontSize: 14.5, lineHeight: 1.6, maxWidth: '36ch', margin: '0 auto 22px' }}>
                {s.tennisLimitDesc}
              </p>
              <button
                className="db-btn db-btn-gold"
                onClick={() => openPayment({ type: 'tennis', glyph: '🎾', desc: s.tennisUnlockDesc })}
              >
                <span className="db-shine" />
                {s.tennisUnlockBtn}
                <MdSportsTennis size={18} />
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'var(--db-gold-2)', marginBottom: 16 }}>
                {s.tennisFormTitle}
              </div>
              <div className="db-grid-2">
                <div className="db-card" style={{ padding: 22, background: 'var(--db-card)' }}>
                  <PersonForm value={p1} onChange={setP1} prefix={s.player1} s={s} />
                </div>
                <div className="db-card" style={{ padding: 22, background: 'var(--db-card)' }}>
                  <PersonForm value={p2} onChange={setP2} prefix={s.player2} s={s} />
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <button className="db-btn db-btn-gold" onClick={runSports}>
                  <span className="db-shine" />
                  {s.tennisBtn}
                  <MdSportsTennis size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {phase === 'loading' && (
        <div className="db-state">
          <div className="db-spinner" style={{ marginBottom: 22 }} />
          <h3>{mode === 'sports' ? s.loadingSports : s.loadingPersonal}</h3>
          <p>{s.loadingSub}</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="db-state error">
          <div className="db-se-mark">
            <DashboardIcon name="alert" style={{ width: 30, height: 30 }} />
          </div>
          <h3>{s.errorTitle}</h3>
          <p>{s.errorDesc}</p>
          <button className="db-btn db-btn-ghost" onClick={reset} style={{ marginTop: 8 }}>
            <DashboardIcon name="arrow" style={{ width: 16, height: 16 }} />
            {s.retryBtn}
          </button>
        </div>
      )}

      {phase === 'result' && result?.kind === 'personal' && (
        <div className="db-stack">
          <div className="db-card glow" style={{ padding: 30 }}>
            <div className="db-grid-2" style={{ gap: 26, alignItems: 'center' }}>
              <div className="db-stack" style={{ gap: 18 }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'var(--db-gold-2)', marginBottom: 8 }}>{s.resultCodeOf}</div>
                  <div className="db-row" style={{ gap: 16 }}>
                    <div className="db-hist-seal">{result.other.seal.glyph}</div>
                    <div>
                      <div className="db-serif" style={{ fontSize: 19 }}>{result.other.name}</div>
                      <div className="db-muted" style={{ fontSize: 13.5, marginTop: 2 }}>
                        <span className="db-gold">{result.other.solarStr}</span> · {result.other.archetype}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="db-divider" />
                <div className="db-row" style={{ gap: 10, flexWrap: 'wrap' }}>
                  {userCode && (
                    <>
                      <span className="db-tag-el">
                        <span style={{ background: elementDot(userCode.element), width: 7, height: 7, display: 'inline-block', borderRadius: '50%', marginRight: 6 }} />
                        {s.resultYou} · {userCode.elementDisplay.label}
                      </span>
                      <DashboardIcon name="infinity" style={{ width: 20, height: 20, color: 'var(--db-gold-2)' }} />
                    </>
                  )}
                  <span className="db-tag-el">
                    <span style={{ background: elementDot(result.other.element), width: 7, height: 7, display: 'inline-block', borderRadius: '50%', marginRight: 6 }} />
                    {result.other.name.split(' ')[0]} · {result.other.elementDisplay.label}
                  </span>
                </div>
              </div>
              <div className="db-card" style={{ padding: 24, background: 'var(--db-card)' }}>
                <HarmonyMeter level={result.res.level} label={result.res.label} />
                <p className="db-muted" style={{ fontSize: 13.5, marginTop: 14, lineHeight: 1.55 }}>{result.res.elementsLine}.</p>
              </div>
            </div>
            <p className="db-rtext" style={{ marginTop: 22 }}>{result.res.text}</p>
          </div>
          <div className="db-row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button
              className="db-btn db-btn-gold"
              onClick={() => openPayment({ type: 'compat', glyph: result.other.seal.glyph, desc: s.compatReportDesc(result.other.name.split(' ')[0]) })}
            >
              <span className="db-shine" />
              {s.compatReportBtn}
              <DashboardIcon name="arrow" style={{ width: 16, height: 16 }} />
            </button>
            <button className="db-btn db-btn-ghost" onClick={reset}>
              <DashboardIcon name="plus" style={{ width: 16, height: 16 }} />
              {s.newQueryBtn}
            </button>
          </div>
        </div>
      )}

      {phase === 'result' && result?.kind === 'sports' && (
        <div className="db-stack">
          <div className="db-card glow" style={{ padding: 30 }}>

            {/* Players */}
            <div className="db-grid-2" style={{ gap: 18 }}>
              {[result.adv.a, result.adv.b].map((pl, i) => (
                <div key={i} className="db-card" style={{ padding: 24, background: 'var(--db-card)' }}>
                  <div className="db-spread">
                    <span className="db-kind-pill">{i === 0 ? s.player1 : s.player2}</span>
                    <span className="db-muted" style={{ fontSize: 12 }}>{s.selloLabel} {pl.sealNum}</span>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div className="db-row" style={{ gap: 14 }}>
                      <div className="db-hist-seal" style={{ fontSize: 23 }}>{pl.seal.glyph}</div>
                      <div>
                        <div className="db-serif" style={{ fontSize: 17 }}>{pl.name}</div>
                        <div className="db-muted" style={{ fontSize: 12.5, marginTop: 2 }}>{pl.seal.name} · {pl.tone.name}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <div className="db-spread" style={{ marginBottom: 7 }}>
                      <span className="db-muted" style={{ fontSize: 12, letterSpacing: '.06em' }}>{s.todaySync}</span>
                      <span className="db-serif db-gold" style={{ fontSize: 20 }}>{pl.todayScore}%</span>
                    </div>
                    <div className="db-meter">
                      <div className="db-fill" style={{ width: `${pl.todayScore}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Combined energy: selloA + selloB */}
            <div className="db-card" style={{ padding: '18px 22px', marginTop: 18, background: 'var(--db-card)' }}>
              <div className="db-muted" style={{ fontSize: 11, letterSpacing: '.08em', marginBottom: 10 }}>
                {s.combinedEnergyTitle}
              </div>
              <div className="db-muted" style={{ fontSize: 12.5, marginBottom: 12 }}>
                {s.selloLabel} {result.adv.snA} + {s.selloLabel} {result.adv.snB} = {s.selloLabel} {result.adv.combined.num}
              </div>
              <div className="db-row" style={{ gap: 14, alignItems: 'center' }}>
                <div style={{ fontSize: 30, color: 'var(--db-gold-2)' }}>{result.adv.combined.glyph}</div>
                <div>
                  <div className="db-serif" style={{ fontSize: 18 }}>{result.adv.combined.name}</div>
                  <div className="db-muted" style={{ fontSize: 12.5, marginTop: 2 }}>{result.adv.combined.powers.join(' · ')}</div>
                </div>
              </div>
            </div>

            {/* Final energy: combined + day */}
            <div className="db-card" style={{ padding: '18px 22px', marginTop: 10, background: 'var(--db-card)' }}>
              <div className="db-muted" style={{ fontSize: 11, letterSpacing: '.08em', marginBottom: 10 }}>
                {s.finalEnergyTitle}
              </div>
              <div className="db-muted" style={{ fontSize: 12.5, marginBottom: 12 }}>
                {s.selloLabel} {result.adv.combined.num} + {s.selloLabel} {result.adv.snD} = {s.selloLabel} {result.adv.final.num}
              </div>
              <div className="db-row" style={{ gap: 14, alignItems: 'center' }}>
                <div style={{ fontSize: 30, color: 'var(--db-gold-2)' }}>{result.adv.final.glyph}</div>
                <div>
                  <div className="db-serif" style={{ fontSize: 18 }}>{result.adv.final.name}</div>
                  <div className="db-muted" style={{ fontSize: 12.5, marginTop: 2 }}>{result.adv.final.powers.join(' · ')}</div>
                </div>
              </div>
            </div>

          </div>
          <div className="db-row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button
              className="db-btn db-btn-gold"
              onClick={() => openPayment({ type: 'compat', glyph: '⚡', desc: s.sportsReportDesc })}
            >
              <span className="db-shine" />
              {s.sportsReportBtn}
              <DashboardIcon name="arrow" style={{ width: 16, height: 16 }} />
            </button>
            <button className="db-btn db-btn-ghost" onClick={reset}>
              <DashboardIcon name="plus" style={{ width: 16, height: 16 }} />
              {s.newDuelBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
