// src/components/Toast.js
import React, { useEffect, useState } from "react";

let setGlobalToast = null;

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setGlobalToast = setToast;
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50 text-sm">
      {toast.message}
    </div>
  );
}

export function showToast(message, type = "info") {
  if (setGlobalToast) {
    setGlobalToast({ message, type });
    setTimeout(() => setGlobalToast(null), 3000);
  } else {
    console.warn("⚠️ Toast system not ready");
  }
}
