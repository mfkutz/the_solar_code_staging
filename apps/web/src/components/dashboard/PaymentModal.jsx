import DashboardIcon from './DashboardIcon.jsx';
import { PAYMENT_LINKS, RELATIONAL_PRODUCTS, REPORT_STORAGE_KEY } from '@/config/payments.js';

const REPORT_META = {
  personal: {
    title: 'Informe Solar Completo',
    price: '€22',
    perks: [
      'Lectura solar extendida de 12 páginas',
      'Mapa de tus 4 elementos y tono galáctico',
      'Guía de propósito y ciclos de vida',
      'Audio meditación de tu sello',
    ],
    link: PAYMENT_LINKS.fullReport,
  },
  compat: {
    title: 'Informe de Compatibilidad',
    price: '€44',
    perks: [
      'Análisis de resonancia profundo',
      'Mapa de elementos compartidos',
      'Áreas de armonía y de aprendizaje',
      'Ritual de vínculo para ambos',
    ],
    link: RELATIONAL_PRODUCTS.pareja.link,
  },
  year: {
    title: 'Tránsito Anual',
    price: '€24',
    perks: [
      'Tránsito mes a mes del año solar',
      'Días de poder personalizados',
      'Alertas de portales galácticos',
    ],
    link: null,
  },
};

export default function PaymentModal({ data, onClose }) {
  if (!data) return null;
  const meta = REPORT_META[data.type] || REPORT_META.personal;

  const handleBuy = () => {
    if (meta.link) {
      window.location.href = meta.link;
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
          <span className="db-per">pago único · acceso de por vida</span>
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
          Desbloquear ahora
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
