import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { BASE_URL } from '@/services/constants';
import Home from './Home';
import { server } from '@/mocks/server';
import { TestProviders } from '@/mocks/TestProviders';

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

  // it('renders multiple characters if API returns them', async () => {
  //   server.use(
  //     http.get(`${BASE_URL}people`, () =>
  //       HttpResponse.json(
  //         {
  //           count: 3,
  //           results: [
  //             { name: 'Luke Skywalker', url: `${BASE_URL}people/1` },
  //             { name: 'Leia Organa', url: `${BASE_URL}people/2` },
  //             { name: 'Han Solo', url: `${BASE_URL}people/3` },
  //           ],
  //         },
  //         { status: 200 }
  //       )
  //     )
  //   );

  //   renderHome();

  //   expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Han Solo/i)).toBeInTheDocument();
  // });

  it('renders multiple characters if API returns them', async () => {
    server.use(
      // маска по origin — игнорируем нюансы BASE_URL и query-параметров
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

    // можно и '/?page=1', но '/?page=2' вовсе исключит какие-либо сомнения с кешом
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
});
