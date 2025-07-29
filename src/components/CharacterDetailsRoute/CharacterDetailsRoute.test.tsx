import type { CharacterResponse } from '@/services/types';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, Outlet } from 'react-router-dom';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
  type MockInstance,
} from 'vitest';
import { CharacterDetailsRoute } from './CharacterDetailsRoute';
import { handlers } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { CharacterService } from '@/services';

function WrapperWithContext() {
  const dummySearchParams = new URLSearchParams({ search: 'test' });
  return <Outlet context={{ searchParams: dummySearchParams }} />;
}

let fetchSpy: MockInstance<(id: string) => Promise<CharacterResponse>>;
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

describe('CharacterDetailsRoute', () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    server.use(...handlers);
    fetchSpy = vi.spyOn(CharacterService.prototype, 'fetchCharacter');
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    server.resetHandlers();
    fetchSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    server.close();
  });

  it('calls fetchCharacter with correct ID and renders mocked data', async () => {
    render(
      <MemoryRouter initialEntries={['/details/1']}>
        <Routes>
          <Route element={<WrapperWithContext />}>
            <Route path="/details/:id" element={<CharacterDetailsRoute />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const name = await screen.findByText(/lukeTest/i);
    expect(name).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith('1');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('handles error when fetchCharacter fails', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <MemoryRouter initialEntries={['/details/999']}>
        <Routes>
          <Route element={<WrapperWithContext />}>
            <Route path="/details/:id" element={<CharacterDetailsRoute />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('999');
    });

    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByText(/Luke/i)).not.toBeInTheDocument();
  });

  it('does not call fetchCharacter if id param is missing', async () => {
    render(
      <MemoryRouter initialEntries={['/details']}>
        <Routes>
          <Route element={<WrapperWithContext />}>
            <Route path="/details" element={<CharacterDetailsRoute />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
