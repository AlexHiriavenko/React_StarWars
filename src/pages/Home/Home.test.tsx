import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from 'vitest';
import { BASE_URL } from '@/services/constants';
import Home from './Home';
import { server } from '@/mocks/server';
import { TestProviders } from '@/mocks/TestProviders';

describe('Home component', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const renderHome = () =>
    render(
      <TestProviders>
        <MemoryRouter initialEntries={['/']}>
          <Home />
        </MemoryRouter>
      </TestProviders>
    );

  it('renders Home and displays character list from API', async () => {
    renderHome();

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    const characterName = await screen.findByText(/Luke Skywalker/i);
    expect(characterName).toBeInTheDocument();

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('renders "No characters found" if API returns empty array', async () => {
    server.use(
      http.get(`${BASE_URL}people`, () => {
        return HttpResponse.json({ count: 0, results: [] }, { status: 200 });
      })
    );

    renderHome();

    const emptyText = await screen.findByText(/no characters found/i);
    expect(emptyText).toBeInTheDocument();
  });

  it('shows Loader during data fetching and hides it after', async () => {
    renderHome();

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
  });

  it('renders multiple characters if API returns them', async () => {
    server.use(
      http.get(`${BASE_URL}people`, () => {
        return HttpResponse.json(
          {
            count: 3,
            results: [
              {
                name: 'Luke Skywalker',
                url: `${BASE_URL}people/1`,
              },
              {
                name: 'Leia Organa',
                url: `${BASE_URL}people/2`,
              },
              {
                name: 'Han Solo',
                url: `${BASE_URL}people/3`,
              },
            ],
          },
          { status: 200 }
        );
      })
    );

    renderHome();

    expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
    expect(screen.getByText(/Han Solo/i)).toBeInTheDocument();
  });

  it('logs error if fetchCharacters throws', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    server.use(
      http.get(`${BASE_URL}people`, () => {
        return HttpResponse.error();
      })
    );

    renderHome();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
