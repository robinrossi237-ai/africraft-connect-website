import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  Apple,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  Clock,
  GraduationCap,
  Heart,
  Infinity as InfinityIcon,
  Layers,
  MapPin,
  MessageSquareText,
  Receipt,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Wrench,
} from 'lucide-react';
import { useLang } from '../i18n.js';
import { PRICES, SITE } from '../config.js';
import { EASE, LEVELS, LevelBadge, Logo, Magnetic, Phone, Reveal, SectionHead, Wave, levelOf, spotlight } from '../ui.jsx';
import { ScoreRing } from './Middle.jsx';

const xaf = (n, lang) => n.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US').replace(/ | /g, ' ');

/* ------------------------------------------------------------ level lab */

function Slider({ label, hint, value, max, onChange, suffix, icon: Icon }) {
  return (
    <label className="slider">
      <span className="slider__top">
        <span className="slider__name">
          <Icon size={17} /> {label}
        </span>
        <span className="slider__value">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--p': `${(value / max) * 100}%` }}
      />
      {hint && <span className="slider__hint">{hint}</span>}
    </label>
  );
}

export function LevelLab() {
  const { t } = useLang();
  const l = t.levels;
  const [theory, setTheory] = useState(34);
  const [stage, setStage] = useState(0);
  const [stars, setStars] = useState(16);
  const [count, setCount] = useState(12);
  const total = theory + stage + stars;
  const level = levelOf(total, stage > 0, count);
  const next = LEVELS[level + 1];

  let missing = l.missing.top;
  if (next) {
    const name = l.names[level + 1];
    if (total < next.min) missing = l.missing.points(next.min - total, name);
    else if (next.stage && stage === 0) missing = l.missing.stage(name);
    else missing = l.missing.reviews(next.reviews - count, name);
  }

  return (
    <section className="section section--night" id="levels" onPointerMove={spotlight}>
      <div className="night__light" aria-hidden="true" />
      <div className="container lab">
        <div>
          <SectionHead kicker={l.kicker} title={l.title} body={l.body} light />
          <Reveal className="lab__panel">
            <Slider icon={BookOpen} label={l.theory} hint={l.theoryHint} value={theory} max={40} onChange={setTheory} suffix={` / 40`} />
            <Slider icon={Wrench} label={l.stage} hint={l.stageHint} value={stage} max={40} onChange={setStage} suffix={` / 40`} />
            <Slider icon={Star} label={l.reviews} hint={l.reviewsHint} value={stars} max={20} onChange={setStars} suffix={` / 20`} />
            <Slider icon={MessageSquareText} label={l.reviewCount} value={count} max={40} onChange={setCount} suffix="" />
          </Reveal>
        </div>
        <Reveal className="lab__result" delay={0.1}>
          <div className="lab__ring">
            <ScoreRing value={total} size={200} animate={false} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={level} className="lab__level" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
              <LevelBadge level={level} />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p key={missing} className="lab__missing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              {missing}
            </motion.p>
          </AnimatePresence>
          <ol className="ladder">
            {l.names.map((name, i) => (
              <li key={name} className={`ladder__step ladder__step--${LEVELS[i].key} ${i <= level ? 'is-reached' : ''} ${i === level ? 'is-current' : ''}`}>
                <span className="ladder__bar">
                  <motion.span initial={false} animate={{ scaleX: i <= level ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />
                </span>
                <strong>{name}</strong>
                <small>{l.needs[i]}</small>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ pros */

const ART_ICONS = [MapPin, GraduationCap, BadgeCheck, Sparkles];
const CO_ICONS = [Layers, ShieldCheck, Receipt, Heart];

function ProCard({ data, icons, screen, character, tone, delay }) {
  return (
    <Reveal delay={delay} className={`pro pro--${tone}`} onPointerMove={spotlight}>
      <div className="pro__head">
        <span className="pro__tag">
          {tone === 'artisan' ? <Wrench size={15} /> : <Building2 size={15} />} {data.tag}
        </span>
        <h3>{data.title}</h3>
      </div>
      <ul className="pro__list">
        {data.points.map(([a, b], i) => {
          const Icon = icons[i];
          return (
            <li key={a}>
              <span className="pro__icon">
                <Icon size={17} />
              </span>
              <span>
                <strong>{a}</strong>
                <small>{b}</small>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="pro__visual">
        <Phone screen={screen} className="pro__phone" />
        <img src={character} alt="" className="pro__character" loading="lazy" />
      </div>
      <Magnetic href="#download" className="btn btn--primary pro__cta">
        {data.cta} <ArrowRight size={18} />
      </Magnetic>
    </Reveal>
  );
}

export function Pros() {
  const { t } = useLang();
  const p = t.pros;
  return (
    <section className="section" id="pros">
      <div className="container">
        <SectionHead kicker={p.kicker} title={p.title} center />
        <div className="pros">
          <ProCard data={p.artisans} icons={ART_ICONS} screen="artisan-missions" character="/img/jean-paul.webp" tone="artisan" delay={0} />
          <ProCard data={p.companies} icons={CO_ICONS} screen="company-missions" character="/img/dominique.webp" tone="company" delay={0.1} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ pricing */

const PASSES = [
  [0, PRICES.pass24h],
  [1, PRICES.pass3d],
  [2, PRICES.pass7d],
];

export function Pricing() {
  const { t, lang } = useLang();
  const p = t.pricing;
  const [count, setCount] = useState(3);
  const [span, setSpan] = useState(0);

  const options = useMemo(() => {
    const unlock = { id: 'unlock', label: p.unlockEach(count), price: count * PRICES.unlock, detail: p.kept };
    const passes = PASSES.filter(([i]) => i >= span).map(([i, price]) => ({ id: `pass${i}`, label: p.pass(p.days[i]), price, detail: p.unlimited }));
    const all = [unlock, ...passes];
    const best = all.reduce((a, b) => (b.price < a.price ? b : a));
    return { all, best, worst: Math.max(...all.map((o) => o.price)) };
  }, [count, span, p]);

  return (
    <section className="section section--tint" id="pricing">
      <div className="container">
        <SectionHead kicker={p.kicker} title={p.title} body={p.body} center />
        <div className="pricing">
          <Reveal className="calc">
            <div className="calc__q">
              <p>{p.calcTitle}</p>
              <div className="stepper">
                <button type="button" onClick={() => setCount(Math.max(1, count - 1))} aria-label="−">
                  −
                </button>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.strong key={count} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.2 }}>
                    {p.calcCount(count)}
                  </motion.strong>
                </AnimatePresence>
                <button type="button" onClick={() => setCount(Math.min(12, count + 1))} aria-label="+">
                  +
                </button>
              </div>
            </div>
            <div className="calc__q">
              <p>{p.calcDays}</p>
              <div className="seg-mini">
                {p.days.map((d, i) => (
                  <button key={d} type="button" className={span === i ? 'is-on' : ''} onClick={() => setSpan(i)}>
                    {span === i && <motion.span layoutId="span-pill" className="seg-mini__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                    <span>{d}</span>
                  </button>
                ))}
              </div>
            </div>
            <motion.ul className="calc__options" layout>
              {options.all.map((o) => {
                const best = o.id === options.best.id;
                return (
                  <motion.li key={o.id} layout className={`opt ${best ? 'is-best' : ''}`} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                    {best && (
                      <motion.span layoutId="best-tag" className="opt__tag">
                        <Sparkles size={12} /> {p.best}
                      </motion.span>
                    )}
                    <span className="opt__icon">{o.id === 'unlock' ? <Users size={18} /> : <InfinityIcon size={18} />}</span>
                    <span className="opt__text">
                      <strong>{o.label}</strong>
                      <small>{o.detail}</small>
                    </span>
                    <span className="opt__price">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.b key={o.price} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                          {xaf(o.price, lang)}
                        </motion.b>
                      </AnimatePresence>
                      <small>{p.currency}</small>
                    </span>
                  </motion.li>
                );
              })}
            </motion.ul>
            {options.worst > options.best.price && (
              <p className="calc__saving">
                <Check size={16} /> {p.saving(xaf(options.worst - options.best.price, lang))}
              </p>
            )}
            <p className="calc__note">
              <Heart size={15} /> {p.freeFirst}
            </p>
          </Reveal>
          <Reveal className="artisan-price" delay={0.1} onPointerMove={spotlight}>
            <span className="pro__tag pro__tag--light">
              <Wrench size={15} /> {p.artisanTitle}
            </span>
            <ul>
              {p.artisanRows.map(([a, b]) => (
                <li key={a}>
                  <span>{a}</span>
                  <strong>{b}</strong>
                </li>
              ))}
            </ul>
            <p>{p.artisanAfter}</p>
            <img src="/img/dominique.webp" alt="" className="artisan-price__img" loading="lazy" />
          </Reveal>
        </div>
        <Reveal className="pay">
          <Smartphone size={16} /> {p.payment}
          <span className="op op--mtn">MTN MoMo</span>
          <span className="op op--orange">Orange Money</span>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ coverage */

const CITIES = [
  ['Douala', 4.0511, 9.7679, 1],
  ['Yaoundé', 3.848, 11.5021, 1],
  ['Bafoussam', 5.4778, 10.4176, 0],
  ['Bamenda', 5.9631, 10.1591, 0],
  ['Bertoua', 4.5776, 13.6846, 0],
  ['Ebolowa', 2.9, 11.15, 0],
  ['Garoua', 9.3, 13.4, 0],
  ['Kribi', 2.9373, 9.9077, 0],
  ['Maroua', 10.5956, 14.3247, 0],
  ['Ngaoundéré', 7.3167, 13.5833, 0],
];

const project = (lat, lng) => [((lng - 9.2) / (14.8 - 9.2)) * 92 + 4, ((11 - lat) / (11 - 2.6)) * 92 + 4];

export function Coverage() {
  const { t } = useLang();
  const c = t.coverage;
  const [hover, setHover] = useState(null);
  const mapRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: mapRef, offset: ['start end', 'center center'] });
  const sp = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const tilt = useTransform(sp, [0, 1], [62, 38]);
  const spin = useTransform(sp, [0, 1], [-18, -6]);
  const lift = useTransform(sp, [0, 1], [80, 0]);
  const counter = useTransform(tilt, (v) => `${-v}deg`);
  const pts = CITIES.map(([name, lat, lng, hub]) => ({ name, hub, xy: project(lat, lng) }));
  const hubs = pts.filter((p) => p.hub);
  return (
    <section className="section">
      <div className="container coverage">
        <div>
          <SectionHead kicker={c.kicker} title={c.title} body={c.body} />
          <Reveal as="ul" className="countries">
            {c.countries.map(([name, open]) => (
              <li key={name} className={open ? 'is-open' : ''}>
                <span>{name}</span>
                <em>{open ? c.open : c.soon}</em>
              </li>
            ))}
          </Reveal>
        </div>
        <div className="map-3d" ref={mapRef}>
        <motion.div className="map" style={{ rotateX: tilt, rotateZ: spin, y: lift, '--counter': counter }}>
          <svg viewBox="-6 -6 112 112" preserveAspectRatio="none" className="map__svg" aria-hidden="true">
            {pts
              .filter((p) => !p.hub)
              .map((p) =>
                hubs.map((h) => {
                  const near = hubs.reduce((a, b) => (Math.hypot(b.xy[0] - p.xy[0], b.xy[1] - p.xy[1]) < Math.hypot(a.xy[0] - p.xy[0], a.xy[1] - p.xy[1]) ? b : a));
                  if (near !== h) return null;
                  return (
                    <motion.line
                      key={`${p.name}-${h.name}`}
                      x1={h.xy[0]}
                      y1={h.xy[1]}
                      x2={p.xy[0]}
                      y2={p.xy[1]}
                      className="map__line"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
                    />
                  );
                }),
              )}
            <line x1={hubs[0].xy[0]} y1={hubs[0].xy[1]} x2={hubs[1].xy[0]} y2={hubs[1].xy[1]} className="map__line map__line--hub" />
          </svg>
          {pts.map((p, i) => (
            <motion.button
              type="button"
              key={p.name}
              className={`city ${p.hub ? 'city--hub' : ''} ${hover === p.name ? 'is-hover' : ''}`}
              style={{ left: `${(p.xy[0] + 6) / 1.12}%`, top: `${(p.xy[1] + 6) / 1.12}%` }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.06, type: 'spring', stiffness: 300, damping: 18 }}
              onPointerEnter={() => setHover(p.name)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(p.name)}
              onBlur={() => setHover(null)}
            >
              <span className="city__beam" style={{ height: p.hub ? 110 : 54 }} />
              <span className="city__dot" />
              <span className="city__name">{p.name}</span>
            </motion.button>
          ))}
        </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ faq */

export function Faq() {
  const { t } = useLang();
  const f = t.faq;
  const [open, setOpen] = useState(0);
  return (
    <section className="section section--tint" id="faq">
      <div className="container faq-wrap">
        <div className="faq-wrap__head">
          <SectionHead kicker={f.kicker} title={f.title} body={f.body} />
          <Reveal className="faq-wrap__art">
            <img src="/img/plumber-toolbox.webp" alt="" loading="lazy" />
          </Reveal>
        </div>
        <div className="faq">
          {f.items.map(([q, a], i) => {
            const on = open === i;
            return (
              <Reveal key={q} delay={i * 0.04} className={`faq__item ${on ? 'is-open' : ''}`}>
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                  <span className="faq__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="faq__q">{q}</span>
                  <span className="faq__chev">
                    <ChevronDown size={18} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      className="faq__answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <p>{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ final call */

export function FinalCta() {
  const { t } = useLang();
  const c = t.cta;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const sp = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const phoneScale = useTransform(sp, [0, 1], [0.78, 1]);
  const phoneRot = useTransform(sp, [0, 1], [-14, 0]);
  const phoneY = useTransform(sp, [0, 1], [160, 0]);
  const charX = useTransform(sp, [0, 1], [-80, 0]);
  const bgScale = useTransform(sp, [0, 1], [1.25, 1]);
  return (
    <section className="final" id="download" ref={ref}>
      <Wave className="final__wave" />
      <motion.div className="final__bg" aria-hidden="true" style={{ scale: bgScale }}>
        <span className="mesh mesh--a" />
        <span className="mesh mesh--b" />
        <span className="grid-lines" />
      </motion.div>
      <div className="container final__inner">
        <div className="final__copy">
          <Reveal as="h2">{c.title}</Reveal>
          <Reveal as="p" delay={0.1}>
            {c.body}
          </Reveal>
          <Reveal className="stores" delay={0.2}>
            {SITE.androidUrl ? (
              <Magnetic href={SITE.androidUrl} className="store" rel="noopener">
                <Smartphone size={24} />
                <span>
                  <small>Android</small>
                  {c.android}
                </span>
              </Magnetic>
            ) : (
              <span className="store store--soon">
                <Smartphone size={24} />
                <span>
                  <small>Google Play</small>
                  {c.androidSoon}
                </span>
              </span>
            )}
            <span className="store store--soon">
              <Apple size={24} />
              <span>
                <small>App Store</small>
                {c.ios}
              </span>
            </span>
          </Reveal>
          <Reveal as="p" className="final__note" delay={0.3}>
            <Clock size={15} /> {c.note}
          </Reveal>
        </div>
        <div className="final__visual">
          <motion.img src="/img/client.webp" alt="" className="final__character" loading="lazy" style={{ x: charX }} />
          <motion.div className="final__phone" style={{ scale: phoneScale, rotate: phoneRot, y: phoneY }}>
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
              <Phone screen="client-published" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ footer */

export function Footer() {
  const { t } = useLang();
  const f = t.footer;
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Logo light />
          <p className="footer__tagline">{f.tagline}</p>
        </div>
        <nav>
          <h4>{f.product}</h4>
          <a href="#how">{t.nav.how}</a>
          <a href="#try">{t.nav.try}</a>
          <a href="#levels">{t.nav.levels}</a>
          <a href="#pricing">{t.nav.pricing}</a>
        </nav>
        <nav>
          <h4>{f.company}</h4>
          <a href="#pros">{t.nav.pros}</a>
          <a href="#faq">{t.nav.faq}</a>
          <span className="footer__muted">{f.terms}</span>
          <span className="footer__muted">{f.privacy}</span>
        </nav>
        {(SITE.contactEmail || SITE.whatsappNumber) && (
          <nav>
            <h4>{f.contact}</h4>
            {SITE.contactEmail && <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>}
            {SITE.whatsappNumber && (
              <a href={`https://wa.me/${SITE.whatsappNumber}`} rel="noopener">
                WhatsApp
              </a>
            )}
          </nav>
        )}
      </div>
      <div className="footer__word" aria-hidden="true">
        Africraft
      </div>
      <div className="container footer__bottom">
        <span>
          © {year} Africraft Connect. {f.rights}
        </span>
        <span className="footer__made">
          <span className="flag" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {f.madeIn}
        </span>
        <a href="#top" className="footer__top">
          <ArrowUp size={15} /> {f.top}
        </a>
      </div>
    </footer>
  );
}
