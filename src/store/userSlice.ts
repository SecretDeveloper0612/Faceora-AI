import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  id: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isPremium: boolean;
}

const initialState: UserState = {
  id: null,
  email: null,
  isAuthenticated: false,
  isPremium: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; email: string }>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    setPremiumStatus: (state, action: PayloadAction<boolean>) => {
      state.isPremium = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, setPremiumStatus, clearUser } = userSlice.actions;
export default userSlice.reducer;
