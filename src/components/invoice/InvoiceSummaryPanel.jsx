// src/components/invoice/InvoiceSummaryPanel.jsx
import React from "react";
import InvoiceTable from "../InvoiceTable";

export default function InvoiceSummaryPanel({ invoiceList, handleRemove, buyer }) {
  return (
    <div id="invoice-summary" className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        📋 Invoice Preview
      </h2>

      {buyer?.name && (
        <div className="mb-4 text-lg text-gray-800">
          <span className="text-xl font-extrabold text-blue-900">
            🧍 Buyer: {buyer.name}
          </span>
        </div>
      )}

      <InvoiceTable invoiceList={invoiceList} onRemove={handleRemove} />
    </div>
  );
}
