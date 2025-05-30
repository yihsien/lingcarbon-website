'use client';

import React, { useEffect, useRef } from 'react';
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
    glow: 'hover:shadow-[0_8px_24px_var(--color-companyBlue-light)] dark:hover:shadow-[0_8px_24px_#003a40]'
  },
  purple: {
    icon: 'text-[var(--color-purple-600)] dark:text-[var(--color-purple-400)]',
    ringColor: 'ring-[var(--color-purple-500)]',
    glow: 'hover:shadow-[0_8px_24px_var(--color-purple-400)] dark:hover:shadow-[0_8px_24px_var(--color-purple-700)]'
  },
  green: {
    icon: 'text-[var(--color-green-600)] dark:text-[var(--color-green-400)]',
    ringColor: 'ring-[var(--color-green-500)]',
    glow: 'hover:shadow-[0_8px_24px_var(--color-green-400)] dark:hover:shadow-[0_8px_24px_var(--color-green-700)]'
  },
  yellow: {
    icon: 'text-[var(--color-yellow-500)] dark:text-[var(--color-yellow-400)]',
    ringColor: 'ring-[var(--color-yellow-500)]',
    glow: 'hover:shadow-[0_8px_24px_var(--color-yellow-400)] dark:hover:shadow-[0_8px_24px_var(--color-yellow-700)]'
  },
  pink: {
    icon: 'text-[var(--color-pink-500)] dark:text-[var(--color-pink-400)]',
    ringColor: 'ring-[var(--color-pink-500)]',
    glow: 'hover:shadow-[0_8px_24px_var(--color-pink-400)] dark:hover:shadow-[0_8px_24px_var(--color-pink-700)]'
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

  const railRef   = useRef<HTMLDivElement>(null);
  const rafID     = useRef<number>(0);
  const pausedRef = useRef(false);
  const SPEED = 0.6;

  useEffect(() => {
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
  }, [language]);

  const setPaused = (v: boolean) => (pausedRef.current = v);
  const nudge     = (dir: 'left' | 'right') => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLDivElement>(':scope > div');
    if (!card) return;
    rail.scrollBy({ left: dir === 'right' ? card.offsetWidth : -card.offsetWidth, behavior: 'smooth' });
  };

  const cards = [...services, ...services];

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
          <div ref={railRef} className="flex overflow-x-hidden gap-4 px-4 sm:px-6 md:px-8 pb-2 select-none">
            {cards.map((s, i) => {
              const Icon = s.icon;
              const pal  = servicePalette[s.colour];
              return (
                <div key={`${s.id}-${i}`} className="flex-shrink-0 w-[90%] sm:w-[80%] md:w-[48%] lg:w-[32%] xl:w-[30%]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                  <div
                    className={`group relative h-full rounded-xl
                      bg-white/90 dark:bg-gray-800/70 backdrop-blur-md
                      border border-slate-200/60 dark:border-gray-700/50
                      px-6 py-8 shadow transition-all duration-300
                      hover:-translate-y-3 ${pal.glow}
                      ring-0 ring-transparent ${pal.ringColor}
                      hover:ring-2 dark:hover:ring-2`}
                  >
                    <span className="glow-ring pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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

          <button aria-label="scroll left"  onClick={() => nudge('left')}  className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-700/60 p-3 text-white backdrop-blur-md hover:bg-slate-700/80"><ChevronLeft  size={26} /></button>
          <button aria-label="scroll right" onClick={() => nudge('right')} className="absolute right-0  translate-x-1/2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-700/60 p-3 text-white backdrop-blur-md hover:bg-slate-700/80"><ChevronRight size={26} /></button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;