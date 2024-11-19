import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  id: string | null;
  first_name: string;
  last_name: string;
  username: string;
  image: string;
  loggedIn: boolean;
}

const initialState: UserState = {
  id: null,
  username: '',
  first_name: '',
  last_name: '',
  image: '',
  loggedIn: false 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state = { ...state, ...action.payload, loggedIn: true };
      return state;
    },
    clearUser: () => initialState
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
