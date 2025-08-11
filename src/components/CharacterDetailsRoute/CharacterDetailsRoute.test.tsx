import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes, Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { BASE_URL } from '@/services/constants';
import { CharacterDetailsRoute } from './CharacterDetailsRoute';
import { server } from '@/mocks/server';
import { TestProviders } from '@/mocks/TestProviders';

function WrapperWithContext() {
  const dummySearchParams = new URLSearchParams({ search: 'test' });
  return <Outlet context={{ searchParams: dummySearchParams }} />;
}

function renderDetails(initialEntry: string) {
  return render(
    <TestProviders>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route element={<WrapperWithContext />}>
            <Route path="/details" element={<CharacterDetailsRoute />} />
            <Route path="/details/:id" element={<CharacterDetailsRoute />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </TestProviders>
  );
}

describe('CharacterDetailsRoute (RTK Query + MSW)', () => {
  it('рендерит данные, отданные MSW для id=1 (LukeTest)', async () => {
    renderDetails('/details/1');

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    const name = await screen.findByText(/LukeTest/i);
    expect(name).toBeInTheDocument();

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('показывает FetchError при 404', async () => {
    server.use(
      http.get(`${BASE_URL}people/:id`, ({ params }) => {
        return HttpResponse.json(
          { detail: `Character with ID ${params.id} not found` },
          { status: 404 }
        );
      })
    );

    renderDetails('/details/999');

    const title = await screen.findByText(/Ошибка при загрузке персонажа/i);
    expect(title).toBeInTheDocument();
  });

  it('skip без id: ничего не рендерит', async () => {
    renderDetails('/details');

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByText(/Luke/i)).not.toBeInTheDocument();
  });

  it('при ошибке: Try again вызывает refetch и после повторного запроса показывается карточка', async () => {
    let first = true;
    server.use(
      http.get(`${BASE_URL}people/:id`, ({ params }) => {
        if (first) {
          first = false;
          return HttpResponse.json(
            { detail: `Character with ID ${params.id} not found` },
            { status: 404 }
          );
        }
        return HttpResponse.json(
          { name: 'LukeTest', gender: 'male', url: `${BASE_URL}people/1` },
          { status: 200 }
        );
      })
    );

    renderDetails('/details/999');

    expect(
      await screen.findByText(/Ошибка при загрузке персонажа/i)
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findByText(/LukeTest/i)).toBeInTheDocument();
  });

  it('при ошибке: Home Page вызывает goHome и ведёт на "/?page=1"', async () => {
    server.use(
      http.get(`${BASE_URL}people/:id`, () =>
        HttpResponse.json({ detail: 'Not found' }, { status: 404 })
      )
    );

    function LocationProbe() {
      const loc = useLocation();
      return (
        <div data-testid="loc">
          {loc.pathname}
          {loc.search}
        </div>
      );
    }

    render(
      <TestProviders>
        <MemoryRouter initialEntries={['/details/999']}>
          <LocationProbe />
          <Routes>
            <Route element={<WrapperWithContext />}>
              <Route path="/details/:id" element={<CharacterDetailsRoute />} />
            </Route>
            <Route path="/" element={<div>root</div>} />
          </Routes>
        </MemoryRouter>
      </TestProviders>
    );

    expect(
      await screen.findByText(/Ошибка при загрузке персонажа/i)
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /home page/i }));
    expect(screen.getByTestId('loc').textContent).toContain('/?page=1');
  });

  it('closeCard навигирует на "/?search=test"', async () => {
    function LocationProbe() {
      const loc = useLocation();
      return (
        <div data-testid="loc">
          {loc.pathname}
          {loc.search}
        </div>
      );
    }

    render(
      <TestProviders>
        <MemoryRouter initialEntries={['/details/1']}>
          <LocationProbe />
          <Routes>
            <Route element={<WrapperWithContext />}>
              <Route path="/details/:id" element={<CharacterDetailsRoute />} />
            </Route>
            <Route path="/" element={<div>root</div>} />
          </Routes>
        </MemoryRouter>
      </TestProviders>
    );

    expect(await screen.findByText(/LukeTest/i)).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('icon-btn'));

    expect(screen.getByTestId('loc').textContent).toBe('/?search=test');
  });
});
