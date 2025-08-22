import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to convert UTC time to user's local timezone
const convertToUserTimezone = (utcTimeString) => {
  const utcDate = new Date(utcTimeString);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    date: utcDate,
    localTime: utcDate.toLocaleString('en-US', {
      timeZone: userTimezone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    timezone: userTimezone,
  };
};

// Helper function to calculate duration in minutes
const calculateDurationMinutes = (start, end) => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  return (endTime - startTime) / (1000 * 60); // Convert to minutes
};

// Helper function to validate meeting duration
const validateMeetingDuration = (start, end) => {
  const durationMinutes = calculateDurationMinutes(start, end);

  if (durationMinutes < 30) {
    return {
      isValid: false,
      error: `Meeting duration is too short (${durationMinutes} minutes). Minimum duration is 30 minutes.`,
    };
  }

  if (durationMinutes > 120) {
    return {
      isValid: false,
      error: `Meeting duration is too long (${durationMinutes} minutes). Maximum duration is 120 minutes (2 hours).`,
    };
  }

  return { isValid: true };
};

// Async thunk for booking a meeting
export const bookMeeting = createAsyncThunk(
  'booking/bookMeeting',
  async (
    { consultantId, meetingId, clientName },
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      console.log('🚀 Starting booking process:', {
        consultantId,
        meetingId,
        clientName,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get current state
      const state = getState();
      const consultant = state.consultants.consultants.find(
        (c) => c.id === consultantId,
      );

      if (!consultant) {
        throw new Error('Consultant not found');
      }

      console.log('👨‍💼 Found consultant:', consultant.name);

      const meeting = consultant.meetings.find((m) => m.id === meetingId);

      if (!meeting) {
        throw new Error('Meeting slot not found or has been removed');
      }

      // Check if meeting is already booked in Redux state
      const isAlreadyBooked = state.booking.bookedMeetings.some(
        (booking) =>
          booking.consultantId === consultantId &&
          booking.meetingId === meetingId,
      );

      if (isAlreadyBooked || meeting.status !== 'available') {
        throw new Error('Meeting slot is no longer available');
      }

      // Validate meeting duration
      const durationValidation = validateMeetingDuration(
        meeting.start,
        meeting.end,
      );
      if (!durationValidation.isValid) {
        throw new Error(durationValidation.error);
      }

      // Check for time conflicts with existing bookings
      const existingBookings = state.booking.bookedMeetings.filter(
        (booking) =>
          booking.clientName.toLowerCase() === clientName.toLowerCase(),
      );

      const newMeetingStart = new Date(meeting.start);
      const newMeetingEnd = new Date(meeting.end);

      for (const booking of existingBookings) {
        const existingStart = new Date(booking.meetingStart);
        const existingEnd = new Date(booking.meetingEnd);

        // Check for overlap
        if (
          (newMeetingStart >= existingStart && newMeetingStart < existingEnd) ||
          (newMeetingEnd > existingStart && newMeetingEnd <= existingEnd) ||
          (newMeetingStart <= existingStart && newMeetingEnd >= existingEnd)
        ) {
          throw new Error(
            `Time Conflict: You already have a meeting scheduled from ${existingStart.toLocaleString()} to ${existingEnd.toLocaleString()}. Please select a different time slot.`,
          );
        }
      }

      // Convert times to user's local timezone for display
      const startLocal = convertToUserTimezone(meeting.start);
      const endLocal = convertToUserTimezone(meeting.end);
      const duration = calculateDurationMinutes(meeting.start, meeting.end);

      const bookingDetails = {
        consultantName: consultant.name,
        consultantId: consultant.id,
        meetingId: meeting.id,
        clientName,
        meetingStart: meeting.start,
        meetingEnd: meeting.end,
        meetingStartLocal: startLocal.localTime,
        meetingEndLocal: endLocal.localTime,
        timezone: startLocal.timezone,
        duration: `${duration} minutes`,
        status: 'reserved',
        bookedAt: new Date().toISOString(),
      };

      console.log('✅ Booking completed successfully:', bookingDetails);

      return {
        consultantId,
        meetingId,
        clientName,
        bookingDetails,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for canceling a meeting
export const cancelMeeting = createAsyncThunk(
  'booking/cancelMeeting',
  async (
    { consultantId, meetingId },
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      console.log('❌ Starting cancellation process:', {
        consultantId,
        meetingId,
      });

      console.log('✅ Cancellation completed successfully');

      return {
        consultantId,
        meetingId,
        status: 'cancelled',
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Load persisted state (only on client-side)
const loadPersistedBookings = () => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('bookedMeetings');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

const initialState = {
  // Selection state
  selectedSlot: null,
  selectedConsultant: null,

  // Booking flow state
  bookingStep: null, // null, 'confirmation'

  // Async state
  isBooking: false,
  bookingError: null,
  bookingSuccess: null,

  // Consultants state (synced from consultants slice)
  consultants: [],

  // Persistent booked meetings state
  bookedMeetings: [], // Will be loaded from localStorage on client
  isHydrated: false, // Track if client-side data is loaded
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    selectSlot: (state, action) => {
      const { slot, consultant } = action.payload;
      console.log('🎯 Slot selected:', {
        slotId: slot.id,
        consultantName: consultant.name,
        slotTime: `${slot.start} - ${slot.end}`,
        slotStatus: slot.status,
      });

      state.selectedSlot = slot;
      state.selectedConsultant = consultant;
      state.bookingStep = 'confirmation';
      // Clear any previous errors/success
      state.bookingError = null;
      state.bookingSuccess = null;
    },

    clearSelection: (state) => {
      console.log('🧹 Clearing selection...');
      state.selectedSlot = null;
      state.selectedConsultant = null;
      state.bookingStep = null;
      state.bookingError = null;
      state.bookingSuccess = null;
    },

    clearBookingStatus: (state) => {
      console.log('🧹 Clearing booking status...');
      state.bookingError = null;
      state.bookingSuccess = null;
      state.isBooking = false;
    },

    setConsultants: (state, action) => {
      console.log(
        '📊 Setting consultants in booking slice:',
        action.payload.length,
      );
      state.consultants = action.payload;
    },

    // Load persisted bookings (called after hydration)
    hydrateBookings: (state) => {
      if (typeof window !== 'undefined' && !state.isHydrated) {
        state.bookedMeetings = loadPersistedBookings();
        state.isHydrated = true;
        console.log('💧 Bookings hydrated:', state.bookedMeetings.length);
      }
    },

    // Reset all bookings (for Reset button)
    resetAllBookings: (state) => {
      console.log('🔄 Resetting all bookings...');
      state.bookedMeetings = [];
      state.selectedSlot = null;
      state.selectedConsultant = null;
      state.bookingStep = null;
      state.bookingError = null;
      state.bookingSuccess = null;

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bookedMeetings');
      }
    },

    // Helper to persist bookings to localStorage
    persistBookings: (state) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            'bookedMeetings',
            JSON.stringify(state.bookedMeetings),
          );
        } catch (error) {
          console.error('Error persisting bookings:', error);
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Book Meeting
      .addCase(bookMeeting.pending, (state) => {
        console.log('⏳ Booking in progress...');
        state.isBooking = true;
        state.bookingError = null;
        state.bookingSuccess = null;
      })
      .addCase(bookMeeting.fulfilled, (state, action) => {
        console.log('✅ Booking fulfilled:', action.payload);
        state.isBooking = false;
        state.bookingSuccess = action.payload;

        // Add to booked meetings
        const newBooking = {
          id: `${action.payload.consultantId}_${action.payload.meetingId}`,
          consultantId: action.payload.consultantId,
          meetingId: action.payload.meetingId,
          clientName: action.payload.clientName,
          bookingDetails: action.payload.bookingDetails,
          bookedAt: new Date().toISOString(),
          meetingStart: action.payload.bookingDetails.meetingStart,
          meetingEnd: action.payload.bookingDetails.meetingEnd,
        };

        // Check if already exists (prevent duplicates)
        const existingIndex = state.bookedMeetings.findIndex(
          (booking) => booking.id === newBooking.id,
        );

        if (existingIndex !== -1) {
          state.bookedMeetings[existingIndex] = newBooking;
        } else {
          state.bookedMeetings.push(newBooking);
        }

        // Persist to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              'bookedMeetings',
              JSON.stringify(state.bookedMeetings),
            );
            console.log('✅ Booking persisted to localStorage');
          } catch (error) {
            console.error('Error persisting booking:', error);
          }
        }

        // Clear selection after successful booking
        state.selectedSlot = null;
        state.selectedConsultant = null;
        state.bookingStep = null;
      })
      .addCase(bookMeeting.rejected, (state, action) => {
        state.isBooking = false;
        state.bookingError = action.payload || 'Booking failed';

        // For critical errors, clear the booking step
        if (
          action.payload &&
          (action.payload.includes('duration') ||
            action.payload.includes('not found') ||
            action.payload.includes('no longer available') ||
            action.payload.includes('already been booked'))
        ) {
          // For critical errors that require new slot selection, clear everything
          state.bookingStep = null;
          state.selectedSlot = null;
          state.selectedConsultant = null;
        } else {
          // Keep the selection for retryable errors like network issues or conflicts
          state.bookingStep = 'confirmation';
        }
      })

      // Cancel Meeting
      .addCase(cancelMeeting.pending, (state) => {
        console.log('⏳ Cancellation in progress...');
        state.isBooking = true;
        state.bookingError = null;
      })
      .addCase(cancelMeeting.fulfilled, (state, action) => {
        console.log('✅ Cancellation fulfilled:', action.payload);
        state.isBooking = false;

        // Remove from booked meetings
        const bookingId = `${action.payload.consultantId}_${action.payload.meetingId}`;
        state.bookedMeetings = state.bookedMeetings.filter(
          (booking) => booking.id !== bookingId,
        );

        // Persist to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              'bookedMeetings',
              JSON.stringify(state.bookedMeetings),
            );
            console.log('✅ Cancellation persisted to localStorage');
          } catch (error) {
            console.error('Error persisting cancellation:', error);
          }
        }
      })
      .addCase(cancelMeeting.rejected, (state, action) => {
        state.isBooking = false;
        state.bookingError = action.payload || 'Cancellation failed';
      });
  },
});

export const {
  selectSlot,
  clearSelection,
  clearBookingStatus,
  setConsultants,
  hydrateBookings,
  resetAllBookings,
  persistBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;
