import React, { useEffect, useState, useRef } from 'react';
import { useClickOutside } from '@/hooks/custom/useClickOutside';

export const BookingModal = ({
  visible,
  type,
  message,
  bookingDetails,
  meetingString,
  onClose,
  onNavigateHome,
  autoRedirectHome = false,
  redirectDelay = 3000,
}) => {
  const [countdown, setCountdown] = useState(Math.floor(redirectDelay / 1000));
  const modalRef = useRef(null);

  useClickOutside(modalRef, () => {
    if (visible && onClose) onClose();
  });

  useEffect(() => {
    if (visible && type === 'success' && autoRedirectHome && onNavigateHome) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleNavigateHome();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [visible, type, autoRedirectHome, onNavigateHome, redirectDelay]);

  // ریست کردن شمارش معکوس وقتی مدال باز می‌شود
  useEffect(() => {
    if (visible) {
      setCountdown(Math.floor(redirectDelay / 1000));
    }
  }, [visible, redirectDelay]);

  const handleNavigateHome = () => {
    if (onClose) onClose();

    setTimeout(() => {
      if (onNavigateHome && typeof onNavigateHome === 'function') {
        onNavigateHome();
      } else {
        if (window.history && window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/';
        }
      }
    }, 300);
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const getErrorInfo = (errorMessage) => {
    if (!errorMessage) return { type: 'general', icon: '❌', color: 'red' };

    if (
      errorMessage.includes('too short') &&
      errorMessage.includes('minutes')
    ) {
      return {
        type: 'duration_short',
        icon: '⏱️',
        color: 'orange',
        title: 'Meeting Too Short',
      };
    }

    if (errorMessage.includes('too long') && errorMessage.includes('minutes')) {
      return {
        type: 'duration_long',
        icon: '⏱️',
        color: 'orange',
        title: 'Meeting Too Long',
      };
    }

    if (
      errorMessage.includes('Time Conflict') ||
      errorMessage.includes('Time conflict')
    ) {
      return {
        type: 'conflict',
        icon: '⚠️',
        color: 'yellow',
        title: 'Time Conflict',
      };
    }

    if (
      errorMessage.includes('not available') ||
      errorMessage.includes('already been booked')
    ) {
      return {
        type: 'unavailable',
        icon: '📅',
        color: 'red',
        title: 'Slot Unavailable',
      };
    }

    return {
      type: 'general',
      icon: '❌',
      color: 'red',
      title: 'Booking Error',
    };
  };

  if (!visible) return null;

  const errorInfo = type === 'failed' ? getErrorInfo(message) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {type === 'success' && (
          <>
            <div className="p-6 pb-4 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="px-6 pb-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                🎉 Booking Successful!
              </h3>

              {bookingDetails && (
                <div className="bg-green-50 rounded-lg p-4 mb-4 text-left">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Meeting Details:
                  </h4>
                  <div className="space-y-1 text-sm text-green-700">
                    <p>
                      <span className="font-medium">Consultant:</span>{' '}
                      {bookingDetails.consultantName}
                    </p>
                    <p>
                      <span className="font-medium">Date & Time:</span>{' '}
                      {bookingDetails.meetingStartLocal} -{' '}
                      {bookingDetails.meetingEndLocal}
                    </p>
                    <p>
                      <span className="font-medium">Timezone:</span>{' '}
                      {bookingDetails.timezone}
                    </p>
                    {meetingString && (
                      <p>
                        <span className="font-medium">Meeting ID:</span>{' '}
                        <span className="font-mono bg-white px-2 py-1 rounded border">
                          {meetingString}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {message && (
                <p className="text-gray-600 text-sm mb-4">{message}</p>
              )}

              {autoRedirectHome && onNavigateHome && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-blue-700 text-sm">
                    🏠 Redirecting to home in {countdown} seconds...
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
                >
                  Close
                </button>
                {onNavigateHome && (
                  <button
                    onClick={handleNavigateHome}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Go to Home
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Failed Modal */}
        {type === 'failed' && (
          <>
            <div className="p-6 pb-4 flex justify-center">
              <div
                className={`w-16 h-16 ${
                  errorInfo?.color === 'orange'
                    ? 'bg-orange-100'
                    : errorInfo?.color === 'yellow'
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
                } rounded-full flex items-center justify-center`}
              >
                <span className="text-2xl">{errorInfo?.icon || '❌'}</span>
              </div>
            </div>

            <div className="px-6 pb-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {errorInfo?.title || 'Booking Failed'}
              </h3>

              {message && (
                <div
                  className={`${
                    errorInfo?.color === 'orange'
                      ? 'bg-orange-50 border-orange-200'
                      : errorInfo?.color === 'yellow'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200'
                  } border rounded-lg p-4 mb-4 text-left`}
                >
                  <div
                    className={`text-sm ${
                      errorInfo?.color === 'orange'
                        ? 'text-orange-700'
                        : errorInfo?.color === 'yellow'
                        ? 'text-yellow-700'
                        : 'text-red-700'
                    }`}
                  >
                    {message}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  What you can do:
                </h4>
                <ul className="text-sm text-gray-600 text-left space-y-1">
                  {errorInfo?.type === 'duration_short' && (
                    <>
                      <li>• Select a longer time slot (at least 30 minutes)</li>
                      <li>• Look for extended appointment options</li>
                      <li>• Contact the consultant for custom duration</li>
                    </>
                  )}
                  {errorInfo?.type === 'duration_long' && (
                    <>
                      <li>• Select a shorter time slot (maximum 2 hours)</li>
                      <li>• Break your session into multiple appointments</li>
                      <li>• Contact the consultant for extended sessions</li>
                    </>
                  )}
                  {errorInfo?.type === 'conflict' && (
                    <>
                      <li>• Choose a different time that doesn't conflict</li>
                      <li>• Check your existing appointments</li>
                      <li>• Try booking for another day</li>
                    </>
                  )}
                  {errorInfo?.type === 'unavailable' && (
                    <>
                      <li>• Refresh the page to see updated availability</li>
                      <li>• Try selecting a different time slot</li>
                      <li>• Check other available dates</li>
                    </>
                  )}
                  {errorInfo?.type === 'general' && (
                    <>
                      <li>• Try selecting a different time slot</li>
                      <li>• Refresh the page and try again</li>
                      <li>• Check your internet connection</li>
                      <li>• Contact support if the problem persists</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  Select Different Time
                </button>
                {onNavigateHome && (
                  <button
                    onClick={handleNavigateHome}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Go to Home
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
