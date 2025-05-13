// src/components/invoice/BuyerInfoPanel.jsx
import React, { useState } from "react";
import BuyerSelector from "../BuyerSelector";

export default function BuyerInfoPanel({ buyerList, selectedBuyer, setSelectedBuyer }) {
  const [buyerSearch, setBuyerSearch] = useState("");

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 space-y-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">🧍 Buyer Details</h2>
      <BuyerSelector
        buyerList={buyerList}
        buyerSearch={buyerSearch}
        setBuyerSearch={setBuyerSearch}
        onSelect={setSelectedBuyer}
      />
      {selectedBuyer && (
        <div className="text-sm text-gray-600 pt-2">
          <div><strong>GSTIN:</strong> {selectedBuyer.gstin || "NA"}</div>
          <div><strong>City:</strong> {selectedBuyer.city || "NA"}</div>
        </div>
      )}
    </div>
  );
}
