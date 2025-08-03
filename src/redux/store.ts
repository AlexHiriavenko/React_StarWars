import { configureStore } from '@reduxjs/toolkit';
import selectedCharactersReducer from './slices/selectedCharactersSlice';

export const store = configureStore({
  reducer: {
    selectedCharacters: selectedCharactersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
