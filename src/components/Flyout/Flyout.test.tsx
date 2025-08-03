import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, useDispatch } from 'react-redux';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Flyout } from './Flyout';
import selectedCharactersReducer, {
  clearItems,
} from '@/redux/slices/selectedCharactersSlice';
import { downloadCharactersAsCSV } from '@/services';

type PreloadedState = {
  selectedCharacters: ReturnType<typeof selectedCharactersReducer>;
};

vi.mock('@/services', () => ({
  downloadCharactersAsCSV: vi.fn(),
}));

vi.mock('react-redux', async () => {
  const actual =
    await vi.importActual<typeof import('react-redux')>('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
  };
});

describe('Flyout', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDispatch).mockReturnValue(mockDispatch);
  });

  const renderWithStore = (preloadedState: PreloadedState) => {
    const store = configureStore({
      reducer: {
        selectedCharacters: selectedCharactersReducer,
      },
      preloadedState,
    });

    return render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );
  };

  it('dispatches clearItems when "Unselect all" is clicked', () => {
    renderWithStore({
      selectedCharacters: {
        items: {
          'url-1': { name: 'Luke', url: 'url-1', gender: 'male' },
        },
      },
    });

    fireEvent.click(screen.getByText(/Unselect all/i));
    expect(mockDispatch).toHaveBeenCalledWith(clearItems());
  });

  it('calls downloadCharactersAsCSV when "Download" is clicked', () => {
    const mockCharacter = {
      name: 'Luke',
      url: 'url-1',
      gender: 'male',
    };

    renderWithStore({
      selectedCharacters: {
        items: {
          'url-1': mockCharacter,
        },
      },
    });

    fireEvent.click(screen.getByText(/Download/i));
    expect(downloadCharactersAsCSV).toHaveBeenCalledWith([mockCharacter]);
  });

  it('renders plural "items" when more than one selected', () => {
    renderWithStore({
      selectedCharacters: {
        items: {
          'url-1': { name: 'Luke', url: 'url-1', gender: 'male' },
          'url-2': { name: 'Leia', url: 'url-2', gender: 'female' },
        },
      },
    });

    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });
});
