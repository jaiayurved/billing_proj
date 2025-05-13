// src/AppWrapper.jsx
import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

import Login from "./components/Login";
import Redirector from "./components/Redirector";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import BillingDashboard from "./components/views/BillingDashboard";
import SupervisorDashboard from "./components/views/SupervisorDashboard";

// ✅ Toast UI for notifications
import Toast from "./components/Toast";

export default function AppWrapper() {
  const { userRole } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/" element={userRole ? <Redirector userRole={userRole} /> : <Login />} />

        <Route
          path="/billing"
          element={
            <RoleProtectedRoute role="BILLING" userRole={userRole}>
              <BillingDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/supervisor"
          element={
            <RoleProtectedRoute role="SUPERVISOR" userRole={userRole}>
              <SupervisorDashboard />
            </RoleProtectedRoute>
          }
        />
      </Routes>

      {/* ✅ Global Toast Notification Layer */}
      <Toast />
    </>
  );
}
