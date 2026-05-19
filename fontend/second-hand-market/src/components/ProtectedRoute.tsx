import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ roles, children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return null;
  if (!currentUser) return <Navigate to="/eco-market/login" />;
  if (!roles.includes(currentUser.role))
    return <Navigate to="/eco-market/no-access" />;
  return children;
};

export default ProtectedRoute;
