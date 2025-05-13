// src/pages/GenerateInvoicePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PDFInvoiceJAI from "../components/PDFInvoiceJAI";
//import PDFInvoiceAMA from "../components/PDFInvoiceAMA";
import html2pdf from "html2pdf.js";

export default function GenerateInvoicePage() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("invoicePayload");
    if (stored) {
      setPayload(JSON.parse(stored));
    } else {
      alert("⚠️ No invoice data found. Redirecting...");
      navigate("/");
    }
  }, []);

  const handleDownloadPDF = () => {
    const element = document.getElementById("pdf-invoice");
    const opt = {
      margin: 0.5,
      filename: `Invoice_${payload?.buyer?.name || "JAI"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (!payload) return null;

  return (
    <div className="p-4">
      <div id="pdf-invoice">
        {(payload.buyer?.type || "").toUpperCase() === "JAI" ? (
          <PDFInvoiceJAI {...payload} />
        ) : (
          <PDFInvoiceAMA {...payload} />
        )}
      </div>

      <button
        onClick={handleDownloadPDF}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>
    </div>
  );
}

