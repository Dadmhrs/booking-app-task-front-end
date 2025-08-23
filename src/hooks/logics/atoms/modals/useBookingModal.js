import { useEffect, useState, useRef, useCallback } from 'react';

// Hooks
import { useClickOutside } from '@/hooks/custom/useClickOutside.js';

const useBookingModal = ({
  visible,
  onClose,
  type,
  message,
  autoRedirectHome = false,
  onNavigateHome,
  redirectDelay = 5000,
  bookingDetails,
  meetingString,
}) => {
  const [countdown, setCountdown] = useState(Math.floor(redirectDelay / 1000));
  const modalRef = useRef(null);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  const handleNavigateHome = useCallback(() => {
    if (onClose) onClose();

    setTimeout(() => {
      if (onNavigateHome && typeof onNavigateHome === 'function') {
        onNavigateHome();
      } else {
        if (window?.history && window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/';
        }
      }
    }, 300);
  }, [onClose, onNavigateHome]);

  useClickOutside(modalRef, () => {
    if (visible && onClose) onClose();
  });

  useEffect(() => {
    if (visible) {
      setCountdown(Math.floor(redirectDelay / 1000));
    }
  }, [visible, redirectDelay]);

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
  }, [visible, type, autoRedirectHome, onNavigateHome, handleNavigateHome]);

  const getErrorInfo = useCallback((errorMessage) => {
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
  }, []);

  const errorInfo = type === 'failed' ? getErrorInfo(message) : null;
  const successInfo = type === 'success';
  const bookingDetailsInfo = bookingDetails;
  const bookingDetailConsultantName = bookingDetails?.consultantName;
  const bookingDetailConsultantStartingTime = bookingDetails?.meetingStartLocal;
  const bookingDetailConsultantEndingTime = bookingDetails?.meetingEndLocal;
  const bookingDetailConsultatnTimezone = bookingDetails?.timezone;
  const meetingInfo = meetingString;
  const typeFailed = type === 'failed';
  const errorColor = errorInfo?.color;
  const errorIcon = errorInfo?.icon || '❌';
  const errorTitle = errorInfo?.title || 'Booking Failed';
  const errorType = errorInfo?.type;

  return {
    countdown,
    modalRef,
    handleClose,
    handleNavigateHome,
    errorInfo,
    successInfo,
    bookingDetailsInfo,
    bookingDetailConsultantName,
    bookingDetailConsultantStartingTime,
    bookingDetailConsultantEndingTime,
    meetingInfo,
    bookingDetailConsultatnTimezone,
    typeFailed,
    errorColor,
    errorIcon,
    errorTitle,
    errorType,
  };
};

export default useBookingModal;
