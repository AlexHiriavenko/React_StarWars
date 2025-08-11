import { describe, it, expect } from 'vitest';
import { swapiApi } from './api/swapiApi';
import { store } from './store';

describe('redux store', () => {
  it('инициализируется и содержит api-слайс', () => {
    const state = store.getState();
    expect(state).toHaveProperty(swapiApi.reducerPath);
  });

  it('может диспатчить RTKQ util action', () => {
    const action = swapiApi.util.invalidateTags(['People']);
    expect(() => store.dispatch(action)).not.toThrow();
  });
});
