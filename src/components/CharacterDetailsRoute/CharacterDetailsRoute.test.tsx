// CharacterDetailsRoute.test.tsx (исправленный)
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes, Outlet } from 'react-router-dom';
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

    // до ответа — лоадер
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // важный момент: здесь должен быть ИМЕННО LukeTest — это сигнал, что сработал наш handler
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
});
