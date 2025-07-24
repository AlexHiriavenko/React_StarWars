import { useState, type FormEvent } from 'react';
import type { Character, AppState } from '@/App/AppTypes';
import { CharacterService } from '@/services';

interface SearchProps {
  updateCards: (newCards: Character[]) => void;
  setLoading: (bool: boolean) => void;
  setPagination: (pagination: AppState['pagination']) => void;
}

const Search = ({
  updateCards,
  setLoading,
  setPagination,
}: SearchProps): JSX.Element => {
  const [newSearchValue, setNewSearchValue] = useState(() => {
    return localStorage.getItem('search') || '';
  });

  const handleSearch = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const trimmedValue = newSearchValue.trim();
    localStorage.setItem('search', trimmedValue);

    setLoading(true);
    try {
      const characterService = new CharacterService();
      const characters = await characterService.fetchCharacters(
        { searchValue: trimmedValue },
        setPagination
      );
      updateCards(characters);
    } catch (error) {
      console.error('Search error:', error);
      updateCards([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center gap-3 px-2 overflow-x-hidden w-auto max-md:w-full max-xs:px-1 max-xs:gap-[6px]"
    >
      <input
        id="search"
        type="text"
        placeholder="enter character name"
        value={newSearchValue}
        onChange={(e) => setNewSearchValue(e.target.value)}
        className="px-3 py-2 text-base w-[300px] max-w-[60%] rounded-[12px] outline-none border-none bg-input max-xs:max-w-[60%]"
      />

      <button
        type="submit"
        className="px-3 py-2 text-base font-bold rounded-[16px] border-none w-[96px] min-w-[78px] max-w-[20%] bg-blue-500 text-white"
      >
        Search
      </button>
    </form>
  );
};

export { Search };
