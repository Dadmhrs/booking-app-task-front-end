import { useState, useMemo } from 'react';
import { dateUtils } from '../utils/dateUtils';

export const useSlots = (consultantId, consultants) => {
  console.log('=== USE SLOTS DEBUG ===');
  console.log('consultantId:', consultantId);
  console.log('consultants:', consultants);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  // اگر consultantId خودش یک object است، از همان استفاده کنیم
  const consultant = useMemo(() => {
    let foundConsultant = null;

    // اگر consultantId خودش consultant object است
    if (consultantId && typeof consultantId === 'object' && consultantId.id) {
      foundConsultant = consultantId;
      console.log('Using consultantId as consultant object:', foundConsultant);
    }
    // اگر consultants یک آرایه است
    else if (Array.isArray(consultants)) {
      foundConsultant = consultants.find((c) => c.id === consultantId) || null;
      console.log('Found consultant from array:', foundConsultant);
    }
    // اگر consultants خودش یک consultant object است
    else if (consultants && typeof consultants === 'object' && consultants.id) {
      foundConsultant = consultants;
      console.log('Using consultants as consultant object:', foundConsultant);
    }

    console.log('Final found consultant:', foundConsultant);
    return foundConsultant;
  }, [consultantId, consultants]);

  const slots = useMemo(() => {
    const slotsArray = [];
    console.log('Processing consultant for slots:', consultant);

    if (consultant && consultant.meetings) {
      console.log('Consultant meetings:', consultant.meetings);

      consultant.meetings.forEach((meeting, index) => {
        console.log('Processing meeting:', meeting);

        // استخراج تاریخ از فرمت ISO
        const startDate = new Date(meeting.start);
        const endDate = new Date(meeting.end);
        const meetingDate = dateUtils.formatToYYYYMMDD(startDate);

        // تشکیل slot object با فرمت صحیح
        const slot = {
          id: meeting.id || `${consultant.id}-${meetingDate}-${index}`,
          date: meetingDate, // تاریخ در فرمت YYYY-MM-DD
          start: meeting.start, // زمان شروع ISO format
          end: meeting.end, // زمان پایان ISO format
          startTime: dateUtils.formatTime(meeting.start),
          endTime: dateUtils.formatTime(meeting.end),
          status: meeting.status || 'available',
          price: meeting.price || 150,
        };

        slotsArray.push({
          slot,
          consultant,
        });

        console.log('Added slot:', slot);
      });
    }

    console.log('Final slots array:', slotsArray);
    return slotsArray;
  }, [consultant]);

  const handleSlotSelect = (slot, consultant) => {
    console.log('Slot selected:', slot);

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
      const bookingDate = dateUtils.formatDate(
        `${selectedSlot.date}T${selectedSlot.start}`,
        { weekday: 'long', month: 'long', day: 'numeric' },
      );

      alert(
        `Session booked with ${selectedConsultant.name} on ${bookingDate} at ${selectedSlot.startTime}`,
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
