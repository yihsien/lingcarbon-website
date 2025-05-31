/* ───────────────────── src/app/services/page.tsx ───────────────────── */
'use client';

import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
} from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage, translations } from '@/components/LanguageProvider';
import {
  ClipboardList,
  Package2,
  Factory,
  Truck,
  ShoppingCart,
  RefreshCcw,
} from 'lucide-react';

/* ═════════════ utilities ═════════════ */

function useInViewport(
  ref: MutableRefObject<Element | null>,
  rootMargin = '0px'
) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return visible;
}

/* type-writer hook with fade-out */
interface TWOpts {
  charSpeed?: number;
  pauseMs?: number;
  fadeMs?: number;
  startDelay?: number;
  active: boolean;
}
function useTypewriterFade(
  lines: string[],
  { charSpeed = 45, pauseMs = 5000, fadeMs = 500, startDelay = 0, active }: TWOpts
) {
  const [text, setText] = useState('');
  const [opacity, setOpacity] = useState(1);
  const timers = useRef<NodeJS.Timeout[]>([]);
  const state = useRef({
    line: 0,
    char: 0,
    phase: 'idle' as 'idle' | 'type' | 'pause' | 'fade',
  });
  const clearAll = () => timers.current.forEach(clearTimeout);
  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };
  const run = () => {
    clearAll();
    const curr = state.current;
    const line = lines[curr.line];

    if (!active) {
      schedule(run, 400);
      return;
    }
    switch (curr.phase) {
      case 'idle':
        schedule(() => {
          state.current.phase = 'type';
          run();
        }, startDelay);
        break;
      case 'type':
        if (curr.char <= line.length) {
          setText(line.slice(0, curr.char));
          setOpacity(1);
          curr.char += 1;
          schedule(run, charSpeed);
        } else {
          curr.phase = 'pause';
          schedule(run, pauseMs);
        }
        break;
      case 'pause':
        curr.phase = 'fade';
        setOpacity(0);
        schedule(run, fadeMs);
        break;
      case 'fade':
        state.current = { line: (curr.line + 1) % lines.length, char: 0, phase: 'type' };
        setText('');
        setOpacity(1);
        run();
        break;
    }
  };
  useEffect(() => {
    run();
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, active, startDelay]);
  return { text, opacity };
}

/* ═════════════ main page ═════════════ */

