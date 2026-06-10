import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider.jsx';

// A full-screen "ritual" played while a reading is revealed: paced calm on
// purpose (this audience wants to linger), always skippable (tap anywhere), and
// respects reduced motion. Purely decorative — the result is already computed.
//
// `variant` picks the centered scene:
//   'solo'   → a single sun igniting (individual report)
//   'couple' → two souls resonating (couple report)
const RING_COUNT = 4;
const SPARKLES = 12;
const ORB_GLOW = '0 0 35px rgba(234, 179, 8, 0.7)';

// --- Scene: a single sun, with rings and radiating sparkles ---
function SoloScene() {
  return (
    <>
      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <motion.span
          key={`ring-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25"
          initial={{ width: 40, height: 40, opacity: 0 }}
          animate={{ width: 720, height: 720, opacity: [0.45, 0] }}
          transition={{ duration: 4, delay: i * 1, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      {Array.from({ length: SPARKLES }).map((_, i) => {
        const angle = (i / SPARKLES) * Math.PI * 2;
        return (
          <motion.span
            key={`spark-${i}`}
            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-primary"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: Math.cos(angle) * 170, y: Math.sin(angle) * 170, opacity: [0, 1, 0] }}
            transition={{ duration: 3.2, delay: 0.5 + (i % 4) * 0.3, repeat: Infinity, ease: 'easeOut' }}
          />
        );
      })}
      <motion.div
        initial={{ scale: 0.35, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="relative"
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.06, 1] }}
          transition={{
            rotate: { duration: 16, repeat: Infinity, ease: 'linear' },
            scale: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Sun className="w-24 h-24 text-primary text-glow" />
        </motion.div>
      </motion.div>
    </>
  );
}

// --- Scene: two souls breathing toward each other, a resonance wave between ---
function CoupleScene() {
  return (
    <div className="relative" style={{ width: 360, height: 220 }}>
      {/* Resonance rings rippling out from the meeting point */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={`mid-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30"
          initial={{ width: 24, height: 24, opacity: 0.5 }}
          animate={{ width: 260, height: 260, opacity: 0 }}
          transition={{ duration: 3, delay: i * 0.8, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Left soul — drifts gently inward and back */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ x: -150, opacity: 0 }}
        animate={{ x: [-150, -110, -150], opacity: 1 }}
        transition={{
          x: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 1.4, ease: 'easeOut' },
        }}
      >
        <motion.div
          className="w-12 h-12 rounded-full bg-primary"
          style={{ boxShadow: ORB_GLOW }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Right soul */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ x: 150, opacity: 0 }}
        animate={{ x: [150, 110, 150], opacity: 1 }}
        transition={{
          x: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 1.4, ease: 'easeOut' },
        }}
      >
        <motion.div
          className="w-12 h-12 rounded-full bg-primary"
          style={{ boxShadow: ORB_GLOW }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3.5, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* The spark where the two frequencies meet */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-3 h-3 rounded-full bg-primary"
          style={{ boxShadow: '0 0 25px rgba(234, 179, 8, 0.9)' }}
          animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

// --- Scene: a constellation of souls connected into one pulsing field ---
function GroupScene() {
  const C = 150;
  const R = 95;
  const N = 6;
  const nodes = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    return { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R };
  });

  return (
    <div className="relative" style={{ width: 300, height: 300 }}>
      {/* Resonance rings rippling out from the center (don't rotate) */}
      {[0, 1].map((i) => (
        <motion.span
          key={`gring-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25"
          initial={{ width: 40, height: 40, opacity: 0.4 }}
          animate={{ width: 320, height: 320, opacity: 0 }}
          transition={{ duration: 3.6, delay: i * 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* The constellation slowly rotates as a whole */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{
          opacity: { duration: 1.6, ease: 'easeOut' },
          scale: { duration: 1.6, ease: 'easeOut' },
          rotate: { duration: 44, repeat: Infinity, ease: 'linear' },
        }}
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full text-primary"
          style={{ filter: 'drop-shadow(0 0 6px rgba(234, 179, 8, 0.55))' }}
        >
          {/* Lines from each soul to the center */}
          {nodes.map((n, i) => (
            <line key={`spoke-${i}`} x1={C} y1={C} x2={n.x} y2={n.y} stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
          ))}
          {/* Lines around the ring (soul to soul) */}
          {nodes.map((n, i) => {
            const m = nodes[(i + 1) % N];
            return <line key={`edge-${i}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />;
          })}
          {/* The souls */}
          {nodes.map((n, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={n.x}
              cy={n.y}
              fill="currentColor"
              initial={{ r: 5, opacity: 0.7 }}
              animate={{ r: [5, 8, 5], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          {/* The shared center */}
          <motion.circle
            cx={C}
            cy={C}
            fill="currentColor"
            initial={{ r: 7, opacity: 0.85 }}
            animate={{ r: [7, 11, 7], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

const PHRASE_KEY = { couple: 'ritual.phrasesCouple', group: 'ritual.phrasesGroup' };
const SCENES = { couple: CoupleScene, group: GroupScene };

const RitualReveal = ({ onDone, duration = 8800, variant = 'solo' }) => {
  const { t } = useI18n();
  const phrases = t(PHRASE_KEY[variant] || 'ritual.phrases');
  const Scene = SCENES[variant] || SoloScene;
  const [phase, setPhase] = useState(0);
  const finished  = useRef(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  // Stable — never changes reference, so the timer useEffect runs only once.
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDoneRef.current();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce) {
      const tid = setTimeout(finish, 250);
      return () => clearTimeout(tid);
    }
    const per = duration / phrases.length;
    const interval = setInterval(
      () => setPhase((p) => Math.min(p + 1, phrases.length - 1)),
      per,
    );
    const done = setTimeout(finish, duration);
    return () => { clearInterval(interval); clearTimeout(done); };
  }, [duration, finish, phrases.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-background overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Centered stage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Scene />
      </div>

      {/* Cycling phrases — fixed just below center, so they don't shift the scene */}
      <div className="absolute inset-x-0 text-center px-6" style={{ top: 'calc(50% + 110px)' }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="text-primary uppercase tracking-[0.25em] text-xs sm:text-sm"
          >
            {phrases[phase]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RitualReveal;
