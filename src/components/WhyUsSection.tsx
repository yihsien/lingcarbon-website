'use client';

import React from 'react';
import { Settings, Briefcase, ShieldCheck, Zap, Users2 } from 'lucide-react';
import { useTheme } from './ThemeProvider'; // Adjust path if needed
import { useLanguage, translations } from './LanguageProvider'; // Adjust path

// Function to get "Why Us" advantages data (copied from main app for modularity)
const whyUsAdvantagesData = (lang: 'en' | 'zh') => {
  const t = translations[lang];
  return [
    { id: "advantage1", icon: Settings, title: t.advantage1Title, description: t.advantage1Desc, colSpanClass: "lg:col-span-3", rowSpanClass: "lg:row-span-1" },
    { id: "advantage2", icon: Briefcase, title: t.advantage2Title, description: t.advantage2Desc, colSpanClass: "lg:col-span-3", rowSpanClass: "lg:row-span-1" },
    { id: "advantage3", icon: ShieldCheck, title: t.advantage3Title, description: t.advantage3Desc, colSpanClass: "lg:col-span-2", rowSpanClass: "lg:row-span-1" },
    { id: "advantage4", icon: Zap, title: t.advantage4Title, description: t.advantage4Desc, colSpanClass: "lg:col-span-2", rowSpanClass: "lg:row-span-1" },
    { id: "advantage5", icon: Users2, title: t.advantage5Title, description: t.advantage5Desc, colSpanClass: "lg:col-span-2", rowSpanClass: "lg:row-span-1" },
  ];
};


const WhyUsSection: React.FC = () => {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const advantages = whyUsAdvantagesData(language);

  const sectionBgClass = theme === 'bg-transparent'; 
  const cardBgClass = theme === 'dark' ? 'dark:bg-slate-800/60 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md';
  const textColorClass = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const subTextColorClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const highlightColorClass = theme === 'dark' ? 'text-[var(--color-sky-400)]' : 'text-[var(--color-companyBlue)]';
  
  const iconColorMapping: { [key: string]: string } = {
    Settings: highlightColorClass,
    Briefcase: highlightColorClass,
    ShieldCheck: highlightColorClass,
    Zap: highlightColorClass,
    Users2: highlightColorClass,
  };

  return (
    <section id="why-us" className={`py-20 sm:py-32 ${sectionBgClass} relative z-10`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-base font-semibold leading-7 ${highlightColorClass}`}>{t.whyUsSubtitle}</h2>
          <p className={`mt-2 text-4xl sm:text-5xl font-bold tracking-tight ${textColorClass}`}>
            {t.whyUsTitle}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-6 lg:grid-rows-2 lg:gap-8">
          {advantages.map((advantage) => {
            const IconComponent = advantage.icon;
            return (
              <div key={advantage.id} className={`relative ${advantage.colSpanClass} ${advantage.rowSpanClass}`}>
                <div className={`absolute inset-px rounded-xl ${cardBgClass}`} />
                <div className={`relative flex flex-col h-full overflow-hidden rounded-[calc(0.75rem+1px)] p-6 md:p-8`}>
                  <div className={`mb-4 ${iconColorMapping[IconComponent.displayName || 'default'] || highlightColorClass}`}>
                    <IconComponent size={30} strokeWidth={1.5} />
                  </div>
                  <h3 className={`text-lg md:text-xl font-semibold ${textColorClass} mb-2`}>{advantage.title}</h3>
                  <p className={`text-xs sm:text-sm ${subTextColorClass} leading-relaxed flex-grow`}>{advantage.description}</p>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;