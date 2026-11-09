import { useEffect, useState } from 'react';
import Lenis from 'lenis';

/** Smooth, weighted scrolling (Lenis), and anchor links that glide there. */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      lenis.scrollTo(id === '#top' ? 0 : id, { offset: -76, duration: 1.6 });
    };
    document.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
}

/** Stops or resumes the smooth scrolling (open menu, intro). */
export function lockScroll(locked) {
  if (window.__lenis) (locked ? window.__lenis.stop() : window.__lenis.start());
  document.body.classList.toggle('no-scroll', locked);
}

/** True while a media query matches. */
export function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}
