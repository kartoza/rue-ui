import type { SerializedError } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { ProjectPayload, ProjectState } from './project';

const API_URL: string = import.meta.env.VITE_API_URL;

const initialState: ProjectState = {
  project: null,
  loading: false,
  error: null,
};

// Async thunk for project
export const createProject = createAsyncThunk(
  'project/create',
  async (parameters: ProjectPayload, thunkAPI) => {
    // -----------------------------
    // FOR DEMO
    // -----------------------------
    if (!API_URL) {
      const token = 'Demo token';
      localStorage.setItem('token', token);
      return {
        project_uuid: '00000000-0000-0000-0000-000000000000',
        project_name: parameters.name,
      };
    }
    // -----------------------------
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        API_URL + 'projects',
        {
          parameters,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as { detail?: string };
        errorMessage = data.detail || JSON.stringify(data);
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as SerializedError;
      });
  },
});

export default projectSlice.reducer;
