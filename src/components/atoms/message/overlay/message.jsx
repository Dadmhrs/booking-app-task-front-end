'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MessageOverlay = ({
  isVisible,
  type = 'success',
  title,
  subtitle,
  redirectMessage,
  redirectTo = '/',
  shouldRedirect = true,
  onClose,
  autoCloseDelay = 3000,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (isVisible && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        // اول state رو پاک کن
        if (onClose) onClose();

        // بعد redirect کن
        if (shouldRedirect) {
          setTimeout(() => {
            router.push(redirectTo);
          }, 100); // یکم تاخیر برای پاک شدن state
        }
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay, onClose, router, redirectTo, shouldRedirect]);

  if (!isVisible) return null;

  const isSuccess = type === 'success';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
  const iconBgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
  const iconPath = isSuccess ? (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  ) : (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 max-w-md mx-4">
        <div
          className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center`}
        >
          <svg
            className={`w-8 h-8 ${iconColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {iconPath}
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {title || (isSuccess ? 'Booking Successful!' : 'Booking Failed!')}
          </h3>
          {subtitle && <p className="text-gray-600 text-sm mb-2">{subtitle}</p>}
          {redirectMessage && (
            <p className="text-xs text-blue-600 mt-2">{redirectMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageOverlay;
