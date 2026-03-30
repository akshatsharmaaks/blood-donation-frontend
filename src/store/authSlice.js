import { createSlice } from '@reduxjs/toolkit';

const token    = localStorage.getItem('token');
const userStr  = localStorage.getItem('user');
const user     = userStr ? JSON.parse(userStr) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: { token, user, isAuthenticated: !!token },
  reducers: {
    setCredentials: (state, action) => {
      const { token, ...user } = action.payload;
      state.token           = token;
      state.user            = user;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.token           = null;
      state.user            = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;