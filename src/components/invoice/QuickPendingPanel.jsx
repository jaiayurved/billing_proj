// src/components/invoice/QuickPendingPanel.jsx
import React, { useState } from "react";

export default function QuickPendingPanel({
  pendingOrders = [],
  buyerList = [],
  setSelectedBuyer,
  setSelectedPendingBuyer,
  setPendingQueue,
  setCurrentPendingIndex,
  setItemName,
  setQty,
  handleAdd,
  showToast,
  invoiceList = []
}) {
  const [selectedBuyerName, setSelectedBuyerName] = useState(null);

  const handleSelectBuyer = (buyer) => {
    const buyerData = buyerList.find(b => b.name === buyer.name) || {};
    const enriched = {
      ...buyer,
      ...buyerData,
      discount: buyerData?.discount || buyerData?.dis1 || 0,
      scheme: buyerData?.scheme || "0+0",
      type: buyerData?.type || ""
    };

    setSelectedBuyer(enriched);
    setSelectedPendingBuyer(enriched);
    setPendingQueue(buyer.items);
    setCurrentPendingIndex(0);
    setSelectedBuyerName(buyer.name);
  };

  const handleAddItem = (item) => {
  setItemName(item.name || item.item);
  setQty(item.qty || item.plannedQty);
  showToast(`${item.name || item.item} added to cart`, "info");
};


  const isItemInCart = (itemName) =>
    invoiceList.some((row) => row.item === itemName);

  return (
    <div className="bg-white border border-blue-300 rounded-md p-4 shadow-md text-sm h-full">
      <h4 className="text-blue-700 font-semibold mb-2">📌 Pending Orders</h4>

      {!selectedBuyerName && (
        <div className="space-y-2">
          {pendingOrders.map((order, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectBuyer(order.buyer)}
              className="block text-left w-full px-3 py-2 rounded border border-blue-100 hover:bg-blue-50"
            >
              {order.buyer.name}
            </button>
          ))}
        </div>
      )}

      {selectedBuyerName && (
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-blue-600">🧍 {selectedBuyerName}</span>
            <button
              onClick={() => setSelectedBuyerName(null)}
              className="text-xs text-gray-500 hover:underline"
            >
              🔙 Back to Buyer List
            </button>
          </div>

          <div className="space-y-2">
            {pendingOrders.find(p => p.buyer.name === selectedBuyerName)?.items.map((item, idx) => {
              const itemName = item.name || item.item;
              const alreadyAdded = isItemInCart(itemName);

              return (
                <div
                  key={idx}
                  onClick={() => !alreadyAdded && handleAddItem(item)}
                  className={`flex justify-between items-center border rounded px-3 py-2 cursor-pointer ${
                    alreadyAdded
                      ? "bg-green-100 text-gray-500 cursor-not-allowed line-through"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <div className="font-medium">{itemName}</div>
                  <div className="text-xs text-gray-600">
                    Qty: {item.qty || item.plannedQty}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
