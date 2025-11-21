import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export const DefinitionType = {
  vmc_demo: 'vmc_demo',
  draw_your_own: 'draw_your_own',
  load_site: 'load_site',
  dummy_site: 'dummy_site',
} as const;

export type DefinitionType = (typeof DefinitionType)[keyof typeof DefinitionType];

export const DEFINITION_LABELS: Record<DefinitionType, string> = {
  vmc_demo: 'VMC Demo',
  draw_your_own: 'Draw your own',
  load_site: 'Load site',
  dummy_site: 'Dummy Site',
};

export interface DefinitionState {
  selectedDefinition: DefinitionType;
}

const initialState: DefinitionState = {
  selectedDefinition: DefinitionType.vmc_demo,
};

const definitionSlice = createSlice({
  name: 'definition',
  initialState,
  reducers: {
    setSelectedDefinition: (state, action: PayloadAction<DefinitionType>) => {
      state.selectedDefinition = action.payload;
    },
  },
});

export const { setSelectedDefinition } = definitionSlice.actions;
export default definitionSlice.reducer;
