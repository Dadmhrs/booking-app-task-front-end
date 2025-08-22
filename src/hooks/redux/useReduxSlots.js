import { useMemo } from 'react';
import { useAppSelector } from '@/hooks/redux/useRedux.js';

export const useReduxSlots = (consultantId, consultants) => {
  const { bookedMeetings, isHydrated } = useAppSelector(
    (state) => state.booking,
  );

  const slots = useMemo(() => {
    if (!consultants || !Array.isArray(consultants)) {
      return [];
    }
    if (!isHydrated) {
      return [];
    }
    const targetConsultant = consultants.find(
      (consultant) => consultant.id === consultantId,
    );

    if (!targetConsultant) {
      return [];
    }
    const consultantSlots = [];

    if (
      !targetConsultant.meetings ||
      !Array.isArray(targetConsultant.meetings)
    ) {
      return [];
    }

    targetConsultant.meetings.forEach((meeting) => {
      const isBooked = bookedMeetings.some(
        (booking) =>
          booking.consultantId === targetConsultant.id &&
          booking.meetingId === meeting.id,
      );
      const updatedMeeting = {
        ...meeting,
        status: isBooked ? 'reserved' : meeting.status || 'available',
        clientName: isBooked
          ? bookedMeetings.find(
              (booking) =>
                booking.consultantId === targetConsultant.id &&
                booking.meetingId === meeting.id,
            )?.clientName
          : meeting.clientName,
      };
      consultantSlots.push({
        slot: updatedMeeting,
        consultant: targetConsultant,
      });
    });
    const sortedSlots = consultantSlots.sort((a, b) => {
      const dateA = new Date(a.slot.start);
      const dateB = new Date(b.slot.start);
      return dateA - dateB;
    });
    return sortedSlots;
  }, [consultants, bookedMeetings, isHydrated, consultantId]);

  return { slots };
};
