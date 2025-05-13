// src/components/ItemEntryForm.jsx
import React from "react";

export default function ItemEntryForm({
  itemName,
  setItemName,
  selectedBatch,
  setSelectedBatch,
  mfg,
  exp,
  rate,
  qty,
  setQty,
  productList,
  batchList,
  onAdd
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Item Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
        <select
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">Select Item</option>
          {[...new Set(productList.map(p => p.name))].map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* Batch No. */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Batch No.</label>
        <select
          value={selectedBatch}
          onChange={e => setSelectedBatch(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">Select Batch</option>
          {batchList.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          value={qty}
          onChange={e => setQty(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* MFG Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">MFG</label>
        <input
          value={mfg}
          readOnly
          className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2"
        />
      </div>

      {/* EXP Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">EXP</label>
        <input
          value={exp}
          readOnly
          className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2"
        />
      </div>

      {/* Rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
        <input
          value={rate}
          readOnly
          className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2"
        />
      </div>

      {/* Add Button */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-right">
        <button
          onClick={onAdd}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow-sm transition"
        >
          ➕ Add to Invoice
        </button>
      </div>
    </div>
  );
}