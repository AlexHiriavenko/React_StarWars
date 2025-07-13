import { Component } from 'react';
import type { Character } from '../../AppTypes';
import type { ReactNode } from 'react';

interface CardProps {
  card: Character;
}

interface CardState {
  loading: boolean;
  error: boolean;
}

class Card extends Component<CardProps, CardState> {
  render(): ReactNode {
    const { card: hero } = this.props;
    const characterID = hero.uid;
    const characterPhoto = `https://raw.githubusercontent.com/vieraboschkova/swapi-gallery/refs/heads/gh-pages/static/assets/img/people/${characterID}.jpg`;

    return (
      <div className="card">
        <h3 className="card__title">{hero.name || hero.properties?.name}</h3>
        <p className="text-sm text-white mb-2">{hero.description}</p>
        <img src={characterPhoto} alt="character photo" width={154} />
      </div>
    );
  }
}

export default Card;
