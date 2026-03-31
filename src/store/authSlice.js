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

    login: (state, action) => {
      const { user, token } = action.payload;
      // Strip "ROLE_" prefix if it exists (e.g., "ROLE_HOSPITAL" -> "HOSPITAL")
      const cleanRole = user.role.startsWith('ROLE_') ? user.role.replace('ROLE_', '') : user.role;
      
      state.user = { ...user, role: cleanRole };
      state.token = token;
      localStorage.setItem('token', token);
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