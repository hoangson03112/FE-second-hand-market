/**
 * Các hàm tiện ích
 */

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date, format = 'full') => {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('vi-VN');
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Format 'full' (default)
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getTimeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000; // years
  if (interval > 1) {
    return Math.floor(interval) + ' năm trước';
  }
  
  interval = seconds / 2592000; // months
  if (interval > 1) {
    return Math.floor(interval) + ' tháng trước';
  }
  
  interval = seconds / 86400; // days
  if (interval > 1) {
    return Math.floor(interval) + ' ngày trước';
  }
  
  interval = seconds / 3600; // hours
  if (interval > 1) {
    return Math.floor(interval) + ' giờ trước';
  }
  
  interval = seconds / 60; // minutes
  if (interval > 1) {
    return Math.floor(interval) + ' phút trước';
  }
  
  return Math.floor(seconds) + ' giây trước';
};

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateAvatar = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export const getStatusColor = (status) => {
  const statusColors = {
    'pending': '#FFC107', // Yellow
    'processing': '#2196F3', // Blue
    'shipped': '#FF9800', // Orange
    'delivered': '#4CAF50', // Green
    'cancelled': '#F44336', // Red
    'refunded': '#9C27B0', // Purple
    'completed': '#009688', // Teal
  };
  
  return statusColors[status] || '#757575'; // Default gray
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}; 