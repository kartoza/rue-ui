import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProjectParameters } from './project';

export const DrawingMode = {
  DRAW_SITE: 'DRAW_SITE',
  STEP_UPDATE: 'STEP_UPDATE',
} as const;

export type DrawingMode = (typeof DrawingMode)[keyof typeof DrawingMode];

export interface GlobalState {
  rightSideOpened: boolean;
  drawingMode: DrawingMode | null;
  inputParamaters: ProjectParameters | null;
}

const initialState: GlobalState = {
  rightSideOpened: true,
  drawingMode: null,
  inputParamaters: null,
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
    setInputParameters: (state, action: PayloadAction<ProjectParameters | null>) => {
      state.inputParamaters = action.payload;
    },
  },
});

export const { toggleRightSide, setDrawingMode, setInputParameters } = globalSlice.actions;
export default globalSlice.reducer;
