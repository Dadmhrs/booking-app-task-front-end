'use client';
import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './bookingSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    user: userReducer,
  },
});
