import type { AppDispatch } from '@/redux/store';
import type { Character } from '@/types/AppTypes';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  useSearchParams,
  useNavigate,
  Outlet,
  useLocation,
  useMatch,
} from 'react-router-dom';
import { Loader } from '@/components/baseComponents';
import { FetchError } from '@/components/baseComponents';
import { CharacterList } from '@/components/CharactersList/CharactersList';
import { Flyout } from '@/components/Flyout';
import Pagination from '@/components/Pagination/Pagination';
import { RefreshPanel } from '@/components/RefreshPanel';
import { Search } from '@/components/Search';
import { useGoHome } from '@/hooks';
import { useLS } from '@/hooks';
import { swapiApi, useGetPeopleQuery } from '@/redux/api/swapiApi';
import { AppRoutes } from '@/router/AppRoutes';

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { getLS } = useLS();
  const [searchParams, setSearchParams] = useSearchParams();
  const goHome = useGoHome();

  useEffect(() => {
    let needUpdate = false;
    const next = new URLSearchParams(searchParams);

    if (!next.get('page')) {
      next.set('page', '1');
      needUpdate = true;
    }

    if (!next.get('search')) {
      const savedSearch = getLS<string>('search') || '';
      if (savedSearch) {
        next.set('search', savedSearch);
        needUpdate = true;
      }
    }

    if (needUpdate) setSearchParams(next);
  }, [getLS, searchParams, setSearchParams]);

  const page = useMemo(
    () => Number(searchParams.get('page') || '1'),
    [searchParams]
  );

  const search = useMemo(
    () => searchParams.get('search') || '',
    [searchParams]
  );

  const match = useMatch('/details/:id');
  const currentId = match?.params.id ?? null;

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetPeopleQuery({ page, search });

  const cards: Character[] = data?.results ?? [];
  const totalPages = Math.ceil((data?.count ?? 0) / 10) || 1;

  const handlePageChange = (newPage: number): void => {
    const isOutlet = location.pathname.includes(AppRoutes.DETAILS);
    if (isOutlet) navigate('/');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  const softRefresh = (): void => {
    // рефреш для списка
    refetch();
    if (currentId) {
      // рефреш для карточки если она открыта
      dispatch(swapiApi.util.prefetch('getPerson', currentId, { force: true }));
    }
  };

  const hardRefresh = (): void => {
    dispatch(swapiApi.util.invalidateTags(['People', 'Person']));
  };

  return (
    <div className="min-h-[calc(100vh-60px)] max-md:min-h-[calc(100vh-136px)] pt-10 pb-20 max-md:pb-26">
      <Search setSearchParams={setSearchParams} />

      <RefreshPanel
        onSoftRefresh={softRefresh}
        onHardRefresh={hardRefresh}
        disabled={isLoading || isFetching}
      />

      <section className="flex w-full max-w-[1090px] mx-auto mt-6 gap-4 justify-center max-xs:flex-col">
        <div className="w-[60%] max-xs:w-full min-h-[500px] flex justify-center">
          {(isLoading || isFetching) && <Loader size={60} />}

          {isError && (
            <FetchError
              title="Ошибка при загрузке персонажей."
              error={error}
              onRetry={() => refetch()}
              onGoHome={() => goHome({ replace: true, resetCache: true })}
              disabled={isFetching}
            />
          )}

          {!isLoading && !isFetching && !isError && (
            <CharacterList characters={cards} searchParams={searchParams} />
          )}
        </div>

        <div className="w-[40%] max-xs:w-full">
          <Outlet context={{ searchParams }} />
        </div>
      </section>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <Flyout />
    </div>
  );
}
