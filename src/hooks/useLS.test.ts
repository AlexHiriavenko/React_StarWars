import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useLS } from './useLS';

describe('useLS', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('sets and gets value from localStorage', () => {
    const { result } = renderHook(() => useLS());

    act(() => {
      result.current.setLS('key', { foo: 'bar' });
    });

    const value = result.current.getLS<{ foo: string }>('key');
    expect(value).toEqual({ foo: 'bar' });
  });

  it('returns null for non-existent key', () => {
    const { result } = renderHook(() => useLS());
    const value = result.current.getLS('unknown');
    expect(value).toBeNull();
  });

  it('removes value from localStorage', () => {
    const { result } = renderHook(() => useLS());

    act(() => {
      result.current.setLS('key', 'value');
      result.current.removeLS('key');
    });

    expect(localStorage.getItem('key')).toBeNull();
  });
});
