'use client';

import React, { useEffect, useRef, useState } from 'react';

/* ---------- mobile detection ---------- */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const handler = () => setIsMobile(mq.matches);
    handler();                                     // set initial
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      mq.addListener(handler); // Safari <16
    }
    return () =>
      mq.removeEventListener
        ? mq.removeEventListener('change', handler)
        : mq.removeListener(handler);
  }, []);
  return isMobile;
};

import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Calculator,
  Leaf,
  Target,
  Award
} from 'lucide-react';
import { useLanguage, translations } from './LanguageProvider';

const servicePalette: Record<string, { icon: string; ringColor: string; glow: string }> = {
  companyBlue: {
    icon: 'text-[var(--color-companyBlue)]',
    ringColor: 'ring-[var(--color-companyBlue)]',
    glow: 'hover:shadow-[0_8px_24px_var(--color-companyBlue)] dark:hover:shadow-[0_8px_24px_var(--color-companyBlue)]'
  },
  purple: {
    icon: 'text-[var(--color-purple-600)] dark:text-[var(--color-purple-400)]',
    ringColor: 'ring-[var(--color-purple-400)]',
    glow: 'hover:shadow-[0_8px_24px_var(--color-purple-400)] dark:hover:shadow-[0_8px_24px_var(--color-purple-400)]'
  },
  green: {
    icon: 'text-[var(--color-green-600)] dark:text-[var(--color-green-400)]',
    ringColor: 'ring-[var(--color-green-500)]',
    glow: 'hover:shadow-[0_8px_24px_var(--color-green-400)] dark:hover:shadow-[0_8px_24px_var(--color-green-400)]'
  },
  yellow: {
    icon: 'text-[var(--color-yellow-500)] dark:text-[var(--color-yellow-400)]',
    ringColor: 'ring-[var(--color-yellow-500)]',
    glow: 'hover:shadow-[0_8px_24px_var(--color-yellow-400)] dark:hover:shadow-[0_8px_24px_var(--color-yellow-400)]'
  },
  pink: {
    icon: 'text-[var(--color-pink-500)] dark:text-[var(--color-pink-400)]',
    ringColor: 'ring-[var(--color-pink-500)]',
    glow: 'hover:shadow-[0_8px_24px_var(--color-pink-400)] dark:hover:shadow-[0_8px_24px_var(--color-pink-400)]'
  }
};

const getServices = (lang: 'en' | 'zh') => {
  const t = translations[lang];
  return [
    { id: 'ghg', icon: ClipboardList, title: t.navServiceGHG, description: t.navServiceGHGDesc, colour: 'companyBlue' },
    { id: 'cfp', icon: Calculator,  title: t.navServiceFootprinting, description: t.navServiceFootprintingDesc, colour: 'purple' },
    { id: 'str', icon: Leaf,        title: t.navServiceStrategy, description: t.navServiceStrategyDesc, colour: 'green' },
    { id: 'sbti',icon: Target,      title: t.navServiceSBTi, description: t.navServiceSBTiDesc, colour: 'yellow' },
    { id: 'rate',icon: Award,       title: t.navServiceRatings, description: t.navServiceRatingsDesc, colour: 'pink' }
  ];
};

