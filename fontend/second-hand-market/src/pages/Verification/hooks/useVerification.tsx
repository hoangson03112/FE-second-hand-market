import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountContext from '../../../contexts/AccountContext';

export const useVerification = (userID?: string, setShowVerify?: (show: boolean) => void) => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes = 900 seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      // Auto focus next input
      if (value && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.MouseEvent) => {
    e.preventDefault();
    const code = codes.join('');

    if (code.length !== 4) {
      setError('Vui lòng nhập đầy đủ 4 số');
      return;
    }

    if (!userID) {
      setError('Không tìm thấy thông tin người dùng');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const data = await AccountContext.Verify(userID, code);
      if (data.status === 'success') {
        if (setShowVerify) {
          setShowVerify(false);
        }
        navigate('/eco-market/login');
      } else {
        setError(data.message || 'Mã xác minh không đúng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    setCodes(['', '', '', '']);
    setError('');
    inputsRef.current[0]?.focus();
  };

  const handleClose = () => {
    if (setShowVerify) {
      setShowVerify(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return {
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
  };
};
