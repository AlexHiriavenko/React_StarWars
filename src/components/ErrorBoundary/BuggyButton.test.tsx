import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterAll, beforeEach } from 'vitest';
import BuggyButton from '@/components/ErrorBoundary/BuggyButton';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';

beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
afterAll(() => vi.restoreAllMocks());

describe('BuggyButton', () => {
  it('renders the button with correct text', () => {
    render(<BuggyButton />);
    const button = screen.getByRole('button', { name: /generate error/i });
    expect(button).toBeInTheDocument();
  });

  it('renders fallback UI when error is thrown', async () => {
    render(
      <ErrorBoundary>
        <BuggyButton />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /generate error/i });
    await userEvent.click(button);

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
  });
});
