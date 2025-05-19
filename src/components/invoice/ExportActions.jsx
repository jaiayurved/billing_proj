import React from "react";
import { Send, FileText, FileDown, Printer } from "lucide-react";
import { printPDFInvoice } from "../export/InvoiceExporter";

export default function ExportActions({
  selectedBuyer,
  invoiceList,
  onSubmit,
  generatePDF,
  exportCSV
}) {
  const disabled = !selectedBuyer || invoiceList.length === 0;

  return (
    <div className="w-full border-t pt-4 mt-4">
      <div className="flex justify-between items-center text-gray-700 gap-4 flex-wrap">

        {/* 🆕 Bottom Left Button */}
        <button
          id="new-order"
          onClick={() => document.querySelector('#new-order-tab')?.click()}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm shadow hover:bg-green-700"
        >
          🆕 Punch New Order
        </button>

        {/* Icon Actions Centered */}
        <div className="flex gap-6 justify-center items-center flex-grow">
          <button
            onClick={onSubmit}
            disabled={disabled}
            title="Send WhatsApp"
            className={`transition hover:text-green-600 ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <Send size={28} />
          </button>

          <button
            onClick={generatePDF}
            disabled={disabled}
            title="Download PDF"
            className={`transition hover:text-purple-600 ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <FileText size={28} />
          </button>

          <button
            onClick={exportCSV}
            disabled={disabled}
            title="Download CSV"
            className={`transition hover:text-yellow-600 ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <FileDown size={28} />
          </button>

          <button
            onClick={() => printPDFInvoice(selectedBuyer, invoiceList)}
            disabled={disabled}
            title="Print Invoice"
            className={`transition hover:text-blue-600 ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <Printer size={28} />
          </button>
        </div>

        {/* 🔎 Bottom Right Button */}
        <button
          id="view-summary"
          onClick={() => document.querySelector('#view-summary-tab')?.click()}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm shadow hover:bg-blue-700"
        >
          🔎 View Summary
        </button>
      </div>
    </div>
  );
}
