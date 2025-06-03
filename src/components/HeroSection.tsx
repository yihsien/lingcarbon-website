'use client';

import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

interface HeroSectionProps {
  onContactClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onContactClick }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const carbonSolutionsClasses = theme === 'dark' 
    ? 'text-slate-100' 
    : 'bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-companyBlue)] via-[var(--color-sky-500)] to-[var(--color-green-500)]';

  const buttonTextColorClass = theme === 'dark' ? 'text-gray-100' : 'text-white';

  return (
    <section className="relative min-h-screen flex items-center justify-center text-slate-800 dark:text-slate-100 bg-transparent overflow-hidden pt-20">
      {/* Floating orbs for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--color-companyBlue)]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-[var(--color-sky-500)]/10 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-[var(--color-green-500)]/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 relative">
        {/* Title without emerge animations */}
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"> 
            <span className="block text-slate-800 dark:text-slate-100">
              {t.heroTitle1}
            </span>
            <span 
              className={`relative inline-block ${carbonSolutionsClasses}`}
            >
              {t.heroTitle2}
            </span>
          </h1>
        </div>
        
        <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 dark:text-slate-200 max-w-3xl mx-auto mb-10">
          {t.heroSubtitle}
        </p>
        
        {/* Fixed CTA Button with proper styling for both themes */}
        <div className="flex justify-center items-center">
          <button
            onClick={onContactClick}
            className={`
              relative group w-[280px] h-[60px] rounded-[30px] overflow-visible
              font-semibold text-lg flex items-center justify-center
              transition-all duration-300
              hover:scale-105 hover:shadow-2xl focus:outline-none
              ${buttonTextColorClass}
              ${theme === 'dark' 
                ? 'bg-gray-800/90 backdrop-blur-sm' 
                : 'bg-gradient-to-r from-[var(--color-companyBlue)] via-[var(--color-sky-500)]/90 to-[var(--color-companyBlue-light)]/90'
              }
              shadow-lg hover:shadow-xl
            `}
          >
            {/* Dark mode background glow */}
            {theme === 'dark' && (
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-companyBlue)]/20 via-[var(--color-sky-500)]/20 to-[var(--color-green-500)]/20 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
            
            {/* Light mode hover overlay */}
            {theme === 'light' && (
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-companyBlue)]/90 via-[var(--color-sky-500)]/90 to-[var(--color-green-500)]/90 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
            
            {/* Button content */}
            <span className="relative z-20 flex items-center px-8 whitespace-nowrap text-base sm:text-lg transition-[opacity,transform] duration-300">
              {t.heroCTA}
              <ArrowRight size={22} className="ml-2 transition-transform group-hover:translate-x-1" />
            </span>

            {/* Dark mode border effect */}
            {theme === 'dark' && (
              <div className="absolute inset-0 rounded-[30px] overflow-hidden">
                <div className="absolute inset-[-1px] bg-gradient-to-r from-transparent via-[var(--color-companyBlue)] via-[var(--color-sky-500)] to-transparent opacity-60 animate-chase-light"></div>
                <div className="absolute inset-[1px] bg-gray-800/90 rounded-[29px]"></div>
              </div>
            )}
            
            {/* Light mode animated gradient sweep effect */}
            {theme === 'light' && (
              <div className="absolute inset-0 rounded-[30px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-gradient-sweep"></div>
              </div>
            )}
          </button>
        </div>

        {/* Scroll indicator without emerge animation */}
        <div className="mt-16"> 
          <a 
            href="#features" 
            className="inline-flex flex-col items-center text-[var(--color-companyBlue)] hover:text-[var(--color-companyBlue)]/80 dark:text-[var(--color-sky-400)] dark:hover:text-[var(--color-sky-300)] transition-all duration-300 group"
            aria-label="Scroll to features"
          >
            <span className="text-sm font-medium mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
              {t.heroCheveron}
            </span>
            <ChevronDown size={36} className="animate-bounce-gentle group-hover:translate-y-1 transition-transform" />
          </a> 
        </div>
      </div>

      {/* Custom CSS animations - kept only the ones still being used */}
      <style jsx>{`
        @keyframes chase-light {
          0% { transform: translateX(-150%) rotate(0deg); }
          100% { transform: translateX(350%) rotate(0deg); }
        }

        @keyframes gradient-sweep {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .animate-chase-light {
          animation: chase-light 2.5s linear infinite;
        }

        .animate-gradient-sweep {
          animation: gradient-sweep 3s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;