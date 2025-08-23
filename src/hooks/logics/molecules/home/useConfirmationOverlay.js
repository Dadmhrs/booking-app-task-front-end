import { useEffect, useState } from 'react';

const useConfirmationOverlay = ({ isOpen, onClose, closeOnBackdropClick }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return { isOpen, mounted, handleBackdropClick, handleContentClick };
};

export default useConfirmationOverlay;
