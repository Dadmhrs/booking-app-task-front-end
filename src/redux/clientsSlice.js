// store/slices/clientsSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Import clients data
const ClientsData = {
  clients: [
    // Initial empty array - clients will be added when they book meetings
  ],
};

const initialState = {
  clients: ClientsData.clients,
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state, action) => {
      const { clientName, meetingString } = action.payload;

      // Check if client already exists
      const existingClient = state.clients.find(
        (client) => client.name.toLowerCase() === clientName.toLowerCase(),
      );

      if (existingClient) {
        // Add meeting to existing client
        if (!existingClient.meetings.includes(meetingString)) {
          existingClient.meetings.push(meetingString);
        }
      } else {
        // Create new client
        const newClientId =
          state.clients.length > 0
            ? Math.max(...state.clients.map((c) => c.id)) + 1
            : 1;

        state.clients.push({
          id: newClientId,
          name: clientName,
          meetings: [meetingString],
        });
      }
    },

    removeClientMeeting: (state, action) => {
      const { clientName, meetingString } = action.payload;

      const client = state.clients.find(
        (c) => c.name.toLowerCase() === clientName.toLowerCase(),
      );

      if (client) {
        client.meetings = client.meetings.filter(
          (meeting) => meeting !== meetingString,
        );

        // Remove client if no meetings left
        if (client.meetings.length === 0) {
          state.clients = state.clients.filter((c) => c.id !== client.id);
        }
      }
    },

    checkClientConflict: (state, action) => {
      const { clientName, newMeetingStart, newMeetingEnd } = action.payload;

      const client = state.clients.find(
        (c) => c.name.toLowerCase() === clientName.toLowerCase(),
      );

      if (!client) return { hasConflict: false };

      // Parse new meeting times
      const newStart = new Date(newMeetingStart);
      const newEnd = new Date(newMeetingEnd);

      // Check for conflicts
      for (const meetingString of client.meetings) {
        const parts = meetingString.split('_');
        const existingStart = new Date(parts[0]);
        const existingEnd = new Date(parts[1]);

        // Check if times overlap
        if (
          (newStart >= existingStart && newStart < existingEnd) ||
          (newEnd > existingStart && newEnd <= existingEnd) ||
          (newStart <= existingStart && newEnd >= existingEnd)
        ) {
          return {
            hasConflict: true,
            conflictDetails: {
              existingStart: existingStart.toISOString(),
              existingEnd: existingEnd.toISOString(),
            },
          };
        }
      }

      return { hasConflict: false };
    },

    getClientMeetings: (state, action) => {
      const { clientName } = action.payload;

      const client = state.clients.find(
        (c) => c.name.toLowerCase() === clientName.toLowerCase(),
      );

      return client ? client.meetings : [];
    },

    resetClients: (state) => {
      state.clients = ClientsData.clients;
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
  addClient,
  removeClientMeeting,
  checkClientConflict,
  getClientMeetings,
  resetClients,
  setLoading,
  setError,
  clearError,
} = clientsSlice.actions;

export default clientsSlice.reducer;
