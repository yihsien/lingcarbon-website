'use client';

import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from './LanguageProvider'; // adjust path if needed

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  /* prevent server / client label mismatch */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggle = () => setLanguage(language === 'en' ? 'zh' : 'en');

  /* SSR prints static 'EN' so HTML is deterministic */
  const label = !mounted ? 'EN' : language === 'en' ? '中文' : 'EN';

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center space-x-1 text-sm font-medium"
      aria-label="Toggle language"
      suppressHydrationWarning
    >
      <Globe size={18} />
      <span>{label}</span>
    </button>
  );
};

export default LanguageToggle;