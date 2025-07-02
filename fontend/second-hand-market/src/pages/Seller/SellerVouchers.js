import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  Stack,
  Tooltip,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as VoucherIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { useVoucher } from '../../contexts/VoucherContext';

// Modern Glass Morphism Card
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(4),
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 25px 45px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }
}));

// Hero Section with Statistics
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: theme.spacing(4),
  padding: theme.spacing(4),
  color: 'white',
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'pulse 4s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
    '50%': { transform: 'scale(1.1)', opacity: 0.1 },
  }
}));

// Modern Stats Card
const StatsCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.5)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  }
}));

// Voucher Card with Modern Design
const VoucherCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
  backdropFilter: 'blur(15px)',
  borderRadius: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.3)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: theme.spacing(3),
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  }
}));

// Floating Action Button
const FloatingButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(6),
  right: theme.spacing(5),
  borderRadius: '30px',
  padding: theme.spacing(1.5, 3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
  zIndex: 1000,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem', // nhỏ hơn một chút
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 15px 30px rgba(102, 126, 234, 0.5)',
  }
}));


// Modern Dialog
const ModernDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(4),
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
  }
}));

// Modern Input Field
const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#667eea',
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#667eea',
        borderWidth: '2px',
      }
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#667eea',
  }
}));

// Status Chip with Animation
const AnimatedChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      case 'pending': return 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)';
      case 'expired': return 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return {
    background: getStatusColor(),
    color: 'white',
    fontWeight: 600,
    borderRadius: theme.spacing(2),
    animation: 'chipPulse 2s ease-in-out infinite',
    '@keyframes chipPulse': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
    }
  };
});

