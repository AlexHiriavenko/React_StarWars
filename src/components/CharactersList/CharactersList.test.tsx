import type { Character } from '@/types/AppTypes';
import { render, screen, fireEvent } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useMatch } from 'react-router-dom';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { CharacterList } from '@/components/CharactersList/CharactersList';
import { TestProviders } from '@/mocks/TestProviders';
import { addItem, removeItem } from '@/redux/slices/selectedCharactersSlice';

vi.mock('react-router-dom', () => {
  const mockNavigate = vi.fn();
  const mockUseMatch = vi.fn();

  return {
    useNavigate: () => mockNavigate,
    useMatch: mockUseMatch,
    __esModule: true,
  };
});

vi.mock('react-redux', async () => {
  const actual =
    await vi.importActual<typeof import('react-redux')>('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
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

  const useSelectorMock = vi.mocked(useSelector);
  const useDispatchMock = vi.mocked(useDispatch);
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMatch).mockReturnValue(null);

    useDispatchMock.mockReturnValue(dispatchMock);
    useSelectorMock.mockImplementation((cb) =>
      cb({ selectedCharacters: { items: {} } })
    );
  });

  it('renders "No characters found" if array is empty', () => {
    render(
      <TestProviders>
        <CharacterList characters={[]} />
      </TestProviders>
    );
    expect(screen.getByText(/no characters found/i)).toBeInTheDocument();
  });

  it('renders all character names with heading', () => {
    render(
      <TestProviders>
        <CharacterList characters={sampleCharacters} />
      </TestProviders>
    );
    expect(screen.getByText(/characters/i)).toBeInTheDocument();
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
  });

  it('navigates to details page on click', () => {
    const navigateSpy = vi.mocked(useNavigate);
    const params = new URLSearchParams({ search: 'luke', page: '2' });

    render(
      <TestProviders>
        <CharacterList characters={sampleCharacters} searchParams={params} />
      </TestProviders>
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

    render(
      <TestProviders>
        <CharacterList characters={sampleCharacters} />
      </TestProviders>
    );
    expect(screen.getByText(/Luke Skywalker/i)).toHaveClass('text-accent');
    expect(screen.getByText(/Leia Organa/i)).toHaveClass('text-foreground');
  });

  it('dispatches addItem when checkbox is checked (not selected yet)', () => {
    useSelectorMock.mockImplementation((cb) =>
      cb({ selectedCharacters: { items: {} } })
    );

    render(
      <TestProviders>
        <CharacterList characters={[sampleCharacters[1]]} />
      </TestProviders>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(dispatchMock).toHaveBeenCalledWith(addItem(sampleCharacters[1]));
  });

  it('dispatches removeItem when checkbox is unchecked (already selected)', () => {
    useSelectorMock.mockImplementation((cb) =>
      cb({
        selectedCharacters: {
          items: { [sampleCharacters[1].url]: sampleCharacters[1] },
        },
      })
    );

    render(
      <TestProviders>
        <CharacterList characters={[sampleCharacters[1]]} />
      </TestProviders>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(dispatchMock).toHaveBeenCalledWith(
      removeItem(sampleCharacters[1].url)
    );
  });
});
