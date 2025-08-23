import React from 'react';
// Atoms
import BookingModal from '@/components/atoms/modals/booking-modal.jsx';
// Organisms
import { CalendarHeader } from '@/components/organisms/appointment/calendar/calendar-header.jsx/calendar-header.jsx';
import { CalendarGrid } from '@/components/organisms/appointment/calendar/calendar-grid/calendar-grid.jsx';
import { BookingConfirmation } from '@/components/organisms/appointment/calendar/booking-confirmation/booking.jsx';
// Hooks
import { useCalendar } from '@/hooks/logics/templates/appointment/useCalendar.js';

export const CalendarLayout = ({
  consultantId,
  consultants,
  onNavigateHome,
}) => {
  const {
    currentDate,
    view,
    days,
    navigate,
    changeView,
    slots,
    selectedSlot,
    displayConsultant,
    bookingStep,
    isBooking,
    showConfirmation,
    bookingModal,
    bookingStats,
    clientStats,
    handleSlotSelect,
    handleBooking,
    handleModalClose,
    handleNavigateHome,
    handleCancelBooking,
    getClientBookingsCount,
  } = useCalendar(undefined, consultantId, consultants, onNavigateHome);

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

        {bookingStep === 'confirmation' && showConfirmation && !isBooking && (
          <BookingConfirmation
            selectedSlot={selectedSlot}
            selectedConsultant={displayConsultant}
            onConfirm={handleBooking}
            onCancel={handleCancelBooking}
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
                  Please wait while we process your request...
                </p>
              </div>
            </div>
          </div>
        )}

        {bookingStats.totalBookings > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              📊 Current Bookings Summary
            </h4>
            <div className="text-xs text-blue-600">
              <p>Total bookings: {bookingStats.totalBookings}</p>
              <p>Unique clients: {bookingStats.uniqueClients}</p>
              <div className="mt-2 text-gray-600">
                <p className="font-semibold">Recent Clients:</p>
                <div className="max-h-20 overflow-y-auto">
                  {bookingStats.recentClients.map((clientName, index) => (
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

        {clientStats.totalClients > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-semibold text-green-800 mb-2">
              📊 Legacy Client Statistics
            </h4>
            <div className="text-xs text-green-600">
              <p>Total registered clients: {clientStats.totalClients}</p>
              <p>Total booked meetings: {clientStats.totalMeetings}</p>
              <div className="mt-2 text-gray-600">
                <p className="font-semibold">Recent Clients:</p>
                <div className="max-h-20 overflow-y-auto">
                  {clientStats.recentClients.map((client, index) => (
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
