// src/components/invoice/InvoiceSummaryPanel.jsx
import React from "react";
import InvoiceTable from "../InvoiceTable";

export default function InvoiceSummaryPanel({ invoiceList, handleRemove }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        📋 Invoice Preview
      </h2>
      <InvoiceTable invoiceList={invoiceList} onRemove={handleRemove} />
    </div>
  );
}
