import React from 'react';
//Atoms
import { CalendarDay } from '@/components/atoms/calendar/calendar/calendar-day.jsx';
//Molecules
import { DayHeader } from '@/components/molecules/home/appointment/calendar/day-header/day-header.jsx';

export const CalendarGrid = ({
  days,
  view,
  slots,
  onSlotSelect,
  selectedSlotId,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <DayHeader />
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <CalendarDay
            key={`${day.date.toISOString()}-${index}`}
            day={day}
            view={view}
            slots={slots}
            onSlotSelect={onSlotSelect}
            selectedSlotId={selectedSlotId}
          />
        ))}
      </div>
    </div>
  );
};
