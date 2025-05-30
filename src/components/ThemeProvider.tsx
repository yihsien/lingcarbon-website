'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

interface ThemeContextType {
  /** 'light' | 'dark' */
  theme: string;
  setTheme: (t: 'light' | 'dark') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

interface ProviderProps {
  children: ReactNode;
  /** HTML is rendered with this theme on the server so markup is deterministic */
  defaultTheme?: 'light' | 'dark';
  /** localStorage key */
  storageKey?: string;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Strategy                                                                 */
/*  1. Server & first client render ALWAYS use `defaultTheme` (e.g. 'dark')  */
/*     → HTML matches, so no hydration error.                                */
/*  2. After hydration, useEffect reads localStorage and, if different,      */
/*     calls setTheme to switch.                                             */
/*  3. Every theme change updates <html class> + localStorage.               */
/* ────────────────────────────────────────────────────────────────────────── */
export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'vite-ui-theme',
}: ProviderProps) {
  /* 1️⃣  identical value on server and first client paint */
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);

  /* 2️⃣  after mount, check saved preference just once */
  useEffect(() => {
    const saved = (typeof window !== 'undefined'
      ? (localStorage.getItem(storageKey) as 'light' | 'dark' | null)
      : null) ?? defaultTheme;

    if (saved !== theme) setTheme(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run exactly once

  /* 3️⃣  whenever `theme` changes, update <html> class + localStorage */
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value: ThemeContextType = { theme, setTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/* handy hook */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};