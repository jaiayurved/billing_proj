// src/components/views/OrderEditor.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BuyerSelector from "../BuyerSelector";
import InvoiceCartReview from "../InvoiceCartReview";

export default function OrderEditor() {
  const { id } = useParams();
  const [buyer, setBuyer] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Simulate fetch order by ID
    if (id === "ORD001") {
      setBuyer({ name: "Raj Pharma", gstin: "08ABCDE1234FZ1", city: "Jaipur", type: "JAI" });
      setCart([
        { item: "LIV Syrup 300ml", batch: "LIV24B", mfg: "05-2024", exp: "04-2027", rate: 85, qty: 12, amount: 1020 },
        { item: "Chyawanprash", batch: "CYP25C", mfg: "02-2025", exp: "01-2028", rate: 195, qty: 6, amount: 1170 }
      ]);
    }
  }, [id]);

  const removeItem = (index) => {
    const copy = [...cart];
    copy.splice(index, 1);
    setCart(copy);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Edit Pre-Booked Order</h2>
      <div className="text-sm text-gray-600">Order ID: {id}</div>

      <BuyerSelector selected={buyer} setSelected={setBuyer} />

      <InvoiceCartReview buyer={buyer} cart={cart} onRemove={removeItem} />
    </div>
  );
}
