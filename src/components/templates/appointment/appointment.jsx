'use client';
// Next
import { useParams } from 'next/navigation';
// Organisms
import { CalendarLayout } from './calendar/calendar.jsx';
// Redux
import { useAppSelector } from '@/hooks/redux/useRedux.js';

const Appointment = () => {
  const params = useParams();
  const consultantId = parseInt(params.id);

  const consultants = useAppSelector((state) => state.consultants.consultants);
  const error = useAppSelector((state) => state.consultants.error);

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
