'use client';

import { useEffect, useRef, useState } from 'react';
// Atoms
import ResetButton from '@/components/atoms/button/reset-button.jsx';
// Molecules
import ConsultantCard from '@/components/molecules/home/consultars/consultars.jsx';
// Organisms
import HomePageFilter from '@/components/organisms/home/filter/filter.jsx';
// Hooks
import consultantsData from '@/data/models/consultars.json';

const Home = () => {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [titleVisible, setTitleVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState('');
  const cardRefs = useRef([]);

  const consultants = consultantsData.consultants || [];

  const filteredConsultants = consultants.filter((consultant) => {
    let dayMatch = true;
    if (selectedDay) {
      dayMatch =
        consultant.meetings &&
        consultant.meetings.some(
          (meeting) =>
            meeting.day === selectedDay && meeting.status === 'available',
        );
    }
    let timeZoneMatch = true;
    if (selectedTimeZone) {
      timeZoneMatch = consultant.timeZone === selectedTimeZone;
    }

    return dayMatch && timeZoneMatch;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleVisible(true);
    }, 200);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardIndex = parseInt(entry.target.dataset.index);

          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev.add(cardIndex)));
          } else {
            setVisibleCards((prev) => {
              const newSet = new Set(prev);
              newSet.delete(cardIndex);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px',
      },
    );
    if (cardRefs.current.length > 0) {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [filteredConsultants.length]);

  useEffect(() => {
    setVisibleCards(new Set());
  }, [selectedDay, selectedTimeZone]);

  const handleDayFilterChange = (day) => {
    setSelectedDay(day || '');
  };

  const handleTimeZoneFilterChange = (timeZone) => {
    setSelectedTimeZone(timeZone || '');
  };

  useEffect(() => {
    setVisibleCards(new Set());
  }, [selectedDay]);

  return (
    <div className="flex flex-col pt-16 px-4">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        <div
          className={`w-full lg:w-1/4 lg:min-w-[300px] transition-all duration-700 ease-out lg:mt-29
 ${titleVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
        >
          <HomePageFilter
            onDayChange={handleDayFilterChange}
            onTimeZoneChange={handleTimeZoneFilterChange}
          />

          <div className="mt-6 flex justify-center lg:justify-start">
            <ResetButton />
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          <div className="flex justify-center mb-12">
            <div
              className={`text-center transition-all duration-700 ease-out ${
                titleVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <h1 className="font-Sora text-2xl md:text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed mb-4 select-none cursor-default">
                Choose your advisor and select the date
                {selectedDay && (
                  <span className="block text-lg text-blue-600 mt-2">
                    Showing consultants available on {selectedDay}
                  </span>
                )}
              </h1>
              <div
                className={`w-full h-1 bg-black mt-8 transition-all duration-700 ease-out ${
                  titleVisible
                    ? 'scale-x-100 opacity-100'
                    : 'scale-x-0 opacity-0'
                }`}
              ></div>
            </div>
          </div>

          {filteredConsultants.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {selectedDay
                  ? `No consultants available on ${selectedDay}`
                  : 'No consultants found'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center md:justify-items-stretch pb-14">
              {filteredConsultants.map((consultant, index) => (
                <div
                  key={`${consultant.id}-${selectedDay}`}
                  ref={(el) => (cardRefs.current[index] = el)}
                  data-index={index}
                  className={`transform transition-all duration-700 ease-out relative ${
                    visibleCards.has(index)
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{
                    transitionDelay: `${(index % 2) * 150}ms`,
                  }}
                >
                  <div
                    className={`inline-block transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] rounded-lg ${
                      visibleCards.has(index)
                        ? 'animate-[cardBounce_0.6s_ease-out]'
                        : ''
                    }`}
                  >
                    <ConsultantCard
                      image={consultant.image}
                      name={consultant.name}
                      description={consultant.description}
                      consultantId={consultant.id}
                      selectedDay={selectedDay}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .text-center {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
        }

        @keyframes expandLine {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes cardBounce {
          0% {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          60% {
            transform: translateY(-5px) scale(1.02);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
