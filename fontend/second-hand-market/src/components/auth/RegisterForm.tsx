import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { registerSchema, verifyCodeSchema } from '../../schemas';
import { useRegister, useVerify } from '../../hooks/useAuth';

const steps = ['Đăng ký', 'Xác thực'];

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  fullName: string;
}

interface VerifyFormData {
  code: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [userID, setUserID] = useState<string | null>(null);

  const { mutate: register, isPending: isRegistering, error: registerError } = useRegister();
  const { mutate: verify, isPending: isVerifying, error: verifyError } = useVerify();

  // Register form
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      fullName: '',
    },
  });

  // Verify form
  const verifyForm = useForm({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  const onRegisterSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    
    register(registerData, {
      onSuccess: (response) => {
        if (response.status === 'success' && response.accountID) {
          setUserID(response.accountID);
          setActiveStep(1);
        }
      },
    });
  };

  const onVerifySubmit = (data: VerifyFormData) => {
    if (!userID) return;
    
    verify(
      { userID, code: data.code },
      {
        onSuccess: (response) => {
          if (response.status === 'success') {
            navigate('/');
          }
        },
      }
    );
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Đăng ký tài khoản
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box component="form" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
          {registerError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {registerError.message || 'Đã xảy ra lỗi'}
            </Alert>
          )}

          <TextField
            {...registerForm.register('username')}
            label="Tên đăng nhập"
            fullWidth
            margin="normal"
            error={!!registerForm.formState.errors.username}
            helperText={registerForm.formState.errors.username?.message}
            disabled={isRegistering}
          />

          <TextField
            {...registerForm.register('email')}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!registerForm.formState.errors.email}
            helperText={registerForm.formState.errors.email?.message}
            disabled={isRegistering}
          />

          <TextField
            {...registerForm.register('fullName')}
            label="Họ và tên"
            fullWidth
            margin="normal"
            error={!!registerForm.formState.errors.fullName}
            helperText={registerForm.formState.errors.fullName?.message}
            disabled={isRegistering}
          />

          <TextField
            {...registerForm.register('phoneNumber')}
            label="Số điện thoại"
            fullWidth
            margin="normal"
            error={!!registerForm.formState.errors.phoneNumber}
            helperText={registerForm.formState.errors.phoneNumber?.message}
            disabled={isRegistering}
          />

          <TextField
            {...registerForm.register('password')}
            label="Mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            error={!!registerForm.formState.errors.password}
            helperText={registerForm.formState.errors.password?.message}
            disabled={isRegistering}
          />

          <TextField
            {...registerForm.register('confirmPassword')}
            label="Xác nhận mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            error={!!registerForm.formState.errors.confirmPassword}
            helperText={registerForm.formState.errors.confirmPassword?.message}
            disabled={isRegistering}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isRegistering}
            sx={{ mt: 3, mb: 2 }}
          >
            {isRegistering ? <CircularProgress size={24} /> : 'Đăng ký'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Đã có tài khoản?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Box>
      )}

      {activeStep === 1 && (
        <Box component="form" onSubmit={verifyForm.handleSubmit(onVerifySubmit)}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Mã xác thực đã được gửi đến email của bạn
          </Alert>

          {verifyError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {verifyError.message || 'Mã xác thực không đúng'}
            </Alert>
          )}

          <TextField
            {...verifyForm.register('code')}
            label="Mã xác thực (6 số)"
            fullWidth
            margin="normal"
            error={!!verifyForm.formState.errors.code}
            helperText={verifyForm.formState.errors.code?.message}
            disabled={isVerifying}
            inputProps={{ maxLength: 6 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isVerifying}
            sx={{ mt: 3 }}
          >
            {isVerifying ? <CircularProgress size={24} /> : 'Xác thực'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RegisterForm;
