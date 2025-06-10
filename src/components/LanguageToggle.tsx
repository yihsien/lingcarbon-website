'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider'; // adjust path if needed

// Persist the chosen language for middleware via a tiny API call.
const useLangCookie = () =>
  useCallback(
    (lang: 'en' | 'zh') =>
      fetch(`/api/lang?set=${lang}`, { method: 'POST' }).catch(() => {}),
    []
  );

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const setLangCookie = useLangCookie();

  /* prevent server / client label mismatch */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggle = () => {
    // Determine the target language
    const newLang = language === 'en' ? 'zh' : 'en';

    // Remove existing lang prefix (/en or /zh) from the current path
    // so that /en/services → /services, /zh → '' (root)
    const basePath = pathname.replace(/^\/(en|zh)/, '') || '';

    // Update context first to avoid hydration flicker
    setLanguage(newLang);
    setLangCookie(newLang);          // server‑side cookie
    document.cookie = `lang=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    router.push(`/${newLang}${basePath}`);
  };

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