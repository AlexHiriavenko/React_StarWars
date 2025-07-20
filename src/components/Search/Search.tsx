import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Component } from 'react';
import type { Character, AppState } from '../../App/AppTypes';
import { CharacterService } from '../../services/CharacterService';

interface SearchState {
  newSearchValue: string;
}

interface SearchProps {
  updateCards: (newCards: Character[]) => void;
  setLoading: (bool: boolean) => void;
  setPagination: (pagination: AppState['pagination']) => void;
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      newSearchValue: localStorage.getItem('search') || '',
    };
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ newSearchValue: event.target.value });
  };

  handleSearch = async (event: FormEvent): Promise<void> => {
    const { setLoading, updateCards, setPagination } = this.props;
    setLoading(true);
    event.preventDefault();
    const newSearchValue = this.state.newSearchValue.trim();
    localStorage.setItem('search', newSearchValue);
    const characterService = new CharacterService();
    const characters = await characterService.fetchCharacters(
      { searchValue: newSearchValue },
      setPagination
    );
    updateCards(characters);
    setLoading(false);
  };

  render(): ReactNode {
    const { newSearchValue } = this.state;
    return (
      <form className="search-form" onSubmit={this.handleSearch}>
        <input
          id="search"
          className="search-input"
          type="text"
          value={newSearchValue}
          onChange={this.handleInputChange}
          placeholder="enter character name"
        />
        <button className="search-btn" type="submit">
          Search
        </button>
      </form>
    );
  }
}

export default Search;
