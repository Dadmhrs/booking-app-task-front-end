import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
// Types
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
          <div className="flex flex-col items-center text-center gap-4 lg:flex-row lg:items-center lg:text-left">
            <img
              src={consultant.image || '/images/default-avatar.png'}
              alt={consultant.name || 'Consultant'}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="flex-1 flex flex-col items-center lg:items-start">
              <h2 className="text-xl font-semibold text-gray-800">
                {consultant.name}
              </h2>
              {consultant.description && (
                <p className="text-gray-600 text-sm mt-2 max-w-prose">
                  {consultant.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Timezone: {consultant.timeZone || consultant.timezone}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 lg:justify-start">
            <Calendar className="w-7 h-7 text-blue-600" />
            Select Date & Time
          </h1>
          <p className="text-gray-600 mt-1">Choose your preferred time slot</p>
        </div>
        <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center">
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 min-w-[160px] text-center">
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
