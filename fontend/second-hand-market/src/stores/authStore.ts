import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Account } from "../types/api.types";

interface AuthState {
  user: Account | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: Account, token: string) => void;
  setUser: (user: Account) => void;
  logout: () => void;
  updateUser: (updates: Partial<Account>) => void;
}

interface AuthGetters {
  getToken: () => string | null;
  getUser: () => Account | null;
  isAdmin: () => boolean;
  isSeller: () => boolean;
  isBuyer: () => boolean;
}

type AuthStore = AuthState & AuthActions & AuthGetters;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user: Account, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      setUser: (user: Account) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      updateUser: (updates: Partial<Account>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Getters
      getToken: () => get().token,
      getUser: () => get().user,
      isAdmin: () => get().user?.role === "admin" || get().user?.role === "staff",
      isSeller: () => get().user?.role === "seller",
      isBuyer: () => get().user?.role === "buyer",
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
