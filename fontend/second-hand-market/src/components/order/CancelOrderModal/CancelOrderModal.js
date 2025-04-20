import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField, Box, Typography } from '@mui/material';
import './CancelOrderModal.css';

/**
 * Modal hủy đơn hàng, cho phép chọn lý do hủy
 * 
 * @param {boolean} open - Trạng thái hiển thị modal
 * @param {function} onClose - Hàm xử lý khi đóng modal
 * @param {function} onSubmit - Hàm xử lý khi gửi form
 */
const CancelOrderModal = ({ open, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  // Danh sách lý do hủy đơn hàng
  const cancelReasons = [
    'Tôi muốn thay đổi địa chỉ giao hàng',
    'Tôi muốn thay đổi phương thức thanh toán',
    'Tôi đã tìm thấy giá tốt hơn ở nơi khác',
    'Tôi đã đặt nhầm sản phẩm',
    'Tôi không còn nhu cầu mua sản phẩm này nữa',
    'Khác'
  ];

  // Xử lý thay đổi lý do
  const handleReasonChange = (event) => {
    setReason(event.target.value);
    setError('');
  };

  // Xử lý thay đổi lý do tùy chỉnh
  const handleCustomReasonChange = (event) => {
    setCustomReason(event.target.value);
    setError('');
  };

  // Xử lý đóng modal và reset form
  const handleClose = () => {
    setReason('');
    setCustomReason('');
    setError('');
    onClose();
  };

  // Xử lý gửi form
  const handleSubmit = () => {
    const selectedReason = reason === 'Khác' ? customReason : reason;
    
    if (!selectedReason) {
      setError('Vui lòng chọn lý do hủy đơn hàng');
      return;
    }

    if (reason === 'Khác' && (!customReason || customReason.trim() === '')) {
      setError('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }

    onSubmit(selectedReason);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="dialog-title">Hủy đơn hàng</DialogTitle>
      
      <DialogContent>
        <Box className="cancel-form">
          <FormControl component="fieldset" className="reason-form-control">
            <FormLabel component="legend" className="reason-form-label">
              Vui lòng chọn lý do hủy đơn hàng
            </FormLabel>
            
            <RadioGroup
              aria-label="cancel-reason"
              name="cancel-reason"
              value={reason}
              onChange={handleReasonChange}
              className="reason-radio-group"
            >
              {cancelReasons.map((cancelReason) => (
                <FormControlLabel
                  key={cancelReason}
                  value={cancelReason}
                  control={<Radio color="primary" />}
                  label={cancelReason}
                  className="reason-option"
                />
              ))}
            </RadioGroup>
            
            {reason === 'Khác' && (
              <TextField
                label="Nhập lý do khác"
                multiline
                rows={3}
                value={customReason}
                onChange={handleCustomReasonChange}
                fullWidth
                variant="outlined"
                className="custom-reason-field"
                placeholder="Vui lòng nhập lý do hủy đơn hàng của bạn"
              />
            )}
            
            {error && (
              <Typography color="error" className="error-message">
                {error}
              </Typography>
            )}
            
            <Typography variant="body2" color="textSecondary" className="cancel-note">
              Lưu ý: Đơn hàng sau khi hủy sẽ không thể khôi phục. Vui lòng xác nhận trước khi tiếp tục.
            </Typography>
          </FormControl>
        </Box>
      </DialogContent>
      
      <DialogActions className="dialog-actions">
        <Button onClick={handleClose} className="cancel-button">
          Hủy bỏ
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="error" 
          variant="contained"
          className="submit-button"
        >
          Xác nhận hủy đơn
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelOrderModal; 