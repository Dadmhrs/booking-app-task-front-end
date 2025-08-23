'use client';

import ResetButton from '@/components/atoms/button/reset-button.jsx';
import ConsultantCard from '@/components/molecules/home/consultars/consultars.jsx';
import HomePageFilter from '@/components/organisms/home/filter/filter.jsx';
import useHome from '@/hooks/logics/templates/home/useHome.js';

const Home = () => {
  const {
    visibleCards,
    titleVisible,
    selectedDay,
    cardRefs,
    filteredConsultants,
    handleDayFilterChange,
    handleTimeZoneFilterChange,
  } = useHome();

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
          <div className="flex justify-center mt-12 mb-8 relative z-[9999]">
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

          <div className="min-h-[400px] relative">
            {filteredConsultants.length === 0 ? (
              <div className="text-center py-12 absolute inset-0 flex items-center justify-center animate-fadeIn">
                <div className="text-gray-500 text-lg">
                  {selectedDay
                    ? `No consultants available on ${selectedDay}`
                    : 'No consultants found'}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center pb-14">
                {filteredConsultants.map((consultant, index) => (
                  <div
                    key={consultant.id}
                    ref={(el) => (cardRefs.current[index] = el)}
                    data-index={index}
                    className={`transform transition-all duration-700 ease-out ${
                      visibleCards.has(index)
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                    style={{
                      transitionDelay: visibleCards.has(index)
                        ? `${index * 200}ms`
                        : '0ms',
                    }}
                  >
                    <div className="inline-block transform transition-all duration-400 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] rounded-lg">
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
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .text-center,
          * {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
            transition: none !important;
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
      `}</style>
    </div>
  );
};

export default Home;
