import React from 'react';
//Organisms
import { CalendarHeader } from '@/components/organisms/appointment/calendar/calendar-header.jsx/calendar-header.jsx';
import { CalendarGrid } from '@/components/organisms/appointment/calendar/calendar-grid/calendar-grid.jsx';
import { BookingConfirmation } from '@/components/organisms/appointment/calendar/booking-confirmation/booking.jsx';
//Hooks
import { useCalendar } from '@/hooks/useCalendar.js';
import { useSlots } from '@/hooks/useSlots.js';

export const CalendarLayout = ({ consultantId, consultants }) => {
  const { currentDate, view, days, navigate, changeView } = useCalendar();
  const {
    slots,
    selectedSlot,
    selectedConsultant,
    handleSlotSelect,
    handleBooking,
  } = useSlots(consultantId, consultants);

  // تشخیص consultant برای نمایش در header
  const displayConsultant = (() => {
    if (consultantId && typeof consultantId === 'object' && consultantId.id) {
      return consultantId;
    }
    if (selectedConsultant) {
      return selectedConsultant;
    }
    if (Array.isArray(consultants)) {
      return consultants.find((c) => c.id === consultantId) || null;
    }
    if (consultants && typeof consultants === 'object' && consultants.id) {
      return consultants;
    }
    return null;
  })();

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        consultant={displayConsultant}
        onNavigate={navigate}
        onViewChange={changeView}
      />

      <CalendarGrid
        days={days}
        view={view}
        slots={slots}
        onSlotSelect={handleSlotSelect}
        selectedSlotId={selectedSlot?.id}
      />

      <BookingConfirmation
        selectedSlot={selectedSlot}
        selectedConsultant={selectedConsultant}
        onConfirm={handleBooking}
        onCancel={() => handleSlotSelect(null, null)}
      />
    </div>
  );
};
