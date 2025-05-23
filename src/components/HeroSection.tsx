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
            className={`relative group w-auto ${buttonTextColorClass} border-2 border-[var(--color-companyBlue)] font-semibold rounded-3xl text-lg transition-all duration-300 transform hover:scale-105 p-px overflow-hidden hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-companyBlue)]/50`}
          > 
            <span className="border-segment top"></span>
            <span className="border-segment right"></span>
            <span className="border-segment bottom"></span>
            <span className="border-segment left"></span>
            <span className={`relative inline-flex items-center justify-center w-full h-full bg-transparent rounded-[calc(1.5rem-2px)] py-3 px-8`}> 
              {t.heroCTA} <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" /> 
            </span>
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