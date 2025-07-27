import type { Character } from '@/types/AppTypes';
import { Loader, CloseButton } from '@/components/baseComponents';
import { getIdFromURL } from '@/utils';

interface CardProps {
  card: Character | null;
  closeCard: () => void;
  loadingDetails?: boolean;
}

const Card = ({ card, closeCard, loadingDetails }: CardProps): JSX.Element => {
  if (loadingDetails) {
    return (
      <div
        className="relative w-[220px] h-[324px] overflow-y-auto text-accent border border-white/50
                 bg-gradient-to-b from-black/50 to-black/40 text-shadow-sm flex flex-col items-center mx-auto"
        role="article"
      >
        <Loader size={40} />
      </div>
    );
  }

  if (card) {
    const characterID = getIdFromURL(card.url);
    const characterPhoto = `https://raw.githubusercontent.com/vieraboschkova/swapi-gallery/refs/heads/gh-pages/static/assets/img/people/${characterID}.jpg`;

    return (
      <div
        className="relative w-[230px] h-[344px] overflow-y-auto text-accent
                 bg-gradient-to-b from-black/60 to-black/50 text-shadow-sm flex flex-col items-center mx-auto"
        role="article"
      >
        <h3 className="my-2 text-lg font-semibold">{card.name || 'unknown'}</h3>
        <p className="text-sm text-white mb-2">
          gender: {card.gender || 'unknown'}
        </p>
        <p className="text-sm text-white mb-2">
          birth year: {card.birth_year || 'unknown'}
        </p>
        <img src={characterPhoto} alt="character photo" width={154} />
        <CloseButton color="white" size={22} onClick={closeCard} />
      </div>
    );
  }
};

export { Card };
