import { useContext } from 'react';
import { DashCtx } from './DashCtx.js';
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

  if (!userCode) {
    return (
      <div className="db-section">
        <div className="db-page-head">
          <div className="db-eyebrow">Tu firma galáctica</div>
          <h1>Mi Código Solar</h1>
        </div>
        <div className="db-state">
          <div className="db-se-mark">✦</div>
          <h3>Código no calculado</h3>
          <p>Guardá tu fecha de nacimiento en el perfil para revelar tu sello, tono y elemento solar.</p>
        </div>
      </div>
    );
  }

  const c = userCode;
  const el = c.elementDisplay;

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">Tu firma galáctica</div>
        <h1>Mi Código Solar</h1>
        <p className="db-sub">
          Tu código fue calculado y guardado en la Red Solar. Esta es la huella energética con la que llegaste al mundo.
        </p>
      </div>

      {/* Hero */}
      <div className="db-solar-hero db-card glow" style={{ marginBottom: 24 }}>
        <Mandala number={c.solarNumber} sub={`Kin ${c.kin} · Tono ${c.tone.name}`} />
        <div className="db-hero-side">
          <div className="db-arch-eyebrow">
            {c.seal.glyph} Sello {c.seal.name}
          </div>
          <h2 className="db-archetype">{c.signature || `${c.seal.name} ${c.tone.name} ${c.color}`}</h2>
          <p className="db-arch-sub" style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 16, color: 'var(--db-muted)', marginBottom: 8, marginTop: 2 }}>{c.archetype}</p>
          <div className="db-hero-tags">
            <span className="db-tag-el">
              <span style={{ background: elementDot(c.element), width: 7, height: 7, display: 'inline-block', borderRadius: '50%', marginRight: 6 }} />
              {el.label} {c.tramoColor && `· ${c.tramoColor}`}
            </span>
            <span className="db-chip">Tono {c.tone.name}</span>
            {c.chinese && <span className="db-chip">{c.chinese}</span>}
          </div>
          <p className="db-hero-line">{c.proposito}</p>
        </div>
      </div>

      {/* Attribute grid */}
      <div className="db-attr-grid" style={{ marginBottom: 24 }}>
        <AttrCard
          glyph={c.seal.glyph}
          label="Sello Solar"
          value={c.seal.name}
          meta={c.powers.join(' · ')}
        />
        <AttrCard
          glyph="◓"
          label="Kin Galáctico"
          value={c.kin}
          meta="de 260"
        />
        <AttrCard
          glyph={c.toneNum ?? ((c.kin - 1) % 13) + 1}
          label="Tono Galáctico"
          value={c.tone.name}
          meta={c.tone.essence}
          color="var(--db-gold-2)"
        />
        <AttrCard
          glyph={el.glyph}
          label="Elemento"
          value={el.label}
          meta={`Tramo ${c.tramo?.n ?? '—'} · ${c.tramoColor}`}
          color={elementDot(c.element)}
        />
        {c.chinese && (
          <AttrCard glyph="龍" label="Signo Chino" value={c.chinese} />
        )}
      </div>

      {/* Readings */}
      <div className="db-stack">

        {/* Propósito del sello */}
        {c.proposito && (
          <div className="db-reading db-card glow">
            <div className="db-rb-eyebrow">El para qué de tu existencia</div>
            <h3>Propósito Solar</h3>
            <p className="db-rtext db-dropcap" style={{ marginTop: 14 }}>{c.proposito}</p>
          </div>
        )}

        {/* Tono galáctico */}
        {c.toneMeaning && (
          <div className="db-reading db-card glow">
            <div className="db-rb-eyebrow">Tono {c.tone.name}</div>
            <h3>Tu Ritmo Galáctico</h3>
            <p className="db-rtext" style={{ marginTop: 14 }}>{c.toneMeaning}</p>
          </div>
        )}

        {/* Lectura del tramo (del libro de Pablo) */}
        {c.lectura && (
          <div className="db-reading db-card glow">
            <div className="db-rb-eyebrow">
              Tramo {c.tramo?.n} · {c.tramoEnergy}
            </div>
            <h3>Lectura Solar</h3>
            <p className="db-rtext db-dropcap" style={{ marginTop: 14 }}>{c.lectura}</p>
          </div>
        )}

        {/* Don y desafío */}
        {(c.gift || c.shadow) && (
          <div className="db-grid-2" style={{ gap: 16 }}>
            {c.gift && (
              <div className="db-card" style={{ padding: '22px 24px', background: 'linear-gradient(160deg,hsl(45 60% 45% / 0.10),var(--db-card))' }}>
                <div className="db-rb-eyebrow" style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'var(--db-gold-2)', marginBottom: 10 }}>
                  Tu don
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'hsl(45 30% 84%)' }}>{c.gift}</p>
              </div>
            )}
            {c.shadow && (
              <div className="db-card" style={{ padding: '22px 24px', background: 'linear-gradient(160deg,hsl(265 40% 40% / 0.08),var(--db-card))' }}>
                <div className="db-rb-eyebrow" style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'hsl(265 60% 70%)', marginBottom: 10 }}>
                  Tu desafío
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'hsl(45 30% 84%)' }}>{c.shadow}</p>
              </div>
            )}
          </div>
        )}

        {/* CTA — informe completo */}
        <div className="db-card glow" style={{ padding: 30, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '42ch' }}>
            <div className="db-serif" style={{ fontSize: 22, marginBottom: 6 }}>Tu informe completo en PDF</div>
            <p className="db-muted" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
              Propósito y arquetipo de tu sello, don y desafío, tono galáctico, lectura de tu tramo, prácticas de activación por elemento y hábitos diarios — descargable como PDF.
            </p>
          </div>
          <button
            className="db-btn db-btn-gold"
            onClick={() => openPayment({
              type: 'personal',
              glyph: c.seal.glyph,
              desc: `Tu informe solar completo del arquetipo ${c.archetype}.`,
            })}
          >
            <span className="db-shine" />
            Ver Informe Completo
            <DashboardIcon name="arrow" style={{ width: 17, height: 17 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
