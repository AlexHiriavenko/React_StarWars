import type { Theme } from './ThemeContext';
import { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { useLS } from '@/hooks';

export const ThemeProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [theme, setTheme] = useState<Theme>('light');
  const { getLS, setLS } = useLS();

  useEffect(() => {
    const root = document.documentElement;
    const stored = getLS('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    const isValidTheme = stored === 'dark' || stored === 'light';
    const initialTheme: Theme = isValidTheme
      ? stored
      : prefersDark
        ? 'dark'
        : 'light';

    setTheme(initialTheme);
    root.classList.toggle('dark', initialTheme === 'dark');
  }, [getLS]);

  const toggleTheme = (): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setLS('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
