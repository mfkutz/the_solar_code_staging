import { useState, useContext, useCallback } from 'react';
import { DashCtx } from './DashCtx.js';
import { useAuth } from '@/auth/AuthProvider.jsx';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import DashboardIcon from '@/components/dashboard/DashboardIcon.jsx';
import { enrichCode, computeResonance } from '@/lib/dashboardData.js';
import { computeRelation } from '@/lib/solarcode/relations.js';
import { PAYMENT_LINKS, relationPricing } from '@/config/payments.js';
import { api } from '@/lib/api.js';
import { relationContent } from '@/content/relations.js';

const COUPLE_MIN = 2;
const GROUP_MIN  = 3;
const GROUP_MAX  = 8;

const emptyPerson = () => ({ name: '', day: '', month: '', year: '' });

function isValid(p) {
  const d = +p.day, y = +p.year;
  return d >= 1 && d <= 31 && p.month && y >= 1900 && y <= 2030;
}

function toISODate(p) {
  return `${String(p.year).padStart(4,'0')}-${String(p.month).padStart(2,'0')}-${String(p.day).padStart(2,'0')}`;
}

function elementColor(el) {
  return { fire:'var(--db-red)', air:'hsl(200 60% 70%)', water:'var(--db-blue)', earth:'var(--db-gold)', ether:'var(--db-gold-2)' }[el] || 'var(--db-gold-2)';
}

function PersonForm({ value, onChange, label, s }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="db-card" style={{ padding: '20px 22px' }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--db-gold-2)', marginBottom: 12 }}>{label}</div>
      <div className="db-stack" style={{ gap: 10 }}>
        <div className="db-field">
          <label>{s.formName}</label>
          <input className="db-input" placeholder={s.formNamePh} value={value.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="db-field">
          <label>{s.formBirthdate} *</label>
          <div className="db-date-row">
            <input className="db-input" placeholder={s.formDayPh} inputMode="numeric" value={value.day}
              onChange={(e) => set('day', e.target.value.replace(/\D/g,'').slice(0,2))} />
            <select className="db-select" value={value.month} onChange={(e) => set('month', e.target.value)}>
              <option value="">{s.formMonthPh}</option>
              {s.months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
            <input className="db-input" placeholder={s.formYearPh} inputMode="numeric" value={value.year}
              onChange={(e) => set('year', e.target.value.replace(/\D/g,'').slice(0,4))} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SealChip({ code, lang }) {
  if (!code) return null;
  const rc = relationContent[lang] || relationContent.es;
  return (
    <div className="db-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 22,
        background: 'radial-gradient(circle,hsl(45 70% 50%/0.15),transparent 70%)', border: '1px solid var(--db-border-2)', flexShrink: 0 }}>
        {code.seal?.glyph || '✦'}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{code.name || '—'}</div>
        <div style={{ fontSize: 12, color: 'var(--db-muted-2)' }}>
          {code.seal?.name} · {code.tone?.name}
        </div>
        <div style={{ display: 'inline-block', marginTop: 4, fontSize: 11, padding: '2px 8px', borderRadius: 99,
          background: elementColor(code.element) + '22', color: elementColor(code.element), border: `1px solid ${elementColor(code.element)}55` }}>
          {code.elementDisplay?.label || code.element}
        </div>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: 'var(--db-muted-2)' }}>SINTONÍA</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--db-gold-2)', fontFamily: "'Cormorant Garamond',serif" }}>
          {code._resonance ?? '—'}%
        </div>
      </div>
    </div>
  );
}

function EnergyRow({ label, seal }) {
  if (!seal) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--db-border)' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 18,
        background: 'hsl(45 70% 50%/0.1)', border: '1px solid var(--db-border-2)', flexShrink: 0 }}>
        {seal.glyph || '✦'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--db-muted-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{seal.name}</div>
        {seal.powers?.length > 0 && (
          <div style={{ fontSize: 12, color: 'var(--db-muted-2)' }}>{seal.powers.slice(0,3).join(' · ')}</div>
        )}
      </div>
    </div>
  );
}

