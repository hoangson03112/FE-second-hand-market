import React, { useState, useEffect } from 'react';
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
  Grid,
  Chip,
  Alert,
  Divider,
  IconButton,
  Collapse
} from '@mui/material';
import {
  LocalOffer as VoucherIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useVoucher } from '../../contexts/VoucherContext';

const VoucherCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
  backgroundColor: selected ? '#f3f4f6' : 'white',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2]
  }
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
    getAvailableVouchers, 
    applyVoucher, 
    appliedVoucher, 
    voucherDiscount,
    clearAppliedVoucher 
  } = useVoucher();

  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const [showVoucherList, setShowVoucherList] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAvailableVouchers();
    }
  }, [open]);

  const fetchAvailableVouchers = async () => {
    try {
      const response = await getAvailableVouchers();
      setAvailableVouchers(response.vouchers || []);
    } catch (error) {
      showAlert('Không thể tải danh sách voucher', 'error');
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleApplyVoucher = async (code) => {
    if (!orderAmount || orderAmount <= 0) {
      showAlert('Giá trị đơn hàng không hợp lệ', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await applyVoucher(code, orderAmount);
      onVoucherSelect(result.voucher, result.discountAmount);
      showAlert('Áp dụng voucher thành công!', 'success');
      setVoucherCode('');
    } catch (error) {
      showAlert(error.message || 'Không thể áp dụng voucher', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    clearAppliedVoucher();
    onVoucherSelect(null, 0);
    showAlert('Đã bỏ voucher', 'info');
  };

  const calculateDiscount = (voucher) => {
    if (!orderAmount) return 0;
    
    let discountAmount = 0;
    if (voucher.discountType === 'PERCENTAGE') {
      discountAmount = (orderAmount * voucher.discountValue) / 100;
      if (voucher.maxDiscountAmount && discountAmount > voucher.maxDiscountAmount) {
        discountAmount = voucher.maxDiscountAmount;
      }
    } else {
      discountAmount = voucher.discountValue;
    }
    
    return Math.min(discountAmount, orderAmount);
  };

  const canUseVoucher = (voucher) => {
    return orderAmount >= voucher.minOrderAmount;
  };

const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <VoucherIcon color="primary" />
          <Typography variant="h6">Chọn Voucher</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {alert.show && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        {/* Voucher hiện tại */}
        {selectedVoucher && (
          <Card sx={{ mb: 2, bgcolor: '#f0f9ff', border: '1px solid #0ea5e9' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    {selectedVoucher.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mã: {selectedVoucher.code}
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
          </Card>
        )}

        {/* Nhập mã voucher */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Nhập mã voucher
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              placeholder="Nhập mã voucher"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              size="small"
            />
            <Button
              variant="contained"
              onClick={() => handleApplyVoucher(voucherCode)}
              disabled={!voucherCode.trim() || loading}
              sx={{ minWidth: '100px' }}
            >
              Áp dụng
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Danh sách voucher */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle2">
              Voucher có sẵn ({availableVouchers.length})
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowVoucherList(!showVoucherList)}
            >
              {showVoucherList ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>

          <Collapse in={showVoucherList}>
            <Grid container spacing={2}>
              {availableVouchers.map((voucher) => {
                const canUse = canUseVoucher(voucher);
                const discountAmount = calculateDiscount(voucher);
                const isSelected = selectedVoucher?.code === voucher.code;

                return (
                  <Grid item xs={12} key={voucher._id}>
                    <VoucherCard 
                      selected={isSelected}
                      onClick={() => canUse && handleApplyVoucher(voucher.code)}
                      sx={{ opacity: canUse ? 1 : 0.5 }}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {voucher.name}
                              </Typography>
                              {isSelected && <CheckCircle color="primary" fontSize="small" />}
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              Mã: <strong>{voucher.code}</strong>
                            </Typography>
                            
                            <Box display="flex" gap={1} mb={1}>
                              <Chip
                                label={
                                  voucher.discountType === 'PERCENTAGE'
                                    ? `Giảm ${voucher.discountValue}%`
                                    : `Giảm ${formatCurrency(voucher.discountValue)}`
                                }
                                color="primary"
                                size="small"
                              />
                              {voucher.minOrderAmount > 0 && (
                                <Chip
                                  label={`Đơn tối thiểu ${formatCurrency(voucher.minOrderAmount)}`}
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                            </Box>

                            {voucher.description && (
                              <Typography variant="caption" color="text.secondary">
                                {voucher.description}
                              </Typography>
                            )}
                          </Box>

                          <Box textAlign="right">
                            {canUse ? (
                              <Typography variant="h6" color="success.main" fontWeight="bold">
                                -{formatCurrency(discountAmount)}
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="error">
                                Không đủ điều kiện
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </VoucherCard>
                  </Grid>
                );
              })}
            </Grid>

            {availableVouchers.length === 0 && (
              <Box textAlign="center" py={3}>
                <Typography variant="body2" color="text.secondary">
                  Không có voucher khả dụng
                </Typography>
              </Box>
            )}
          </Collapse>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherSelector;