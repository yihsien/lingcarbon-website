/* ───────────────────── src/app/services/page.tsx ───────────────────── */
'use client';

import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
} from 'react';
import Header         from '@/components/Header';
import Footer         from '@/components/Footer';
import ContactModal   from '@/components/ContactModal';
import { useTheme }   from '@/components/ThemeProvider';
import { useLanguage, translations } from '@/components/LanguageProvider';
import {
  ClipboardList,
  Calculator,
  Leaf,
  Target,
  Award,
  Factory,
  Truck,
  ShoppingCart,
  RefreshCcw,
  Package2,
  Plane,
  Car,
  Zap,
  Trees,
  Sun,
  Wind,
  Sprout,
  ArrowUpCircle,
  ArrowDownCircle,
  FilePlus,
  Wrench,
  UploadCloud,
  Megaphone,
  BarChart2,
} from 'lucide-react';

/* ═════════════ utilities ═════════════ */

function useInViewport(
  ref: MutableRefObject<Element | null>,
  rootMargin = '0px',
) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return visible;
}

/* type-writer with fade-out */
interface TWOpts {
  charSpeed?: number;
  pauseMs?: number;
  fadeMs?: number;
  startDelay?: number;
  active: boolean;
}
function useTypewriterFade(
  lines: string[],
  { charSpeed = 45, pauseMs = 5000, fadeMs = 500, startDelay = 0, active }: TWOpts,
) {
  const [text, setText] = useState('');
  const [opacity, setOpacity] = useState(1);
  const timers = useRef<NodeJS.Timeout[]>([]);
  const state = useRef({
    line: 0,
    char: 0,
    phase: 'idle' as 'idle' | 'type' | 'pause' | 'fade',
  });

  const clear = () => timers.current.forEach(clearTimeout);
  const later = (fn: () => void, ms: number) =>
    timers.current.push(setTimeout(fn, ms));

  const tick = () => {
    clear();

    if (!active) {
      later(tick, 400);
      return;
    }

    const s = state.current;
    const line = lines[s.line];

    switch (s.phase) {
      case 'idle':
        later(() => {
          s.phase = 'type';
          tick();
        }, startDelay);
        break;

      case 'type':
        if (s.char <= line.length) {
          setText(line.slice(0, s.char));
          setOpacity(1);
          s.char += 1;
          later(tick, charSpeed);
        } else {
          s.phase = 'pause';
          later(tick, pauseMs);
        }
        break;

      case 'pause':
        s.phase = 'fade';
        setOpacity(0);
        later(tick, fadeMs);
        break;

      case 'fade':
        state.current = { line: (s.line + 1) % lines.length, char: 0, phase: 'type' };
        setText('');
        setOpacity(1);
        tick();
        break;
    }
  };

  useEffect(() => {
    tick();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, active, startDelay]);

  return { text, opacity };
}

/* ═════════════ main page ═════════════ */

