export const createMeetingString = (start, end, consultantId) => {
  return `${start}_${end}_${consultantId}`;
};

/**
 * Parses a meeting string back to its components
 * Returns: { start, end, consultantId }
 */
export const parseMeetingString = (meetingString) => {
  const parts = meetingString.split('_');
  if (parts.length !== 3) {
    throw new Error('Invalid meeting string format');
  }

  return {
    start: parts[0],
    end: parts[1],
    consultantId: parseInt(parts[2], 10),
  };
};

/**
 * Checks if two time periods overlap
 */
export const hasTimeOverlap = (start1, end1, start2, end2) => {
  const startTime1 = new Date(start1);
  const endTime1 = new Date(end1);
  const startTime2 = new Date(start2);
  const endTime2 = new Date(end2);

  return (
    (startTime1 >= startTime2 && startTime1 < endTime2) ||
    (endTime1 > startTime2 && endTime1 <= endTime2) ||
    (startTime1 <= startTime2 && endTime1 >= endTime2)
  );
};

/**
 * Checks for scheduling conflicts for a client
 */
export const checkClientScheduleConflict = (
  clientMeetings,
  newStart,
  newEnd,
) => {
  for (const meetingString of clientMeetings) {
    try {
      const existingMeeting = parseMeetingString(meetingString);

      if (
        hasTimeOverlap(
          existingMeeting.start,
          existingMeeting.end,
          newStart,
          newEnd,
        )
      ) {
        return {
          hasConflict: true,
          conflictingMeeting: existingMeeting,
          conflictDetails: {
            existingStart: existingMeeting.start,
            existingEnd: existingMeeting.end,
            consultantId: existingMeeting.consultantId,
          },
        };
      }
    } catch (error) {
      console.warn('Error parsing meeting string:', meetingString, error);
      continue;
    }
  }

  return { hasConflict: false };
};

/**
 * Formats meeting time for display
 */
export const formatMeetingTime = (meetingString, consultants = []) => {
  try {
    const meeting = parseMeetingString(meetingString);
    const consultant = consultants.find((c) => c.id === meeting.consultantId);

    const startDate = new Date(meeting.start);
    const endDate = new Date(meeting.end);

    const dateStr = startDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const timeStr = `${startDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })} - ${endDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    return {
      date: dateStr,
      time: timeStr,
      consultant: consultant
        ? consultant.name
        : `Consultant ID: ${meeting.consultantId}`,
      duration: Math.round((endDate - startDate) / (1000 * 60)) + ' min',
    };
  } catch (error) {
    console.error('Error formatting meeting time:', error);
    return {
      date: 'Invalid Date',
      time: 'Invalid Time',
      consultant: 'Unknown',
      duration: '0 min',
    };
  }
};

/**
 * Gets all meetings for a specific client
 */
export const getClientMeetings = (clients, clientName) => {
  const client = clients.find(
    (c) => c.name.toLowerCase() === clientName.toLowerCase(),
  );

  return client ? client.meetings : [];
};

/**
 * Counts total meetings for all clients
 */
export const getTotalMeetingsCount = (clients) => {
  return clients.reduce((total, client) => total + client.meetings.length, 0);
};

/**
 * Gets upcoming meetings for a client (meetings in the future)
 */
export const getUpcomingClientMeetings = (clients, clientName) => {
  const clientMeetings = getClientMeetings(clients, clientName);
  const now = new Date();

  return clientMeetings
    .filter((meetingString) => {
      try {
        const meeting = parseMeetingString(meetingString);
        const meetingStart = new Date(meeting.start);
        return meetingStart > now;
      } catch (error) {
        return false;
      }
    })
    .sort((a, b) => {
      const meetingA = parseMeetingString(a);
      const meetingB = parseMeetingString(b);
      return new Date(meetingA.start) - new Date(meetingB.start);
    });
};

/**
 * Validates meeting string format
 */
export const isValidMeetingString = (meetingString) => {
  try {
    const meeting = parseMeetingString(meetingString);
    const startDate = new Date(meeting.start);
    const endDate = new Date(meeting.end);

    return (
      !isNaN(startDate.getTime()) &&
      !isNaN(endDate.getTime()) &&
      typeof meeting.consultantId === 'number' &&
      meeting.consultantId > 0 &&
      endDate > startDate
    );
  } catch (error) {
    return false;
  }
};
