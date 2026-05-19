import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { loginSchema } from '../../schemas';
import { useLogin } from '../../hooks/useAuth';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (response) => {
        if (response.status === 'success') {
          navigate('/');
        }
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Đăng nhập
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || 'Đã xảy ra lỗi'}
        </Alert>
      )}

      <TextField
        {...register('username')}
        label="Tên đăng nhập"
        fullWidth
        margin="normal"
        error={!!errors.username}
        helperText={errors.username?.message}
        disabled={isPending}
      />

      <TextField
        {...register('password')}
        label="Mật khẩu"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isPending}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isPending}
        sx={{ mt: 3, mb: 2 }}
      >
        {isPending ? <CircularProgress size={24} /> : 'Đăng nhập'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2">
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ textDecoration: 'none' }}>
            Đăng ký ngay
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
