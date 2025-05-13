// src/components/invoice/ProductEntrySection.jsx
import React, { useEffect } from "react";
import ItemEntryForm from "../ItemEntryForm";

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
  const batchList = [...new Set(
    productList.filter((p) => p.name === itemName).map((p) => p.Batch)
  )];

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
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        ➕ Add Product to Invoice
      </h2>
      <ItemEntryForm
        itemName={itemName}
        setItemName={setItemName}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
        mfg={mfg}
        exp={exp}
        rate={rate}
        qty={qty}
        setQty={setQty}
        productList={productList}
        batchList={batchList}
        onAdd={handleAdd}
      />
    </div>
  );
}
