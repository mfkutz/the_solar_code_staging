import { useContext, useState } from 'react';
import { DashCtx } from './DashCtx.js';
import DashboardIcon from '@/components/dashboard/DashboardIcon.jsx';
import HarmonyMeter from '@/components/dashboard/HarmonyMeter.jsx';
import { fmtDate } from '@/lib/dashboardData.js';

function DetailOverlay({ item, onClose, openPayment }) {
  if (!item) return null;
  const c = item.code;
  const r = item.resonance;
  return (
    <div className="db-overlay" onClick={onClose}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()} style={{ width: 'min(540px,100%)' }}>
        <button
          className="db-icon-btn"
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16 }}
          aria-label="Cerrar"
        >
          <DashboardIcon name="close" style={{ width: 16, height: 16 }} />
        </button>
        <div style={{ width: 60, height: 60, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 28, color: 'var(--db-gold-2)', background: 'radial-gradient(circle,hsl(45 70% 50% / 0.2),transparent 70%)', border: '1px solid var(--db-border-2)', marginBottom: 18 }}>
          {c.seal.glyph}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 27, lineHeight: 1.1, marginBottom: 8 }}>{c.name}</h2>
        <p className="db-m-desc">{c.archetype} · {c.seal.name} · Tono {c.tone.name} · {c.elementDisplay?.label}</p>
        <div className="db-card" style={{ padding: 22, background: 'var(--db-card)', marginBottom: 18 }}>
          <div className="db-spread" style={{ marginBottom: r ? 14 : 0 }}>
            <span className="db-muted" style={{ fontSize: 13 }}>Número Solar</span>
            <span className="db-serif db-gold" style={{ fontSize: 24 }}>{c.solarStr}</span>
          </div>
          {r && <HarmonyMeter level={r.level} label={r.label} />}
          {r && <p className="db-muted" style={{ fontSize: 13.5, marginTop: 14, lineHeight: 1.55 }}>{r.text}</p>}
        </div>
        {openPayment && (
          <button
            className="db-btn db-btn-gold"
            style={{ width: '100%' }}
            onClick={() => { onClose(); openPayment({ type: 'compat', glyph: c.seal.glyph, desc: `Informe de compatibilidad completo con ${c.name.split(' ')[0]}.` }); }}
          >
            <span className="db-shine" />
            Ver Informe de Compatibilidad
            <DashboardIcon name="arrow" style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function HistorialSection() {
  const { history, removeHistory, setSection, openPayment } = useContext(DashCtx);
  const [detail, setDetail] = useState(null);

  const openItem = (item) => {
    if (item.kind === 'personal') setSection('mi-codigo');
    else setDetail(item);
  };

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">Tu archivo solar</div>
        <h1>Historial</h1>
        <p className="db-sub">Todas tus lecturas guardadas — tu código y cada compatibilidad que consultaste.</p>
      </div>

      {history.length === 0 ? (
        <div className="db-state">
          <div className="db-se-mark">
            <DashboardIcon name="clock" style={{ width: 30, height: 30 }} />
          </div>
          <h3>Tu historial está en silencio</h3>
          <p>Cada lectura que hagas se guardará acá para que vuelvas a ella cuando quieras.</p>
          <button
            className="db-btn db-btn-gold"
            style={{ marginTop: 8 }}
            onClick={() => setSection('compatibilidad')}
          >
            <span className="db-shine" />
            <DashboardIcon name="infinity" style={{ width: 16, height: 16 }} />
            Calcular una compatibilidad
          </button>
        </div>
      ) : (
        <div className="db-hist-list">
          {history.map((item) => (
            <div
              className="db-hist-item"
              key={item.id}
              onClick={() => openItem(item)}
            >
              <div className="db-hist-seal">{item.code?.seal?.glyph || '✦'}</div>
              <div className="db-hist-main">
                <div className="db-hn">
                  {item.code?.name || '—'}
                  <span className="db-kind-pill">
                    {item.kind === 'personal' ? 'Mi código' : 'Compatibilidad'}
                  </span>
                </div>
                <div className="db-hmeta">
                  {item.code?.archetype} · {item.createdAt ? fmtDate(item.createdAt) : ''}
                  {item.resonance ? ` · ${item.resonance.level}% ${item.resonance.label}` : ''}
                </div>
              </div>
              <div className="db-hist-num">{item.code?.solarStr || '—'}</div>
              <div className="db-hist-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="db-icon-btn"
                  title="Abrir"
                  onClick={(e) => { e.stopPropagation(); openItem(item); }}
                >
                  <DashboardIcon name="eye" style={{ width: 17, height: 17 }} />
                </button>
                {item.kind !== 'personal' && (
                  <button
                    className="db-icon-btn danger"
                    title="Borrar"
                    onClick={(e) => { e.stopPropagation(); removeHistory(item.id); }}
                  >
                    <DashboardIcon name="trash" style={{ width: 17, height: 17 }} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {detail && (
        <DetailOverlay
          item={detail}
          onClose={() => setDetail(null)}
          openPayment={openPayment}
        />
      )}
    </div>
  );
}
