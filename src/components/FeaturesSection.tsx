'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, Calculator, Leaf, Target, Award } from 'lucide-react';
import { useLanguage, translations } from './LanguageProvider'; // Assuming LanguageProvider is in the same folder or adjust path

// Define color classes for services, matching the structure in the main App component
const serviceColorClasses: { [key: string]: { iconText: string; borderHover: string; shadowHover: string } } = {
  companyBlue: { iconText: "text-[var(--color-companyBlue)]", borderHover: "hover:border-[var(--color-companyBlue)]/50", shadowHover: "hover:shadow-[var(--color-companyBlue)]/10 dark:hover:shadow-[var(--color-companyBlue)]/5" },
  purple: { iconText: "text-[var(--color-purple-600)] dark:text-[var(--color-purple-400)]", borderHover: "hover:border-[var(--color-purple-500)]/50", shadowHover: "hover:shadow-[var(--color-purple-500)]/10 dark:hover:shadow-[var(--color-purple-400)]/5" },
  green: { iconText: "text-[var(--color-green-600)] dark:text-[var(--color-green-500)]", borderHover: "hover:border-[var(--color-green-500)]/50", shadowHover: "hover:shadow-[var(--color-green-500)]/10 dark:hover:shadow-[var(--color-green-500)]/5" },
  yellow: { iconText: "text-[var(--color-yellow-500)] dark:text-[var(--color-yellow-400)]", borderHover: "hover:border-[var(--color-yellow-500)]/50", shadowHover: "hover:shadow-[var(--color-yellow-500)]/10 dark:hover:shadow-[var(--color-yellow-400)]/5" },
  pink: { iconText: "text-[var(--color-pink-500)] dark:text-[var(--color-pink-400)]", borderHover: "hover:border-[var(--color-pink-500)]/50", shadowHover: "hover:shadow-[var(--color-pink-500)]/10 dark:hover:shadow-[var(--color-pink-400)]/5" }
};

// Function to get all service data based on language
const allServicesData = (lang: 'en' | 'zh') => {
  const t = translations[lang];
  return [
    { id: "ghg-inventory", icon: ClipboardList, title: t.navServiceGHG, description: t.navServiceGHGDesc, baseColor: "companyBlue" },
    { id: "cfp-calculation", icon: Calculator, title: t.navServiceFootprinting, description: t.navServiceFootprintingDesc, baseColor: "purple" },
    { id: "carbon-neutral-strategy", icon: Leaf, title: t.navServiceStrategy, description: t.navServiceStrategyDesc, baseColor: "green" },
    { id: "sbti-target-setting", icon: Target, title: t.navServiceSBTi, description: t.navServiceSBTiDesc, baseColor: "yellow" }, 
    { id: "esg-ratings-disclosures", icon: Award, title: t.navServiceRatings, description: t.navServiceRatingsDesc, baseColor: "pink" } 
  ];
};


const FeaturesSection: React.FC = () => {
  const { language, t } = useLanguage();
  const services = allServicesData(language);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const scrollSpeed = 0.5; // Adjust for continuous scroll speed; lower is slower

  const scrollManually = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstCardWrapper = container.querySelector(':scope > div') as HTMLElement; // The div that has mx-2
      if (!firstCardWrapper) return;
      
      const cardWidth = firstCardWrapper.offsetWidth + (parseFloat(getComputedStyle(firstCardWrapper).marginLeft) * 2); // card width + mx-2 on both sides
      const scrollAmount = direction === 'right' ? cardWidth : -cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || services.length === 0) return;

    // Duplicate content for seamless looping
    // Clear previous duplicates if services/language changes
    while (container.children.length > services.length) {
      container.removeChild(container.lastChild!);
    }
    const originalChildren = Array.from(container.children);
    originalChildren.forEach(child => {
      container.appendChild(child.cloneNode(true));
    });
    
    let currentScrollLeft = container.scrollLeft;

    const animateScroll = () => {
      if (!isHovering && container) {
        currentScrollLeft -= scrollSpeed; // Scroll to the left
        if (currentScrollLeft <= -(container.scrollWidth / 2)) {
          currentScrollLeft += container.scrollWidth / 2; // Jump back without animation
          container.scrollLeft = currentScrollLeft;
        }
        container.scrollLeft = currentScrollLeft;
      }
      animationFrameIdRef.current = requestAnimationFrame(animateScroll);
    };

    animationFrameIdRef.current = requestAnimationFrame(animateScroll);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isHovering, scrollSpeed, services, language]); // Re-run if services/language changes


  return (
    <section id="features" className="py-20 sm:py-32 bg-transparent text-slate-800 dark:text-slate-100 relative z-10"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-companyBlue)] to-[var(--color-green-500)] dark:from-[var(--color-companyBlue)] dark:to-[var(--color-green-400)]">
              {t.servicesTitle}
            </span>
          </h2> 
          <p className="text-lg text-slate-700 dark:text-slate-200 max-w-2xl mx-auto">{t.servicesSubtitle}</p>
        </div>
        
        <div 
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-hidden py-4 -mx-2 px-2" // overflow-x-hidden for continuous scroll
          >
            {/* Render services (original set + duplicated set for looping) */}
            {/* The duplication is handled in useEffect */}
            {services.map((feature, index) => {
              const IconComponent = feature.icon;
              const colors = serviceColorClasses[feature.baseColor] || serviceColorClasses.companyBlue;
              return (
                <div key={`${feature.id}-original-${index}`} className="flex-shrink-0 w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(33.333%-1rem)] mx-2"> 
                  <div className={`group bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 rounded-xl shadow-lg dark:shadow-black/20 border border-slate-300/30 dark:border-gray-700/50 ${colors.borderHover} transition-all duration-300 transform hover:-translate-y-2 ${colors.shadowHover} flex flex-col h-full`}>
                    <div className={`flex justify-center md:justify-start ${colors.iconText} mb-4 transition-colors`}><IconComponent size={32} strokeWidth={1.5} /></div>
                    <h3 className={`text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100 transition-colors`}>{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 flex-grow text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button 
            onClick={() => scrollManually('left')} 
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-slate-700/50 hover:bg-slate-700/80 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white/50"
            aria-label="Previous Service"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={() => scrollManually('right')} 
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-slate-700/50 hover:bg-slate-700/80 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white/50"
            aria-label="Next Service"
          >
            <ChevronRight size={28} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;