import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDefinition: 'draw_your_own',
};

const definitionSlice = createSlice({
  name: 'definition',
  initialState,
  reducers: {
    setSelectedDefiniton: (state, action) => {
      state.selectedDefinition = action.payload;
    },
  },
});

export const { setSelectedDefiniton } = definitionSlice.actions;
export default definitionSlice.reducer;
