import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import './OrderSuccess.css';

/**
 * Component hiển thị thông báo đặt hàng thành công
 * @param {string} orderNumber - Số đơn hàng
 */
const OrderSuccess = ({ orderNumber }) => {
  return (
    <Paper elevation={3} className="order-success-container">
      <CheckCircleIcon className="success-icon" />
      
      <Typography variant="h5" className="success-title">
        Đặt hàng thành công!
      </Typography>
      
      <Typography variant="body1" className="success-message">
        Cảm ơn bạn đã đặt hàng. Chúng tôi đã gửi thông tin xác nhận đến email của bạn.
      </Typography>
      
      {orderNumber && (
        <Typography variant="body1" className="order-number">
          Mã đơn hàng: <strong>#{orderNumber}</strong>
        </Typography>
      )}
      
      <Box className="action-buttons">
        <Button 
          variant="contained" 
          component={Link} 
          to="/eco-market/customer/orders"
          className="view-orders-button"
        >
          Xem đơn hàng của tôi
        </Button>
        
        <Button 
          variant="outlined" 
          component={Link} 
          to="/eco-market/home"
          className="continue-shopping-button"
        >
          Tiếp tục mua sắm
        </Button>
      </Box>
    </Paper>
  );
};

export default OrderSuccess; 