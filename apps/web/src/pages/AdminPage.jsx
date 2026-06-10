import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api.js';
import { useAuth } from '@/auth/AuthProvider.jsx';

const FILTERS = [
  { key: 'all',         label: 'Todos' },
  { key: 'has-report',  label: 'Con informe' },
  { key: 'no-report',   label: 'Sin informe' },
  { key: 'has-credits', label: 'Con créditos' },
  { key: 'no-credits',  label: 'Sin créditos' },
];

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, padding: '20px 24px' }}>
      <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: 'hsl(var(--foreground))', fontFamily: "'Playfair Display',serif" }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function EditUserModal({ user, onClose, onSaved }) {
  const [report, setReport] = useState(user.fullReportPurchased);
  const [credits, setCredits] = useState(String(user.tennisCredits));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const { user: updated } = await api.patch(`/admin/users/${user.id}`, {
        fullReportPurchased: report,
        tennisCredits: parseInt(credits, 10) || 0,
      });
      onSaved(updated);
    } catch (err) {
      setError(err?.message || 'Error al guardar');
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'grid', placeItems: 'center', zIndex: 50 }}
      onClick={onClose}>
      <div style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 16, padding: '28px 32px', width: 'min(420px,90vw)' }}
        onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 4 }}>Editar acceso</h3>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginBottom: 20 }}>{user.name || user.email}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={report} onChange={(e) => setReport(e.target.checked)} style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 14 }}>Informe personal comprado</span>
          </label>

          <div>
            <label style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Créditos de tenis</label>
            <input
              type="number" min="0" value={credits}
              onChange={(e) => setCredits(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', fontSize: 14, width: 100 }}
            />
          </div>
        </div>

        {error && <p style={{ fontSize: 13, color: 'hsl(var(--destructive))', marginTop: 12 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={save} disabled={saving}
            style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          <button onClick={onClose}
            style={{ padding: '10px 18px', borderRadius: 8, background: 'transparent', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))', fontSize: 14, cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { user: me, updateUser } = useAuth();
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [leads, setLeads] = useState([]);
  const [leadsTotal, setLeadsTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const readyRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    if (readyRef.current) setRefreshing(true);
    setError('');
    try {
      const userQuery = `/admin/users?filter=${filter}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`;
      const [s, u, l] = await Promise.all([
        api.get('/admin/stats'),
        api.get(userQuery),
        api.get('/admin/leads'),
      ]);
      setStats(s);
      setUsers(u.users);
      setUsersTotal(u.total);
      setLeads(l.leads);
      setLeadsTotal(l.total);
    } catch (err) {
      if (err?.status === 403) navigate('/');
      else setError(err?.message || 'Error al cargar');
    } finally {
      readyRef.current = true;
      setReady(true);
      setRefreshing(false);
    }
  }, [filter, debouncedSearch, navigate]);

  useEffect(() => { load(); }, [load]);

  const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4100';
  const downloadLeadsCSV = () => window.open(`${BASE}/admin/leads?format=csv`, '_blank');
  const downloadUsersCSV = () => {
    const q = `/admin/users/export?filter=${filter}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`;
    window.open(`${BASE}${q}`, '_blank');
  };

  const handleUserSaved = (updated) => {
    setUsers((prev) => prev.map((u) => u.id === updated.id ? { ...u, ...updated } : u));
    if (updated.id === me?.id) {
      updateUser({ tennisCredits: updated.tennisCredits, fullReportPurchased: updated.fullReportPurchased });
    }
    setEditUser(null);
  };

  const fmt = (dateStr) => new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  if (!ready) return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'hsl(var(--background))' }}>
      <p style={{ color: 'hsl(var(--muted-foreground))' }}>Cargando…</p>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'hsl(var(--background))' }}>
      <p style={{ color: 'hsl(var(--destructive))' }}>{error}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={handleUserSaved} />}

      {/* Header */}
      <div style={{ borderBottom: '1px solid hsl(var(--border))', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20 }}>☉ Admin Panel</div>
        <button onClick={() => navigate('/dashboard')} style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Volver al sitio
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16, marginBottom: 36 }}>
          <StatCard label="Usuarios totales" value={stats?.usersTotal} />
          <StatCard label="Nuevos esta semana" value={stats?.usersThisWeek} />
          <StatCard label="Leads capturados" value={stats?.leadsTotal} />
          <StatCard label="Informes vendidos" value={stats?.reportsSold} />
          <StatCard label="Consultas tenis" value={stats?.tennisReadings} />
          <StatCard label="Créditos disponibles" value={stats?.creditsAvailable} sub="en cuentas activas" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid hsl(var(--border))', paddingBottom: 0 }}>
          {[{ key: 'users', label: `Usuarios (${usersTotal})` }, { key: 'leads', label: `Leads (${leadsTotal})` }].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '10px 20px', fontSize: 14, fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', borderBottom: tab === t.key ? '2px solid hsl(var(--primary))' : '2px solid transparent', color: tab === t.key ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', marginBottom: -1 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Users tab */}
        {tab === 'users' && (
          <>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="search"
                placeholder="Buscar por nombre o email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', maxWidth: 360, padding: '8px 14px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', fontSize: 14, outline: 'none' }}
              />
              {refreshing && <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>Buscando…</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FILTERS.map((f) => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  style={{ padding: '6px 14px', fontSize: 13, borderRadius: 20, border: '1px solid hsl(var(--border))', background: filter === f.key ? 'hsl(var(--primary))' : 'transparent', color: filter === f.key ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))', cursor: 'pointer' }}>
                  {f.label}
                </button>
              ))}
              </div>
              <button onClick={downloadUsersCSV}
                style={{ padding: '6px 14px', fontSize: 13, fontWeight: 600, borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'transparent', color: 'hsl(var(--foreground))', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                ↓ Exportar CSV
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid hsl(var(--border))', textAlign: 'left' }}>
                    {['Nombre', 'Email', 'País', 'Registro', 'Informe', 'Créditos', 'Lecturas', ''].map((h) => (
                      <th key={h} style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid hsl(var(--border) / 0.5)' }}>
                      <td style={{ padding: '12px' }}>{u.name || <span style={{ color: 'hsl(var(--muted-foreground))' }}>—</span>}</td>
                      <td style={{ padding: '12px', color: 'hsl(var(--muted-foreground))' }}>{u.email}</td>
                      <td style={{ padding: '12px', color: 'hsl(var(--muted-foreground))' }}>{u.country || '—'}</td>
                      <td style={{ padding: '12px', whiteSpace: 'nowrap', color: 'hsl(var(--muted-foreground))' }}>{fmt(u.createdAt)}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{ fontSize: 16 }}>{u.fullReportPurchased ? '✅' : '—'}</span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: u.tennisCredits > 0 ? 600 : 400 }}>
                        {u.tennisCredits > 0 ? u.tennisCredits : <span style={{ color: 'hsl(var(--muted-foreground))' }}>0</span>}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>{u._count.readings}</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => setEditUser(u)}
                          style={{ padding: '5px 12px', fontSize: 12, borderRadius: 6, border: '1px solid hsl(var(--border))', background: 'transparent', color: 'hsl(var(--foreground))', cursor: 'pointer' }}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>Sin resultados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Leads tab */}
        {tab === 'leads' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button onClick={downloadLeadsCSV}
                style={{ padding: '8px 18px', fontSize: 13, fontWeight: 600, borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'transparent', color: 'hsl(var(--foreground))', cursor: 'pointer' }}>
                ↓ Exportar CSV
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid hsl(var(--border))', textAlign: 'left' }}>
                    {['Nombre', 'Email', 'País', 'Fecha'].map((h) => (
                      <th key={h} style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid hsl(var(--border) / 0.5)' }}>
                      <td style={{ padding: '12px' }}>{l.name}</td>
                      <td style={{ padding: '12px', color: 'hsl(var(--muted-foreground))' }}>{l.email}</td>
                      <td style={{ padding: '12px', color: 'hsl(var(--muted-foreground))' }}>{l.country || '—'}</td>
                      <td style={{ padding: '12px', whiteSpace: 'nowrap', color: 'hsl(var(--muted-foreground))' }}>{fmt(l.createdAt)}</td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>Sin leads aún</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
