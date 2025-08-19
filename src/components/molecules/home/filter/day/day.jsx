import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

//Atoms
import Dropdown from '@/components/atoms/dropdown-menu/drop-down.jsx';

const DayTimeFilter = ({ onDayChange }) => {
  const [selectedTime, setSelectedTime] = useState('');

  const generateTimeOptions = () => {
    return [
      'Saturday',
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ];
  };

  const timeOptions = generateTimeOptions();

  // Notify parent component when selected day changes
  useEffect(() => {
    if (onDayChange) {
      onDayChange(selectedTime);
    }
  }, [selectedTime, onDayChange]);

  const handleClearSelection = () => {
    setSelectedTime('');
  };

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
          onChange={setSelectedTime}
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
