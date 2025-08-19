import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  slots: [],         
  loading: false,     
  error: null,       
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSlots(state, action) {
      state.slots = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setSlots, setLoading, setError } = bookingSlice.actions;
export default bookingSlice.reducer;
