import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  LocalOffer as VoucherIcon,
  ContentCopy as CopyIcon,
  Schedule as TimeIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useVoucher } from '../../contexts/VoucherContext';

const VoucherCard = styled(Card)(({ theme }) => ({
  height: '100%',
  border: '1px solid #e0e0e0',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)'
  }
}));

const VoucherHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(2),
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    transform: 'translate(30%, -30%)'
  }
}));

const VoucherList = () => {
  const { getAvailableVouchers } = useVoucher();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await getAvailableVouchers();
      setVouchers(response.vouchers || []);
    } catch (error) {
      showAlert('Không thể tải danh sách voucher', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showAlert(`Đã sao chép mã: ${code}`, 'success');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  const getDiscountText = (voucher) => {
    if (voucher.discountType === 'PERCENTAGE') {
      return `Giảm ${voucher.discountValue}%`;
    }
    return `Giảm ${formatCurrency(voucher.discountValue)}`;
  };

  const getUsageText = (voucher) => {
    if (!voucher.usageLimit) return 'Không giới hạn';
    const remaining = voucher.usageLimit - voucher.usedCount;
    return `Còn ${remaining}/${voucher.usageLimit} lượt`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={40} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <VoucherIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight="bold">
            Voucher khuyến mãi
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Sử dụng các mã voucher dưới đây để được giảm giá khi mua hàng
        </Typography>
      </Paper>

      {vouchers.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <VoucherIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không có voucher khả dụng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Các voucher mới sẽ được cập nhật sớm
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {vouchers.map((voucher) => (
            <Grid item xs={12} sm={6} md={4} key={voucher._id}>
              <VoucherCard>
                <VoucherHeader>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                      {voucher.name}
                    </Typography>
                    <VoucherIcon />
                  </Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                    {getDiscountText(voucher)}
                  </Typography>
                </VoucherHeader>

                <CardContent sx={{ p: 3 }}>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Mã voucher
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={voucher.code}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                      />
                      <Button
                        size="small"
                        startIcon={<CopyIcon />}
                        onClick={() => handleCopyCode(voucher.code)}
                      >
                        Sao chép
                      </Button>
                    </Box>
                  </Box>

                  {voucher.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {voucher.description}
                    </Typography>
                  )}

                  <Box mb={2}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <CartIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        Đơn tối thiểu: {formatCurrency(voucher.minOrderAmount)}
                      </Typography>
                    </Box>

                    {voucher.maxDiscountAmount && (
                      <Typography variant="body2" color="text.secondary">
                        Giảm tối đa: {formatCurrency(voucher.maxDiscountAmount)}
                      </Typography>
                    )}
                  </Box>

                  <Box mb={2}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        HSD: {formatDate(voucher.endDate)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {getUsageText(voucher)}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleCopyCode(voucher.code)}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      }
                    }}
                  >
                    Sử dụng ngay
                  </Button>
                </CardContent>
              </VoucherCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default VoucherList;