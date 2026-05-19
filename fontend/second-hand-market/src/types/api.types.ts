// ==================== COMMON TYPES ====================

export interface File {
  url: string;
  publicId: string;
  folder?: string;
  width?: number;
  height?: number;
  format?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = any> {
  status: 'success' | 'error' | 'inactive' | 'login' | 'password';
  message?: string;
  data?: T;
  type?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==================== ACCOUNT & AUTH TYPES ====================

export type UserRole = 'buyer' | 'seller' | 'admin' | 'staff';
export type AccountStatus = 'active' | 'inactive';

export interface Account {
  _id: string;
  accountID?: string; // BE sometimes returns accountID
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role: UserRole;
  status: AccountStatus;
  lastLogin?: string;
  isPhoneVerified: boolean;
  cart: CartItem[];
  addresses: string[]; // Address IDs
  avatar?: File;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: 'success' | 'error' | 'inactive' | 'login' | 'password';
  message: string;
  token?: string;
  account?: Account;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  status: 'success' | 'error';
  message: string;
  accountID?: string;
  type?: string; // 'username' | 'email' | 'phoneNumber'
}

export interface VerifyRequest {
  userID: string;
  code: string;
}

export interface VerifyResponse {
  status: 'success' | 'error';
  message: string;
  token?: string;
  account?: Account;
}

export interface AuthResponse {
  status: 'success' | 'error';
  account?: Account;
  message?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ==================== PRODUCT TYPES ====================

export type ProductStatus = 
  | 'pending' 
  | 'active' 
  | 'inactive' 
  | 'sold' 
  | 'rejected' 
  | 'under_review' 
  | 'approved';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  stock: number;
  categoryId: string | Category;
  subcategoryId: string | SubCategory;
  price: number;
  description: string;
  images: File[];
  avatar: File | null;
  sellerId: string | Account;
  status: ProductStatus;
  aiModerationResult?: {
    approved: boolean | null;
    confidence: number;
    reasons: string[];
    reviewedAt: string | null;
    processingStarted: string | null;
  };
  estimatedWeight?: {
    value: number | null;
    confidence: number;
  };
  attributes: string[]; // Attribute IDs
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  categorySlug?: string;
  subCategorySlug?: string;
  sortBy?: 'newest' | 'oldest' | 'price-asc' | 'price-desc';
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  search?: string;
}

// ==================== CATEGORY TYPES ====================

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: File;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: string | Category;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== ORDER TYPES ====================

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'shipping' 
  | 'delivered' 
  | 'cancelled' 
  | 'refund'
  | 'refunded';

export type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | 'vnpay';
export type ShippingMethod = 'ship-cod' | 'express' | 'standard';

export interface CartItem {
  productId: string | Product;
  quantity: number;
}

export interface Order {
  _id: string;
  ghnOrderCode?: string;
  ghnSortCode?: string;
  expectedDeliveryTime?: string;
  transType?: string;
  shippingFee: number;
  insuranceFee: number;
  codFee: number;
  totalShippingFee: number;
  ghnTrackingUrl?: string;
  ghnStatus: string;
  sellerId: string | Account;
  buyerId: string | Account;
  products: CartItem[];
  reason?: string;
  totalAmount: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  statusPayment: boolean;
  shippingAddress: string | Address;
  deliveredAt?: string;
  status: OrderStatus;
  completedAt?: string;
  refundCompletedAt?: string;
  refundDecision: string;
  refundDecisionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== ADDRESS TYPES ====================

export interface Address {
  _id: string;
  userId: string | Account;
  fullName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
  provinceId?: number;
  districtId?: number;
  wardCode?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== SELLER TYPES ====================

export interface Seller {
  _id: string;
  accountId: string | Account;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessType: string;
  taxCode?: string;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface SellerReview {
  _id: string;
  sellerId: string | Seller;
  buyerId: string | Account;
  orderId: string | Order;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== BLOG TYPES ====================

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: File;
  authorId: string | Account;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== CHAT TYPES ====================

export interface Message {
  _id: string;
  conversationId: string | Conversation;
  senderId: string | Account;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: (string | Account)[];
  lastMessage?: string | Message;
  createdAt: string;
  updatedAt: string;
}

// ==================== REPORT TYPES ====================

export interface Report {
  _id: string;
  reporterId: string | Account;
  reportedId: string;
  reportedType: 'product' | 'user' | 'order';
  reason: string;
  description: string;
  images?: File[];
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
