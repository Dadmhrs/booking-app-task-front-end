import React, { useState } from 'react';

const ResetButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [popup, setPopup] = useState({ visible: false, type: '', message: '' });

  const handleResetClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmReset = () => {
    setShowConfirm(false);

    try {
      // پاک کردن دیتا
      localStorage.clear();
      sessionStorage.clear();

      // پیام موفقیت
      setPopup({
        visible: true,
        type: 'success',
        message: '✅ دیتا با موفقیت ریست شد!',
      });

      // بعد 1.5 ثانیه رفرش بشه
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      // پیام خطا
      setPopup({
        visible: true,
        type: 'failed',
        message: '❌ ریست ناموفق بود!',
      });

      // بعد 2 ثانیه بسته بشه
      setTimeout(() => setPopup({ visible: false }), 2000);
    }
  };

  const handleCancelReset = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={handleResetClick}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition"
      >
        Reset All Data
      </button>

      {/* Custom Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                Reset All Data?
              </h3>

              <p className="text-gray-600 text-center text-sm mb-6">
                Are you sure you want to reset all data? This action cannot be
                undone and will clear all stored information.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelReset}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Reset Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Popup */}
      {popup.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <div className="p-6 text-center">
              <div className="mb-4">
                {popup.type === 'success' ? (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-gray-900 font-medium">{popup.message}</p>

              {popup.type === 'success' && (
                <p className="text-gray-600 text-sm mt-2">
                  Page will refresh automatically...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetButton;
