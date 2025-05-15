import React from "react";

export default function ProductGrid({
  baseMap,
  baseNames,
  cart,
  qtyMap,
  setQtyMap,
  variantMap,
  setVariantMap,
  handleAdd
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto mt-4">
      {baseNames.map((base) => (
        <div
          key={base}
          className="border border-gray-200 bg-white rounded-lg p-3 shadow-sm flex flex-col gap-2 min-h-[140px]"
        >
          <div className="text-sm font-semibold flex justify-between">
            {base}
            {cart.some(c => c.item === variantMap[base]?.name) && (
              <span className="text-green-600 font-bold">✔️ Added</span>
            )}
          </div>

          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={variantMap[base]?.name || ""}
            onChange={(e) => {
              const selected = baseMap[base].find(v => v.name === e.target.value);
              setVariantMap({ ...variantMap, [base]: selected });
            }}
          >
            <option value="">-- Select Variant --</option>
            {[...new Map(
              baseMap[base].map(v => [`${v.name}_${v.MRP}`, v])
            ).values()].map((v, i) => (
              <option key={i} value={v.name}>
                {v.name} {v.MRP ? `- ₹${v.MRP}` : ""}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Qty"
              value={qtyMap[base] || ""}
              onChange={(e) => setQtyMap({ ...qtyMap, [base]: e.target.value })}
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
  );
}
