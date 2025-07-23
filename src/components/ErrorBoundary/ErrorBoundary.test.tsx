import type { JSX } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function ThrowingComponent(): JSX.Element {
  throw new Error('Test error');
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children without error', () => {
    render(
      <ErrorBoundary>
        <p>Safe child</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe child')).toBeInTheDocument();
  });

  it('catches and handles JavaScript errors in child components', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(
      screen.getByText(/caught by errorboundary: something went wrong/i)
    ).toBeInTheDocument();
  });

  it('logs error to console with correct message', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();

    const calls = consoleErrorSpy.mock.calls;

    const hasBoundaryLog = calls.some(
      ([msg]) =>
        typeof msg === 'string' && msg.includes('Caught by ErrorBoundary:')
    );

    expect(hasBoundaryLog).toBe(true);
  });
});
