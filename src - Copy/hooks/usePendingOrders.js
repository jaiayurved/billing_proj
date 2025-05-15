// src/hooks/usePendingOrders.js
import { useEffect, useState } from "react";

import { loadPendingOrders } from "../utils/loadPendingOrders";

export default function usePendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);


  return { orders, loading };
}
