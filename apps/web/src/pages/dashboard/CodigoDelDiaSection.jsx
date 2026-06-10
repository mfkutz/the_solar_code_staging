import { useContext } from 'react';
import { DashCtx } from './DashCtx.js';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import HarmonyMeter from '@/components/dashboard/HarmonyMeter.jsx';

function elementDot(element) {
  return {
    fire: 'var(--db-red)', air: 'hsl(200 60% 70%)',
    water: 'var(--db-blue)', earth: 'var(--db-gold)', ether: 'var(--db-gold-2)',
  }[element] || 'var(--db-gold-2)';
}

function AttrCard({ glyph, label, value, meta, color }) {
  return (
    <div className="db-attr-card">
      <div className="db-glyph" style={color ? { color } : undefined}>{glyph}</div>
      <div className="db-lab">{label}</div>
      <div className="db-val">{value}</div>
      {meta && <div className="db-meta">{meta}</div>}
    </div>
  );
}

export default function CodigoDelDiaSection() {
  const { dailyCode, userCode, resonanceWithDay } = useContext(DashCtx);
  const { t } = useI18n();
  const s = t('dashboard.dia');
  const sb = t('dashboard.sidebar');

  const d = dailyCode;
  const res = resonanceWithDay;

  const dateStr = d.dateStr
    ? d.dateStr.charAt(0).toUpperCase() + d.dateStr.slice(1)
    : '';

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">{s.eyebrow}</div>
        <h1>{sb.nav['dia']}</h1>
        {dateStr && <p className="db-sub">{dateStr}</p>}
      </div>

      {/* Day hero */}
      <div className="db-card glow" style={{ padding: 38, marginBottom: 24, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 160, height: 160, display: 'grid', placeItems: 'center', margin: '0 auto' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px dotted hsl(45 70% 60% / 0.4)', animation: 'db-spin 40s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 18, borderRadius: '50%', background: 'radial-gradient(circle, hsl(45 90% 55% / 0.18), transparent 70%)' }} />
          <div style={{ fontSize: 64, color: 'var(--db-gold-2)', filter: 'drop-shadow(0 0 14px var(--db-glow))' }}>{d.seal.glyph}</div>
        </div>
        <div className="db-hero-side">
          <div className="db-arch-eyebrow">{d.seal.glyph} {s.kinLabel} {d.kin}</div>
          <h2 className="db-archetype" style={{ fontSize: 30 }}>{d.signature || `${d.seal.name} ${d.tone.name}`}</h2>
          <p className="db-hero-line">
            {s.heroLine(
              d.seal.name,
              (d.powers[0] || '').toLowerCase(),
              (d.tone.action || '').toLowerCase(),
              d.elementDisplay.label,
            )}
          </p>
          <div className="db-hero-tags" style={{ marginTop: 16 }}>
            <span className="db-tag-el">
              <span style={{ background: elementDot(d.element), width: 7, height: 7, display: 'inline-block', borderRadius: '50%', marginRight: 6 }} />
              {d.elementDisplay.label}
            </span>
            <span className="db-chip">{s.toneLabel} {d.tone.name}</span>
            {d.tone.essence && <span className="db-chip">{d.tone.essence}</span>}
          </div>
        </div>
      </div>

      {/* Attrs */}
      <div className="db-attr-grid" style={{ marginBottom: 24 }}>
        <AttrCard glyph={d.seal.glyph} label={s.cards.seal} value={d.seal.name} meta={d.powers[1]} />
        <AttrCard glyph={d.toneNum ?? ((d.kin - 1) % 13) + 1} label={s.cards.tone} value={d.tone.name} meta={d.tone.action} color="var(--db-gold-2)" />
        <AttrCard glyph={d.elementDisplay.glyph} label={s.cards.element} value={d.elementDisplay.label} color={elementDot(d.element)} />
        <AttrCard glyph="◓" label={s.cards.kin} value={d.kin} meta={s.cards.kinOf} />
      </div>

      {/* Resonance with user */}
      {res && userCode && (
        <div className="db-reading db-card glow">
          <div className="db-spread" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <div className="db-rb-eyebrow">{s.resonanceEyebrow}</div>
              <h3>{s.resonanceTitle}</h3>
            </div>
            <div style={{ minWidth: 230, flex: 1, maxWidth: 320 }}>
              <HarmonyMeter level={res.level} label={res.label} />
            </div>
          </div>
          <p className="db-rtext" style={{ marginTop: 18 }}>
            {s.resonanceMeets(userCode.seal.name, userCode.elementDisplay.label, d.seal.name, d.elementDisplay.label)}{' '}
            {res.compatible
              ? s.resonanceFav(res.elementsLine, (d.tone.action || '').toLowerCase())
              : s.resonanceContrast(res.elementsLine)}
          </p>
        </div>
      )}

      {!userCode && (
        <div className="db-reading db-card glow" style={{ textAlign: 'center', padding: 30 }}>
          <p className="db-muted">{s.noCode}</p>
        </div>
      )}
    </div>
  );
}
