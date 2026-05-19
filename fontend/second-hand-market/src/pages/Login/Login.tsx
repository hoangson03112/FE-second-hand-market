import React from 'react';
import { useLogin } from './hooks/useLogin';
import { LoginForm } from './components/LoginForm';
import { ErrorModal } from './components/ErrorModal';
import { WelcomeSection } from './components/WelcomeSection';

function Login() {
  const {
    showPassword,
    username,
    password,
    errorMessage,
    isLoading,
    setUsername,
    setPassword,
    togglePasswordVisibility,
    handleLogin,
    handleCloseModal,
  } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-red-600 to-pink-600">
      <div className="container mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Login Form */}
          <div className="w-full md:w-5/12 mb-8">
            <LoginForm
              username={username}
              password={password}
              showPassword={showPassword}
              isLoading={isLoading}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
              onTogglePassword={togglePasswordVisibility}
              onSubmit={handleLogin}
            />
          </div>

          {/* Right Side - Welcome Section */}
          <div className="w-full md:w-7/12 mb-8">
            <WelcomeSection />
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal errorMessage={errorMessage} onClose={handleCloseModal} />
    </div>
  );
}

export default Login;
