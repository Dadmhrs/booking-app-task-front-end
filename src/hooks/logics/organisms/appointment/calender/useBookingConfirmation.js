import { useState, useEffect } from 'react';

// Utils
import {
  formatDuration,
  convertToUserTimezone,
  validateMeetingDuration,
  getTimezoneAbbreviation,
} from '@/utils/timeUtils.js';

const useBookingConfirmations = ({
  isBooking,
  onConfirm,
  selectedSlot,
  selectedConsultant,
}) => {
  const [clientName, setClientName] = useState('');
  const [timeDisplays, setTimeDisplays] = useState(null);
  const [durationInfo, setDurationInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const convertToTimezone = (utcTimeString, targetTimezone) => {
    try {
      const utcDate = new Date(utcTimeString);

      if (isNaN(utcDate.getTime())) {
        console.error('Invalid date string:', utcTimeString);
        return null;
      }

      return {
        timeOnly: utcDate.toLocaleTimeString('en-GB', {
          timeZone: targetTimezone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }),
        dateOnly: utcDate.toLocaleDateString('en-US', {
          timeZone: targetTimezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        timezone: targetTimezone,
      };
    } catch (error) {
      console.error('Error converting timezone:', error);
      return null;
    }
  };

  useEffect(() => {
    if (selectedSlot && selectedSlot.start && selectedSlot.end) {
      const startTimeClient = convertToUserTimezone(selectedSlot.start, true);
      const endTimeClient = convertToUserTimezone(selectedSlot.end, true);

      const consultantTimezone = selectedConsultant?.timezone || 'UTC';
      const startTimeConsultant = convertToTimezone(
        selectedSlot.start,
        consultantTimezone,
      );
      const endTimeConsultant = convertToTimezone(
        selectedSlot.end,
        consultantTimezone,
      );

      const validation = validateMeetingDuration(
        selectedSlot.start,
        selectedSlot.end,
      );

      setTimeDisplays({
        start: startTimeConsultant,
        end: endTimeConsultant,
        startClient: startTimeClient,
        endClient: endTimeClient,
        timezone: consultantTimezone,
        timezoneClient: startTimeClient?.timezone,
      });

      setDurationInfo(validation);
    }
  }, [selectedSlot, selectedConsultant]);

  const handleConfirm = async () => {
    if (clientName && clientName.trim()) {
      setIsProcessing(true);
      await onConfirm(clientName.trim());
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && clientName && clientName.trim()) {
      handleConfirm();
    }
  };

  const isFormValid = clientName && clientName.trim();

  if (isProcessing) {
    return null;
  }

  const consultantImage = selectedConsultant?.image;
  const consultantName = selectedConsultant?.name;
  const consultantDescription = selectedConsultant?.description;
  const meetingDateDisplay = timeDisplays?.startClient?.dateOnly;
  const clientTimezoneStartingTime = timeDisplays?.startClient?.timeOnly;
  const clientTimezoneEndingTime = timeDisplays?.endClient?.timeOnly;
  const consultarTimezoneStartingTime = timeDisplays?.start?.timeOnly;
  const consultarTimezoneEndingTime = timeDisplays?.end?.timeOnly;
  const clientTimezone = getTimezoneAbbreviation(timeDisplays?.timezoneClient);
  const consultarTimezone = getTimezoneAbbreviation(timeDisplays?.timezone);
  const durationSettings = durationInfo
    ? durationInfo.formattedDuration ||
      formatDuration(durationInfo.duration || 0)
    : formatDuration(0);
  const priceSettings = selectedSlot?.price || 150;
  const notValidForm = !isFormValid && clientName !== '';
  const notValidFormAndBooking = !isFormValid || isBooking;
  const validFormNotBooking = isFormValid && !isBooking;

  return {
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
  };
};

export default useBookingConfirmations;
