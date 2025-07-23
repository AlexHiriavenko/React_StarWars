import { useState, type ChangeEvent, type FormEvent } from 'react';
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
    <form className="search-form" onSubmit={handleSearch}>
      <input
        id="search"
        className="search-input"
        type="text"
        value={newSearchValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setNewSearchValue(e.target.value);
        }}
        placeholder="enter character name"
      />
      <button className="search-btn" type="submit">
        Search
      </button>
    </form>
  );
};

export { Search };
