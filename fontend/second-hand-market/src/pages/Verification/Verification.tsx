import React from 'react';
import { useVerification } from './hooks/useVerification';
import { VerificationModal } from './components/VerificationModal';

interface VerificationProps {
  setShowVerify?: (show: boolean) => void;
  userID?: string;
}

const Verification: React.FC<VerificationProps> = ({ setShowVerify, userID }) => {
  const {
    codes,
    timeLeft,
    isVerifying,
    error,
    inputsRef,
    handleChange,
    handleKeyDown,
    handleVerify,
    handleClear,
    handleClose,
    formatTime,
  } = useVerification(userID, setShowVerify);

  return (
    <VerificationModal
      codes={codes}
      timeLeft={timeLeft}
      isVerifying={isVerifying}
      error={error}
      inputsRef={inputsRef}
      onCodeChange={handleChange}
      onKeyDown={handleKeyDown}
      onVerify={handleVerify}
      onClear={handleClear}
      onClose={handleClose}
      formatTime={formatTime}
    />
  );
};

export default Verification;
