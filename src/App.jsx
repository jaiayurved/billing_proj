// src/App.js
import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AppWrapper from "./AppWrapper";

export default function App() {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
}
