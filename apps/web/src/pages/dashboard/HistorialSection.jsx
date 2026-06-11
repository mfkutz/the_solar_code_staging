import { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { DashCtx } from './DashCtx.js';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { useAuth } from '@/auth/AuthProvider.jsx';
import DashboardIcon from '@/components/dashboard/DashboardIcon.jsx';
import HarmonyMeter from '@/components/dashboard/HarmonyMeter.jsx';
import { MdSportsTennis } from 'react-icons/md';
import { fmtDate } from '@/lib/dashboardData.js';
import { relationPricing } from '@/config/payments.js';

function TennisDetailOverlay({ item, onClose, s }) {
  const { adv, code, codeB, createdAt } = item;
  if (!adv) return null;
  const a = adv.a, b = adv.b;
  return createPortal(<div className="db-overlay" onClick={onClose} style={{ overflowY: 'auto', alignItems: 'flex-start' }}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()} style={{ width: 'min(560px,100%)', margin: '24px auto', position: 'relative' }}>
        <button className="db-icon-btn" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16 }} aria-label="Close">
          <DashboardIcon name="close" style={{ width: 16, height: 16 }} />
        </button>

        <div className="db-row" style={{ gap: 10, marginBottom: 18, alignItems: 'center' }}>
          <MdSportsTennis size={22} style={{ color: 'var(--db-gold-2)' }} />
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, lineHeight: 1.1 }}>
            {code?.name} {s.tennisVs} {codeB?.name}
          </h2>
        </div>

        {/* Players */}
        <div className="db-grid-2" style={{ gap: 12, marginBottom: 14 }}>
          {[a, b].map((pl, i) => (
            <div key={i} className="db-card" style={{ padding: 18, background: 'var(--db-card)' }}>
              <div className="db-spread" style={{ marginBottom: 10 }}>
                <span className="db-kind-pill">{i === 0 ? 'P1' : 'P2'}</span>
                <span className="db-muted" style={{ fontSize: 11 }}>{s.tennisSello} {pl.sealNum}</span>
              </div>
              <div className="db-row" style={{ gap: 10 }}>
                <div style={{ fontSize: 22 }}>{pl.seal.glyph}</div>
                <div>
                  <div className="db-serif" style={{ fontSize: 15 }}>{pl.name}</div>
                  <div className="db-muted" style={{ fontSize: 12, marginTop: 1 }}>{pl.seal.name} · {pl.tone.name}</div>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="db-spread" style={{ marginBottom: 5 }}>
                  <span className="db-muted" style={{ fontSize: 11, letterSpacing: '.06em' }}>{s.tennisSyncLabel}</span>
                  <span className="db-serif db-gold" style={{ fontSize: 16 }}>{pl.todayScore}%</span>
                </div>
                <div className="db-meter"><div className="db-fill" style={{ width: `${pl.todayScore}%` }} /></div>
              </div>
            </div>
          ))}
        </div>

        {/* Combined energy */}
        <div className="db-card" style={{ padding: '14px 18px', background: 'var(--db-card)', marginBottom: 10 }}>
          <div className="db-muted" style={{ fontSize: 11, letterSpacing: '.07em', marginBottom: 8 }}>{s.tennisCombined}</div>
          <div className="db-muted" style={{ fontSize: 12, marginBottom: 10 }}>
            {s.tennisSello} {adv.snA} + {s.tennisSello} {adv.snB} = {s.tennisSello} {adv.combined.num}
          </div>
          <div className="db-row" style={{ gap: 12 }}>
            <div style={{ fontSize: 26, color: 'var(--db-gold-2)' }}>{adv.combined.glyph}</div>
            <div>
              <div className="db-serif" style={{ fontSize: 16 }}>{adv.combined.name}</div>
              <div className="db-muted" style={{ fontSize: 12, marginTop: 2 }}>{adv.combined.powers.join(' · ')}</div>
            </div>
          </div>
        </div>

        {/* Final energy */}
        <div className="db-card" style={{ padding: '14px 18px', background: 'var(--db-card)' }}>
          <div className="db-muted" style={{ fontSize: 11, letterSpacing: '.07em', marginBottom: 8 }}>{s.tennisFinal}</div>
          <div className="db-muted" style={{ fontSize: 12, marginBottom: 10 }}>
            {s.tennisSello} {adv.combined.num} + {s.tennisSello} {adv.snD} = {s.tennisSello} {adv.final.num}
          </div>
          <div className="db-row" style={{ gap: 12 }}>
            <div style={{ fontSize: 26, color: 'var(--db-gold-2)' }}>{adv.final.glyph}</div>
            <div>
              <div className="db-serif" style={{ fontSize: 16 }}>{adv.final.name}</div>
              <div className="db-muted" style={{ fontSize: 12, marginTop: 2 }}>{adv.final.powers.join(' · ')}</div>
            </div>
          </div>
        </div>

        {createdAt && (
          <p className="db-muted" style={{ fontSize: 12, marginTop: 14, textAlign: 'right' }}>
            {fmtDate(createdAt)}
          </p>
        )}
      </div>
    </div>, document.querySelector('.dashboard-shell') || document.body);
}

