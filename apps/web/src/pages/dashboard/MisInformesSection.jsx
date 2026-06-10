import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashCtx } from './DashCtx.js';
import DashboardIcon from '@/components/dashboard/DashboardIcon.jsx';
import { useAuth } from '@/auth/AuthProvider.jsx';

export default function MisInformesSection() {
  const { userCode, openPayment } = useContext(DashCtx);
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasSolarReport = user?.fullReportPurchased === true;

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">Tu biblioteca PRO</div>
        <h1>
          Mis Informes{' '}
          <span className="db-badge-pro" style={{ marginLeft: 8, verticalAlign: 'middle', fontSize: 11 }}>PRO</span>
        </h1>
        <p className="db-sub">Tus lecturas completas, listas para leer y descargar cuando quieras.</p>
      </div>

      {!hasSolarReport ? (
        <div className="db-state">
          <div className="db-se-mark">
            <DashboardIcon name="scroll" style={{ width: 30, height: 30 }} />
          </div>
          <h3>Aún no tenés informes</h3>
          <p>Desbloqueá tu primera lectura completa y empezá a construir tu biblioteca solar.</p>
          <button
            className="db-btn db-btn-gold"
            style={{ marginTop: 8 }}
            onClick={() => openPayment({
              type: 'personal',
              glyph: userCode?.seal?.glyph || '☉',
              desc: 'Desbloqueá tu primera lectura solar completa.',
            })}
          >
            <span className="db-shine" />
            <DashboardIcon name="lock" style={{ width: 16, height: 16 }} />
            Desbloquear mi primera lectura
          </button>
        </div>
      ) : (
        <div className="db-reports-grid">
          {/* Informe Solar Personal */}
          <div className="db-report-card glow">
            <div className="db-rc-seal">{userCode?.seal?.glyph || '☉'}</div>
            <div className="db-rc-type">Lectura Personal</div>
            <div className="db-rc-title">
              Informe Solar Completo
              {userCode?.signature && (
                <span style={{ display: 'block', fontSize: 13.5, fontWeight: 400, color: 'var(--db-muted)', marginTop: 4 }}>
                  {userCode.signature}
                </span>
              )}
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="db-btn db-btn-gold"
                onClick={() => navigate('/codigo/informe')}
              >
                <span className="db-shine" />
                <DashboardIcon name="eye" style={{ width: 16, height: 16 }} />
                Ver informe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
