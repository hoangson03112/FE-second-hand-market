export interface HeaderNotification {
  id: number;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Account {
  _id?: string;
  fullName?: string;
  email?: string;
  avatar?: {
    url: string;
  };
  role?: "buyer" | "seller" | "admin";
  cart?: any[];
}

export interface Category {
  _id: string;
  name: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  _id: string;
  name: string;
  status?: string;
}

export interface HeaderProps {}

export interface NotificationMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  account: Account;
  notifications: HeaderNotification[];
  onClose: () => void;
  onNotificationClick: (id: number) => void;
  timeAgo: (date: Date) => string;
}

export interface UserDropdownProps {
  account: Account;
  showDropdown: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onToggle: () => void;
  onLogout: () => void;
}

export interface MobileMenuProps {
  show: boolean;
  account: Account;
  categories: Category[];
  onSearch: (query: string) => void;
  onClose: () => void;
  onLogout: () => void;
}
