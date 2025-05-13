// src/components/NewOrderForm.jsx
import React, { useState, useEffect } from "react";
import useToast from "../hooks/useToast";
import { exportInvoiceToGoogleSheet } from "../utils/submitOrderToSheet";
import { SHEET_URL } from "../components/config/gsheet";

export default function NewOrderForm({ productList }) {
  const [buyerList, setBuyerList] = useState([]);
  const [buyer, setBuyer] = useState({ name: "", phone: "" });
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [qtyMap, setQtyMap] = useState({});
  const [variantMap, setVariantMap] = useState({});
  const showToast = useToast();
const handleTestSubmit = async () => {
  const payload = {
    dealer: {
      name: "Ashish Mishra",
      phone: "9929988408"
    },
    order: [
      { item: "Keyuramrit Oil", qty: 12 },
      { item: "LIV Syrup", qty: 24 }
    ]
  };

  try {
    const response = await fetch(`${SHEET_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("✅ Response from server:", result);
    showToast("✅ Test order sent", "success");
  } catch (error) {
    console.error("❌ Failed to send order:", error);
    showToast("❌ Failed to send test order", "error");
  }
};









  useEffect(() => {
    fetch(`${SHEET_URL}?type=buyers`)
      .then((res) => res.json())
      .then(setBuyerList)
      .catch(() => showToast("❌ Failed to load buyers", "error"));
  }, []);

  const baseMap = {};
  productList.forEach((p) => {
    const base = p.base || p.name.split(" ")[0];
    if (!baseMap[base]) baseMap[base] = [];
    baseMap[base].push(p);
  });

  const baseNames = Object.keys(baseMap).filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (base) => {
    const variant = variantMap[base];
    const qty = parseInt(qtyMap[base]) || 0;
    if (!variant || qty <= 0) return showToast("❗ Select variant and qty", "error");
    setCart([...cart, { item: variant.name, qty }]);
    setQtyMap({ ...qtyMap, [base]: "" });
    showToast("✅ Item added", "success");
  };

  const handleSubmit = async () => {
    if (!buyer.name || cart.length === 0) {
      showToast("⚠️ Enter buyer and at least one item", "error");
      return;
    }
    try {
      await exportInvoiceToGoogleSheet({ dealer: buyer, order: cart });
      showToast("✅ Order saved to Order_List", "success");
      setBuyer({ name: "", phone: "" });
      setCart([]);
      setQtyMap({});
      setVariantMap({});
    } catch (err) {
      showToast("❌ Failed to save order", "error");
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto text-gray-800">
      <h2 className="text-2xl font-bold text-blue-900">📋 Book New Order</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={buyer.name}
          onChange={(e) => {
            const selected = buyerList.find(b => b.name === e.target.value);
            if (selected) {
              setBuyer({ name: selected.name, phone: selected.phone || "" });
            }
          }}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">-- Select Buyer --</option>
          {buyerList.map((b, i) => (
            <option key={i} value={b.name}>{b.name}</option>
          ))}
        </select>
        <input
          placeholder="Phone (optional)"
          value={buyer.phone}
          onChange={e => setBuyer({ ...buyer, phone: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
        />
      </div>

      <input
        placeholder="Search item..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-200"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
        {baseNames.map((base) => (
          <div
            key={base}
            className="border border-gray-200 bg-white rounded-lg p-3 shadow-sm flex flex-col gap-2 min-h-[140px]"
          >
            <div className="text-sm font-semibold">{base}</div>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={variantMap[base]?.name || ""}
              onChange={(e) => {
                const selected = baseMap[base].find(v => v.name === e.target.value);
                setVariantMap({ ...variantMap, [base]: selected });
              }}
            >
              <option value="">-- Select Variant --</option>
              {baseMap[base].map((v, i) => (
                <option key={i} value={v.name}>{v.name} {v.MRP ? `- ₹${v.MRP}` : ""}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Qty"
                value={qtyMap[base] || ""}
                onChange={e => setQtyMap({ ...qtyMap, [base]: e.target.value })}
                className="w-16 border border-gray-300 rounded px-2 py-1"
              />
              <button
                onClick={() => handleAdd(base)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-gray-300 pt-4 space-y-3">
          <h3 className="font-semibold text-lg">🧾 Items in Order</h3>
          <ul className="text-sm list-disc list-inside text-gray-700">
            {cart.map((r, i) => <li key={i}>{r.item} — {r.qty}</li>)}
          </ul>
          <button
            onClick={handleSubmit}
            className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow"
          >
            ✅ Save Order
          </button>




<button
  onClick={handleTestSubmit}
  className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-md shadow"
>
  🧪 Send Test Order
</button>






        </div>
      )}
    </div>
  );
}
