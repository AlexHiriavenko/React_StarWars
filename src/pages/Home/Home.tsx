import type { QueryParams } from '@/services/types';
import type { Character, AppState } from '@/types/AppTypes';
import { useState, useEffect } from 'react';
import {
  useSearchParams,
  useNavigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { useLS } from '@/hooks/useLS';
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
  const { getLS, setLS } = useLS();
  const location = useLocation();

  const getCharacters = async (queryParams: QueryParams): Promise<void> => {
    setLoading(true);
    const characterService = new CharacterService();
    try {
      const response = await characterService.fetchCharacters(queryParams);
      const totalPages = Math.ceil(response.count / (queryParams.limit || 10));
      setPagination({
        currentPage: queryParams.page || 1,
        total_pages: totalPages,
      });
      setCards(response.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number): void => {
    const isOutlet = location.pathname.includes('details');
    if (isOutlet) navigate('/');
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
  };

  useEffect(() => {
    const initialSearch = searchParams.get('search');
    if (initialSearch) {
      setLS('search', initialSearch);
    }

    const searchValue = getLS<string>('search') || '';
    const page = parseInt(searchParams.get('page') || '1');

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      if (searchValue) {
        newParams.set('search', searchValue);
      } else {
        newParams.delete('search');
      }
      return newParams;
    });

    getCharacters({ searchValue, page });
  }, [searchParams, setSearchParams, getLS, setLS]);

  return (
    <div className="min-h-[calc(100vh-84px)] max-md:min-h-[calc(100vh-136px)] pt-10">
      <Search setSearchParams={setSearchParams} />

      <section className="flex w-full max-w-[1090px] mx-auto mt-6 gap-4 justify-center max-xs:flex-col">
        <div className="w-[60%] max-xs:w-full min-h-[500px] flex justify-center">
          {loading && <Loader size={60} color="white" />}
          {!loading && (
            <CharacterList characters={cards} searchParams={searchParams} />
          )}
        </div>

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
