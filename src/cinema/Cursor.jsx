import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMedia } from './smooth.js';

/** A soft light ring that follows the mouse and opens over anything
 *  clickable. Only with a real mouse, never on touch screens. */
export function Cursor() {
  const fine = useMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    if (!fine) return undefined;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target;
      setHover(!!t.closest?.('a, button, input, [role="tab"], .pchip, .tile, .rcard'));
      setOnDark(!!t.closest?.('.hero, .section--night, .final, .footer, .ring-section'));
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    document.documentElement.classList.add('has-cursor');
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [fine, x, y]);

  if (!fine) return null;
  return (
    <>
      <motion.div className={`cursor-dot ${onDark ? 'is-light' : ''}`} style={{ x, y }} />
      <motion.div
        className={`cursor-ring ${onDark ? 'is-light' : ''} ${hover ? 'is-hover' : ''}`}
        style={{ x: rx, y: ry }}
        animate={{ scale: down ? 0.8 : hover ? 1.7 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
    </>
  );
}
