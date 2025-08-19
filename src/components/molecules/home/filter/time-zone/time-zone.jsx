import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
//Atoms
import Dropdown from '@/components/atoms/dropdown-menu/drop-down.jsx';

const TimeZoneFilter = ({ onTimeZoneChange }) => {
  const [selectedTimeZone, setSelectedTimeZone] = useState('');

  const generateTimeZoneOptions = () => {
    return [
      { display: 'UTC-4 (Eastern Daylight Time)', value: 'UTC-4' },
      { display: 'UTC-7 (Pacific Daylight Time)', value: 'UTC-7' },
      { display: 'UTC+0 (Greenwich Mean Time)', value: 'UTC+0' },
      { display: 'UTC+9 (Japan Standard Time)', value: 'UTC+9' },
    ];
  };

  const timeZoneOptions = generateTimeZoneOptions();

  const timeZoneDisplayOptions = timeZoneOptions.map((tz) => tz.display);

  useEffect(() => {
    if (onTimeZoneChange) {
      const selectedOption = timeZoneOptions.find(
        (tz) => tz.display === selectedTimeZone,
      );
      const timezoneValue = selectedOption ? selectedOption.value : '';
      onTimeZoneChange(timezoneValue);
    }
  }, [selectedTimeZone, onTimeZoneChange, timeZoneOptions]);

  const handleClearSelection = () => {
    setSelectedTimeZone('');
  };

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
          onChange={setSelectedTimeZone}
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
