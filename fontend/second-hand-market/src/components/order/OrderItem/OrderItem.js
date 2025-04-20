import React, { useState } from 'react';
import { Card, Box, Typography, Chip, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { formatCurrency, formatDate, getStatusColor } from '../../../utils/helpers';
import CancelOrderModal from '../CancelOrderModal/CancelOrderModal';
import './OrderItem.css';

/**
 * Component hiển thị một đơn hàng trong danh sách đơn hàng
 * 
 * @param {Object} order - Thông tin đơn hàng
 * @param {function} onCancelOrder - Hàm xử lý khi hủy đơn hàng
 */
const OrderItem = ({ order, onCancelOrder }) => {
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  // Lấy màu trạng thái
  const statusColor = getStatusColor(order.status);

  // Định dạng trạng thái
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Chờ xác nhận',
      'processing': 'Đang xử lý',
      'shipped': 'Đang giao hàng',
      'delivered': 'Đã giao hàng',
      'cancelled': 'Đã hủy',
      'completed': 'Hoàn thành'
    };
    return statusMap[status] || status;
  };

  // Xử lý đóng modal hủy đơn
  const handleCloseCancelModal = () => {
    setOpenCancelModal(false);
  };

  // Xử lý mở modal hủy đơn
  const handleOpenCancelModal = () => {
    setOpenCancelModal(true);
  };

  // Xử lý đóng modal chi tiết
  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  // Xử lý mở modal chi tiết
  const handleOpenDetailModal = () => {
    setOpenDetailModal(true);
  };

  // Xử lý hủy đơn hàng
  const handleCancelOrder = (reason) => {
    onCancelOrder(order._id, reason);
    setOpenCancelModal(false);
  };

  // Tính tổng sản phẩm
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Card className="order-item-card">
        <Box className="order-item-header">
          <Typography variant="subtitle1" className="order-id">
            Mã đơn hàng: #{order.orderNumber || order._id.substring(0, 8)}
          </Typography>
          <Chip 
            label={getStatusText(order.status)} 
            style={{ backgroundColor: statusColor, color: 'white' }}
            className="status-chip"
          />
        </Box>
        
        <Divider />
        
        <Box className="order-item-content">
          <Box className="order-item-info">
            <Typography variant="body1" className="info-label">
              Ngày đặt hàng:
            </Typography>
            <Typography variant="body1" className="info-value">
              {formatDate(order.createdAt, 'long')}
            </Typography>
          </Box>
          
          <Box className="order-item-info">
            <Typography variant="body1" className="info-label">
              Số lượng sản phẩm:
            </Typography>
            <Typography variant="body1" className="info-value">
              {totalItems} sản phẩm
            </Typography>
          </Box>
          
          <Box className="order-item-info">
            <Typography variant="body1" className="info-label">
              Tổng thanh toán:
            </Typography>
            <Typography variant="h6" color="primary" className="total-amount">
              {formatCurrency(order.totalAmount)}
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <Box className="order-item-actions">
          <Button 
            variant="outlined"
            onClick={handleOpenDetailModal}
            className="action-button"
          >
            Xem chi tiết
          </Button>
          
          {order.status === 'pending' && (
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleOpenCancelModal}
              className="action-button"
            >
              Hủy đơn hàng
            </Button>
          )}
        </Box>
      </Card>
      
      {/* Modal xem chi tiết */}
      <Dialog open={openDetailModal} onClose={handleCloseDetailModal} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết đơn hàng #{order.orderNumber || order._id.substring(0, 8)}</DialogTitle>
        <DialogContent>
          <Box className="order-detail-container">
            <Box className="order-detail-section">
              <Typography variant="subtitle1" gutterBottom>Thông tin giao hàng</Typography>
              <Typography variant="body2">Người nhận: {order.shippingAddress.fullName}</Typography>
              <Typography variant="body2">Số điện thoại: {order.shippingAddress.phone}</Typography>
              <Typography variant="body2">Địa chỉ: {order.shippingAddress.addressLine}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}</Typography>
            </Box>
            
            <Divider className="detail-divider" />
            
            <Box className="order-detail-section">
              <Typography variant="subtitle1" gutterBottom>Sản phẩm</Typography>
              {order.items.map((item, index) => (
                <Box key={index} className="order-product-item">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="product-thumbnail"
                  />
                  <Box className="product-details">
                    <Typography variant="body1">{item.product.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Số lượng: {item.quantity} x {formatCurrency(item.price)}
                    </Typography>
                  </Box>
                  <Typography variant="body1" className="product-subtotal">
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Divider className="detail-divider" />
            
            <Box className="order-detail-section order-summary">
              <Box className="summary-row">
                <Typography variant="body1">Tổng tiền sản phẩm:</Typography>
                <Typography variant="body1">{formatCurrency(order.subtotal)}</Typography>
              </Box>
              <Box className="summary-row">
                <Typography variant="body1">Phí vận chuyển:</Typography>
                <Typography variant="body1">{formatCurrency(order.shippingFee)}</Typography>
              </Box>
              {order.discount > 0 && (
                <Box className="summary-row">
                  <Typography variant="body1">Giảm giá:</Typography>
                  <Typography variant="body1" color="error">-{formatCurrency(order.discount)}</Typography>
                </Box>
              )}
              <Box className="summary-row total">
                <Typography variant="h6">Tổng thanh toán:</Typography>
                <Typography variant="h6" color="primary">{formatCurrency(order.totalAmount)}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailModal}>Đóng</Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal hủy đơn hàng */}
      <CancelOrderModal 
        open={openCancelModal} 
        onClose={handleCloseCancelModal} 
        onSubmit={handleCancelOrder}
      />
    </>
  );
};

export default OrderItem; 