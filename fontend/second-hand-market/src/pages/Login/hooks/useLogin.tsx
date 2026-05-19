import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export const useLogin = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      const data = await login(username, password);
      if (data?.status === 'success') {
        window.location.href = '/eco-market/home';
      } else {
        setErrorMessage(data?.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setErrorMessage('');
  };

  return {
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
  };
};
