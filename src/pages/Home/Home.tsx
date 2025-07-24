import { useState } from 'react';
import type { Character } from '@/App/AppTypes';
import type { AppState } from '@/App/AppTypes';
import type { CharacterDetails } from '@/App/AppTypes';
import { Loader } from '@/components/baseComponents';
import { Card } from '@/components/Card';
import { CharacterList } from '@/components/CharactersList/CharactersList';
import { Search } from '@/components/Search';

interface HomeProps {
  cards: Character[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  updateCards: (cards: Character[]) => void;
  setPagination: (pagination: AppState['pagination']) => void;
}

const Home = ({
  cards,
  loading,
  setLoading,
  updateCards,
  setPagination,
}: HomeProps): JSX.Element => {
  const [card, setCard] = useState<CharacterDetails>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  if (loading) return <Loader size={80} color="white" />;

  return (
    <div className="mt-[84px] min-h-[calc(100vh-84px)] max-md:mt-[136px] max-md:min-h-[calc(100vh-136px)]">
      <Search
        updateCards={updateCards}
        setLoading={setLoading}
        setPagination={setPagination}
      />
      <section className="flex w-full max-w-[1090px] mx-auto mt-6 gap-4 justify-center max-xs:flex-col">
        <CharacterList
          characters={cards}
          card={card}
          setCard={setCard}
          setLoadingDetails={setLoadingDetails}
        />
        {(card || loadingDetails) && (
          <div className="w-[40%] max-xs:w-full">
            <Card
              card={card}
              setCard={setCard}
              loadingDetails={loadingDetails}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export { Home };
