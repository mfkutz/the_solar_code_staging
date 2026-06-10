import { useState, useEffect, useRef } from 'react';
import { fmtSolar } from '@/lib/dashboardData.js';

function useCountUp(target, dur = 1600) {
  const [v, setV] = useState(0);
  const rafRef = useRef();
  useEffect(() => {
    if (target == null) return;
    let start;
    cancelAnimationFrame(rafRef.current);
    const fallback = setTimeout(() => setV(target), dur + 400);
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * e));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else clearTimeout(fallback);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(fallback); };
  }, [target, dur]);
  return v;
}

const ORBIT_OFFSETS = [
  { x: 132, y: -40, opacity: 0.6, dur: 30 },
  { x: -110, y: 70, opacity: 0.73, dur: 44, reverse: true },
  { x: 96, y: 118, opacity: 0.86, dur: 58 },
];

export default function Mandala({ number, sub, label = 'Número Solar' }) {
  const display = useCountUp(number);
  return (
    <div className="db-mandala">
      <div className="db-halo" />
      <div className="db-ring db-r1" />
      <div className="db-ring db-r2" />
      <div className="db-ring db-r3" />
      <div className="db-ring db-r4" />
      {ORBIT_OFFSETS.map((o, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', inset: 0,
            animation: `db-spin ${o.dur}s linear infinite ${o.reverse ? 'reverse' : ''}`,
          }}
        >
          <div
            className="db-orbit-dot"
            style={{
              transform: `translate(${o.x}px, ${o.y}px)`,
              opacity: o.opacity,
            }}
          />
        </div>
      ))}
      <div className="db-num-wrap">
        <div className="db-num-lab">{label}</div>
        <div className="db-solar-number">{fmtSolar(display)}</div>
        {sub && <div className="db-num-sub">{sub}</div>}
      </div>
    </div>
  );
}
