// src/components/invoice/ProductEntrySection.jsx
import React, { useEffect } from "react";

export default function ProductEntrySection({
  productList,
  itemName,
  setItemName,
  selectedBatch,
  setSelectedBatch,
  mfg,
  setMfg,
  exp,
  setExp,
  rate,
  setRate,
  qty,
  setQty,
  handleAdd
}) {
  const batchList = productList
    .filter((p) => p.name === itemName)
    .map((p) => p.Batch);

  useEffect(() => {
    const product = productList.find(
      (p) => p.name === itemName && p.Batch === selectedBatch
    );
    if (product) {
      setMfg(
        new Date(product.mfgDate)
          .toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
          .replace(" ", "-")
      );
      setExp(
        new Date(product.expDate)
          .toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
          .replace(" ", "-")
      );
      setRate(product.Rate || product.MRP || "");
    }
  }, [itemName, selectedBatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <select
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Item --</option>
          {Array.from(new Set(productList.map((p) => p.name))).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Batch No.</label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Batch --</option>
          {batchList.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Qty</label>
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter quantity"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">MFG</label>
        <input
          type="text"
          value={mfg}
          readOnly
          className="w-24 border px-3 py-2 bg-gray-100 rounded"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">EXP</label>
        <input
          type="text"
          value={exp}
          readOnly
          className="w-24 border px-3 py-2 bg-gray-100 rounded"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">Rate</label>
        <input
          type="text"
          value={rate}
          readOnly
          className="w-24 border px-3 py-2 bg-gray-100 rounded"
        />
      </div>

      <div className="col-span-6 text-right pt-2">
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          ➕ Add to Invoice
        </button>
      </div>
    </div>
  );
}
