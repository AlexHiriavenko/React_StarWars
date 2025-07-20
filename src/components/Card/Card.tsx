import { Component } from 'react';
import type { Character } from '../../App/AppTypes';
import type { ReactNode } from 'react';

interface CardProps {
  card: Character;
}

interface CardState {
  loading: boolean;
  error: boolean;
}

class Card extends Component<CardProps, CardState> {
  getCharacterID(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
  }

  render(): ReactNode {
    const { card: hero } = this.props;
    const characterID = this.getCharacterID(hero.url);
    const characterPhoto = `https://raw.githubusercontent.com/vieraboschkova/swapi-gallery/refs/heads/gh-pages/static/assets/img/people/${characterID}.jpg`;

    return (
      <div className="card" role="article">
        <h3 className="card__title">{hero.name || 'unknown'}</h3>
        <p className="text-sm text-white mb-2">
          gender: {hero.gender || 'unknown'}
        </p>
        <img src={characterPhoto} alt="character photo" width={154} />
      </div>
    );
  }
}

export default Card;
