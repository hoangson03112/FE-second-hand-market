import { z } from 'zod';

/**
 * Authentication Schemas
 */

// Register Schema
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(50, 'Tên đăng nhập không được quá 50 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới'),
  
  email: z
    .string()
    .email('Email không hợp lệ')
    .min(1, 'Email là bắt buộc'),
  
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được quá 100 ký tự'),
  
  confirmPassword: z.string(),
  
  phoneNumber: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  
  fullName: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

// Login Schema
export const loginSchema = z.object({
  username: z.string().min(1, 'Tên đăng nhập là bắt buộc'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

// Change Password Schema
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Mật khẩu cũ là bắt buộc'),
  newPassword: z
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu mới không được quá 100 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

// Verify Code Schema
export const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'Mã xác thực phải có 6 ký tự')
    .regex(/^[0-9]+$/, 'Mã xác thực chỉ chứa số'),
});

/**
 * Account Schemas
 */

// Update Account Info Schema
export const updateAccountSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự')
    .optional(),
  
  email: z
    .string()
    .email('Email không hợp lệ')
    .optional(),
  
  phoneNumber: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ')
    .optional(),
});

/**
 * Product Schemas
 */

// Product Schema
export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
    .max(200, 'Tên sản phẩm không được quá 200 ký tự'),
  
  description: z
    .string()
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .max(5000, 'Mô tả không được quá 5000 ký tự'),
  
  price: z
    .number()
    .positive('Giá phải lớn hơn 0')
    .max(999999999, 'Giá không được quá 999,999,999'),
  
  quantity: z
    .number()
    .int('Số lượng phải là số nguyên')
    .nonnegative('Số lượng không được âm'),
  
  categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
  
  subCategoryId: z.string().optional(),
  
  condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor'], {
    errorMap: () => ({ message: 'Tình trạng không hợp lệ' }),
  }).optional(),
  
  images: z
    .array(z.string().url('URL hình ảnh không hợp lệ'))
    .min(1, 'Phải có ít nhất 1 hình ảnh')
    .max(10, 'Tối đa 10 hình ảnh'),
});

/**
 * Address Schemas
 */

// Address Schema
export const addressSchema = z.object({
  recipientName: z
    .string()
    .min(2, 'Tên người nhận phải có ít nhất 2 ký tự')
    .max(100, 'Tên người nhận không được quá 100 ký tự'),
  
  phoneNumber: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  
  province: z.string().min(1, 'Tỉnh/Thành phố là bắt buộc'),
  
  district: z.string().min(1, 'Quận/Huyện là bắt buộc'),
  
  ward: z.string().min(1, 'Phường/Xã là bắt buộc'),
  
  detailAddress: z
    .string()
    .min(5, 'Địa chỉ chi tiết phải có ít nhất 5 ký tự')
    .max(500, 'Địa chỉ chi tiết không được quá 500 ký tự'),
  
  isDefault: z.boolean().optional(),
});

/**
 * Order Schemas
 */

// Checkout Schema
export const checkoutSchema = z.object({
  addressId: z.string().min(1, 'Vui lòng chọn địa chỉ giao hàng'),
  
  paymentMethod: z.enum(['cod', 'banking', 'momo', 'zalopay'], {
    errorMap: () => ({ message: 'Phương thức thanh toán không hợp lệ' }),
  }),
  
  note: z.string().max(500, 'Ghi chú không được quá 500 ký tự').optional(),
});

/**
 * Review Schemas
 */

// Review Schema
export const reviewSchema = z.object({
  rating: z
    .number()
    .int('Đánh giá phải là số nguyên')
    .min(1, 'Đánh giá tối thiểu là 1 sao')
    .max(5, 'Đánh giá tối đa là 5 sao'),
  
  comment: z
    .string()
    .min(10, 'Nhận xét phải có ít nhất 10 ký tự')
    .max(1000, 'Nhận xét không được quá 1000 ký tự'),
  
  images: z
    .array(z.string().url('URL hình ảnh không hợp lệ'))
    .max(5, 'Tối đa 5 hình ảnh')
    .optional(),
});

/**
 * Search Schemas
 */

// Search Schema
export const searchSchema = z.object({
  keyword: z.string().optional(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  minPrice: z.number().nonnegative('Giá tối thiểu phải >= 0').optional(),
  maxPrice: z.number().positive('Giá tối đa phải > 0').optional(),
  condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor']).optional(),
  sortBy: z.enum(['price', 'createdAt', 'views', 'rating']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
}).refine(
  (data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.minPrice <= data.maxPrice;
    }
    return true;
  },
  {
    message: 'Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa',
    path: ['maxPrice'],
  }
);
