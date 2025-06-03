'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';   // adjust path if ThemeProvider lives elsewhere

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  /* prevent hydration mismatch: render a deterministic icon on the server */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current   = theme === 'light' ? 'light' : 'dark';
  const Icon      = current === 'light' ? Moon : Sun;
  const toggle    = () => setTheme(current === 'light' ? 'dark' : 'light');

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {mounted ? <Icon size={20} /> : <Sun size={20} />}  {/* static fallback on SSR */}
    </button>
  );
};

export default ThemeToggle;