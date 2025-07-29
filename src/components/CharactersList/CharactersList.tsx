import type { Character } from '@/types/AppTypes';
import classNames from 'classnames';
import { useNavigate, useMatch } from 'react-router-dom';
import { AppRoutes } from '@/router/AppRoutes';
import { getIdFromURL } from '@/utils';

interface CharacterListProps {
  characters: Character[];
  searchParams?: URLSearchParams;
}

const CharacterList = ({
  characters,
  searchParams,
}: CharacterListProps): JSX.Element => {
  const navigate = useNavigate();
  const match = useMatch('/details/:id');
  const selectedId = match?.params.id;

  const handleCharacterClick = (character: Character): void => {
    const characterId = getIdFromURL(character.url);
    navigate(`${AppRoutes.DETAILS}/${characterId}?${searchParams?.toString()}`);
  };

  if (!characters?.length) {
    return (
      <div className="w-[40%] max-md:w-full min-h-[400px] bg-gradient-to-b from-black/50 to-black/40 mx-auto">
        <h3 className="text-white py-4 px-2 text-lg font-bold text-shadow-sm">
          No characters found
        </h3>
      </div>
    );
  }

  return (
    <div className="w-[40%] max-md:w-full min-h-[476px] max-w-[360px] min-w-[280px] bg-gradient-to-b from-black/70 to-black/60">
      <h3 className="text-white py-4 text-lg font-bold text-shadow-sm">
        Characters
      </h3>
      <ul className="px-4 pb-4">
        {characters.map((character) => {
          const characterId = getIdFromURL(character.url);
          const isSelected = selectedId === characterId;

          return (
            <li
              key={character.url}
              onClick={() => handleCharacterClick(character)}
              className={classNames(
                'mt-4 cursor-pointer text-left text-shadow-sm hover:bg-white/10 py-1/4',
                {
                  'text-accent': isSelected,
                  'text-white': !isSelected,
                }
              )}
            >
              {character.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { CharacterList };
