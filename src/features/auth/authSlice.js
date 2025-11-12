import { createSlice } from '@reduxjs/toolkit';

// Load auth state from session storage
const loadAuthFromStorage = () => {
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

const initialState = loadAuthFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
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
