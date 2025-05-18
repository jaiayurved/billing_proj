// src/components/invoice/ExportActions.jsx
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
      <div className="flex justify-center gap-6 text-gray-700 items-center">

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
    </div>
  );
}
