import { useState, useEffect, useRef } from 'react';
import DashboardIcon from './DashboardIcon.jsx';
import { fmtSolar } from '@/lib/dashboardData.js';
import { useAuth } from '@/auth/AuthProvider.jsx';

const NAV = [
  { id: 'mi-codigo',      label: 'Mi Código Solar', icon: 'sun' },
  { id: 'dia',            label: 'Código del Día',  icon: 'calendar' },
  { id: 'compatibilidad', label: 'Compatibilidad',  icon: 'infinity' },
  { id: 'historial',      label: 'Historial',       icon: 'clock' },
  { id: 'informes',       label: 'Mis Informes',    icon: 'scroll', pro: true },
];

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
  const liveMembers = useCountUp(members);

  const sealGlyph = userCode?.seal?.glyph || '✦';
  const memberNo  = userCode ? fmtSolar(userCode.solarNumber) : '—';

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
        <div className="db-nav-label">Navegación</div>
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`db-nav-item${route === n.id ? ' active' : ''}`}
            onClick={() => { onNav(n.id); onClose(); }}
          >
            <DashboardIcon name={n.icon} className="db-ico" style={{ width: 19, height: 19 }} />
            {n.label}
            {n.pro && <span className="db-badge-pro">PRO</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="db-sb-foot">
        <div className="db-member-chip">
          <div className="db-seal-circle">{sealGlyph}</div>
          <div className="db-mtxt">
            <div className="db-mt-1">Miembro de la Red</div>
            <div className="db-mt-2">{user?.name?.split(' ')[0] || 'Anónimo'}</div>
          </div>
        </div>
        <div className="db-live-counter">
          <span className="db-live-dot" />
          <span>
            <b>{liveMembers.toLocaleString('es-AR')}</b> almas activas ahora
          </span>
        </div>
        <button
          className="db-nav-item"
          style={{ color: 'var(--db-muted-2)', fontSize: 13 }}
          onClick={logout}
        >
          <DashboardIcon name="logout" className="db-ico" style={{ width: 17, height: 17 }} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
