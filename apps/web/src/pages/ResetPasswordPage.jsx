import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api.js';
import PasswordInput from '@/components/PasswordInput.jsx';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
    setStatus('loading');
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus('done');
    } catch (err) {
      setError(err?.message || 'Algo salió mal. Probá de nuevo.');
      setStatus('idle');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'hsl(var(--background))', padding: '24px 16px' }}>
      <div style={{ width: 'min(420px, 100%)', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 16, padding: '36px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>☉</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: 'hsl(var(--foreground))', marginBottom: 6 }}>
            {status === 'done' ? '¡Contraseña actualizada!' : 'Nueva contraseña'}
          </h1>
          {status !== 'done' && (
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>
              Ingresá tu nueva contraseña.
            </p>
          )}
        </div>

        {!token && (
          <p style={{ color: 'hsl(var(--destructive))', fontSize: 14, textAlign: 'center' }}>
            Enlace inválido. Pedí un nuevo enlace de recuperación.
          </p>
        )}

        {token && status !== 'done' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))' }}>Nueva contraseña</label>
              <PasswordInput
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Al menos 8 caracteres"
                style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', fontSize: 14, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))' }}>Confirmá la contraseña</label>
              <PasswordInput
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repetí tu nueva contraseña"
                style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', fontSize: 14, outline: 'none' }}
              />
            </div>
            {error && <p style={{ fontSize: 13, color: 'hsl(var(--destructive))' }}>{error}</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ padding: '12px', borderRadius: 8, background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}
            >
              {status === 'loading' ? 'Guardando…' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}

        {status === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', marginBottom: 20 }}>
              Tu contraseña fue actualizada. Todas tus sesiones fueron cerradas por seguridad.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '12px 28px', borderRadius: 8, background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
