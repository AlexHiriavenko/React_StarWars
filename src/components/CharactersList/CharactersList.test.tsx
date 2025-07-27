import type { Character } from '@/types/AppTypes';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate, useMatch } from 'react-router-dom';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { CharacterList } from '@/components/CharactersList/CharactersList';

vi.mock('react-router-dom', () => {
  const mockNavigate = vi.fn();
  const mockUseMatch = vi.fn();

  return {
    useNavigate: () => mockNavigate,
    useMatch: mockUseMatch,
    __esModule: true,
  };
});

describe('CharacterList', () => {
  const sampleCharacters: Character[] = [
    {
      name: 'Luke Skywalker',
      gender: 'male',
      url: 'https://swapi.py4e/api/people/1/',
    },
    {
      name: 'Leia Organa',
      gender: 'female',
      url: 'https://swapi.py4e/api/people/5/',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMatch).mockReturnValue(null);
  });

  it('renders "No characters found" if array is empty', () => {
    render(<CharacterList characters={[]} />);
    expect(screen.getByText(/no characters found/i)).toBeInTheDocument();
  });

  it('renders all character names with heading', () => {
    render(<CharacterList characters={sampleCharacters} />);
    expect(screen.getByText(/characters/i)).toBeInTheDocument();
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
  });

  it('navigates to details page on click', () => {
    const navigateSpy = vi.mocked(useNavigate);
    const params = new URLSearchParams({ search: 'luke', page: '2' });

    render(
      <CharacterList characters={sampleCharacters} searchParams={params} />
    );
    fireEvent.click(screen.getByText(/Leia Organa/i));

    expect(navigateSpy()).toHaveBeenCalledWith('/details/5?search=luke&page=2');
  });

  it('adds "text-accent" class to selected character from URL', () => {
    vi.mocked(useMatch).mockReturnValue({
      params: { id: '1' },
      pathname: '/details/1',
      pathnameBase: '/details',
      pattern: { path: '/details/:id', caseSensitive: false, end: true },
    });

    render(<CharacterList characters={sampleCharacters} />);
    expect(screen.getByText(/Luke Skywalker/i)).toHaveClass('text-accent');
    expect(screen.getByText(/Leia Organa/i)).toHaveClass('text-white');
  });
});
