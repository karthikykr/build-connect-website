'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: Theme;
  toggleTheme: () => void;
}

interface Theme {
  PRIMARY: string;
  SECONDARY: string;
  BACKGROUND: string;
  CARD: string;
  ACCENT: string;
  TEXT_PRIMARY: string;
  TEXT_SECONDARY: string;
  SUCCESS: string;
  WARNING: string;
  ERROR: string;
  GRAY: string;
  GRAY_LIGHT: string;
  WHITE: string;
  SHADOW: string;
  GRADIENT_PRIMARY: string;
  GRADIENT_SECONDARY: string;
  LOGO_BORDER: string;
}

const LIGHT_THEME: Theme = {
  PRIMARY: '#2A8E9E',
  SECONDARY: '#001d3d',
  BACKGROUND: '#F5F7FA',
  CARD: '#FFFFFF',
  ACCENT: '#E6F3F7',
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  SUCCESS: '#4CAF50',
  WARNING: '#FFB300',
  ERROR: '#D32F2F',
  GRAY: '#9CA3AF',
  GRAY_LIGHT: '#F3F4F6',
  WHITE: '#FFFFFF',
  SHADOW: '#000000',
  GRADIENT_PRIMARY: '#2A8E9E',
  GRADIENT_SECONDARY: '#001d3d',
  LOGO_BORDER: '#E6F3F7',
};

const DARK_THEME: Theme = {
  PRIMARY: '#2A8E9E',
  SECONDARY: '#001d3d',
  BACKGROUND: '#121212',
  CARD: '#1E1E1E',
  ACCENT: '#1B2A33',
  TEXT_PRIMARY: '#E0E0E0',
  TEXT_SECONDARY: '#B0B0B0',
  SUCCESS: '#4CAF50',
  WARNING: '#FFB300',
  ERROR: '#D32F2F',
  GRAY: '#9CA3AF',
  GRAY_LIGHT: '#374151',
  WHITE: '#FFFFFF',
  SHADOW: '#000000',
  GRADIENT_PRIMARY: '#2A8E9E',
  GRADIENT_SECONDARY: '#001d3d',
  LOGO_BORDER: '#1B2A33',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Update document class and localStorage when theme changes
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { LIGHT_THEME, DARK_THEME };
export type { Theme, ThemeContextType };
