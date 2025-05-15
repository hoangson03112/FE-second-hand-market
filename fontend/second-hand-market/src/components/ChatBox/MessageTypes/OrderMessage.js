import React from 'react';
import { Box, Typography, Card, CardContent, Button, Chip } from '@mui/material';
import { Assignment, LocalShipping } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
    case 'chờ xử lý':
      return 'warning';
    case 'processing':
    case 'đang xử lý':
      return 'info';
    case 'shipped':
    case 'đang vận chuyển':
      return 'primary';
    case 'delivered':
    case 'đã giao hàng':
      return 'success';
    case 'cancelled':
    case 'đã hủy':
      return 'error';
    default:
      return 'default';
  }
};

const OrderMessage = ({ order }) => {
  const navigate = useNavigate();
  
  const orderId = order._id || order.id;
  
  const handleViewOrder = () => {
    if (orderId) {
      navigate(`/eco-market/order/detail/${orderId}`);
    } else {
      console.error("Order ID not found in order object:", order);
    }
  };
  
  return (
    <Card 
      className="order-message-card" 
      variant="outlined"
      sx={{ 
        maxWidth: 320, 
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.08)'
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <LocalShipping color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Đơn hàng #{order.orderNumber || (orderId ? orderId.slice(-6).toUpperCase() : "N/A")}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Tổng đơn:
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {typeof order.total === 'number'
              ? order.total.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })
              : order.total}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Trạng thái:
          </Typography>
          <Chip 
            size="small" 
            label={order.status || 'Đang xử lý'} 
            color={getStatusColor(order.status)}
            variant="outlined"
          />
        </Box>
        
        <Button 
          variant="outlined" 
          size="small" 
          fullWidth 
          onClick={handleViewOrder}
          startIcon={<Assignment fontSize="small" />}
        >
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderMessage; 