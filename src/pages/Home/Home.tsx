import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Outlet } from 'react-router-dom';
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
    searchKey: 'search',
    searchValue: '',
    limit: 10,
  },
  pagination: {
    currentPage: 1,
    total_pages: 1,
  },
};

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Character[]>(initialState.cards);
  const [loading, setLoading] = useState<boolean>(initialState.loading);
  const [pagination, setPagination] = useState(initialState.pagination);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchCharacters = async (): Promise<void> => {
      const initialSearch = searchParams.get('search');
      if (initialSearch) {
        localStorage.setItem('search', initialSearch);
      }
      const search = localStorage.getItem('search') || '';
      const page = parseInt(searchParams.get('page') || '1');
      const characterService = new CharacterService();

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (page) {
          newParams.set('page', page.toString());
        } else {
          newParams.delete('page');
        }

        if (search) {
          newParams.set('search', search);
        } else {
          newParams.delete('search');
        }
        return newParams;
      });

      setLoading(true);
      try {
        const characters = await characterService.fetchCharacters(
          { searchValue: search, page },
          setPagination
        );
        setCards(characters);
      } catch (error) {
        console.error('Error fetching characters:', error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [searchParams, setSearchParams]);

  const handlePageChange = (page: number): void => {
    navigate('/');
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      const search = localStorage.getItem('search');
      newParams.set('page', page.toString());
      if (search) {
        newParams.set('search', search);
      } else {
        newParams.delete('search');
      }
      return newParams;
    });
  };

  if (loading) {
    return (
      <div className="relative w-full h-[calc(100vh-84px)] max-md:h-[calc(100vh-136px)] flex items-center justify-center">
        <Loader size={80} color="white" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-84px)] max-md:min-h-[calc(100vh-136px)] pt-10">
      <Search
        updateCards={setCards}
        setLoading={setLoading}
        setPagination={setPagination}
        setSearchParams={setSearchParams}
      />
      <section className="flex w-full max-w-[1090px] mx-auto mt-6 gap-4 justify-center max-xs:flex-col">
        <CharacterList characters={cards} searchParams={searchParams} />
        <div className="w-[40%] max-xs:w-full">
          <Outlet context={{ searchParams }} />
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
