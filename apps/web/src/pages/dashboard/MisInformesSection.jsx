import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashCtx } from './DashCtx.js';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import DashboardIcon from '@/components/dashboard/DashboardIcon.jsx';
import { useAuth } from '@/auth/AuthProvider.jsx';

export default function MisInformesSection() {
  const { userCode, openPayment, setSection } = useContext(DashCtx);
  const { user } = useAuth();
  const { t } = useI18n();
  const s  = t('dashboard.informes');
  const sb = t('dashboard.sidebar');
  const navigate = useNavigate();

  const hasSolarReport  = user?.fullReportPurchased   === true;
  const hasCoupleReport = user?.coupleReportPurchased === true;
  const hasGroupReport  = user?.groupReportPurchased  === true;
  const hasAny = hasSolarReport || hasCoupleReport || hasGroupReport;

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">{s.eyebrow}</div>
        <h1>
          {sb.nav['informes']}{' '}
          <span className="db-badge-pro" style={{ marginLeft: 8, verticalAlign: 'middle', fontSize: 11 }}>PRO</span>
        </h1>
        <p className="db-sub">{s.subtitle}</p>
      </div>

      {!hasAny ? (
        <div className="db-state">
          <div className="db-se-mark">
            <DashboardIcon name="scroll" style={{ width: 30, height: 30 }} />
          </div>
          <h3>{s.emptyTitle}</h3>
          <p>{s.emptyDesc}</p>
          <button
            className="db-btn db-btn-gold"
            style={{ marginTop: 8 }}
            onClick={() => openPayment({
              type: 'personal',
              glyph: userCode?.seal?.glyph || '☉',
              desc: s.emptyBtnDesc,
            })}
          >
            <span className="db-shine" />
            <DashboardIcon name="lock" style={{ width: 16, height: 16 }} />
            {s.emptyBtn}
          </button>
        </div>
      ) : (
        <div className="db-reports-grid">
          {hasSolarReport && (
            <div className="db-report-card glow">
              <div className="db-rc-seal">{userCode?.seal?.glyph || '☉'}</div>
              <div className="db-rc-type">{s.personalType}</div>
              <div className="db-rc-title">
                {s.reportTitle}
                {userCode?.signature && (
                  <span style={{ display: 'block', fontSize: 13.5, fontWeight: 400, color: 'var(--db-muted)', marginTop: 4 }}>
                    {userCode.signature}
                  </span>
                )}
              </div>
              <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="db-btn db-btn-gold" onClick={() => navigate('/code/report')}>
                  <span className="db-shine" />
                  <DashboardIcon name="eye" style={{ width: 16, height: 16 }} />
                  {s.viewBtn}
                </button>
              </div>
            </div>
          )}

          {hasCoupleReport && (
            <div className="db-report-card">
              <div className="db-rc-seal">♾</div>
              <div className="db-rc-type">{s.coupleType}</div>
              <div className="db-rc-title">{s.coupleReportTitle}</div>
              <div style={{ marginTop: 18 }}>
                <button className="db-btn db-btn-gold" onClick={() => setSection('conjuntos')}>
                  <span className="db-shine" />
                  <DashboardIcon name="eye" style={{ width: 16, height: 16 }} />
                  {s.viewBtn}
                </button>
              </div>
            </div>
          )}

          {hasGroupReport && (
            <div className="db-report-card">
              <div className="db-rc-seal">✦</div>
              <div className="db-rc-type">{s.groupType}</div>
              <div className="db-rc-title">{s.groupReportTitle}</div>
              <div style={{ marginTop: 18 }}>
                <button className="db-btn db-btn-gold" onClick={() => setSection('conjuntos')}>
                  <span className="db-shine" />
                  <DashboardIcon name="eye" style={{ width: 16, height: 16 }} />
                  {s.viewBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
