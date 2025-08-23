import { useState, useEffect } from 'react';
// Hooks
import useWindowSize from '@/hooks/custom/useWindowsSize.js';

const useHeader = () => {
  const { width } = useWindowSize();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isDesktop = width > 767;

  return { width, isClient, isDesktop };
};
export default useHeader;
