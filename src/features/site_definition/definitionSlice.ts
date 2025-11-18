import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface DefinitionState {
  selectedDefinition: string;
}

const initialState: DefinitionState = {
  selectedDefinition: 'draw_your_own',
};

const definitionSlice = createSlice({
  name: 'definition',
  initialState,
  reducers: {
    setSelectedDefinition: (state, action: PayloadAction<string>) => {
      state.selectedDefinition = action.payload;
    },
  },
});

export const { setSelectedDefinition } = definitionSlice.actions;
export default definitionSlice.reducer;
