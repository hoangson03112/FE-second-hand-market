/**
 * Central export file for all utilities
 * Note: Export with specific names to avoid conflicts
 */

// Helpers (formatPrice, debounce, formatDate, formatCurrency, etc.)
export * from "./helpers";

// Validation utilities
export * from "./validationUtils";

// Storage utility
export { default as storage } from "./storage";

// Note: function.tsx, formatAddress.tsx, and checkoutUtils.tsx have duplicate exports
// They are available through direct imports if needed:
// import { formatAddress } from './utils/formatAddress';
// import { formatPrice } from './utils/function';
// import { debounce } from './utils/checkoutUtils';
// import { useCartFunctions } from './utils/function';
