import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import type { Character, AppState } from '@/types/AppTypes';
import { Loader } from '@/components/baseComponents';
import { CharacterList } from '@/components/CharactersList/CharactersList';
import Pagination from '@/components/Pagination/Pagination';
import { Search } from '@/components/Search';
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

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Character[]>(initialState.cards);
  const [loading, setLoading] = useState<boolean>(initialState.loading);
  const [searchParamsState, setSearchParamsState] = useState(
    initialState.searchParams
  );
  const [pagination, setPagination] = useState(initialState.pagination);

  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);
  console.log(searchParamsState);

  const fetchCharacters = useCallback(async (searchValue: string, page = 1) => {
    const characterService = new CharacterService();
    setLoading(true);
    try {
      const characters = await characterService.fetchCharacters(
        { searchValue, page },
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
    // const page = parseInt(searchParams.get('page') || '1', 10);
    const page = pagination.currentPage || 1;

    setSearchParamsState((prev) => ({ ...prev, searchValue: search }));
    fetchCharacters(search, page);
  }, [pagination.currentPage, fetchCharacters]);

  const handlePageChange = (page: number): void => {
    console.log(page);
    navigate('/');
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
  };

  if (loading) return <Loader size={80} color="white" />;

  return (
    <div className="mt-[84px] min-h-[calc(100vh-84px)] max-md:mt-[136px] max-md:min-h-[calc(100vh-136px)]">
      <Search
        updateCards={setCards}
        setLoading={setLoading}
        setPagination={setPagination}
      />
      <section className="flex w-full max-w-[1090px] mx-auto mt-6 gap-4 justify-center max-xs:flex-col">
        <CharacterList characters={cards} />
        <div className="w-[40%] max-xs:w-full">
          <Outlet /> {/* Вставка роута details/:id */}
        </div>
      </section>
      <Pagination
        currentPage={pagination.currentPage || 1}
        totalPages={pagination.total_pages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
