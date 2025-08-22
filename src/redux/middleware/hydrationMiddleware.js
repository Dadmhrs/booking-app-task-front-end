// redux/middleware/hydrationMiddleware.js
import { hydrateBookings } from '../bookingSlice';

// Middleware to handle hydration after Redux store is ready
export const hydrationMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Auto-hydrate bookings when store is first initialized
  if (action.type === '@@INIT' || action.type === '@@redux/INIT') {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        store.dispatch(hydrateBookings());
      }, 0);
    }
  }

  return result;
};

// components/providers/HydrationProvider.jsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux/useRedux';
import { hydrateBookings } from '@/redux/bookingSlice';

export const HydrationProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const isHydrated = useAppSelector((state) => state.booking.isHydrated);

  useEffect(() => {
    // Only hydrate on client-side and if not already hydrated
    if (typeof window !== 'undefined' && !isHydrated) {
      dispatch(hydrateBookings());
    }
  }, [dispatch, isHydrated]);

  return children;
};

// redux/store.js (example setup)
import { configureStore } from '@reduxjs/toolkit';
import { hydrationMiddleware } from './middleware/hydrationMiddleware';
import bookingReducer from './bookingSlice';
import consultantsReducer from './consultantsSlice';

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    consultants: consultantsReducer,
    // ... other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['booking/hydrateBookings'],
      },
    }).concat(hydrationMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// hooks/useBookingStatus.js - Custom hook for booking status
import { useAppSelector } from './useRedux';

export const useBookingStatus = (consultantId, slotId) => {
  const { bookedMeetings, isHydrated } = useAppSelector(
    (state) => state.booking,
  );

  const isBooked = isHydrated
    ? bookedMeetings.some(
        (booking) =>
          booking.consultantId === consultantId && booking.meetingId === slotId,
      )
    : false;

  return {
    isBooked,
    isHydrated,
  };
};

// utils/bookingUtils.js - Utility functions for booking
export const getBookedMeetingsCount = (bookedMeetings) => {
  return bookedMeetings?.length || 0;
};

export const getClientBookings = (bookedMeetings, clientName) => {
  if (!bookedMeetings || !clientName) return [];

  return bookedMeetings.filter(
    (booking) => booking.clientName.toLowerCase() === clientName.toLowerCase(),
  );
};

export const hasTimeConflict = (newStart, newEnd, existingBookings) => {
  const newMeetingStart = new Date(newStart);
  const newMeetingEnd = new Date(newEnd);

  return existingBookings.some((booking) => {
    const existingStart = new Date(booking.meetingStart);
    const existingEnd = new Date(booking.meetingEnd);

    // Check for overlap
    return (
      (newMeetingStart >= existingStart && newMeetingStart < existingEnd) ||
      (newMeetingEnd > existingStart && newMeetingEnd <= existingEnd) ||
      (newMeetingStart <= existingStart && newMeetingEnd >= existingEnd)
    );
  });
};

// components/calendar/CalendarSlot.jsx - Individual slot component
import React from 'react';
import { useBookingStatus } from '@/hooks/useBookingStatus';

export const CalendarSlot = ({
  slot,
  consultant,
  onSelect,
  isSelected,
  className = '',
}) => {
  const { isBooked, isHydrated } = useBookingStatus(consultant?.id, slot.id);

  const handleClick = () => {
    if (!isBooked && slot.status === 'available') {
      onSelect(slot, consultant);
    }
  };

  const getSlotStyles = () => {
    if (!isHydrated) {
      return 'bg-gray-100 text-gray-400 cursor-wait'; // Loading state
    }

    if (isBooked) {
      return 'bg-red-100 text-red-600 cursor-not-allowed border-red-200'; // Booked
    }

    if (slot.status === 'available') {
      return isSelected
        ? 'bg-blue-100 text-blue-800 border-blue-300 cursor-pointer hover:bg-blue-200'
        : 'bg-green-100 text-green-800 border-green-200 cursor-pointer hover:bg-green-200';
    }

    return 'bg-gray-100 text-gray-600 cursor-not-allowed'; // Unavailable
  };

  const getSlotText = () => {
    if (!isHydrated) return 'Loading...';
    if (isBooked) return 'Booked';
    if (slot.status === 'available') return 'Available';
    return 'Unavailable';
  };

  return (
    <div
      className={`p-3 border rounded-lg transition-colors ${getSlotStyles()} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="text-sm font-medium">
        {new Date(slot.start).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
        {' - '}
        {new Date(slot.end).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
      <div className="text-xs mt-1">{getSlotText()}</div>
      {slot.price && (
        <div className="text-xs font-semibold mt-1">${slot.price}</div>
      )}
    </div>
  );
};
