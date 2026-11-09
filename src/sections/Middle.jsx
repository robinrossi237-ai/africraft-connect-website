import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  BadgeCheck,
  Building2,
  Check,
  Droplet,
  Flame,
  Grid3x3,
  Hammer,
  MapPin,
  MessageCircle,
  Paintbrush,
  PlugZap,
  Ruler,
  ScanFace,
  Star,
  Users,
  WifiOff,
  Wrench,
} from 'lucide-react';
import { useLang } from '../i18n.js';
import { EASE, LevelBadge, Phone, Reveal, SectionHead, spotlight } from '../ui.jsx';

/* ------------------------------------------------------------ bento */

function Tile({ className = '', icon: Icon, title, body, children, delay = 0 }) {
  return (
    <Reveal delay={delay} tilt className={`tile ${className}`} onPointerMove={spotlight}>
      <div className="tile__visual">{children}</div>
      <div className="tile__text">
        <span className="tile__icon">
          <Icon size={18} />
        </span>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </Reveal>
  );
}

function ScoreRing({ value = 72, size = 120, animate = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const still = useReducedMotion();
  const [v, setV] = useState(still || !animate ? value : 0);
  useEffect(() => {
    if (!animate || still) {
      setV(value);
      return undefined;
    }
    if (!inView) return undefined;
    let raf;
    const start = performance.now();
    const from = v;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 900);
      setV(Math.round(from + (value - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, animate, still]);
  const c = 2 * Math.PI * 52;
  return (
    <div className="ring" ref={ref} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#f2a93b" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="52" className="ring__track" />
        <circle cx="60" cy="60" r="52" className="ring__fill" strokeDasharray={c} strokeDashoffset={c - (c * v) / 100} />
      </svg>
      <div className="ring__label">
        <strong>{v}</strong>
        <span>/ 100</span>
      </div>
    </div>
  );
}

export { ScoreRing };

export function Bento() {
  const { t } = useLang();
  const b = t.bento;
  return (
    <section className="section" id="why">
      <div className="container">
        <SectionHead kicker={b.kicker} title={b.title} body={b.body} center />
        <div className="bento">
          <Tile className="tile--id" icon={ScanFace} title={b.id[0]} body={b.id[1]}>
            <div className="idcard">
              <div className="idcard__photo">
                <img src="/img/avatar_jean_paul.webp" alt="" />
              </div>
              <div className="idcard__lines">
                <small>{b.idCard}</small>
                <i />
                <i />
                <i className="short" />
              </div>
              <span className="idcard__scan" />
              <span className="idcard__ok">
                <BadgeCheck size={14} /> {b.idOk}
              </span>
            </div>
          </Tile>
          <Tile className="tile--level" icon={Star} title={b.level[0]} body={b.level[1]} delay={0.08}>
            <ScoreRing value={72} size={124} />
            <div className="tile__badges">
              <LevelBadge level={1} small />
              <LevelBadge level={2} small />
            </div>
          </Tile>
          <Tile className="tile--reviews" icon={Star} title={b.reviews[0]} body={b.reviews[1]} delay={0.12}>
            <div className="stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -40 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 400, damping: 14 }}
                >
                  <Star size={22} fill="currentColor" />
                </motion.span>
              ))}
            </div>
            <p className="quote">{b.reviewQuote}</p>
          </Tile>
          <Tile className="tile--wa" icon={MessageCircle} title={b.whatsapp[0]} body={b.whatsapp[1]} delay={0.16}>
            <div className="wa">
              <span className="wa__bubble wa__bubble--in">{b.waIn}</span>
              <span className="wa__bubble wa__bubble--out">{b.waOut}</span>
              <span className="wa__typing">
                <i />
                <i />
                <i />
              </span>
            </div>
          </Tile>
          <Tile className="tile--near" icon={MapPin} title={b.near[0]} body={b.near[1]} delay={0.2}>
            <div className="mini-map">
              <span className="mini-map__me" />
              {[
                [22, 30],
                [70, 22],
                [78, 64],
                [30, 72],
                [52, 48],
              ].map(([x, y], i) => (
                <span key={i} className="mini-map__pin" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }}>
                  <MapPin size={16} />
                </span>
              ))}
            </div>
          </Tile>
          <Tile className="tile--offline" icon={WifiOff} title={b.offline[0]} body={b.offline[1]} delay={0.24}>
            <div className="signal">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} style={{ height: `${30 + i * 18}%`, animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ story (sticky) */

const STORY_SCREENS = {
  client: ['client-home', 'client-published', 'client-artisan', 'client-search'],
  company: ['company-missions', 'client-published', 'client-search', 'client-artisan'],
  artisan: ['artisan-level', 'artisan-missions', 'artisan-trainings', 'artisan-level'],
};

function StoryStep({ index, title, body, onActive, active }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  return (
    <div ref={ref} className={`story__step ${active ? 'is-on' : ''}`}>
      <span className="story__num">0{index + 1}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export function Story() {
  const { t } = useLang();
  const s = t.story;
  const [who, setWho] = useState('client');
  const [step, setStep] = useState(0);
  const steps = s[who];
  const screens = STORY_SCREENS[who];
  const onActive = useMemo(() => (i) => setStep(i), []);

  return (
    <section className="section section--tint story" id="how">
      <div className="container">
        <SectionHead kicker={s.kicker} title={s.title} center />
        <Reveal className="segmented" role="tablist">
          <LayoutGroup id="story-tabs">
            {['client', 'company', 'artisan'].map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={who === k}
                className={who === k ? 'is-on' : ''}
                onClick={() => {
                  setWho(k);
                  setStep(0);
                }}
              >
                {who === k && <motion.span layoutId="seg-pill" className="segmented__pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className="segmented__label">
                  {k === 'client' ? <Users size={16} /> : k === 'company' ? <Building2 size={16} /> : <Wrench size={16} />}
                  {s.tabs[k]}
                </span>
              </button>
            ))}
          </LayoutGroup>
        </Reveal>
        <div className="story__grid">
          <div className="story__steps">
            {steps.map(([title, body], i) => (
              <StoryStep key={`${who}-${i}`} index={i} title={title} body={body} onActive={onActive} active={step === i} />
            ))}
          </div>
          <div className="story__sticky">
            <div className="story__stage">
              <div className="story__halo" aria-hidden="true" />
              <div className="story__dots" aria-hidden="true">
                {steps.map((_, i) => (
                  <span key={i} className={i === step ? 'is-on' : ''} />
                ))}
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={`${who}-${step}`}
                  className="story__phone"
                  initial={{ opacity: 0, rotateY: 75, x: 60, scale: 0.92 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -75, x: -60, scale: 0.92 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  style={{ transformPerspective: 1400 }}
                >
                  <Phone screen={screens[step]} alt={steps[step][0]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ try it */

const TRADES = [
  ['plomberie', Droplet],
  ['electricite', PlugZap],
  ['maconnerie', Hammer],
  ['menuiserie', Ruler],
  ['peinture', Paintbrush],
  ['carrelage', Grid3x3],
  ['soudure', Flame],
];

const DISTRICTS = ['Bonapriso', 'Akwa', 'Bonamoussadi', 'Bastos', 'Makepe', 'Biyem-Assi'];

// Sample people for the demo, never real accounts.
const PEOPLE = [
  ['Samuel T.', '/img/avatar_samuel.webp', 2, 4.8, 41, 9],
  ['Jean-Paul M.', '/img/avatar_jean_paul.webp', 1, 4.6, 27, 6],
  ['Aïcha N.', '/img/avatar_aicha.webp', 3, 4.9, 63, 14],
  ['Éric N.', null, 1, 4.5, 15, 4],
  ['Brice K.', null, 0, 4.2, 6, 2],
  ['Carine E.', null, 2, 4.7, 22, 8],
  ['Hervé M.', null, 1, 4.4, 12, 5],
];

function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function TryIt() {
  const { t, lang } = useLang();
  const y = t.tryit;
  const [trade, setTrade] = useState(0);
  const [district, setDistrict] = useState(0);
  const tradeNames = t.trades;

  const results = useMemo(() => {
    const rnd = seeded(`${trade}-${district}`);
    const pool = [...PEOPLE].sort(() => rnd() - 0.5).slice(0, 3 + Math.floor(rnd() * 2));
    return pool
      .map((p) => ({ name: p[0], img: p[1], level: p[2], rating: p[3], count: p[4], years: p[5], km: 0.4 + rnd() * 3.6 }))
      .sort((a, b) => a.km - b.km);
  }, [trade, district]);

  const fmt = (n, d = 1) => n.toFixed(d).replace('.', lang === 'fr' ? ',' : '.');
  const TradeIcon = TRADES[trade][1];

  return (
    <section className="section" id="try">
      <div className="container tryit">
        <div className="tryit__copy">
          <SectionHead kicker={y.kicker} title={y.title} body={y.body} />
          <Reveal className="picker">
            <p className="picker__label">{y.trade}</p>
            <div className="picker__chips">
              {TRADES.map(([code, Icon], i) => (
                <button key={code} type="button" className={`pchip ${trade === i ? 'is-on' : ''}`} onClick={() => setTrade(i)} aria-pressed={trade === i}>
                  <Icon size={15} /> {tradeNames[i]}
                </button>
              ))}
            </div>
            <p className="picker__label">{y.district}</p>
            <div className="picker__chips">
              {DISTRICTS.map((name, i) => (
                <button key={name} type="button" className={`pchip pchip--soft ${district === i ? 'is-on' : ''}`} onClick={() => setDistrict(i)} aria-pressed={district === i}>
                  <MapPin size={14} /> {name}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal className="results" delay={0.1} tilt>
          <div className="results__head">
            <span className="results__sample">{y.sample}</span>
            <AnimatePresence mode="wait">
              <motion.p key={`${trade}-${district}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <TradeIcon size={16} /> <strong>{y.found(results.length)}</strong> · {DISTRICTS[district]} · {y.sortedBy}
              </motion.p>
            </AnimatePresence>
          </div>
          <motion.ul className="results__list" layout>
            <AnimatePresence mode="popLayout">
              {results.map((r, i) => (
                <motion.li
                  key={`${r.name}-${trade}-${district}`}
                  layout
                  className="rcard"
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }}
                >
                  {r.img ? (
                    <img src={r.img} alt="" className="rcard__img" />
                  ) : (
                    <span className="rcard__img rcard__img--txt">
                      {r.name
                        .split(' ')
                        .map((x) => x[0])
                        .join('')}
                    </span>
                  )}
                  <div className="rcard__main">
                    <strong>
                      {r.name} <BadgeCheck size={15} className="rcard__check" />
                    </strong>
                    <span className="rcard__trade">
                      {tradeNames[trade]} · {r.years} {y.years}
                    </span>
                    <span className="rcard__meta">
                      <LevelBadge level={r.level} small />
                      <span className="rcard__stars">
                        <Star size={12} fill="currentColor" /> {fmt(r.rating)} ({r.count})
                      </span>
                      <span>
                        <MapPin size={12} /> {fmt(r.km)} km
                      </span>
                    </span>
                  </div>
                  <div className="rcard__side">
                    <span className="rcard__avail">
                      <Check size={12} /> {y.available}
                    </span>
                    <span className="rcard__cta">{y.unlock}</span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </Reveal>
      </div>
    </section>
  );
}
