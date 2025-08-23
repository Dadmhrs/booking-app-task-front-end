// Atoms
import ConfirmationOverlay from '@/components/molecules/home/appointment/confirmation-overlay/overlay.jsx';
// Hooks
import useBookingConfirmations from '@/hooks/logics/organisms/appointment/calender/useBookingConfirmation.js';

export const BookingConfirmation = ({
  selectedSlot,
  selectedConsultant,
  onConfirm,
  onCancel,
  isBooking,
}) => {
  const {
    clientName,
    setClientName,
    timeDisplays,
    durationInfo,
    handleConfirm,
    handleKeyPress,
    isFormValid,
    consultantImage,
    consultantName,
    consultantDescription,
    meetingDateDisplay,
    consultarTimezoneStartingTime,
    consultarTimezoneEndingTime,
    clientTimezoneStartingTime,
    clientTimezoneEndingTime,
    clientTimezone,
    consultarTimezone,
    durationSettings,
    priceSettings,
    notValidForm,
    notValidFormAndBooking,
    validFormNotBooking,
  } = useBookingConfirmations({
    isBooking,
    onConfirm,
    selectedSlot,
    selectedConsultant,
  });

  if (!timeDisplays) {
    return (
      <ConfirmationOverlay
        isOpen={true}
        onClose={onCancel}
        closeOnBackdropClick={!isBooking}
      >
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            Loading booking details...
          </p>
        </div>
      </ConfirmationOverlay>
    );
  }

  return (
    <ConfirmationOverlay
      isOpen={true}
      onClose={onCancel}
      closeOnBackdropClick={!isBooking}
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:p-6 rounded-t-xl">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Confirm Your Booking
        </h2>
        <p className="text-blue-100 text-sm md:text-base">
          Please review your appointment details
        </p>
      </div>

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
            <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0">
              <img
                src={consultantImage}
                alt={consultantName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base lg:text-lg">
                {consultantName}
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-600">
                {consultantDescription.slice(0, 80)}
                {consultantDescription.length > 80 ? '...' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <h4 className="font-semibold text-gray-900 border-b pb-2 text-sm md:text-base">
            Appointment Details
          </h4>

          <div className="bg-blue-50 rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between">
              <span className="text-gray-600 font-medium text-xs md:text-sm">
                📅 Date:
              </span>
              <p className="text-gray-900 font-semibold text-xs md:text-sm">
                {meetingDateDisplay}
              </p>
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between">
              <span className="text-gray-600 font-medium text-xs md:text-sm">
                ⏰ Time (Your Timezone):
              </span>
              <p className="text-gray-900 font-semibold text-xs md:text-sm">
                {clientTimezoneStartingTime} - {clientTimezoneEndingTime}
              </p>
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between">
              <span className="text-gray-600 font-medium text-xs md:text-sm">
                ⏰ Time (Consultant's Timezone):
              </span>
              <p className="text-gray-900 font-semibold text-xs md:text-sm">
                {consultarTimezoneStartingTime} - {consultarTimezoneEndingTime}
              </p>
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between">
              <span className="text-gray-600 font-medium text-xs md:text-sm">
                🌍 Your Timezone:
              </span>
              <p className="text-gray-900 font-semibold text-xs md:text-sm">
                {clientTimezone}
              </p>
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between">
              <span className="text-gray-600 font-medium text-xs md:text-sm">
                🌍 Consultant's Timezone:
              </span>
              <p className="text-gray-900 font-semibold text-xs md:text-sm">
                {consultarTimezone}
              </p>
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between">
              <span className="text-gray-600 font-medium text-xs md:text-sm">
                ⏱️ Duration:
              </span>
              <p
                className={`font-semibold text-xs md:text-sm ${
                  durationInfo?.isValid ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {durationSettings}
              </p>
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between">
              <span className="text-gray-600 font-medium text-xs md:text-sm">
                💰 Price:
              </span>
              <p className="text-green-600 font-semibold text-xs md:text-sm">
                ${priceSettings}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <label
            htmlFor="clientName"
            className="block text-xs md:text-sm font-medium text-gray-700"
          >
            Your Full Name *
          </label>
          <input
            id="clientName"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your full name"
            className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-xs md:text-sm"
            disabled={isBooking}
          />
          {notValidForm && (
            <p className="text-red-500 text-xs">Please enter your name</p>
          )}
        </div>

        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="mb-2">
            <strong>Booking Terms:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Cancellations must be made at least 24 hours in advance</li>
            <li>Meeting duration must be between 30 minutes and 2 hours</li>
            <li>All times are displayed in your local timezone</li>
            <li>You'll receive a confirmation with meeting details</li>
          </ul>
        </div>
      </div>

      <div className="p-4 md:p-6 bg-gray-50 rounded-b-xl flex flex-col xs:flex-row gap-2 md:gap-3">
        <button
          onClick={handleConfirm}
          disabled={notValidFormAndBooking}
          className={`flex-1 px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-2 ${
            validFormNotBooking
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isBooking ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isBooking}
          className="flex-1 px-3 py-2 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 text-xs md:text-sm"
        >
          Cancel
        </button>
      </div>
    </ConfirmationOverlay>
  );
};

export default BookingConfirmation;
