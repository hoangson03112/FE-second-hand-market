import React from 'react';

interface LoginFormProps {
  username: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  username,
  password,
  showPassword,
  isLoading,
  onUsernameChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-none p-0">
      <div className="flex flex-col">
        {/* Logo and Title */}
        <div className="text-center">
          <img
            src="/images/logi.png"
            className="w-48 mx-auto"
            alt="logo"
          />
          <h4 className="mt-2 mb-3 text-xl font-semibold text-gray-800">
            Chào mừng bạn đến với eco-market
          </h4>
        </div>
        
        <p className="text-center text-gray-600 mb-6">
          Vui lòng đăng nhập tài khoản của bạn
        </p>

        {/* Username Input */}
        <div className="mb-6">
          <label htmlFor="username" className="block ml-12 mb-2 text-sm font-medium text-gray-700">
            Tên đăng nhập
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-3/4 mx-auto block px-4 py-2 rounded-full border-2 border-red-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all"
            placeholder="Nhập tên đăng nhập"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label htmlFor="password" className="block ml-12 mb-2 text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <div className="flex justify-center">
            <div className="relative w-3/4">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 pr-12 rounded-full border-2 border-red-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all"
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xl`} />
              </button>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <div className="text-center pt-2 mb-6">
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-3/4 px-6 py-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </div>

        {/* Register Link */}
        <div className="flex items-center justify-center pb-6 gap-2">
          <p className="mb-0 text-gray-700">Bạn chưa có tài khoản?</p>
          <a
            href="/eco-market/register"
            className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-all"
          >
            Đăng kí
          </a>
        </div>
      </div>
    </div>
  );
};
