// src/components/BuyerSelector.jsx
import React from "react";

export default function BuyerSelector({ buyerList = [], buyerSearch, setBuyerSearch, onSelect }) {
  const filteredBuyers = Array.isArray(buyerList)
    ? buyerList.filter(b =>
        b.name?.toLowerCase().includes(buyerSearch?.toLowerCase() || "")
      )
    : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label>Search Buyer</label>
        <input
          type="text"
          value={buyerSearch}
          onChange={e => setBuyerSearch(e.target.value)}
          className="w-full border px-2 py-1"
          placeholder="Type to search..."
        />
      </div>
      <div>
        <label>Select Buyer</label>
        <select
          className="w-full border px-2 py-1"
          onChange={e => {
            const b = buyerList.find(x => x.name === e.target.value);
            if (b) {
              const enriched = { ...b, discount: b?.dis1 || 0 };
              onSelect(enriched);
            }
          }}
        >
          <option value="">Select Buyer</option>
          {filteredBuyers.map(b => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
