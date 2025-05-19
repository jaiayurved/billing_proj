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

import ExportActions from "../invoice/ExportActions";
import QuickPendingPanel from "../invoice/QuickPendingPanel";
import ProductEntrySection from "../invoice/ProductEntrySection";
import BuyerSwitcherPanel from "../invoice/BuyerSwitcherPanel";
import NewOrderForm from "../NewOrderForm";
import InvoiceSummaryView from "./InvoiceSummaryView";

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
  const topRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const API_KEY = "DPRTMNT54$";
  const FULL_URL = (type) => `${SHEET_URL}?type=${type}&key=${API_KEY}`;

  useEffect(() => {
    fetch(FULL_URL("buyers")).then(res => res.json()).then(setBuyerList);
    fetch(FULL_URL("products")).then(res => res.json()).then(setProductList);
    loadPendingOrders()
      .then(setPendingOrders)
      .catch(() => showToast("❌ Failed to load pending orders", "error"));

    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [activeTab]);

  useEffect(() => {
    if (selectedPendingBuyer) {
      scrollToTop();
    }
  }, [selectedPendingBuyer]);

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

    // Clear fields after adding
    setItemName("");
    setSelectedBatch("");
    setMfg("");
    setExp("");
    setRate("");
    setQty("");

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
    scrollToTop();
  };

  const handleAfterAdd = () => {
    const next = pendingQueue[invoiceList.length];
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
    <div ref={topRef} className="min-h-screen max-w-6xl mx-auto p-4 space-y-4 text-gray-700 pb-[80px]">
      {activeTab === "summary" && (
        <InvoiceSummaryView
          invoiceList={invoiceList}
          buyer={selectedBuyer}
          onBack={() => setActiveTab("invoice")}
        />
      )}

      {activeTab === "invoice" && (
        <>
          

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start border-t pt-4">
            <div className="bg-blue-100 rounded-xl shadow p-4 border h-full overflow-y-auto max-h-[400px] pb-[80px] sticky top-0 z-10 md:static">

              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">
                ✍️ Product Entry ({invoiceList.length}) {selectedBuyer?.name && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-blue-200 text-blue-800 text-xs">
                    🧑 {selectedBuyer.name}
                  </span>
                )}
              </h3>
              {productEntryUI}
            </div>

            <div className={`rounded-xl shadow p-4 border relative overflow-auto h-[400px] ${
  selectedPendingBuyer && pendingQueue.length > 0 ? 'bg-yellow-100' : 'bg-slate-200'
}`}>


              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">📌 Pending Items ({pendingQueue.length})</h3>
              {quickPendingUI}
              <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-b from-transparent to-slate-200"></div>
            </div>

            <div className="bg-slate-100 rounded-xl shadow p-4 border h-full">
              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">🧑 Buyer Details</h3>
              <BuyerSwitcherPanel
                selectedBuyer={selectedBuyer}
                setSelectedBuyer={(buyer) => {
                  setSelectedBuyer(buyer);
                  scrollToTop();
                }}
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
          </div>

          <div ref={bottomRef} className="sticky bottom-0 z-20 bg-white py-2 border-t shadow-inner flex flex-col sm:flex-row justify-between items-center gap-2 px-3">
            <button
              onClick={() => setActiveTab("new")}
              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded shadow text-xs w-full sm:w-auto"

            >
              🆕 Punch New Order
            </button>




<div ref={bottomRef} className="sticky bottom-0 z-20 bg-white py-2 border-t shadow-inner flex flex-col sm:flex-row justify-between items-center gap-2 px-3">
            <button
    
    onClick={() => setActiveTab("summary")}
className="bg-blue-600 hover:bg-green-700 text-white px-2 py-1 rounded shadow text-xs w-full sm:w-auto"
>
  
    🔎 View Summary
  </button>
</div>




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
                scrollToTop();
              }}
              exportCSV={() => exportInvoiceToCSV(selectedBuyer, invoiceList)}
            />
          </div>
        </>
      )}

      {activeTab === "new" && productList.length > 0 && (
        <div className="mt-6">
          <NewOrderForm productList={productList} setActiveTab={setActiveTab} />
        </div>
      )}
    </div>
  );
}
