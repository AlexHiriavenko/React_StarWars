import type { Character } from '@/types/AppTypes';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { FetchError } from '@/components/baseComponents';
import { Card } from '@/components/Card';
import { useGoHome } from '@/hooks';
import { useGetPersonQuery } from '@/redux/api/swapiApi';

function CharacterDetailsRoute(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { searchParams } = useOutletContext<{
    searchParams: URLSearchParams;
  }>();
  const goHome = useGoHome();

  const { data, isLoading, isError, error, isFetching, refetch } =
    useGetPersonQuery(id as string, {
      skip: !id,
    });

  if (isError)
    return (
      <FetchError
        title="Ошибка при загрузке персонажей."
        error={error}
        onRetry={() => refetch()}
        onGoHome={() => goHome({ replace: true, resetCache: true })}
        disabled={isFetching}
      />
    );

  return (
    <Card
      card={(data as Character) ?? null}
      loadingDetails={isLoading}
      closeCard={() => navigate(`/?${searchParams.toString()}`)}
    />
  );
}

export { CharacterDetailsRoute };
