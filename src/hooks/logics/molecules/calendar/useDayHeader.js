import React, { useState, useEffect } from 'react';

const useDayHeader = () => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mobileDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { dayNames, mobileDayNames, isMobile };
};

export default useDayHeader;
