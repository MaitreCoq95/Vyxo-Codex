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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vyxo-theme') as Theme;
      if (stored && themes[stored]) return stored;
      
      // Smart defaults by role
      if (role === 'operator') return 'operator';
      if (role === 'manager') return 'manager';
      if (role === 'director') return 'director';
    }
    return defaultTheme;
  });

  const themeConfig = themes[theme];

  useEffect(() => {
    localStorage.setItem('vyxo-theme', theme);
    
    // Apply to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply dark mode class for shadcn compatibility
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
