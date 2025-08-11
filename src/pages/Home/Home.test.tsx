import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { BASE_URL } from '@/services/constants';
import Home from './Home';
import { server } from '@/mocks/server';
import { TestProviders } from '@/mocks/TestProviders';

function LocationProbe(): JSX.Element {
  const loc = useLocation();
  return (
    <div data-testid="loc">
      {loc.pathname}
      {loc.search}
    </div>
  );
}

const renderHome = (initial = '/?page=1') =>
  render(
    <TestProviders>
      <MemoryRouter initialEntries={[initial]}>
        <Home />
      </MemoryRouter>
    </TestProviders>
  );

describe('Home (RTK Query + MSW)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Home and displays character list from API', async () => {
    renderHome();

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    const characterName = await screen.findByText(/Luke Skywalker/i);
    expect(characterName).toBeInTheDocument();

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('renders "No characters found" if API returns empty array', async () => {
    renderHome('/?page=1&search=fail');

    const emptyText = await screen.findByText(/no characters found/i);
    expect(emptyText).toBeInTheDocument();

    expect(screen.queryByText(/Luke Skywalker/i)).not.toBeInTheDocument();
  });

  it('renders multiple characters if API returns them', async () => {
    server.use(
      http.get(`${BASE_URL}people`, () =>
        HttpResponse.json(
          {
            count: 3,
            results: [
              { name: 'Luke Skywalker', url: `${BASE_URL}people/1` },
              { name: 'Leia Organa', url: `${BASE_URL}people/2` },
              { name: 'Han Solo', url: `${BASE_URL}people/3` },
            ],
          },
          { status: 200 }
        )
      )
    );

    renderHome();

    expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
    expect(screen.getByText(/Han Solo/i)).toBeInTheDocument();
  });

  it('renders multiple characters if API returns them', async () => {
    server.use(
      http.get('*/people', () =>
        HttpResponse.json(
          {
            count: 3,
            results: [
              { name: 'Luke Skywalker', url: `${BASE_URL}people/1` },
              { name: 'Leia Organa', url: `${BASE_URL}people/2` },
              { name: 'Han Solo', url: `${BASE_URL}people/3` },
            ],
          },
          { status: 200 }
        )
      )
    );

    renderHome('/?page=2');

    expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(await screen.findByText(/Leia Organa/i)).toBeInTheDocument();
    expect(await screen.findByText(/Han Solo/i)).toBeInTheDocument();
  });

  it('renders FetchError if API request fails', async () => {
    server.use(http.get(`${BASE_URL}people`, () => HttpResponse.error()));

    renderHome();

    // ждём отображения нашего компонента ошибки
    const title = await screen.findByText(/Ошибка при загрузке персонажей./i);
    expect(title).toBeInTheDocument();

    // и лоадер к этому моменту уже не показан
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('инициализирует search из LocalStorage, если его нет в URL', async () => {
    // useLS хранит JSON-значение, поэтому оборачиваем строку в JSON
    localStorage.setItem('search', JSON.stringify('fail'));

    render(
      <TestProviders>
        <MemoryRouter initialEntries={['/?page=1']}>
          <Routes>
            <Route
              path="/*"
              element={
                <>
                  <LocationProbe />
                  <Home />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </TestProviders>
    );

    const emptyText = await screen.findByText(/no characters found/i);
    expect(emptyText).toBeInTheDocument();

    const loc = screen.getByTestId('loc').textContent!;
    expect(loc.startsWith('/?')).toBe(true);
    expect(loc.includes('page=1')).toBe(true);
    expect(loc.includes('search=fail')).toBe(true);
  });

  it('Hard Refresh инвалидирует кеш и перезапрашивает список', async () => {
    let toggle = false;

    server.use(
      http.get('*/people', async () => {
        await delay(20);
        toggle = !toggle;
        const results = toggle
          ? [{ name: 'Luke Skywalker', url: `${BASE_URL}people/1` }]
          : [{ name: 'Mace Windu', url: `${BASE_URL}people/20` }];
        return HttpResponse.json({ count: 1, results }, { status: 200 });
      })
    );

    renderHome('/?page=1');

    expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /hard refresh/i }) // если текст другой — замени на свой
    );

    expect(await screen.findByText(/Mace Windu/i)).toBeInTheDocument();
  });
});
