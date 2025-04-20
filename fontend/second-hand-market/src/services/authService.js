import ApiService from "./ApiService";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const authService = {
  login: async (username, password) => {
    const response = await ApiService.post("/accounts/login", {
      username,
      password,
    });
    if (response.status === "success") {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      ApiService.setupInterceptors(response.token);
    }
    return response;
  },

  register: async (userData) => {
    return await ApiService.post("/auth/register", userData);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  updateProfile: async (userId, userData) => {
    const response = await ApiService.put(`/users/${userId}`, userData);
    if (response) {
      localStorage.setItem(USER_KEY, JSON.stringify(response));
    }
    return response;
  },

  getUserById: async (id) => {
    return await ApiService.get(`/users/${id}`);
  },

  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/users?${queryParams}`);
  },

  changeUserRole: async (userId, role) => {
    return await ApiService.put(`/users/${userId}/role`, { role });
  },
};

export default authService;
