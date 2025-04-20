import React from 'react';
import { Button } from '@mui/material';
import './Button.css';

/**
 * Component nút hành động đa năng, có thể tùy chỉnh màu sắc và biểu tượng
 * @param {string} variant - Kiểu nút (contained, outlined, text)
 * @param {string} color - Màu nút (primary, secondary, danger, success)
 * @param {node} icon - Biểu tượng đi kèm
 * @param {boolean} iconPosition - Vị trí biểu tượng (left, right)
 * @param {function} onClick - Hàm xử lý khi click
 * @param {string} label - Nhãn hiển thị
 * @param {object} props - Các thuộc tính khác
 */
const ActionButton = ({
  variant = 'contained',
  color = 'primary',
  icon,
  iconPosition = 'left',
  onClick,
  label,
  className = '',
  ...props
}) => {
  // Xác định className dựa trên color
  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'primary-button';
      case 'secondary':
        return 'secondary-button';
      case 'danger':
        return 'danger-button';
      case 'success':
        return 'success-button';
      default:
        return '';
    }
  };

  const buttonClass = `action-button ${getColorClass()} ${className}`;

  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={buttonClass}
      startIcon={iconPosition === 'left' ? icon : null}
      endIcon={iconPosition === 'right' ? icon : null}
      {...props}
    >
      {label}
    </Button>
  );
};

export default ActionButton;
