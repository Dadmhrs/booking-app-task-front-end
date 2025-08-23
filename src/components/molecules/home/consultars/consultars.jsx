import React from 'react';
// Routing
import Link from 'next/link';
import routes from '@/configs/routes';

const ConsultantCard = ({
  image,
  alt = 'Consultant',
  name,
  description,
  consultantId,
  onReserve,
}) => {
  return (
    <div className="w-full flex justify-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <img
            src={image}
            alt={alt}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>

        <div className="flex justify-center">
          <Link
            onClick={onReserve}
            href={`${routes.appointment.single}/${consultantId}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
          >
            Reserve Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;
