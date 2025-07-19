import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import { CharacterService } from './services/CharacterService';
import type { Character } from './AppTypes';

vi.mock('./services/CharacterService');

describe('App Component', () => {
  const mockCharacters: Character[] = [
    {
      uid: '1',
      name: 'Luke Skywalker',
      description: 'Jedi',
      url: 'https://swapi.dev/api/people/1/',
    },
  ];

  const fetchCharactersMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(CharacterService.prototype, 'fetchCharacters').mockImplementation(
      fetchCharactersMock
    );

    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'luke'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('loads initial data from localStorage and calls fetchCharacters', async () => {
    fetchCharactersMock.mockResolvedValueOnce(mockCharacters);

    render(<App />);

    expect(screen.getByText('Star Wars')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchCharactersMock).toHaveBeenCalledWith(
        { searchValue: 'luke' },
        expect.any(Function) // setPagination
      );
    });

    expect(screen.getByText(/luke skywalker/i)).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    fetchCharactersMock.mockRejectedValueOnce(new Error('API failure'));

    render(<App />);

    await waitFor(() => {
      expect(fetchCharactersMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/no search results/i)).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('sets loading state correctly during fetch', async () => {
    let resolveFn: (value: Character[]) => void;
    const promise = new Promise<Character[]>((resolve) => {
      resolveFn = resolve;
    });

    fetchCharactersMock.mockReturnValueOnce(promise);

    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolveFn!(mockCharacters);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
});
