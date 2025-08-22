import React, { useEffect, useState } from 'react';
// Atoms
import BookingModal from '@/components/atoms/modals/booking-modal.jsx';
// Organisms
import { CalendarHeader } from '@/components/organisms/appointment/calendar/calendar-header.jsx/calendar-header.jsx';
import { CalendarGrid } from '@/components/organisms/appointment/calendar/calendar-grid/calendar-grid.jsx';
import { BookingConfirmation } from '@/components/organisms/appointment/calendar/booking-confirmation/booking.jsx';
// Hooks
import { useCalendar } from '@/hooks/logics/templates/appointment/useCalendar.js';
import { useReduxSlots } from '@/hooks/redux/useReduxSlots.js';

// Redux
import { useAppDispatch, useAppSelector } from '@/hooks/redux/useRedux.js';
import {
  selectSlot,
  clearSelection,
  clearBookingStatus,
  setConsultants,
  hydrateBookings,
} from '@/redux/bookingSlice.js';
import { bookMeeting } from '@/redux/bookingSlice.js';

export const CalendarLayout = ({
  consultantId,
  consultants,
  onNavigateHome,
}) => {
  const dispatch = useAppDispatch();
  const { currentDate, view, days, navigate, changeView } = useCalendar();

  const [bookingModal, setBookingModal] = useState({
    visible: false,
    type: 'success',
    message: '',
    bookingDetails: null,
    meetingString: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(true);

  const { consultants: reduxConsultants } = useAppSelector(
    (state) => state.consultants,
  );

  const { clients } = useAppSelector((state) => state.clients);

  const { isHydrated } = useAppSelector((state) => state.booking);

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

  const {
    selectedSlot,
    selectedConsultant,
    bookingStep,
    isBooking,
    bookingError,
    bookingSuccess,
  } = useAppSelector((state) => state.booking);

  const displayConsultant = (() => {
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
  })();

  const handleSlotSelect = (slot, consultant) => {
    if (slot && slot.status === 'available') {
      dispatch(selectSlot({ slot, consultant }));
      setShowConfirmation(true);
    } else {
      dispatch(clearSelection());
      setShowConfirmation(true);
    }
  };

  const handleBooking = async (clientName) => {
    if (selectedSlot && selectedConsultant && clientName) {
      try {
        const result = await dispatch(
          bookMeeting({
            consultantId: selectedConsultant.id,
            meetingId: selectedSlot.id,
            clientName,
          }),
        ).unwrap();

        console.log('Booking successful:', result);
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (bookingSuccess) {
      setBookingModal({
        visible: true,
        type: 'success',
        message:
          'Your meeting has been successfully booked! You will receive a confirmation shortly.',
        bookingDetails: bookingSuccess.bookingDetails || null,
        meetingString: bookingSuccess.meetingString || '',
      });
      setTimeout(() => {
        dispatch(clearBookingStatus());
      }, 100);
    }
  }, [bookingSuccess, dispatch]);

  useEffect(() => {
    if (bookingError) {
      let errorMessage = '';
      let errorTitle = '';

      if (
        bookingError.includes('Time Conflict') ||
        bookingError.includes('Time conflict')
      ) {
        errorTitle = '⚠️ Scheduling Conflict Detected!';
        errorMessage = `${bookingError}\n\nPlease select a different time slot that doesn't overlap with your existing bookings.`;
      } else if (
        bookingError.includes('not available') ||
        bookingError.includes('no longer available') ||
        bookingError.includes('already been booked') ||
        bookingError.includes('already reserved')
      ) {
        errorTitle = '❌ Slot Unavailable!';
        errorMessage = `${bookingError}\n\nThis time slot may have been booked by you or another client. Please refresh and select a different time.`;
      } else if (
        bookingError.includes('duration') &&
        (bookingError.includes('short') || bookingError.includes('long'))
      ) {
        if (bookingError.includes('short')) {
          errorTitle = '⏱️ Meeting Duration Too Short!';
          errorMessage = `${bookingError}\n\nPlease select a meeting slot that is at least 30 minutes long.`;
        } else {
          errorTitle = '⏱️ Meeting Duration Too Long!';
          errorMessage = `${bookingError}\n\nPlease select a meeting slot that is no more than 2 hours long.`;
        }
        setShowConfirmation(false);
      } else if (bookingError.includes('not found')) {
        errorTitle = '❌ Booking Error!';
        errorMessage = `${bookingError}\n\nPlease refresh the page and try again.`;
        setShowConfirmation(false);
      } else {
        errorTitle = '❌ Booking Failed!';
        errorMessage = `${bookingError}\n\nPlease try again or contact support if the problem persists.`;
      }

      setBookingModal({
        visible: true,
        type: 'failed',
        message: `${errorTitle}\n\n${errorMessage}`,
        bookingDetails: null,
        meetingString: '',
      });

      setTimeout(() => {
        dispatch(clearBookingStatus());
      }, 100);
    }
  }, [bookingError, dispatch]);

  const handleModalClose = () => {
    setBookingModal({
      visible: false,
      type: 'success',
      message: '',
      bookingDetails: null,
      meetingString: '',
    });

    if (bookingModal.type === 'failed' && !showConfirmation) {
      dispatch(clearSelection());
    }
  };

  const handleNavigateHome = () => {
    if (onNavigateHome && typeof onNavigateHome === 'function') {
      onNavigateHome();
    } else {
      if (window.history && window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <>
      <div className="space-y-6">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          consultant={displayConsultant}
          onNavigate={navigate}
          onViewChange={changeView}
        />

        <CalendarGrid
          days={days}
          view={view}
          slots={slots}
          onSlotSelect={handleSlotSelect}
          selectedSlotId={selectedSlot?.id}
        />

        {bookingStep === 'confirmation' && showConfirmation && (
          <BookingConfirmation
            selectedSlot={selectedSlot}
            selectedConsultant={selectedConsultant}
            onConfirm={handleBooking}
            onCancel={() => {
              dispatch(clearSelection());
              setShowConfirmation(true);
            }}
            isBooking={isBooking}
          />
        )}

        {isBooking && (
          <div className="fixed bottom-[0px] left-0 w-full h-full bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 max-w-sm mx-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Processing Your Booking
                </h3>
                <p className="text-gray-600 text-sm">
                  Checking for conflicts and validating your request...
                </p>
              </div>
            </div>
          </div>
        )}

        {clients && clients.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              📊 Booking Statistics
            </h4>
            <div className="text-xs text-blue-600">
              <p>Total registered clients: {clients.length}</p>
              <p>
                Total booked meetings:{' '}
                {clients.reduce(
                  (total, client) => total + client.meetings.length,
                  0,
                )}
              </p>
              <div className="mt-2 text-gray-600">
                <p className="font-semibold">Recent Clients:</p>
                <div className="max-h-20 overflow-y-auto">
                  {clients.slice(0, 5).map((client, index) => (
                    <p key={index} className="text-xs">
                      • {client.name} ({client.meetings.length} meeting
                      {client.meetings.length !== 1 ? 's' : ''})
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {bookingError && bookingError.includes('Time Conflict') && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <h4 className="text-sm font-semibold text-yellow-800">
                Time Conflict Warning
              </h4>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Please select a different time slot that doesn't overlap with your
              existing bookings.
            </p>
          </div>
        )}
      </div>

      <BookingModal
        visible={bookingModal.visible}
        type={bookingModal.type}
        message={bookingModal.message}
        bookingDetails={bookingModal.bookingDetails}
        meetingString={bookingModal.meetingString}
        onClose={handleModalClose}
        onNavigateHome={onNavigateHome ? handleNavigateHome : null}
        autoRedirectHome={bookingModal.type === 'success' && !!onNavigateHome}
        redirectDelay={5000}
      />
    </>
  );
};
