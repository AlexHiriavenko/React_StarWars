import type { Character } from '@/types/AppTypes';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Card } from '@/components/Card';
import { useGetPersonQuery } from '@/redux/api/swapiApi';

function CharacterDetailsRoute(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { searchParams } = useOutletContext<{
    searchParams: URLSearchParams;
  }>();

  const { data, isLoading } = useGetPersonQuery(id as string, {
    skip: !id,
  });

  return (
    <Card
      card={(data as Character) ?? null}
      loadingDetails={isLoading}
      closeCard={() => navigate(`/?${searchParams.toString()}`)}
    />
  );
}

export { CharacterDetailsRoute };
