import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
}

const saved = localStorage.getItem('report_user');

const initialState: AuthState = {
  user: saved ? JSON.parse(saved) : null,
  token: localStorage.getItem('report_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('report_user', JSON.stringify(action.payload.user));
      localStorage.setItem('report_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('report_user');
      localStorage.removeItem('report_token');
    },
  },
});

export const { setSession, logout } = authSlice.actions;
export default authSlice.reducer;