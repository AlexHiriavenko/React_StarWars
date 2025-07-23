import type { Character } from '@/App/AppTypes';

interface CardProps {
  card: Character;
}

function getCharacterID(url: string): string {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

const Card = ({ card: hero }: CardProps): JSX.Element => {
  const characterID = getCharacterID(hero.url);
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
};

export { Card };
