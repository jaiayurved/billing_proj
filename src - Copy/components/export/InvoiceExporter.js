// src/components/export/InvoiceExporter.js
import html2pdf from "html2pdf.js";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PDFInvoiceJAI from "../PDFInvoiceJAI";
import PDFInvoiceAMA from "../PDFInvoiceAMA";

export function openWhatsAppWithInvoice(buyer, invoiceList) {
  const lines = [];
  lines.push(`🧾 *Invoice for ${buyer.name}*`);
  if (buyer.gstin) lines.push(`GSTIN: ${buyer.gstin}`);
  if (buyer.city) lines.push(`City: ${buyer.city}`);
  lines.push("");

  invoiceList.forEach((item, i) => {
    lines.push(
      `${i + 1}. ${item.item} | Batch: ${item.batch} | Qty: ${item.qty} | Rate: ₹${item.rate} | Amt: ₹${parseFloat(item.amount).toFixed(2)}`
    );
  });

  const total = invoiceList.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  lines.push("\n🧮 Total: ₹" + total.toFixed(2));

  const message = lines.join("\n");
  const phone = buyer.phone || "919829280873"; // default admin no.
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

export function exportInvoiceToCSV(buyer, invoiceList) {
  const headers = [
    "Buyer Name","Item","Batch","MFG","EXP","Rate","Qty","Scheme","Discount %","Amount"
  ];

  const rows = invoiceList.map((item) => [
    buyer.name,
    item.item,
    item.batch,
    item.mfg,
    item.exp,
    item.rate,
    item.qty,
    item.scheme,
    item.discount,
    item.amount.toFixed(2)
  ]);

  const csvContent = [headers, ...rows]
    .map(e => e.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `invoice_${buyer.name}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generatePDFInvoice(buyer, cart) {
  const Component = buyer?.type === "AMA" ? PDFInvoiceAMA : PDFInvoiceJAI;
  const markup = renderToStaticMarkup(React.createElement(Component, { buyer, cart }));

  const container = document.createElement("div");
  container.innerHTML = markup;

  html2pdf()
    .from(container)
    .set({ filename: `Invoice_${buyer.name}.pdf`, margin: 0.5, jsPDF: { format: "a4" } })
    .save();
}
