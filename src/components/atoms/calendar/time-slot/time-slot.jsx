import React from 'react';
import { Clock } from 'lucide-react';

export const TimeSlot = ({
  slot,
  consultant,
  isSelected = false,
  onSelect,
  isMobile = false,
}) => {
  const isClickable = slot.status === 'available';

  const getSlotColor = () => {
    if (isSelected) return 'bg-blue-600 text-white border-blue-600';
    if (slot.status === 'available')
      return 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100';
    if (slot.status === 'reserved')
      return 'bg-red-50 text-red-800 border-red-200 cursor-not-allowed';
    if (slot.status === 'pending')
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const handleClick = () => {
    if (isClickable) {
      onSelect(slot, consultant);
    }
  };

  if (isMobile) {
    return (
      <div
        onClick={handleClick}
        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${getSlotColor()} ${
          !isClickable ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium">
              {slot.startTime} - {slot.endTime}
            </span>
          </div>
          <span className="font-bold text-lg">${slot.price}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={consultant.image}
              alt={consultant.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium">{consultant.name}</span>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              slot.status === 'available'
                ? 'bg-green-100 text-green-700'
                : slot.status === 'reserved'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {slot.status === 'reserved' ? 'Reserved' : slot.status}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`text-xs p-2 rounded-md cursor-pointer transition-all duration-200 border ${getSlotColor()} ${
        !isClickable ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <img
          src={consultant.image}
          alt={consultant.name}
          className="w-4 h-4 rounded-full"
        />
        <span className="font-medium truncate">{consultant.name}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{slot.startTime}</span>
        </div>
        <span className="font-semibold">${slot.price}</span>
      </div>
      {slot.status === 'reserved' && (
        <div className="text-xs text-red-600 mt-1 truncate">Reserved</div>
      )}
    </div>
  );
};
