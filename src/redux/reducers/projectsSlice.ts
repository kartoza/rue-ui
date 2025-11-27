import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Project } from './project';
import * as api from '../../utils/api';

const API_URL: string = import.meta.env.VITE_API_URL;

export interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

// Async thunk for project
export const getProjects = createAsyncThunk('projects/get', async (_, thunkAPI) => {
  // -----------------------------
  // FOR DEMO
  // -----------------------------
  if (!API_URL) {
    return [];
  }
  // -----------------------------
  try {
    return await api.get('projects');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;
