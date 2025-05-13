// src/components/views/ManualOrderForm.jsx
import React, { useState } from "react";
import BuyerSelector from "../BuyerSelector";
import InvoiceCartReview from "../InvoiceCartReview";

export default function ManualOrderForm() {
  const [buyer, setBuyer] = useState(null);
  const [cart, setCart] = useState([]);

  const addItem = (item) => {
    setCart([...cart, item]);
  };

  const removeItem = (index) => {
    const copy = [...cart];
    copy.splice(index, 1);
    setCart(copy);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Manual Invoice Entry</h2>

      <BuyerSelector selected={buyer} setSelected={setBuyer} />

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Add Item</h3>
        {/* Placeholder: this can become a full AddItemForm component */}
        <button
          onClick={() =>
            addItem({
              item: "Triphala Churna",
              batch: "TPH24A",
              mfg: "01-2024",
              exp: "12-2026",
              rate: 45,
              qty: 10,
              amount: 450,
            })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Dummy Item
        </button>
      </div>

      <InvoiceCartReview buyer={buyer} cart={cart} onRemove={removeItem} />
    </div>
  );
}