function FullReport({ result, lang, s }) {
  const rc = relationContent[lang] || relationContent.es;
  const fill = (tpl, vars) => tpl?.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') ?? '';
  const ELEMENT_DISPLAY = { fire: 'Fuego', water: 'Agua', earth: 'Tierra', air: 'Aire', ether: 'Éter' };

  return (
    <div className="db-stack" style={{ gap: 16, marginTop: 8 }}>
      {/* Bonds */}
      <div className="db-card" style={{ padding: '20px 22px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: 'var(--db-gold-2)', marginBottom: 14 }}>
          {s.bondsSectionTitle}
        </div>
        {result.pairs.map((pair, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--db-border)', fontSize: 13, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, color: 'var(--db-gold)', marginBottom: 4 }}>
              {pair.nameA || `P${pair.i+1}`} ✦ {pair.nameB || `P${pair.j+1}`}
            </div>
            <div style={{ color: 'var(--db-muted-1)' }}>
              {fill(rc.category?.[pair.category] || '', {
                nameA: pair.nameA, nameB: pair.nameB,
                elementA: ELEMENT_DISPLAY[pair.elementA] || pair.elementA,
                elementB: ELEMENT_DISPLAY[pair.elementB] || pair.elementB,
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Group field */}
      <div className="db-card" style={{ padding: '20px 22px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: 'var(--db-gold-2)', marginBottom: 14 }}>
          {s.groupFieldTitle}
        </div>
        <div style={{ fontSize: 13, color: 'var(--db-muted-1)', lineHeight: 1.7 }}>
          {fill(rc.groupIntro || '', { size: result.group.size })}
        </div>
        {result.group.dominantElement && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: elementColor(result.group.dominantElement) }} />
            <span style={{ fontSize: 12, color: 'var(--db-muted-2)' }}>{s.dominantElement}: </span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{ELEMENT_DISPLAY[result.group.dominantElement] || result.group.dominantElement}</span>
          </div>
        )}
      </div>

      {/* Synthesis */}
      <div className="db-card" style={{ padding: '20px 22px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: 'var(--db-gold-2)', marginBottom: 10 }}>
          {s.synthesis}
        </div>
        <div style={{ fontSize: 13, color: 'var(--db-muted-1)', lineHeight: 1.8, fontStyle: 'italic' }}>
          {result.group.resonance >= 82 ? rc.synthesis?.high : rc.synthesis?.balanced}
        </div>
      </div>

      {/* Print */}
      <button className="db-btn db-btn-ghost" style={{ width: '100%' }} onClick={() => window.print()}>
        <DashboardIcon name="scroll" style={{ width: 16, height: 16 }} />
        {s.printBtn}
      </button>
    </div>
  );
}

function HistoryItem({ item, onSelect, s }) {
  return (
    <div className="db-card" style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
      onClick={() => onSelect(item)}>
      <div style={{ display: 'flex', gap: -6 }}>
        {item.people.slice(0,3).map((p, i) => (
          <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 14,
            background: 'hsl(45 70% 50%/0.1)', border: '1px solid var(--db-border-2)', marginLeft: i > 0 ? -8 : 0 }}>
            {p.seal?.glyph || '✦'}
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>
          {item.people.slice(0,2).map(p => p.name || '—').join(' ✦ ')}
          {item.people.length > 2 ? ` +${item.people.length-2}` : ''}
        </div>
        <div style={{ fontSize: 11, color: 'var(--db-muted-2)' }}>
          {new Date(item.createdAt).toLocaleDateString()} · {item.group.resonance}% · {item.people.length} {s.people}
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--db-gold-2)' }}>
        {item.purchased ? s.viewReport : '→'}
      </div>
    </div>
  );
}

export default function ConjuntosSection() {
  const { openPayment, toast, addHistory } = useContext(DashCtx);
  const { user, updateUser } = useAuth();
  const { t, lang } = useI18n();
  const s  = t('dashboard.conjuntos');
  const sb = t('dashboard.sidebar');
  const cs = t('dashboard.compat');

  const [mode, setMode]     = useState('couple');
  const [phase, setPhase]   = useState('form');
  const [people, setPeople] = useState([emptyPerson(), emptyPerson()]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const min = mode === 'couple' ? COUPLE_MIN : GROUP_MIN;
  const max = mode === 'couple' ? COUPLE_MIN : GROUP_MAX;

  const setMode2 = (m) => {
    setMode(m);
    setPhase('form');
    setResult(null);
    setPeople(Array.from({ length: m === 'couple' ? COUPLE_MIN : GROUP_MIN }, emptyPerson));
  };

  const setPerson = useCallback((i, field, val) => {
    setPeople(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  }, []);

  const hasCoupleReport = user?.coupleReportPurchased === true;
  const hasGroupReport  = user?.groupReportPurchased  === true;
  const hasPurchased    = mode === 'couple' ? hasCoupleReport : hasGroupReport;

  const run = () => {
    if (people.some(p => !isValid(p))) { setPhase('error'); return; }
    setPhase('loading');
    setTimeout(() => {
      try {
        const inputs = people.map(p => ({ name: p.name.trim(), birthdate: toISODate(p) }));
        const relation = computeRelation(inputs);

        // Compute individual resonance with group average (for display)
        const enriched = relation.people.map((raw, i) => enrichCode(raw, inputs[i].name, lang));
        const groupAvgResonance = relation.group.resonance;
        const withResonance = enriched.map(code => ({
          ...code,
          _resonance: Math.round(groupAvgResonance * (0.85 + Math.random() * 0.3)),
        }));

        const finalResult = { ...relation, people: withResonance, enriched: withResonance };

        setResult(finalResult);
        setPhase('result');

        const newItem = {
          id: 'local-' + Date.now(),
          kind: mode,
          people: withResonance,
          group: relation.group,
          pairs: relation.pairs,
          purchased: hasPurchased,
          createdAt: Date.now(),
        };
        setHistory(h => [newItem, ...h]);
        addHistory(newItem);

        api.post('/readings', {
          input:  { kind: mode, people: inputs },
          result: { people: relation.people, group: relation.group, pairs: relation.pairs },
        }).catch(() => {});

        toast(s.reportSaved, 'check');
      } catch { setPhase('error'); }
    }, 1400);
  };

  const handleBuyReport = () => {
    const type = mode === 'couple' ? 'couple_report' : 'group_report';
    const pricing = relationPricing(mode === 'couple' ? 'couple' : 'group', people.length);
    openPayment({ type, link: pricing.link, glyph: '✦', desc: s.unlockDesc });
  };

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">{s.eyebrow}</div>
        <h1>{sb.nav['conjuntos']}</h1>
        <p className="db-sub">{s.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="db-tabs" style={{ marginBottom: 24 }}>
        <button className={`db-tab${mode === 'couple' ? ' active' : ''}`} onClick={() => setMode2('couple')}>
          {s.tabCouple}
        </button>
        <button className={`db-tab${mode === 'group' ? ' active' : ''}`} onClick={() => setMode2('group')}>
          {s.tabGroup}
        </button>
      </div>

      {phase === 'form' && (
        <div className="db-stack" style={{ gap: 16 }}>
          {people.map((p, i) => (
            <PersonForm key={i} value={p} label={s.personN(i + 1)} s={cs}
              onChange={(updated) => setPeople(prev => prev.map((x, idx) => idx === i ? updated : x))} />
          ))}

          {mode === 'group' && people.length < GROUP_MAX && (
            <button className="db-btn db-btn-ghost" style={{ width: '100%' }}
              onClick={() => setPeople(p => [...p, emptyPerson()])}>
              <DashboardIcon name="users" style={{ width: 16, height: 16 }} />
              {s.addPerson}
            </button>
          )}
          {mode === 'group' && people.length > GROUP_MIN && (
            <button className="db-btn-quiet" style={{ fontSize: 13 }}
              onClick={() => setPeople(p => p.slice(0, -1))}>
              − Quitar última persona
            </button>
          )}

          <button className="db-btn db-btn-gold" onClick={run}>
            <span className="db-shine" />
            <DashboardIcon name="infinity" style={{ width: 17, height: 17 }} />
            {s.calcBtn}
          </button>

          {phase === 'error' && (
            <p style={{ fontSize: 13, color: 'var(--db-red)', textAlign: 'center' }}>
              Completá las fechas de nacimiento de todas las personas.
            </p>
          )}
        </div>
      )}

      {phase === 'loading' && (
        <div className="db-state">
          <div className="db-se-mark">
            <DashboardIcon name="infinity" style={{ width: 30, height: 30 }} />
          </div>
          <p className="db-muted">Calculando resonancia…</p>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="db-stack" style={{ gap: 20 }}>
          {/* Resonance hero */}
          <div className="db-card glow" style={{ padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--db-muted-2)', marginBottom: 8 }}>
              {s.resonanceLabel}
            </div>
            <div style={{ fontSize: 72, fontWeight: 700, color: 'var(--db-gold-2)', fontFamily: "'Cormorant Garamond',serif", lineHeight: 1 }}>
              {result.group.resonance}%
            </div>
            <div style={{ fontSize: 13, color: 'var(--db-muted-2)', marginTop: 8 }}>
              {result.people.length} {s.people}
            </div>
          </div>

          {/* Individual codes */}
          <div className="db-stack" style={{ gap: 10 }}>
            {result.people.map((code, i) => (
              <SealChip key={i} code={code} lang={lang} />
            ))}
          </div>

          {/* Combined + Final energy */}
          <div className="db-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", color: 'var(--db-gold-2)', fontSize: 15, marginBottom: 14 }}>
              {s.combinedEnergy}
            </div>
            <EnergyRow
              label={(() => {
                const sp = result.group.strongestPair;
                const pA = sp != null ? result.people[sp.i] : result.people[0];
                const pB = sp != null ? result.people[sp.j] : result.people[1];
                return pA && pB ? `${pA.name} ✦ ${pB.name}` : s.combinedEnergy;
              })()}
              seal={result.people[0]?.seal ? { glyph: '⊛', name: s.sharedField || 'Campo compartido', powers: [`${result.group.resonance}% ${s.resonanceLabel || 'resonancia'}`] } : null} />
          </div>

          {/* Full report — locked or unlocked */}
          {hasPurchased ? (
            <FullReport result={result} lang={lang} s={s} />
          ) : (
            <div className="db-state" style={{ padding: '28px 20px' }}>
              <div className="db-se-mark">
                <DashboardIcon name="lock" style={{ width: 28, height: 28 }} />
              </div>
              <h3 style={{ marginBottom: 8 }}>{s.unlockBtn}</h3>
              <p className="db-muted" style={{ maxWidth: '36ch', margin: '0 auto 20px' }}>{s.unlockDesc}</p>
              <button className="db-btn db-btn-gold" onClick={handleBuyReport}>
                <span className="db-shine" />
                <DashboardIcon name="lock" style={{ width: 16, height: 16 }} />
                {mode === 'couple' ? s.buyCouple : s.buyGroup}
              </button>
            </div>
          )}

          {/* New calculation */}
          <button className="db-btn db-btn-ghost" style={{ width: '100%' }}
            onClick={() => { setPhase('form'); setResult(null); }}>
            Nueva consulta
          </button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && phase !== 'loading' && (
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--db-muted-2)', marginBottom: 12 }}>
            {s.historyTitle}
          </div>
          <div className="db-stack" style={{ gap: 8 }}>
            {history.map(item => (
              <HistoryItem key={item.id} item={item} s={s}
                onSelect={(it) => { setResult({ ...it, group: it.group, pairs: it.pairs, people: it.people, enriched: it.people }); setPhase('result'); }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
