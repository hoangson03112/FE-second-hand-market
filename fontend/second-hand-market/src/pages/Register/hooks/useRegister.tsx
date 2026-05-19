import { useState } from 'react';
import AccountContext from '../../../contexts/AccountContext';

export const useRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    fullName: '',
  });
  const [formErrors, setFormErrors] = useState({
    passwordError: '',
    confirmPasswordError: '',
    phoneError: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [userID, setUserID] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validatePhoneNumber = (number: string) =>
    /^(0[3|5|7|8|9])+([0-9]{8,9})$/.test(number);

  const validatePassword = (password: string) =>
    /^(?=.*[A-Za-z]).{8,20}$/.test(password);

  const validateFields = () => {
    let isValid = true;
    const errors: any = {};

    if (!validatePassword(formData.password)) {
      errors.passwordError =
        'Mật khẩu phải có độ dài từ 8-20 ký tự và chứa ít nhất 1 chữ cái.';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPasswordError = 'Mật khẩu xác nhận không khớp.';
      isValid = false;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneError = 'Số điện thoại không hợp lệ. Vui lòng nhập lại.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (validateFields()) {
        const response = await AccountContext.Register(
          formData.username,
          formData.email,
          formData.password,
          formData.phoneNumber,
          formData.fullName
        );

        if (response.status === 'success') {
          setShowVerify(true);
          setUserID(response.accountID);
        } else {
          if (response.type === 'username') {
            setErrorMessage(
              'Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.'
            );
          } else if (response.type === 'email') {
            setErrorMessage(
              'Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.'
            );
          } else if (response.type === 'phoneNumber') {
            setErrorMessage(
              'Số điện thoại này đã được đăng ký với tài khoản khác.'
            );
          } else {
            setErrorMessage(
              `Đăng ký không thành công: ${
                response.message || 'Vui lòng thử lại sau.'
              }`
            );
          }
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(
        'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => setErrorMessage('');

  return {
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
    handleCloseModal,
  };
};
