import React from 'react';
// Types
import { ViewType } from '@/types/calendar.js';
// Utils
import { dateUtils } from '@/utils/dateUtils.js';

export const CalendarDay = ({
  day,
  view,
  slots,
  onSlotSelect,
  selectedSlotId,
}) => {
  const isWeekView = view === ViewType.WEEK;
  const isDayView = view === ViewType.DAY;

  const dayDateString = dateUtils.formatToYYYYMMDD(day.date);

  const daySlots = slots.filter((slotData) => {
    const slot = slotData.slot;
    return dateUtils.isSameDate(slot.date, dayDateString);
  });

  const hasSlots = daySlots.length > 0;

  return (
    <div
      className={`
        border-r border-b border-gray-200 last:border-r-0
        ${
          !day.isCurrentMonth
            ? 'bg-gray-50'
            : hasSlots
            ? 'bg-white'
            : 'bg-gray-100'
        }
        ${day.isToday ? (hasSlots ? 'bg-blue-100' : 'bg-blue-50') : ''}
        ${
          isDayView
            ? 'min-h-[600px]'
            : isWeekView
            ? 'min-h-[300px]'
            : 'min-h-[120px]'
        }
        p-1 sm:p-2
      `}
    >
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <span
          className={`
            text-[10px] sm:text-xs md:text-sm font-medium
            ${
              !day.isCurrentMonth
                ? 'text-gray-400'
                : hasSlots
                ? 'text-gray-700'
                : 'text-gray-500'
            }
            ${day.isToday ? 'text-blue-600 font-semibold' : ''}
          `}
        >
          {day.date.getDate()}
        </span>
        {hasSlots && (
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
        )}
      </div>

      <div className="space-y-2 flex flex-col items-center">
        {daySlots.map((slotData, index) => {
          const slot = slotData.slot;
          const consultant = slotData.consultant;
          const isSelected = selectedSlotId === slot.id;

          const displayTime =
            slot.clientStartTime && slot.clientEndTime
              ? `${slot.clientStartTime} - ${slot.clientEndTime}`
              : `${dateUtils.convertToClientTimezone(slot.start)?.time} - ${
                  dateUtils.convertToClientTimezone(slot.end)?.time
                }`;

          const clientTimezone =
            slot.clientTimezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone;

          const duration = dateUtils.calculateDuration(slot.start, slot.end);

          return (
            <div
              key={`${slot.id}-${index}`}
              onClick={() => onSlotSelect(slot, consultant)}
              className={`
                cursor-pointer rounded-lg px-2 py-2 w-full max-w-[200px]
                transition-all duration-200
                flex flex-col items-center text-center
                ${
                  slot.status === 'available'
                    ? isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-md mb-2">
                <img
                  src={consultant.image || '/images/default-avatar.png'}
                  alt={consultant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium text-[10px] sm:text-xs md:text-sm mb-1">
                {displayTime}
              </span>

              {(isWeekView || isDayView) && (
                <>
                  <span className="text-[10px] sm:text-xs md:text-sm font-semibold mb-1">
                    {consultant.name}
                  </span>
                  <div className="text-[9px] sm:text-xs opacity-75 flex flex-col items-center">
                    <span className="mb-1">{duration}</span>
                    <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {clientTimezone.includes('/')
                        ? clientTimezone.split('/').pop()
                        : clientTimezone.replace('_', ' ')}
                    </span>
                  </div>
                  {slot.consultantStartTime && slot.consultantEndTime && (
                    <div className="text-[9px] sm:text-xs opacity-50 mt-2 border-t pt-2">
                      <span className="text-gray-500">
                        Consultant: {slot.consultantStartTime} -{' '}
                        {slot.consultantEndTime} ({consultant.timezone})
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {!hasSlots && day.isCurrentMonth && (isWeekView || isDayView) && (
        <div className="text-[10px] sm:text-xs text-gray-400 mt-2 text-center">
          No available slots
        </div>
      )}
    </div>
  );
};
