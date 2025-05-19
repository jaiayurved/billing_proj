
import React, { useState, useEffect } from "react";
import useToast from "../hooks/useToast";
import useCartStorage from "../hooks/useCartStorage";
import { openWhatsAppWithInvoice, exportInvoiceToCSV } from "./export/InvoiceExporter";
import { exportInvoiceToLocalServer } from "../utils/submitOrderToAPI";
import { useNavigate } from "react-router-dom";

export default function NewOrderForm({ productList, setActiveTab }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [buyerList, setBuyerList] = useState([]);
  const [buyer, setBuyer] = useState({});
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { cart, setCart, clearCart } = useCartStorage("newOrderCart");
  const [qtyMap, setQtyMap] = useState({});
  const [variantMap, setVariantMap] = useState({});

  const showToast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/buyers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBuyerList(data);
        else {
          showToast("❌ Invalid buyer list received", "error");
          setBuyerList([]);
        }
      })
      .catch(() => showToast("❌ Failed to load buyers", "error"));
  }, []);

  const allCategories = ["All", ...new Set(productList.map(p => p.category || p.Category || "").filter(Boolean))];

  const baseMap = {};
  const seenNames = new Set();
  productList.forEach(p => {
    const cat = p.category || p.Category;
    const base = p.base || p.name.split(" ")[0];
    if (selectedCategory !== "All" && cat !== selectedCategory) return;
    if (seenNames.has(p.name)) return;
    seenNames.add(p.name);
    if (!baseMap[base]) baseMap[base] = [];
    baseMap[base].push(p);
  });

  const baseNames = Object.keys(baseMap).filter(base =>
    base.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (base) => {
    const variant = variantMap[base];
    const qty = parseInt(qtyMap[base]) || 0;
    if (!variant || qty <= 0) return showToast("❗ Select variant and qty", "error");

    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex(item => item.item === variant.name);
    const rate = variant.Rate || variant.MRP || 0;
    const amount = qty * rate;

    if (existingIndex >= 0) {
      updatedCart[existingIndex].qty += qty;
      updatedCart[existingIndex].amount += amount;
    } else {
      updatedCart.push({ item: variant.name, qty, rate, amount });
    }
    setCart(updatedCart);
    setQtyMap({ ...qtyMap, [base]: "" });
    showToast("✅ Item added", "success");
  };

  const handleRemove = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const handleSubmit = async () => {
    if (!buyer.name || cart.length === 0) {
      showToast("⚠️ Enter buyer and at least one item", "error");
      return;
    }
    try {
      await exportInvoiceToLocalServer({ buyerName: buyer.name, phone: buyer.phone || "", order: cart });
      showToast("✅ Order saved", "success");
      setBuyer({});
      setCart([]);
      setQtyMap({});
      setVariantMap({});
      clearCart();
    } catch (err) {
      showToast("❌ Failed to save order", "error");
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setBuyer({});
    clearCart();
    showToast("Cart cleared", "info");
  };

  return (
    <div className="space-y-4">
      <div className="flex overflow-x-auto gap-2 px-2 sticky top-10 z-30 bg-white py-2 shadow-sm">
        {allCategories.map((cat, i) => (
          <button
            key={i}
            className={`px-2 py-1 rounded-full border text-xs font-medium transition whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 px-2">
        <div className="bg-blue-50 shadow-md rounded-md p-3">
          <div className="relative">
            <input
              placeholder=" Search item..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full mb-3"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-2 text-gray-500">×</button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
            {baseNames.map(base => {
              const variant = variantMap[base];
              const isAlreadyAdded = cart.some(c => c.item === variant?.name);
              return (
                <div
                  key={base}
                  className={`p-3 border rounded-md shadow-sm ${isAlreadyAdded ? 'bg-green-100 border-green-400' : 'bg-gray-50'}`}
                >
                  <div className="font-semibold mb-1">{base}</div>
                  <select
                    value={variant?.name || ""}
                    onChange={e => {
                      const selected = baseMap[base].find(p => p.name === e.target.value);
                      setVariantMap({ ...variantMap, [base]: selected });
                    }}
                    className="w-full border px-2 py-1 rounded mb-2 text-sm"
                  >
                    <option value="">-- Select Variant --</option>
                    {baseMap[base].map((v, i) => (
                      <option key={i} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={qtyMap[base] || ""}
                      onChange={e => setQtyMap({ ...qtyMap, [base]: e.target.value })}
                      className="w-20 border px-2 py-1 rounded text-sm"
                    />
                    <button
                      onClick={() => handleAdd(base)}
                      disabled={isAlreadyAdded}
                      className={`px-2 py-1 text-xs rounded font-medium ${isAlreadyAdded ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      ➕ Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sticky top-24 bg-green-50 rounded-md shadow-md p-3 space-y-3 text-sm">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Select Buyer</label>
            <select
              value={buyer.name || ""}
              onChange={e => {
                const b = buyerList.find(x => x.name === e.target.value);
                if (b) setBuyer({ name: b.name, phone: b.phone || "", type: b.type || "" });
              }}
              className="border px-3 py-2 rounded-md text-sm"
            >
              <option value="">-- Select Buyer --</option>
              {buyerList.map((b, i) => <option key={i} value={b.name}>{b.name} {b.type ? `(${b.type})` : ""}</option>)}
            </select>
          </div>

          <h3 className="text-sm font-semibold text-green-800">🛒 Order Summary</h3>
          {cart.length === 0 ? (
            <p className="text-xs text-gray-500">No items added yet.</p>
          ) : (
            <ul className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
              {cart.map((r, i) => (
                <li key={i} className="border-b pb-1 flex justify-between items-center">
                  <span><strong>{r.item}</strong> × {r.qty}</span>
                  <button onClick={() => handleRemove(i)} className="text-red-500 text-xs">❌</button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col gap-1">
            <button
              onClick={handleSubmit}
              disabled={!buyer.name}
              className={`py-1.5 rounded text-xs font-medium shadow ${
                buyer.name ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              ✅ Save Order
            </button>
            <button
              onClick={() => openWhatsAppWithInvoice(buyer, cart)}
              disabled={!buyer.name}
              className={`py-1.5 rounded text-xs font-medium shadow ${
                buyer.name ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              📤 Send WhatsApp
            </button>
            <button
              onClick={() => exportInvoiceToCSV(buyer, cart)}
              disabled={!buyer.name}
              className={`py-1.5 rounded text-xs font-medium shadow ${
                buyer.name ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              ⬇️ Export CSV
            </button>
            <button
              onClick={handleClearCart}
              className="py-1.5 rounded text-xs font-medium shadow bg-red-500 hover:bg-red-600 text-white"
            >
              🧹 Clear Cart
            </button>
          </div>
        </div>
      </div>

      <button type="button" onClick={() => setActiveTab("invoice")}
        className="fixed bottom-5 left-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
      >
        🔙 Back to Invoice
      </button>
    </div>
  );
}
