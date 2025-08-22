import React from 'react';
//  Atoms
import { TimeSlot } from '../../atoms/calendar/TimeSlot/jsx';

export const SlotList = ({ slots, selectedSlotId, onSlotSelect }) => {
  return (
    <div className="space-y-2">
      {slots.map(({ slot, consultant }) => (
        <TimeSlot
          key={slot.id}
          slot={slot}
          consultant={consultant}
          isSelected={selectedSlotId === slot.id}
          onSelect={onSlotSelect}
        />
      ))}
    </div>
  );
};
