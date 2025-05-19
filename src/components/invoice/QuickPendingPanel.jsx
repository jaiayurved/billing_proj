// src/components/invoice/QuickPendingPanel.jsx
import React from "react";

export default function QuickPendingPanel({
  pendingOrders = [],
  buyerList = [],
  setSelectedBuyer,
  setItemName,
  setQty,
  handleAdd,
  showToast,
  invoiceList = [],
  pendingQueue = [],
  autoScrollToNext = true,
}) {
  const handleClickItem = (item) => {
    const name = item.item || item.name;
    const isAlreadyInInvoice = invoiceList.some((row) => row.item === name);
    if (isAlreadyInInvoice) return;

    setItemName(name);
    setQty(item.qty || item.plannedQty || 1);
    showToast(`📟 Selected: ${name}`, "info");

    if (autoScrollToNext) {
      setTimeout(() => {
        const input = document.querySelector("input[name='qty']");
        if (input) input.focus();
      }, 200);
    }
  };

  return (
    <div className="space-y-1 text-sm h-[300px] overflow-auto px-1 whitespace-nowrap">
      {Array.isArray(pendingQueue) && pendingQueue.length === 0 && (
        <div className="text-gray-500 text-xs">📝 No pending items.</div>
      )}

      {Array.isArray(pendingQueue) &&
        pendingQueue.map((item, i) => {
          const name = item.item || item.name;
          const isAdded = invoiceList.some((row) => row.item === name);
          const isNext = i === invoiceList.length;

          return (
            <div
              key={i}
              ref={(el) => {
                if (isNext && el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              onClick={() => handleClickItem(item)}
              className={`cursor-pointer px-3 py-2 rounded border flex justify-between items-center shadow-sm transition duration-200 ${
                isAdded
                  ? "bg-green-100 text-green-700 line-through cursor-not-allowed"
                  : isNext
                  ? "bg-blue-100 text-blue-800 border-blue-300 animate-pulse"
                  : "hover:bg-blue-50 bg-white"
              }`}
            >
              <span className="font-medium">{name}</span>
              <span className="text-xs font-semibold text-gray-600">
                Qty: {item.qty || item.plannedQty || 0}
              </span>
            </div>
          );
        })}
    </div>
  );
}
