import './App.css';
import { useState, useEffect, useCallback } from 'react';
import type { AppState, Character } from '@/App/AppTypes';
import { Search } from '@/components/Search';
import { Home } from '@/pages/';
import { CharacterService } from '@/services';

const initialState: AppState = {
  cards: [],
  loading: false,
  searchParams: {
    searchValue: '',
    searchKey: 'search',
    limit: 10,
  },
  pagination: {
    currentPage: 1,
    nextPage: null,
    prevPage: null,
    total_pages: 1,
  },
};

const App = (): JSX.Element => {
  const [cards, setCards] = useState<Character[]>(initialState.cards);
  const [loading, setLoading] = useState<boolean>(initialState.loading);
  const [searchParams, setSearchParams] = useState(initialState.searchParams);
  const [pagination, setPagination] = useState(initialState.pagination);

  const fetchCharacters = useCallback(async (searchValue: string) => {
    const characterService = new CharacterService();
    setLoading(true);
    try {
      const characters = await characterService.fetchCharacters(
        { searchValue, page: 1 },
        setPagination
      );
      setCards(characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const search = localStorage.getItem('search') || '';
    setSearchParams((prev) => ({ ...prev, searchValue: search }));
    fetchCharacters(search);
    console.log(searchParams, pagination);
  }, [fetchCharacters]);

  return (
    <>
      <header className="header-main">
        <h1 className="app-title">Star Wars</h1>
        <Search
          updateCards={setCards}
          setLoading={setLoading}
          setPagination={setPagination}
        />
      </header>
      <Home cards={cards} loading={loading} />
    </>
  );
};

export { App };
