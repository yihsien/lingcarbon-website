'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from './LanguageProvider'; // Assuming LanguageProvider is in the same folder or adjust path

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007d8a] dark:focus:ring-sky-500 flex items-center space-x-1 text-sm font-medium"
      aria-label="Toggle language"
    >
      <Globe size={18} />
      <span>{language === 'en' ? '中文' : 'EN'}</span>
    </button>
  );
};

export default LanguageToggle;