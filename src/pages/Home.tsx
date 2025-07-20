import { Component, type ReactNode } from 'react';
import type { Character } from '../AppTypes';
import Card from '../components/Card/Card';

interface HomeProps {
  cards: Character[];
  loading: boolean;
}

class Home extends Component<HomeProps> {
  render(): ReactNode {
    const { cards, loading } = this.props;

    if (loading) {
      return <p className="app-loading">Loading...</p>;
    }

    return (
      <section className="cards">
        {cards?.length ? (
          cards.map((card: Character) => <Card key={card.url} card={card} />)
        ) : (
          <p className="app-loading">No search results</p>
        )}
      </section>
    );
  }
}

export default Home;
