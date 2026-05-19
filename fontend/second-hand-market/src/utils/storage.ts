/**
 * Utility functions for localStorage management with TypeScript
 */

import { Account, CartItem } from "../types/api.types";

const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  CART: "cart",
} as const;

export const storage = {
  // Token management
  getToken: (): string | null => localStorage.getItem(STORAGE_KEYS.TOKEN),
  
  setToken: (token: string): void => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  
  removeToken: (): void => localStorage.removeItem(STORAGE_KEYS.TOKEN),

  // User management
  getUser: (): Account | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  
  setUser: (user: Account): void =>
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  
  removeUser: (): void => localStorage.removeItem(STORAGE_KEYS.USER),

  // Cart management
  getCart: (): CartItem[] => {
    const cartStr = localStorage.getItem(STORAGE_KEYS.CART);
    try {
      return cartStr ? JSON.parse(cartStr) : [];
    } catch {
      return [];
    }
  },
  
  setCart: (cart: CartItem[]): void =>
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)),
  
  removeCart: (): void => localStorage.removeItem(STORAGE_KEYS.CART),

  // Clear all
  clearAll: (): void => localStorage.clear(),
};

export default storage;
