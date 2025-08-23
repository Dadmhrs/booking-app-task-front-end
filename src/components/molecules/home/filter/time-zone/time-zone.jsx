import { X } from 'lucide-react';
// Atoms
import Dropdown from '@/components/atoms/dropdown-menu/drop-down.jsx';
// Hooks
import useTimezoneFilter from '@/hooks/logics/molecules/home/useTimezoneFilter.js';

const TimeZoneFilter = ({ onTimeZoneChange }) => {
  const {
    selectedTimeZone,
    timeZoneDisplayOptions,
    handleTimeZoneChange,
    handleClearSelection,
  } = useTimezoneFilter({ onTimeZoneChange });

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-black mb-2">Time Zone</h3>
        <div className="w-12 h-0.5 bg-gray-300 rounded-full"></div>
      </div>

      <div className="space-y-4">
        <Dropdown
          options={timeZoneDisplayOptions}
          value={selectedTimeZone}
          onChange={handleTimeZoneChange}
          placeholder="Select time zone..."
          className="w-full"
        />

        {selectedTimeZone && (
          <div className="mt-6 p-3 bg-red-500 text-white rounded-xl shadow-lg flex items-center justify-between">
            <p className="font-medium">
              <span className="text-red-100">Selected:</span> {selectedTimeZone}
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

export default TimeZoneFilter;
