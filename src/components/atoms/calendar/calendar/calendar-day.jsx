import React from 'react';
// Hooks
import useCalendarDay from '@/hooks/logics/calendar/useCalendarDay.js';

export const CalendarDay = ({
  day,
  view,
  slots,
  onSlotSelect,
  selectedSlotId,
}) => {
  const {
    isMounted,
    isWeekView,
    isDayView,
    isDayOrWeek,
    hasSlots,
    noSlotAvailable,
    processedSlots,
    statusReserved,
    reservedAndClientName,
  } = useCalendarDay({
    day,
    view,
    slots,
    selectedSlotId,
  });

  if (!isMounted) {
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
        <div className="px-1 xs:px-2 space-y-1 xs:space-y-2">
          {hasSlots && (
            <div className="bg-gray-200 animate-pulse rounded-md h-12"></div>
          )}
        </div>
      </div>
    );
  }

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

      <div className="px-1 xs:px-2 space-y-2 xs:space-y-3">
        {processedSlots.map((slotData, index) => (
          <div
            key={`${slotData.slot.id}-${index}`}
            onClick={() =>
              slotData.finalStatus === 'available' &&
              onSlotSelect(slotData.slot, slotData.consultant)
            }
            className={`${slotData.getSlotClassName()} ${
              slotData.finalStatus === 'reserved'
                ? 'cursor-not-allowed'
                : slotData.finalStatus === 'available'
                ? 'cursor-pointer'
                : 'cursor-default'
            }`}
          >
            <div className="flex items-center justify-between mb-1 xs:mb-1.5">
              <div className="flex items-center gap-1 xs:gap-2 flex-1 min-w-0">
                <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0 hidden lg:block">
                  <img
                    src={
                      slotData.consultant.image || '/images/default-avatar.png'
                    }
                    alt={slotData.consultant.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-0.5 xs:gap-1 flex-wrap min-w-0">
                  <span className="font-mono font-semibold text-[8px] xs:text-[9px] sm:text-xs md:text-sm tracking-tight whitespace-nowrap">
                    {slotData.startingTime}
                  </span>
                  <span className="text-[7px] xs:text-[8px] sm:text-[10px] opacity-70">
                    -
                  </span>
                  <span className="font-mono font-semibold text-[8px] xs:text-[9px] sm:text-xs md:text-sm tracking-tight whitespace-nowrap">
                    {slotData.endingTime}
                  </span>
                </div>

                {isDayOrWeek && (
                  <span className="text-[8px] xs:text-[9px] sm:text-xs font-medium hidden sm:inline truncate max-w-[80px] lg:max-w-[120px]">
                    {slotData.consultant.name}
                  </span>
                )}
              </div>

              {statusReserved(slotData) && (
                <div
                  className={`text-[6px] xs:text-[7px] sm:text-[8px] text-red-600 font-bold px-1 xs:px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    slotData.isRealTimeBooked
                      ? 'bg-red-200 animate-pulse ring-1 ring-red-400'
                      : 'bg-red-100'
                  }`}
                >
                  {slotData.isRealTimeBooked ? '🔴' : 'R'}
                </div>
              )}
            </div>

            {isDayOrWeek && (
              <>
                <div className="sm:hidden mb-1">
                  <span className="text-[8px] xs:text-[9px] text-gray-600 font-medium truncate block">
                    {slotData.consultant.name}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-0.5 xs:gap-1 text-[6px] xs:text-[7px] sm:text-[8px]">
                  <span
                    className={`opacity-75 px-1 xs:px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                      slotData.finalStatus === 'reserved'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {slotData.duration}
                  </span>

                  <span
                    className={`opacity-75 px-1 xs:px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                      slotData.finalStatus === 'reserved'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {slotData.clientTimezone.includes('/')
                      ? slotData.clientTimezone.split('/').pop()
                      : slotData.clientTimezone.replace('_', ' ')}
                  </span>

                  {reservedAndClientName(slotData) && (
                    <span className="opacity-90 bg-red-200 text-red-900 px-1 xs:px-1.5 py-0.5 rounded-full whitespace-nowrap font-semibold">
                      {slotData.isRealTimeBooked ? '🔴' : ''}{' '}
                      {slotData.finalClientName}
                    </span>
                  )}
                </div>

                {slotData.slot.consultantStartTime &&
                  slotData.slot.consultantEndTime && (
                    <div className="text-[6px] xs:text-[7px] sm:text-[8px] opacity-50 mt-1 hidden sm:block">
                      <span className="text-gray-500 whitespace-nowrap">
                        Consultant: {slotData.slot.consultantStartTime} -{' '}
                        {slotData.slot.consultantEndTime}
                      </span>
                    </div>
                  )}
              </>
            )}
          </div>
        ))}
      </div>

      {noSlotAvailable && (
        <div className="text-[8px] xs:text-[9px] sm:text-xs text-gray-400 mt-1 xs:mt-2 text-center px-1 xs:px-2">
          No available slots
        </div>
      )}
    </div>
  );
};
