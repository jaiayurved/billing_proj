// src/components/views/BillingDashboard.jsx
import React, { useState, useEffect } from "react";
import useToast from "../../hooks/useToast";
import {
  openWhatsAppWithInvoice,
  generatePDFInvoice,
  exportInvoiceToCSV,
} from "../export/InvoiceExporter";
import { applySchemeDiscountToInvoice } from "../../utils/cartUtils";
import { SHEET_URL } from "../config/gsheet";
import ProductEntrySection from "../invoice/ProductEntrySection";
import InvoiceSummaryPanel from "../invoice/InvoiceSummaryPanel";
import BuyerInfoPanel from "../invoice/BuyerInfoPanel";
import ExportActions from "../invoice/ExportActions";
import PendingOrderPanel from "../PendingOrderPanel";
import NewOrderForm from "../NewOrderForm";
import QuickPendingPanel from "../invoice/QuickPendingPanel";
import { loadPendingOrders } from "../../utils/loadPendingOrders";

export default function BillingDashboard() {
  const [highlightBuyer, setHighlightBuyer] = useState(false);
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
  const [currentPendingIndex, setCurrentPendingIndex] = useState(0);
  const [pendingOrders, setPendingOrders] = useState([]);

  const showToast = useToast();
  const API_KEY = "DPRTMNT54$";
  const FULL_URL = (type) => `${SHEET_URL}?type=${type}&key=${API_KEY}`;

  useEffect(() => {
    fetch(FULL_URL("buyers"))
      .then((res) => res.json())
      .then((data) => setBuyerList(data))
      .catch(() => showToast("❌ Failed to load buyers", "error"));

    fetch(FULL_URL("products"))
      .then((res) => res.json())
      .then((data) => setProductList(data))
      .catch(() => showToast("❌ Failed to load products", "error"));

    loadPendingOrders(FULL_URL("pendingOrders"))
      .then(setPendingOrders)
      .catch(() => showToast("❌ Failed to load pending orders", "error"));
  }, []);

  const handleAdd = () => {
    const alreadyExists = invoiceList.some(row => row.item === itemName && row.batch === selectedBatch);
    if (alreadyExists) {
      return showToast("⚠️ This item with same batch already added", "error");
    }
    if (!itemName || !selectedBatch || !qty || !rate) {
      return showToast("⚠️ Fill all fields before adding", "error");
    }
    const product = productList.find(p => p.name === itemName && p.Batch === selectedBatch);
    const row = {
      item: itemName,
      batch: selectedBatch,
      mfg,
      exp,
      rate,
      qty,
      mrp: product?.MRP || rate,
      hsn: product?.HSN || product?.hsn || "",
      gst: product?.Gst_rate || product?.gst || 0,
    };
    const newInvoiceList = [...invoiceList, row];
    const updated = applySchemeDiscountToInvoice(newInvoiceList, selectedBuyer, true);
    setInvoiceList(updated);
    showToast("✅ Item added to invoice", "success");

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1000);
    }, 300);
  };

  const handleRemove = (index) => {
    const updated = [...invoiceList];
    updated.splice(index, 1);
    setInvoiceList(updated);
  };

  const handleFinalSubmit = () => {
    if (!selectedBuyer || invoiceList.length === 0) {
      return showToast("⚠️ Select buyer and add items first", "error");
    }
    const updated = applySchemeDiscountToInvoice(invoiceList, selectedBuyer, true);
    setInvoiceList(updated);
    openWhatsAppWithInvoice(selectedBuyer, updated);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-gray-800">
      <div className="sticky top-0 z-20 bg-blue-100/40 backdrop-blur-md flex justify-center gap-4 py-3 shadow-sm border-b">
        <button onClick={() => setActiveTab("new")} className={`${activeTab === "new" ? "bg-green-600" : "bg-green-500"} hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md shadow`}>🆕 Punch New Order</button>
        <button onClick={() => setActiveTab("pending")} className={`${activeTab === "pending" ? "bg-blue-600" : "bg-blue-500"} hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow`}>📋 Pending Orders</button>
        <button onClick={() => setActiveTab("invoice")} className={`${activeTab === "invoice" ? "bg-purple-600" : "bg-purple-500"} hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-md shadow`}>🧾 Invoice Screen</button>
      </div>

      <h1 className="text-3xl font-bold text-center text-blue-900">📦 Billing Dashboard</h1>

      {activeTab === "pending" && (
        <PendingOrderPanel
          pendingOrders={pendingOrders}
          selectedPendingBuyer={selectedPendingBuyer}
          setSelectedPendingBuyer={setSelectedPendingBuyer}
          pendingQueue={pendingQueue}
          setPendingQueue={setPendingQueue}
          currentPendingIndex={currentPendingIndex}
          setCurrentPendingIndex={setCurrentPendingIndex}
          itemName={itemName}
          setItemName={setItemName}
          qty={qty}
          setQty={setQty}
          batchList={productList.filter(p => p.name === itemName).map(p => p.Batch)}
          selectedBatch={selectedBatch}
          setSelectedBatch={setSelectedBatch}
          mfg={mfg}
          exp={exp}
          rate={rate}
          invoiceList={invoiceList}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
          showToast={showToast}
          productList={productList}
          setRate={setRate}
          setExp={setExp}
          setMfg={setMfg}
          setActiveTab={setActiveTab}
          selectedBuyer={selectedBuyer}
          setSelectedBuyer={setSelectedBuyer}
          setInvoiceList={setInvoiceList}
          buyerList={buyerList}
        />
      )}

      {activeTab === "new" && <NewOrderForm productList={productList} />}

      {activeTab === "invoice" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`text-xs p-1 border border-yellow-400 bg-yellow-100 rounded shadow ring-1 ring-yellow-200 transition-all duration-500 ${highlightBuyer ? 'animate-pulse' : ''}`}>
              <BuyerInfoPanel
                buyerList={buyerList}
                selectedBuyer={selectedBuyer}
                setSelectedBuyer={setSelectedBuyer}
                invoiceList={invoiceList}
                setInvoiceList={setInvoiceList}
              />
            </div>
<div className="h-[220px] overflow-y-auto">
  <QuickPendingPanel
    pendingOrders={pendingOrders}
    buyerList={buyerList}
    setSelectedBuyer={setSelectedBuyer}
    setSelectedPendingBuyer={setSelectedPendingBuyer}
    setPendingQueue={setPendingQueue}
    setCurrentPendingIndex={setCurrentPendingIndex}
    currentPendingIndex={currentPendingIndex}
    setItemName={setItemName}
    setQty={setQty}
    handleAdd={handleAdd}
    showToast={showToast}
    invoiceList={invoiceList}
  />
</div>
          </div>

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
          />

          <InvoiceSummaryPanel
            invoiceList={invoiceList}
            handleRemove={handleRemove}
            buyer={selectedBuyer}
          />

          <div className="sticky bottom-0 z-20 bg-white py-4 border-t shadow-inner">
            <ExportActions
              selectedBuyer={selectedBuyer}
              invoiceList={invoiceList}
              onSubmit={handleFinalSubmit}
              generatePDF={() => generatePDFInvoice(selectedBuyer, invoiceList)}
              exportCSV={() => exportInvoiceToCSV(selectedBuyer, invoiceList)}
            />
          </div>
        </>
      )}
    </div>
  );
}
