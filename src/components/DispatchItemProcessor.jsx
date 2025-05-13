// src/components/DispatchItemProcessor.jsx
import React, { useState } from "react";

export default function DispatchItemProcessor({ itemList, productList, onItemProcessed }) {
  const [index, setIndex] = useState(0);
  const currentItem = itemList[index];

  const [selectedBatch, setSelectedBatch] = useState("");
  const [qty, setQty] = useState("");

  if (!currentItem) return <div className="text-center p-4">✅ All items processed.</div>;

  const availableBatches = productList
    .filter(p => p.name === currentItem.item)
    .map(p => p.Batch);

  const handleNext = () => {
    const batchData = productList.find(
      p => p.name === currentItem.item && p.Batch === selectedBatch
    );

    if (!batchData || !qty) return alert("Please select batch and enter quantity.");

    const processed = {
      item: currentItem.item,
      batch: selectedBatch,
      qty,
      mfg: batchData.mfgDate,
      exp: batchData.expDate,
      rate: batchData.Rate || batchData.MRP,
      mrp: batchData.MRP,
      hsn: batchData.HSN,
      gst: batchData.Gst_rate
    };

    onItemProcessed(processed);
    setSelectedBatch("");
    setQty("");
    setIndex(index + 1);
  };

  return (
    <div className="space-y-4 border p-4 rounded">
      <h3 className="font-semibold">Process Item {index + 1} of {itemList.length}</h3>
      <p><strong>Item:</strong> {currentItem.item}</p>
      <p><strong>Planned Qty:</strong> {currentItem.plannedQty}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Batch</label>
          <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="w-full border px-2 py-1">
            <option value="">Select Batch</option>
            {availableBatches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label>Qty</label>
          <input
            type="number"
            value={qty}
            onChange={e => setQty(e.target.value)}
            className="w-full border px-2 py-1"
          />
        </div>
      </div>

      <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">
        ✅ Add to Invoice & Next
      </button>
    </div>
  );
}
