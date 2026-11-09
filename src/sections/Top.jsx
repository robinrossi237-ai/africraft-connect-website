import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowDown,
  Download,
  Droplet,
  Flame,
  Grid3x3,
  Hammer,
  Menu,
  Moon,
  Paintbrush,
  PlugZap,
  Ruler,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import { useLang } from '../i18n.js';
import { EASE, Logo, Magnetic, Phone, Tilt, Wave } from '../ui.jsx';
import { useActiveSection, useScrolled } from '../hooks.js';
import { lockScroll } from '../cinema/smooth.js';
import { INTRO_DELAY } from '../cinema/Intro.jsx';
import { AppDemo } from './AppDemo.jsx';

/* ------------------------------------------------------------ header */

const NAV = ['how', 'try', 'levels', 'pros', 'pricing', 'faq'];

export function Header({ theme, setTheme }) {
  const { t, lang, setLang } = useLang();
  const scrolled = useScrolled(40);
  const active = useActiveSection(NAV);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });

  useEffect(() => {
    lockScroll(open);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const light = !scrolled && !open;

  const tools = (
    <div className="tools">
      <div className="lang" role="group" aria-label="Language">
        {['fr', 'en'].map((l) => (
          <button key={l} type="button" className={lang === l ? 'is-on' : ''} onClick={() => setLang(l)} aria-pressed={lang === l}>
            {lang === l && <motion.span layoutId="lang-pill" className="lang__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span>{l.toUpperCase()}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="icon-btn"
        aria-label={t.nav.theme}
        title={t.nav.theme}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'grid' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''} ${light ? 'is-light' : ''}`}>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <div className="container header__bar">
        <Logo light={light} />
        <nav className="header__nav" aria-label="Main">
          {NAV.map((id) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''}>
              {active === id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span>{t.nav[id]}</span>
            </a>
          ))}
        </nav>
        <div className="header__end">
          <div className="header__tools">{tools}</div>
          <a href="#download" className="btn btn--primary btn--sm header__cta">
            <Download size={16} /> {t.nav.download}
          </a>
          <button
            type="button"
            className="icon-btn header__burger"
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="drawer"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <nav className="drawer__nav">
              {NAV.map((id, i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={active === id ? 'is-active' : ''}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + 0.05 * i, ease: EASE, duration: 0.5 }}
                >
                  <small>0{i + 1}</small> {t.nav[id]}
                </motion.a>
              ))}
            </nav>
            {tools}
            <a href="#download" className="btn btn--primary" onClick={() => setOpen(false)}>
              <Download size={18} /> {t.nav.download}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------ hero */

function RotatingWord({ words }) {
  const [i, setI] = useState(0);
  const still = useReducedMotion();
  useEffect(() => {
    if (still) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length, still]);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');
  return (
    <span className="rotator">
      <span className="rotator__ghost" aria-hidden="true">
        {longest}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          className="rotator__word"
          initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const FLOATERS = [Droplet, PlugZap, Hammer, Paintbrush, Ruler, Flame];

export function Hero() {
  const { t } = useLang();
  const h = t.hero;
  const still = useReducedMotion();
  const fade = (delay) => ({
    initial: still ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay: delay + INTRO_DELAY },
  });
  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <span className="mesh mesh--a" />
        <span className="mesh mesh--b" />
        <span className="mesh mesh--c" />
        <span className="grid-lines" />
        {FLOATERS.map((Icon, i) => (
          <span key={i} className={`floater floater--${i}`}>
            <Icon size={20} />
          </span>
        ))}
      </div>
      <div className="container hero__grid">
        <div className="hero__copy">
          <motion.p className="pill" {...fade(0)}>
            <span className="pulse" /> {h.badge}
          </motion.p>
          <motion.h1 {...fade(0.08)}>
            {h.before} <RotatingWord words={h.words} />
            <br />
            {h.after}
          </motion.h1>
          <motion.p className="hero__body" {...fade(0.18)}>
            {h.body}
          </motion.p>
          <motion.div className="hero__ctas" {...fade(0.28)}>
            <Magnetic href="#download" className="btn btn--white btn--lg">
              <Download size={19} /> {h.ctaPrimary}
            </Magnetic>
            <Magnetic href="#how" className="btn btn--glass btn--lg">
              {h.ctaSecondary} <ArrowDown size={18} />
            </Magnetic>
          </motion.div>
          <motion.div className="proof" {...fade(0.38)}>
            <div className="proof__faces">
              <img src="/img/avatar_samuel.webp" alt="" />
              <img src="/img/avatar_jean_paul.webp" alt="" />
              <img src="/img/avatar_aicha.webp" alt="" />
              <span>
                <ShieldCheck size={16} />
              </span>
            </div>
            <p>{h.proof}</p>
          </motion.div>
          <motion.ul className="hero__facts" {...fade(0.48)}>
            {h.facts.map(([a, b]) => (
              <li key={a}>
                <strong>{a}</strong>
                <span>{b}</span>
              </li>
            ))}
          </motion.ul>
        </div>
        <motion.div
          className="hero__visual"
          initial={still ? false : { opacity: 0, y: 60, rotate: 4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 + INTRO_DELAY }}
        >
          <div className="hero__glow" aria-hidden="true" />
          <Phone screen="client-artisan" className="hero__back" eager />
          <Tilt className="hero__tilt">
            <Phone className="hero__phone">
              <AppDemo />
            </Phone>
          </Tilt>
        </motion.div>
      </div>
      <Wave className="hero__wave" />
    </section>
  );
}

/* ------------------------------------------------------------ trades */

const TRADE_ICONS = [Droplet, PlugZap, Hammer, Ruler, Paintbrush, Grid3x3, Flame];

export function Trades() {
  const { t } = useLang();
  const row = (k) =>
    t.trades.map((name, i) => {
      const Icon = TRADE_ICONS[i];
      return (
        <span className="trade" key={`${k}-${name}`}>
          <span className="trade__icon">
            <Icon size={16} />
          </span>
          {name}
          <span className="trade__star" aria-hidden="true">
            ✦
          </span>
        </span>
      );
    });
  return (
    <div className="trades" role="list" aria-label={t.trades.join(', ')}>
      <div className="trades__track" aria-hidden="true">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
