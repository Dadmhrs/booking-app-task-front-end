// Next
import { useParams } from 'next/navigation';

// Redux
import { useAppSelector } from '@/hooks/redux/useRedux.js';

const useAppointmentPage = () => {
  const params = useParams();
  const consultantId = parseInt(params.id);

  const consultants = useAppSelector((state) => state.consultants.consultants);
  const error = useAppSelector((state) => state.consultants.error);

  return { consultantId, consultants, error };
};
export default useAppointmentPage;
