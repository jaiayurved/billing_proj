// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole"));

  useEffect(() => {
    if (userRole) localStorage.setItem("userRole", userRole);
  }, [userRole]);

  const logout = () => {
    setUserRole(null);
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
