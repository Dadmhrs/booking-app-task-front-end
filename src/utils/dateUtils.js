export const dateUtils = {
  formatTime: (timeString, format24h = true, sourceTimeZone = null) => {
    let date;

    if (
      typeof timeString === 'string' &&
      timeString.includes(':') &&
      !timeString.includes('T')
    ) {
      const [hours, minutes] = timeString.split(':');
      date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      date = new Date(timeString);
    }

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !format24h,
    });
  },

  convertToClientTimezone: (isoTimeString, sourceTimeZone = 'UTC') => {
    const date = new Date(isoTimeString);
    const clientTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime);

    return {
      time: localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      time12h: localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      date: localTime.toLocaleDateString('en-US'),
      timezone: clientTZ,
      offset: date.getTimezoneOffset(),
      fullDateTime: localTime,
    };
  },

  formatTimeRange: (startISOString, endISOString, showTimezone = true) => {
    const startLocal = dateUtils.convertToClientTimezone(startISOString);
    const endLocal = dateUtils.convertToClientTimezone(endISOString);

    const timeRange = `${startLocal.time} - ${endLocal.time}`;

    if (showTimezone) {
      return `${timeRange} (${startLocal.timezone})`;
    }

    return timeRange;
  },

  calculateDuration: (startISOString, endISOString) => {
    const start = new Date(startISOString);
    const end = new Date(endISOString);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    if (durationMinutes >= 60) {
      const hours = Math.floor(durationMinutes / 60);
      const remainingMinutes = durationMinutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    }

    return `${durationMinutes}m`;
  },

  formatTimeWithTimezone: (isoTimeString, sourceTimeZone = null) => {
    const date = new Date(isoTimeString);
    const clientTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const localTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return {
      time: localTime,
      timezone: clientTZ,
      offset: date.getTimezoneOffset(),
    };
  },

  formatDate: (dateString, options = { month: 'short', day: 'numeric' }) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  },

  isSameDay: (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  },

  isToday: (date) => {
    return dateUtils.isSameDay(date, new Date());
  },

  getMonthDays: (currentDate) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push({
        date: new Date(currentDateObj),
        isCurrentMonth: currentDateObj.getMonth() === month,
        isToday: dateUtils.isToday(currentDateObj),
      });
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    return days;
  },

  getWeekDays: (currentDate) => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      days.push({
        date: new Date(currentDay),
        isToday: dateUtils.isToday(currentDay),
        isCurrentMonth: true,
      });
    }

    return days;
  },

  isSameDate: (dateString1, dateString2) => {
    if (!dateString1 || !dateString2) return false;

    const formatDate = (dateStr) => {
      let date;

      if (dateStr instanceof Date) {
        date = dateStr;
      } else if (typeof dateStr === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          date = new Date(dateStr + 'T00:00:00');
        } else {
          date = new Date(dateStr);
        }
      } else {
        return null;
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      return formatted;
    };

    const formatted1 = formatDate(dateString1);
    const formatted2 = formatDate(dateString2);

    const result = formatted1 === formatted2;
    return result;
  },

  formatToYYYYMMDD: (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
};
