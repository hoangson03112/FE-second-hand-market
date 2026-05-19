import React from 'react';
import { useRegister } from './hooks/useRegister';
import { RegisterForm } from './components/RegisterForm';
import { WelcomeSection } from './components/WelcomeSection';
import Verification from '../Verification/Verification';

function Register() {
  const {
    showPassword,
    showConfirmPassword,
    formData,
    formErrors,
    isSubmitted,
    errorMessage,
    showVerify,
    userID,
    isLoading,
    setShowPassword,
    setShowConfirmPassword,
    setShowVerify,
    handleInputChange,
    handleSubmit,
  } = useRegister();

  const handleTogglePassword = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div>
      {showVerify && (
        <Verification setShowVerify={setShowVerify} userID={userID} />
      )}
      
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Side - Welcome Section */}
            <div className="w-full md:w-7/12 mb-8">
              <WelcomeSection />
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full md:w-5/12 mb-8">
              <RegisterForm
                formData={formData}
                formErrors={formErrors}
                isSubmitted={isSubmitted}
                errorMessage={errorMessage}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onTogglePassword={handleTogglePassword}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
