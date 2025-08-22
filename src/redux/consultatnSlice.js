import { createSlice } from '@reduxjs/toolkit';
import ConsultantsDataImport from '@/data/models/consultars.json';

const loadInitialState = () => {
  if (typeof window === 'undefined') {
    return ConsultantsDataImport.consultants;
  }

  try {
    const savedData = localStorage.getItem('consultants_data');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {}

  return ConsultantsDataImport.consultants;
};

const saveToLocalStorage = (consultants) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('consultants_data', JSON.stringify(consultants));
  } catch (error) {}
};

const initialState = {
  consultants: loadInitialState(),
  loading: false,
  error: null,
};

const consultantsSlice = createSlice({
  name: 'consultants',
  initialState,
  reducers: {
    updateMeetingStatus: (state, action) => {
      const { consultantId, meetingId, status, clientName } = action.payload;

      const consultant = state.consultants.find((c) => c.id === consultantId);
      if (consultant) {
        const meeting = consultant.meetings.find((m) => m.id === meetingId);
        if (meeting) {
          meeting.status = status;
          meeting.clientName = clientName || null;
          saveToLocalStorage(state.consultants);
        }
      }
    },

    saveCurrentState: (state) => {
      saveToLocalStorage(state.consultants);
    },

    hydrateConsultants: (state, action) => {
      state.consultants = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  saveCurrentState,
  hydrateConsultants,
  setLoading,
  setError,
  clearError,
} = consultantsSlice.actions;

export default consultantsSlice.reducer;
