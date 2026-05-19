import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import API_CONFIG from "../config/api.config";
import storage from "../utils/storage";

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies (for refreshToken)
});

// Request interceptor - Add access token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and common errors
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token
        const response = await axios.post(
          `${API_CONFIG.API_URL}/accounts/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.status === "success" && response.data.token) {
          const newToken = response.data.token;
          storage.setToken(newToken);

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          processQueue(null, newToken);
          isRefreshing = false;

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        isRefreshing = false;

        // Refresh failed - clear storage and redirect to login
        storage.clearAll();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

const ApiService = {
  // HTTP Methods with proper typing
  get: async <T = any>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  },

  post: async <T = any>(
    endpoint: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`Error posting data to ${endpoint}:`, error);
      throw error;
    }
  },

  put: async <T = any>(
    endpoint: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    try {
      const response = await axiosInstance.put<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`Error updating data at ${endpoint}:`, error);
      throw error;
    }
  },

  patch: async <T = any>(
    endpoint: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    try {
      const response = await axiosInstance.patch<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`Error patching data at ${endpoint}:`, error);
      throw error;
    }
  },

  delete: async <T = any>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await axiosInstance.delete<T>(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`Error deleting data at ${endpoint}:`, error);
      throw error;
    }
  },
};

export default ApiService;
export { axiosInstance };
