import type { Character } from '@/App/AppTypes';
import { Card } from '@/components/Card';

interface HomeProps {
  cards: Character[];
  loading: boolean;
}

const Home = ({ cards, loading }: HomeProps): JSX.Element => {
  if (loading)
    return (
      <p className="absolute text-[48px] font-bold text-green-500 drop-shadow-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        Loading...
      </p>
    );

  const content =
    cards.length > 0 ? (
      cards.map((card) => <Card key={card.url} card={card} />)
    ) : (
      <p className="absolute text-[48px] font-bold text-green-500 drop-shadow-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        No search results
      </p>
    );

  return (
    <section className="flex flex-wrap w-full max-w-[1090px] mx-auto mt-[84px] max-md:mt-[136px] mb-2 gap-y-4 gap-x-3 justify-center">
      {content}
    </section>
  );
};

export { Home };
