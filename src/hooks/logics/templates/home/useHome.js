import { useEffect, useRef, useState } from 'react';
// Data
import consultantsData from '@/data/models/consultars.json';

const useHome = () => {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [titleVisible, setTitleVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState('');

  const cardRefs = useRef([]);
  const observerRef = useRef(null);

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

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardIndex = parseInt(entry.target.dataset.index);

          if (isNaN(cardIndex)) return;

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

    observerRef.current = observer;

    const observeTimer = setTimeout(() => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(observeTimer);
      observer.disconnect();
    };
  }, [filteredConsultants]);

  useEffect(() => {
    setVisibleCards(new Set());
  }, [selectedDay, selectedTimeZone]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleDayFilterChange = (day) => {
    setSelectedDay(day || '');
  };

  const handleTimeZoneFilterChange = (timeZone) => {
    setSelectedTimeZone(timeZone || '');
  };

  return {
    visibleCards,
    titleVisible,
    selectedDay,
    cardRefs,
    filteredConsultants,
    handleDayFilterChange,
    handleTimeZoneFilterChange,
  };
};

export default useHome;
