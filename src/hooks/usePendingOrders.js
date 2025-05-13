// src/hooks/usePendingOrders.js
import { useEffect, useState } from "react";

export default function usePendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Replace with actual API call to Google Sheets or backend
        const dummy = [
          { id: "ORD001", dealer: "Raj Pharma", status: "Under Process", date: "10-05-2025" },
          { id: "ORD002", dealer: "Aayush Medico", status: "Invoiced", date: "09-05-2025" },
          { id: "ORD003", dealer: "City MedCare", status: "Dispatched", date: "08-05-2025" },
        ];
        setOrders(dummy);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return { orders, loading };
}
