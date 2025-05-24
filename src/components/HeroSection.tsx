'use client';

import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider'; // Adjust path if your providers are elsewhere
import { useLanguage } from './LanguageProvider'; // Adjust path

interface HeroSectionProps {
  onContactClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onContactClick }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const carbonSolutionsClasses = theme === 'dark' 
    ? 'text-slate-100' 
    : 'bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-companyBlue)] via-[var(--color-sky-500)] to-[var(--color-green-500)]';
    // Using CSS variables for colors defined in globals.css @theme

  const buttonTextColorClass = theme === 'dark' ? 'text-white' : 'text-[var(--color-companyBlue)]';

  return (
    <section className="relative min-h-screen flex items-center justify-center text-slate-800 dark:text-slate-100 bg-transparent overflow-hidden pt-20">
      {/* Background elements (grid, blobs) are handled globally in layout.tsx or globals.css */}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 relative">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"> 
          <span className="block text-slate-800 dark:text-slate-100">{t.heroTitle1}</span>
          <span 
            className={`relative inline-block ${carbonSolutionsClasses}`}
          >
            {t.heroTitle2}
          </span>
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 dark:text-slate-200 max-w-3xl mx-auto mb-10">{t.heroSubtitle}</p>
        <div className="flex justify-center items-center">
<button
  onClick={onContactClick}
  className={`
    relative group w-[224px] h-[54px] rounded-[27px]
    font-semibold text-lg flex items-center justify-center
    overflow-hidden transition-transform duration-300
    hover:scale-105 focus:outline-none
    ${buttonTextColorClass}
  `}
>
  {/* label */}
  <span className="relative z-10 flex items-center px-8">
    {t.heroCTA}
    <ArrowRight size={22} className="ml-2 transition-transform group-hover:translate-x-1" />
  </span>

  {/* SVG border + glow */}
  <svg
    className="absolute inset-0 h-full w-full pointer-events-none"
    viewBox="0 0 302 56"   /* 300×54 pill + 1-px stroke both sides */
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ray-glow" x1="0" y1="0" x2="302" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#FFFFFF00"/>
        <stop offset="50%"  stopColor="#FFFFFFCC"/>
        <stop offset="100%" stopColor="#FFFFFF00"/>
      </linearGradient>

      <filter id="ray-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* 1 — static border (exactly 1 px) */}
    <rect
      x="0.5" y="0.5" width="301" height="55" rx="27.5"
      stroke="var(--color-companyBlue)"
      strokeWidth="1"
    />

    {/* 2 — moving glow, same 1 px width */}
    <rect
      x="0.5" y="0.5" width="301" height="55" rx="27.5"
      stroke="url(#ray-glow)"
      strokeWidth="1"
      strokeLinecap="round"
      filter="url(#ray-blur)"
      strokeDasharray="110 603"   /* 110-px bright segment, rest gap (perimeter ≈ 713) */
    >
      <animate
        attributeName="stroke-dashoffset"
        values="0;-713"
        dur="3s"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
</button>
        </div>
        <div className="mt-16 animate-bounce-slow"> 
            <a 
              href="#features" 
              className="inline-block text-[var(--color-companyBlue)] hover:text-[var(--color-companyBlue)]/80 dark:text-[var(--color-sky-400)] dark:hover:text-[var(--color-sky-300)] transition-colors"
              aria-label="Scroll to features"
            >
              <ChevronDown size={36} />
            </a> 
        </div>
      </div>
    </section>
  );
};

export default HeroSection;