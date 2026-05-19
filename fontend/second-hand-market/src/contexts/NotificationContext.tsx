import React, { createContext, useContext, useState } from "react";
import NotificationSnackbar from "../components/common/NotificationSnackbar";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
    autoHideDuration: 6000,
    title: null,
  });

  const showNotification = (
    message,
    severity = "info",
    autoHideDuration = 6000,
    title = null
  ) => {
    setNotification({
      open: true,
      message,
      severity,
      autoHideDuration,
      title,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Shorthand methods
  const showSuccess = (message, duration, title) =>
    showNotification(message, "success", duration, title);

  const showError = (message, duration, title) =>
    showNotification(message, "error", duration, title);

  const showWarning = (message, duration, title) =>
    showNotification(message, "warning", duration, title);

  const showInfo = (message, duration, title) =>
    showNotification(message, "info", duration, title);

  const contextValue = {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        autoHideDuration={notification.autoHideDuration}
        title={notification.title}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

