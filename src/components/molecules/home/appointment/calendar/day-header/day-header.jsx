import React, { useState, useEffect } from 'react';

export const DayHeader = () => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mobileDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
      {(isMobile ? mobileDayNames : dayNames).map((day) => (
        <div
          key={day}
          className="p-2 sm:p-3 text-center font-semibold text-gray-700 text-xs sm:text-sm"
        >
          {day}
        </div>
      ))}
    </div>
  );
};
