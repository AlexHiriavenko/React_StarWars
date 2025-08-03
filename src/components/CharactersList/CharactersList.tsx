import type { RootState } from '@/redux/store';
import type { Character } from '@/types/AppTypes';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useMatch } from 'react-router-dom';
import { addItem, removeItem } from '@/redux/slices/selectedCharactersSlice';
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

  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.selectedCharacters.items
  );

  const handleCharacterClick = (character: Character): void => {
    const characterId = getIdFromURL(character.url);
    navigate(`${AppRoutes.DETAILS}/${characterId}?${searchParams?.toString()}`);
  };

  const handleToggleSelect = (character: Character): void => {
    if (selectedItems[character.url]) {
      dispatch(removeItem(character.url));
    } else {
      dispatch(addItem(character));
    }
  };

  if (!characters?.length) {
    return (
      <div
        className="w-[40%] max-md:w-full min-h-[400px] mx-auto
                   bg-gradient-to-b from-white/50 to-white/40
                   dark:from-black/50 dark:to-black/40"
      >
        <h3 className="text-foreground py-4 px-2 text-lg font-bold">
          No characters found
        </h3>
      </div>
    );
  }

  return (
    <div
      className="w-[40%] max-md:w-full min-h-[400px] mx-auto
                 bg-gradient-to-b from-white/50 to-white/40
                 dark:from-black/50 dark:to-black/40"
    >
      <h3 className="text-foreground py-4 text-lg font-bold">Characters</h3>
      <ul className="px-4 pb-4">
        {characters.map((character) => {
          const characterId = getIdFromURL(character.url);
          const isSelectedId = selectedId === characterId;
          const isChecked = !!selectedItems[character.url];

          return (
            <li
              key={character.url}
              className="flex items-center gap-2 mt-4 text-shadow-sm"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggleSelect(character)}
                className="cursor-pointer"
              />
              <span
                onClick={() => handleCharacterClick(character)}
                className={classNames('cursor-pointer hover:bg-white/10 px-1', {
                  'text-accent': isSelectedId,
                  'text-foreground': !isSelectedId,
                })}
              >
                {character.name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { CharacterList };
