import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { S1DB } from './luckySheet';

export interface LuckySheetState {
  S1DB: S1DB | null;
}

const initialState: LuckySheetState = {
  S1DB: null,
};

const luckySheetSlice = createSlice({
  name: 'luckySheet',
  initialState,
  reducers: {
    setS1DB: (state, action: PayloadAction<S1DB>) => {
      state.S1DB = action.payload;
    },
  },
});

export const { setS1DB } = luckySheetSlice.actions;
export default luckySheetSlice.reducer;
