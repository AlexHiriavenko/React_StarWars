import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFound from './NotFound';
import { TestProviders } from '@/mocks/TestProviders';

describe('NotFound Page', () => {
  it('renders 404 message', () => {
    render(
      <TestProviders>
        <NotFound />
      </TestProviders>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });
});
