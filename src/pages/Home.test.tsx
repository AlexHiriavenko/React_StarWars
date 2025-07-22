import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '@/pages/Home';
import type { Character } from '@/App/AppTypes';

describe('Home Component - Rendering', () => {
  const sampleCards: Character[] = [
    {
      name: 'Luke Skywalker',
      gender: 'male',
      url: 'https://swapi.py4e.com/api/people/1/',
    },
    {
      name: 'Leia Organa',
      gender: 'female',
      url: 'https://swapi.py4e.com/api/people/5/',
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
