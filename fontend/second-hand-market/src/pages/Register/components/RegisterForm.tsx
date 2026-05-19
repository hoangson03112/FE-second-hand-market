import React from 'react';
import { ErrorAlert } from './ErrorAlert';

interface RegisterFormProps {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    fullName: string;
  };
  formErrors: {
    passwordError: string;
    confirmPasswordError: string;
    phoneError: string;
  };
  isSubmitted: boolean;
  errorMessage: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: (field: 'password' | 'confirmPassword') => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  formErrors,
  isSubmitted,
  errorMessage,
  showPassword,
  showConfirmPassword,
  isLoading,
  onInputChange,
  onSubmit,
  onTogglePassword,
}) => {
  const inputFields = [
    { id: 'username', label: 'Tên đăng nhập', type: 'text' },
    { id: 'fullName', label: 'Họ và Tên', type: 'text' },
    { id: 'phoneNumber', label: 'Số điện thoại', type: 'text' },
    { id: 'email', label: 'Email', type: 'email' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={onSubmit}>
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <img
            src="/images/logi.png"
            className="w-48 mx-auto"
            alt="logo"
          />
          <h4 className="mt-2 mb-6 text-xl font-semibold text-gray-800">
            Chào mừng bạn đến với eco-market
          </h4>
        </div>

        {/* Error Alert */}
        <ErrorAlert message={errorMessage} />

        <p className="text-center text-gray-600 mb-6">
          Vui lòng điền thông tin để tạo tài khoản
        </p>

        {/* Input Fields */}
        {inputFields.map((field) => (
          <div key={field.id} className="relative mb-8">
            <label htmlFor={field.id} className="block ml-12 mb-2 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.id}
              value={formData[field.id as keyof typeof formData]}
              onChange={onInputChange}
              className={`w-3/4 mx-auto block px-4 py-2 rounded-full border-2 ${
                formErrors.phoneError && field.id === 'phoneNumber'
                  ? 'border-red-500'
                  : 'border-gray-300'
              } focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all`}
              placeholder={`Nhập ${field.label.toLowerCase()}`}
              required
            />
            {formErrors.phoneError && field.id === 'phoneNumber' && (
              <div className="absolute left-0 right-0 text-center mt-2 text-red-500 text-sm">
                {formErrors.phoneError}
              </div>
            )}
          </div>
        ))}

        {/* Password Fields */}
        {['password', 'confirmPassword'].map((field) => (
          <div key={field} className="relative mb-8">
            <label htmlFor={field} className="block ml-12 mb-2 text-sm font-medium text-gray-700">
              {field === 'password' ? 'Mật khẩu' : 'Xác nhận mật khẩu'}
            </label>
            <div className="flex justify-center">
              <div className="relative w-3/4">
                <input
                  type={
                    field === 'password' && showPassword
                      ? 'text'
                      : field === 'confirmPassword' && showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  id={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={onInputChange}
                  className={`w-full px-4 py-2 pr-12 rounded-full border-2 ${
                    formErrors[`${field}Error` as keyof typeof formErrors]
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all`}
                  placeholder={`Nhập ${field === 'password' ? 'mật khẩu' : 'xác nhận mật khẩu'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => onTogglePassword(field as 'password' | 'confirmPassword')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i
                    className={`fa ${
                      (field === 'password' && showPassword) ||
                      (field === 'confirmPassword' && showConfirmPassword)
                        ? 'fa-eye-slash'
                        : 'fa-eye'
                    } text-xl`}
                  />
                </button>
              </div>
            </div>
            {isSubmitted && formErrors[`${field}Error` as keyof typeof formErrors] && (
              <div className="absolute left-0 right-0 text-center mt-2 text-red-500 text-sm">
                {formErrors[`${field}Error` as keyof typeof formErrors]}
              </div>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <div className="text-center pt-2 mt-6 mb-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-3/4 px-6 py-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              'Đăng ký'
            )}
          </button>

          <p className="mt-4 text-gray-600">
            Đã có tài khoản?{' '}
            <a
              href="/eco-market/login"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-all"
            >
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
