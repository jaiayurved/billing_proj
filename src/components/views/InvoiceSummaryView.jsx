// src/components/views/InvoiceSummaryView.jsx

import React from "react";
import InvoiceSummaryPanel from "../invoice/InvoiceSummaryPanel";

export default function InvoiceSummaryView({ invoiceList, buyer, onBack }) {
  return (
    <div className="p-4 space-y-4">
      <button
        className="text-sm bg-blue-600 text-white px-4 py-2 rounded shadow"
        onClick={onBack}
      >
        🔙 Back to Invoice
      </button>

      <InvoiceSummaryPanel invoiceList={invoiceList} buyer={buyer} />

      <div className="text-center text-sm text-gray-500">
        🧾 Total Items: {invoiceList.length}
      </div>
    </div>
  );
}
