// Enhanced CalendarLayout.jsx - Fixed error handling to always show BookingModal

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

  const [showConfirmation, setShowConfirmation] = useState(false);

  const { consultants: reduxConsultants } = useAppSelector(
    (state) => state.consultants,
  );

  const { clients } = useAppSelector((state) => state.clients);

  const { isHydrated, bookedMeetings } = useAppSelector(
    (state) => state.booking,
  );

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
      setShowConfirmation(false);
    }
  };

  const handleBooking = async (clientName) => {
    if (selectedSlot && selectedConsultant && clientName) {
      // Hide confirmation immediately when booking starts
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
  };

  // Handle successful booking - show success modal
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

      setShowConfirmation(false); // Ensure confirmation is hidden

      setTimeout(() => {
        dispatch(clearBookingStatus());
      }, 100);
    }
  }, [bookingSuccess, dispatch]);

  // Handle booking errors - show error modal
  useEffect(() => {
    if (bookingError) {
      let errorTitle = 'Booking Failed';
      let errorMessage = bookingError;

      // Categorize errors for better user experience
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

      setShowConfirmation(false); // Ensure confirmation is hidden for all errors

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

  // Helper function to get unique client names from bookings
  const getUniqueClientNames = () => {
    const clientNames = bookedMeetings.map((booking) =>
      booking.clientName.trim(),
    );
    return [...new Set(clientNames)].sort();
  };

  // Helper function to get bookings count for a client
  const getClientBookingsCount = (clientName) => {
    return bookedMeetings.filter(
      (booking) =>
        booking.clientName.toLowerCase().trim() ===
        clientName.toLowerCase().trim(),
    ).length;
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

        {/* Only show BookingConfirmation if bookingStep is 'confirmation' AND showConfirmation is true AND not booking */}
        {bookingStep === 'confirmation' && showConfirmation && !isBooking && (
          <BookingConfirmation
            selectedSlot={selectedSlot}
            selectedConsultant={selectedConsultant}
            onConfirm={handleBooking}
            onCancel={() => {
              dispatch(clearSelection());
              setShowConfirmation(false);
            }}
            isBooking={isBooking}
          />
        )}

        {/* Processing overlay */}
        {isBooking && (
          <div className="fixed bottom-[0px] left-0 w-full h-full bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 max-w-sm mx-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Processing Your Booking
                </h3>
                <p className="text-gray-600 text-sm">
                  Please wait while we process your request...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced booking statistics */}
        {bookedMeetings && bookedMeetings.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              📊 Current Bookings Summary
            </h4>
            <div className="text-xs text-blue-600">
              <p>Total bookings: {bookedMeetings.length}</p>
              <p>Unique clients: {getUniqueClientNames().length}</p>
              <div className="mt-2 text-gray-600">
                <p className="font-semibold">Recent Clients:</p>
                <div className="max-h-20 overflow-y-auto">
                  {getUniqueClientNames()
                    .slice(0, 5)
                    .map((clientName, index) => (
                      <p key={index} className="text-xs">
                        • {clientName} ({getClientBookingsCount(clientName)}{' '}
                        booking
                        {getClientBookingsCount(clientName) !== 1 ? 's' : ''})
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legacy clients display for backwards compatibility */}
        {clients && clients.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-semibold text-green-800 mb-2">
              📊 Legacy Client Statistics
            </h4>
            <div className="text-xs text-green-600">
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
      </div>

      {/* BookingModal for all success and error states */}
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
