import { useState, useCallback, useMemo } from 'react';
// Types
import { ViewType } from '../types/calendar';
// Utils
import { dateUtils } from '../utils/dateUtils';

export const useCalendar = (initialView = ViewType.MONTH) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(initialView);

  const navigate = useCallback(
    (direction) => {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        if (view === ViewType.MONTH) {
          newDate.setMonth(newDate.getMonth() + direction);
        } else {
          newDate.setDate(
            newDate.getDate() + direction * (view === ViewType.WEEK ? 7 : 1),
          );
        }
        return newDate;
      });
    },
    [view],
  );

  const changeView = useCallback((newView) => {
    setView(newView);
  }, []);

  const days = useMemo(() => {
    if (view === ViewType.MONTH) {
      return dateUtils.getMonthDays(currentDate);
    } else if (view === ViewType.WEEK) {
      return dateUtils.getWeekDays(currentDate);
    } else {
      return [
        {
          date: currentDate,
          isCurrentMonth: true,
          isToday: dateUtils.isToday(currentDate),
        },
      ];
    }
  }, [currentDate, view]);

  return {
    currentDate,
    view,
    days,
    navigate,
    changeView,
  };
};
