import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "../types/api.types";

interface CartState {
  items: CartItem[];
}

interface CartActions {
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
}

interface CartGetters {
  getItemCount: () => number;
  getTotal: (products: Product[]) => number;
  getItem: (productId: string) => CartItem | undefined;
}

type CartStore = CartState & CartActions & CartGetters;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],

      // Actions
      addItem: (productId: string, quantity: number = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => 
              (typeof item.productId === 'string' ? item.productId : item.productId._id) === productId
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                (typeof item.productId === 'string' ? item.productId : item.productId._id) === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { productId, quantity }],
          };
        }),

      removeItem: (productId: string) =>
        set((state) => ({
          items: state.items.filter(
            (item) => 
              (typeof item.productId === 'string' ? item.productId : item.productId._id) !== productId
          ),
        })),

      updateQuantity: (productId: string, quantity: number) =>
        set((state) => ({
          items: state.items.map((item) =>
            (typeof item.productId === 'string' ? item.productId : item.productId._id) === productId
              ? { ...item, quantity }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      setCart: (items: CartItem[]) => set({ items }),

      // Getters
      getItemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotal: (products: Product[]) =>
        get().items.reduce((total, item) => {
          const productId = typeof item.productId === 'string' ? item.productId : item.productId._id;
          const product = products.find((p) => p._id === productId);
          return total + (product?.price || 0) * item.quantity;
        }, 0),

      getItem: (productId: string) =>
        get().items.find(
          (item) => 
            (typeof item.productId === 'string' ? item.productId : item.productId._id) === productId
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);
