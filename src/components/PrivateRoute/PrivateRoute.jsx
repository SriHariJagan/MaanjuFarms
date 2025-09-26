import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Store/useContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a spinner or loading message
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
