import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Utils
import {
  convertToUserTimezone,
  calculateDurationMinutes,
  validateMeetingDuration,
  timeRangesOverlap,
} from '@/utils/timeUtils.js';

const checkClientTimeConflict = (
  existingBookings,
  newStart,
  newEnd,
  clientName,
) => {
  const clientBookings = existingBookings.filter(
    (booking) =>
      booking.clientName.toLowerCase().trim() ===
      clientName.toLowerCase().trim(),
  );

  if (clientBookings.length === 0) {
    return { hasConflict: false };
  }

  const newStartLocal = convertToUserTimezone(newStart);
  const newEndLocal = convertToUserTimezone(newEnd);

  if (!newStartLocal || !newEndLocal) {
    return {
      hasConflict: false,
      error: 'Unable to convert new meeting times to local timezone',
    };
  }

  for (const booking of clientBookings) {
    const existingStart = booking.meetingStart;
    const existingEnd = booking.meetingEnd;

    const existingStartLocal = convertToUserTimezone(existingStart);
    const existingEndLocal = convertToUserTimezone(existingEnd);

    if (!existingStartLocal || !existingEndLocal) {
      console.warn('⚠️ Unable to convert existing booking times:', booking);
      continue;
    }

    const hasOverlap = timeRangesOverlap(
      { start: newStart, end: newEnd },
      { start: existingStart, end: existingEnd },
    );

    if (hasOverlap) {
      return {
        hasConflict: true,
        conflictDetails: {
          clientName,
          existingBooking: booking,
          existingStart: existingStartLocal.timeOnly,
          existingEnd: existingEndLocal.timeOnly,
          existingDate: existingStartLocal.dateOnly,
          existingConsultant:
            booking.bookingDetails?.consultantName || 'Unknown',
          newStart: newStartLocal.timeOnly,
          newEnd: newEndLocal.timeOnly,
          newDate: newStartLocal.dateOnly,
          timezone: newStartLocal.timezone,
          sameDateConflict:
            existingStartLocal.dateOnly === newStartLocal.dateOnly,
        },
      };
    }
  }

  return { hasConflict: false };
};

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
        clientName: clientName.trim(),
      });

      const trimmedClientName = clientName.trim();
      if (!trimmedClientName || trimmedClientName.length < 2) {
        throw new Error(
          'Please provide a valid client name (minimum 2 characters)',
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const state = getState();
      const consultant = state.consultants.consultants.find(
        (c) => c.id === consultantId,
      );

      if (!consultant) {
        throw new Error('Consultant not found');
      }

      const meeting = consultant.meetings.find((m) => m.id === meetingId);

      if (!meeting) {
        throw new Error('Meeting slot not found or has been removed');
      }

      const isAlreadyBooked = state.booking.bookedMeetings.some(
        (booking) =>
          booking.consultantId === consultantId &&
          booking.meetingId === meetingId,
      );

      if (isAlreadyBooked || meeting.status !== 'available') {
        throw new Error(
          'Meeting slot is no longer available. Please refresh and select a different time.',
        );
      }

      const durationValidation = validateMeetingDuration(
        meeting.start,
        meeting.end,
      );

      if (!durationValidation.isValid) {
        throw new Error(durationValidation.error);
      }

      const conflictCheck = checkClientTimeConflict(
        state.booking.bookedMeetings,
        meeting.start,
        meeting.end,
        trimmedClientName,
      );

      if (conflictCheck.hasConflict) {
        throw new Error(
          'Time Conflict: You already have a meeting scheduled at this time. Please select a different time slot.',
        );
      }

      const startLocal = convertToUserTimezone(meeting.start);
      const endLocal = convertToUserTimezone(meeting.end);
      const duration = calculateDurationMinutes(meeting.start, meeting.end);

      const bookingDetails = {
        consultantName: consultant.name,
        consultantId: consultant.id,
        meetingId: meeting.id,
        clientName: trimmedClientName,
        meetingStart: meeting.start,
        meetingEnd: meeting.end,
        meetingStartLocal: startLocal.timeOnly,
        meetingEndLocal: endLocal.timeOnly,
        meetingDateLocal: startLocal.dateOnly,
        timezone: startLocal.timezone,
        duration: `${duration} minutes`,
        formattedDuration: durationValidation.formattedDuration,
        status: 'reserved',
        bookedAt: new Date().toISOString(),
      };

      return {
        consultantId,
        meetingId,
        clientName: trimmedClientName,
        bookingDetails,
        meetingString: `${meeting.start}_${meeting.end}_${consultantId}_${meetingId}`,
      };
    } catch (error) {
      console.log('❌ Booking failed:', error.message);
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  selectedSlot: null,
  selectedConsultant: null,
  bookingStep: null,
  isBooking: false,
  bookingError: null,
  bookingSuccess: null,
  consultants: [],
  bookedMeetings: [],
  isHydrated: false,
};

const loadPersistedBookings = () => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('bookedMeetings');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
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

    hydrateBookings: (state) => {
      if (typeof window !== 'undefined' && !state.isHydrated) {
        state.bookedMeetings = loadPersistedBookings();
        state.isHydrated = true;
        console.log('💧 Bookings hydrated:', state.bookedMeetings.length);
      }
    },

    resetAllBookings: (state) => {
      console.log('🔄 Resetting all bookings...');
      state.bookedMeetings = [];
      state.selectedSlot = null;
      state.selectedConsultant = null;
      state.bookingStep = null;
      state.bookingError = null;
      state.bookingSuccess = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('bookedMeetings');
      }
    },
  },

  extraReducers: (builder) => {
    builder
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

        const existingIndex = state.bookedMeetings.findIndex(
          (booking) => booking.id === newBooking.id,
        );

        if (existingIndex !== -1) {
          state.bookedMeetings[existingIndex] = newBooking;
        } else {
          state.bookedMeetings.push(newBooking);
        }

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

        state.selectedSlot = null;
        state.selectedConsultant = null;
        state.bookingStep = null;
      })
      .addCase(bookMeeting.rejected, (state, action) => {
        state.isBooking = false;
        state.bookingError = action.payload || 'Booking failed';

        state.bookingStep = null;
        state.selectedSlot = null;
        state.selectedConsultant = null;
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
} = bookingSlice.actions;

export default bookingSlice.reducer;
