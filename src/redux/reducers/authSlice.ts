import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL: string = import.meta.env.VITE_API_URL;

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (
    {
      username,
      password,
    }: {
      username: string;
      password: string;
    },
    thunkAPI
  ) => {
    // -----------------------------
    // FOR DEMO
    // -----------------------------
    if (!API_URL) {
      const token = 'Demo token';
      localStorage.setItem('token', token);
      return token;
    }
    // -----------------------------

    try {
      const response = await axios.post(
        API_URL + 'login/access-token',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      return token;
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
// Async thunk for test token
export const testToken = createAsyncThunk('auth/test_token', async (_, thunkAPI) => {
  const token = localStorage.getItem('token');

  // -----------------------------
  // FOR DEMO
  // -----------------------------
  if (!API_URL) {
    if (token) {
      return token;
    } else {
      return thunkAPI.rejectWithValue("Token doesn't exist. Please login first.");
    }
  }
  // -----------------------------

  try {
    await axios.post(
      API_URL + 'login/test-token',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as { detail?: string };
      errorMessage = data.detail || JSON.stringify(data);
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await axios.post(
        '/api/auth/logout/',
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as { detail?: string };
        errorMessage = data.detail || JSON.stringify(data);
      }
      localStorage.removeItem('token');
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.token = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { clearAuthState } = authSlice.actions;

export default authSlice.reducer;
