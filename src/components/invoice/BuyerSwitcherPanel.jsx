// src/components/invoice/BuyerSwitcherPanel.jsx
import React, { useState } from "react";
import BuyerInfoPanel from "./BuyerInfoPanel";

export default function BuyerSwitcherPanel({
  selectedBuyer,
  setSelectedBuyer,
  selectedPendingBuyer,
  setSelectedPendingBuyer,
  buyerList,
  invoiceList,
  setInvoiceList,
  setPendingQueue,
  showToast,
  pendingOrders = [],
  setItemName,
  setQty,
  setSelectedBatch,
  setMfg,
  setExp,
  setRate,
  productEntryComponent,
  quickPendingComponent
}) {
  const [collapsed, setCollapsed] = useState(false);

  const handleSelectPendingBuyer = (entry) => {
    const buyer = entry.buyer;
    const confirmChange = invoiceList.length > 0
      ? window.confirm("⚠️ Invoice already has items. Do you want to clear and load this pending order?")
      : true;

    if (!confirmChange) return;

    const enrichedBuyer = buyerList.find(b => b.name === buyer.name);
    const fullBuyer = {
      ...buyer,
      ...enrichedBuyer,
      discount: enrichedBuyer?.discount || enrichedBuyer?.dis1 || 0,
      scheme: enrichedBuyer?.scheme || "0+0",
      type: enrichedBuyer?.type || ""
    };

    setSelectedBuyer(fullBuyer);
    setSelectedPendingBuyer(fullBuyer);
    setInvoiceList([]);
    setPendingQueue(entry.orderItems || []);
    setItemName("");
    setQty("");
    setSelectedBatch("");
    setMfg("");
    setExp("");
    setRate("");
    showToast(`📦 Loaded items for ${buyer.name}`, "success");
  };

  return (
    <>
      <div className="border rounded-md shadow-md p-2 bg-white">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs text-blue-600 underline mb-1"
        >
          {collapsed ? "➕ Show Buyer Selector" : "➖ Hide Buyer Selector"}
        </button>







        {!collapsed && (
          selectedPendingBuyer ? (
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3 shadow">
              <div className="space-y-1">
                <div className="text-l text-gray-800 font-bold">
                  🧝 {selectedPendingBuyer.name}
                </div>
                <div className="text-xs text-gray-400">
                  GSTIN: {selectedPendingBuyer.gstin || "NA"}
                </div>
                <span className="inline-block text-[5px] bg-yellow-300 text-yellow-900 px-2 py-[2px] rounded-full font-semibold tracking-wide">
                  📌 Pending Order
                </span>
              </div>
              <button
                onClick={() => {
                  if (invoiceList.length > 0) {
                    const confirmChange = window.confirm("⚠️ Invoice already has items. Do you want to clear and change buyer?");
                    if (!confirmChange) return;
                    setInvoiceList([]);
                    setPendingQueue([]);
                    setItemName("");
                    setQty("");
                    setSelectedBatch("");
                    setSelectedPendingBuyer(null);
                    setSelectedBuyer(null);
                    showToast("🧹 Cleared existing invoice", "info");
                  } else {
                    setSelectedPendingBuyer(null);
                    setSelectedBuyer(null);
                  }
                }}
                className="text-xs text-blue-600 underline mt-2"
              >
                Change
              </button>
            </div>
          ) : (
            <BuyerInfoPanel
              buyerList={buyerList}
              selectedBuyer={selectedBuyer}
              setSelectedBuyer={setSelectedBuyer}
              invoiceList={invoiceList}
              setInvoiceList={setInvoiceList}
            />
          )
        )}

        <div className="mt-4">
          <h4 className="...">📋 Select Pending Buyer ({pendingOrders.length})</h4>
 <div className="grid grid-cols-3 gap-3">
            {pendingOrders.map((entry, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPendingBuyer(entry)}
                className="text-left border px-2 py-1 rounded hover:bg-red-50 text-sm bg-yellow-100 shadow-sm"
              >
                🧍 {entry.buyer.name}
              </button>
            ))}
          </div>
        </div>
      </div> 
          </>
  );
}
