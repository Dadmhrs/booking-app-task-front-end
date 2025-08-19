import React from 'react';
import { dateUtils } from '@/utils/dateUtils';
import { ViewType } from '@/types/calendar';

export const CalendarDay = ({
  day,
  view,
  slots,
  onSlotSelect,
  selectedSlotId,
}) => {
  // ابتدا متغیرهای view را تعریف می‌کنیم
  const isWeekView = view === ViewType.WEEK;
  const isDayView = view === ViewType.DAY;

  // فرمت تاریخ روز جاری به YYYY-MM-DD
  const dayDateString = dateUtils.formatToYYYYMMDD(day.date);

  // پیدا کردن اسلات‌های مربوط به این روز
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
      {/* تاریخ روز */}
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <span
          className={`
            text-xs sm:text-sm font-medium
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

      {/* نمایش اسلات‌ها */}
      <div className="space-y-1">
        {daySlots.map((slotData, index) => {
          const slot = slotData.slot;
          const consultant = slotData.consultant;
          const isSelected = selectedSlotId === slot.id;

          return (
            <div
              key={`${slot.id}-${index}`}
              onClick={() => onSlotSelect(slot, consultant)}
              className={`
                cursor-pointer rounded px-1 py-0.5 sm:px-2 sm:py-1 text-xs
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
              <div className="flex flex-col">
                <span className="font-medium truncate">{slot.startTime}</span>
                {(isWeekView || isDayView) && (
                  <span className="text-xs opacity-75 truncate">
                    {consultant.name}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* نمایش "No slots" در صورت عدم وجود اسلات */}
      {!hasSlots && day.isCurrentMonth && (isWeekView || isDayView) && (
        <div className="text-xs text-gray-400 mt-2">No available slots</div>
      )}
    </div>
  );
};
