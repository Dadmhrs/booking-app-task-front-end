import React from 'react';
import { Calendar, Clock, MapPin, Globe } from 'lucide-react';

export const BookingConfirmation = ({
  selectedSlot,
  selectedConsultant,
  onConfirm,
  onCancel,
}) => {
  if (!selectedSlot || !selectedConsultant) return null;

  const isDifferentTimezone =
    selectedSlot.clientTimezone !== selectedSlot.consultantTimezone;

  const bookingDate = new Date(selectedSlot.start).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        Confirm Your Booking
      </h3>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="flex items-start gap-4 flex-1">
          <img
            src={selectedConsultant.image}
            alt={selectedConsultant.name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-100"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
              {selectedConsultant.name}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
              {selectedConsultant.description}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 flex-1">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{bookingDate}</span>
            </div>
            <div className="flex items-start gap-2 text-gray-700 text-sm">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">
                    {selectedSlot.clientStartTime} -{' '}
                    {selectedSlot.clientEndTime}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Your Time
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {selectedSlot.clientTimezone}
                </div>
                {isDifferentTimezone && (
                  <div className="mt-2 p-2 bg-white border border-gray-200 rounded text-xs">
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <Globe className="w-3 h-3" />
                      <span className="font-medium">Consultant's Time:</span>
                    </div>
                    <div className="font-medium text-gray-800">
                      {selectedSlot.consultantStartTime} -{' '}
                      {selectedSlot.consultantEndTime}
                    </div>
                    <div className="text-gray-500 mt-0.5">
                      {selectedSlot.consultantTimezone}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Online Meeting</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                Duration:{' '}
                <span className="font-medium">{selectedSlot.duration}</span>
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 text-sm">
                  Session Fee:
                </span>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  ${selectedSlot.price}
                </span>
              </div>
            </div>
            {isDifferentTimezone && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-800">
                    <div className="font-medium mb-1">Time Zone Reminder</div>
                    <div>
                      Please note the time difference between your timezone and
                      the consultant's timezone. Make sure you join the meeting
                      at your local time shown above.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
            <button
              onClick={onConfirm}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              Confirm Booking
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm sm:text-base border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
