import { useState } from 'react';

const useResetButton = () => {
  const [popup, setPopup] = useState({ visible: false, type: '', message: '' });

  const handleResetClick = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();

      setPopup({
        visible: true,
        type: 'success',
        message: '✅ Data reset successfully',
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setPopup({
        visible: true,
        type: 'failed',
        message: '❌ Data reset failed',
      });

      setTimeout(() => setPopup({ visible: false }), 2000);
    }
  };

  return {
    popup,
    handleResetClick,
  };
};

export default useResetButton;
