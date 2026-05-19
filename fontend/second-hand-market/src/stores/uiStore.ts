import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface Modal {
  id: string;
  isOpen: boolean;
  data?: any;
}

interface UIState {
  sidebarOpen: boolean;
  modals: Record<string, Modal>;
  globalLoading: boolean;
  notifications: Notification[];
  theme: ThemeMode;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (id: string, data?: any) => void;
  closeModal: (id: string) => void;
  setGlobalLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  // State
  sidebarOpen: false,
  modals: {},
  globalLoading: false,
  notifications: [],
  theme: "light",

  // Actions
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open: boolean) =>
    set({ sidebarOpen: open }),

  openModal: (id: string, data?: any) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { id, isOpen: true, data },
      },
    })),

  closeModal: (id: string) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { ...state.modals[id], isOpen: false },
      },
    })),

  setGlobalLoading: (loading: boolean) =>
    set({ globalLoading: loading }),

  addNotification: (notification: Omit<Notification, "id">) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Date.now().toString() },
      ],
    })),

  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  setTheme: (theme: ThemeMode) =>
    set({ theme }),
}));
