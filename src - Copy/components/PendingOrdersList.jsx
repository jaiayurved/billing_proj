// src/components/PendingOrdersList.jsx
import React from "react";

export default function PendingOrdersList({ orders, onSelect }) {
  if (!orders || orders.length === 0) return <div className="text-center text-sm p-4">📭 No pending orders.</div>;

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-bold mb-2">📦 Pending Orders</h2>
      <ul className="space-y-2">
        {orders.map((order, index) => (
          <li
            key={index}
            className="border p-3 rounded cursor-pointer hover:bg-blue-50"
            onClick={() => onSelect(order)}
          >
            <div className="font-semibold">{order.buyer.name}</div>
            <div className="text-xs text-gray-600">{order.orderItems.length} item(s)</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
