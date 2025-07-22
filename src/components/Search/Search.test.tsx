import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Search } from '@/components/Search';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
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
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Luke Skywalker');
  });

  it('shows empty input if no saved value in localStorage', () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('updates input value when user types', async () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const user = userEvent.setup();
    await user.type(input, '  Leia  ');
    expect(input.value).toBe('  Leia  ');
  });

  it('saves trimmed search term to localStorage when search button is clicked', () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  Leia Organa  ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('search')).toBe('Leia Organa');
  });

  it('retrieves saved search term on component mount', () => {
    localStorage.setItem('search', 'Obi-Wan');
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Obi-Wan');
  });

  it('overwrites existing localStorage value when new search is performed', () => {
    localStorage.setItem('search', 'Old Value');
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
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
});
