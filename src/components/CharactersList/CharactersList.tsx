import type { Character } from '@/App/AppTypes';
import { CharacterService } from '@/services';
import { getIdFromURL } from '@/utils/getIDfromUrl';

interface CharacterListProps {
  characters: Character[];
  setCard?: (card: Character | null) => void;
  setLoadingDetails?: (loading: boolean) => void;
}

const CharacterList = ({
  characters,
  setCard,
  setLoadingDetails,
}: CharacterListProps): JSX.Element => {
  async function handleCharacterClick(character: Character): Promise<void> {
    setLoadingDetails?.(true);
    setCard?.(null);
    const characterService = new CharacterService();
    const characterId = getIdFromURL(character.url);
    const card = await characterService.fetchCharacter(characterId);
    setCard?.(card || null);
    setLoadingDetails?.(false);
  }

  if (!characters || characters.length === 0) {
    return (
      <div className="w-[40%] max-xs:w-full min-h-[400px] bg-gradient-to-b from-black/50 to-black/40 mx-auto">
        <h3 className="text-white py-4 px-2 text-lg font-bold text-shadow-sm">
          No characters found
        </h3>
      </div>
    );
  }

  return (
    <div className="w-[40%] max-xs:w-full min-h-[400px] bg-gradient-to-b from-black/50 to-black/40">
      <h3 className="text-white py-4 text-lg font-bold text-shadow-sm">
        Characters
      </h3>
      <ul className="pl-4 pb-4">
        {characters.map((character) => (
          <li
            className="text-white text-left mt-4 cursor-pointer text-shadow-sm"
            key={character.url}
            onClick={() => handleCharacterClick(character)}
          >
            {character.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { CharacterList };
