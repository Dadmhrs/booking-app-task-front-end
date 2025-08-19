import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  timezone: 'UTC',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setTimezone(state, action) {
      state.timezone = action.payload;
    },
  },
});

export const { setUser, setTimezone } = userSlice.actions;
export default userSlice.reducer;
