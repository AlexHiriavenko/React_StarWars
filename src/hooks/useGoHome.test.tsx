import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGoHome } from './useGoHome';
import { makeTestStore } from '@/mocks/TestProviders';
import { swapiApi } from '@/redux/api/swapiApi';

function LocationProbe() {
  const loc = useLocation();
  return (
    <div data-testid="loc">
      {loc.pathname}
      {loc.search}
    </div>
  );
}

// компонент для вызова хука
function TestComp() {
  const goHome = useGoHome();
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => goHome()}>go</button>
      <button onClick={() => goHome({ replace: true, resetCache: true })}>
        goReplaceReset
      </button>
      <button onClick={() => navigate(-1)}>back</button>
      <LocationProbe />
    </div>
  );
}

const setLS = (k: string, v: unknown) =>
  localStorage.setItem(k, JSON.stringify(v));

describe('useGoHome', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('переходит на / с подстановкой search из LS', async () => {
    setLS('search', 'obi');

    const store = makeTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/details/1?page=3']}>
          <TestComp />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByText('go'));

    const loc = screen.getByTestId('loc').textContent!;
    expect(loc.startsWith('/')).toBe(true);
    expect(loc.includes('/?')).toBe(true);
    expect(loc.includes('page=1')).toBe(true);
    expect(loc.includes('search=obi')).toBe(true);

    await userEvent.click(screen.getByText('back'));
    expect(screen.getByTestId('loc')).toHaveTextContent('/details/1?page=3');
  });

  it('resetCache инвалидирует теги и replace не оставляет шага в истории', async () => {
    const store = makeTestStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/details/1?page=2&search=anakin']}>
          <TestComp />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByText('goReplaceReset'));

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: `${swapiApi.reducerPath}/invalidateTags`,
        payload: ['People', 'Person'],
      })
    );

    const locAfter = screen.getByTestId('loc').textContent!;
    expect(locAfter.startsWith('/?')).toBe(true);
    expect(locAfter.includes('page=1')).toBe(true);
    expect(locAfter.includes('search=')).toBe(false);

    await userEvent.click(screen.getByText('back'));

    expect(screen.getByTestId('loc')).toHaveTextContent('/?page=1');
  });
});
