import React, { useState } from 'react';

const useFilterDropDown = ({ onDayChange, onTimeZoneChange }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleDayFilterChange = (selectedDay) => {
    if (onDayChange) {
      onDayChange(selectedDay);
    }
  };

  const handleTimeZoneFilterChange = (selectedTimeZone) => {
    if (onTimeZoneChange) {
      onTimeZoneChange(selectedTimeZone);
    }
  };

  return {
    isMobileFilterOpen,
    handleDayFilterChange,
    handleTimeZoneFilterChange,
    setIsMobileFilterOpen,
  };
};
export default useFilterDropDown;
