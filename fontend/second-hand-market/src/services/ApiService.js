import axios from "axios";

const ApiService = {
  // Thiết lập interceptor cho api instance
  setupInterceptors: (token) => {
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  },

  // Các phương thức chung
  get: async (endpoint) => {
    try {
      const response = await axios.get(`${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await axios.post(`${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error posting data to ${endpoint}:`, error);
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await axios.put(`${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating data at ${endpoint}:`, error);
      throw error;
    }
  },
  patch: async (endpoint, data) => {
    try {
      const response = await axios.patch(`${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error patching data at ${endpoint}:`, error);
      throw error;
    }
  },
  delete: async (endpoint) => {
    try {
      const response = await axios.delete(`${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting data at ${endpoint}:`, error);
      throw error;
    }
  },
};

export default ApiService;
