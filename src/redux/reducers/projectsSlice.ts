import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Project } from './project';
import * as api from '../../utils/api.tsx';

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

// Async thunk for getting projects
export const getProjects = createAsyncThunk<
  Project[],
  void,
  {
    rejectValue: string;
  }
>('projects/get', async (_, thunkAPI) => {
  // -----------------------------
  try {
    return await api.get('projects');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// Async thunk for deleting a project
export const deleteProject = createAsyncThunk<
  string,
  string,
  {
    rejectValue: string;
  }
>('projects/delete', async (uuid: string, thunkAPI) => {
  if (!API_URL) {
    return uuid;
  }
  try {
    await api.del('projects/' + uuid);
    return uuid;
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
      })
      // Delete projects
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        const uuid = action.payload;
        state.projects = state.projects.filter((project) => project.uuid !== uuid);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;
