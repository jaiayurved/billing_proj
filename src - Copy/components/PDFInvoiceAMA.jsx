// src/components/PDFInvoiceAMA.jsx
import React from "react";

export default function PDFInvoiceAMA({ buyer, cart }) {
  const total = cart.reduce((sum, r) => sum + r.amount, 0);
  return (
    <div className="p-6 text-sm">
      <h2 className="text-center text-xl font-bold mb-2">Ashish Medical Agencies</h2>
      <p className="text-center text-xs mb-4">Wholesaler & Distributor | Jaipur | GSTIN Verified</p>

      <div className="mb-3">
        <strong>Buyer:</strong> {buyer.name}<br />
        <strong>GSTIN:</strong> {buyer.gstin}<br />
        <strong>City:</strong> {buyer.city}<br />
        <strong>Date:</strong> {new Date().toLocaleDateString("en-GB")}
      </div>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2">Item</th>
            <th className="border px-2">Batch</th>
            <th className="border px-2">MFG</th>
            <th className="border px-2">EXP</th>
            <th className="border px-2">Rate</th>
            <th className="border px-2">Qty</th>
            <th className="border px-2">Scheme</th>
            <th className="border px-2">Dis%</th>
            <th className="border px-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((r, i) => (
            <tr key={i}>
              <td className="border px-2">{r.item}</td>
              <td className="border px-2">{r.batch}</td>
              <td className="border px-2">{r.mfg}</td>
              <td className="border px-2">{r.exp}</td>
              <td className="border px-2">{r.rate}</td>
              <td className="border px-2">{r.qty}</td>
              <td className="border px-2">{r.scheme || "-"}</td>
              <td className="border px-2">{r.discount || 0}%</td>
              <td className="border px-2">{parseFloat(r.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td className="border px-2 text-right" colSpan={8}>Total</td>
            <td className="border px-2">₹{total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
