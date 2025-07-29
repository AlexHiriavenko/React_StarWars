import type { Character } from '@/types/AppTypes';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from '@/components/Card/Card';

describe('Card Component', () => {
  const sampleCharacter: Character = {
    name: 'Luke Skywalker',
    gender: 'male',
    birth_year: '19BBY',
    url: 'https://swapi.py4e/api/people/1/',
  };

  it('renders Loader when loadingDetails is true', () => {
    render(<Card card={sampleCharacter} closeCard={vi.fn()} loadingDetails />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveTextContent('Loading...');
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders character info when card is provided', () => {
    render(<Card card={sampleCharacter} closeCard={vi.fn()} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/gender: male/i)).toBeInTheDocument();
    expect(screen.getByText(/birth year: 19BBY/i)).toBeInTheDocument();
    expect(screen.getByAltText(/character photo/i)).toBeInTheDocument();
  });

  it('handles missing values gracefully', () => {
    const characterWithMissingFields: Character = {
      name: '',
      gender: '',
      birth_year: '',
      url: 'https://swapi.py4e/api/people/99/',
    };

    render(<Card card={characterWithMissingFields} closeCard={vi.fn()} />);

    expect(screen.getByText('unknown')).toBeInTheDocument();
    expect(screen.getByText('gender: unknown')).toBeInTheDocument();
    expect(screen.getByText('birth year: unknown')).toBeInTheDocument();
  });

  it('calls closeCard when CloseButton is clicked', () => {
    const mockClose = vi.fn();
    render(<Card card={sampleCharacter} closeCard={mockClose} />);

    const closeBtn = screen.getByRole('button');
    closeBtn.click();

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
