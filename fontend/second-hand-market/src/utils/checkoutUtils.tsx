import {
  SHIPPING_FEES,
  PLATFORM_FEE_RATE,
  SHIPPING_METHODS,
  PAYMENT_METHODS,
} from "../constants/checkout";

interface Address {
  fullName?: string;
  phoneNumber?: string;
  specificAddress?: string;
  ward?: string;
  district?: string;
  province?: string;
}

interface Product {
  _id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  estimatedWeight?: any;
  seller: {
    _id: string;
    fullName?: string;
    name?: string;
  };
}

interface Location {
  [key: string]: any;
}

/**
 * Formats address object to display string
 * @param {Object} address - Address object
 * @returns {string} Formatted address string
 */
export const formatAddress = (address: Address | null | undefined): string => {
  if (!address) return "";
  const { specificAddress, ward, district, province } = address;
  return [specificAddress, ward, district, province].filter(Boolean).join(", ");
};

/**
 * Formats price to Vietnamese currency format
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString("vi-VN");
};

/**
 * Calculates total amount of products
 * @param {Array} products - Array of products with price and quantity
 * @returns {number} Total amount
 */
export const calculateTotalAmount = (products: Product[]): number => {
  return products.reduce((total: number, item: Product) => {
    return total + item.price * item.quantity;
  }, 0);
};

/**
 * Calculates shipping fee based on method and address
 * @param {string} method - Shipping method
 * @param {Object} address - Shipping address
 * @returns {number} Shipping fee
 */
export const calculateShippingFee = (method: string, address: Address): number => {
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
export const calculatePlatformFee = (paymentType: string, totalAmount: number): number => {
  const platformFeeRate =
    paymentType === PAYMENT_METHODS.DIRECT ? 0 : PLATFORM_FEE_RATE;
  return totalAmount * platformFeeRate;
};

/**
 * Calculates final amount
 * @param {number} totalAmount - Original total amount
 * @returns {number} Final amount
 */
export const calculateFinalAmount = (totalAmount: number): number => {
  return Math.max(0, totalAmount);
};

/**
 * Calculates payment amounts for different payment methods
 * @param {string} paymentType - Payment method type
 * @param {number} totalAmount - Total amount
 * @param {number} shippingFee - Shipping fee
 * @param {number} platformFee - Platform fee
 * @returns {Object} Payment amounts { depositAmount, codAmount }
 */
export const calculatePaymentAmounts = (
  paymentType: string,
  totalAmount: number,
  shippingFee: number,
  platformFee: number = 0
): { depositAmount: number; codAmount: number } => {
  switch (paymentType) {
    case PAYMENT_METHODS.DIRECT:
      return {
        depositAmount: 0,
        codAmount: 0,
      };
    case PAYMENT_METHODS.PARTIAL_ESCROW:
      return {
        depositAmount: shippingFee,
        codAmount: totalAmount,
      };
    case PAYMENT_METHODS.FULL_ESCROW:
      return {
        depositAmount: totalAmount + shippingFee + platformFee,
        codAmount: 0,
      };
    default:
      return {
        depositAmount: 0,
        codAmount: totalAmount,
      };
  }
};

export const groupProductsBySeller = (products: Product[]): Array<{
  sellerId: string;
  products: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    _id: string;
    estimatedWeight?: any;
  }>;
}> => {
  const uniqueSellerIds = Array.from(
    new Set(products.map((product) => product.seller._id).filter(Boolean))
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
export const validateAddress = (address: Address | null | undefined): boolean => {
  return !!(
    address &&
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
export const filterLocations = (
  locations: Location[],
  searchTerm: string,
  nameField: string
): Location[] => {
  if (!searchTerm) return locations;

  return locations.filter((location) =>
    (location[nameField] || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
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
export const safeRender = (data: any, property: string = "name"): string => {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object" && data[property]) return data[property];
  return "";
};

/**
 * Safe render for category (common use case)
 * @param {any} category - Category data (object with _id, name or just string)
 * @returns {string} Category name
 */
export const renderCategory = (category: any): string => safeRender(category, "name");

/**
 * Safe render for seller name
 * @param {any} seller - Seller data (object or string)
 * @returns {string} Seller name
 */
export const renderSellerName = (seller: any): string =>
  safeRender(seller, "fullName") || safeRender(seller, "name");

/**
 * Calculate total price for products (without discount logic)
 * @param {array} products - Array of products
 * @returns {object} Total calculation
 */
export const calculateTotalWithDiscounts = (products: Product[]): {
  originalTotal: number;
  finalTotal: number;
  totalSavings: number;
  totalDiscountPercentage: number;
} => {
  let total = 0;

  products.forEach((product) => {
    total += product.price * product.quantity;
  });

  return {
    originalTotal: total,
    finalTotal: total,
    totalSavings: 0,
    totalDiscountPercentage: 0,
  };
};
