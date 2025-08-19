import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
//Utils
import { dateUtils } from '@/utils/dateUtils';

export const BookingConfirmation = ({
  selectedSlot,
  selectedConsultant,
  onConfirm,
  onCancel,
}) => {
  if (!selectedSlot || !selectedConsultant) return null;

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
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-medium">
                {dateUtils.formatDate(
                  `${selectedSlot.date}T${selectedSlot.start}`,
                  { weekday: 'long', month: 'long', day: 'numeric' },
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium">
                {dateUtils.formatTime(selectedSlot.start)} -{' '}
                {dateUtils.formatTime(selectedSlot.end)}
              </span>
              <span className="text-xs text-gray-500">
                ({selectedConsultant.timeZone})
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Online Meeting</span>
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
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
            <button
              onClick={onConfirm}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              Book Session
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm sm:text-base border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
