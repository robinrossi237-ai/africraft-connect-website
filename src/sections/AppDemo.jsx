import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, Camera, Droplet, MapPin, MessageCircle, Star, Zap } from 'lucide-react';
import { useLang } from '../i18n.js';
import { EASE, LevelBadge } from '../ui.jsx';

const SCENE_MS = 4200;

const ARTISANS = [
  { name: 'Samuel T.', initials: 'ST', img: '/img/avatar_samuel.webp', level: 2, rating: '4,8', count: 41, km: '1,2' },
  { name: 'Jean-Paul M.', initials: 'JM', img: '/img/avatar_jean_paul.webp', level: 1, rating: '4,6', count: 27, km: '2,1' },
  { name: 'Éric N.', initials: 'EN', level: 1, rating: '4,5', count: 15, km: '2,8' },
];

/** The app in four moments, playing by itself: post, notified, interested,
 *  WhatsApp. A tap on the bar at the top jumps to a moment. */
export function AppDemo() {
  const { t, lang } = useLang();
  const d = t.demo;
  const still = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (still || paused) return undefined;
    const id = setTimeout(() => setScene((s) => (s + 1) % 4), SCENE_MS);
    return () => clearTimeout(id);
  }, [scene, paused, still]);

  const num = (s) => (lang === 'fr' ? s : s.replace(',', '.'));

  return (
    <div
      className="demo"
      aria-label={d.label}
      role="img"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="demo__status" aria-hidden="true">
        <span>9:41</span>
        <span className="demo__icons">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="demo__bars">
        {d.steps.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`demo__bar ${i < scene ? 'is-done' : ''} ${i === scene ? 'is-on' : ''}`}
            onClick={() => setScene(i)}
            aria-label={label}
          >
            <span style={{ animationDuration: `${SCENE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
          </button>
        ))}
      </div>

      <div className="demo__head">
        <div className="demo__hello">
          <span className="demo__avatar">MK</span>
          <div>
            <strong>{d.hello}</strong>
            <small>
              <MapPin size={10} /> {d.where}
            </small>
          </div>
        </div>
        <span className="demo__step">{d.steps[scene]}</span>
        <svg className="demo__wave" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 14c40 12 80 16 130 8s90-20 130-14 30 10 40 12v10H0z" />
        </svg>
      </div>

      <div className="demo__body">
        <AnimatePresence mode="wait">
          {scene === 0 && <PostScene key="post" d={d} />}
          {scene === 1 && <NotifiedScene key="notified" d={d} />}
          {scene === 2 && <InterestedScene key="interested" d={d} num={num} />}
          {scene === 3 && <WhatsAppScene key="whatsapp" d={d} num={num} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

const sceneMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

function PostScene({ d }) {
  const [n, setN] = useState(0);
  const still = useReducedMotion();
  useEffect(() => {
    if (still) {
      setN(d.typed.length);
      return undefined;
    }
    setN(0);
    const id = setInterval(() => setN((x) => (x >= d.typed.length ? x : x + 1)), 38);
    return () => clearInterval(id);
  }, [d.typed, still]);
  const done = n >= d.typed.length;
  return (
    <motion.div className="scene" {...sceneMotion}>
      <div className="dcard">
        <p className="dcard__title">{d.newRequest}</p>
        <div className="dchips">
          <span className="dchip dchip--on">
            <Droplet size={11} /> {d.trade}
          </span>
          <span className="dchip dchip--urgent">
            <Zap size={11} /> {d.urgent}
          </span>
        </div>
        <div className="dfield">
          {d.typed.slice(0, n)}
          <span className="caret" />
        </div>
        <div className="dphotos">
          <img src="/img/sink_after.webp" alt="" />
          <span>
            <Camera size={14} />
          </span>
        </div>
      </div>
      <motion.div
        className="dbtn"
        animate={done ? { scale: [1, 0.95, 1], boxShadow: ['0 0 0 0 rgb(109 40 217 / 0.5)', '0 0 0 10px rgb(109 40 217 / 0)'] } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {d.publish}
      </motion.div>
    </motion.div>
  );
}

function NotifiedScene({ d }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    const id = setInterval(() => setCount((c) => (c >= 7 ? c : c + 1)), 260);
    return () => clearInterval(id);
  }, []);
  const dots = [
    [-92, -38, 'SK'],
    [86, -64, 'BT'],
    [-60, -96, 'HK'],
    [100, 30, 'RN'],
    [-100, 50, 'CE'],
    [40, 96, 'PM'],
    [-30, 104, 'AM'],
  ];
  return (
    <motion.div className="scene scene--center" {...sceneMotion}>
      <div className="radar">
        {[0, 1, 2].map((i) => (
          <span key={i} className="radar__ring" style={{ animationDelay: `${i * 0.9}s` }} />
        ))}
        <span className="radar__dash radar__dash--1" />
        <span className="radar__dash radar__dash--2" />
        <img src="/img/marie.webp" alt="" className="radar__me" />
        {dots.map(([x, y, label], i) => (
          <motion.span
            key={label}
            className="radar__dot"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25 + i * 0.26, type: 'spring', stiffness: 380, damping: 18 }}
          >
            {label}
          </motion.span>
        ))}
      </div>
      <p className="scene__title">{d.published}</p>
      <p className="dcounter">
        <span className="dcounter__dot" /> <b>{count}</b> {d.notified}
      </p>
      <p className="scene__hint">{d.notifiedHint}</p>
    </motion.div>
  );
}

function InterestedScene({ d, num }) {
  return (
    <motion.div className="scene" {...sceneMotion}>
      <p className="scene__title scene__title--left">{d.interested}</p>
      <p className="scene__hint scene__hint--left">{d.interestedHint}</p>
      <div className="dlist">
        {ARTISANS.map((a, i) => (
          <motion.div
            key={a.name}
            className={`dart ${i === 0 ? 'dart--pick' : ''}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.22, duration: 0.5, ease: EASE }}
          >
            {a.img ? <img src={a.img} alt="" className="dart__img" /> : <span className="dart__img dart__img--txt">{a.initials}</span>}
            <div className="dart__main">
              <strong>
                {a.name} <BadgeCheck size={12} className="dart__check" />
              </strong>
              <span className="dart__meta">
                <LevelBadge level={a.level} small />
                <span>
                  <Star size={10} fill="currentColor" /> {num(a.rating)}
                </span>
                <span>
                  {num(a.km)} {d.km}
                </span>
              </span>
            </div>
            <span className="dart__tag">{d.tagInterested}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function WhatsAppScene({ d, num }) {
  const a = ARTISANS[0];
  return (
    <motion.div className="scene" {...sceneMotion}>
      <div className="dprofile">
        <img src={a.img} alt="" />
        <div>
          <strong>
            {a.name} <BadgeCheck size={13} className="dart__check" />
          </strong>
          <span className="dart__meta">
            <LevelBadge level={a.level} small />
            <span>
              <Star size={10} fill="currentColor" /> {num(a.rating)} · {a.count}
            </span>
          </span>
        </div>
      </div>
      <div className="dchat">
        <motion.div className="bubble bubble--typing" initial={{ opacity: 1 }} animate={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ delay: 0.9, duration: 0.2 }}>
          <i />
          <i />
          <i />
        </motion.div>
        <motion.div className="bubble" initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1, duration: 0.35 }}>
          {d.chatHello}
          <small>15:02</small>
        </motion.div>
        <motion.div className="bubble bubble--me" initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 2, duration: 0.35 }}>
          {d.chatReply}
          <small>15:03 ✓✓</small>
        </motion.div>
      </div>
      <div className="dbtn dbtn--wa">
        <MessageCircle size={15} /> {d.whatsapp}
      </div>
    </motion.div>
  );
}
