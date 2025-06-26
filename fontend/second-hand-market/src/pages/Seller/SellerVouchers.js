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
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { useVoucher } from '../../contexts/VoucherContext';

// Enhanced Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
  }
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  margin: theme.spacing(2),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '& .MuiTableCell-root': {
    color: 'white',
    fontWeight: 600,
    fontSize: '0.95rem',
    borderBottom: 'none',
    padding: theme.spacing(2),
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(102, 126, 234, 0.03)',
  },
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
    transform: 'translateY(-1px)',
    transition: 'all 0.2s ease-in-out',
  },
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    padding: theme.spacing(1.5, 2),
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontWeight: 600,
  color: '#fff',
  padding: theme.spacing(1.5, 3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(3),
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#667eea',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#667eea',
      borderWidth: '2px',
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#667eea',
  }
}));

const GradientChip = styled(Chip)(({ theme, chipcolor }) => ({
  background: chipcolor === 'success' 
    ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    : chipcolor === 'warning'
    ? 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)'
    : 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
  color: 'white',
  fontWeight: 600,
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }
}));

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

  const getStatusChip = (voucher) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    if (now < startDate) {
      return <GradientChip chipcolor="warning" label="Chưa bắt đầu" size="small" />;
    }
    if (now > endDate) {
      return <GradientChip chipcolor="error" label="Đã hết hạn" size="small" />;
    }
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return <GradientChip chipcolor="error" label="Hết lượt" size="small" />;
    }
    return <GradientChip chipcolor="success" label="Đang hoạt động" size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {alert.show && (
        <Alert 
          severity={alert.type} 
          sx={{ 
            mb: 2, 
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          {alert.message}
        </Alert>
      )}

      <StyledCard>
        <StyledCardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography 
                variant="h3" 
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Quản lý Voucher
              </Typography>
            </Box>
            <StyledButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              size="large"
            >
              Tạo Voucher Mới
            </StyledButton>
          </Box>

          <StyledTableContainer component={Paper}>
            <Table>
            <StyledTableHead>
  <TableRow>
    <TableCell align="center" sx={{ width: '14%' }}>Mã Voucher</TableCell>
    <TableCell align="center" sx={{ width: '14%' }}>Giá trị</TableCell>
    <TableCell align="center" sx={{ width: '14%' }}>Giảm tối đa</TableCell>
    <TableCell align="center" sx={{ width: '14%' }}>Sử dụng</TableCell>
    <TableCell align="center" sx={{ width: '14%' }}>Thời hạn</TableCell>
    <TableCell align="center" sx={{ width: '14%' }}>Trạng thái</TableCell>
    <TableCell align="center" sx={{ width: '14%' }}>Thao tác</TableCell>
  </TableRow>   
</StyledTableHead>

             <TableBody>
  {vouchers.map((voucher) => (
    <StyledTableRow key={voucher._id}>
      <TableCell align="center">
        <Typography 
          variant="body1" 
          fontWeight="bold" 
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'black',
            fontSize: '1.1rem',
          }}
        >
          {voucher.code}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Box>
          <Typography variant="body2" fontWeight="600">
            {voucher.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Cố định'}
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {voucher.discountType === 'PERCENTAGE' 
              ? `${voucher.discountValue}%` 
              : `$${voucher.discountValue}`}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2" fontWeight="600">
          {voucher.maxDiscountAmount ? `${voucher.maxDiscountAmount}đ` : 'Không giới hạn'}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Box>
          <Typography variant="body2" fontWeight="600">
            {voucher.usedCount || 0}/{voucher.usageLimit || '∞'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            lượt sử dụng
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(voucher.startDate), 'dd/MM/yyyy')}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            đến {format(new Date(voucher.endDate), 'dd/MM/yyyy')}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">{getStatusChip(voucher)}</TableCell>
      <TableCell align="center">
        <Box display="flex" gap={1} justifyContent="center">
          <AnimatedIconButton
            size="small"
            sx={{ 
              color: '#667eea',
              '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
            }}
            onClick={() => handleOpenDialog(voucher)}
          >
            <EditIcon />
          </AnimatedIconButton>
          <AnimatedIconButton
            size="small"
            sx={{ 
              color: '#ff6b6b',
              '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' }
            }}
            onClick={() => handleDelete(voucher._id)}
          >
            <DeleteIcon />
          </AnimatedIconButton>
        </Box>
      </TableCell>
    </StyledTableRow>
  ))}
</TableBody>
            </Table>
          </StyledTableContainer>
        </StyledCardContent>
      </StyledCard>

      {/* Simplified Dialog */}
      <StyledDialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          pb: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          {editingVoucher ? 'Chỉnh sửa Voucher' : 'Tạo Voucher Mới'}
        </DialogTitle>
        <Divider sx={{ background: 'linear-gradient(90deg, #667eea, #764ba2)' }} />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Mã voucher"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                disabled={!!editingVoucher}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                select
                label="Loại giảm giá"
                value={formData.discountType}
                onChange={(e) => handleInputChange('discountType', e.target.value)}
                required
              >
                <MenuItem value="PERCENTAGE">Phần trăm (%)</MenuItem>
                <MenuItem value="FIXED">Cố định ($)</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label={formData.discountType === 'PERCENTAGE' ? 'Giá trị (%)' : 'Giá trị ($)'}
                type="number"
                value={formData.discountValue}
                onChange={(e) => handleInputChange('discountValue', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
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
              <StyledTextField
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
              <StyledTextField
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
              <StyledTextField
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
          <StyledButton onClick={handleSubmit}>
            {editingVoucher ? 'Cập nhật' : 'Tạo voucher'}
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
};

export default SellerVouchers;  