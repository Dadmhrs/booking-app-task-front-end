import React from 'react';
import { createPortal } from 'react-dom';
// Hooks
import useConfirmationOverlay from '@/hooks/logics/molecules/home/useConfirmationOverlay.js';

const ConfirmationOverlay = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-md',
  closeOnBackdropClick = true,
}) => {
  const {
    isOpen: open,
    mounted,
    handleBackdropClick,
    handleContentClick,
  } = useConfirmationOverlay({ isOpen, onClose, closeOnBackdropClick });

  if (!open || !mounted) return null;

  const overlayContent = (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999999,
        margin: 0,
        padding: '1rem',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl ${maxWidth} w-full mx-4 max-h-[90vh] overflow-y-auto`}
        onClick={handleContentClick}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
};

export default ConfirmationOverlay;
