import type { Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Search } from '@/components/Search';

// -- MOCK useLS -----------------------------------
vi.mock('@/hooks/useLS', async () => {
  const actual =
    await vi.importActual<typeof import('@/hooks/useLS')>('@/hooks/useLS');
  return {
    ...actual,
    useLS: () => ({
      getLS: vi.fn(() => localStorage.getItem('search')),
      setLS: vi.fn((key: string, value: string) => {
        localStorage.setItem(key, value);
      }),
    }),
  };
});

// -- MOCK useNavigate / useLocation (default) -----
const mockNavigate = vi.fn();

let mockPathname = '/';

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: mockPathname }),
  };
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={[mockPathname]}>{children}</MemoryRouter>
);

describe('Search Component', () => {
  let mockSetSearchParams: (params: URLSearchParams) => void;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockSetSearchParams = vi.fn();
    mockPathname = '/';
  });

  it('renders input and button', () => {
    render(<Search setSearchParams={mockSetSearchParams} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('loads value from localStorage on mount', () => {
    localStorage.setItem('search', 'Luke');
    render(<Search setSearchParams={mockSetSearchParams} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByRole('textbox')).toHaveValue('Luke');
  });

  it('starts with empty input if nothing in localStorage', () => {
    render(<Search setSearchParams={mockSetSearchParams} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('updates input when typing', async () => {
    render(<Search setSearchParams={mockSetSearchParams} />, {
      wrapper: Wrapper,
    });
    const input = screen.getByRole('textbox');
    const user = userEvent.setup();
    await user.type(input, 'Vader');

    expect(input).toHaveValue('Vader');
  });

  it('saves trimmed input to localStorage and updates URL params on submit', () => {
    render(<Search setSearchParams={mockSetSearchParams} />, {
      wrapper: Wrapper,
    });

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  Leia  ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('search')).toBe('Leia');

    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.any(URLSearchParams)
    );
    const calledParams = (mockSetSearchParams as Mock).mock.calls[0][0];
    expect(calledParams.get('search')).toBe('Leia');
    expect(calledParams.get('page')).toBe('1');
  });

  it('removes search param if input is empty', () => {
    render(<Search setSearchParams={mockSetSearchParams} />, {
      wrapper: Wrapper,
    });

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('search')).toBe('');

    const calledParams = (mockSetSearchParams as Mock).mock.calls[0][0];
    expect(calledParams.get('search')).toBeNull();
    expect(calledParams.get('page')).toBe('1');
  });

  it('calls navigate("/") if on a details page', () => {
    mockPathname = '/details/2';

    render(<Search setSearchParams={mockSetSearchParams} />, {
      wrapper: Wrapper,
    });

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Yoda' } });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.any(URLSearchParams)
    );
  });
});
