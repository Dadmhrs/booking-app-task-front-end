export const getUserTimezone = () => {
  if (typeof window !== 'undefined') {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  return 'UTC';
};

export const convertToUserTimezone = (
  utcTimeString,
  use24HourFormat = false,
) => {
  try {
    const utcDate = new Date(utcTimeString);
    const userTimezone = getUserTimezone();

    if (isNaN(utcDate.getTime())) {
      console.error('Invalid date string:', utcTimeString);
      return null;
    }

    return {
      timeOnly: utcDate.toLocaleTimeString('en-GB', {
        timeZone: userTimezone,
        hour12: !use24HourFormat,
        hour: '2-digit',
        minute: '2-digit',
      }),
      dateOnly: utcDate.toLocaleDateString('en-US', {
        timeZone: userTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      timezone: userTimezone,
    };
  } catch (error) {
    console.error('Error converting to user timezone:', error);
    return null;
  }
};

export const calculateDurationMinutes = (start, end) => {
  try {
    const startTime = new Date(start);
    const endTime = new Date(end);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      console.error('Invalid time strings:', { start, end });
      return 0;
    }

    return Math.round((endTime - startTime) / (1000 * 60));
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

export const validateMeetingDuration = (start, end) => {
  const durationMinutes = calculateDurationMinutes(start, end);

  if (durationMinutes <= 0) {
    return {
      isValid: false,
      error: 'Invalid meeting duration. End time must be after start time.',
      duration: durationMinutes,
    };
  }

  if (durationMinutes < 30) {
    return {
      isValid: false,
      error: `Meeting duration is too short (${formatDuration(
        durationMinutes,
      )}). Minimum duration is 30 minutes.`,
      duration: durationMinutes,
    };
  }

  if (durationMinutes > 120) {
    return {
      isValid: false,
      error: `Meeting duration is too long (${formatDuration(
        durationMinutes,
      )}). Maximum duration is 2 hours.`,
      duration: durationMinutes,
    };
  }

  return {
    isValid: true,
    duration: durationMinutes,
    formattedDuration: formatDuration(durationMinutes),
  };
};
export const timeRangesOverlap = (range1, range2) => {
  try {
    const start1 = new Date(range1.start).getTime();
    const end1 = new Date(range1.end).getTime();
    const start2 = new Date(range2.start).getTime();
    const end2 = new Date(range2.end).getTime();

    return (
      (start1 >= start2 && start1 < end2) ||
      (end1 > start2 && end1 <= end2) ||
      (start1 <= start2 && end1 >= end2)
    );
  } catch (error) {
    console.error('Error checking time overlap:', error);
    return false;
  }
};

export const parseMeetingString = (meetingString) => {
  try {
    if (!meetingString || typeof meetingString !== 'string') {
      return null;
    }

    const parts = meetingString.split('_');
    if (parts.length < 3) {
      console.warn('Invalid meeting string format:', meetingString);
      return null;
    }

    const [start, end, consultantId, ...rest] = parts;

    return {
      start,
      end,
      consultantId: parseInt(consultantId) || consultantId,
      original: meetingString,
      isValid: true,
    };
  } catch (error) {
    console.error('Error parsing meeting string:', meetingString, error);
    return null;
  }
};

export const checkTimeConflict = (existingMeetings, newStart, newEnd) => {
  const newStartLocal = convertToUserTimezone(newStart);
  const newEndLocal = convertToUserTimezone(newEnd);

  if (!newStartLocal || !newEndLocal) {
    return {
      hasConflict: false,
      error: 'Unable to convert new meeting times to local timezone',
    };
  }

  for (const meetingString of existingMeetings) {
    const parsedMeeting = parseMeetingString(meetingString);

    if (!parsedMeeting) {
      console.warn('⚠️ Skipping invalid meeting string:', meetingString);
      continue;
    }

    const existingStartLocal = convertToUserTimezone(parsedMeeting.start);
    const existingEndLocal = convertToUserTimezone(parsedMeeting.end);

    if (!existingStartLocal || !existingEndLocal) {
      console.warn(
        '⚠️ Unable to convert existing meeting times:',
        parsedMeeting,
      );
      continue;
    }

    const hasOverlap = timeRangesOverlap(
      { start: newStart, end: newEnd },
      { start: parsedMeeting.start, end: parsedMeeting.end },
    );

    if (hasOverlap) {
      console.error('⚠️ Time conflict detected!', {
        newMeeting: `${newStartLocal.localTimeFormatted} - ${newEndLocal.localTimeFormatted}`,
        existingMeeting: `${existingStartLocal.localTimeFormatted} - ${existingEndLocal.localTimeFormatted}`,
      });

      return {
        hasConflict: true,
        conflictDetails: {
          existingStart: existingStartLocal.localTimeFormatted,
          existingEnd: existingEndLocal.localTimeFormatted,
          existingStartTime: existingStartLocal.timeOnly,
          existingEndTime: existingEndLocal.timeOnly,
          existingDate: existingStartLocal.dateOnly,
          newStart: newStartLocal.localTimeFormatted,
          newEnd: newEndLocal.localTimeFormatted,
          newStartTime: newStartLocal.timeOnly,
          newEndTime: newEndLocal.timeOnly,
          newDate: newStartLocal.dateOnly,
          timezone: newStartLocal.timezone,
          consultantId: parsedMeeting.consultantId,
          meetingString: meetingString,
        },
      };
    }
  }
  return { hasConflict: false };
};

export const formatConflictMessage = (conflictDetails) => {
  const sameDateConflict =
    conflictDetails.existingDate === conflictDetails.newDate;

  let message = `⚠️ Time Conflict Detected!\n\n`;

  message += `You already have a meeting scheduled:\n`;
  if (sameDateConflict) {
    message += `📅 ${conflictDetails.existingStartTime} - ${conflictDetails.existingEndTime} on ${conflictDetails.existingDate}\n`;
  } else {
    message += `📅 ${conflictDetails.existingStart} - ${conflictDetails.existingEnd}\n`;
  }

  message += `⏰ Timezone: ${conflictDetails.timezone}\n\n`;

  message += `New meeting you're trying to book:\n`;
  if (sameDateConflict) {
    message += `📅 ${conflictDetails.newStartTime} - ${conflictDetails.newEndTime} on ${conflictDetails.newDate}\n\n`;
  } else {
    message += `📅 ${conflictDetails.newStart} - ${conflictDetails.newEnd}\n\n`;
  }

  message += `Please choose a different time slot that doesn't overlap with your existing bookings.`;

  return message;
};

export const getTimezoneAbbreviation = (timezone) => {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });

    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find((part) => part.type === 'timeZoneName');

    return timeZonePart ? timeZonePart.value : timezone;
  } catch (error) {
    console.error('Error getting timezone abbreviation:', error);
    return timezone.split('/').pop()?.replace('_', ' ') || timezone;
  }
};

export const isWithinBusinessHours = (
  timezone,
  businessHours = { start: 9, end: 17 },
) => {
  try {
    const now = new Date();
    const currentHour = parseInt(
      now.toLocaleString('en-US', {
        timeZone: timezone,
        hour12: false,
        hour: '2-digit',
      }),
    );

    return (
      currentHour >= businessHours.start && currentHour < businessHours.end
    );
  } catch (error) {
    console.error('Error checking business hours:', error);
    return false;
  }
};

export default {
  getUserTimezone,
  convertToUserTimezone,
  calculateDurationMinutes,
  formatDuration,
  validateMeetingDuration,
  timeRangesOverlap,
  parseMeetingString,
  checkTimeConflict,
  formatConflictMessage,
  getTimezoneAbbreviation,
  isWithinBusinessHours,
};
