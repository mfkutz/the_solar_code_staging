import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from './DashboardIcon.jsx';
import { useAuth } from '@/auth/AuthProvider.jsx';
import { useI18n } from '@/i18n/I18nProvider.jsx';

const NAV_IDS = ['mi-codigo', 'dia', 'compatibilidad', 'historial', 'conjuntos', 'informes', 'ajustes'];
const NAV_ICONS = { 'mi-codigo': 'sun', 'dia': 'calendar', 'compatibilidad': 'infinity', 'historial': 'clock', 'conjuntos': 'users', 'informes': 'scroll', 'ajustes': 'settings' };
const NAV_PRO   = { 'informes': true };


function useCountUp(target, dur = 1800) {
  const [v, setV] = useState(target);
  const prevRef = useRef(target);
  useEffect(() => {
    if (target === prevRef.current) { setV(target); return; }
    prevRef.current = target;
    let start;
    const from = v;
    const raf = { id: null };
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (target - from) * e));
      if (p < 1) raf.id = requestAnimationFrame(tick);
    };
    raf.id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.id);
  }, [target]);
  return v;
}

export default function DashboardSidebar({ route, onNav, open, onClose, members, userCode }) {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const liveMembers = useCountUp(members);
  const sb = t('dashboard.sidebar');

  const sealGlyph = userCode?.seal?.glyph || '✦';

  return (
    <aside className={`db-sidebar${open ? ' open' : ''}`}>
      {/* Logo */}
      <div className="db-sb-logo">
        <div className="db-sb-mark">
          <div className="db-ring" />
          <div className="db-ring db-ring-dot" />
          <div className="db-core" />
        </div>
        <div className="db-wordmark">
          <span className="db-wm-1">The</span>
          <span className="db-wm-2">Solar Code</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="db-nav">
        <div className="db-nav-label">{sb.navLabel}</div>
        {NAV_IDS.map((id) => (
          <button
            key={id}
            className={`db-nav-item${route === id ? ' active' : ''}`}
            onClick={() => { onNav(id); onClose(); }}
          >
            <DashboardIcon name={NAV_ICONS[id]} className="db-ico" style={{ width: 19, height: 19 }} />
            {sb.nav[id]}
            {NAV_PRO[id] && <span className="db-badge-pro">PRO</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="db-sb-foot">
        <div className="db-member-chip">
          <div className="db-seal-circle">{sealGlyph}</div>
          <div className="db-mtxt">
            <div className="db-mt-1">{sb.memberChip}</div>
            <div className="db-mt-2">{user?.name?.split(' ')[0] || (lang === 'es' ? 'Anónimo' : 'Anonymous')}</div>
          </div>
        </div>
        <div className="db-live-counter">
          <span className="db-live-dot" />
          <span><b>{sb.activeSouls(liveMembers)}</b></span>
        </div>
        <div className="db-nav-item" style={{ color: 'var(--db-muted-2)', fontSize: 13, cursor: 'default' }}>
          <DashboardIcon name="globe" className="db-ico" style={{ width: 17, height: 17 }} />
          <span style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {['es', 'en'].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                style={{
                  padding: '2px 7px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: lang === code ? 'var(--db-gold-2)' : 'transparent',
                  color: lang === code ? 'var(--db-bg)' : 'var(--db-muted-2)',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </span>
        </div>
        {user?.isAdmin && (
          <button
            className="db-nav-item"
            style={{ color: 'var(--db-gold-2)', fontSize: 13 }}
            onClick={() => navigate('/admin')}
          >
            <DashboardIcon name="settings" className="db-ico" style={{ width: 17, height: 17 }} />
            Panel Admin ✦
          </button>
        )}
        <button
          className="db-nav-item"
          style={{ color: 'var(--db-muted-2)', fontSize: 13 }}
          onClick={logout}
        >
          <DashboardIcon name="logout" className="db-ico" style={{ width: 17, height: 17 }} />
          {sb.logout}
        </button>
      </div>
    </aside>
  );
}
