import React from 'react';

interface ErrorModalProps {
  errorMessage: string;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ errorMessage, onClose }) => {
  if (!errorMessage) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h5 className="text-lg font-semibold text-gray-900">Thông báo lỗi</h5>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <p className="text-gray-700">{errorMessage}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Đăng nhập lại!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
