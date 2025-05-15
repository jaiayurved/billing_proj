import React from "react";

export default function CartReviewPanel({ cart, buyer, handleSubmit, handleClearCart }) {
  const canSubmit = buyer?.name && cart.length > 0;

  return (
    <div className="lg:col-span-1 border border-gray-300 rounded-xl p-4 h-fit sticky top-20 bg-white shadow-md">
      <h3 className="font-semibold text-lg mb-2">
        🧾 Items in Order ({cart.length})
        {buyer?.name ? (
          <span className="block text-sm text-blue-800 font-bold mt-1">
            👤 {buyer.name}
          </span>
        ) : (
          <span className="block text-sm text-red-600 font-semibold animate-pulse mt-1">
            ⚠️ Please select a buyer
          </span>
        )}
      </h3>
      <ul className="text-sm text-gray-700 mb-4">
        {cart.map((r, i) => (
          <li key={i} className="py-1 border-b border-gray-200">
            {r.item} — {r.qty}
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full font-semibold px-4 py-2 rounded-md shadow transition text-white ${
          canSubmit
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        ✅ Save Order
      </button>
      <button
        onClick={handleClearCart}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-3 py-1.5 rounded mt-2 text-sm"
      >
        🧹 Clear Cart
      </button>
    </div>
  );
}
