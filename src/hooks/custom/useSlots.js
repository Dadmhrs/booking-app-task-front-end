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
        const startComparison = dateUtils.formatTimeComparison(
          meeting.start,
          consultant.timeZone,
        );
        const endComparison = dateUtils.formatTimeComparison(
          meeting.end,
          consultant.timeZone,
        );
        const timeRange = dateUtils.formatTimeRange(
          meeting.start,
          meeting.end,
          consultant.timeZone,
          true,
        );

        if (!startComparison || !endComparison || !timeRange) {
          console.warn('Failed to process meeting:', meeting);
          return;
        }

        const meetingDateClient = dateUtils.formatToYYYYMMDD(
          new Date(startComparison.client.date),
        );

        const slot = {
          id: meeting.id || `${consultant.id}-${meetingDateClient}-${index}`,

          date: meetingDateClient,
          originalDate: dateUtils.formatToYYYYMMDD(startDate),

          start: meeting.start,
          end: meeting.end,

          clientStartTime: startComparison.client.time,
          clientEndTime: endComparison.client.time,
          clientDate: startComparison.client.date,
          clientTimezone: startComparison.client.timezone,

          consultantStartTime: startComparison.consultant.time,
          consultantEndTime: endComparison.consultant.time,
          consultantDate: startComparison.consultant.date,
          consultantTimezone: consultant.timeZone,

          timeRange: timeRange,
          clientTimeRange: timeRange.client,
          consultantTimeRange: timeRange.consultant,
          isDifferentDate: timeRange.isDifferentDate,

          duration: dateUtils.calculateDuration(meeting.start, meeting.end),
          status: meeting.status || 'available',
          price: meeting.price || 150,

          startTime: startComparison.client.time,
          endTime: endComparison.client.time,
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
      const clientDate = new Date(selectedSlot.clientDate);
      const bookingDate = clientDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      let timeDisplay = `Your Time: ${selectedSlot.clientTimeRange}`;
      if (selectedSlot.isDifferentDate) {
        timeDisplay += `\nConsultant's Time: ${selectedSlot.consultantTimeRange} (${selectedSlot.consultantDate})`;
        timeDisplay += `\n⚠️ Note: Different date due to timezone difference`;
      } else if (
        selectedSlot.consultantTimezone !== selectedSlot.clientTimezone
      ) {
        timeDisplay += `\nConsultant's Time: ${selectedSlot.consultantTimeRange} (${selectedSlot.consultantTimezone})`;
      }

      alert(
        `Session booked with ${selectedConsultant.name}\n` +
          `Date: ${bookingDate}\n` +
          `${timeDisplay}\n` +
          `Duration: ${selectedSlot.duration}\n` +
          `Price: ${selectedSlot.price}`,
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
