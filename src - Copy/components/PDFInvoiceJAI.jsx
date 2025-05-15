// src/components/PDFInvoiceJAI.jsx
import React from "react";

function formatAmount(val) {
  return parseFloat(val || 0).toFixed(2);
}

export default function PDFInvoiceJAI({ buyer, cart }) {
  const total = cart.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
  const totalGST = cart.reduce((sum, r) => sum + ((parseFloat(r.amount) * parseFloat(r.gst || 0)) / 100), 0);
  const amountInWords = "(In Words)"; // Placeholder — can use number-to-words converter

  return (
    <div className="p-6 text-sm">
      <h2 className="text-center text-xl font-bold mb-2">JAI Ayurvedic Research</h2>
      <p className="text-center text-xs mb-4">GMP Certified | Jaipur | AYUSH Lic. 478-D</p>

      <div className="flex justify-between mb-3">
        <div>
          <strong>Buyer:</strong> {buyer.name}<br />
          <strong>GSTIN:</strong> {buyer.gstin || "-"}<br />
          <strong>City:</strong> {buyer.city || "-"}<br />
        </div>
        <div>
          <strong>Invoice No:</strong> ___________<br />
          <strong>Date:</strong> {new Date().toLocaleDateString("en-GB")}<br />
          <strong>PO No.:</strong> ___________<br />
        </div>
      </div>

      <table className="w-full border border-collapse text-xs">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-1">S.No</th>
            <th className="border px-1">Item</th>
            <th className="border px-1">HSN</th>
            <th className="border px-1">Batch</th>
            <th className="border px-1">MFG</th>
            <th className="border px-1">EXP</th>
            <th className="border px-1">MRP</th>
            <th className="border px-1">Qty</th>
            <th className="border px-1">Unit</th>
            <th className="border px-1">Rate</th>
            <th className="border px-1">Scheme</th>
            <th className="border px-1">Disc%</th>
            <th className="border px-1">GST%</th>
            <th className="border px-1">GST Amt</th>
            <th className="border px-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((r, i) => {
            const gstRate = parseFloat(r.gst || 0);
            const gstAmt = (parseFloat(r.amount) * gstRate) / 100;
            return (
              <tr key={i}>
                <td className="border px-1 text-center">{i + 1}</td>
                <td className="border px-1">{r.item}</td>
                <td className="border px-1">{r.hsn || "-"}</td>
                <td className="border px-1">{r.batch}</td>
                <td className="border px-1">{r.mfg}</td>
                <td className="border px-1">{r.exp}</td>
                <td className="border px-1 text-right">{r.mrp || r.rate}</td>
                <td className="border px-1 text-center">{r.qty}</td>
                <td className="border px-1 text-center">PCS</td>
                <td className="border px-1 text-right">{r.rate}</td>
                <td className="border px-1 text-center">{r.scheme || "-"}</td>
                <td className="border px-1 text-center">{r.discount || 0}%</td>
                <td className="border px-1 text-center">{gstRate}%</td>
                <td className="border px-1 text-right">{formatAmount(gstAmt)}</td>
                <td className="border px-1 text-right">{formatAmount(r.amount)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td className="border px-1 text-right" colSpan={13}>Total</td>
            <td className="border px-1 text-right">{formatAmount(totalGST)}</td>
            <td className="border px-1 text-right">₹{formatAmount(total)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-4 text-xs">
        <strong>Amount in Words:</strong> {amountInWords}
      </div>

      <div className="mt-4 border-t pt-2 text-xs">
        <strong>Terms & Conditions:</strong> Goods once sold will not be taken back.
      </div>

      <div className="mt-6 text-right text-xs">
        <strong>For JAI Ayurvedic Research</strong>
        <div className="mt-8">Authorized Signatory</div>
      </div>
    </div>
  );
}
