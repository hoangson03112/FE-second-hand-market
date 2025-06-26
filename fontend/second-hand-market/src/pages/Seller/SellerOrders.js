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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useOrder } from '../../contexts/OrderContext';
import AccountContext from '../../contexts/AccountContext';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
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

  // Status options for seller
  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý', color: 'warning' },
    { value: 'confirmed', label: 'Đã xác nhận', color: 'info' },
    { value: 'processing', label: 'Đang xử lý', color: 'primary' },
    { value: 'shipped', label: 'Đã giao vận', color: 'secondary' },
    { value: 'delivered', label: 'Đã giao hàng', color: 'success' },
    { value: 'cancelled', label: 'Đã hủy', color: 'error' }
  ];

  // Fetch seller orders - Sử dụng API đã có sẵn
  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Chưa đăng nhập');
        return;
      }

      // Sử dụng API my-seller-orders thay vì seller/:sellerId
      const response = await axios.get(
        'http://localhost:2000/eco-market/orders/my-seller-orders',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      console.log('Orders response:', response.data); // Debug
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
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
      const result = await updateOrder(
        selectedOrder._id,
        updateData.reason,
        updateData.status
      );

      if (result.status && result.status !== 200) {
        setError(result.message);
        return;
      }

      // Refresh orders list
      await fetchSellerOrders();
      setUpdateDialog(false);
      setSelectedOrder(null);
      setUpdateData({ status: '', reason: '' });
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật đơn hàng');
    }
  };

  const getStatusChip = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return (
      <Chip
        label={statusOption?.label || status}
        color={statusOption?.color || 'default'}
        size="small"
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý đơn hàng của tôi
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" textAlign="center" color="text.secondary">
              Chưa có đơn hàng nào
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="h6">
                        Đơn hàng #{order._id.slice(-8)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ngày đặt: {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusChip(order.status)}
                      <IconButton
                        onClick={() => handleUpdateOrder(order)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleExpandOrder(order._id)}
                        size="small"
                      >
                        {expandedOrders[order._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Khách hàng:</strong> {
                          order.shippingAddress?.fullName || 
                          order.buyerId?.fullName || 
                          'N/A'
                        }
                      </Typography>
                      <Typography variant="body2">
                        <strong>SDT:</strong> {
                          order.shippingAddress?.phoneNumber || 
                          order.buyerId?.phoneNumber || 
                          'N/A'
                        }
                      </Typography>
                      <Typography variant="body2">
                        <strong>Email:</strong> {order.buyerId?.email || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Tổng tiền:</strong> {formatCurrency(order.totalAmount)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Phương thức vận chuyển:</strong> {order.shippingMethod}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Collapse in={expandedOrders[order._id]}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Chi tiết sản phẩm
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Sản phẩm</TableCell>
                            <TableCell align="center">Số lượng</TableCell>
                            <TableCell align="right">Đơn giá</TableCell>
                            <TableCell align="right">Thành tiền</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.products?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography variant="body2">
                                  {item.productId?.name || 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">{item.quantity}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(item.productId?.price || 0)}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency((item.productId?.price || 0) * item.quantity)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {order.shippingAddress && (
                      <Box mt={2}>
                        <Typography variant="h6" gutterBottom>
                          Địa chỉ giao hàng
                        </Typography>
                        <Typography variant="body2">
                          <strong>Người nhận:</strong> {order.shippingAddress.fullName || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>SĐT:</strong> {order.shippingAddress.phoneNumber || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Địa chỉ:</strong> {[
                            order.shippingAddress.specificAddress,
                            order.shippingAddress.ward,
                            order.shippingAddress.district,
                            order.shippingAddress.province
                          ].filter(Boolean).join(', ') || 'N/A'}
                        </Typography>
                      </Box>
                    )}

                    {order.reason && (
                      <Box mt={2}>
                        <Typography variant="h6" gutterBottom>
                          Ghi chú
                        </Typography>
                        <Typography variant="body2">{order.reason}</Typography>
                      </Box>
                    )}
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Update Order Dialog */}
      <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cập nhật đơn hàng</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Trạng thái"
            value={updateData.status}
            onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
            margin="normal"
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ghi chú"
            value={updateData.reason}
            onChange={(e) => setUpdateData(prev => ({ ...prev, reason: e.target.value }))}
            margin="normal"
            placeholder="Nhập ghi chú cho đơn hàng..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveUpdate} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SellerOrders;