// src/components/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const roles = [
  { code: "BILL001", role: "BILLING" },
  { code: "SUPV001", role: "SUPERVISOR" },
  { code: "ADMIN001", role: "ADMIN" }
];

export default function Login() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { setUserRole } = useContext(AuthContext);

  const handleLogin = () => {
    const match = roles.find((r) => r.code === code.toUpperCase());
    if (match) {
      setUserRole(match.role);
    } else {
      setError("❌ Invalid login code");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-sm w-full bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-center mb-4">🔐 Role-Based Login</h2>
        <input
          type="text"
          placeholder="Enter role code (e.g. BILL001)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-3"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          ✅ Login
        </button>
        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </div>
    </div>
  );
}
