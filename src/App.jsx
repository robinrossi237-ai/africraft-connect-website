import { useMemo } from 'react';
import { MotionConfig } from 'framer-motion';
import { LangContext, TEXTS } from './i18n.js';
import { useLanguage, useTheme } from './hooks.js';
import { useSmoothScroll } from './cinema/smooth.js';
import { Intro } from './cinema/Intro.jsx';
import { Header, Hero, Trades } from './sections/Top.jsx';
import { AppRing, Manifesto } from './sections/Scenes.jsx';
import { Bento, Story, TryIt } from './sections/Middle.jsx';
import { Coverage, Faq, FinalCta, Footer, LevelLab, Pricing, Pros } from './sections/Bottom.jsx';

export default function App() {
  const [lang, setLang] = useLanguage();
  const [theme, setTheme] = useTheme();
  const value = useMemo(() => ({ lang, setLang, t: TEXTS[lang] }), [lang, setLang]);
  useSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <LangContext.Provider value={value}>
        <Intro />
        <a href="#how" className="skip">
          {value.t.skip}
        </a>
        <Header theme={theme} setTheme={setTheme} />
        <main>
          <Hero />
          <Trades />
          <Manifesto />
          <Bento />
          <Story />
          <AppRing />
          <TryIt />
          <LevelLab />
          <Pros />
          <Pricing />
          <Coverage />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </LangContext.Provider>
    </MotionConfig>
  );
}
