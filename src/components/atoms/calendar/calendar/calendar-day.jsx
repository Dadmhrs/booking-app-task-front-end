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
        p-0.5 xs:p-1 sm:p-2
      `}
    >
      <div className="flex items-center justify-between mb-0.5 xs:mb-1 sm:mb-2">
        <span
          className={`
            text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium
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
          <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-400 rounded-full"></span>
        )}
      </div>

      <div className="space-y-1 xs:space-y-2">
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
                cursor-pointer rounded-md xs:rounded-lg px-1 xs:px-1.5 sm:px-2 
                py-1 xs:py-1.5 sm:py-2 w-full
                transition-all duration-200
                ${
                  slot.status === 'available'
                    ? isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-0.5 xs:mb-1">
                    <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-white shadow-md mr-1 xs:mr-2 flex-shrink-0 hidden lg:block">
                      <img
                        src={consultant.image || '/images/default-avatar.png'}
                        alt={consultant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center overflow-hidden">
                      <div className="flex flex-col leading-none">
                        <span className="font-mono font-bold text-[8px] xs:text-[9px] sm:text-sm md:text-base tracking-tight whitespace-nowrap">
                          {slot.clientStartTime ||
                            dateUtils.convertToClientTimezone(slot.start)?.time}
                        </span>
                        <span className="font-mono font-bold text-[8px] xs:text-[9px] sm:text-sm md:text-base tracking-tight whitespace-nowrap">
                          {slot.clientEndTime ||
                            dateUtils.convertToClientTimezone(slot.end)?.time}
                        </span>
                      </div>
                      {(isWeekView || isDayView) && (
                        <span className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-semibold sm:ml-2 hidden sm:inline truncate">
                          {consultant.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {(isWeekView || isDayView) && (
                    <div className="flex flex-wrap items-center gap-0.5 xs:gap-1 mt-0.5 xs:mt-1">
                      <span className="text-[7px] xs:text-[8px] sm:text-xs opacity-75 bg-blue-50 px-1 xs:px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        {duration}
                      </span>
                      <span className="text-[7px] xs:text-[8px] sm:text-xs opacity-75 bg-blue-50 px-1 xs:px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        {clientTimezone.includes('/')
                          ? clientTimezone.split('/').pop()
                          : clientTimezone.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>
                {(isWeekView || isDayView) && (
                  <div className="flex flex-col items-end ml-1 xs:ml-2 flex-shrink-0">
                    <span className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-semibold sm:hidden truncate max-w-[60px] xs:max-w-[80px]">
                      {consultant.name}
                    </span>
                    {slot.consultantStartTime && slot.consultantEndTime && (
                      <div className="text-[7px] xs:text-[8px] sm:text-xs opacity-50 mt-0.5 xs:mt-1 hidden sm:block">
                        <span className="text-gray-500 whitespace-nowrap">
                          {slot.consultantStartTime} - {slot.consultantEndTime}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {(isWeekView || isDayView) && (
                <div className="mt-0.5 xs:mt-1 sm:hidden">
                  <span className="text-[8px] xs:text-[9px] text-gray-600 truncate block">
                    {consultant.name}
                  </span>
                  {slot.consultantStartTime && slot.consultantEndTime && (
                    <div className="text-[7px] xs:text-[8px] opacity-50 mt-0.5 xs:mt-1">
                      <span className="text-gray-500 whitespace-nowrap">
                        {slot.consultantStartTime} - {slot.consultantEndTime}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!hasSlots && day.isCurrentMonth && (isWeekView || isDayView) && (
        <div className="text-[8px] xs:text-[9px] sm:text-xs text-gray-400 mt-1 xs:mt-2 text-center">
          No available slots
        </div>
      )}
    </div>
  );
};
