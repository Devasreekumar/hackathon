import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Determine initial theme: prefer saved value, then system preference, then light
  const getInitialTheme = () => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch (e) {
      // ignore (e.g. localStorage not available)
    }
    return 'light';
  };

  const [theme, setTheme] = useState(() => getInitialTheme());

  useEffect(() => {
    try {
      // Apply or remove the dark class on the root element AND body for better CSS selector compatibility
      const isDark = theme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      document.body.classList.toggle('dark', isDark);
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  // Optional: keep in sync with system preference if user hasn't explicitly chosen
  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (!mq || !mq.addEventListener) return;

    const handleChange = (e) => {
      // Only update if user hasn't stored an explicit preference
      try {
        const stored = localStorage.getItem('theme');
        if (stored !== 'light' && stored !== 'dark') {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch (err) {
        // ignore
      }
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}
