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
    setSelectedDefiniton: (state, action: PayloadAction<string>) => {
      state.selectedDefinition = action.payload;
    },
  },
});

export const { setSelectedDefiniton } = definitionSlice.actions;
export default definitionSlice.reducer;