function DetailOverlayCoupleGroup({ item, onClose, openPayment, s }) {
  if (!item) return null;
  const { user } = useAuth();
  const isCouple = item.kind === 'couple';
  const hasPurchased = isCouple ? user?.coupleReportPurchased : user?.groupReportPurchased;
  return createPortal(
    <div className="db-overlay" onClick={onClose} style={{ overflowY: 'auto', alignItems: 'flex-start' }}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()} style={{ width: 'min(540px,100%)', margin: '24px auto' }}>
        <button className="db-icon-btn" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16 }} aria-label="Close">
          <DashboardIcon name="close" style={{ width: 16, height: 16 }} />
        </button>

        <div style={{ width: 60, height: 60, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 28, color: 'var(--db-gold-2)', background: 'radial-gradient(circle,hsl(45 70% 50% / 0.2),transparent 70%)', border: '1px solid var(--db-border-2)', marginBottom: 18 }}>
          ✦
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, lineHeight: 1.2, marginBottom: 6 }}>
          {item.people?.slice(0,2).map(p => p.name).join(' ✦ ')}
          {item.people?.length > 2 ? ` +${item.people.length - 2}` : ''}
        </h2>
        <p className="db-m-desc">
          <span className="db-kind-pill">{isCouple ? s.pillCouple : s.pillGroup}</span>
          &nbsp;· {item.createdAt ? fmtDate(item.createdAt) : ''}
        </p>

        <div className="db-card" style={{ padding: 22, background: 'var(--db-card)', marginBottom: 14, textAlign: 'center' }}>
          <div className="db-muted" style={{ fontSize: 11, letterSpacing: '.08em', marginBottom: 4 }}>RESONANCIA COMBINADA</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 56, fontWeight: 700, color: 'var(--db-gold-2)', lineHeight: 1 }}>
            {item.group?.resonance ?? '—'}%
          </div>
        </div>

        <div className="db-stack" style={{ gap: 10 }}>
          {item.people?.map((p, i) => (
            <div key={i} className="db-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 20, background: 'hsl(45 70% 50%/0.1)', border: '1px solid var(--db-border-2)', flexShrink: 0 }}>
                {p.seal?.glyph || '✦'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--db-muted-2)' }}>{p.seal?.name} · {p.tone?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--db-muted-2)' }}>{p.elementDisplay?.label || p.element}</div>
              </div>
            </div>
          ))}
        </div>

        {!hasPurchased && openPayment && (
          <button
            className="db-btn db-btn-gold"
            style={{ width: '100%', marginTop: 18 }}
            onClick={() => {
              const pricing = relationPricing(item.kind, item.people?.length || 2);
              onClose();
              openPayment({ type: isCouple ? 'couple_report' : 'group_report', link: pricing.link, glyph: '✦', desc: isCouple ? s.buyCouple : s.buyGroup });
            }}
          >
            <span className="db-shine" />
            <DashboardIcon name="lock" style={{ width: 16, height: 16 }} />
            {isCouple ? s.buyCouple : s.buyGroup}
          </button>
        )}
      </div>
    </div>,
    document.querySelector('.dashboard-shell') || document.body
  );
}

