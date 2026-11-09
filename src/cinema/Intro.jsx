import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { lockScroll } from './smooth.js';

const EASE = [0.76, 0, 0.24, 1];

/** Seconds the first scene waits for the opening to finish (0 once seen). */
export const INTRO_DELAY = (() => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
    return sessionStorage.getItem('africraft-intro') ? 0 : 1.5;
  } catch {
    return 0;
  }
})();

/** The opening: the mark draws itself, the name rises, then a violet wave
 *  lifts and uncovers the page. Once per visit; never with reduced motion. */
export function Intro() {
  const [show, setShow] = useState(() => {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      return !sessionStorage.getItem('africraft-intro');
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return undefined;
    lockScroll(true);
    const id = setTimeout(() => {
      try {
        sessionStorage.setItem('africraft-intro', '1');
      } catch {
        // Shown again next time; harmless.
      }
      setShow(false);
    }, 1900);
    return () => clearTimeout(id);
  }, [show]);

  return (
    <AnimatePresence onExitComplete={() => lockScroll(false)}>
      {show && (
        <motion.div className="intro" exit={{ y: '-100%' }} transition={{ duration: 1.05, ease: EASE }} aria-hidden="true">
          <svg className="intro__curve" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0 0h1440v40c-180 50-420 80-720 80S180 90 0 40z" />
          </svg>
          <div className="intro__inner">
            <motion.img
              src="/img/mark-white.png"
              alt=""
              initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="intro__name">
              {'Africraft'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ delay: 0.35 + i * 0.045, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>
            <motion.div className="intro__bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
