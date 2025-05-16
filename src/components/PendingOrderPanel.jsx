import React from "react";
import ProductEntrySection from "./invoice/ProductEntrySection";
import InvoiceSummaryPanel from "./invoice/InvoiceSummaryPanel";
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
  selectedBatch,
  setSelectedBatch,
  mfg,
  exp,
  rate,
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
  setInvoiceList,
  buyerList
}) {
  return (
    <div className="space-y-6 bg-green-50 min-h-screen p-4">
      <div className="flex gap-6">
        <div className="w-1/4 bg-white border shadow rounded p-3">
          <h3 className="font-semibold text-gray-800 mb-2">
            👤 {selectedPendingBuyer?.name || "Select a buyer"}{" "}
            <span className="text-xs text-gray-500 ml-1">
              ({selectedPendingBuyer?.type || "Type Unknown"})
            </span>
          </h3>

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
                    const buyerMatch = buyerList?.find(b => b.name === selectedPendingBuyer?.name) || {};
                    const enriched = {
                      ...selectedPendingBuyer,
                      ...buyerMatch,
                      discount: buyerMatch?.discount || buyerMatch?.dis1 || 0,
                      scheme: buyerMatch?.scheme || "0+0"
                    };
                    setSelectedBuyer(enriched);
                    setInvoiceList(applySchemeDiscountToInvoice(invoiceList, enriched, true));
                    setCurrentPendingIndex(idx);
                    setItemName(item.name || item.item);
                    setQty(item.qty || item.plannedQty);
                    showToast(`🔄 ${item.name || item.item} (Qty: ${item.qty || item.plannedQty}) ready to process`, "info");
                  }}
                >
                  {item.name || item.item} — Qty: {item.qty || item.plannedQty}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-3/4 space-y-4">
          <h2 className="text-xl font-bold text-gray-700">🧾 Process Items</h2>

          <div className="text-sm text-gray-700 font-medium bg-blue-50 px-4 py-2 rounded border border-blue-200">
            Processing: {selectedPendingBuyer?.name || "-"} — Item {currentPendingIndex + 1} of {pendingQueue.length}
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
            handleAdd={() => {
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
                setItemName(pendingQueue[nextIndex].name || pendingQueue[nextIndex].item);
                setQty(pendingQueue[nextIndex].qty || pendingQueue[nextIndex].plannedQty);
                setCurrentPendingIndex(nextIndex);
                showToast(`➡️ ${pendingQueue[nextIndex].name || pendingQueue[nextIndex].item} (Qty: ${pendingQueue[nextIndex].qty || pendingQueue[nextIndex].plannedQty}) ready to process`, "info");
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
                  setItemName(pendingQueue[nextIndex].name || pendingQueue[nextIndex].item);
                  setQty(pendingQueue[nextIndex].qty || pendingQueue[nextIndex].plannedQty);
                  setCurrentPendingIndex(nextIndex);
                  showToast(`⏭️ Skipped. Now: ${pendingQueue[nextIndex].name || pendingQueue[nextIndex].item}`, "info");
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

          <div id="invoice-table" className="w-full sticky top-32">
            <InvoiceSummaryPanel invoiceList={invoiceList} handleRemove={handleRemove} />
          </div>
        </div>
      </div>

      {/* All Buyers Card View */}
      <div className="bg-white border shadow rounded p-4 sticky bottom-0 z-10">
        <h3 className="font-semibold text-gray-800 mb-2">📋 All Pending Buyers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
         {pendingOrders.map((order, idx) => {
  const match = Array.isArray(buyerList) ? buyerList.find(b => b.name === order.buyer.name) : {};
  const enriched = {
    ...order.buyer,
    ...match,
    discount: match?.discount || match?.dis1 || 0,
    scheme: match?.scheme || "0+0",
    type: match?.type || ""
  };
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedPendingBuyer(enriched);
                  setSelectedBuyer(enriched);
                  setPendingQueue(order.items);
                  setInvoiceList(applySchemeDiscountToInvoice(invoiceList, enriched, true));
                  setCurrentPendingIndex(0);
                  if (order.items.length > 0) {
                    const firstItem = order.items[0];
                    setItemName(firstItem.name || firstItem.item);
                    setQty(firstItem.qty || firstItem.plannedQty);
                    showToast(`🔄 ${firstItem.name || firstItem.item} (Qty: ${firstItem.qty || firstItem.plannedQty}) ready to process`, "info");
                  } else {
                    setItemName("");
                    setQty("");
                    showToast("⚠️ No items found for this buyer", "warning");
                  }
                }}
                className="block text-left bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded text-sm border border-blue-200"
              >
                {order.buyer.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
