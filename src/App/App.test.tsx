import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
import App from './App';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

describe('App Component (MSW)', () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'luke'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

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
      http.get('https://swapi.py4e.com/api/people', () => {
        return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
      })
    );

    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'fail'), // simulate bad search
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/no search results/i)).toBeInTheDocument();
    });
  });

  it('calls localStorage.getItem("search") and uses empty fallback when null', async () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null), // if value is "null"
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(localStorage.getItem).toHaveBeenCalledWith('search');
  });
});
