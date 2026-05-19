// Button Types
export interface ButtonBackProps {
  url: string;
}

// Category Card Types
export interface CategoryCardProps {
  category: any;
  isLoading?: boolean;
}

// Input Types
export interface SearchBarProps {
  onSearch: (query: string) => void;
}

// Notification Types
export interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  severity?: string;
  autoHideDuration?: number;
  onClose: () => void;
  title?: string;
  action?: React.ReactNode;
}

// Product Card Types
export interface ProductCardProps {
  product: any;
  isLoading?: boolean;
}

// Toast Types
export interface ToastNotificationProps {
  showToast: boolean;
  setShowToast: (show: boolean) => void;
  message: string;
}