export default function ServicesPage() {
  const { language } = useLanguage();
  const { theme }   = useTheme();
  const [contactOpen, setContactOpen] = useState(false);

  const hl = theme === 'dark'
    ? 'text-[var(--color-sky-400)]'
    : 'text-[var(--color-companyBlue)]';

  /* ───── GHG INVENTORY animation data ───── */
  const scope1Lines = useMemo(() => [
    'Natural-gas boilers     →  42 tCO₂e',
    'Diesel generator        →  18 tCO₂e',
    'Refrigerant leak        →   2 tCO₂e',
  ], []);
  const scope2Lines = useMemo(() => [
    'Purchased electricity   → 118 tCO₂e',
    'District steam          →  12 tCO₂e',
  ], []);
  const scope3Lines = useMemo(() => [
    'Business flights        →  29 tCO₂e',
    'Employee commute        →  44 tCO₂e',
    'Purchased goods         → 310 tCO₂e',
    'Outbound logistics      →  73 tCO₂e',
    'Disposal phase          → 102 tCO₂e',
  ], []);

  const ledgerRef = useRef<HTMLDivElement | null>(null);
  const ledgerInView = useInViewport(ledgerRef, '-40%');

  const scope1 = useTypewriterFade(scope1Lines, { active: ledgerInView, pauseMs: 5200 });
  const scope2 = useTypewriterFade(scope2Lines, { active: ledgerInView, startDelay: 1200, charSpeed: 55, pauseMs: 6100 });
  const scope3 = useTypewriterFade(scope3Lines, { active: ledgerInView, startDelay: 2400, charSpeed: 65, pauseMs: 7000 });

  /* ───── CFP SECTION – wheel animation data ───── */
  const wheelStages = [
    { label: 'Raw-material extraction', Icon: Package2 },
    { label: 'Manufacturing',           Icon: Factory  },
    { label: 'Distribution',            Icon: Truck    },
    { label: 'Use phase',               Icon: ShoppingCart },
    { label: 'End-of-life',             Icon: RefreshCcw },
  ];

  const wheelRef = useRef<HTMLDivElement | null>(null);
  const wheelInView = useInViewport(wheelRef, '-30%');
  const [wheelIdx, setWheelIdx] = useState(0);

  useEffect(() => {
    if (!wheelInView) return;
    const id = setInterval(() => setWheelIdx(i => (i + 1) % wheelStages.length), 2000);
    return () => clearInterval(id);
  }, [wheelInView, wheelStages.length]);

  /* helper to place items in a circle */
  const polar = (deg: number, r = 115) =>
    `translate(-50%, -50%) rotate(${deg}deg) translate(${r}px) rotate(${-deg}deg)`;

  return (
    <>
      <Header onContactClick={() => setContactOpen(true)} />

      {/* ─────────────── Page hero ─────────────── */}
      <section className="py-24 sm:py-32 text-center">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {translations[language].navServices}
          </h1>
        </div>
      </section>

      {/* ════════════════ GHG INVENTORY ════════════════ */}
      <section id="ghg-inventory" className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              <ClipboardList size={28} className={hl} />
              {translations[language].navServiceGHG}
            </h2>
            <p className="mt-6 text-lg leading-8 whitespace-pre-line text-slate-700 dark:text-slate-300">
              {translations[language].navServiceGHGDesc}
            </p>
          </div>

          <div className="flex justify-center">
            <div
              ref={ledgerRef}
              className="relative w-full max-w-md rounded-xl border border-slate-200/60 dark:border-slate-700/60
                         bg-white/80 dark:bg-slate-800/70 backdrop-blur-xl
                         p-6 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
            >
              <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-slate-100">
                Organization&nbsp;GHG&nbsp;Inventory
              </h3>
              <div className="space-y-5 font-mono text-sm leading-6 text-slate-700 dark:text-slate-200">
                <div>
                  <span className={`font-semibold ${hl}`}>Scope 1</span>
                  <pre className={`mt-1 h-14 overflow-hidden transition-opacity duration-500 ${scope1.opacity ? 'opacity-100' : 'opacity-0'}`}>
                    {scope1.text}
                  </pre>
                </div>
                <div className="border-t border-slate-300/30 dark:border-slate-600/30" />
                <div>
                  <span className={`font-semibold ${hl}`}>Scope 2</span>
                  <pre className={`mt-1 h-10 overflow-hidden transition-opacity duration-500 ${scope2.opacity ? 'opacity-100' : 'opacity-0'}`}>
                    {scope2.text}
                  </pre>
                </div>
                <div className="border-t border-slate-300/30 dark:border-slate-600/30" />
                <div>
                  <span className={`font-semibold ${hl}`}>Scope 3</span>
                  <pre className={`mt-1 h-20 overflow-hidden transition-opacity duration-500 ${scope3.opacity ? 'opacity-100' : 'opacity-0'}`}>
                    {scope3.text}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ CFP CALCULATION ════════════════ */}
      <section id="cfp-calculation" className="py-24 sm:py-32 bg-slate-50/60 dark:bg-slate-900/20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          {/* animated wheel */}
          <div className="relative flex justify-center lg:order-2">
            <div ref={wheelRef} className="relative size-[350px]">
              {/* circle outline */}
              <div className="absolute inset-0 rounded-full border border-dashed border-slate-400/40 dark:border-slate-500/40" />

              {wheelStages.map((stage, idx) => {
                const deg = (360 / wheelStages.length) * idx - 90; // start at top
                const active = idx === wheelIdx;
                return (
                  <div
                    key={stage.label}
                    style={{ transform: polar(deg) }}
                    className="absolute top-1/2 left-1/2 flex flex-col items-center text-center transition-all duration-500"
                  >
                    <stage.Icon
                      size={32}
                      className={`mb-1 ${active ? hl : 'text-slate-400 dark:text-slate-600'}`}
                    />
                    <span
                      className={`w-28 text-xs font-medium leading-tight ${
                        active
                          ? 'text-slate-800 dark:text-slate-100'
                          : 'text-slate-500 dark:text-slate-500'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* copy */}
          <div className="lg:order-1">
            <h2 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              CFP&nbsp;Calculation&nbsp;/&nbsp;Life-Cycle&nbsp;Assessment
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {translations[language].navServiceFootprintingDesc}
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}