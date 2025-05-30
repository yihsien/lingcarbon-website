/* ───────────  src/components/WhyUsSection.tsx  (replace entire file) ────────── */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Settings, Briefcase, ShieldCheck, Zap, Users2 } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage, translations } from './LanguageProvider';

/* ░░ helper ░░ */
const data = (lang: 'en' | 'zh') => {
  const t = translations[lang];
  return [
    { id: 'c0', icon: Settings,    title: t.advantage1Title, description: t.advantage1Desc },
    { id: 'c1', icon: Briefcase,   title: t.advantage2Title, description: t.advantage2Desc },
    { id: 'c2', icon: ShieldCheck, title: t.advantage3Title, description: t.advantage3Desc },
    { id: 'c3', icon: Zap,         title: t.advantage4Title, description: t.advantage4Desc },
    { id: 'c4', icon: Users2,      title: t.advantage5Title, description: t.advantage5Desc },
  ];
};

const WhyUsSection: React.FC = () => {
  const { theme }       = useTheme();
  const { language, t } = useLanguage();
  const cards           = data(language);

  /* ── colour palette by theme ───────────────────────────────────────────── */
  const C =
    theme === 'dark'
      ? {
          bg: 'dark:bg-slate-800/50',
          text: 'text-slate-100',
          sub: 'text-slate-300',
          accent: 'text-[var(--color-sky-400)]',
          border: 'dark:border-gray-700/50',
        }
      : {
          bg: 'bg-slate-200/40',
          text: 'text-slate-900',
          sub: 'text-slate-600',
          accent: 'text-[var(--color-companyBlue)]',
          border: 'border-slate-200/60',
        };

  /* ── sticky-pile bookkeeping ──────────────────────────────────────────── */
  const refs       = useRef<HTMLDivElement[]>([]);
  const sentinel   = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0); // last card intersecting

  useEffect(() => {
    const options = { rootMargin: '-12% 0px -62% 0px', threshold: 0 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === sentinel.current && e.isIntersecting) {
          /* we scrolled past every card → reset to bottom card */
          setActive(cards.length - 1);
          return;
        }
        if (e.isIntersecting) {
          const idx = Number((e.target as HTMLElement).dataset.idx);
          setActive((prev) => (idx > prev ? idx : prev));
        }
      });
    }, options);

    refs.current.forEach((el) => el && io.observe(el));
    if (sentinel.current) io.observe(sentinel.current);
    return () => io.disconnect();
  }, [language]);

  /* ── layout constants ──────────────────────────────────────────────────── */
  const BASE_TOP  = 'clamp(118px, 16vh, 190px)'; // avoids nav-bar
  const STEP      = 12;                          // ↓12 px per level
  const ZOOM      = 1.02;                        // newest card +2 %

  /* ── render ────────────────────────────────────────────────────────────── */
  return (
    <section id="why-us" className="relative z-10 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* heading */}
        <div className="mb-16 text-center">
          <h2 className={`text-base font-semibold leading-7 ${C.accent}`}>{t.whyUsSubtitle}</h2>
          <p  className={`mt-2 text-4xl sm:text-5xl font-bold tracking-tight ${C.text}`}>{t.whyUsTitle}</p>
        </div>

        {/* pile */}
        <div className="mx-auto flex max-w-[28rem] flex-col space-y-8">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            const top  = `calc(${BASE_TOP} + ${idx * STEP}px)`;
            const scale= idx === active ? ZOOM : 1;
            const z    = 300 + idx; // keep render order consistent

            return (
              <div
                key={c.id}
                data-idx={idx}
                ref={(el) => {
                    if (el) refs.current[idx] = el;
                }}
                className="sticky rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 will-change-transform transition-transform duration-500 origin-top"
                style={{ top, transform: `scale(${scale})`, zIndex: z }}
              >
                <div className={`${C.bg} ${C.border} backdrop-blur-md rounded-xl p-6 md:p-8`}>
                  <Icon size={30} strokeWidth={1.6} className={`${C.accent} mb-4`} />
                  <h3 className={`mb-2 text-lg md:text-xl font-semibold ${C.text}`}>{c.title}</h3>
                  <p  className={`text-xs sm:text-sm leading-relaxed ${C.sub}`}>{c.description}</p>
                </div>
              </div>
            );
          })}

          {/* sentinel: just a tiny invisible block after the pile */}
          <div ref={sentinel} style={{ height: 1 }} />
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;