export default function ServicesPage() {
  const { language } = useLanguage();
  const { theme }    = useTheme();
  const [contactOpen, setContactOpen] = useState(false);

  const hl = theme === 'dark'
    ? 'text-[var(--color-sky-400)]'
    : 'text-[var(--color-companyBlue)]';

  /* ────────── GHG inventory text animation ────────── */
  // GHG ledger lines – language‑aware
  const scope1Lines = useMemo(
    () => translations[language].servicesGHGScope1Lines,
    [language],
  );

  const scope2Lines = useMemo(
    () => translations[language].servicesGHGScope2Lines,
    [language],
  );

  const scope3Lines = useMemo(
    () => translations[language].servicesGHGScope3Lines,
    [language],
  );
  const ledgerRef = useRef<HTMLDivElement | null>(null);
  const ledgerIn  = useInViewport(ledgerRef, '-40%');
  const scope1 = useTypewriterFade(scope1Lines, { active: ledgerIn, pauseMs: 5200 });
  const scope2 = useTypewriterFade(scope2Lines, { active: ledgerIn, startDelay: 1200, charSpeed: 55, pauseMs: 6100 });
  const scope3 = useTypewriterFade(scope3Lines, { active: ledgerIn, startDelay: 2400, charSpeed: 65, pauseMs: 7000 });

  /* ────────── CFP wheel animation ────────── */
  const wheelStages = useMemo(() => [
    { label: translations[language].servicesCFPWheelRaw,           Icon: Package2 },
    { label: translations[language].servicesCFPWheelManufacturing, Icon: Factory  },
    { label: translations[language].servicesCFPWheelDistribution,  Icon: Truck    },
    { label: translations[language].servicesCFPWheelUse,           Icon: ShoppingCart },
    { label: translations[language].servicesCFPWheelEOL,           Icon: RefreshCcw },
  ], [language]);

  /* ────────── SBTi 5‑step sequence ────────── */
  const sbtiSteps = useMemo(() => [
    { label: translations[language].servicesSBTiCommit,      Icon: FilePlus     },
    { label: translations[language].servicesSBTiDevelop,     Icon: Wrench       },
    { label: translations[language].servicesSBTiSubmit,      Icon: UploadCloud  },
    { label: translations[language].servicesSBTiCommunicate, Icon: Megaphone    },
    { label: translations[language].servicesSBTiDisclose,    Icon: BarChart2    },
  ], [language]);

  /* ────────── Enhanced ESG ratings animation setup ────────── */
  const esgLevels = useMemo(() => ['D-', 'D', 'C-', 'C', 'B-', 'B', 'A-', 'A'], []);
  const [esgIdx, setEsgIdx] = useState(0);
  const [ballFade, setBallFade] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    const last = esgLevels.length - 1;
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;

    if (esgIdx < last) {
      // Add jumping animation before moving to next step
      setIsJumping(true);
      t1 = setTimeout(() => {
        setIsJumping(false);
        setEsgIdx(esgIdx + 1);
      }, 1000); // 1 second per step
    } else {
      // At level A: wait 3 seconds, then fade out and restart
      t1 = setTimeout(() => {
        setBallFade(true);
        t2 = setTimeout(() => {
          setEsgIdx(0);
          setBallFade(false);
          setIsJumping(false);
        }, 800); // Fade duration
      }, 3000); // Wait 3 seconds at A
    }

    return () => {
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, [esgIdx, esgLevels.length]);

  const wheelRef = useRef<HTMLDivElement | null>(null);
  const wheelIn  = useInViewport(wheelRef, '-30%');
  const [wheelIdx, setWheelIdx] = useState(0);

  useEffect(() => {
    if (!wheelIn) return;
    const id = setInterval( () => setWheelIdx((i) => (i + 1) % wheelStages.length), 2000, );
    return () => clearInterval(id);
  }, [wheelIn, wheelStages.length]);

  const polar = (deg: number, r = 180) =>
    `translate(-50%, -50%) rotate(${deg}deg) translate(${r}px) rotate(${-deg}deg)`;

  /* ───────────────────── render ───────────────────── */
  return (
    <>
      <Header onContactClick={() => setContactOpen(true)} />

      {/* hero */}
      <section className="py-24 sm:py-32 text-center">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {translations[language].servicesHeroTitle}
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300">
            {translations[language].servicesHeroSubtitle}
          </p>
        </div>
      </section>

      {/* ────────── GHG INVENTORY ────────── */}
      <section id="ghg-inventory" className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              <ClipboardList size={28} className={hl} />
              {translations[language].navServiceGHG}
            </h2>
            <p className="mt-6 text-lg leading-8 whitespace-pre-line text-slate-700 dark:text-slate-300">
              {translations[language].navServiceGHGDesc}
            </p>
          </div>
          <div className="flex justify-center items-start">
            <div ref={ledgerRef} className="relative flex-shrink-0 w-[355px] sm:w-[400px] min-h-[340px] rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-300/30 dark:bg-slate-800/70 backdrop-blur-xl p-6 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
              <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-slate-100">
                {translations[language].servicesGHGInventoryAnimationTitle}
              </h3>
              <div className="space-y-5 font-mono text-sm leading-6 text-slate-700 dark:text-slate-200">
                {[
                  { label: translations[language].servicesGHGInventoryAnimationScope1, data: scope1, h: '14' }, 
                  { label: translations[language].servicesGHGInventoryAnimationScope2, data: scope2, h: '10' }, 
                  { label: translations[language].servicesGHGInventoryAnimationScope3, data: scope3, h: '20' },
                ].map(({ label, data }, i) => (
                  <React.Fragment key={label}>
                    <div>
                      <span className={`font-semibold ${hl}`}>{label}</span>
                      <pre className={`mt-1 h-10 overflow-hidden transition-opacity duration-500 ${data.opacity ? 'opacity-100' : 'opacity-0'}`}>{data.text}</pre>
                    </div>
                    {i < 2 && (<div className="border-t border-slate-400/30 dark:border-slate-600/30" />)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


{/* ────────── ENHANCED CFP / LCA ────────── */}
<section id="cfp-calculation" className="relative overflow-x-hidden py-24 sm:py-32">
  <div className="mx-auto max-w-5xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
    <div className="relative flex justify-center order-2 lg:order-1"> 
      <div
        ref={wheelRef}
        className="relative w-full max-w-[440px] aspect-square transform origin-center scale-[0.85] sm:scale-100"
      >
        
        {/* Enhanced SVG with better arrows and animations */}
        <svg
          width="100%"
          height="100%"
          viewBox="-20 -20 480 480"
          className="absolute inset-0 overflow-visible"
          style={{ pointerEvents: 'none', overflow: 'visible' }}
        >
          <defs>
            {/* Enhanced gradient for arrows */}
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme === 'dark' ? '#0ea5e9' : '#0284c7'} />
              <stop offset="100%" stopColor={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            </linearGradient>
            
            {/* Glow filter for active arrows */}
            <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {wheelStages.map((_, idx) => {
              const n = wheelStages.length;
              const arrowSourceIdx = (wheelIdx + n - 1) % n;
              const highlightThisArrow = idx === arrowSourceIdx;
              
              return (
                <marker 
                  key={`m-${idx}`} 
                  id={`arrow-${idx}`} 
                  markerWidth="8" 
                  markerHeight="6" 
                  refX="7" 
                  refY="3" 
                  orient="auto"
                >
                  <polygon 
                    points="0,0 8,3 0,6" 
                    fill={highlightThisArrow ? "url(#arrowGradient)" : (theme === 'dark' ? '#64748b' : '#94a3b8')}
                    className={highlightThisArrow ? "" : "transition-colors duration-500"}
                  />
                </marker>
              );
            })}
          </defs>
          
          {/* Enhanced connecting arcs with better spacing and animation */}
          {wheelStages.map((_, idx) => {
            const n = wheelStages.length;
            const r = 180;
            const c = 220;
            const gap = 20; // Slightly larger gap for cleaner look
            
            const a0 = (360 / n) * idx - 90 + gap;
            const a1 = (360 / n) * (idx + 1) - 90 - gap;
            const rad = (d: number) => (d * Math.PI) / 180;
            
            const x1 = c + r * Math.cos(rad(a0));
            const y1 = c + r * Math.sin(rad(a0));
            const x2 = c + r * Math.cos(rad(a1));
            const y2 = c + r * Math.sin(rad(a1));
            
            const arrowSourceIdx = (wheelIdx + n - 1) % n;
            const highlightThisArrow = idx === arrowSourceIdx;
            
            return (
              <path
                key={`arc-${idx}`}
                d={`M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`}
                stroke={highlightThisArrow ? "url(#arrowGradient)" : (theme === 'dark' ? '#64748b' : '#94a3b8')}
                strokeWidth={highlightThisArrow ? "4" : "3"}
                fill="none"
                markerEnd={`url(#arrow-${idx})`}
                filter={highlightThisArrow ? "url(#arrowGlow)" : "none"}
                className="transition-all duration-700 ease-out"
                style={{
                  strokeDasharray: highlightThisArrow ? "0" : "5,5",
                  strokeDashoffset: highlightThisArrow ? "0" : "10",
                  animation: highlightThisArrow ? "none" : "dash 2s linear infinite"
                }}
              />
            );
          })}
          
          {/* Animated dash keyframes */}
          <style>
            {`
              @keyframes dash {
                to {
                  stroke-dashoffset: 0;
                }
              }
            `}
          </style>
        </svg>

        {/* Enhanced stage indicators with better animations */}
        {wheelStages.map((stage, idx) => {
          const deg = (360 / wheelStages.length) * idx - 90;
          const active = idx === wheelIdx;
          
          return (
            <div
              key={stage.label}
              style={{ 
                transform: polar(deg),
                transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              className={`absolute top-1/2 left-1/2 flex flex-col items-center text-center ${
                active ? 'scale-110 z-10' : 'scale-100 z-0'
              }`}
            >
              {/* Enhanced icon background with pulse effect */}
              <div 
                className={`relative p-3 rounded-full transition-all duration-700 ${
                  active 
                    ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/40 shadow-lg ring-2 ring-blue-200 dark:ring-blue-700' 
                    : 'bg-slate-100/50 dark:bg-slate-800/50'
                }`}
              >
                {active && (
                  <>
                    {/* Pulse rings */}
                    <div className="absolute inset-0 rounded-full bg-blue-200 dark:bg-blue-600 animate-ping opacity-30" />
                    <div className="absolute inset-0 rounded-full bg-blue-300 dark:bg-blue-500 animate-pulse opacity-20" />
                  </>
                )}
                
                <stage.Icon 
                  size={active ? 36 : 32} 
                  className={`transition-all duration-500 ${
                    active 
                      ? 'text-blue-600 dark:text-blue-400 drop-shadow-sm' 
                      : 'text-slate-400 dark:text-slate-600'
                  }`} 
                />
              </div>
              
              {/* Enhanced label with better typography */}
              <span 
                className={`mt-3 w-32 text-xs font-semibold leading-tight transition-all duration-500 ${
                  active 
                    ? 'text-slate-900 dark:text-slate-100 scale-105' 
                    : 'text-slate-500 dark:text-slate-500 scale-100'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
    
    <div className="order-1 lg:order-2"> 
      <h2 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        <Calculator size={28} className={hl} />
        {translations[language].navServiceFootprinting}
      </h2>
      <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300 whitespace-pre-line">
        {translations[language].navServiceFootprintingDesc}
      </p>
    </div>
  </div>
</section>

      {/* ────────── CARBON NEUTRAL STRATEGY  ────────── */}
      <section id="carbon-neutral-strategy" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="flex justify-center items-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              <Leaf size={28} className={hl} />
              {translations[language].navServiceStrategy}
            </h2>
            <p className="mt-6 text-lg leading-8 whitespace-pre-line text-slate-700 dark:text-slate-300">
              {translations[language].navServiceStrategyDesc}
            </p>
          </div>

          <div className="mt-24 lg:mt-28">
            <div className="relative mx-auto max-w-4xl">
              {/* Container with fixed aspect ratio */}
              <div className="relative w-full" style={{ height: '300px' }}>
                
                {/* SVG Scale */}
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox="0 0 800 300" 
                  className="absolute inset-0 drop-shadow-lg"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="neutralScaleBeamGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={theme === 'dark' ? '#4b5563' : '#9ca3af'} />
                      <stop offset="50%" stopColor={theme === 'dark' ? '#6b7280' : '#d1d5db'} />
                      <stop offset="100%" stopColor={theme === 'dark' ? '#4b5563' : '#9ca3af'} />
                    </linearGradient>
                    <filter id="panShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.2"/>
                    </filter>
                  </defs>
                  
                  {/* Fulcrum */}
                  <polygon 
                    points="390,280 410,280 400,180" 
                    className={`fill-current ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} 
                  />
                  
                  {/* Main beam */}
                  <rect 
                    x="80" 
                    y="170" 
                    width="640" 
                    height="20" 
                    rx="6" 
                    ry="6" 
                    fill="url(#neutralScaleBeamGrad)" 
                    className={`${theme === 'dark' ? 'stroke-slate-600' : 'stroke-slate-300'}`} 
                    strokeWidth="1"
                  />
                  
                  {/* Left pan chain */}
                  <line x1="180" y1="170" x2="180" y2="120" stroke="currentColor" strokeWidth="3" 
                        className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} />
                  
                  {/* Right pan chain */}
                  <line x1="620" y1="170" x2="620" y2="120" stroke="currentColor" strokeWidth="3" 
                        className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} />
                  
                  {/* Left pan (emissions side - slightly lower) */}
                  <ellipse 
                    cx="180" 
                    cy="125" 
                    rx="100" 
                    ry="15" 
                    className={`fill-current ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}`}
                    filter="url(#panShadow)"
                  />
                  
                  {/* Right pan (offset side - slightly higher) */}
                  <ellipse 
                    cx="620" 
                    cy="125" 
                    rx="100" 
                    ry="15" 
                    className={`fill-current ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}`}
                    filter="url(#panShadow)"
                  />
                </svg>

                {/* Left Group: CO₂ Sources Box */}
                <div 
                  className="absolute flex flex-col items-center text-center z-10 transform -translate-x-1/2"
                  style={{ 
                    left: '25%', // Adjusted to better align with left pan center
                    bottom: '58%'  // Position directly above the pan
                  }}
                >
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/50 shadow-lg backdrop-blur-sm w-40 sm:w-48">
                    <h4 className="mb-3 text-sm font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">
                      {translations[language].servicesNeutralEmissionSources}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col items-center">
                        <Factory size={28} strokeWidth={1.5} className="text-red-600 dark:text-red-400 mb-1" />
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">{translations[language].servicesNeutralIconIndustry}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Plane size={28} strokeWidth={1.5} className="text-red-600 dark:text-red-400 mb-1" />
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">{translations[language].servicesNeutralIconTravel}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Car size={28} strokeWidth={1.5} className="text-red-600 dark:text-red-400 mb-1" />
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">{translations[language].servicesNeutralIconTransport}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Zap size={28} strokeWidth={1.5} className="text-red-600 dark:text-red-400 mb-1" />
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">{translations[language].servicesNeutralIconEnergy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Arrow and Label - Below scale */}
                <div 
                  className="absolute flex flex-col items-center text-center z-10 transform -translate-x-1/2"
                  style={{ 
                    left: '25%', // Aligned with left box
                    top: '72%'   // Position below the entire scale structure
                  }}
                >
                  <ArrowUpCircle size={24} className="text-red-500 dark:text-red-400 mb-1 animate-bounce"/>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{translations[language].servicesNeutralEmissionsLabel}</span>
                </div>

                {/* Right Group: Carbon Offsets Box */}
                <div 
                  className="absolute flex flex-col items-center text-center z-10 transform -translate-x-1/2"
                  style={{ 
                    left: '75%', // Adjusted to better align with right pan center
                    bottom: '58%'     // Position directly above the pan
                  }}
                >
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800/50 shadow-lg backdrop-blur-sm w-40 sm:w-48">
                    <h4 className="mb-3 text-sm font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">
                      {translations[language].servicesNeutralCarbonOffsets}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col items-center">
                        <Trees size={28} strokeWidth={1.5} className="text-green-600 dark:text-green-400 mb-1"/>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">{translations[language].servicesNeutralIconForests}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Sun size={28} strokeWidth={1.5} className="text-green-600 dark:text-green-400 mb-1"/>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">{translations[language].servicesNeutralIconSolar}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Wind size={28} strokeWidth={1.5} className="text-green-600 dark:text-green-400 mb-1"/>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">{translations[language].servicesNeutralIconWind}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Sprout size={28} strokeWidth={1.5} className="text-green-600 dark:text-green-400 mb-1"/>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">{translations[language].servicesNeutralIconCapture}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Arrow and Label - Below scale */}
                <div 
                  className="absolute flex flex-col items-center text-center z-10 transform -translate-x-1/2"
                  style={{ 
                    left: '75%', // Aligned with right box
                    top: '72%'   // Position below the entire scale structure
                  }}
                >
                  <ArrowDownCircle size={24} className="text-green-500 dark:text-green-400 mb-1 animate-bounce" style={{ animationDelay: '0.5s' }}/>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{translations[language].servicesNeutralOffsettingLabel}</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── SBTi TARGET SETTING ────────── */}
      <section id="sbti-target-setting" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* title & description */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="flex justify-center items-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              <Target size={28} className={hl} />
              {translations[language].navServiceSBTi}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300">
              {translations[language].navServiceSBTiDesc}
            </p>
          </div>

          {/* five‑step sequence */}
          <div className="mt-24 lg:mt-28 flex flex-col items-center">
            <ol className="grid grid-cols-1 sm:grid-cols-5 gap-10 w-full">
              {sbtiSteps.map(({ label, Icon }, idx) => (
                <li key={label} className="group flex flex-col items-center text-center
                                           transition-transform duration-300 hover:scale-[1.2]">
                  <div
                    className="flex items-center justify-center size-20 rounded-full border-2 border-current font-bold text-xl
                               text-slate-600 dark:text-slate-300 transition-colors duration-300
                               group-hover:text-[var(--color-companyBlue)] group-hover:border-[var(--color-companyBlue)]"
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <Icon
                    size={28}
                    className="mt-4 text-slate-600 dark:text-slate-300 transition-colors duration-300
                               group-hover:text-[var(--color-companyBlue)]"
                  />
                  <span
                    className="mt-2 font-medium text-slate-800 dark:text-slate-100 transition-colors duration-300
                               group-hover:text-[var(--color-companyBlue)]"
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ────────── ESG RATINGS & DISCLOSURE ────────── */}
      <section id="esg-ratings" className="relative overflow-x-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <h2 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              <Award size={28} className={hl} />
              {translations[language].navServiceRatings}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {translations[language].navServiceRatingsDesc}
            </p>
          </div>

          {/* Right: stairs animation */}
<div className="relative w-full max-w-[480px] aspect-square overflow-visible
             transform origin-left scale-[0.65] sm:scale-100
             ml-0 sm:mx-auto">
  {/* Render stairs */}
  {esgLevels.map((lvl, idx) => {
    const STEP = 60;
    const left = idx * STEP;
    const top = (esgLevels.length - idx - 1) * STEP;
    const isCurrentStep = idx === esgIdx;
    
    return (
      <React.Fragment key={lvl}>
        {/* Enhanced step line with glow effect for current step */}
        <div
          className={`absolute h-2 rounded-full transition-all duration-500 ease-out ${
            isCurrentStep 
              ? 'bg-[var(--color-companyBlue)] shadow-lg shadow-[var(--color-companyBlue)]/50' 
              : 'bg-slate-400/40 dark:bg-slate-600/50'
          }`}
          style={{ 
            width: `${STEP}px`, 
            left: `${left}px`, 
            top: `${top - 1}px`,
            transform: isCurrentStep ? 'scaleY(1.5)' : 'scaleY(1)'
          }}
        />
        {/* Enhanced label with highlighting */}
        <span
          className={`absolute text-sm font-bold transition-all duration-500 ease-out ${
            isCurrentStep 
              ? 'text-[var(--color-companyBlue)] scale-110' 
              : 'text-slate-600 dark:text-slate-300 scale-100'
          }`}
          style={{ 
            left: `${left + STEP + 12}px`, 
            top: `${top - 8}px`,
          }}
        >
          {lvl}
        </span>
      </React.Fragment>
    );
  })}
  
  {/* Enhanced animated ball */}
  {(() => {
    const STEP = 60;
    const left = esgIdx * STEP + STEP / 2;
    const top = (esgLevels.length - esgIdx - 1) * STEP;
    
    return (
      <div
        className={`absolute size-6 rounded-full bg-gradient-to-br from-[var(--color-companyBlue)] to-blue-600 
                   shadow-lg shadow-[var(--color-companyBlue)]/40 border-2 border-white dark:border-slate-800
                   transition-all duration-700 ease-out ${
          ballFade ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        } ${
          isJumping ? 'transform -translate-y-3 scale-110' : 'transform translate-y-0 scale-100'
        }`}
        style={{ 
          left: `${left}px`, 
          top: `${top - 12}px`, 
          transform: `translate(-50%, -50%) ${isJumping ? 'translateY(-12px) scale(1.1)' : 'translateY(0) scale(1)'}`,
          transitionProperty: 'opacity, transform, box-shadow',
          transitionDuration: ballFade ? '800ms' : isJumping ? '300ms' : '700ms',
          transitionTimingFunction: isJumping ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'ease-out'
        }}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />
      </div>
    );
  })()}
  

</div>
        </div>
      </section>

      <Footer />
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}