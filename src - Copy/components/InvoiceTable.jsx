// src/components/InvoiceTable.jsx
import React from "react";

export default function InvoiceTable({ invoiceList, onRemove }) {
  return (
    <table className="min-w-full text-sm border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Item</th>
          <th className="p-2 border">Batch</th>
          <th className="p-2 border">MFG</th>
          <th className="p-2 border">EXP</th>
          <th className="p-2 border">Rate</th>
          <th className="p-2 border">Qty</th>
          <th className="p-2 border">Scheme</th>
          <th className="p-2 border">Dis%</th>
          <th className="p-2 border">Amount</th>
          <th className="p-2 border">Remove</th>
        </tr>
      </thead>
      <tbody>
        {invoiceList.map((item, idx) => (
          <tr key={idx} className="border-t">
            <td className="p-2 border text-gray-800">{item.item}</td>
            <td className="p-2 border">{item.batch}</td>
            <td className="p-2 border">{item.mfg}</td>
            <td className="p-2 border">{item.exp}</td>
            <td className="p-2 border">₹{item.rate}</td>
            <td className="p-2 border">{item.qty}</td>
            <td className="p-2 border">{item.scheme || "0+0"}</td>
            <td className="p-2 border">{item.discount ?? 0}%</td>
            <td className="p-2 border">₹{item.amount?.toFixed(2) || "0.00"}</td>
            <td className="p-2 border">
              <button
                onClick={() => onRemove(idx)}
                className="text-red-600 hover:underline text-xs"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
