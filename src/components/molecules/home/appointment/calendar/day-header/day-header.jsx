// Hooks
import useDayHeader from '@/hooks/logics/molecules/calendar/useDayHeader.js';

export const DayHeader = () => {
  const { dayNames, mobileDayNames, isMobile } = useDayHeader();

  return (
    <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
      {(isMobile ? mobileDayNames : dayNames).map((day, index) => (
        <div
          key={index}
          className="p-2 sm:p-3 text-center font-semibold text-gray-700 text-xs sm:text-sm"
        >
          {day}
        </div>
      ))}
    </div>
  );
};
