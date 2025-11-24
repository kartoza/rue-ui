import { createSlice } from '@reduxjs/toolkit';

export interface GlobalState {
  rightSideOpened: boolean;
}

const initialState: GlobalState = {
  rightSideOpened: true,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    toggleRightSide: (state) => {
      state.rightSideOpened = !state.rightSideOpened;
    },
  },
});

export const { toggleRightSide } = globalSlice.actions;
export default globalSlice.reducer;
