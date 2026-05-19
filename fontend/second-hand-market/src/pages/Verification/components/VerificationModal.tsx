import React from 'react';

interface VerificationModalProps {
  codes: string[];
  timeLeft: number;
  isVerifying: boolean;
  error: string;
  inputsRef: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onCodeChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  onVerify: (e: React.MouseEvent) => void;
  onClear: (e: React.MouseEvent) => void;
  onClose: () => void;
  formatTime: (seconds: number) => string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  codes,
  timeLeft,
  isVerifying,
  error,
  inputsRef,
  onCodeChange,
  onKeyDown,
  onVerify,
  onClear,
  onClose,
  formatTime,
}) => {
  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-800 hover:text-red-500 transition-colors duration-300 text-2xl"
          aria-label="Close"
        >
          <i className="bi bi-x-octagon" />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Xác minh email
          </h2>
          <p className="text-gray-600 mb-4">
            Nhập mã code được gửi đến email của bạn để kích hoạt tài khoản
          </p>
          <p className={`font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>
            Thời gian còn lại: {formatTime(timeLeft)}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center animate-fade-in">
            <i className="fa fa-exclamation-circle mr-2" />
            {error}
          </div>
        )}

        {/* Input Fields */}
        <div className="flex justify-center gap-3 mb-8">
          {codes.map((code, index) => (
            <input
              key={index}
              type="tel"
              maxLength={1}
              value={code}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => onCodeChange(e, index)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className="w-16 h-16 text-center text-2xl font-semibold text-gray-800 border-2 border-gray-300 rounded-lg bg-gray-100 focus:border-gray-800 focus:bg-white focus:outline-none focus:shadow-lg focus:scale-105 transition-all duration-300"
              disabled={timeLeft === 0 || isVerifying}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onVerify}
            disabled={timeLeft === 0 || isVerifying || codes.some(c => !c)}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xác minh...
              </span>
            ) : (
              'Xác minh'
            )}
          </button>
          
          <button
            onClick={onClear}
            disabled={isVerifying}
            className="flex-1 px-6 py-3 bg-transparent text-gray-800 border-2 border-gray-800 rounded-lg font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xóa
          </button>
        </div>

        {/* Expired Message */}
        {timeLeft === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-center text-sm">
            Mã xác minh đã hết hạn. Vui lòng đăng ký lại.
          </div>
        )}
      </div>
    </div>
  );
};
