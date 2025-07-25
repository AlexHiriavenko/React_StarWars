import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import type { CharacterDetails } from '@/types/AppTypes';
import { Card } from '@/components/Card';
import { CharacterService } from '@/services';

function useSearchParamsFromOutlet(): { searchParams: URLSearchParams } {
  return useOutletContext<{ searchParams: URLSearchParams }>();
}

export default function CharacterDetailsRoute(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CharacterDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const navigate = useNavigate();
  const { searchParams } = useSearchParamsFromOutlet();

  useEffect(() => {
    if (!id) return;

    const fetchCharacter = async (): Promise<void> => {
      setLoadingDetails(true);
      const service = new CharacterService();
      const result = await service.fetchCharacter(id);
      setCard(result);
      setLoadingDetails(false);
    };

    fetchCharacter();
  }, [id]);

  return (
    <Card
      card={card}
      loadingDetails={loadingDetails}
      closeCard={() => navigate(`/?${searchParams.toString()}`)}
    />
  );
}
