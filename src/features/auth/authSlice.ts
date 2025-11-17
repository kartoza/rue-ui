import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the auth state
export interface AuthState {
  isAuthenticated: boolean;
  user: object | null; // Replace `any` with a specific user type if available
}

// Load auth state from session storage
const loadAuthFromStorage = (): AuthState => {
  try {
    const authData = sessionStorage.getItem('auth');
    if (authData) {
      return JSON.parse(authData);
    }
  } catch (error) {
    console.error('Error loading auth from session storage:', error);
  }
  return {
    isAuthenticated: false,
    user: null,
  };
};

const initialState: AuthState = loadAuthFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<object | null>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      // Save to session storage
      sessionStorage.setItem(
        'auth',
        JSON.stringify({
          isAuthenticated: true,
          user: action.payload,
        })
      );
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Clear session storage
      sessionStorage.removeItem('auth');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
