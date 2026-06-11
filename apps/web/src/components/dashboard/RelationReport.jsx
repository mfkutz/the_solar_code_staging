import { createPortal } from 'react-dom';
import DashboardIcon from './DashboardIcon.jsx';
import { relationContent } from '@/content/relations.js';

const ELEMENT_DISPLAY = { fire: 'Fuego', water: 'Agua', earth: 'Tierra', air: 'Aire', ether: 'Éter' };
const elementColor = (el) =>
  ({ fire: 'var(--db-red)', air: 'hsl(200 60% 70%)', water: 'var(--db-blue)', earth: 'var(--db-gold)', ether: 'var(--db-gold-2)' }[el] || 'var(--db-gold-2)');

export function RelationReportContent({ result, lang, s }) {
  const rc = relationContent[lang] || relationContent.es;
  const fill = (tpl, vars) => tpl?.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') ?? '';

  return (
    <div className="db-stack" style={{ gap: 16, marginTop: 8 }}>
      {/* Bonds */}
      <div className="db-card" style={{ padding: '20px 22px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: 'var(--db-gold-2)', marginBottom: 14 }}>
          {s.bondsSectionTitle}
        </div>
        {(result.pairs || []).map((pair, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--db-border)', fontSize: 13, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, color: 'var(--db-gold)', marginBottom: 4 }}>
              {pair.nameA || `P${(pair.i ?? i) + 1}`} ✦ {pair.nameB || `P${(pair.j ?? i + 1) + 1}`}
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
          {fill(rc.groupIntro || '', { size: result.group?.size })}
        </div>
        {result.group?.dominantElement && (
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
          {(result.group?.resonance ?? 0) >= 82 ? rc.synthesis?.high : rc.synthesis?.balanced}
        </div>
      </div>

      <button className="db-btn db-btn-ghost" style={{ width: '100%' }} onClick={() => window.print()}>
        <DashboardIcon name="scroll" style={{ width: 16, height: 16 }} />
        {s.printBtn}
      </button>
    </div>
  );
}

export function RelationReportOverlay({ item, onClose, s, lang }) {
  if (!item) return null;
  const isCouple = item.kind === 'couple';
  const names = (item.people || []).slice(0, 2).map(p => p.name).join(' ✦ ');
  const extra = item.people?.length > 2 ? ` +${item.people.length - 2}` : '';

  return createPortal(
    <div className="db-overlay" onClick={onClose} style={{ overflowY: 'auto', alignItems: 'flex-start' }}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()} style={{ width: 'min(580px,100%)', margin: '24px auto' }}>
        <button className="db-icon-btn" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16 }} aria-label="Close">
          <DashboardIcon name="close" style={{ width: 16, height: 16 }} />
        </button>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--db-muted-2)', marginBottom: 6 }}>
            {isCouple ? s.coupleType : s.groupType}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, lineHeight: 1.2, marginBottom: 4 }}>
            {names}{extra}
          </h2>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: 'var(--db-gold-2)' }}>
            {item.group?.resonance}% <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--db-muted-2)' }}>resonancia</span>
          </div>
        </div>

        <RelationReportContent
          result={{ people: item.people, group: item.group, pairs: item.pairs }}
          lang={lang}
          s={s}
        />
      </div>
    </div>,
    document.querySelector('.dashboard-shell') || document.body
  );
}
