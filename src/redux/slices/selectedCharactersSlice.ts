import type { Character } from '@/types/AppTypes';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface SelectedCharactersState {
  items: Record<string, Character>; // ключом будет уникальный character.url
}

const initialState: SelectedCharactersState = {
  items: {},
};

const selectedCharactersSlice = createSlice({
  name: 'selectedCharacters',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Character>) {
      const character = action.payload;
      state.items[character.url] = character;
    },
    removeItem(state, action: PayloadAction<string>) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.items[action.payload]; // payload — это уникальный character.url
    },
    clearItems(state) {
      state.items = {};
    },
  },
});

export const { addItem, removeItem, clearItems } =
  selectedCharactersSlice.actions;
export default selectedCharactersSlice.reducer;
