'use client';
import React, { useState, useEffect } from 'react';
//Hooks
import useWindowSize from '@/hooks/useWindowsSize.js';

const Header = () => {
  const { width } = useWindowSize();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <header className="bg-blue-500 text-white shadow-md">
        <div className="flex items-center justify-center p-24 md:p-32">
          <div className="relative md:group md:cursor-pointer">
            <h1 className="text-white font-bold text-4xl md:text-6xl md:transition-all md:duration-500 md:ease-in-out md:group-hover:-translate-x-16">
              Welcome
            </h1>
            <span className="hidden md:block absolute top-1/2 -translate-y-1/2 left-52 text-white text-lg opacity-0 mt-2 transition-all duration-500 ease-in-out group-hover:opacity-100 whitespace-nowrap pointer-events-none">
              to this sample Mr.Shahabi
            </span>
          </div>
        </div>
      </header>
    );
  }

  const isDesktop = width > 767;

  return (
    <header className="bg-blue-500 text-white shadow-md">
      <div
        className={`flex items-center justify-center ${
          isDesktop ? 'p-32' : 'p-24'
        }`}
      >
        <div className={`relative ${isDesktop ? 'group cursor-pointer' : ''}`}>
          <h1
            className={`text-white font-bold transition-all duration-500 ease-in-out ${
              isDesktop ? 'text-6xl group-hover:-translate-x-16' : 'text-4xl'
            }`}
          >
            Welcome
          </h1>

          {isDesktop && (
            <span className="absolute top-1/2 -translate-y-1/2 left-52 text-white text-lg opacity-0 mt-2 transition-all duration-500 ease-in-out group-hover:opacity-100 whitespace-nowrap pointer-events-none">
              to this sample Mr.Shahabi
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
