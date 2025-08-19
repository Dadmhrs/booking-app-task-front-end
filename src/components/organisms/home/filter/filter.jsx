import React, { useState } from 'react';
import { Settings } from 'lucide-react';
//Molecules
import DayTimeFilter from '@/components/molecules/home/filter/day/day.jsx';
import TimeZoneFilter from '@/components/molecules/home/filter/time-zone/time-zone.jsx';

const FilterSection = ({ children }) => (
  <div className="py-6 first-of-type:pt-0 last-of-type:pb-0">{children}</div>
);

const HomePageFilter = ({ onDayChange, onTimeZoneChange }) => {
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

  const filters = [
    <DayTimeFilter key="day" onDayChange={handleDayFilterChange} />,
    <TimeZoneFilter
      key="timezone"
      onTimeZoneChange={handleTimeZoneFilterChange}
    />,
  ];

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6 z-10">
        <div
          className="flex items-center mb-2 cursor-pointer"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-black">Filters</h2>
        </div>
        <div className="w-full h-1 bg-gray-400 rounded-full"></div>
      </div>

      {/* Desktop Filter Container */}
      <div
        className={`
          bg-gray-50 p-6 border border-gray-200 shadow-lg rounded-2xl
          lg:block
          ${isMobileFilterOpen ? 'block' : 'hidden'}
          z-10
        `}
      >
        <div className="space-y-6">
          <header className="mb-6 hidden lg:block">
            <h2 className="text-2xl font-bold text-black mb-2">Filters</h2>
            <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
          </header>

          <div className="divide-y divide-gray-200">
            {filters.map((filter, index) => (
              <FilterSection key={index}>{filter}</FilterSection>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageFilter;
