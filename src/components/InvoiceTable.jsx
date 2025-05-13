// src/components/InvoiceTable.jsx
import React from "react";

export default function InvoiceTable({ invoiceList, onRemove }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">🧾 Invoice Preview</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-center border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 border font-medium">Item</th>
              <th className="px-3 py-2 border font-medium">Batch</th>
              <th className="px-3 py-2 border font-medium">MFG</th>
              <th className="px-3 py-2 border font-medium">EXP</th>
              <th className="px-3 py-2 border font-medium">Rate</th>
              <th className="px-3 py-2 border font-medium">Qty</th>
              <th className="px-3 py-2 border font-medium">Scheme</th>
              <th className="px-3 py-2 border font-medium">Dis%</th>
              <th className="px-3 py-2 border font-medium">Amount</th>
              <th className="px-3 py-2 border font-medium">Remove</th>
            </tr>
          </thead>
          <tbody>
            {invoiceList.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 border-t">
                <td className="px-3 py-2 border whitespace-nowrap">{r.item}</td>
                <td className="px-3 py-2 border whitespace-nowrap">{r.batch}</td>
                <td className="px-3 py-2 border whitespace-nowrap">{r.mfg}</td>
                <td className="px-3 py-2 border whitespace-nowrap">{r.exp}</td>
                <td className="px-3 py-2 border whitespace-nowrap">{parseFloat(r.rate).toFixed(2)}</td>
                <td className="px-3 py-2 border whitespace-nowrap">{r.qty}</td>
                <td className="px-3 py-2 border whitespace-nowrap">{r.scheme || "-"}</td>
                <td className="px-3 py-2 border whitespace-nowrap">{r.discount || 0}%</td>
                <td className="px-3 py-2 border whitespace-nowrap">{parseFloat(r.amount).toFixed(2)}</td>
                <td className="px-3 py-2 border">
                  <button
                    onClick={() => onRemove(i)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}