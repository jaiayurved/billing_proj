// src/components/BuyerSelector.jsx
import React, { useState } from "react";

export default function BuyerSelector({ buyerList = [], buyer, setBuyer, highlightEmpty = false }) {
  const [buyerSearch, setBuyerSearch] = useState("");

  const filteredBuyers = buyerList.filter(b =>
    b.name.toLowerCase().includes(buyerSearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-sm text-gray-700">Search Buyer</label>
        <input
          type="text"
          value={buyerSearch}
          onChange={e => setBuyerSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Type to search..."
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">Select Buyer</label>
        <select
          value={buyer.name || ""}
          onChange={(e) => {
            const selected = buyerList.find(x => x.name === e.target.value);
            if (selected) {
              setBuyer({
  ...selected,
  discount: selected?.dis1 || selected?.discount || 0,
});

            }
          }}
          className={`w-full border rounded-md px-3 py-2 ${
            highlightEmpty && !buyer.name ? "animate-pulse border-red-400" : "border-gray-300"
          }`}
        >
          <option value="">-- Select Buyer --</option>
          {filteredBuyers.map((b) => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
