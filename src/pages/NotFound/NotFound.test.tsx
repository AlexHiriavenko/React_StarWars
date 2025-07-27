import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFound from './NotFound';

describe('NotFound Page', () => {
  it('renders 404 message', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });
});
