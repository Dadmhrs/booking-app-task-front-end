import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewType } from '../../../../../types/calendar.js';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const CalendarHeader = ({
  currentDate,
  view,
  consultant,
  onNavigate,
  onViewChange,
}) => {
  return (
    <div className="space-y-6">
      {consultant && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <img
              src={consultant.image}
              alt={consultant.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {consultant.name}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {consultant.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Timezone: {consultant.timeZone}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-blue-600" />
            Select Date & Time
          </h1>
          <p className="text-gray-600 mt-1">Choose your preferred time slot</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {Object.values(ViewType).map((viewType) => (
              <button
                key={viewType}
                onClick={() => onViewChange(viewType)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === viewType
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <button
              onClick={() => onNavigate(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
