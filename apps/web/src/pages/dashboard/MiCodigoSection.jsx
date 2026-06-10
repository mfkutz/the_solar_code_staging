import { useContext } from 'react';
import { DashCtx } from './DashCtx.js';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import Mandala from '@/components/dashboard/Mandala.jsx';
import DashboardIcon from '@/components/dashboard/DashboardIcon.jsx';

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

export default function MiCodigoSection() {
  const { userCode, openPayment } = useContext(DashCtx);
  const { t } = useI18n();
  const s = t('dashboard.miCodigo');
  const sb = t('dashboard.sidebar');

  if (!userCode) {
    return (
      <div className="db-section">
        <div className="db-page-head">
          <div className="db-eyebrow">{s.eyebrow}</div>
          <h1>{sb.nav['mi-codigo']}</h1>
        </div>
        <div className="db-state">
          <div className="db-se-mark">✦</div>
          <h3>{s.emptyTitle}</h3>
          <p>{s.emptyDesc}</p>
        </div>
      </div>
    );
  }

  const c = userCode;
  const el = c.elementDisplay;

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">{s.eyebrow}</div>
        <h1>{sb.nav['mi-codigo']}</h1>
        <p className="db-sub">{s.subtitle}</p>
      </div>

      {/* Hero */}
      <div className="db-solar-hero db-card glow" style={{ marginBottom: 24 }}>
        <Mandala
          number={c.solarNumber}
          sub={`Kin ${c.kin} · ${s.toneLabel} ${c.tone.name}`}
          label={s.solarNumber}
        />
        <div className="db-hero-side">
          <div className="db-arch-eyebrow">
            {c.seal.glyph} {s.sealLabel} {c.seal.name}
          </div>
          <h2 className="db-archetype">{c.signature || `${c.seal.name} ${c.tone.name} ${c.color}`}</h2>
          <p className="db-arch-sub" style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 16, color: 'var(--db-muted)', marginBottom: 8, marginTop: 2 }}>{c.archetype}</p>
          <div className="db-hero-tags">
            <span className="db-tag-el">
              <span style={{ background: elementDot(c.element), width: 7, height: 7, display: 'inline-block', borderRadius: '50%', marginRight: 6 }} />
              {el.label} {c.tramoColor && `· ${c.tramoColor}`}
            </span>
            <span className="db-chip">{s.toneLabel} {c.tone.name}</span>
            {c.chinese && <span className="db-chip">{c.chinese}</span>}
          </div>
          <p className="db-hero-line">{c.proposito}</p>
        </div>
      </div>

      {/* Attribute grid */}
      <div className="db-attr-grid" style={{ marginBottom: 24 }}>
        <AttrCard
          glyph={c.seal.glyph}
          label={s.cards.seal}
          value={c.seal.name}
          meta={c.powers.join(' · ')}
        />
        <AttrCard
          glyph="◓"
          label={s.cards.kin}
          value={c.kin}
          meta={s.cards.kinOf}
        />
        <AttrCard
          glyph={c.toneNum ?? ((c.kin - 1) % 13) + 1}
          label={s.cards.tone}
          value={c.tone.name}
          meta={c.tone.essence}
          color="var(--db-gold-2)"
        />
        <AttrCard
          glyph={el.glyph}
          label={s.cards.element}
          value={el.label}
          meta={`Tramo ${c.tramo?.n ?? '—'} · ${c.tramoColor}`}
          color={elementDot(c.element)}
        />
        {c.chinese && (
          <AttrCard glyph="龍" label={s.cards.chineseSign} value={c.chinese} />
        )}
      </div>

      {/* Readings */}
      <div className="db-stack">

        {c.proposito && (
          <div className="db-reading db-card glow">
            <div className="db-rb-eyebrow">{s.purposeEyebrow}</div>
            <h3>{s.purposeTitle}</h3>
            <p className="db-rtext db-dropcap" style={{ marginTop: 14 }}>{c.proposito}</p>
          </div>
        )}

        {c.toneMeaning && (
          <div className="db-reading db-card glow">
            <div className="db-rb-eyebrow">{s.toneLabel} {c.tone.name}</div>
            <h3>{s.toneTitle}</h3>
            <p className="db-rtext" style={{ marginTop: 14 }}>{c.toneMeaning}</p>
          </div>
        )}

        {c.lectura && (
          <div className="db-reading db-card glow">
            <div className="db-rb-eyebrow">Tramo {c.tramo?.n} · {c.tramoEnergy}</div>
            <h3>{s.readingTitle}</h3>
            <p className="db-rtext db-dropcap" style={{ marginTop: 14 }}>{c.lectura}</p>
          </div>
        )}

        {(c.gift || c.shadow) && (
          <div className="db-grid-2" style={{ gap: 16 }}>
            {c.gift && (
              <div className="db-card" style={{ padding: '22px 24px', background: 'linear-gradient(160deg,hsl(45 60% 45% / 0.10),var(--db-card))' }}>
                <div className="db-rb-eyebrow" style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'var(--db-gold-2)', marginBottom: 10 }}>
                  {s.giftLabel}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'hsl(45 30% 84%)' }}>{c.gift}</p>
              </div>
            )}
            {c.shadow && (
              <div className="db-card" style={{ padding: '22px 24px', background: 'linear-gradient(160deg,hsl(265 40% 40% / 0.08),var(--db-card))' }}>
                <div className="db-rb-eyebrow" style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'hsl(265 60% 70%)', marginBottom: 10 }}>
                  {s.shadowLabel}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'hsl(45 30% 84%)' }}>{c.shadow}</p>
              </div>
            )}
          </div>
        )}

        <div className="db-card glow" style={{ padding: 30, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '42ch' }}>
            <div className="db-serif" style={{ fontSize: 22, marginBottom: 6 }}>{s.ctaTitle}</div>
            <p className="db-muted" style={{ fontSize: 14.5, lineHeight: 1.6 }}>{s.ctaDesc}</p>
          </div>
          <button
            className="db-btn db-btn-gold"
            onClick={() => openPayment({
              type: 'personal',
              glyph: c.seal.glyph,
              desc: s.ctaReportDesc(c.archetype),
            })}
          >
            <span className="db-shine" />
            {s.ctaBtn}
            <DashboardIcon name="arrow" style={{ width: 17, height: 17 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
