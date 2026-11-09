import { Fragment, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useLang } from './i18n.js';

export const EASE = [0.22, 1, 0.36, 1];

/** Fades and rises into view once. */
export function Reveal({ children, delay = 0, y = 24, tilt = false, className = '', as = 'div', style, ...rest }) {
  const still = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={still ? false : { opacity: 0, y: tilt ? y * 2 : y, rotateX: tilt ? 24 : 0, scale: tilt ? 0.94 : 1 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: tilt ? 1.1 : 0.8, ease: EASE, delay }}
      style={tilt ? { transformPerspective: 1200, transformOrigin: '50% 100%', ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** A title whose words rise one after the other. */
export function SplitTitle({ text, as = 'h2', className = '' }) {
  const still = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(' ');
  return (
    <Tag
      className={`split ${className}`}
      initial={still ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ staggerChildren: 0.06 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="split__mask" aria-hidden="true">
            <motion.span
              className="split__word"
              variants={{ hidden: { y: '110%' }, shown: { y: '0%' } }}
              transition={{ duration: 0.75, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Kicker, animated title and lead text. */
export function SectionHead({ kicker, title, body, center = false, light = false }) {
  return (
    <header className={`section-head ${center ? 'section-head--center' : ''} ${light ? 'section-head--light' : ''}`}>
      {kicker && (
        <Reveal as="p" className="kicker" y={12}>
          <span className="kicker__dot" />
          {kicker}
        </Reveal>
      )}
      <SplitTitle text={title} />
      {body && (
        <Reveal as="p" className="lead" delay={0.15}>
          {body}
        </Reveal>
      )}
    </header>
  );
}

/** The Africraft mark and name. */
export function Logo({ light = false }) {
  return (
    <a href="#top" className={`logo ${light ? 'logo--light' : ''}`} aria-label="Africraft Connect">
      <img src={light ? '/img/mark-white.png' : '/img/mark.png'} alt="" width="34" height="27" />
      <span>
        Africraft<em>Connect</em>
      </span>
    </a>
  );
}

/** A phone frame. With [screen], one of the app's real screens. The bezel,
 *  corners and camera scale with the phone's width, so a small phone keeps
 *  a fine, clean frame. */
export function Phone({ screen, alt = '', className = '', children, eager = false }) {
  const { lang } = useLang();
  return (
    <div className={`phone ${className}`}>
      <div className="phone__body">
        <div className="phone__screen">
          {screen ? (
            <img
              src={`/screens/${lang}/${screen}.webp`}
              alt={alt}
              width="600"
              height="1299"
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

/** Leans gently toward the pointer. */
export function Tilt({ children, className = '', max = 8 }) {
  const ref = useRef(null);
  const still = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
  const move = (e) => {
    if (still || e.pointerType === 'touch') return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
    >
      {children}
    </motion.div>
  );
}

/** A button that leans a little toward the pointer. */
export function Magnetic({ children, className = '', href, onClick, ...rest }) {
  const ref = useRef(null);
  const still = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 18 });
  const y = useSpring(0, { stiffness: 260, damping: 18 });
  const move = (e) => {
    if (still || e.pointerType === 'touch') return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.18);
    y.set((e.clientY - r.top - r.height / 2) * 0.28);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      className={className}
      style={{ x, y }}
      onPointerMove={move}
      onPointerLeave={leave}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

/** Puts the pointer position in --mx / --my, for a soft light that follows it. */
export function spotlight(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/** The signature wave, as the edge of a coloured band. */
export function Wave({ className = '' }) {
  return (
    <svg className={`wave ${className}`} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 64c180 48 360 64 560 40S940 8 1140 18s240 46 300 62v40H0z" />
    </svg>
  );
}

/* ------------------------------------------------------------ levels */

export const LEVELS = [
  { key: 'beginner', min: 0, stage: false, reviews: 0 },
  { key: 'skilled', min: 40, stage: false, reviews: 0 },
  { key: 'expert', min: 65, stage: true, reviews: 10 },
  { key: 'master', min: 85, stage: true, reviews: 25 },
];

/** The level index (0 to 3) for a score, as the app counts it. */
export function levelOf(total, stageDone, reviewCount) {
  let level = 0;
  LEVELS.forEach((l, i) => {
    if (total >= l.min && (!l.stage || stageDone) && reviewCount >= l.reviews) level = i;
  });
  return level;
}

export function LevelBadge({ level, small = false }) {
  const { t } = useLang();
  return (
    <span className={`lvl lvl--${LEVELS[level].key} ${small ? 'lvl--sm' : ''}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
      </svg>
      {t.levels.names[level]}
    </span>
  );
}
