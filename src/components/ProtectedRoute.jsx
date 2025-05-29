import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwt_decode(token);
    const userRole = decoded.roles;

    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (err) {
    console.error("Token non valido:", err);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
