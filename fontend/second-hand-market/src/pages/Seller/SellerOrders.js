import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
  Stack,
  Paper,
  Badge,
  CardActions,
  Container
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  LocalShipping as LocalShippingIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Notes as NotesIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useOrder } from '../../contexts/OrderContext';
import AccountContext from '../../contexts/AccountContext';
import OrderFilter from './OrderFilter';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    reason: ''
  });

  const { updateOrder } = useOrder();

  // Enhanced status options with icons
  const statusOptions = [
    { 
      value: 'pending', 
      label: 'Chờ xử lý', 
      color: 'warning',
      bgColor: '#fff3e0',
      textColor: '#e65100',
      icon: <HourglassEmptyIcon />
    },
    { 
      value: 'confirmed', 
      label: 'Đã xác nhận', 
      color: 'info',
      bgColor: '#e3f2fd',
      textColor: '#1976d2',
      icon: <CheckCircleIcon />
    },
    { 
      value: 'shipped', 
      label: 'Đã giao vận', 
      color: 'secondary',
      bgColor: '#f3e5f5',
      textColor: '#7b1fa2',
      icon: <LocalShippingIcon />
    },
    { 
      value: 'delivered', 
      label: 'Đã giao hàng', 
      color: 'success',
      bgColor: '#e8f5e8',
      textColor: '#2e7d32',
      icon: <AssignmentIcon />
    },
    { 
      value: 'cancelled', 
      label: 'Hủy', 
      color: 'error',
      bgColor: '#ffebee',
      textColor: '#d32f2f',
      icon: <CancelIcon />
    }
  ];

  const canUpdateOrder = (orderStatus) => {
    return orderStatus !== 'delivered' && orderStatus !== 'cancelled';
  };

  const getAvailableStatusOptions = (currentStatus) => {
    if (currentStatus === 'cancelled' || currentStatus === 'delivered') {
      return [];
    }

    if (currentStatus === 'shipped') {
      return statusOptions.filter(option => 
        option.value === 'shipped' || option.value === 'delivered'
      );
    }

    let availableOptions = statusOptions.filter(option => option.value !== 'delivered');
    
    if (currentStatus === 'shipped') {
      availableOptions.push(statusOptions.find(option => option.value === 'delivered'));
    }

    return availableOptions;
  };

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Chưa đăng nhập');
        return;
      }

      const response = await axios.get(
        'http://localhost:2000/eco-market/orders/my-seller-orders',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      console.log('Orders response:', response.data);
      const ordersList = response.data.orders || [];
      setOrders(ordersList);
      setFilteredOrders(ordersList);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (filters) => {
    let filtered = [...orders];

    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const orderId = order._id.toLowerCase();
        const customerName = (order.shippingAddress?.fullName || order.buyerId?.fullName || '').toLowerCase();
        const customerEmail = (order.buyerId?.email || '').toLowerCase();
        const customerPhone = (order.shippingAddress?.phoneNumber || order.buyerId?.phoneNumber || '').toLowerCase();
        
        return orderId.includes(searchTerm) || 
               customerName.includes(searchTerm) || 
               customerEmail.includes(searchTerm) || 
               customerPhone.includes(searchTerm);
      });
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate <= toDate;
      });
    }

    if (filters.minAmount) {
      const minAmount = parseFloat(filters.minAmount);
      filtered = filtered.filter(order => order.totalAmount >= minAmount);
    }

    if (filters.maxAmount) {
      const maxAmount = parseFloat(filters.maxAmount);
      filtered = filtered.filter(order => order.totalAmount <= maxAmount);
    }

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (newFilters) => {
    filterOrders(newFilters);
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const handleExpandOrder = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      reason: order.reason || ''
    });
    setUpdateDialog(true);
  };

  const handleSaveUpdate = async () => {
    try {
      if (!canUpdateOrder(selectedOrder.status)) {
        setError('Không thể cập nhật đơn hàng đã giao hàng hoặc đã hủy');
        return;
      }

      const availableOptions = getAvailableStatusOptions(selectedOrder.status);
      const isValidStatus = availableOptions.some(option => option.value === updateData.status);
      
      if (!isValidStatus) {
        setError('Trạng thái cập nhật không hợp lệ');
        return;
      }

      const result = await updateOrder(
        selectedOrder._id,
        updateData.reason,
        updateData.status
      );

      if (result.status && result.status !== 200) {
        setError(result.message);
        return;
      }

      await fetchSellerOrders();
      setUpdateDialog(false);
      setSelectedOrder(null);
      setUpdateData({ status: '', reason: '' });
      setError('');
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật đơn hàng');
    }
  };

  const getStatusChip = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return (
      <Chip
        icon={statusOption?.icon}
        label={statusOption?.label || status}
        sx={{
          backgroundColor: statusOption?.bgColor,
          color: statusOption?.textColor,
          fontWeight: 600,
          border: `1px solid ${statusOption?.textColor}`,
          '& .MuiChip-icon': {
            color: statusOption?.textColor
          }
        }}
      />
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: '#1976d2',
            mb: 1,
            textAlign: 'center'
          }}
        >
          Quản lý đơn hàng
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Theo dõi và quản lý tất cả đơn hàng của bạn
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filter Component */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <OrderFilter 
          onFilterChange={handleFilterChange}
          totalOrders={filteredOrders.length}
        />
      </Paper>

      {filteredOrders.length === 0 ? (
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {orders.length === 0 ? 'Chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng phù hợp'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {orders.length === 0 ? 'Các đơn hàng sẽ xuất hiện ở đây khi có khách hàng đặt mua' : 'Thử điều chỉnh bộ lọc để tìm đơn hàng'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => {
            const statusOption = statusOptions.find(opt => opt.value === order.status);
            return (
              <Grid item xs={12} key={order._id}>
                <Card 
                  elevation={4} 
                  sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      elevation: 8,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {/* Header with gradient background */}
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${statusOption?.bgColor} 0%, ${statusOption?.textColor}20 100%)`,
                      p: 3,
                      borderBottom: `3px solid ${statusOption?.textColor}`
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: statusOption?.textColor }}>
                          #{order._id.slice(-8)}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(order.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getStatusChip(order.status)}
                        {canUpdateOrder(order.status) && (
                          <IconButton
                            onClick={() => handleUpdateOrder(order)}
                            sx={{
                              backgroundColor: 'white',
                              color: '#1976d2',
                              '&:hover': {
                                backgroundColor: '#f5f5f5'
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {/* Customer Information */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Thông tin khách hàng
                          </Typography>
                          <Stack spacing={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                <strong>Tên:</strong> {order.shippingAddress?.fullName || order.buyerId?.fullName || 'N/A'}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                <strong>SĐT:</strong> {order.shippingAddress?.phoneNumber || order.buyerId?.phoneNumber || 'N/A'}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                <strong>Email:</strong> {order.buyerId?.email || 'N/A'}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                            <AttachMoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Thông tin đơn hàng
                          </Typography>
                          <Stack spacing={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <AttachMoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                <strong>Tổng tiền:</strong> 
                                <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: '1.1em' }}>
                                  {formatCurrency(order.totalAmount)}
                                </span>
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <LocalShippingIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                <strong>Vận chuyển:</strong> {order.shippingMethod}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <InventoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                <strong>Số sản phẩm:</strong> {order.products?.length || 0}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>

                  {/* Expand/Collapse Button */}
                  <CardActions sx={{ justifyContent: 'center', py: 2 }}>
                    <Button
                      onClick={() => handleExpandOrder(order._id)}
                      startIcon={expandedOrders[order._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3
                      }}
                    >
                      {expandedOrders[order._id] ? 'Thu gọn chi tiết' : 'Xem chi tiết'}
                    </Button>
                  </CardActions>

                  {/* Expanded Content */}
                  <Collapse in={expandedOrders[order._id]}>
                    <Box sx={{ backgroundColor: '#f8f9fa', p: 3 }}>
                      {/* Product Details - New Design */}
                      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
                        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Chi tiết sản phẩm
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {order.products?.map((item, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card 
                              elevation={2} 
                              sx={{ 
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  elevation: 4,
                                  transform: 'translateY(-1px)'
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Avatar 
                                    sx={{ 
                                      bgcolor: '#1976d2',
                                      width: 50,
                                      height: 50
                                    }}
                                  >
                                    <InventoryIcon />
                                  </Avatar>
                                  <Box flex={1}>
                                    <Typography 
                                      variant="subtitle1" 
                                      sx={{ 
                                        fontWeight: 600,
                                        mb: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      {item.productId?.name || 'N/A'}
                                    </Typography>
                                    <Stack spacing={0.5}>
                                      <Typography variant="body2" color="text.secondary">
                                        <strong>Số lượng:</strong> 
                                        <Badge badgeContent={item.quantity} color="primary" sx={{ ml: 1 }}>
                                          <span></span>
                                        </Badge>
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        <strong>Đơn giá:</strong> {formatCurrency(item.productId?.price || 0)}
                                      </Typography>
                                      <Typography 
                                        variant="body1" 
                                        sx={{ 
                                          color: '#2e7d32', 
                                          fontWeight: 600,
                                          fontSize: '1.1em'
                                        }}
                                      >
                                        <strong>Thành tiền:</strong> {formatCurrency((item.productId?.price || 0) * item.quantity)}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <Box mt={4}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                            <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Địa chỉ giao hàng
                          </Typography>
                          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Người nhận:</strong> {order.shippingAddress.fullName || 'N/A'}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <strong>SĐT:</strong> {order.shippingAddress.phoneNumber || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                  <strong>Địa chỉ:</strong> {[
                                    order.shippingAddress.specificAddress,
                                    order.shippingAddress.ward,
                                    order.shippingAddress.district,
                                    order.shippingAddress.province
                                  ].filter(Boolean).join(', ') || 'N/A'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Box>
                      )}

                      {/* Order Notes */}
                      {order.reason && (
                        <Box mt={4}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                            <NotesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Ghi chú đơn hàng
                          </Typography>
                          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: '#fff3e0' }}>
                            <Typography variant="body2">{order.reason}</Typography>
                          </Paper>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Update Order Dialog */}
      <Dialog 
        open={updateDialog} 
        onClose={() => setUpdateDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 600 }}>
          <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Cập nhật đơn hàng
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            select
            fullWidth
            label="Trạng thái đơn hàng"
            value={updateData.status}
            onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
            margin="normal"
            sx={{ mb: 2 }}
          >
            {selectedOrder && getAvailableStatusOptions(selectedOrder.status).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  {option.icon}
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Ghi chú"
            value={updateData.reason}
            onChange={(e) => setUpdateData(prev => ({ ...prev, reason: e.target.value }))}
            margin="normal"
            placeholder="Nhập ghi chú cho đơn hàng..."
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setUpdateDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSaveUpdate} 
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerOrders;