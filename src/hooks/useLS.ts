import { useCallback } from 'react';

type UseLS = {
  setLS: <T>(key: string, val: T) => void;
  getLS: <T>(key: string) => T | null;
  removeLS: (key: string) => void;
};

export const useLS = (): UseLS => {
  const setLS = useCallback(<T>(key: string, val: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (error) {
      console.error(`setLS error:`, error);
    }
  }, []);

  const getLS = useCallback(<T>(key: string): T | null => {
    try {
      const data = localStorage.getItem(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error(`getLS error:`, error);
      return null;
    }
  }, []);

  const removeLS = useCallback((key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`removeLS error:`, error);
    }
  }, []);

  return { setLS, getLS, removeLS };
};
