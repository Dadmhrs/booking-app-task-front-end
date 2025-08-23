import {
  Check,
  Home,
  X,
  AlertTriangle,
  AlertCircle,
  Clock,
} from 'lucide-react';
// Hook
import useBookingModal from '@/hooks/logics/atoms/modals/useBookingModal.js';

const ICON_MAP = {
  success: Check,
  warning: AlertTriangle,
  error: X,
  info: AlertCircle,
  duration: Clock,
};

const ERROR_SUGGESTIONS = {
  duration_short: [
    'Select a longer time slot (at least 30 minutes)',
    'Look for extended appointment options',
    'Contact the consultant for custom duration',
  ],
  duration_long: [
    'Select a shorter time slot (maximum 2 hours)',
    'Break your session into multiple appointments',
    'Contact the consultant for extended sessions',
  ],
  conflict: [
    "Choose a different time that doesn't conflict",
    'Check your existing appointments',
    'Try booking for another day',
  ],
  unavailable: [
    'Refresh the page to see updated availability',
    'Try selecting a different time slot',
    'Check other available dates',
  ],
  general: [
    'Try selecting a different time slot',
    'Refresh the page and try again',
    'Check your internet connection',
    'Contact support if the problem persists',
  ],
};

const getColorClasses = (color) => ({
  bg: `bg-${color}-100`,
  text: `text-${color}-700`,
  bgLight: `bg-${color}-50`,
  border: `border-${color}-200`,
  darkText: `text-${color}-800`,
});

const ModalHeader = ({ type, icon, title, color }) => {
  const colorClasses = getColorClasses(color);
  const IconComponent = ICON_MAP[type] || AlertCircle;

  return (
    <div className="p-6 pb-4 flex justify-center">
      <div
        className={`w-16 h-16 ${colorClasses.bg} rounded-full flex items-center justify-center`}
      >
        {type === 'success' ? (
          <IconComponent className={`w-8 h-8 ${colorClasses.text}`} />
        ) : (
          <span className="text-2xl">{icon}</span>
        )}
      </div>
    </div>
  );
};

const BookingDetails = ({ details, meetingInfo }) => (
  <div className="bg-green-50 rounded-lg p-4 mb-4 text-left">
    <h4 className="font-semibold text-green-800 mb-2">Meeting Details:</h4>
    <div className="space-y-1 text-sm text-green-700">
      <DetailRow label="Consultant" value={details.consultantName} />
      <DetailRow
        label="Date & Time"
        value={`${details.startTime} - ${details.endTime}`}
      />
      <DetailRow label="Timezone" value={details.timezone} />
      {meetingInfo && (
        <p>
          <span className="font-medium">Meeting ID:</span>
          <span className="font-mono bg-white px-2 py-1 rounded border ml-2">
            {meetingInfo}
          </span>
        </p>
      )}
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <p>
    <span className="font-medium">{label}:</span> {value}
  </p>
);

const ErrorMessage = ({ message, color }) => {
  const colorClasses = getColorClasses(color);

  return (
    <div
      className={`${colorClasses.bgLight} border ${colorClasses.border} rounded-lg p-4 mb-4 text-left`}
    >
      <div className={`text-sm ${colorClasses.text}`}>{message}</div>
    </div>
  );
};

const ErrorSuggestions = ({ errorType }) => (
  <div className="bg-gray-50 rounded-lg p-4 mb-4">
    <h4 className="font-semibold text-gray-800 mb-2">What you can do:</h4>
    <ul className="text-sm text-gray-600 text-left space-y-1">
      {ERROR_SUGGESTIONS[errorType]?.map((suggestion, index) => (
        <li key={index}>• {suggestion}</li>
      ))}
    </ul>
  </div>
);

const ActionButtons = ({
  onClose,
  onNavigateHome,
  handleClose,
  handleNavigateHome,
  isSuccess,
}) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <button
      onClick={handleClose}
      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
        isSuccess
          ? 'border border-gray-300 text-gray-700 hover:bg-gray-100'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isSuccess ? 'Close' : 'Select Different Time'}
    </button>

    {onNavigateHome && (
      <button
        onClick={handleNavigateHome}
        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 ${
          isSuccess
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Home className="w-4 h-4" />
        Go to Home
      </button>
    )}
  </div>
);

const SuccessContent = ({
  bookingDetails,
  meetingInfo,
  message,
  onClose,
  onNavigateHome,
  handleClose,
  handleNavigateHome,
}) => (
  <>
    <ModalHeader type="success" color="green" />
    <div className="px-6 pb-6 text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        🎉 Booking Successful!
      </h3>

      {bookingDetails && (
        <BookingDetails details={bookingDetails} meetingInfo={meetingInfo} />
      )}

      {message && <p className="text-gray-600 text-sm mb-4">{message}</p>}

      <ActionButtons
        onClose={onClose}
        onNavigateHome={onNavigateHome}
        handleClose={handleClose}
        handleNavigateHome={handleNavigateHome}
        isSuccess={true}
      />
    </div>
  </>
);

const ErrorContent = ({
  errorIcon,
  errorColor,
  errorTitle,
  message,
  errorType,
  onClose,
  onNavigateHome,
  handleClose,
  handleNavigateHome,
}) => (
  <>
    <ModalHeader
      type="error"
      icon={errorIcon}
      title={errorTitle}
      color={errorColor}
    />
    <div className="px-6 pb-6 text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{errorTitle}</h3>

      {message && <ErrorMessage message={message} color={errorColor} />}

      <ErrorSuggestions errorType={errorType} />

      <ActionButtons
        onClose={onClose}
        onNavigateHome={onNavigateHome}
        handleClose={handleClose}
        handleNavigateHome={handleNavigateHome}
        isSuccess={false}
      />
    </div>
  </>
);

export const BookingModal = ({
  visible,
  type,
  message,
  bookingDetails,
  meetingString,
  onClose,
  onNavigateHome,
  autoRedirectHome = false,
  redirectDelay = 5000,
}) => {
  const {
    modalRef,
    handleClose,
    handleNavigateHome,
    successInfo,
    bookingDetailsInfo,
    bookingDetailConsultantName: consultantName,
    bookingDetailConsultantStartingTime: startTime,
    bookingDetailConsultantEndingTime: endTime,
    bookingDetailConsultatnTimezone: timezone,
    meetingInfo,
    typeFailed,
    errorColor,
    errorIcon,
    errorTitle,
    errorType,
  } = useBookingModal({
    visible,
    onClose,
    type,
    message,
    autoRedirectHome,
    onNavigateHome,
    redirectDelay,
    bookingDetails,
    meetingString,
  });

  if (!visible) return null;

  const normalizedBookingDetails = bookingDetailsInfo && {
    consultantName,
    startTime,
    endTime,
    timezone,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {successInfo ? (
          <SuccessContent
            bookingDetails={normalizedBookingDetails}
            meetingInfo={meetingInfo}
            message={message}
            onClose={onClose}
            onNavigateHome={onNavigateHome}
            handleClose={handleClose}
            handleNavigateHome={handleNavigateHome}
          />
        ) : typeFailed ? (
          <ErrorContent
            errorIcon={errorIcon}
            errorColor={errorColor}
            errorTitle={errorTitle}
            message={message}
            errorType={errorType}
            onClose={onClose}
            onNavigateHome={onNavigateHome}
            handleClose={handleClose}
            handleNavigateHome={handleNavigateHome}
          />
        ) : null}
      </div>
    </div>
  );
};

export default BookingModal;
