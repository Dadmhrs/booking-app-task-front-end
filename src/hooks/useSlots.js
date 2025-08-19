import { useState, useMemo } from 'react';
//Utils
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
        const meetingDate = dateUtils.formatToYYYYMMDD(startDate);
        const startTimeLocal = dateUtils.convertToClientTimezone(meeting.start);
        const endTimeLocal = dateUtils.convertToClientTimezone(meeting.end);

        const slot = {
          id: meeting.id || `${consultant.id}-${meetingDate}-${index}`,
          date: meetingDate,
          start: meeting.start,
          end: meeting.end,
          startTime: startTimeLocal.time,
          endTime: endTimeLocal.time,
          startTimeOriginal: dateUtils.formatTime(meeting.start),
          endTimeOriginal: dateUtils.formatTime(meeting.end),
          clientTimezone: startTimeLocal.timezone,
          duration: dateUtils.calculateDuration(meeting.start, meeting.end),
          status: meeting.status || 'available',
          price: meeting.price || 150,
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
      const startTimeLocal = dateUtils.convertToClientTimezone(
        selectedSlot.start,
      );
      const bookingDate = dateUtils.formatDate(selectedSlot.start, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      const timeRange = dateUtils.formatTimeRange(
        selectedSlot.start,
        selectedSlot.end,
        true,
      );

      alert(
        `Session booked with ${selectedConsultant.name}\n` +
          `Date: ${bookingDate}\n` +
          `Time: ${timeRange}\n` +
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
  };
};
