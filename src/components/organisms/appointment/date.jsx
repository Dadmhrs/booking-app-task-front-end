import React from 'react';
import ConsultantCalendar from '@/components/molecules/home/appointment/calendar/calendar';
import Consultants from '@/mocks/consultants';

const AppointmentDate = ({ consultantId }) => {
  const selectedConsultant = Consultants.find((c) => c.id === consultantId);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Book Appointment
        </h1>

        {selectedConsultant ? (
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={selectedConsultant.image}
              alt={selectedConsultant.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedConsultant.name}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {selectedConsultant.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mb-6">
            Consultant not found
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Select Date & Time
        </h3>
        <ConsultantCalendar
          selectedConsultantId={consultantId} // Pass the consultant ID here
          consultants={Consultants}
        />
      </div>
    </div>
  );
};

export default AppointmentDate;
