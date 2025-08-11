import type { PropsWithChildren } from 'react';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/components/ThemeContext/ThemeProvider';
import { swapiApi } from '@/redux/api/swapiApi';
import selectedCharactersReducer from '@/redux/slices/selectedCharactersSlice';

// eslint-disable-next-line react-refresh/only-export-components
export function makeTestStore(): EnhancedStore {
  return configureStore({
    reducer: {
      selectedCharacters: selectedCharactersReducer,
      [swapiApi.reducerPath]: swapiApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(swapiApi.middleware),
  });
}

export function TestProviders({ children }: PropsWithChildren): JSX.Element {
  const store = makeTestStore(); // новый store на каждый рендер
  return (
    <ThemeProvider>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
