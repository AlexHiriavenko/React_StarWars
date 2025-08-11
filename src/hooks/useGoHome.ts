import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useLS } from '@/hooks';
import { swapiApi } from '@/redux/api/swapiApi';

type GoHomeOptions = {
  replace?: boolean;
  resetCache?: boolean;
};

type GoHomeFn = (opts?: GoHomeOptions) => void;

export function useGoHome(): GoHomeFn {
  const navigate = useNavigate();
  const { getLS } = useLS();
  const dispatch = useDispatch();

  return useCallback(
    (opts: GoHomeOptions = {}): void => {
      const { replace = false, resetCache = false } = opts;

      if (resetCache) {
        dispatch(swapiApi.util.invalidateTags(['People', 'Person']));
      }

      const search = getLS<string>('search') ?? '';

      const params = {
        page: '1',
        ...(search ? { search } : {}),
      };

      navigate(
        {
          pathname: '/',
          search: createSearchParams(params).toString(),
        },
        { replace }
      );
    },
    [navigate, getLS, dispatch]
  );
}
