import { X } from 'lucide-react';

// Atoms
import Dropdown from '@/components/atoms/dropdown-menu/drop-down.jsx';
// Hooks
import useDayFilter from '@/hooks/logics/molecules/home/useDayFilter.js';

const DayTimeFilter = ({ onDayChange }) => {
  const { selectedTime, timeOptions, handleTimeChange, handleClearSelection } =
    useDayFilter({ onDayChange });

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-black mb-2">Day Filter</h3>
        <div className="w-12 h-0.5 bg-gray-300 rounded-full"></div>
      </div>

      <div className="space-y-4">
        <Dropdown
          options={timeOptions}
          value={selectedTime}
          onChange={handleTimeChange}
          placeholder="Choose a day..."
          className="w-full"
        />

        {selectedTime && (
          <div className="mt-6 p-3 bg-red-500 text-white rounded-xl shadow-lg flex items-center justify-between">
            <p className="font-medium">
              <span className="text-red-100">Selected:</span> {selectedTime}
            </p>
            <button
              onClick={handleClearSelection}
              className="ml-2 p-1 hover:bg-red-600 rounded-full transition-colors duration-150"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayTimeFilter;