function DetailOverlay({ item, onClose, openPayment, setSection, s, sb }) {
  if (!item) return null;
  const c = item.code;
  const r = item.resonance;
  const isPersonal = item.kind === 'personal';

  return createPortal(<div className="db-overlay" onClick={onClose} style={{ overflowY: 'auto', alignItems: 'flex-start' }}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()} style={{ width: 'min(540px,100%)', margin: '24px auto' }}>
        <button className="db-icon-btn" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16 }} aria-label="Close">
          <DashboardIcon name="close" style={{ width: 16, height: 16 }} />
        </button>

        <div style={{ width: 60, height: 60, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 28, color: 'var(--db-gold-2)', background: 'radial-gradient(circle,hsl(45 70% 50% / 0.2),transparent 70%)', border: '1px solid var(--db-border-2)', marginBottom: 18 }}>
          {c.seal.glyph}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 27, lineHeight: 1.1, marginBottom: 8 }}>{c.name}</h2>
        <p className="db-m-desc">{c.archetype} · {c.seal.name} · {s.detailTone} {c.tone.name} · {c.elementDisplay?.label}</p>

        {/* Solar number + resonance */}
        <div className="db-card" style={{ padding: 22, background: 'var(--db-card)', marginBottom: 14 }}>
          <div className="db-spread" style={{ marginBottom: r ? 14 : 0 }}>
            <span className="db-muted" style={{ fontSize: 13 }}>{s.solarNumber}</span>
            <span className="db-serif db-gold" style={{ fontSize: 24 }}>{c.solarStr}</span>
          </div>
          {r && <HarmonyMeter level={r.level} label={r.label} />}
          {r && <p className="db-muted" style={{ fontSize: 13.5, marginTop: 14, lineHeight: 1.55 }}>{r.text}</p>}
        </div>

        {/* Extra info for personal items */}
        {isPersonal && (
          <div className="db-stack" style={{ gap: 10, marginBottom: 14 }}>
            {c.powers?.length > 0 && (
              <div className="db-card" style={{ padding: '14px 18px', background: 'var(--db-card)' }}>
                <div className="db-muted" style={{ fontSize: 11, letterSpacing: '.07em', marginBottom: 8 }}>{s.powersLabel}</div>
                <div className="db-row" style={{ gap: 8, flexWrap: 'wrap' }}>
                  {c.powers.map((p) => (
                    <span key={p} className="db-kind-pill" style={{ fontSize: 12 }}>{p}</span>
                  ))}
                </div>
              </div>
            )}
            {(c.tone?.essence || c.tone?.action) && (
              <div className="db-card" style={{ padding: '14px 18px', background: 'var(--db-card)' }}>
                <div className="db-muted" style={{ fontSize: 11, letterSpacing: '.07em', marginBottom: 8 }}>{s.toneEssence}</div>
                <p style={{ fontSize: 13.5, color: 'var(--db-cream)' }}>
                  {c.tone.essence}{c.tone.action ? ` · ${c.tone.action}` : ''}
                </p>
              </div>
            )}
            {c.elementDisplay?.desc && (
              <div className="db-card" style={{ padding: '14px 18px', background: 'var(--db-card)' }}>
                <div className="db-muted" style={{ fontSize: 11, letterSpacing: '.07em', marginBottom: 6 }}>
                  {c.elementDisplay.glyph} {s.elementLabel}
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--db-cream)', lineHeight: 1.55 }}>{c.elementDisplay.desc}</p>
              </div>
            )}
            {(c.gift || c.shadow) && (
              <div className="db-grid-2" style={{ gap: 10 }}>
                {c.gift && (
                  <div className="db-card" style={{ padding: '14px 18px', background: 'var(--db-card)' }}>
                    <div className="db-muted" style={{ fontSize: 11, letterSpacing: '.07em', marginBottom: 6 }}>{s.giftLabel}</div>
                    <p style={{ fontSize: 13.5, color: 'var(--db-cream)', lineHeight: 1.5 }}>{c.gift}</p>
                  </div>
                )}
                {c.shadow && (
                  <div className="db-card" style={{ padding: '14px 18px', background: 'var(--db-card)' }}>
                    <div className="db-muted" style={{ fontSize: 11, letterSpacing: '.07em', marginBottom: 6 }}>{s.shadowLabel}</div>
                    <p style={{ fontSize: 13.5, color: 'var(--db-cream)', lineHeight: 1.5 }}>{c.shadow}</p>
                  </div>
                )}
              </div>
            )}
            <button className="db-btn db-btn-ghost" style={{ width: '100%' }} onClick={() => { onClose(); setSection('mi-codigo'); }}>
              {s.viewFullCode}
            </button>
          </div>
        )}

        {openPayment && !isPersonal && (
          <button
            className="db-btn db-btn-gold"
            style={{ width: '100%' }}
            onClick={() => { onClose(); openPayment({ type: 'compat', glyph: c.seal.glyph, desc: s.compatReportDesc(c.name.split(' ')[0]) }); }}
          >
            <span className="db-shine" />
            {s.compatReportBtn}
            <DashboardIcon name="arrow" style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>
    </div>, document.querySelector('.dashboard-shell') || document.body);
}

