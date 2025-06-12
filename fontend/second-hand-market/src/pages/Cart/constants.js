// Cart page constants
export const CART_CONSTANTS = {
  ROUTES: {
    HOME: '/eco-market/home',
    LOGIN: '/login',
    CHECKOUT: '/eco-market/checkout'
  },

  MESSAGES: {
    LOGIN_REQUIRED: 'Vui lòng đăng nhập để tiếp tục.',
    EMPTY_CART: 'Giỏ hàng của bạn đang trống',
    CART_EMPTY_SUGGESTION: 'Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm'
  },

  STORAGE_KEYS: {
    TOKEN: 'token'
  },

  STYLES: {
    ANIMATION_DURATION: '0.3s',
    TRANSFORM_SCALE: '0.95',
    HOVER_TRANSFORM: 'translateY(-3px)',
    BUTTON_PADDING: '20px'
  }
};

export const TABLE_COLUMNS = {
  CHECKBOX: { width: '5%' },
  PRODUCT: { width: '50%' },
  PRICE: { width: '15%' },
  QUANTITY: { width: '10%' },
  TOTAL: { width: '15%' },
  ACTION: { width: '5%' }
}; 