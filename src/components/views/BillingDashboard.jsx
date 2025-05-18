// src/components/views/BillingDashboard.jsx

import React, { useState, useEffect, useRef } from "react";
import useToast from "../../hooks/useToast";
import {
  openWhatsAppWithInvoice,
  generatePDFInvoice,
  exportInvoiceToCSV,
} from "../export/InvoiceExporter";
import { applySchemeDiscountToInvoice } from "../../utils/cartUtils";
import { SHEET_URL } from "../config/gsheet";
import { loadPendingOrders } from "../../utils/loadPendingOrders";

import InvoiceSummaryPanel from "../invoice/InvoiceSummaryPanel";
import ExportActions from "../invoice/ExportActions";
import QuickPendingPanel from "../invoice/QuickPendingPanel";
import ProductEntrySection from "../invoice/ProductEntrySection";
import BuyerSwitcherPanel from "../invoice/BuyerSwitcherPanel";
import NewOrderForm from "../NewOrderForm";

export default function BillingDashboard() {
  const [activeTab, setActiveTab] = useState("invoice");
  const [buyerList, setBuyerList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [invoiceList, setInvoiceList] = useState([]);
  const [itemName, setItemName] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [mfg, setMfg] = useState("");
  const [exp, setExp] = useState("");
  const [rate, setRate] = useState("");
  const [qty, setQty] = useState("");
  const [selectedPendingBuyer, setSelectedPendingBuyer] = useState(null);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const showToast = useToast();

  const bottomRef = useRef(null);

  const API_KEY = "DPRTMNT54$";
  const FULL_URL = (type) => `${SHEET_URL}?type=${type}&key=${API_KEY}`;

  useEffect(() => {
    fetch(FULL_URL("buyers")).then(res => res.json()).then(setBuyerList);
    fetch(FULL_URL("products")).then(res => res.json()).then(setProductList);
    loadPendingOrders()
      .then(setPendingOrders)
      .catch(() => showToast("❌ Failed to load pending orders", "error"));

    // Scroll down by default on load
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 500);
  }, []);

  const handleAdd = () => {
    const alreadyExists = invoiceList.some(row => row.item === itemName && row.batch === selectedBatch);
    if (alreadyExists) return showToast("⚠️ This item with same batch already added", "error");
    if (!itemName || !selectedBatch || !qty || !rate) return showToast("⚠️ Fill all fields before adding", "error");

    const product = productList.find(p => p.name === itemName && p.Batch === selectedBatch);
    const row = {
      item: itemName,
      batch: selectedBatch,
      mfg,
      exp,
      rate,
      qty,
      mrp: product?.MRP || rate,
      hsn: product?.HSN || "",
      gst: product?.Gst_rate || 0,
    };

    const updated = applySchemeDiscountToInvoice([...invoiceList, row], selectedBuyer, true);
    setInvoiceList(updated);
    showToast("✅ Item added to invoice", "success");

    // Smooth scroll to bottomRef
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  const handleRemove = (index) => {
    const updated = [...invoiceList];
    updated.splice(index, 1);
    setInvoiceList(updated);
  };

  const handleFinalSubmit = () => {
    if (!selectedBuyer || invoiceList.length === 0) return showToast("⚠️ Select buyer and add items first", "error");
    const updated = applySchemeDiscountToInvoice(invoiceList, selectedBuyer, true);
    setInvoiceList(updated);
    openWhatsAppWithInvoice(selectedBuyer, updated);
  };

  const handleAfterAdd = () => {
    const next = pendingQueue[invoiceList.length + 1];
    if (next) {
      setItemName(next.item || next.name);
      setQty(next.qty || next.plannedQty || 1);
    }
  };

  const quickPendingUI = (
    <QuickPendingPanel
      pendingOrders={pendingOrders}
      buyerList={buyerList}
      setSelectedBuyer={setSelectedBuyer}
      setItemName={setItemName}
      setQty={setQty}
      handleAdd={handleAdd}
      showToast={showToast}
      invoiceList={invoiceList}
      pendingQueue={pendingQueue}
      autoScrollToNext={true}
    />
  );

  const productEntryUI = (
    <ProductEntrySection
      productList={productList}
      itemName={itemName}
      setItemName={setItemName}
      selectedBatch={selectedBatch}
      setSelectedBatch={setSelectedBatch}
      mfg={mfg}
      setMfg={setMfg}
      exp={exp}
      setExp={setExp}
      rate={rate}
      setRate={setRate}
      qty={qty}
      setQty={setQty}
      handleAdd={handleAdd}
      onAfterAdd={handleAfterAdd}
    />
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4 text-gray-700 pb-[80px]">
      {activeTab === "invoice" && (
        <>
          <div className="max-h-[280px] overflow-y-auto rounded-xl border border-gray-300">
            <InvoiceSummaryPanel invoiceList={invoiceList} handleRemove={handleRemove} buyer={selectedBuyer} />
            <div className='text-xs text-gray-500 px-4 py-1'>🧾 Total Items: {invoiceList.length}</div>
          </div>
          <hr className="border-t-2 border-gray-300 my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-t pt-4">
            <div className="bg-slate-100 rounded-xl shadow p-4 border h-full">
              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">🧍 Buyer Details</h3>
              <BuyerSwitcherPanel
                selectedBuyer={selectedBuyer}
                setSelectedBuyer={setSelectedBuyer}
                selectedPendingBuyer={selectedPendingBuyer}
                setSelectedPendingBuyer={setSelectedPendingBuyer}
                buyerList={buyerList}
                invoiceList={invoiceList}
                setInvoiceList={setInvoiceList}
                setPendingQueue={setPendingQueue}
                showToast={showToast}
                pendingOrders={pendingOrders}
                setItemName={setItemName}
                setQty={setQty}
                setSelectedBatch={setSelectedBatch}
                setMfg={setMfg}
                setExp={setExp}
                setRate={setRate}
              />
            </div>

            <div className="bg-slate-200 rounded-xl shadow p-4 border h-full relative max-h-[400px] overflow-y-auto">
              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">📌 Pending Items ({pendingQueue.length})</h3>
              {quickPendingUI}
              <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-b from-transparent to-slate-200"></div>
            </div>

            <div className="bg-blue-100 rounded-xl shadow p-4 border h-full overflow-y-auto max-h-[400px] pb-[80px]">
              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">✍️ Product Entry ({invoiceList.length})</h3>
              {productEntryUI}
            </div>
          </div>

          <div ref={bottomRef} className="sticky bottom-0 z-20 bg-white py-1 border-t shadow-inner flex justify-between items-center gap-2 px-3">
            <button
              onClick={() => setActiveTab("new")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
            >
              🆕 Punch New Order
            </button>
            <ExportActions
              selectedBuyer={selectedBuyer}
              invoiceList={invoiceList}
              onSubmit={handleFinalSubmit}
              generatePDF={() => {
                generatePDFInvoice(selectedBuyer, invoiceList);
                setInvoiceList([]);
                setSelectedBuyer(null);
                setSelectedPendingBuyer(null);
                setPendingQueue([]);
                setItemName("");
                setQty("");
              }}
              exportCSV={() => exportInvoiceToCSV(selectedBuyer, invoiceList)}
            />
          </div>
        </>
      )}

      {activeTab === "new" && productList.length > 0 && (
        <div className="mt-6 max-h-[360px] overflow-y-auto">
          <div className="mb-4 text-center">
            <button
              onClick={() => setActiveTab("invoice")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              🔙 Back to Invoice
            </button>
          </div>
          <NewOrderForm productList={productList} buyerList={buyerList} />
        </div>
      )}
    </div>
  );
}
