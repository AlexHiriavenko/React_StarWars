import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './Home';
import type { Character } from '../AppTypes';

describe('Home Component - Rendering', () => {
  const sampleCards: Character[] = [
    {
      uid: '1',
      name: 'Luke Skywalker',
      description: 'Jedi Knight',
      url: 'url1',
    },
    {
      uid: '2',
      name: 'Leia Organa',
      description: 'Princess of Alderaan',
      url: 'url2',
    },
  ];

  it('renders correct number of items when data is provided', () => {
    render(<Home cards={sampleCards} loading={false} />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(2);
  });

  it('displays "no results" message when data array is empty', () => {
    render(<Home cards={[]} loading={false} />);
    expect(screen.getByText(/no search results/i)).toBeInTheDocument();
  });

  it('shows loading state while fetching data', () => {
    render(<Home cards={[]} loading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
