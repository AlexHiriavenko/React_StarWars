import type { Character } from '@/types/AppTypes';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Card } from '@/components/Card';
import { CharacterService } from '@/services';

function CharacterDetailsRoute(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Character | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const navigate = useNavigate();
  const { searchParams } = useOutletContext<{
    searchParams: URLSearchParams;
  }>();

  useEffect(() => {
    if (!id) return;

    const fetchCharacter = async (): Promise<void> => {
      try {
        setLoadingDetails(true);
        const service = new CharacterService();
        const result = await service.fetchCharacter(id);
        setCard(result);
      } catch (error) {
        console.error('Error fetching character details:', error);
        setCard(null);
      } finally {
        setLoadingDetails(false);
      }
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

export { CharacterDetailsRoute };
