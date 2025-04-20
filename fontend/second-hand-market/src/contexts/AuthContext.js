import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      if (token) {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(username, password);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      if (!currentUser) throw new Error("Người dùng chưa đăng nhập");

      const response = await authService.updateProfile(
        currentUser._id,
        userData
      );
      setCurrentUser(response);
      return response;
    } catch (err) {
      setError(err.message || "Cập nhật thông tin thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
