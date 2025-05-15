// src/components/invoice/ExportActions.jsx
import React from "react";

export default function ExportActions({ selectedBuyer, invoiceList, onSubmit, generatePDF, exportCSV }) {
  const isDisabled = !selectedBuyer || invoiceList.length === 0;

  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4">
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className={`px-6 py-2 rounded-xl font-semibold shadow transition text-white ${
          isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
        }`}
      >
        ✅ Finalize & Send WhatsApp
      </button>

      <button
        onClick={generatePDF}
        disabled={isDisabled}
        className={`px-6 py-2 rounded-xl font-semibold shadow transition text-white ${
          isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        🧾 Export PDF
      </button>

      <button
        onClick={exportCSV}
        disabled={isDisabled}
        className={`px-6 py-2 rounded-xl font-semibold shadow transition text-white ${
          isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
        }`}
      >
        ⬇️ Download CSV
      </button>
    </div>
  );
}
