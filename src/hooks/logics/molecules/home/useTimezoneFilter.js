import { useState } from 'react';

const useTimezoneFilter = ({ onTimeZoneChange }) => {
  const [selectedTimeZone, setSelectedTimeZone] = useState('');

  const generateTimeZoneOptions = () => [
    { display: 'UTC-4 (Eastern Daylight Time)', value: 'UTC-4' },
    { display: 'UTC-7 (Pacific Daylight Time)', value: 'UTC-7' },
    { display: 'UTC+0 (Greenwich Mean Time)', value: 'UTC+0' },
    { display: 'UTC+9 (Japan Standard Time)', value: 'UTC+9' },
  ];

  const timeZoneOptions = generateTimeZoneOptions();
  const timeZoneDisplayOptions = timeZoneOptions.map((tz) => tz.display);

  const handleTimeZoneChange = (newTimeZone) => {
    setSelectedTimeZone(newTimeZone);

    if (onTimeZoneChange) {
      const selectedOption = timeZoneOptions.find(
        (tz) => tz.display === newTimeZone,
      );
      const timezoneValue = selectedOption ? selectedOption.value : '';
      onTimeZoneChange(timezoneValue);
    }
  };

  const handleClearSelection = () => {
    setSelectedTimeZone('');
    if (onTimeZoneChange) {
      onTimeZoneChange('');
    }
  };

  return {
    selectedTimeZone,
    timeZoneDisplayOptions,
    handleTimeZoneChange,
    handleClearSelection,
  };
};

export default useTimezoneFilter;
