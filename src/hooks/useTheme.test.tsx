import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeContext } from '@/components/ThemeContext/ThemeContext';
import type { ThemeContextValue } from '@/components/ThemeContext/ThemeContext';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  it('throws error if used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('returns context value if used inside ThemeProvider', () => {
    const mockContext: ThemeContextValue = {
      theme: 'dark',
      toggleTheme: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={mockContext}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');
    expect(result.current.toggleTheme).toBe(mockContext.toggleTheme);
  });
});
