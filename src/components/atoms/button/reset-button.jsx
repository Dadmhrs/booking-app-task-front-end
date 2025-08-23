// Hooks
import useResetButton from '@/hooks/logics/atoms/button/reset-button/useResetButton.js';

const ResetButton = () => {
  const { popup, handleResetClick } = useResetButton();

  return (
    <>
      <button
        onClick={handleResetClick}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition"
      >
        Reset All Data
      </button>

      {popup.visible && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
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
