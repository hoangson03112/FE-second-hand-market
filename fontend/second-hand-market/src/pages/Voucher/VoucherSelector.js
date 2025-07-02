import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Alert,
  IconButton
} from '@mui/material';
import {
  LocalOffer as VoucherIcon,
  CheckCircle,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useVoucher } from '../../contexts/VoucherContext';

const VoucherCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#f0f9ff',
  border: '1px solid #0ea5e9',
  marginBottom: theme.spacing(2)
}));

const VoucherSelector = ({ 
  orderAmount, 
  onVoucherSelect, 
  selectedVoucher, 
  discount = 0,
  open = false,
  onClose = () => {}
}) => {
  const { 
    applyVoucher, 
    clearAppliedVoucher 
  } = useVoucher();

  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      showAlert('Vui lòng nhập mã voucher', 'warning');
      return;
    }

    if (!orderAmount || orderAmount <= 0) {
      showAlert('Giá trị đơn hàng không hợp lệ', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await applyVoucher(voucherCode.trim().toUpperCase(), orderAmount);
      onVoucherSelect(result.voucher, result.discountAmount);
      showAlert('Áp dụng voucher thành công!', 'success');
      setVoucherCode('');
    } catch (error) {
      showAlert(error.message || 'Mã voucher không hợp lệ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    clearAppliedVoucher();
    onVoucherSelect(null, 0);
    showAlert('Đã bỏ voucher', 'info');
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleApplyVoucher();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <VoucherIcon color="primary" />
            <Typography variant="h6">Áp dụng Voucher</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {alert.show && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        {/* Voucher hiện tại đang áp dụng */}
        {selectedVoucher && (
          <VoucherCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CheckCircle color="primary" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {selectedVoucher.name || 'Voucher được áp dụng'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Mã: <strong>{selectedVoucher.code}</strong>
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    Giảm: {formatCurrency(discount)}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={handleRemoveVoucher}
                >
                  Bỏ chọn
                </Button>
              </Box>
            </CardContent>
          </VoucherCard>
        )}

        {/* Form nhập mã voucher */}
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Nhập mã voucher
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Nhập mã voucher của bạn để được giảm giá cho đơn hàng
          </Typography>
          
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              placeholder="Nhập mã voucher (VD: SAVE10, NEWUSER20)"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              size="medium"
              variant="outlined"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
          </Box>
          
          <Button
            variant="contained"
            onClick={handleApplyVoucher}
            disabled={!voucherCode.trim() || loading}
            fullWidth
            size="large"
            sx={{ mb: 2 }}
          >
            {loading ? 'Đang kiểm tra...' : 'Áp dụng voucher'}
          </Button>

          {orderAmount > 0 && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Tổng đơn hàng: <strong>{formatCurrency(orderAmount)}</strong>
              </Typography>
              {selectedVoucher && (
                <Typography variant="body2" color="success.main">
                  Sau giảm giá: <strong>{formatCurrency(orderAmount - discount)}</strong>
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
        {selectedVoucher && (
          <Button 
            onClick={onClose} 
            variant="contained"
            color="primary"
          >
            Xác nhận
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default VoucherSelector;