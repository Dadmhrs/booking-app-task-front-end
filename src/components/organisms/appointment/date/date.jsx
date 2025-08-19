import React from 'react';
import { CalendarLayout } from '@/components/templates/appointment/calendar/calendar';
import Consultants from '@/mocks/consultants';

const AppointmentDate = ({ consultantId }) => {
  const selectedConsultant = Consultants.find((c) => c.id === consultantId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Select Date & Time
        </h3>
        <CalendarLayout
          consultantId={selectedConsultant}
          consultants={consultantId}
        />
      </div>
    </div>
  );
};

export default AppointmentDate;
