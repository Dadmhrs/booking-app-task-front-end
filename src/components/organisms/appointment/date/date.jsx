import React from 'react';
// Templates
import { CalendarLayout } from '@/components/templates/appointment/calendar/calendar.jsx';
// Mocks
import Consultants from '@/mocks/consultants.js';

const AppointmentDate = ({ consultantId }) => {
  const selectedConsultant = Consultants.find((c) => c.id === consultantId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <CalendarLayout
        consultantId={selectedConsultant}
        consultants={consultantId}
      />
    </div>
  );
};

export default AppointmentDate;
