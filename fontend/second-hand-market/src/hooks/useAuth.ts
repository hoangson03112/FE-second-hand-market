import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import {
  LoginResponse,
  RegisterResponse,
  VerifyResponse,
  Account,
  ApiResponse,
} from "../types/api.types";

// Query keys for cache management
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

/**
 * Login mutation hook
 */
export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, { username: string; password: string }>({
    mutationFn: ({ username, password }) => authService.login(username, password),
    onSuccess: (data) => {
      if (data.status === "success" && data.token && data.account) {
        setAuth(data.account, data.token);
        queryClient.setQueryData(authKeys.profile(), data.account);
      }
    },
  });
};

/**
 * Register mutation hook
 */
export const useRegister = () => {
  return useMutation<
    RegisterResponse,
    Error,
    {
      username?: string;
      email: string;
      password: string;
      fullName?: string;
      phoneNumber?: string;
    }
  >({
    mutationFn: (userData) => authService.register(userData as any),
  });
};

/**
 * Verify account mutation hook
 */
export const useVerify = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<VerifyResponse, Error, { userID: string; code: string }>({
    mutationFn: ({ userID, code }) => authService.verify(userID, code),
    onSuccess: (data) => {
      if (data.status === "success" && data.token && data.account) {
        setAuth(data.account, data.token);
        queryClient.setQueryData(authKeys.profile(), data.account);
      }
    },
  });
};

/**
 * Profile query hook - fetches current user profile
 */
export const useProfile = () => {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery<Account | null, Error>({
    queryKey: authKeys.profile(),
    queryFn: () => authService.authenticate(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: user,
  });
};

/**
 * Change password mutation hook
 */
export const useChangePassword = () => {
  return useMutation<
    ApiResponse,
    Error,
    { oldPassword: string; newPassword: string }
  >({
    mutationFn: ({ oldPassword, newPassword }) =>
      authService.changePassword(oldPassword, newPassword),
  });
};

/**
 * Update profile mutation hook
 */
export const useUpdateProfile = () => {
  const { updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<Account, Error, Partial<Account>>({
    mutationFn: (accountData) => authService.updateAccountInfo(accountData),
    onSuccess: (data) => {
      updateUser(data);
      queryClient.setQueryData(authKeys.profile(), data);
    },
  });
};

/**
 * Logout mutation hook
 */
export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all queries on logout
    },
  });
};

/**
 * Refresh token mutation hook
 */
export const useRefreshToken = () => {
  const { setAuth, user } = useAuthStore();

  return useMutation<string | null, Error>({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (token) => {
      if (token && user) {
        setAuth(user, token);
      }
    },
  });
};

/**
 * Get account by ID query hook
 */
export const useAccountById = (id: string | undefined) => {
  return useQuery<Account, Error>({
    queryKey: [...authKeys.all, "account", id],
    queryFn: () => authService.getAccountById(id!),
    enabled: !!id,
  });
};
