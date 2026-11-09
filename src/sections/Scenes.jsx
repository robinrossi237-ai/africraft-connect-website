import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useLang } from '../i18n.js';
import { Phone, Reveal, SectionHead } from '../ui.jsx';
import { useMedia } from '../cinema/smooth.js';

/* ------------------------------------------------------------ manifesto */

function Word({ word, progress, range, accent }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <span className="mword">
      <motion.span className={accent ? 'mword__accent' : ''} style={{ opacity, y, display: 'inline-block' }}>
        {word}
      </motion.span>{' '}
    </span>
  );
}

/** A large sentence whose words light up one by one as you scroll. */
export function Manifesto() {
  const { t } = useLang();
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] });
  const words = t.manifesto.text.split(' ');
  return (
    <section className="manifesto" ref={ref}>
      <div className="container">
        <Reveal as="p" className="kicker" y={12}>
          <span className="kicker__dot" />
          {t.manifesto.kicker}
        </Reveal>
        <p className="manifesto__text" aria-label={t.manifesto.text.replace(/\*/g, '')}>
          {words.map((w, i) => {
            const accent = w.startsWith('*');
            const clean = w.replace(/\*/g, '');
            const start = i / words.length;
            const end = start + 1 / words.length;
            return still ? (
              <span key={i} className={`mword ${accent ? 'mword__accent' : ''}`}>
                {clean}{' '}
              </span>
            ) : (
              <Word key={i} word={clean} progress={scrollYProgress} range={[start, end]} accent={accent} />
            );
          })}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ app tour */

const SCREENS = ['client-home', 'client-search', 'client-artisan', 'client-published', 'artisan-missions', 'artisan-trainings', 'artisan-level', 'company-missions'];

/** The app's screens in a row that slides sideways as you scroll down
 *  (pinned on large screens), the one in front explained on the left. On
 *  phones and with reduced motion, a row to swipe. */
export function AppRing() {
  const { t } = useLang();
  const r = t.ring;
  const ref = useRef(null);
  const track = useRef(null);
  const still = useReducedMotion();
  const wide = useMedia('(min-width: 1025px)');
  const [shift, setShift] = useState(0);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (!wide) return undefined;
    const measure = () => {
      const el = track.current;
      if (!el) return;
      setShift(Math.max(0, el.scrollWidth - el.parentElement.clientWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [wide]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const x = useTransform(p, [0, 1], [0, -shift]);
  const bar = useTransform(p, [0, 1], ['0%', '100%']);
  useMotionValueEvent(scrollYProgress, 'change', (v) =>
    setActive(Math.min(SCREENS.length - 1, Math.max(0, Math.round(v * (SCREENS.length - 1))))),
  );

  if (!wide || still) return <TourCarousel r={r} />;

  return (
    <section className="tour" ref={ref} style={{ height: 'calc(100vh + ' + shift + 'px)' }}>
      <div className="tour__sticky">
        <div className="container tour__grid">
          <div className="tour__side">
            <SectionHead kicker={r.kicker} title={r.title} body={r.body} />
            <div className="tour__now">
              <span className="tour__count">
                {String(active + 1).padStart(2, '0')} <em>/ {String(SCREENS.length).padStart(2, '0')}</em>
              </span>
              <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <span className="tour-card__tag">{r.tags[active]}</span>
                <strong>{r.labels[active]}</strong>
                <p>{r.descs[active]}</p>
              </motion.div>
              <div className="tour__bar">
                <motion.span style={{ width: bar }} />
              </div>
            </div>
          </div>
          <div className="tour__window">
            <motion.div className="tour__track" ref={track} style={{ x }}>
              {SCREENS.map((s, i) => (
                <div key={s} className={'tour__item' + (i === active ? ' is-on' : '')}>
                  <Phone screen={s} alt={r.labels[i]} />
                  <span className="tour__label">{r.labels[i]}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Small screens: a swipe carousel. The screen in the middle is in focus,
 *  its neighbours fade and step back, the edges dissolve, and the caption
 *  below follows. Dots and a tap on a side screen bring it to the centre. */
function TourCarousel({ r }) {
  const rail = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = rail.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      const items = [...el.children];
      let best = 0;
      let bestDist = Infinity;
      items.forEach((it, i) => {
        const c = it.offsetLeft + it.offsetWidth / 2;
        const d = Math.abs(c - mid);
        // Each card's focus (1 in the centre, 0 one card away), for the CSS.
        it.style.setProperty('--focus', String(Math.max(0, 1 - d / (it.offsetWidth + 16))));
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i) => {
    const el = rail.current;
    const it = el?.children[i];
    if (!it) return;
    el.scrollTo({ left: it.offsetLeft + it.offsetWidth / 2 - el.clientWidth / 2, behavior: 'smooth' });
  };

  return (
    <section className="tour tour--flat">
      <div className="container">
        <SectionHead kicker={r.kicker} title={r.title} body={r.body} />
      </div>
      <div className="carousel-m" ref={rail} aria-roledescription="carousel">
        {SCREENS.map((s, i) => (
          <button
            key={s}
            type="button"
            className={'carousel-m__item' + (i === active ? ' is-on' : '')}
            onClick={() => go(i)}
            aria-label={r.labels[i]}
            aria-current={i === active}
          >
            <Phone screen={s} alt={r.labels[i]} />
          </button>
        ))}
      </div>
      <div className="container">
        <div className="carousel-m__dots" role="tablist">
          {SCREENS.map((s, i) => (
            <button key={s} type="button" role="tab" aria-selected={i === active} aria-label={r.labels[i]} className={i === active ? 'is-on' : ''} onClick={() => go(i)} />
          ))}
        </div>
        <div className="carousel-m__caption" aria-live="polite">
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <span className="tour-card__tag">{r.tags[active]}</span>
            <strong>
              <em>{String(active + 1).padStart(2, '0')}</em> {r.labels[active]}
            </strong>
            <p>{r.descs[active]}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
