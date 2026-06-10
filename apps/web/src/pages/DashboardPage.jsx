import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import RitualReveal from '@/components/RitualReveal.jsx';
import { useAuth } from '@/auth/AuthProvider.jsx';
import { api } from '@/lib/api.js';
import { computeSolarCode } from '@/lib/solarcode/index.js';
import { enrichCode, getDailyCode, computeResonance } from '@/lib/dashboardData.js';
import '@/styles/dashboard.css';

import { DashCtx } from './dashboard/DashCtx.js';
import StarfieldCanvas from '@/components/dashboard/StarfieldCanvas.jsx';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.jsx';
import DashboardToasts from '@/components/dashboard/DashboardToasts.jsx';
import PaymentModal from '@/components/dashboard/PaymentModal.jsx';
import DashboardIcon from '@/components/dashboard/DashboardIcon.jsx';

import MiCodigoSection from './dashboard/MiCodigoSection.jsx';
import CodigoDelDiaSection from './dashboard/CodigoDelDiaSection.jsx';
import CompatibilidadSection from './dashboard/CompatibilidadSection.jsx';
import HistorialSection from './dashboard/HistorialSection.jsx';
import MisInformesSection from './dashboard/MisInformesSection.jsx';

const SECTIONS = {
  'mi-codigo':      MiCodigoSection,
  'dia':            CodigoDelDiaSection,
  'compatibilidad': CompatibilidadSection,
  'historial':      HistorialSection,
  'informes':       MisInformesSection,
};

const SECTION_TITLES = {
  'mi-codigo': 'Mi Código Solar', 'dia': 'Código del Día',
  'compatibilidad': 'Compatibilidad', 'historial': 'Historial', 'informes': 'Mis Informes',
};

