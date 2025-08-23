import { useState } from 'react';

const useDayFilter = ({ onDayChange }) => {
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

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
    if (onDayChange) {
      onDayChange(newTime);
    }
  };

  const handleClearSelection = () => {
    setSelectedTime('');
    if (onDayChange) {
      onDayChange('');
    }
  };

  return { selectedTime, timeOptions, handleTimeChange, handleClearSelection };
};
export default useDayFilter;
