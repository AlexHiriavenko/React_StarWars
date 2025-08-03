import type { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { clearItems } from '@/redux/slices/selectedCharactersSlice';
import { downloadCharactersAsCSV } from '@/services';

export const Flyout = (): JSX.Element => {
  const selectedItems = useSelector(
    (state: RootState) => state.selectedCharacters.items
  );
  const dispatch = useDispatch();

  const count = Object.keys(selectedItems).length;

  if (count === 0) return null;

  const handleClear = (): void => {
    dispatch(clearItems());
  };

  const handleDownload = (): void => {
    const selectedArray = Object.values(selectedItems);
    downloadCharactersAsCSV(selectedArray);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-green-600 text-white dark:bg-blue-500 rounded shadow-lg z-50 flex items-center gap-4">
      <span>
        {count} item{count > 1 ? 's' : ''} selected
      </span>
      <button
        onClick={handleClear}
        className="px-3 py-1 bg-white text-accent dark:text-blue-400 rounded hover:opacity-80 transition"
      >
        Unselect all
      </button>
      <button
        onClick={handleDownload}
        className="px-3 py-1 bg-white text-accent dark:text-blue-400 rounded hover:opacity-80 transition"
      >
        Download
      </button>
    </div>
  );
};