const FeaturesSection: React.FC = () => {
  const { language, t } = useLanguage();
  const services = getServices(language);
  const isMobile = useIsMobile();
  const [activeIdx, setActiveIdx] = useState(0);
  // ─── Detect which card is centered on phones ────────────────────────────────
  useEffect(() => {
    if (!isMobile) return;
    const rail = railRef.current;
    if (!rail) return;

    const onScroll = () => {
      const card = rail.querySelector<HTMLDivElement>(':scope > div');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(rail).gap) || 0;
      const step = card.offsetWidth + gap;
      const idx = Math.round(rail.scrollLeft / step);
      setActiveIdx(Math.min(idx, services.length - 1));
    };

    // Initial position
    onScroll();
    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => rail.removeEventListener('scroll', onScroll);
  }, [isMobile, services.length]);

  const railRef   = useRef<HTMLDivElement>(null);
  const rafID     = useRef<number>(0);
  const pausedRef = useRef(false);
  const SPEED = 0.6;

  useEffect(() => {
    if (isMobile) return;            // 🔹 skip auto‑scroll on phones
    const rail = railRef.current;
    if (!rail) return;

    const loop = () => {
      if (!pausedRef.current) {
        rail.scrollLeft += SPEED;
        if (rail.scrollLeft >= rail.scrollWidth / 2) {
          rail.scrollLeft -= rail.scrollWidth / 2;
        }
      }
      rafID.current = requestAnimationFrame(loop);
    };
    rafID.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafID.current);
  }, [language, isMobile]);

  const setPaused = (v: boolean) => (pausedRef.current = v);
  const nudge     = (dir: 'left' | 'right') => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLDivElement>(':scope > div');
    if (!card) return;
    rail.scrollBy({ left: dir === 'right' ? card.offsetWidth : -card.offsetWidth, behavior: 'smooth' });
  };

  const cards = isMobile ? services : [...services, ...services];

  return (
    <section id="features" className="py-20 sm:py-32 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-companyBlue)] to-[var(--color-green-500)] dark:from-[var(--color-companyBlue)] dark:to-[var(--color-green-400)]">
            {t.servicesTitle}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            {t.servicesSubtitle}
          </p>
        </div>

        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div
        ref={railRef}
        className={`
            flex
            ${isMobile
              ? 'overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-smooth'
              : 'overflow-x-hidden overflow-y-visible'}
            gap-4
            pt-4
            px-4 sm:px-6 md:px-8
            pb-2
            select-none
        `}
        >
            {cards.map((s, i) => {
              const Icon = s.icon;
              const pal  = servicePalette[s.colour];
              const isActive = isMobile && i === activeIdx;
              return (
                <div key={`${s.id}-${i}`} className={`
                    flex-shrink-0
                    ${isMobile
                      ? 'w-[90%] snap-center'
                      : 'w-[90%] sm:w-[80%] md:w-[48%] lg:w-[32%] xl:w-[30%]'}
                `} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                  <div
                    className={`
                        group relative h-full rounded-xl
                        bg-slate-200/30 dark:bg-gray-800/70 backdrop-blur-md
                        border border-slate-200/300 dark:border-gray-700/50
                        px-6 py-8 shadow transition-all duration-300
                        ${isActive
                          ? '-translate-y-3 shadow-[0_8px_24px_var(--tw-shadow-color)] ring-2 ' + pal.ringColor
                          : ''}
                        ${!isMobile ? 'hover:-translate-y-3 ' + pal.glow : ''}
                    `}
                    style={isActive ? { '--tw-shadow-color': `var(--${s.colour === 'companyBlue' ? 'color-companyBlue' : `color-${s.colour}-400`})` } as React.CSSProperties : undefined}
                  >
                    <span
                      className={`glow-ring pointer-events-none absolute inset-0 -z-10 rounded-xl transition-opacity duration-300
                                  ${isMobile ? (isActive ? 'opacity-100' : 'opacity-0') : 'opacity-0 group-hover:opacity-100'}`}
                    />
                    <Icon size={34} strokeWidth={1.6} className={`${pal.icon} mb-4 mx-auto`} />
                    <h3 className="text-xl font-bold mb-2 text-center text-slate-800 dark:text-slate-100">
                      {s.title}
                    </h3>
                    <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {isMobile && (
            <div className="flex justify-center gap-2 mt-4">
              {services.map((_, idx) => (
                <span
                  key={idx}
                  className={`
                    block w-2 h-2 rounded-full
                    ${idx === activeIdx ? 'bg-[var(--color-companyBlue)]' : 'bg-slate-400/50'}
                  `}
                />
              ))}
            </div>
          )}

          {!isMobile && (
            <button aria-label="scroll left"  onClick={() => nudge('left')}  className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-700/60 p-3 text-white backdrop-blur-md hover:bg-slate-700/80"><ChevronLeft  size={26} /></button>
          )}
          {!isMobile && (
            <button aria-label="scroll right" onClick={() => nudge('right')} className="absolute right-0  translate-x-1/2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-700/60 p-3 text-white backdrop-blur-md hover:bg-slate-700/80"><ChevronRight size={26} /></button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;