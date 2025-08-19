import React, { useState, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  MapPin,
  Menu,
  X,
} from 'lucide-react';

// Types and Constants
const VIEW_TYPES = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
};

const SLOT_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  PENDING: 'pending',
};

// Utility Functions
const dateUtils = {
  formatTime: (dateString, format24h = true) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !format24h,
    });
  },

  formatDate: (dateString, options = { month: 'short', day: 'numeric' }) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  },

  isSameDay: (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
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

  getDaySlots: (currentDate) => {
    return [
      {
        date: new Date(currentDate),
        isToday: dateUtils.isToday(currentDate),
        isCurrentMonth: true,
      },
    ];
  },
};

// Mobile Header Component
const MobileHeader = React.memo(
  ({ currentDate, view, onViewChange, onNavigate, consultant }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return (
      <div className="lg:hidden">
        {/* Consultant Info */}
        {consultant && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-3">
              <img
                src={consultant.image}
                alt={consultant.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-800 truncate">
                  {consultant.name}
                </h2>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {consultant.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">
              Select Date & Time
            </h1>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-lg">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
              {Object.values(VIEW_TYPES).map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => {
                    onViewChange(viewType);
                    setIsMenuOpen(false);
                  }}
                  className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                    view === viewType
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Prev</span>
              </button>

              <h2 className="text-sm font-semibold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <button
                onClick={() => onNavigate(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <span className="text-sm">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

// Desktop Header Component
const DesktopHeader = React.memo(
  ({ currentDate, view, onViewChange, onNavigate, consultant }) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return (
      <div className="hidden lg:block">
        {/* Consultant Info */}
        {consultant && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={consultant.image}
                alt={consultant.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {consultant.name}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {consultant.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Timezone: {consultant.timeZone}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-blue-600" />
              Select Date & Time
            </h1>
            <p className="text-gray-600 mt-1">
              Choose your preferred time slot
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {Object.values(VIEW_TYPES).map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => onViewChange(viewType)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    view === viewType
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onNavigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold text-gray-800 min-w-[140px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <button
                onClick={() => onNavigate(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

// Time Slot Component
const TimeSlot = React.memo(
  ({ slot, consultant, isSelected, onSelect, isMobile = false }) => {
    const getSlotColor = () => {
      if (isSelected) return 'bg-blue-600 text-white border-blue-600';

      switch (slot.status) {
        case SLOT_STATUS.AVAILABLE:
          return 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100';
        case SLOT_STATUS.RESERVED:
          return 'bg-red-50 text-red-800 border-red-200 cursor-not-allowed';
        case SLOT_STATUS.PENDING:
          return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        default:
          return 'bg-gray-50 text-gray-600 border-gray-200';
      }
    };

    const isClickable = slot.status === SLOT_STATUS.AVAILABLE;

    if (isMobile) {
      return (
        <div
          onClick={() => isClickable && onSelect(slot, consultant)}
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${getSlotColor()} ${
            !isClickable ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {slot.startTime} - {slot.endTime}
              </span>
            </div>
            <span className="font-bold text-lg">${slot.price || '150'}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={consultant.image}
                alt={consultant.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium">{consultant.name}</span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                slot.status === SLOT_STATUS.AVAILABLE
                  ? 'bg-green-100 text-green-700'
                  : slot.status === SLOT_STATUS.RESERVED
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {slot.status === SLOT_STATUS.RESERVED ? 'Reserved' : slot.status}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => isClickable && onSelect(slot, consultant)}
        className={`text-xs p-2 rounded-md cursor-pointer transition-all duration-200 border ${getSlotColor()} ${
          !isClickable ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <img
            src={consultant.image}
            alt={consultant.name}
            className="w-4 h-4 rounded-full"
          />
          <span className="font-medium truncate">{consultant.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{slot.startTime}</span>
          </div>
          <span className="font-semibold">${slot.price || '150'}</span>
        </div>
        {slot.status === SLOT_STATUS.RESERVED && (
          <div className="text-xs text-red-600 mt-1 truncate">Reserved</div>
        )}
      </div>
    );
  },
);

// Mobile Day View Component
const MobileDayView = React.memo(
  ({ currentDate, slots, onSlotSelect, selectedSlotId }) => {
    const formattedDate = currentDate.toISOString().split('T')[0];
    const daySlots = slots.filter(({ slot }) => slot.date === formattedDate);

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Date Header */}
        <div className="bg-blue-50 p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {dateUtils.formatDate(currentDate.toISOString(), {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {
              daySlots.filter(
                ({ slot }) => slot.status === SLOT_STATUS.AVAILABLE,
              ).length
            }{' '}
            available sessions
          </p>
        </div>

        {/* Time Slots */}
        <div className="p-4">
          {daySlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No sessions available for this day</p>
            </div>
          ) : (
            <div className="space-y-3">
              {daySlots.map(({ slot, consultant }) => (
                <TimeSlot
                  key={slot.id}
                  slot={slot}
                  consultant={consultant}
                  isSelected={selectedSlotId === slot.id}
                  onSelect={onSlotSelect}
                  isMobile={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

// Calendar Day Component
const CalendarDay = React.memo(
  ({ day, view, slots, onSlotSelect, selectedSlotId }) => {
    const formattedDate = day.date.toISOString().split('T')[0];
    const daySlots = slots.filter(({ slot }) => slot.date === formattedDate);

    const hasAvailableSlots = daySlots.some(
      ({ slot }) => slot.status === SLOT_STATUS.AVAILABLE,
    );
    const hasAnySlots = daySlots.length > 0;

    // رنگ‌بندی روزها
    const getDayBackgroundColor = () => {
      if (day.isToday) return 'bg-blue-50 border-blue-200';
      if (view === VIEW_TYPES.MONTH && !day.isCurrentMonth)
        return 'bg-gray-50 text-gray-400';
      if (hasAvailableSlots) return 'bg-white'; // روزهای فعال (دارای جلسه available)
      return 'bg-gray-100'; // روزهای غیرفعال (بدون جلسه یا فقط reserved)
    };

    return (
      <div
        className={`min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] p-1 sm:p-2 border-b border-r border-gray-200 ${getDayBackgroundColor()}`}
      >
        {/* Date */}
        <div
          className={`text-sm font-medium mb-1 sm:mb-2 ${
            day.isToday
              ? 'text-blue-600'
              : view === VIEW_TYPES.MONTH && !day.isCurrentMonth
              ? 'text-gray-400'
              : hasAvailableSlots
              ? 'text-gray-700'
              : 'text-gray-500'
          }`}
        >
          {day.date.getDate()}
          {day.isToday && (
            <span className="text-xs ml-1 hidden sm:inline">(Today)</span>
          )}
        </div>

        {/* Time Slots */}
        <div className="space-y-1">
          {daySlots
            .slice(0, window.innerWidth < 640 ? 2 : 3)
            .map(({ slot, consultant }) => (
              <TimeSlot
                key={slot.id}
                slot={slot}
                consultant={consultant}
                isSelected={selectedSlotId === slot.id}
                onSelect={onSlotSelect}
              />
            ))}
          {daySlots.length > (window.innerWidth < 640 ? 2 : 3) && (
            <div className="text-xs text-gray-500 text-center py-1">
              +{daySlots.length - (window.innerWidth < 640 ? 2 : 3)} more
            </div>
          )}
        </div>
      </div>
    );
  },
);

// Calendar Grid Component
const CalendarGrid = React.memo(
  ({ days, view, slots, onSlotSelect, selectedSlotId, isMobile }) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const mobileDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    if (view === VIEW_TYPES.DAY && isMobile) {
      return (
        <MobileDayView
          currentDate={days[0].date}
          slots={slots}
          onSlotSelect={onSlotSelect}
          selectedSlotId={selectedSlotId}
        />
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {(isMobile ? mobileDayNames : dayNames).map((day, index) => (
            <div
              key={day}
              className="p-2 sm:p-3 text-center font-semibold text-gray-700 text-xs sm:text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <CalendarDay
              key={`${day.date.toISOString()}-${index}`}
              day={day}
              view={view}
              slots={slots}
              onSlotSelect={onSlotSelect}
              selectedSlotId={selectedSlotId}
            />
          ))}
        </div>
      </div>
    );
  },
);

// Booking Confirmation Component
const BookingConfirmation = React.memo(
  ({ selectedSlot, selectedConsultant, onConfirm, onCancel }) => {
    if (!selectedSlot || !selectedConsultant) return null;

    return (
      <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Confirm Your Booking
        </h3>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Consultant Info */}
          <div className="flex items-start gap-4 flex-1">
            <img
              src={selectedConsultant.image}
              alt={selectedConsultant.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                {selectedConsultant.name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                {selectedConsultant.description}
              </p>
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 flex-1">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-medium">
                  {dateUtils.formatDate(
                    `${selectedSlot.date}T${selectedSlot.start}`,
                    { weekday: 'long', month: 'long', day: 'numeric' },
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium">
                  {dateUtils.formatTime(selectedSlot.start)} -{' '}
                  {dateUtils.formatTime(selectedSlot.end)}
                </span>
                <span className="text-xs text-gray-500">
                  ({selectedConsultant.timeZone})
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Online Meeting</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 text-sm">
                    Session Fee:
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    ${selectedSlot.price || '150'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
              <button
                onClick={onConfirm}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                Book Session
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm sm:text-base border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

// Main Calendar Component
const ConsultantCalendar = ({ selectedConsultantId, consultants }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 19)); // August 19, 2025
  const [view, setView] = useState(VIEW_TYPES.MONTH);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto switch to day view on mobile
  React.useEffect(() => {
    if (isMobile && view === VIEW_TYPES.MONTH) {
      setView(VIEW_TYPES.DAY);
    }
  }, [isMobile, view]);

  // Find selected consultant
  const consultant = useMemo(() => {
    return consultants?.find((c) => c.id === selectedConsultantId) || null;
  }, [selectedConsultantId, consultants]);

  // Memoized calendar days
  const days = useMemo(() => {
    if (view === VIEW_TYPES.MONTH) {
      return dateUtils.getMonthDays(currentDate);
    } else if (view === VIEW_TYPES.WEEK) {
      return dateUtils.getWeekDays(currentDate);
    } else {
      return dateUtils.getDaySlots(currentDate);
    }
  }, [currentDate, view]);

  // Memoized slots with consultant data
  const slotsWithConsultants = useMemo(() => {
    const slots = [];

    if (consultant && consultant.meetings) {
      consultant.meetings.forEach((meeting) => {
        slots.push({
          slot: {
            ...meeting,
            id: meeting.id,
            date: meeting.date,
            startTime: dateUtils.formatTime(meeting.start),
            endTime: dateUtils.formatTime(meeting.end),
            status: meeting.status,
            price: 150, // قیمت ثابت برای همه جلسات
          },
          consultant,
        });
      });
    }

    return slots;
  }, [consultant]);

  // Navigation handler
  const handleNavigate = useCallback(
    (direction) => {
      const newDate = new Date(currentDate);
      if (view === VIEW_TYPES.MONTH) {
        newDate.setMonth(newDate.getMonth() + direction);
      } else if (view === VIEW_TYPES.WEEK) {
        newDate.setDate(newDate.getDate() + direction * 7);
      } else {
        newDate.setDate(newDate.getDate() + direction);
      }
      setCurrentDate(newDate);
    },
    [currentDate, view],
  );

  // View change handler
  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  // Slot selection handler
  const handleSlotSelect = useCallback((slot, consultant) => {
    if (slot.status === SLOT_STATUS.AVAILABLE) {
      setSelectedSlot(slot);
      setSelectedConsultant(consultant);
    }
  }, []);

  // Booking confirmation handler
  const handleBookingConfirm = useCallback(() => {
    if (selectedSlot && selectedConsultant) {
      alert(
        `Session booked with ${selectedConsultant.name} on ${selectedSlot.date} at ${selectedSlot.startTime}`,
      );
      setSelectedSlot(null);
      setSelectedConsultant(null);
    }
  }, [selectedSlot, selectedConsultant]);

  // Cancel booking handler
  const handleBookingCancel = useCallback(() => {
    setSelectedSlot(null);
    setSelectedConsultant(null);
  }, []);

  if (!consultant) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Consultant Not Found
          </h3>
          <p className="text-gray-600">
            Please select a valid consultant to view available time slots.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isMobile ? (
        <MobileHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onNavigate={handleNavigate}
          consultant={consultant}
        />
      ) : (
        <DesktopHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onNavigate={handleNavigate}
          consultant={consultant}
        />
      )}

      <CalendarGrid
        days={days}
        view={view}
        slots={slotsWithConsultants} // استفاده از slotsWithConsultants به جای slots
        onSlotSelect={handleSlotSelect}
        selectedSlotId={selectedSlot?.id}
        isMobile={isMobile}
      />

      <BookingConfirmation
        selectedSlot={selectedSlot}
        selectedConsultant={selectedConsultant}
        onConfirm={handleBookingConfirm}
        onCancel={handleBookingCancel}
      />
    </div>
  );
};

export default ConsultantCalendar;