const SellerVouchers = () => {
  const { 
    getAllVouchers, 
    createVoucher, 
    updateVoucher, 
    deleteVoucher 
  } = useVoucher();

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    usageLimit: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await getAllVouchers();
      setVouchers(response.vouchers || []);
    } catch (error) {
      showAlert('Lỗi khi tải danh sách voucher', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleOpenDialog = (voucher = null) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData({
        code: voucher.code,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue.toString(),
        usageLimit: voucher.usageLimit?.toString() || '',
        maxDiscountAmount: voucher.maxDiscountAmount?.toString() || '',
        startDate: format(new Date(voucher.startDate), 'yyyy-MM-dd\'T\'HH:mm'),
        endDate: format(new Date(voucher.endDate), 'yyyy-MM-dd\'T\'HH:mm')
      });
    } else {
      setEditingVoucher(null);
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        usageLimit: '',
        maxDiscountAmount: '',
        startDate: '',
        endDate: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVoucher(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null
      };

      if (editingVoucher) {
        await updateVoucher(editingVoucher._id, payload);
        showAlert('Cập nhật voucher thành công!');
      } else {
        await createVoucher(payload);
        showAlert('Tạo voucher thành công!');
      }

      handleCloseDialog();
      fetchVouchers();
    } catch (error) {
      showAlert(error.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      try {
        await deleteVoucher(id);
        showAlert('Xóa voucher thành công!');
        fetchVouchers();
      } catch (error) {
        showAlert(error.message || 'Có lỗi xảy ra khi xóa', 'error');
      }
    }
  };

  const getVoucherStatus = (voucher) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    if (now < startDate) return { status: 'pending', label: 'Chưa bắt đầu' };
    if (now > endDate) return { status: 'expired', label: 'Đã hết hạn' };
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return { status: 'expired', label: 'Hết lượt' };
    }
    return { status: 'active', label: 'Đang hoạt động' };
  };

  const getUsagePercentage = (voucher) => {
    if (!voucher.usageLimit) return 0;
    return Math.min((voucher.usedCount || 0) / voucher.usageLimit * 100, 100);
  };

  const renderVoucherGrid = () => (
    <Grid container spacing={3}>
      {vouchers.map((voucher) => {
        const { status, label } = getVoucherStatus(voucher);
        const usagePercentage = getUsagePercentage(voucher);
        
        return (
          <Grid item xs={12} md={6} lg={4} key={voucher._id}>
            <VoucherCard>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: 40, 
                    height: 40 
                  }}>
                    <VoucherIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {voucher.code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {voucher.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Cố định'}
                    </Typography>
                  </Box>
                </Box>
                <AnimatedChip 
                  status={status}
                  label={label}
                  size="small"
                />
              </Box>

              <Box mb={2}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {voucher.discountType === 'PERCENTAGE' 
                    ? `${voucher.discountValue}%` 
                    : `$${voucher.discountValue}`}
                </Typography>
                {voucher.maxDiscountAmount && (
                  <Typography variant="body2" color="text.secondary">
                    Giảm tối đa: {voucher.maxDiscountAmount}đ
                  </Typography>
                )}
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Sử dụng: {voucher.usedCount || 0}/{voucher.usageLimit || '∞'}
                </Typography>
                {voucher.usageLimit && (
                  <LinearProgress 
                    variant="determinate" 
                    value={usagePercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      background: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }
                    }}
                  />
                )}
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  <ScheduleIcon sx={{ fontSize: 16, mr: 1 }} />
                  {format(new Date(voucher.startDate), 'dd/MM/yyyy')} - {format(new Date(voucher.endDate), 'dd/MM/yyyy')}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Tooltip title="Chỉnh sửa">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(voucher)}
                    sx={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      '&:hover': { background: 'rgba(102, 126, 234, 0.2)' }
                    }}
                  >
                    <EditIcon sx={{ color: '#667eea' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(voucher._id)}
                    sx={{
                      background: 'rgba(255, 107, 107, 0.1)',
                      '&:hover': { background: 'rgba(255, 107, 107, 0.2)' }
                    }}
                  >
                    <DeleteIcon sx={{ color: '#ff6b6b' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </VoucherCard>
          </Grid>
        );
      })}
    </Grid>
  );

  const calculateStats = () => {
    const totalVouchers = vouchers.length;
    const activeVouchers = vouchers.filter(v => getVoucherStatus(v).status === 'active').length;
    const expiredVouchers = vouchers.filter(v => getVoucherStatus(v).status === 'expired').length;
    const totalUsage = vouchers.reduce((sum, v) => sum + (v.usedCount || 0), 0);
    
    return { totalVouchers, activeVouchers, expiredVouchers, totalUsage };
  };

  const stats = calculateStats();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {alert.show && (
          <Alert 
            severity={alert.type} 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            {alert.message}
          </Alert>
        )}

        {/* Hero Section */}
        <HeroSection>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" fontWeight="bold" mb={2}>
                Quản lý Voucher
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Tạo và quản lý các voucher giảm giá cho cửa hàng của bạn
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StatsCard>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <VoucherIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {stats.totalVouchers}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tổng voucher
                        </Typography>
                      </Box>
                    </Box>
                  </StatsCard>
                </Grid>
                <Grid item xs={6}>
                  <StatsCard>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                        <TrendingUpIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {stats.activeVouchers}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Đang hoạt động
                        </Typography>
                      </Box>
                    </Box>
                  </StatsCard>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </HeroSection>

        {/* Main Content */}
        <GlassCard>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h5" fontWeight="bold">
                Danh sách Voucher
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('grid')}
                  sx={{ borderRadius: 3 }}
                >
                  Lưới
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('table')}
                  sx={{ borderRadius: 3 }}
                >
                  Bảng
                </Button>
              </Stack>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <LinearProgress sx={{ width: '100%', borderRadius: 2 }} />
              </Box>
            ) : (
              renderVoucherGrid()
            )}
          </CardContent>
        </GlassCard>
      </Container>

      {/* Floating Action Button */}
      <FloatingButton
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
      >
        Tạo Voucher
      </FloatingButton>

      {/* Modern Dialog */}
      <ModernDialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          pb: 2,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {editingVoucher ? 'Chỉnh sửa Voucher' : 'Tạo Voucher Mới'}
        </DialogTitle>
        <Divider sx={{ background: 'linear-gradient(90deg, #667eea, #764ba2)', height: 2 }} />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ModernTextField
                fullWidth
                label="Mã voucher"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                disabled={!!editingVoucher}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernTextField
                fullWidth
                select
                label="Loại giảm giá"
                value={formData.discountType}
                onChange={(e) => handleInputChange('discountType', e.target.value)}
                required
              >
                <MenuItem value="PERCENTAGE">Phần trăm (%)</MenuItem>
                <MenuItem value="FIXED">Cố định ($)</MenuItem>
              </ModernTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernTextField
                fullWidth
                label={formData.discountType === 'PERCENTAGE' ? 'Giá trị (%)' : 'Giá trị ($)'}
                type="number"
                value={formData.discountValue}
                onChange={(e) => handleInputChange('discountValue', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernTextField
                fullWidth
                label="Giảm tối đa ($)"
                type="number"
                value={formData.maxDiscountAmount}
                onChange={(e) => handleInputChange('maxDiscountAmount', e.target.value)}
                disabled={formData.discountType === 'FIXED'}
                placeholder="Để trống = không giới hạn"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernTextField
                fullWidth
                label="Số lần sử dụng tối đa"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                placeholder="Để trống = không giới hạn"
              />
            </Grid>
            <Grid item xs={12} md={6}></Grid>
            <Grid item xs={12} md={6}>
              <ModernTextField
                fullWidth
                label="Ngày bắt đầu"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernTextField
                fullWidth
                label="Ngày kết thúc"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              borderRadius: 3, 
              textTransform: 'none',
              color: '#666',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {editingVoucher ? 'Cập nhật' : 'Tạo voucher'}
          </Button>
        </DialogActions>
      </ModernDialog>
    </Box>
  );
};

export default SellerVouchers;