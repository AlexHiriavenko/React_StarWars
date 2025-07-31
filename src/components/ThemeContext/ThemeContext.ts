import { createContext } from 'react';

export type Theme = 'dark' | 'light';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// Единый экземпляр контекста
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);
