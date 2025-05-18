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
  handleAdd,
  hideAddButton = false,
  readOnly = false,
  onAfterAdd = null,
  expectedQty = null,
  invoiceList = []
}) {
  const batchList = Array.from(
    new Set(
      productList
        .filter((p) => p.name === itemName && p.Batch?.trim())
        .map((p) => p.Batch)
    )
  );

  useEffect(() => {
    const batches = productList
      .filter((p) => p.name === itemName && p.Batch?.trim())
      .map((p) => p.Batch);

    if (batches.length > 0) {
      const latestBatch = batches.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0];
      setSelectedBatch(latestBatch);
    }
  }, [itemName]);

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
  }, [selectedBatch]);

  const handleAddAndReset = () => {
    const isAlreadyUsed = invoiceList.some(
      (row) => row.item === itemName && row.batch === selectedBatch
    );
    if (isAlreadyUsed) return alert("⚠️ This batch is already used for this item.");

    handleAdd();

    const used = parseInt(qty || 0);
    const expected = parseInt(expectedQty || 0);
    const remaining = expected - used;

    if (expected && remaining > 0) {
      setQty(remaining);
      return;
    }

    setItemName("");
    setSelectedBatch("");
    setQty("");

    const el = document.getElementById("item-select");
    if (el) {
      el.classList.add("ring-2", "ring-blue-400");
      el.focus();
      setTimeout(() => el.classList.remove("ring-2", "ring-blue-400"), 1200);
    }

    if (typeof onAfterAdd === "function") onAfterAdd();
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <select
          id="item-select"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          disabled={readOnly}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Item --</option>
          {[...new Set(productList.map((p) => p.name))].map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Batch No.</label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          disabled={readOnly}
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
          name="qty"
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          readOnly={readOnly}
          className="w-20 border px-3 py-2 rounded"
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
          onChange={(e) => setRate(e.target.value)}
          readOnly={readOnly}
          className="w-24 border px-3 py-2 rounded"
        />
      </div>

      {!hideAddButton && (
        <div className="col-span-6 text-right pt-2">
          <button
            onClick={handleAddAndReset}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            ➕ Add to Invoice
          </button>
        </div>
      )}
    </div>
  );
}