import { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w, h, stars;
    const shooting = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = canvas.width  = window.innerWidth  * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth  + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const n = Math.min(180, Math.floor(window.innerWidth * window.innerHeight / 9000));
      stars = Array.from({ length: n }, () => ({
        x:    Math.random() * w,
        y:    Math.random() * h,
        r:    (Math.random() * 1.3 + 0.3) * dpr,
        a:    Math.random(),
        sp:   Math.random() * 0.012 + 0.003,
        drift: Math.random() * 0.05 + 0.01,
        gold: Math.random() < 0.18,
      }));
    }

    function loop() {
      ctx.clearRect(0, 0, w, h);

      // Stars
      for (const s of stars) {
        s.a += s.sp;
        const al = 0.25 + Math.abs(Math.sin(s.a)) * 0.6;
        s.y += s.drift * dpr;
        if (s.y > h) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 7);
        ctx.fillStyle = s.gold
          ? `hsla(45,90%,65%,${al})`
          : `hsla(45,40%,92%,${al * 0.8})`;
        ctx.shadowBlur  = s.gold ? 6 * dpr : 0;
        ctx.shadowColor = 'hsla(45,90%,60%,0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Spawn shooting star rarely (≈0.4% chance per frame, max 2 at once)
      if (Math.random() < 0.004 && shooting.length < 2) {
        shooting.push({
          x:   Math.random() * w * 0.6,
          y:   Math.random() * h * 0.4,
          len: 0,
          max: Math.random() * 120 + 80,
          sp:  Math.random() * 6 + 6,
        });
      }

      // Draw shooting stars
      for (let i = shooting.length - 1; i >= 0; i--) {
        const sh = shooting[i];
        sh.x   += sh.sp * dpr;
        sh.y   += sh.sp * 0.5 * dpr;
        sh.len += sh.sp * dpr;
        const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.len, sh.y - sh.len * 0.5);
        g.addColorStop(0, 'hsla(45,95%,75%,0.9)');
        g.addColorStop(1, 'transparent');
        ctx.strokeStyle = g;
        ctx.lineWidth   = 1.4 * dpr;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.len, sh.y - sh.len * 0.5);
        ctx.stroke();
        if (sh.len > sh.max || sh.x > w) shooting.splice(i, 1);
      }

      animId = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="db-starfield" />;
}
