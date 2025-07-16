import { SHIPPING_FEES, PLATFORM_FEE_RATE, MAX_COIN_DISCOUNT_RATE, SHIPPING_METHODS, PAYMENT_METHODS } from '../constants/checkout';

/**
 * Formats address object to display string
 * @param {Object} address - Address object
 * @returns {string} Formatted address string
 */
export const formatAddress = (address) => {
  if (!address) return "";
  const { specificAddress, ward, district, province } = address;
  return [specificAddress, ward, district, province]
    .filter(Boolean)
    .join(", ");
};

/**
 * Formats price to Vietnamese currency format
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return price.toLocaleString("vi-VN");
};

/**
 * Calculates total amount of products
 * @param {Array} products - Array of products with price and quantity
 * @returns {number} Total amount
 */
export const calculateTotalAmount = (products) => {
  return products.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

/**
 * Calculates shipping fee based on method and address
 * @param {string} method - Shipping method
 * @param {Object} address - Shipping address
 * @returns {number} Shipping fee
 */
export const calculateShippingFee = (method, address) => {
  if (method === SHIPPING_METHODS.DIRECT) return 0;
  
  // In real app, use GHN API with address details
  return SHIPPING_FEES[method] || SHIPPING_FEES[SHIPPING_METHODS.EXPRESS];
};

/**
 * Calculates platform fee based on payment type and total amount
 * @param {string} paymentType - Payment method type
 * @param {number} totalAmount - Total amount
 * @returns {number} Platform fee
 */
export const calculatePlatformFee = (paymentType, totalAmount) => {
  const platformFeeRate = paymentType === PAYMENT_METHODS.DIRECT ? 0 : PLATFORM_FEE_RATE;
  return totalAmount * platformFeeRate;
};

/**
 * Calculates coin discount amount
 * @param {boolean} useCoins - Whether to use coins
 * @param {number} balance - Available coin balance
 * @param {number} totalAmount - Total order amount
 * @returns {number} Coin discount amount
 */
export const calculateCoinDiscount = (useCoins, balance, totalAmount) => {
  if (!useCoins || balance <= 0) return 0;
  const maxDiscount = totalAmount * MAX_COIN_DISCOUNT_RATE;
  return Math.min(balance, maxDiscount);
};

/**
 * Calculates final amount after discounts
 * @param {number} totalAmount - Original total amount
 * @param {number} voucherDiscount - Voucher discount amount
 * @param {number} coinDiscount - Coin discount amount
 * @returns {number} Final amount after discounts
 */
export const calculateFinalAmount = (totalAmount, voucherDiscount = 0, coinDiscount = 0) => {
  return Math.max(0, totalAmount - voucherDiscount - coinDiscount);
};

/**
 * Calculates payment amounts for different payment methods
 * @param {string} paymentType - Payment method type
 * @param {number} totalAmount - Total amount
 * @param {number} shippingFee - Shipping fee
 * @param {number} platformFee - Platform fee
 * @returns {Object} Payment amounts { depositAmount, codAmount }
 */
export const calculatePaymentAmounts = (paymentType, totalAmount, shippingFee, platformFee = 0) => {
  switch (paymentType) {
    case PAYMENT_METHODS.DIRECT:
      return {
        depositAmount: 0,
        codAmount: 0
      };
    case PAYMENT_METHODS.PARTIAL_ESCROW:
      return {
        depositAmount: shippingFee,
        codAmount: totalAmount
      };
    case PAYMENT_METHODS.FULL_ESCROW:
      return {
        depositAmount: totalAmount + shippingFee + platformFee,
        codAmount: 0
      };
    default:
      return {
        depositAmount: 0,
        codAmount: totalAmount
      };
  }
};


export const groupProductsBySeller = (products) => {
  const uniqueSellerIds = Array.from(
    new Set(
      products.map((product) => product.seller._id).filter(Boolean)
    )
  );

  return uniqueSellerIds
    .map((sellerId) => {
      const sellerProducts = products
        .filter((product) => product.seller._id === sellerId)
        .map((product) => ({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          image: product.image,
          _id: product._id,
          estimatedWeight: product.estimatedWeight,
        }))
        .filter((product) => product.quantity > 0);

      return {
        sellerId,
        products: sellerProducts,
      };
    })
    .filter((order) => order.products.length > 0);
};

/**
 * Validates address form data
 * @param {Object} address - Address object to validate
 * @returns {boolean} Whether address is valid
 */
export const validateAddress = (address) => {
  return !!(
    address.fullName &&
    address.phoneNumber &&
    address.specificAddress &&
    address.ward &&
    address.district &&
    address.province
  );
};

/**
 * Filters location data based on search term
 * @param {Array} locations - Array of location objects
 * @param {string} searchTerm - Search term
 * @param {string} nameField - Field name to search in
 * @returns {Array} Filtered locations
 */
export const filterLocations = (locations, searchTerm, nameField) => {
  if (!searchTerm) return locations;
  
  return locations.filter((location) =>
    (location[nameField] || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}; 

/**
 * Safely render an object property or the object itself if it's a string
 * Prevents "Objects are not valid as a React child" error
 * @param {any} data - The data to render (could be object or string)
 * @param {string} property - The property to extract if data is object (default: 'name')
 * @returns {string} Safe string to render
 */
export const safeRender = (data, property = 'name') => {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (typeof data === 'object' && data[property]) return data[property];
  return '';
};

/**
 * Safe render for category (common use case)
 * @param {any} category - Category data (object with _id, name or just string)
 * @returns {string} Category name
 */
export const renderCategory = (category) => safeRender(category, 'name');

/**
 * Safe render for seller name
 * @param {any} seller - Seller data (object or string)
 * @returns {string} Seller name
 */
export const renderSellerName = (seller) => safeRender(seller, 'fullName') || safeRender(seller, 'name');

/**
 * Calculate final price after all discounts for a product
 * @param {object} product - Product data
 * @returns {object} Price calculation details
 */
export const calculateProductDiscount = (product) => {
  const originalPrice = product.originalPrice || product.price;
  const currentPrice = product.price;
  const hasDiscount = originalPrice > currentPrice;
  const discountAmount = hasDiscount ? originalPrice - currentPrice : 0;
  const discountPercentage = hasDiscount ? Math.round((discountAmount / originalPrice) * 100) : 0;
  
  // Handle additional discounts
  const additionalDiscount = product.additionalDiscount || 0;
  const userDiscount = product.userDiscount || 0;
  const isPercentageDiscount = product.discountType === 'percentage';
  
  let finalPrice = currentPrice;
  
  // Apply additional discount
  if (additionalDiscount > 0) {
    if (isPercentageDiscount) {
      finalPrice = currentPrice * (1 - additionalDiscount / 100);
    } else {
      finalPrice = Math.max(0, currentPrice - additionalDiscount);
    }
  }
  
  // Apply user-specific discount
  if (userDiscount > 0) {
    finalPrice = Math.max(0, finalPrice - userDiscount);
  }
  
  const totalDiscount = originalPrice - finalPrice;
  const totalDiscountPercentage = originalPrice > 0 ? Math.round((totalDiscount / originalPrice) * 100) : 0;
  const hasAnyDiscount = totalDiscount > 0;
  
  return {
    originalPrice,
    currentPrice,
    finalPrice,
    discountAmount,
    discountPercentage,
    additionalDiscount,
    userDiscount,
    totalDiscount,
    totalDiscountPercentage,
    hasDiscount,
    hasAnyDiscount,
    isPercentageDiscount
  };
};

/**
 * Calculate total price for products with discounts
 * @param {array} products - Array of products
 * @returns {object} Total calculation
 */
export const calculateTotalWithDiscounts = (products) => {
  let originalTotal = 0;
  let finalTotal = 0;
  let totalSavings = 0;
  
  products.forEach(product => {
    const calculation = calculateProductDiscount(product);
    originalTotal += calculation.originalPrice * product.quantity;
    finalTotal += calculation.finalPrice * product.quantity;
    totalSavings += calculation.totalDiscount * product.quantity;
  });
  
  return {
    originalTotal,
    finalTotal,
    totalSavings,
    totalDiscountPercentage: originalTotal > 0 ? Math.round((totalSavings / originalTotal) * 100) : 0
  };
}; 