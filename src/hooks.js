import { useEffect, useRef, useState } from 'react';

const storage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Private mode or blocked storage: the choice just isn't remembered.
    }
  },
};

/** French or English: the visitor's last choice, else their browser's. */
export function useLanguage() {
  const [lang, setLang] = useState(() => {
    const saved = storage.get('africraft-lang');
    if (saved === 'fr' || saved === 'en') return saved;
    return (navigator.language || 'fr').toLowerCase().startsWith('en') ? 'en' : 'fr';
  });
  useEffect(() => {
    document.documentElement.lang = lang;
    storage.set('africraft-lang', lang);
  }, [lang]);
  return [lang, setLang];
}

/** Light or dark: the visitor's choice, else their system's. */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = storage.get('africraft-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const choose = (next) => {
    storage.set('africraft-theme', next);
    setTheme(next);
  };
  return [theme, choose];
}

/** Adds `is-in` to every `.reveal` element as it scrolls into view. */
export function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/** True once the page has scrolled past [offset] pixels. */
export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
}

/** The id of the section currently in view, for the nav. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join(',');
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

/** Counts up to [to] once visible. */
export function useCountUp(to, duration = 1200) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (still) {
      setValue(to);
      return undefined;
    }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);
  return [ref, value];
}
