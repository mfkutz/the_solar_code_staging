import DashboardIcon from './DashboardIcon.jsx';
import { PAYMENT_LINKS, RELATIONAL_PRODUCTS, PRICES } from '@/config/payments.js';
import { useAuth } from '@/auth/AuthProvider.jsx';

const REPORT_META = {
  personal: {
    title: 'Informe Solar Completo',
    price: '€22',
    priceNote: 'pago único · acceso de por vida',
    perks: [
      'Lectura solar extendida de 12 páginas',
      'Mapa de tus 4 elementos y tono galáctico',
      'Guía de propósito y ciclos de vida',
      'Audio meditación de tu sello',
    ],
    btnLabel: 'Desbloquear ahora',
    link: PAYMENT_LINKS.fullReport,
  },
  compat: {
    title: 'Informe de Compatibilidad',
    price: '€44',
    priceNote: 'pago único · acceso de por vida',
    perks: [
      'Análisis de resonancia profundo',
      'Mapa de elementos compartidos',
      'Áreas de armonía y de aprendizaje',
      'Ritual de vínculo para ambos',
    ],
    btnLabel: 'Desbloquear ahora',
    link: RELATIONAL_PRODUCTS.couple.link,
  },
  couple_report: {
    title: 'Informe de Pareja',
    price: '€44',
    priceNote: 'pago único · acceso de por vida',
    perks: [
      'Análisis de resonancia profundo',
      'Mapa de elementos compartidos',
      'Áreas de armonía y de aprendizaje',
      'Ritual de vínculo para ambos',
    ],
    btnLabel: 'Desbloquear informe',
    link: PAYMENT_LINKS.coupleReport,
  },
  group_report: {
    title: 'Informe Grupal',
    price: '€66',
    priceNote: 'pago único · acceso de por vida',
    perks: [
      'Análisis del campo energético grupal',
      'Vínculos entre cada par de personas',
      'Elemento dominante del grupo',
      'Síntesis y guía de armonía',
    ],
    btnLabel: 'Desbloquear informe',
    link: PAYMENT_LINKS.groupReport,
  },
  year: {
    title: 'Tránsito Anual',
    price: '€24',
    priceNote: 'pago único · acceso de por vida',
    perks: [
      'Tránsito mes a mes del año solar',
      'Días de poder personalizados',
      'Alertas de portales galácticos',
    ],
    btnLabel: 'Desbloquear ahora',
    link: null,
  },
};

// Tennis credits modal — rendered separately because it has a different structure.
function TennisModal({ data, onClose, user }) {
  const credits = user?.tennisCredits ?? 0;
  const link = PAYMENT_LINKS.tennisCredits;

  const handleBuy = () => {
    if (link) {
      window.location.href = user?.id ? `${link}?client_reference_id=${user.id}` : link;
    } else {
      onClose();
    }
  };

  return (
    <div className="db-overlay" onClick={onClose}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()}>
        <button className="db-icon-btn" onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16 }} aria-label="Cerrar">
          <DashboardIcon name="close" style={{ width: 16, height: 16 }} />
        </button>

        <div style={{ width: 60, height: 60, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 28, color: 'var(--db-gold-2)', background: 'radial-gradient(circle,hsl(45 70% 50% / 0.2),transparent 70%)', border: '1px solid var(--db-border-2)', marginBottom: 18 }}>
          🎾
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 27, lineHeight: 1.1, marginBottom: 8 }}>
          Créditos Tenis H2H
        </h2>
        <p className="db-m-desc">
          Cada consulta de duelo energético consume 1 crédito. Comprá un paquete y usalos cuando quieras, sin vencimiento.
        </p>

        {credits > 0 && (
          <div style={{ background: 'hsl(45 70% 50% / 0.1)', border: '1px solid var(--db-border-2)', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: 'var(--db-gold-2)', textAlign: 'center' }}>
            Tenés <strong>{credits}</strong> crédito{credits !== 1 ? 's' : ''} disponible{credits !== 1 ? 's' : ''}
          </div>
        )}

        {/* How it works */}
        <div style={{ background: 'hsl(var(--db-card, 0 0% 12%) / 0.5)', borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontSize: 13 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--db-muted-2)' }}>¿Cómo funciona?</div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              '1 crédito = 1 consulta Tenis H2H',
              'Primera consulta siempre gratis',
              'Los créditos no vencen',
              'Cada duelo queda guardado en tu historial',
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DashboardIcon name="check" style={{ width: 15, height: 15, color: 'var(--db-gold-2)', flexShrink: 0 }} />
                <span style={{ color: 'var(--db-muted-1)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="db-price-row" style={{ marginBottom: 20 }}>
          <span className="db-price">—</span>
          <span className="db-per">precio por paquete · próximamente</span>
        </div>

        <button className="db-btn db-btn-gold" style={{ width: '100%' }} onClick={handleBuy}>
          <span className="db-shine" />
          <DashboardIcon name="lock" style={{ width: 17, height: 17 }} />
          Comprar créditos
        </button>
        <button className="db-btn-quiet" style={{ width: '100%', marginTop: 10 }} onClick={onClose}>
          Quizás más tarde
        </button>
      </div>
    </div>
  );
}

export default function PaymentModal({ data, onClose }) {
  const { user } = useAuth();
  if (!data) return null;

  if (data.type === 'tennis') {
    return <TennisModal data={data} onClose={onClose} user={user} />;
  }

  const meta = REPORT_META[data.type] || REPORT_META.personal;

  const handleBuy = () => {
    const link = data.link || meta.link;
    if (link) {
      const url = user?.id ? `${link}?client_reference_id=${user.id}` : link;
      window.location.href = url;
    } else {
      onClose();
    }
  };

  return (
    <div className="db-overlay" onClick={onClose}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="db-icon-btn"
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16 }}
          aria-label="Cerrar"
        >
          <DashboardIcon name="close" style={{ width: 16, height: 16 }} />
        </button>

        <div style={{ width: 60, height: 60, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 28, color: 'var(--db-gold-2)', background: 'radial-gradient(circle,hsl(45 70% 50% / 0.2),transparent 70%)', border: '1px solid var(--db-border-2)', marginBottom: 18 }}>
          {data.glyph || '✦'}
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 27, lineHeight: 1.1, marginBottom: 8 }}>
          {meta.title}
        </h2>
        <p className="db-m-desc">
          {data.desc || 'Desbloqueá la lectura completa y accedé a tu informe en PDF más el audio ritual.'}
        </p>

        <div className="db-price-row">
          <span className="db-price">{meta.price}</span>
          <span className="db-per">{meta.priceNote}</span>
        </div>

        <ul className="db-perks">
          {meta.perks.map((p, i) => (
            <li key={i}>
              <DashboardIcon name="check" style={{ width: 17, height: 17, color: 'var(--db-gold-2)', flexShrink: 0 }} />
              {p}
            </li>
          ))}
        </ul>

        <button className="db-btn db-btn-gold" style={{ width: '100%' }} onClick={handleBuy}>
          <span className="db-shine" />
          <DashboardIcon name="lock" style={{ width: 17, height: 17 }} />
          {meta.btnLabel}
        </button>
        <button
          className="db-btn-quiet"
          style={{ width: '100%', marginTop: 10 }}
          onClick={onClose}
        >
          Quizás más tarde
        </button>
      </div>
    </div>
  );
}
