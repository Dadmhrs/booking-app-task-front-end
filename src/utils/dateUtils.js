export const dateUtils = {
  formatTime: (timeString, format24h = true, sourceTimeZone = null) => {
    let date;

    // اگر timeString یک زمان ساده است (مثل "10:00")
    if (
      typeof timeString === 'string' &&
      timeString.includes(':') &&
      !timeString.includes('T')
    ) {
      const [hours, minutes] = timeString.split(':');
      date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      // اگر timeString یک تاریخ کامل است (ISO format)
      date = new Date(timeString);
    }

    // اگر sourceTimeZone مشخص شده، زمان را به timezone محلی تبدیل کن
    if (sourceTimeZone) {
      // این فقط برای نمایش timezone مبدا است - تبدیل واقعی نیاز به library پیچیده‌تری دارد
      // فعلاً فقط زمان UTC را نمایش می‌دهیم
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: !format24h,
        timeZone: 'UTC', // می‌توانید اینجا timezone کلاینت را قرار دهید
      });
    }

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !format24h,
    });
  },

  // تابع جدید برای تبدیل timezone
  convertToClientTimezone: (isoTimeString, sourceTimeZone = 'UTC') => {
    const date = new Date(isoTimeString);

    // تبدیل به timezone محلی مرورگر
    return {
      localTime: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      localDate: date.toLocaleDateString('en-US'),
      clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  },

  // تابع برای نمایش زمان با timezone info
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

  // تابع بهبود یافته برای مقایسه تاریخ
  isSameDate: (dateString1, dateString2) => {
    if (!dateString1 || !dateString2) return false;

    console.log('Comparing dates:', { dateString1, dateString2 });

    const formatDate = (dateStr) => {
      let date;

      // اگر ورودی یک Date object است
      if (dateStr instanceof Date) {
        date = dateStr;
      }
      // اگر ورودی یک string است
      else if (typeof dateStr === 'string') {
        // اگر فرمت YYYY-MM-DD است
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          date = new Date(dateStr + 'T00:00:00');
        } else {
          date = new Date(dateStr);
        }
      } else {
        return null;
      }

      // فرمت به YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;

      console.log('Formatted date:', { input: dateStr, output: formatted });
      return formatted;
    };

    const formatted1 = formatDate(dateString1);
    const formatted2 = formatDate(dateString2);

    const result = formatted1 === formatted2;
    console.log('Date comparison result:', { formatted1, formatted2, result });

    return result;
  },

  // تابع برای فرمت تاریخ به YYYY-MM-DD
  formatToYYYYMMDD: (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
};