export default function HistorialSection() {
  const { history, removeHistory, setSection, openPayment, lang } = useContext(DashCtx);
  const { t } = useI18n();
  const s  = t('dashboard.historial');
  const sb = t('dashboard.sidebar');
  const [detail, setDetail] = useState(null);
  const [tennisDetail, setTennisDetail] = useState(null);
  const [groupDetail, setGroupDetail] = useState(null);

  const openItem = (item) => {
    if (item.kind === 'tennis') setTennisDetail(item);
    else if (item.kind === 'couple' || item.kind === 'group') setGroupDetail(item);
    else setDetail(item);
  };

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">{s.eyebrow}</div>
        <h1>{sb.nav['historial']}</h1>
        <p className="db-sub">{s.subtitle}</p>
      </div>

      {history.length === 0 ? (
        <div className="db-state">
          <div className="db-se-mark">
            <DashboardIcon name="clock" style={{ width: 30, height: 30 }} />
          </div>
          <h3>{s.emptyTitle}</h3>
          <p>{s.emptyDesc}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            <button
              className="db-btn db-btn-gold"
              onClick={() => setSection('compatibilidad')}
            >
              <span className="db-shine" />
              <DashboardIcon name="infinity" style={{ width: 16, height: 16 }} />
              {s.emptyBtn}
            </button>
            <button
              className="db-btn db-btn-ghost"
              onClick={() => setSection('conjuntos')}
            >
              <DashboardIcon name="users" style={{ width: 16, height: 16 }} />
              {s.emptyBtn2}
            </button>
          </div>
        </div>
      ) : (
        <div className="db-hist-list">
          {history.map((item) => (
            <div className="db-hist-item" key={item.id} onClick={() => openItem(item)}>
              <div className="db-hist-seal" style={{ display: 'grid', placeItems: 'center' }}>
                {item.kind === 'tennis'
                  ? <MdSportsTennis size={22} style={{ color: 'var(--db-gold-2)' }} />
                  : (item.kind === 'couple' || item.kind === 'group')
                    ? <span style={{ fontSize: 18 }}>✦</span>
                    : item.code?.seal?.glyph || '✦'}
              </div>
              <div className="db-hist-main">
                <div className="db-hn">
                  {item.kind === 'tennis'
                    ? <>{item.code?.name} <span style={{ color: 'var(--db-muted)', fontWeight: 400 }}>vs</span> {item.codeB?.name}</>
                    : (item.kind === 'couple' || item.kind === 'group')
                      ? <>{item.people?.slice(0,2).map(p => p.name).join(' ✦ ')}{item.people?.length > 2 ? ` +${item.people.length - 2}` : ''}</>
                      : item.code?.name || '—'}
                  <span className="db-kind-pill">
                    {item.kind === 'personal' ? s.pillPersonal
                      : item.kind === 'tennis' ? s.pillTennis
                      : item.kind === 'couple' ? s.pillCouple
                      : item.kind === 'group'  ? s.pillGroup
                      : s.pillCompat}
                  </span>
                </div>
                <div className="db-hmeta">
                  {item.kind === 'tennis'
                    ? <>{item.adv?.combined?.glyph} {item.adv?.combined?.name} · {item.createdAt ? fmtDate(item.createdAt, lang) : ''}</>
                    : (item.kind === 'couple' || item.kind === 'group')
                      ? <>{item.group?.resonance}% resonancia · {item.createdAt ? fmtDate(item.createdAt, lang) : ''}</>
                      : <>{item.code?.archetype} · {item.createdAt ? fmtDate(item.createdAt, lang) : ''}{item.resonance ? ` · ${item.resonance.level}% ${item.resonance.label}` : ''}</>}
                </div>
              </div>
              <div className="db-hist-num">
                {item.kind === 'tennis' ? item.adv?.final?.glyph || '✦'
                  : (item.kind === 'couple' || item.kind === 'group') ? `${item.group?.resonance ?? '—'}%`
                  : item.code?.solarStr || '—'}
              </div>
              <div className="db-hist-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="db-icon-btn"
                  onClick={(e) => { e.stopPropagation(); openItem(item); }}
                >
                  <DashboardIcon name="eye" style={{ width: 17, height: 17 }} />
                </button>
                {item.kind !== 'personal' && (
                  <button
                    className="db-icon-btn danger"
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
          setSection={setSection}
          s={s}
          sb={sb}
        />
      )}

      {tennisDetail && (
        <TennisDetailOverlay
          item={tennisDetail}
          onClose={() => setTennisDetail(null)}
          s={s}
        />
      )}

      {groupDetail && (
        <DetailOverlayCoupleGroup
          item={groupDetail}
          onClose={() => setGroupDetail(null)}
          openPayment={openPayment}
          s={s}
        />
      )}
    </div>
  );
}
