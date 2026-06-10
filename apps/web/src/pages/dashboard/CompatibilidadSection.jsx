import { useState, useContext } from 'react';
import { DashCtx } from './DashCtx.js';
import HarmonyMeter from '@/components/dashboard/HarmonyMeter.jsx';
import DashboardIcon from '@/components/dashboard/DashboardIcon.jsx';
import { MdSportsTennis } from 'react-icons/md';
import { enrichCode, computeResonance, computeAdvantage } from '@/lib/dashboardData.js';
import { computeSolarCode } from '@/lib/solarcode/index.js';
import { api } from '@/lib/api.js';

const TENNIS_FREE_LIMIT = 1;

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function elementDot(element) {
  return {
    fire: 'var(--db-red)', air: 'hsl(200 60% 70%)',
    water: 'var(--db-blue)', earth: 'var(--db-gold)', ether: 'var(--db-gold-2)',
  }[element] || 'var(--db-gold-2)';
}

function PersonForm({ value, onChange, prefix }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="db-stack" style={{ gap: 14 }}>
      <div className="db-field">
        <label>{prefix ? `${prefix} · ` : ''}Nombre</label>
        <input
          className="db-input"
          placeholder="Nombre y apellido"
          value={value.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </div>
      <div className="db-field">
        <label>Fecha de nacimiento</label>
        <div className="db-date-row">
          <input
            className="db-input"
            placeholder="Día"
            inputMode="numeric"
            value={value.day}
            onChange={(e) => set('day', e.target.value.replace(/\D/g, '').slice(0, 2))}
          />
          <select
            className="db-select"
            value={value.month}
            onChange={(e) => set('month', e.target.value)}
          >
            <option value="">Mes</option>
            {MONTHS_ES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <input
            className="db-input"
            placeholder="Año"
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

function mkCode(p) {
  const birthdate = `${String(p.year).padStart(4,'0')}-${String(p.month).padStart(2,'0')}-${String(p.day).padStart(2,'0')}`;
  const raw = computeSolarCode({ birthdate, name: p.name.trim() });
  return enrichCode(raw, p.name.trim());
}

export default function CompatibilidadSection() {
  const { userCode, dailyCode, addHistory, openPayment, toast, tennisUsed, incTennisUsed } = useContext(DashCtx);
  const [mode, setMode] = useState('personal');
  const [p1, setP1] = useState({ name: '', day: '', month: '', year: '' });
  const [p2, setP2] = useState({ name: '', day: '', month: '', year: '' });
  const [phase, setPhase] = useState('form');
  const [result, setResult] = useState(null);

  const reset = () => { setPhase('form'); setResult(null); };

  const runPersonal = () => {
    if (!isValid(p1) || !userCode) { setPhase('error'); return; }
    setPhase('loading');
    setTimeout(() => {
      try {
        const birthdate = `${String(p1.year).padStart(4,'0')}-${String(p1.month).padStart(2,'0')}-${String(p1.day).padStart(2,'0')}`;
        const raw = computeSolarCode({ birthdate, name: p1.name.trim() });
        const other = enrichCode(raw, p1.name.trim());
        const res = computeResonance(userCode, other);
        setResult({ kind: 'personal', other, res });
        setPhase('result');
        addHistory({ kind: 'compat', code: other, resonance: res, createdAt: Date.now() });
        api.post('/readings', {
          input: { kind: 'compat', name: p1.name.trim(), birthdate },
          result: raw,
        }).catch(() => {});
        toast('Lectura guardada en tu Historial', 'check');
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
        const adv = computeAdvantage(a, b, dailyCode);
        const res = computeResonance(a, b);
        setResult({ kind: 'sports', adv, a, b });
        setPhase('result');
        addHistory({ kind: 'compat', code: a, resonance: res, createdAt: Date.now() });
        api.post('/readings', {
          input: { kind: 'tennis', p1: p1.name, p2: p2.name },
          result: { winnerName: adv.winnerName, verdict: adv.verdict },
        }).catch(() => {});
        incTennisUsed();
        toast('Duelo guardado en tu Historial', 'check');
      } catch { setPhase('error'); }
    }, 1400);
  };

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">Resonancia entre almas</div>
        <h1>Compatibilidad</h1>
        <p className="db-sub">Descubrí cómo tu código solar resuena con el de otra persona — o quién surfea mejor la energía de hoy.</p>
      </div>

      <div className="db-tabs">
        <button className={`db-tab${mode === 'personal' ? ' active' : ''}`} onClick={() => { setMode('personal'); reset(); }}>Personal · H2H</button>
        <button className={`db-tab${mode === 'sports' ? ' active' : ''}`} onClick={() => { setMode('sports'); reset(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Tenis
          <MdSportsTennis size={16} />
        </button>
      </div>

      {phase === 'form' && (
        <div className="db-card glow" style={{ padding: 32 }}>
          {mode === 'personal' ? (
            <>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'var(--db-gold-2)', marginBottom: 16 }}>
                Ingresá los datos de la otra persona
              </div>
              <PersonForm value={p1} onChange={setP1} />
              {!userCode && (
                <p className="db-muted" style={{ marginTop: 14, fontSize: 13.5 }}>
                  Necesitás tener tu código calculado para calcular compatibilidad.
                </p>
              )}
              <div style={{ marginTop: 24 }}>
                <button
                  className="db-btn db-btn-gold"
                  onClick={runPersonal}
                  disabled={!userCode}
                >
                  <span className="db-shine" />
                  <DashboardIcon name="infinity" style={{ width: 17, height: 17 }} />
                  Calcular Resonancia
                </button>
              </div>
            </>
          ) : tennisUsed >= TENNIS_FREE_LIMIT ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <MdSportsTennis size={42} style={{ color: 'var(--db-gold-2)', marginBottom: 14 }} />
              <div className="db-serif" style={{ fontSize: 20, marginBottom: 8 }}>Ya usaste tu consulta gratuita</div>
              <p className="db-muted" style={{ fontSize: 14.5, lineHeight: 1.6, maxWidth: '36ch', margin: '0 auto 22px' }}>
                Desbloqueá consultas ilimitadas de Tenis H2H con el plan Galáctico.
              </p>
              <button
                className="db-btn db-btn-gold"
                onClick={() => openPayment({ type: 'compat', glyph: '⚡', desc: 'Acceso ilimitado a duelos energéticos de Tenis H2H.' })}
              >
                <span className="db-shine" />
                Desbloquear Tenis H2H
                <MdSportsTennis size={18} />
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'var(--db-gold-2)', marginBottom: 16 }}>
                Ingresá las dos personas — veremos quién tiene la ventaja energética de hoy
              </div>
              <div className="db-grid-2">
                <div className="db-card" style={{ padding: 22, background: 'var(--db-card)' }}>
                  <PersonForm value={p1} onChange={setP1} prefix="Jugador 1" />
                </div>
                <div className="db-card" style={{ padding: 22, background: 'var(--db-card)' }}>
                  <PersonForm value={p2} onChange={setP2} prefix="Jugador 2" />
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <button className="db-btn db-btn-gold" onClick={runSports}>
                  <span className="db-shine" />
                  Ver ventaja del día
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
          <h3>{mode === 'sports' ? 'Midiendo la energía del duelo…' : 'Calculando la resonancia…'}</h3>
          <p>Leyendo las coordenadas galácticas del momento presente.</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="db-state error">
          <div className="db-se-mark">
            <DashboardIcon name="alert" style={{ width: 30, height: 30 }} />
          </div>
          <h3>No pudimos leer ese código</h3>
          <p>Revisá que el nombre y la fecha de nacimiento estén completos y sean válidos.</p>
          <button className="db-btn db-btn-ghost" onClick={reset} style={{ marginTop: 8 }}>
            <DashboardIcon name="arrow" style={{ width: 16, height: 16 }} />
            Reintentar
          </button>
        </div>
      )}

      {phase === 'result' && result?.kind === 'personal' && (
        <div className="db-stack">
          <div className="db-card glow" style={{ padding: 30 }}>
            <div className="db-grid-2" style={{ gap: 26, alignItems: 'center' }}>
              <div className="db-stack" style={{ gap: 18 }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'var(--db-gold-2)', marginBottom: 8 }}>El código de</div>
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
                        Vos · {userCode.elementDisplay.label}
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
              onClick={() => openPayment({ type: 'compat', glyph: result.other.seal.glyph, desc: `Informe de compatibilidad entre vos y ${result.other.name.split(' ')[0]}.` })}
            >
              <span className="db-shine" />
              Ver Informe de Compatibilidad
              <DashboardIcon name="arrow" style={{ width: 16, height: 16 }} />
            </button>
            <button className="db-btn db-btn-ghost" onClick={reset}>
              <DashboardIcon name="plus" style={{ width: 16, height: 16 }} />
              Nueva consulta
            </button>
          </div>
        </div>
      )}

      {phase === 'result' && result?.kind === 'sports' && (
        <div className="db-stack">
          <div className="db-card glow" style={{ padding: 30 }}>
            <div className="db-grid-2" style={{ gap: 18 }}>
              {[result.adv.a, result.adv.b].map((pl, i) => {
                const isWinner = pl.name.split(' ')[0] === result.adv.winnerName;
                return (
                  <div
                    key={i}
                    className="db-card"
                    style={{
                      padding: 24,
                      background: isWinner ? 'linear-gradient(160deg, hsl(45 50% 40% / 0.14), var(--db-card))' : 'var(--db-card)',
                      border: isWinner ? '1px solid var(--db-border-strong)' : '1px solid var(--db-border)',
                    }}
                  >
                    <div className="db-spread">
                      <span className="db-kind-pill">{i === 0 ? 'Jugador 1' : 'Jugador 2'}</span>
                      {isWinner && <span className="db-badge-pro" style={{ marginLeft: 0 }}>VENTAJA HOY</span>}
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <div className="db-row" style={{ gap: 16 }}>
                        <div className="db-hist-seal" style={{ fontSize: 23 }}>{pl.seal.glyph}</div>
                        <div>
                          <div className="db-serif" style={{ fontSize: 17 }}>{pl.name}</div>
                          <div className="db-muted" style={{ fontSize: 12.5, marginTop: 2 }}>{pl.seal.name} · {pl.tone.name}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 18 }}>
                      <div className="db-spread" style={{ marginBottom: 7 }}>
                        <span className="db-muted" style={{ fontSize: 12.5, letterSpacing: '.06em' }}>SINTONÍA CON HOY</span>
                        <span className="db-serif db-gold" style={{ fontSize: 22 }}>{pl.todayScore}%</span>
                      </div>
                      <div className="db-meter">
                        <div className="db-fill" style={{ width: `${pl.todayScore}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="db-card" style={{ padding: '18px 22px', marginTop: 18, background: 'var(--db-card)', display: 'flex', gap: 14, alignItems: 'center' }}>
              <MdSportsTennis size={30} style={{ color: 'var(--db-gold-2)', flexShrink: 0 }} />
              <p className="db-serif" style={{ fontSize: 15.5, lineHeight: 1.5 }}>{result.adv.verdict}</p>
            </div>
          </div>
          <div className="db-row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button
              className="db-btn db-btn-gold"
              onClick={() => openPayment({ type: 'compat', glyph: '⚡', desc: 'Informe energético del duelo con pronóstico día a día.' })}
            >
              <span className="db-shine" />
              Ver Informe del Duelo
              <DashboardIcon name="arrow" style={{ width: 16, height: 16 }} />
            </button>
            <button className="db-btn db-btn-ghost" onClick={reset}>
              <DashboardIcon name="plus" style={{ width: 16, height: 16 }} />
              Nuevo duelo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
