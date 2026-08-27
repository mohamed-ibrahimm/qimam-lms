'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'DARK' | 'LIGHT';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'DARK',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('DARK');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('qimam_theme') as Theme | null;
    if (saved && (saved === 'DARK' || saved === 'LIGHT')) {
      setThemeState(saved);
      applyTheme(saved);
    } else {
      applyTheme('DARK');
    }
  }, []);

  const applyTheme = (t: Theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;
    if (t === 'LIGHT') {
      root.classList.add('light-theme');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      if (body) {
        body.classList.add('light-theme');
        body.classList.remove('dark');
        body.setAttribute('data-theme', 'light');
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#0f172a';
      }
    } else {
      root.classList.remove('light-theme');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      if (body) {
        body.classList.remove('light-theme');
        body.classList.add('dark');
        body.setAttribute('data-theme', 'dark');
        body.style.backgroundColor = '#09080e';
        body.style.color = '#f4f4f5';
      }
    }
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('qimam_theme', t);
    applyTheme(t);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'DARK' ? 'LIGHT' : 'DARK';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
