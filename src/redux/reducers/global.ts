import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const DrawingMode = {
  DRAW_SITE: 'DRAW_SITE',
  STEP_UPDATE: 'STEP_UPDATE',
} as const;

export type DrawingMode = (typeof DrawingMode)[keyof typeof DrawingMode];

export interface GlobalState {
  rightSideOpened: boolean;
  drawingMode: DrawingMode | null;
}

const initialState: GlobalState = {
  rightSideOpened: true,
  drawingMode: null,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    toggleRightSide: (state) => {
      state.rightSideOpened = !state.rightSideOpened;
    },
    setDrawingMode: (state, action: PayloadAction<DrawingMode | null>) => {
      state.drawingMode = action.payload;
    },
  },
});

export const { toggleRightSide, setDrawingMode } = globalSlice.actions;
export default globalSlice.reducer;
