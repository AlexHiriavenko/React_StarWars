import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
} from 'vitest';
import { BASE_URL } from '@/services/constants';
import { App } from '@/App';
import { server } from '@/mocks';

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

const mockLocalStorage = (value: string | null) =>
  vi.stubGlobal('localStorage', {
    getItem: vi.fn(() => value),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  });

describe('App Component (MSW)', () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    mockLocalStorage('luke');

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    server.resetHandlers();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    server.close();
  });

  it('renders and fetches characters successfully', async () => {
    render(<App />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/luke skywalker/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('triggers setLoading via Search component', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/enter character name/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'leia' } });
    fireEvent.click(button);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      expect(screen.getByText(/leia/i)).toBeInTheDocument();
    });
  });

  it('handles API failure (404)', async () => {
    server.use(
      http.get(`${BASE_URL}/people`, () => {
        return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
      })
    );

    mockLocalStorage('fail');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/no search results/i)).toBeInTheDocument();
    });
  });

  it('calls localStorage.getItem("search") and uses empty fallback when null', async () => {
    mockLocalStorage(null);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(localStorage.getItem).toHaveBeenCalledWith('search');
  });
});
