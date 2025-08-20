'use client';

import { useParams } from 'next/navigation';

// Organisms
import AppointmentDate from '@/components/organisms/appointment/date/date';

const Appointment = () => {
  const params = useParams();
  const consultantId = parseInt(params.id);

  return (
    <div>
      <AppointmentDate consultantId={consultantId} />
    </div>
  );
};

export default Appointment;
