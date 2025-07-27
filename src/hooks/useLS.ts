import { useCallback } from 'react';

type UseLS = {
  setLS: <T>(key: string, val: T) => void;
  getLS: <T>(key: string) => T | null;
  removeLS: (key: string) => void;
};

export const useLS = (): UseLS => {
  const setLS = useCallback(<T>(key: string, val: T): void => {
    localStorage.setItem(key, JSON.stringify(val));
  }, []);

  const getLS = useCallback(<T>(key: string): T | null => {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  }, []);

  const removeLS = useCallback((key: string): void => {
    localStorage.removeItem(key);
  }, []);

  return { setLS, getLS, removeLS };
};
