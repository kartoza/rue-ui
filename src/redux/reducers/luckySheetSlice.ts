import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { S1DB, S2DB, S3DB, S4DB, S5DB, S6DB } from './luckySheet';

export interface LuckySheetState {
  S1DB: S1DB | null;
  S2DB: S2DB | null;
  S3DB: S3DB | null;
  S4DB: S4DB | null;
  S5DB: S5DB | null;
  S6DB: S6DB | null;
}

const initialState: LuckySheetState = {
  S1DB: null,
  S2DB: null,
  S3DB: null,
  S4DB: null,
  S5DB: null,
  S6DB: null,
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
  },
});

export const { setS1DB, setS2DB, setS3DB, setS4DB, setS5DB, setS6DB } = luckySheetSlice.actions;
export default luckySheetSlice.reducer;
