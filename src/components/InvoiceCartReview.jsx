// src/components/InvoiceCartReview.jsx
import React from "react";
import { exportToExcel, openWhatsAppWithInvoice } from "./export/InvoiceExporter";

export default function InvoiceCartReview({ buyer, cart, onRemove }) {
  const total = cart.reduce((sum, r) => sum + r.amount, 0);
  const invoiceNo = `BILL${Date.now().toString().slice(-6)}`;

  if (!buyer || cart.length === 0) return null;

  return (
    <div className="border p-4 rounded mt-4">
      <h3 className="text-lg font-bold mb-2">Invoice Summary</h3>
      <div className="text-sm text-gray-600 mb-2">
        Buyer: {buyer.name} | GSTIN: {buyer.gstin} | City: {buyer.city} | Type: {buyer.type}<br />
        Invoice No: {invoiceNo}
      </div>

      <div id="invoice-preview">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Item</th><th>Batch</th><th>MFG</th><th>EXP</th><th>Rate</th><th>Qty</th><th>Amt</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((r, i) => (
              <tr key={i} className="border-t">
                <td>{r.item}</td>
                <td>{r.batch}</td>
                <td>{r.mfg}</td>
                <td>{r.exp}</td>
                <td>{r.rate}</td>
                <td>{r.qty}</td>
                <td>{r.amount}</td>
                <td>
                  <button
                    className="text-red-500 underline text-xs"
                    onClick={() => onRemove(i)}
                  >Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={6} className="text-right pr-2">Total</td>
              <td colSpan={2}>₹{total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => openWhatsAppWithInvoice(buyer, cart)}>
          Send WhatsApp
        </button>

        <button className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => exportToExcel(buyer, cart)}>
          Export Excel
        </button>
      </div>
    </div>
  );
}
