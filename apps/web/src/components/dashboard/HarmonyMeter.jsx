import { useState, useEffect } from 'react';

export default function HarmonyMeter({ level, label }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(level), 120);
    return () => clearTimeout(t);
  }, [level]);
  return (
    <div className="db-harmony">
      <div className="db-h-top">
        <span className="db-h-val">{level}%</span>
        <span className="db-h-label">{label}</span>
      </div>
      <div className="db-meter">
        <div className="db-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
