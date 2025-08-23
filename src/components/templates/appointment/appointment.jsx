'use client';
// Organisms
import { CalendarLayout } from './calendar/calendar.jsx';
// Hooks
import useAppointmentPage from '@/hooks/logics/templates/appointment/useAppointmentPage.js';

const Appointment = () => {
  const { consultantId, consultants, error } = useAppointmentPage();

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CalendarLayout consultantId={consultantId} consultants={consultants} />
    </div>
  );
};

export default Appointment;
