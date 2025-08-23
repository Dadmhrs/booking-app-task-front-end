import { useState, useEffect } from 'react';
// Redux
import { useAppSelector } from '../../redux/useRedux.js';
// Types
import { ViewType } from '@/types/calendar.js';
// Utils
import { dateUtils } from '@/utils/dateUtils.js';

const useCalendarDay = ({ day, view, slots, selectedSlotId }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { bookedMeetings } = useAppSelector((state) => state.booking);
  const isWeekView = view === ViewType.WEEK;
  const isDayView = view === ViewType.DAY;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dayDateString = dateUtils.formatToYYYYMMDD(day.date);

  const daySlots = slots.filter((slotData) => {
    const slot = slotData.slot;
    return dateUtils.isSameDate(slot.date, dayDateString);
  });

  const hasSlots = daySlots.length > 0;

  const isSlotBooked = (slotId, consultantId) => {
    return bookedMeetings.some(
      (booking) =>
        booking.consultantId === consultantId && booking.meetingId === slotId,
    );
  };

  const getBookedClientName = (slotId, consultantId) => {
    const booking = bookedMeetings.find(
      (booking) =>
        booking.consultantId === consultantId && booking.meetingId === slotId,
    );
    return booking?.clientName || booking?.bookingDetails?.clientName;
  };

  const isDayOrWeek = isWeekView || isDayView;

  const processSlotData = (slotData) => {
    const slot = slotData.slot;
    const consultant = slotData.consultant;
    const isSelected = selectedSlotId === slot.id;

    const isRealTimeBooked = isSlotBooked(slot.id, consultant.id);
    const realTimeClientName = getBookedClientName(slot.id, consultant.id);

    const finalStatus = isRealTimeBooked ? 'reserved' : slot.status;
    const finalClientName = realTimeClientName || slot.clientName;

    const getSlotClassName = () => {
      const baseClasses =
        'rounded-md xs:rounded-lg px-1 xs:px-1.5 sm:px-2 py-1 xs:py-1.5 sm:py-2 w-full transition-all duration-200';

      if (finalStatus === 'available') {
        if (isSelected) {
          return `${baseClasses} bg-blue-600 text-white shadow-md cursor-pointer`;
        }
        return `${baseClasses} bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer`;
      } else if (finalStatus === 'reserved') {
        return `${baseClasses} bg-red-100 text-red-800 cursor-not-allowed opacity-90 ${
          isRealTimeBooked ? 'ring-2 ring-red-300' : ''
        }`;
      } else {
        return `${baseClasses} bg-gray-100 text-gray-500 cursor-not-allowed`;
      }
    };

    const displayTime = (() => {
      if (slot.clientStartTime && slot.clientEndTime) {
        return `${slot.clientStartTime} - ${slot.clientEndTime}`;
      }

      const startTime = dateUtils.convertToClientTimezone(slot.start);
      const endTime = dateUtils.convertToClientTimezone(slot.end);

      if (startTime && endTime) {
        return `${startTime.time} - ${endTime.time}`;
      }

      return 'Time not available';
    })();

    const clientTimezone =
      slot.clientTimezone ||
      (typeof window !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : 'UTC');

    const duration = dateUtils.calculateDuration(slot.start, slot.end);

    const startingTime =
      slot.clientStartTime ||
      dateUtils.convertToClientTimezone(slot.start)?.time ||
      'N/A';

    const endingTime =
      slot.clientEndTime ||
      dateUtils.convertToClientTimezone(slot.end)?.time ||
      'N/A';

    return {
      slot,
      consultant,
      isSelected,
      isRealTimeBooked,
      finalStatus,
      finalClientName,
      getSlotClassName,
      displayTime,
      clientTimezone,
      duration,
      startingTime,
      endingTime,
    };
  };

  const processedSlots = daySlots.map(processSlotData);

  const statusReserved = (slot) => slot.finalStatus === 'reserved';
  const reservedAndClientName = (slot) =>
    slot.finalStatus === 'reserved' && slot.finalClientName;
  const noSlotAvailable =
    !hasSlots && day.isCurrentMonth && (isWeekView || isDayView);

  return {
    isMounted,
    isWeekView,
    isDayView,
    isDayOrWeek,
    daySlots,
    hasSlots,
    isSlotBooked,
    getBookedClientName,
    noSlotAvailable,
    dayDateString,
    processedSlots,
    statusReserved,
    reservedAndClientName,
  };
};

export default useCalendarDay;
