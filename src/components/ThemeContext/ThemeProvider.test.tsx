import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeSwitcher } from '@/components/ThemeContext/ThemeSwitcher';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from '@/hooks';

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/hooks')>('@/hooks');

  return {
    ...actual,
    useLS: () => ({
      getLS: vi.fn(() => 'dark'),
      setLS: vi.fn(),
    }),
  };
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    vi.spyOn(document.documentElement.classList, 'toggle');
  });

  it('renders children', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('sets theme from localStorage if available', () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <span>{theme}</span>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles theme and updates class + localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();
    act(() => {
      checkbox.click();
    });
    waitFor(() => {
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith(
      'dark',
      true
    );
    expect(
      vi.mocked(document.documentElement.classList.toggle).mock.calls.length
    ).toBeGreaterThanOrEqual(2);
  });

  it('sets theme to light if no localStorage value and prefers-color-scheme is not dark', async () => {
    vi.mock('@/hooks', async () => {
      const actual = await vi.importActual<typeof import('@/hooks')>('@/hooks');
      return {
        ...actual,
        useLS: () => ({
          getLS: () => null,
          setLS: vi.fn(),
        }),
      };
    });

    // Стабим matchMedia: не предпочитает тёмную тему
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { ThemeProvider } = await import('./ThemeProvider');
    const { useTheme } = await import('@/hooks');

    const TestComponent = () => {
      const { theme } = useTheme();
      return <span data-testid="theme">{theme}</span>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme').textContent).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
