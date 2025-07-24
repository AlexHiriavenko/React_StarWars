import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Search } from '@/components/Search';
import { CharacterService } from '@/services';

describe('Search Component (non-API behavior)', () => {
  const mockUpdateCards = vi.fn();
  const mockSetLoading = vi.fn();
  const mockSetPagination = vi.fn();

  const defaultProps = {
    updateCards: mockUpdateCards,
    setLoading: mockSetLoading,
    setPagination: mockSetPagination,
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders search input and button', () => {
    render(<Search {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows saved search value from localStorage on mount', () => {
    localStorage.setItem('search', 'Luke Skywalker');
    render(<Search {...defaultProps} />);
    expect(screen.getByRole('textbox')).toHaveValue('Luke Skywalker');
  });

  it('shows empty input if no saved value in localStorage', () => {
    render(<Search {...defaultProps} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('updates input value when user types', async () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const user = userEvent.setup();
    await user.type(input, '  Leia  ');
    expect(screen.getByRole('textbox')).toHaveValue('  Leia  ');
  });

  it('saves trimmed search term to localStorage when search button is clicked', () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  Leia Organa  ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('search')).toBe('Leia Organa');
  });

  it('retrieves saved search term on component mount', () => {
    localStorage.setItem('search', 'Obi-Wan');
    render(<Search {...defaultProps} />);
    expect(screen.getByRole('textbox')).toHaveValue('Obi-Wan');
  });

  it('overwrites existing localStorage value when new search is performed', () => {
    localStorage.setItem('search', 'Old Value');
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  New Search  ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('search')).toBe('New Search');
  });

  it('triggers search callback with correct parameters', async () => {
    const fetchSpy = vi
      .spyOn(CharacterService.prototype, 'fetchCharacters')
      .mockResolvedValue([]);

    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  Luke  ' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        { searchValue: 'Luke' },
        expect.any(Function)
      );
    });
  });

  it('handles error when fetchCharacters throws and calls updateCards with []', async () => {
    const fetchSpy = vi
      .spyOn(CharacterService.prototype, 'fetchCharacters')
      .mockRejectedValue(new Error('API failed'));

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Error Test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
      expect(mockUpdateCards).toHaveBeenCalledWith([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Search error:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
