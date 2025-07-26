import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLS } from '@/hooks/useLS';

interface SearchProps {
  setSearchParams: (params: URLSearchParams) => void;
}

const Search = ({ setSearchParams }: SearchProps): JSX.Element => {
  const { getLS, setLS } = useLS();
  const navigate = useNavigate();
  const location = useLocation();

  const [newSearchValue, setNewSearchValue] = useState(
    () => getLS<string>('search') || ''
  );

  const handleSearch = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const trimmedValue = newSearchValue.trim();
    setLS('search', trimmedValue);
    const newParams = new URLSearchParams();
    const startPage = '1';
    newParams.set('page', startPage);
    if (trimmedValue) {
      newParams.set('search', trimmedValue);
    } else {
      newParams.delete('search');
    }
    const isOutlet = location.pathname.includes('details');
    if (isOutlet) navigate('/');
    setSearchParams(newParams);
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
        className="px-3 py-2 text-white w-[300px] max-w-[60%] rounded-[12px] outline-none border border-gray-400/70 bg-input max-xs:max-w-[60%]"
      />

      <button
        type="submit"
        className="px-3 py-2 font-bold rounded-[16px] border-none w-[96px] min-w-[78px] max-w-[20%] bg-blue-500 text-white"
      >
        Search
      </button>
    </form>
  );
};

export { Search };
