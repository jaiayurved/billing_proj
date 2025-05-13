// src/components/PendingOrderPanel.jsx
import React from "react";
import ItemEntryForm from "./ItemEntryForm";
import InvoiceTable from "./InvoiceTable";

import { applySchemeDiscountToInvoice } from "../utils/cartUtils";

export default function PendingOrderPanel({
  pendingOrders,
  selectedPendingBuyer,
  setSelectedPendingBuyer,
  pendingQueue,
  setPendingQueue,
  currentPendingIndex,
  setCurrentPendingIndex,
  itemName,
  setItemName,
  qty,
  setQty,
  batchList,
  selectedBatch,
  setSelectedBatch,
  mfg,
  exp,
  rate,
  setQtyExternal,
  invoiceList,
  handleAdd,
  handleRemove,
  showToast,
  productList,
  setRate,
  setExp,
  setMfg,
  setActiveTab,
  selectedBuyer,
  setSelectedBuyer,
  setInvoiceList
}) {
  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* Left Panel: Selected Buyer & Their Items */}
        <div className="w-1/4 bg-white border shadow rounded p-3">
          <h3 className="font-semibold text-gray-800 mb-2">👤 {selectedPendingBuyer?.name || "Select a buyer"}</h3>
          {selectedPendingBuyer && Array.isArray(pendingQueue) && pendingQueue.length > 0 && (
            <ul className="space-y-1">
              {pendingQueue.map((item, idx) => (
                <li
                  key={idx}
                  className={`cursor-pointer px-3 py-1 rounded text-sm ${
                    idx === currentPendingIndex
                    ? "bg-blue-600 text-white border border-blue-700"
                      : "bg-blue-50 hover:bg-blue-100 text-gray-800"
                  }`}
                  onClick={() => {
                    setCurrentPendingIndex(idx);
                    setItemName(item.name);
                    setQty(item.qty);
                    showToast(`🔄 ${item.name} (Qty: ${item.qty}) ready to process`, "info");
                  }}
                >
                  {item.name} — Qty: {item.qty}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Panel: Entry Form */}
        <div className="w-3/4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-700">🧾 Process Items</h2>
            <button
              onClick={() => setActiveTab("invoice")}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-3 py-1 rounded shadow-sm"
            >
              🔙 Back to Invoice
            </button>
          </div>
          <div className="text-sm text-gray-700 font-medium bg-blue-50 px-4 py-2 rounded border border-blue-200">
            Processing: {selectedPendingBuyer?.name || "-"} — Item {currentPendingIndex + 1} of {pendingQueue.length}
          </div>
          <ItemEntryForm
            itemName={itemName}
            setItemName={setItemName}
            selectedBatch={selectedBatch}
            setSelectedBatch={setSelectedBatch}
            mfg={mfg}
            exp={exp}
            rate={rate}
            qty={qty}
            setQty={setQty}
            productList={productList}
            batchList={batchList}
            onAdd={() => {
              handleAdd();
              setTimeout(() => {
                const element = document.getElementById("invoice-table");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }, 100);
              let nextIndex = currentPendingIndex + 1;
              while (nextIndex < pendingQueue.length && !pendingQueue[nextIndex]) {
                nextIndex++;
              }
              if (nextIndex < pendingQueue.length) {
                setItemName(pendingQueue[nextIndex].name);
                setQty(pendingQueue[nextIndex].qty);
                setCurrentPendingIndex(nextIndex);
                showToast(`➡️ ${pendingQueue[nextIndex].name} (Qty: ${pendingQueue[nextIndex].qty}) ready to process`, "info");
              } else {
                setItemName("");
                setPendingQueue([]);
                setCurrentPendingIndex(0);
                showToast("✅ All items from this buyer processed", "success");
              }
            }}
          />
          <div className="text-right">
            <button
              onClick={() => {
                const nextIndex = currentPendingIndex + 1;
                if (nextIndex < pendingQueue.length) {
                  setItemName(pendingQueue[nextIndex].name);
                  setQty(pendingQueue[nextIndex].qty);
                  setCurrentPendingIndex(nextIndex);
                  showToast(`⏭️ Skipped. Now: ${pendingQueue[nextIndex].name}`, "info");
                } else {
                  setItemName("");
                  setPendingQueue([]);
                  setCurrentPendingIndex(0);
                  showToast("✅ All items processed", "success");
                }
              }}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              ⏭️ Skip this item
            </button>
          </div>
          <div id="invoice-table">
            <InvoiceTable invoiceList={invoiceList} onRemove={handleRemove} />
          </div>
        </div>
      </div>

      {/* Box 2: Buyer List */}
      <div className="bg-white border shadow rounded p-4">
        <h3 className="font-semibold text-gray-800 mb-2">📋 All Pending Buyers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {pendingOrders.map((order, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPendingBuyer(order.buyer);
                setSelectedBuyer(order.buyer);
                setPendingQueue(order.items);
                const updated = applySchemeDiscountToInvoice(invoiceList, order.buyer, true);
                setInvoiceList(updated);
                setCurrentPendingIndex(0);
                setItemName(order.items[0].name);
                setQty(order.items[0].qty);
                showToast(`🔄 ${order.items[0].name} (Qty: ${order.items[0].qty}) ready to process`, "info");
              }}
              className="block text-left bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded text-sm border border-blue-200"
            >
              {order.buyer.name}
            </button>
          ))}
        </div>
      </div>
    </div>
    );
}
