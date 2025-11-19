import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  currentProject: string | null;
}

const initialState: ProjectState = {
  currentProject: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<string | null>) => {
      state.currentProject = action.payload;
    },
  },
});

export const { setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
