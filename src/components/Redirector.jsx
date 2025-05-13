// src/components/Redirector.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function Redirector({ userRole }) {
  switch (userRole) {
    case "BILLING":
      return <Navigate to="/billing" replace />;
    case "SUPERVISOR":
      return <Navigate to="/supervisor" replace />;
    // Add more roles as needed
    default:
      return <Navigate to="/" replace />;
  }
}
