import DashboardIcon from './DashboardIcon.jsx';

export default function DashboardToasts({ items }) {
  return (
    <div className="db-toasts">
      {items.map((t) => (
        <div className="db-toast" key={t.id}>
          <DashboardIcon
            name={t.icon || 'spark'}
            className="db-t-ico"
            style={{ width: 18, height: 18 }}
          />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
