// src/components/RoleProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ userRole, role, children }) {
  if (userRole !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}
