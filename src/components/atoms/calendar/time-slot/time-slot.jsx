import { useState, useMemo } from 'react';
// Utils
import { dateUtils } from '../utils/dateUtils.js';

export const useSlots = (consultantId, consultants) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  const consultant = useMemo(() => {
    let foundConsultant = null;

    if (consultantId && typeof consultantId === 'object' && consultantId.id) {
      foundConsultant = consultantId;
    } else if (Array.isArray(consultants)) {
      foundConsultant = consultants.find((c) => c.id === consultantId) || null;
    } else if (
      consultants &&
      typeof consultants === 'object' &&
      consultants.id
    ) {
      foundConsultant = consultants;
    }
    return foundConsultant;
  }, [consultantId, consultants]);

  const slots = useMemo(() => {
    const slotsArray = [];
    if (consultant && consultant.meetings) {
      consultant.meetings.forEach((meeting, index) => {
        const startDate = new Date(meeting.start);
        const endDate = new Date(meeting.end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.warn('Invalid meeting time:', meeting);
          return;
        }

        const meetingDate = dateUtils.formatToYYYYMMDD(startDate);
        const timeComparison = dateUtils.formatTimeComparison(
          meeting.start,
          consultant.timeZone,
        );
        const timeRange = dateUtils.formatTimeRange(
          meeting.start,
          meeting.end,
          consultant.timeZone,
          true,
        );

        if (!timeComparison || !meetingDate) {
          console.warn('Failed to process meeting:', meeting);
          return;
        }

        const slot = {
          id: meeting.id || `${consultant.id}-${meetingDate}-${index}`,
          date: meetingDate,
          start: meeting.start,
          end: meeting.end,

          clientStartTime: timeComparison.client.time,
          clientEndTime: dateUtils.formatTimeComparison(
            meeting.end,
            consultant.timeZone,
          ).client.time,
          clientTimezone: timeComparison.client.timezone,

          consultantStartTime: timeComparison.consultant.time,
          consultantEndTime: dateUtils.formatTimeComparison(
            meeting.end,
            consultant.timeZone,
          ).consultant.time,
          consultantTimezone: consultant.timeZone,

          timeRange: timeRange,
          clientTimeRange: timeRange.clientOnly,
          consultantTimeRange: timeRange.consultantOnly,

          duration: dateUtils.calculateDuration(meeting.start, meeting.end),
          status: meeting.status || 'available',
          price: meeting.price || 150,

          startTime: timeComparison.client.time,
          endTime: dateUtils.formatTimeComparison(
            meeting.end,
            consultant.timeZone,
          ).client.time,
          startTimeOriginal: dateUtils.formatTime(meeting.start),
          endTimeOriginal: dateUtils.formatTime(meeting.end),
        };

        slotsArray.push({
          slot,
          consultant,
        });
      });
    }
    return slotsArray;
  }, [consultant]);

  const handleSlotSelect = (slot, consultant) => {
    if (slot && slot.status === 'available') {
      setSelectedSlot(slot);
      setSelectedConsultant(consultant);
    } else {
      setSelectedSlot(null);
      setSelectedConsultant(null);
    }
  };

  const handleBooking = () => {
    if (selectedSlot && selectedConsultant) {
      const bookingDate = dateUtils.formatDate(selectedSlot.start, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      const timeInfo = selectedSlot.timeRange;
      let timeDisplay = '';

      if (
        typeof timeInfo === 'object' &&
        timeInfo.client !== timeInfo.consultant
      ) {
        timeDisplay = `Client Time: ${timeInfo.client}\nConsultant Time: ${timeInfo.consultant}`;
      } else {
        timeDisplay = typeof timeInfo === 'object' ? timeInfo.client : timeInfo;
      }

      alert(
        `Session booked with ${selectedConsultant.name}\n` +
          `Date: ${bookingDate}\n` +
          `${timeDisplay}\n` +
          `Duration: ${selectedSlot.duration}\n` +
          `Price: $${selectedSlot.price}`,
      );

      setSelectedSlot(null);
      setSelectedConsultant(null);
    }
  };

  return {
    slots,
    selectedSlot,
    selectedConsultant,
    handleSlotSelect,
    handleBooking,
    consultant,
  };
};
