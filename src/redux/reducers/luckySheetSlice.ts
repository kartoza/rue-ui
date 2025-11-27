import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { S1DB, S2DB, S3DB, S4DB, S5DB, S6DB, Spider } from './luckySheet';

export interface LuckySheetState {
  S1DB: S1DB | null;
  S2DB: S2DB | null;
  S3DB: S3DB | null;
  S4DB: S4DB | null;
  S5DB: S5DB | null;
  S6DB: S6DB | null;
  Spider: Spider | null;
}

const initialState: LuckySheetState = {
  S1DB: null,
  S2DB: null,
  S3DB: null,
  S4DB: null,
  S5DB: null,
  S6DB: null,
  Spider: null,
};

const luckySheetSlice = createSlice({
  name: 'luckySheet',
  initialState,
  reducers: {
    setS1DB: (state, action: PayloadAction<S1DB>) => {
      state.S1DB = action.payload;
    },
    setS2DB: (state, action: PayloadAction<S2DB>) => {
      state.S2DB = action.payload;
    },
    setS3DB: (state, action: PayloadAction<S3DB>) => {
      state.S3DB = action.payload;
    },
    setS4DB: (state, action: PayloadAction<S4DB>) => {
      state.S4DB = action.payload;
    },
    setS5DB: (state, action: PayloadAction<S5DB>) => {
      state.S5DB = action.payload;
    },
    setS6DB: (state, action: PayloadAction<S6DB>) => {
      state.S6DB = action.payload;
    },
    setSpider: (state, action: PayloadAction<Spider>) => {
      state.Spider = action.payload;
    },
    resetLuckySheet: (state) => {
      state.S1DB = null;
      state.S2DB = null;
      state.S3DB = null;
      state.S4DB = null;
      state.S5DB = null;
      state.S6DB = null;
      state.Spider = null;
    },
  },
});

export const { setS1DB, setS2DB, setS3DB, setS4DB, setS5DB, setS6DB, setSpider, resetLuckySheet } =
  luckySheetSlice.actions;
export default luckySheetSlice.reducer;
