import ApiService from "./ApiService";
import storage from "../utils/storage";
import {
  LoginResponse,
  RegisterResponse,
  VerifyResponse,
  AuthResponse,
  Account,
  ApiResponse,
} from "../types/api.types";

// Type definitions for request payloads (inline to avoid unused import warnings)
interface LoginRequest { email: string; password: string; }
interface RegisterRequest { 
  username?: string;
  email: string; 
  password: string; 
  fullName?: string; 
  phoneNumber?: string; 
}
interface VerifyRequest { accountID: string; otp: string; }
interface ChangePasswordRequest { oldPassword: string; newPassword: string; }

const authService = {
  /**
   * Login with username and password
   * BE returns token in response body and refreshToken in httpOnly cookie
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await ApiService.post<LoginResponse>("/accounts/login", {
      username,
      password,
    });

    if (response.status === "success" && response.token) {
      // Store access token in localStorage
      storage.setToken(response.token);

      // Store user info if available
      if (response.account) {
        storage.setUser(response.account);
      }
    }

    return response;
  },

  /**
   * Register new account
   * BE endpoint: /accounts/register (NOT /auth/register)
   * Returns accountID for verification step
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await ApiService.post<RegisterResponse>(
      "/accounts/register",
      userData
    );
    return response;
  },

  /**
   * Verify account with code
   * BE endpoint: /accounts/verify
   * Returns token and account on success
   */
  verify: async (userID: string, code: string): Promise<VerifyResponse> => {
    const response = await ApiService.post<VerifyResponse>("/accounts/verify", {
      userID,
      code,
    });

    if (response.status === "success" && response.token) {
      // Store access token
      storage.setToken(response.token);

      // Store user info
      if (response.account) {
        storage.setUser(response.account);
      }
    }

    return response;
  },

  /**
   * Get current authenticated user
   * BE endpoint: /accounts/auth
   * Requires Authorization header with Bearer token
   */
  authenticate: async (): Promise<Account | null> => {
    try {
      const response = await ApiService.get<AuthResponse>("/accounts/auth");

      if (response.status === "success" && response.account) {
        // Update stored user info
        storage.setUser(response.account);
        return response.account;
      }

      return null;
    } catch (error) {
      console.error("Authentication failed:", error);
      return null;
    }
  },

  /**
   * Change password
   * BE endpoint: PUT /accounts/change-password
   */
  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse> => {
    const response = await ApiService.put<ApiResponse>(
      "/accounts/change-password",
      {
        oldPassword,
        newPassword,
      }
    );
    return response;
  },

  /**
   * Update account info
   * BE endpoint: PUT /accounts/update
   */
  updateAccountInfo: async (accountData: Partial<Account>): Promise<Account> => {
    const response = await ApiService.put<Account>(
      "/accounts/update",
      accountData
    );

    // Update stored user info
    if (response) {
      storage.setUser(response);
    }

    return response;
  },

  /**
   * Get account by ID
   * BE endpoint: GET /accounts/:id
   */
  getAccountById: async (id: string): Promise<Account> => {
    return await ApiService.get<Account>(`/accounts/${id}`);
  },

  /**
   * Refresh access token
   * BE endpoint: POST /accounts/refresh
   * Uses refreshToken from httpOnly cookie
   */
  refreshToken: async (): Promise<string | null> => {
    try {
      const response = await ApiService.post<LoginResponse>(
        "/accounts/refresh",
        {}
      );

      if (response.status === "success" && response.token) {
        storage.setToken(response.token);
        return response.token;
      }

      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  },

  /**
   * Logout
   * BE endpoint: POST /accounts/logout
   * Clears localStorage and backend clears httpOnly cookie
   */
  logout: async (): Promise<void> => {
    try {
      await ApiService.post("/accounts/logout", {});
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Always clear local storage
      storage.clearAll();
    }
  },

  // Helper methods
  getCurrentUser: (): Account | null => {
    return storage.getUser();
  },

  getToken: (): string | null => {
    return storage.getToken();
  },

  isAuthenticated: (): boolean => {
    return !!storage.getToken() && !!storage.getUser();
  },
};

export default authService;