// Birthdate capture form (shown if user has no birthdate yet)
function BirthdatePrompt({ onSaved }) {
  const { user } = useAuth();
  const [parts, setParts] = useState({ d: '', m: '', y: '' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const { d, m, y } = parts;
    if (!d || !m || !y) return;
    const birthdate = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    setSaving(true);
    try {
      await api.patch('/auth/profile', { birthdate });
      const raw = computeSolarCode({ birthdate, name: user.name || '' });
      await api.post('/readings', { input: raw.input, result: raw }).catch(() => {});
      onSaved(birthdate);
    } catch { setSaving(false); }
  };

  const days   = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const years  = Array.from({ length: new Date().getFullYear() - 1929 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="db-overlay" style={{ zIndex: 50 }}>
      <div className="db-modal" style={{ width: 'min(420px, 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 36, color: 'var(--db-gold-2)', marginBottom: 12 }}>✦</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, lineHeight: 1.1, marginBottom: 8 }}>
            Revelá tu Código Solar
          </h2>
          <p className="db-muted" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
            Ingresá tu fecha de nacimiento para calcular tu huella galáctica.
          </p>
        </div>

        <div className="db-field" style={{ marginBottom: 18 }}>
          <label>Fecha de nacimiento</label>
          <div className="db-date-row">
            <select className="db-select" value={parts.d} onChange={(e) => setParts((p) => ({ ...p, d: e.target.value }))}>
              <option value="">Día</option>
              {days.map((d) => <option key={d} value={String(d)}>{d}</option>)}
            </select>
            <select className="db-select" value={parts.m} onChange={(e) => setParts((p) => ({ ...p, m: e.target.value }))}>
              <option value="">Mes</option>
              {months.map((name, i) => <option key={i} value={String(i + 1)}>{name}</option>)}
            </select>
            <select className="db-select" value={parts.y} onChange={(e) => setParts((p) => ({ ...p, y: e.target.value }))}>
              <option value="">Año</option>
              {years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
            </select>
          </div>
        </div>

        <button
          className="db-btn db-btn-gold"
          style={{ width: '100%' }}
          disabled={!parts.d || !parts.m || !parts.y || saving}
          onClick={save}
        >
          <span className="db-shine" />
          {saving ? 'Calculando…' : 'Revelar mi Código Solar'}
          {!saving && <DashboardIcon name="spark" style={{ width: 17, height: 17 }} />}
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return <DashboardInner />;
}

function DashboardInner() {
  const { user } = useAuth();
  const mainRef = useRef(null);

  const [section, setSection]   = useState('mi-codigo');
  const [navOpen, setNavOpen]   = useState(false);
  const [members, setMembers]   = useState(12847);
  const [toasts, setToasts]     = useState([]);
  const [payment, setPayment]   = useState(null);
  const [reports, setReports]   = useState([]);
  const [history, setHistory]   = useState([]);
  const [tennisUsed, setTennisUsed] = useState(0);
  const [revealing, setRevealing] = useState(false);
  const [showBdPrompt, setShowBdPrompt] = useState(false);

  // Compute user's code
  const userCode = useMemo(() => {
    if (!user?.birthdate) return null;
    try {
      const raw = computeSolarCode({ birthdate: user.birthdate, name: user.name || '' });
      return enrichCode(raw, user.name || 'Anónimo');
    } catch { return null; }
  }, [user?.birthdate, user?.name]);

  // Daily code (memoized for the day — stable until page reload)
  const dailyCode = useMemo(() => getDailyCode(), []);

  // Resonance between user and today
  const resonanceWithDay = useMemo(
    () => (userCode ? computeResonance(userCode, dailyCode) : null),
    [userCode, dailyCode]
  );

  // Show birthdate prompt if no code yet
  useEffect(() => {
    if (!user?.birthdate) setShowBdPrompt(true);
  }, [user?.birthdate]);

  // Live member ticker
  useEffect(() => {
    api.get('/stats').then((s) => setMembers(s.userCount ?? 12847)).catch(() => {});
    const t = setInterval(
      () => setMembers((m) => m + (Math.random() < 0.6 ? 1 : 0) + (Math.random() < 0.15 ? 1 : 0)),
      3800
    );
    return () => clearInterval(t);
  }, []);

  // Load history from API
  useEffect(() => {
    api.get('/readings')
      .then((d) => {
        // Map API readings to dashboard history format
        const uCode = user?.birthdate ? (() => { try { return enrichCode(computeSolarCode({ birthdate: user.birthdate, name: user.name || '' }), user.name || ''); } catch { return null; } })() : null;
        const items = (d.readings || []).map((r) => {
          try {
            const kind = r.input?.kind === 'compat' ? 'compat' : 'personal';
            const enriched = enrichCode(r.result, r.input?.name || '—');
            const resonance = (kind === 'compat' && uCode) ? computeResonance(uCode, enriched) : null;
            return { id: r.id, kind, code: enriched, resonance, createdAt: new Date(r.createdAt).getTime() };
          } catch { return null; }
        }).filter(Boolean);
        setHistory(items);
        setTennisUsed((d.readings || []).filter(r => r.input?.kind === 'tennis').length);
      })
      .catch(() => {});
  }, [user]);

  const toast = useCallback((msg, icon) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const nav = useCallback((id) => {
    setSection(id);
    setNavOpen(false);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, []);

  const addHistory = useCallback((item) => {
    setHistory((h) => [{ ...item, id: 'h-' + Math.random().toString(36).slice(2) }, ...h]);
  }, []);

  const removeHistory = useCallback((id) => {
    setHistory((h) => h.filter((x) => x.id !== id));
    api.del(`/readings/${id}`).catch(() => {});
    toast('Lectura eliminada del historial', 'trash');
  }, [toast]);

  const incTennisUsed = useCallback(() => setTennisUsed(n => n + 1), []);

  const openPayment = useCallback((data) => {
    // For the personal report, save birth data to localStorage so ReportPage
    // can render after the Stripe redirect lands on /codigo/informe.
    if (data.type === 'personal' && user?.birthdate) {
      const input = { birthdate: user.birthdate, name: user.name || '' };
      window.localStorage.setItem('solarCodeReport', JSON.stringify(input));
    }
    setPayment(data);
  }, [user]);

  const handleBdSaved = useCallback((birthdate) => {
    setShowBdPrompt(false);
    setRevealing(true);
  }, []);

  const SectionComponent = SECTIONS[section];

  const ctx = {
    userCode, dailyCode, resonanceWithDay,
    history, addHistory, removeHistory,
    reports, setReports,
    openPayment, toast,
    setSection: nav,
    tennisUsed, incTennisUsed,
  };

  return (
    <>
      <AnimatePresence>
        {revealing && (
          <RitualReveal variant="solo" onDone={() => window.location.reload()} />
        )}
      </AnimatePresence>

      <div className="dashboard-shell">
        <StarfieldCanvas />
        <div className="db-bg-veil" />

        <DashboardSidebar
          route={section}
          onNav={nav}
          open={navOpen}
          onClose={() => setNavOpen(false)}
          members={members}
          userCode={userCode}
        />

        {navOpen && (
          <div className="db-overlay-nav" onClick={() => setNavOpen(false)} />
        )}

        <div className="db-main" ref={mainRef}>
          {/* Mobile topbar */}
          <div className="db-topbar">
            <button className="db-hamburger" onClick={() => setNavOpen(true)} aria-label="Abrir menú">
              <DashboardIcon name="menu" style={{ width: 20, height: 20 }} />
            </button>
            <div className="db-tb-mark">☉</div>
            <div className="db-tb-logo">{SECTION_TITLES[section]}</div>
          </div>

          <div className="db-main-inner">
            <DashCtx.Provider value={ctx}>
              {SectionComponent && <SectionComponent key={section} />}
            </DashCtx.Provider>
          </div>
        </div>

        {showBdPrompt && !userCode && (
          <BirthdatePrompt onSaved={handleBdSaved} />
        )}

        <PaymentModal data={payment} onClose={() => setPayment(null)} />
        <DashboardToasts items={toasts} />
      </div>
    </>
  );
}
