import { useState, useCallback, useMemo, useEffect } from 'react';
// Types
import { ViewType } from '@/types/calendar.js';
// Utils
import { dateUtils } from '@/utils/dateUtils.js';
// Redux
import { useAppDispatch, useAppSelector } from '@/hooks/redux/useRedux.js';
import {
  selectSlot,
  clearSelection,
  clearBookingStatus,
  setConsultants,
  hydrateBookings,
  bookMeeting,
} from '@/redux/bookingSlice.js';
// Hooks
import { useReduxSlots } from '@/hooks/redux/useReduxSlots.js';

export const useCalendar = (
  initialView = ViewType.MONTH,
  consultantId,
  consultants,
  onNavigateHome,
) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(initialView);

  const [bookingModal, setBookingModal] = useState({
    visible: false,
    type: 'success',
    message: '',
    bookingDetails: null,
    meetingString: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const dispatch = useAppDispatch();

  const { consultants: reduxConsultants } = useAppSelector(
    (state) => state.consultants,
  );
  const { clients } = useAppSelector((state) => state.clients);
  const {
    isHydrated,
    bookedMeetings,
    selectedSlot,
    selectedConsultant,
    bookingStep,
    isBooking,
    bookingError,
    bookingSuccess,
  } = useAppSelector((state) => state.booking);

  useEffect(() => {
    if (!isHydrated) {
      dispatch(hydrateBookings());
    }
  }, [dispatch, isHydrated]);

  useEffect(() => {
    dispatch(setConsultants(reduxConsultants));
  }, [reduxConsultants, dispatch]);

  const { slots } = useReduxSlots(
    consultantId,
    reduxConsultants || consultants,
  );

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

  const displayConsultant = useMemo(() => {
    if (consultantId && typeof consultantId === 'object' && consultantId.id) {
      return consultantId;
    }
    if (selectedConsultant) {
      return selectedConsultant;
    }

    const consultantsList = reduxConsultants;

    if (Array.isArray(consultantsList)) {
      return consultantsList.find((c) => c.id === consultantId) || null;
    }
    if (
      consultantsList &&
      typeof consultantsList === 'object' &&
      consultantsList.id
    ) {
      return consultantsList;
    }
    return null;
  }, [consultantId, selectedConsultant, reduxConsultants]);

  const handleSlotSelect = useCallback(
    (slot, consultant) => {
      if (slot && slot.status === 'available') {
        dispatch(selectSlot({ slot, consultant }));
        setShowConfirmation(true);
      } else {
        dispatch(clearSelection());
        setShowConfirmation(false);
      }
    },
    [dispatch],
  );

  const handleBooking = useCallback(
    async (clientName) => {
      if (selectedSlot && selectedConsultant && clientName) {
        setShowConfirmation(false);

        try {
          const result = await dispatch(
            bookMeeting({
              consultantId: selectedConsultant.id,
              meetingId: selectedSlot.id,
              clientName: clientName.trim(),
            }),
          ).unwrap();

          console.log('Booking successful:', result);
        } catch (error) {
          console.log('Booking error caught:', error);
        }
      }
    },
    [selectedSlot, selectedConsultant, dispatch],
  );

  useEffect(() => {
    if (bookingSuccess) {
      const { bookingDetails } = bookingSuccess;

      setBookingModal({
        visible: true,
        type: 'success',
        message:
          'Your meeting has been successfully booked! You will receive a confirmation email shortly.',
        bookingDetails: bookingDetails,
        meetingString: bookingSuccess.meetingString || '',
      });

      setShowConfirmation(false);

      setTimeout(() => {
        dispatch(clearBookingStatus());
      }, 100);
    }
  }, [bookingSuccess, dispatch]);

  useEffect(() => {
    if (bookingError) {
      let errorTitle = 'Booking Failed';
      let errorMessage = bookingError;

      if (bookingError.includes('Time Conflict')) {
        errorTitle = 'Schedule Conflict';
        errorMessage =
          'You already have a meeting scheduled at this time. Please select a different time slot.';
      } else if (
        bookingError.includes('not available') ||
        bookingError.includes('no longer available')
      ) {
        errorTitle = 'Slot Unavailable';
        errorMessage =
          'This time slot is no longer available. Please refresh and select a different time.';
      } else if (bookingError.includes('too short')) {
        errorTitle = 'Meeting Too Short';
        errorMessage =
          'Please select a meeting slot that is at least 30 minutes long.';
      } else if (bookingError.includes('too long')) {
        errorTitle = 'Meeting Too Long';
        errorMessage =
          'Please select a meeting slot that is no more than 2 hours long.';
      } else if (bookingError.includes('valid client name')) {
        errorTitle = 'Invalid Name';
        errorMessage = 'Please enter a valid name with at least 2 characters.';
      }

      setBookingModal({
        visible: true,
        type: 'failed',
        message: errorMessage,
        bookingDetails: null,
        meetingString: '',
      });

      setShowConfirmation(false);

      setTimeout(() => {
        dispatch(clearBookingStatus());
      }, 100);
    }
  }, [bookingError, dispatch]);

  const handleModalClose = useCallback(() => {
    setBookingModal({
      visible: false,
      type: 'success',
      message: '',
      bookingDetails: null,
      meetingString: '',
    });
  }, []);

  const handleNavigateHome = useCallback(() => {
    if (onNavigateHome && typeof onNavigateHome === 'function') {
      onNavigateHome();
    } else {
      if (window.history && window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  }, [onNavigateHome]);

  const handleCancelBooking = useCallback(() => {
    dispatch(clearSelection());
    setShowConfirmation(false);
  }, [dispatch]);

  const getUniqueClientNames = useCallback(() => {
    const clientNames = bookedMeetings.map((booking) =>
      booking.clientName.trim(),
    );
    return [...new Set(clientNames)].sort();
  }, [bookedMeetings]);

  const getClientBookingsCount = useCallback(
    (clientName) => {
      return bookedMeetings.filter(
        (booking) =>
          booking.clientName.toLowerCase().trim() ===
          clientName.toLowerCase().trim(),
      ).length;
    },
    [bookedMeetings],
  );

  const bookingStats = useMemo(
    () => ({
      totalBookings: bookedMeetings?.length || 0,
      uniqueClients: getUniqueClientNames().length,
      recentClients: getUniqueClientNames().slice(0, 5),
    }),
    [bookedMeetings, getUniqueClientNames],
  );

  const clientStats = useMemo(
    () => ({
      totalClients: clients?.length || 0,
      totalMeetings:
        clients?.reduce((total, client) => total + client.meetings.length, 0) ||
        0,
      recentClients: clients?.slice(0, 5) || [],
    }),
    [clients],
  );

  return {
    currentDate,
    view,
    days,
    navigate,
    changeView,
    slots,
    selectedSlot,
    selectedConsultant,
    displayConsultant,
    bookingStep,
    isBooking,
    showConfirmation,
    bookingModal,
    bookingStats,
    clientStats,
    bookedMeetings,
    clients,
    handleSlotSelect,
    handleBooking,
    handleModalClose,
    handleNavigateHome,
    handleCancelBooking,
    getUniqueClientNames,
    getClientBookingsCount,
  };
};
