import { useContext } from 'react';
import { ThemeContext } from '@/components/ThemeContext/ThemeContext';
import type { ThemeContextValue } from '@/components/ThemeContext/ThemeContext';

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
