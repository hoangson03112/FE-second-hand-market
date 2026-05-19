/**
 * Các hàm tiện ích
 */

// Format currency to Vietnamese Dong
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Alias for formatCurrency (for backward compatibility)
export const formatPrice = formatCurrency;

export const formatDate = (dateString: string | Date | number): string => {
  if (!dateString) return "Không xác định";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Không xác định";

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Không xác định";
  }
};

// Format notification time (relative time)
export const formatNotificationTime = (timestamp: string | Date | number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHr < 24) return `${diffHr} giờ trước`;
  if (diffDay === 1) return `Hôm qua lúc ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text: string | null | undefined, maxLength: number = 100): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getTimeSince = (date: string | Date | number): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  let interval = seconds / 31536000; // years
  if (interval > 1) {
    return Math.floor(interval) + " năm trước";
  }

  interval = seconds / 2592000; // months
  if (interval > 1) {
    return Math.floor(interval) + " tháng trước";
  }

  interval = seconds / 86400; // days
  if (interval > 1) {
    return Math.floor(interval) + " ngày trước";
  }

  interval = seconds / 3600; // hours
  if (interval > 1) {
    return Math.floor(interval) + " giờ trước";
  }

  interval = seconds / 60; // minutes
  if (interval > 1) {
    return Math.floor(interval) + " phút trước";
  }

  return Math.floor(seconds) + " giây trước";
};

export const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateAvatar = (name: string | null | undefined): string => {
  if (!name) return "";
  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'completed';

export const getStatusColor = (status: OrderStatus | string): string => {
  const statusColors: Record<string, string> = {
    pending: "#FFC107", // Yellow
    processing: "#2196F3", // Blue
    shipped: "#FF9800", // Orange
    delivered: "#4CAF50", // Green
    cancelled: "#F44336", // Red
    refunded: "#9C27B0", // Purple
    completed: "#009688", // Teal
  };

  return statusColors[status] || "#757575"; // Default gray
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
