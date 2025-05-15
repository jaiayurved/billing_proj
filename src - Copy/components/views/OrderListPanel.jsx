// src/components/views/OrderListPanel.jsx
import React, { useEffect, useState } from "react";
import usePendingOrders from "../../hooks/usePendingOrders";
import { useNavigate } from "react-router-dom";

export default function OrderListPanel() {
  const { orders, loading } = usePendingOrders();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Under Process");

  const filtered = orders.filter(o => o.status === filter);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Dealer Orders</h2>

      <div className="mb-4">
        <label>Status Filter: </label>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option>Under Process</option>
          <option>Invoiced</option>
          <option>Dispatched</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Order ID</th>
              <th>Dealer</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="border-t">
                <td>{order.id}</td>
                <td>{order.dealer}</td>
                <td>{order.status}</td>
                <td>{order.date}</td>
                <td>
                  <button
                    onClick={() => navigate(`/billing/order/${order.id}`)}
                    className="text-blue-600 underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
