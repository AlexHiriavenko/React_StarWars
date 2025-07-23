import type { Character } from '@/App/AppTypes';
import { Card } from '@/components/Card';

interface HomeProps {
  cards: Character[];
  loading: boolean;
}

const Home = ({ cards, loading }: HomeProps): JSX.Element => {
  if (loading) return <p className="app-loading">Loading...</p>;

  const content =
    cards.length > 0 ? (
      cards.map((card) => <Card key={card.url} card={card} />)
    ) : (
      <p className="app-loading">No search results</p>
    );

  return <section className="cards">{content}</section>;
};

export { Home };
