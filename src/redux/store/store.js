import { configureStore } from '@reduxjs/toolkit';
import consultantsReducer from '../consultatnSlice.js';
import bookingSlice from '../bookingSlice.js';
import clientsReducer from '../consultatnSlice.js';

export const store = configureStore({
  reducer: {
    consultants: consultantsReducer,
    booking: bookingSlice,
    clients: clientsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
export const getRootState = store.getState;
export const getAppDispatch = () => store.dispatch;
