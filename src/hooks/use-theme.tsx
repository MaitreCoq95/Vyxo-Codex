'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, themes, ThemeConfig } from '@/lib/themes/config';

interface ThemeContextType {
  theme: Theme;
  themeConfig: ThemeConfig;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  role = 'operator'
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  role?: 'operator' | 'manager' | 'director';
}) {
  // Initialiser avec defaultTheme pour éviter l'hydration mismatch
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  const themeConfig = themes[theme];

  // Charger le theme depuis localStorage après le mount côté client
  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem('vyxo-theme') as Theme;
    if (stored && themes[stored]) {
      setTheme(stored);
    } else {
      // Smart defaults by role si pas de theme stocké
      if (role === 'operator') setTheme('operator');
      else if (role === 'manager') setTheme('manager');
      else if (role === 'director') setTheme('director');
    }
  }, [role]);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem('vyxo-theme', theme);

    // Apply to document
    document.documentElement.setAttribute('data-theme', theme);

    // Apply dark mode class for shadcn compatibility
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, themeConfig, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
