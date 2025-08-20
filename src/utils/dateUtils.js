export const dateUtils = {
  parseTimezoneOffset: (timezoneStr) => {
    if (!timezoneStr) return 0;

    const match = timezoneStr.match(/UTC([+-])(\d+)/);
    if (match) {
      const sign = match[1] === '+' ? 1 : -1;
      const hours = parseInt(match[2]);
      return sign * hours;
    }
    return 0;
  },

  consultantTimeToUTC: (isoTimeString, consultantTimezone) => {
    if (!isoTimeString) return null;

    const localTime = new Date(isoTimeString);
    if (isNaN(localTime.getTime())) return null;

    const consultantOffsetHours =
      dateUtils.parseTimezoneOffset(consultantTimezone);

    const utcTime = new Date(
      localTime.getTime() - consultantOffsetHours * 60 * 60 * 1000,
    );

    return utcTime;
  },

  convertToClientTimezone: (isoTimeString, consultantTimezone = 'UTC') => {
    if (!isoTimeString) return null;

    const utcDate = dateUtils.consultantTimeToUTC(
      isoTimeString,
      consultantTimezone,
    );
    if (!utcDate) return null;

    const clientTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      time: utcDate.toLocaleTimeString('en-US', {
        timeZone: clientTZ,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      time12h: utcDate.toLocaleTimeString('en-US', {
        timeZone: clientTZ,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      date: utcDate.toLocaleDateString('en-US', {
        timeZone: clientTZ,
      }),
      timezone: clientTZ,
      fullDateTime: new Date(
        utcDate.toLocaleString('en-US', { timeZone: clientTZ }),
      ),
      utcTime: utcDate,
    };
  },

  formatConsultantTime: (isoTimeString, consultantTimezone) => {
    if (!isoTimeString)
      return { time: 'Invalid', timezone: consultantTimezone };

    const date = new Date(isoTimeString);
    if (isNaN(date.getTime()))
      return { time: 'Invalid', timezone: consultantTimezone };

    return {
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      time12h: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      timezone: consultantTimezone,
    };
  },

  formatTimeComparison: (isoTimeString, consultantTimezone) => {
    const consultantTime = dateUtils.formatConsultantTime(
      isoTimeString,
      consultantTimezone,
    );
    const clientTime = dateUtils.convertToClientTimezone(
      isoTimeString,
      consultantTimezone,
    );

    if (!clientTime) return null;

    return {
      consultant: consultantTime,
      client: clientTime,
      isSameTime: consultantTime.time === clientTime.time,
      timeDifference: dateUtils.calculateTimeDifference(
        consultantTimezone,
        clientTime.timezone,
      ),
    };
  },

  calculateTimeDifference: (consultantTZ, clientTZ) => {
    const consultantOffset = dateUtils.parseTimezoneOffset(consultantTZ);

    const now = new Date();
    const clientOffsetMinutes = now.getTimezoneOffset();
    const clientOffsetHours = -clientOffsetMinutes / 60;

    return consultantOffset - clientOffsetHours;
  },

  formatTimeRange: (
    startISOString,
    endISOString,
    consultantTimezone,
    showBothTimezones = true,
  ) => {
    const startComparison = dateUtils.formatTimeComparison(
      startISOString,
      consultantTimezone,
    );
    const endComparison = dateUtils.formatTimeComparison(
      endISOString,
      consultantTimezone,
    );

    if (!startComparison || !endComparison) return 'Invalid Time Range';

    const clientRange = `${startComparison.client.time} - ${endComparison.client.time}`;
    const consultantRange = `${startComparison.consultant.time} - ${endComparison.consultant.time}`;

    if (showBothTimezones && !startComparison.isSameTime) {
      return {
        client: `${clientRange} (${startComparison.client.timezone})`,
        consultant: `${consultantRange} (${consultantTimezone})`,
        clientOnly: clientRange,
        consultantOnly: consultantRange,
      };
    }

    return {
      client: `${clientRange} (${startComparison.client.timezone})`,
      consultant: consultantRange,
      clientOnly: clientRange,
      consultantOnly: consultantRange,
    };
  },

  calculateDuration: (startISOString, endISOString) => {
    const start = new Date(startISOString);
    const end = new Date(endISOString);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Invalid Duration';
    }

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

  formatTime: (timeString, format24h = true) => {
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

    if (isNaN(date.getTime())) {
      return 'Invalid Time';
    }

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !format24h,
    });
  },

  formatDate: (dateString, options = { month: 'short', day: 'numeric' }) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', options);
  },

  formatToYYYYMMDD: (date) => {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  isSameDay: (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
    return d1.toDateString() === d2.toDateString();
  },

  isToday: (date) => {
    return dateUtils.isSameDay(date, new Date());
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

      if (isNaN(date.getTime())) return null;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatted1 = formatDate(dateString1);
    const formatted2 = formatDate(dateString2);

    return formatted1 && formatted2 && formatted1 === formatted2;
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
};
