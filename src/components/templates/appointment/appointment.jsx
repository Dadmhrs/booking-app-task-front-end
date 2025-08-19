'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';

//Organisms
import AppointmentDate from '@/components/organisms/appointment/date/date';
//Mocks
import Consultants from '@/mocks/consultants.js';

const Appointment = () => {
  const params = useParams();
  const consultantId = parseInt(params.id);

  const selectedConsultant = useMemo(() => {
    return Consultants.find((consultant) => consultant.id === consultantId);
  }, [consultantId]);

  return (
    <div>
      <AppointmentDate consultantId={consultantId} />
    </div>
  );
};

export default Appointment;
