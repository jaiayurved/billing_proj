// src/components/invoice/BuyerSwitcherPanel.jsx
import React, { useState } from "react";

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
  const [buyerSearch, setBuyerSearch] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);

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

  const handleSelectManualBuyer = (e) => {
    const selected = buyerList.find(b => b.name === e.target.value);
    if (selected) {
      const enriched = { ...selected, discount: selected?.dis1 || 0 };
      setSelectedBuyer(enriched);
      setSelectedPendingBuyer(enriched);
      showToast(`✅ Selected buyer: ${enriched.name}`, "success");
    }
  };

  const filteredBuyers = Array.isArray(buyerList)
    ? buyerList.filter(b =>
        b.name?.toLowerCase().includes(buyerSearch?.toLowerCase() || "")
      )
    : [];

  return (
    <div className="border rounded-md shadow-md p-4 bg-white">
      {selectedPendingBuyer && (
        <div className="bg-yellow-50 border border-yellow-300 rounded p-3 shadow mb-4">
          <div className="space-y-1">
            <div className="text-l text-gray-800 font-bold">🧝 {selectedPendingBuyer.name}</div>
            <div className="text-xs text-gray-400">GSTIN: {selectedPendingBuyer.gstin || "NA"}</div>
            <span className="inline-block text-[10px] bg-yellow-300 text-yellow-900 px-2 py-[2px] rounded-full font-semibold tracking-wide">
              📌 Pending Order
            </span>
          </div>
          <button
            onClick={() => {
              const confirmChange = invoiceList.length > 0
                ? window.confirm("⚠️ Invoice already has items. Do you want to clear and change buyer?")
                : true;
              if (!confirmChange) return;
              setInvoiceList([]);
              setPendingQueue([]);
              setItemName("");
              setQty("");
              setSelectedBatch("");
              setSelectedPendingBuyer(null);
              setSelectedBuyer(null);
              showToast("🧹 Cleared existing invoice", "info");
            }}
            className="text-xs text-blue-600 underline mt-2"
          >
            Change
          </button>
        </div>
      )}

      <h4 className="text-md font-semibold mb-2">📋 Select Pending Buyer ({pendingOrders.length})</h4>
      <div className="grid grid-cols-3 gap-3 overflow-x-auto">
        {pendingOrders.map((entry, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPendingBuyer(entry)}
            className={`text-left border px-2 py-1 rounded text-sm shadow-sm
              ${selectedPendingBuyer?.name === entry.buyer.name
                ? "bg-green-200 border-green-500 font-bold"
                : "bg-yellow-100 hover:bg-red-50"}`}
          >
            🧍 {entry.buyer.name}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowManualEntry(!showManualEntry)}
        className="mt-4 text-sm text-blue-600 underline"
      >
        ➕ Add New Buyer
      </button>

      {showManualEntry && (
        <div className="mt-4 p-3 border-t pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Buyer</label>
              <input
                type="text"
                value={buyerSearch}
                onChange={e => setBuyerSearch(e.target.value)}
                className="w-full border px-2 py-1 rounded"
                placeholder="Type to search..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Buyer</label>
              <select
                className="w-full border px-2 py-1 rounded"
                onChange={handleSelectManualBuyer}
                value={selectedBuyer?.name || ""}
              >
                <option value="">-- Select Buyer --</option>
                {filteredBuyers.map(b => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
