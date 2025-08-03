import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { routes } from './routes';
import { server } from '@/mocks/server';
import { TestProviders } from '@/mocks/TestProviders';
import { AppRouter } from '@/router/AppRouter';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AppRouter integration', () => {
  it('рендерит fallback из Suspense', () => {
    render(
      <TestProviders>
        <AppRouter />
      </TestProviders>
    );
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('отображает Home при маршруте "/"', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    render(
      <TestProviders>
        <RouterProvider router={router} />
      </TestProviders>
    );
    expect(await screen.findByRole('textbox')).toBeInTheDocument();
  });

  it('отображает About при маршруте "/about"', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/about'] });
    render(
      <TestProviders>
        <RouterProvider router={router} />
      </TestProviders>
    );
    expect(await screen.findByText(/About This App/i)).toBeInTheDocument();
  });

  it('отображает NotFound при неизвестном маршруте', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/unknown'] });
    render(
      <TestProviders>
        <RouterProvider router={router} />
      </TestProviders>
    );
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it('отображает персонажа из API', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    render(
      <TestProviders>
        <RouterProvider router={router} />
      </TestProviders>
    );
    expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
  });
});
