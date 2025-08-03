import type { Character } from '@/types/AppTypes';
import { describe, it, expect } from 'vitest';
import reducer, {
  addItem,
  removeItem,
  clearItems,
} from './selectedCharactersSlice';

describe('selectedCharactersSlice', () => {
  const initialState = {
    items: {},
  };

  const character: Character = {
    name: 'Luke Skywalker',
    gender: 'male',
    url: 'url-1',
  };

  it('should return the initial state by default', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should handle addItem', () => {
    const nextState = reducer(initialState, addItem(character));
    expect(nextState.items['url-1']).toEqual(character);
  });

  it('should handle removeItem', () => {
    const preState = {
      items: {
        'url-1': character,
      },
    };

    const nextState = reducer(preState, removeItem('url-1'));
    expect(nextState.items).not.toHaveProperty('url-1');
  });

  it('should handle clearItems', () => {
    const preState = {
      items: {
        'url-1': character,
        'url-2': {
          name: 'Leia',
          gender: 'female',
          url: 'url-2',
        },
      },
    };

    const nextState = reducer(preState, clearItems());
    expect(nextState.items).toEqual({});
  });
});
