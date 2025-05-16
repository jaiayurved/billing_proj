import React, { useState, useEffect } from "react";
import useToast from "../hooks/useToast";
import { exportInvoiceToGoogleSheet } from "../utils/submitOrderToSheet";

import { openWhatsAppWithInvoice, exportInvoiceToCSV } from "./export/InvoiceExporter";
import { SHEET_URL } from "../components/config/gsheet";
import useCartStorage from "../hooks/useCartStorage";
import ProductGrid from "./ProductGrid";
import CartReviewPanel from "./CartReviewPanel";
import CategoryTabs from "./CategoryTabs";
import BuyerSelector from "./BuyerSelector";

const API_KEY = "DPRTMNT54$";
const FULL_URL = (type) => `${SHEET_URL}?type=${type}&key=${API_KEY}`;

export default function NewOrderForm({ productList }) {
  const [buyerList, setBuyerList] = useState([]);
  const [buyer, setBuyer] = useState({});
  const [search, setSearch] = useState("");
  const { cart, setCart, clearCart } = useCartStorage("newOrderCart");
  const [qtyMap, setQtyMap] = useState({});
  const [variantMap, setVariantMap] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const showToast = useToast();

  useEffect(() => {
    fetch(FULL_URL("buyers"))
      .then((res) => res.json())
      .then(setBuyerList)
      .catch(() => showToast("❌ Failed to load buyers", "error"));
  }, []);

  const allCategories = [
    "All",
    ...new Set(productList.map((p) => p.category || p.Category || "").filter(Boolean))
  ];

  const baseMap = {};
  productList.forEach((p) => {
    const cat = p.category || p.Category;
    if (selectedCategory !== "All" && cat !== selectedCategory) return;
    const base = p.base || p.name.split(" ")[0];
    if (!baseMap[base]) baseMap[base] = [];
    baseMap[base].push(p);
  });

  const baseNames = [...new Set(
    Object.keys(baseMap).filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    )
  )];

  const handleAdd = (base) => {
    const variant = variantMap[base];
    const qty = parseInt(qtyMap[base]) || 0;

    if (!variant || qty <= 0) {
      return showToast("❗ Select variant and qty", "error");
    }

    const alreadyExists = cart.some(
      (item) => item.item === variant.name
    );

    if (alreadyExists) {
      return showToast("⚠️ This item already exists", "warning");
    }

    const row = {
      item: variant.name,
      batch: variant.Batch || "-",
      mfg: variant.mfgDate || "-",
      exp: variant.expDate || "-",
      rate: variant.Rate || variant.MRP || 0,
      qty,
      mrp: variant.MRP || 0,
      hsn: variant.HSN || variant.hsn || "",
      gst: variant.Gst_rate || variant.gst || 0,
    };

    setCart([...cart, row]);
    setQtyMap({ ...qtyMap, [base]: "" });
    showToast("✅ Item added", "success");
  };

  const handleSubmit = async () => {
    if (!buyer.name || cart.length === 0) {
      showToast("⚠️ Enter buyer and at least one item", "error");
      return;
    }
    try {
      const updated = applySchemeDiscountToInvoice(cart, buyer, true);
      await exportInvoiceToGoogleSheet({
        buyerName: buyer.name,
        phone: buyer.phone,
        order: updated,
        source: "NEW"
      });
      showToast("✅ Order saved to Order_List", "success");
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
    clearCart();
    showToast("🧹 Cart cleared", "info");
  };

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto text-gray-800">
      <div className="sticky top-0 z-10 bg-white pb-2 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-blue-900">📋 Book New Order</h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">🧾 Items: <strong>{cart.length}</strong></span>
          </div>
        </div>
        <BuyerSelector buyerList={buyerList} buyer={buyer} setBuyer={setBuyer} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category sidebar */}
        <div className="lg:col-span-1 sticky top-24 max-h-[80vh] overflow-y-auto border rounded p-2 bg-white shadow-sm">
          <CategoryTabs
            allCategories={allCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Product grid and search */}
        <div className="lg:col-span-2">
          <input
            placeholder="Search item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-200 mb-3"
          />

          <ProductGrid
            baseMap={baseMap}
            baseNames={baseNames}
            cart={cart}
            qtyMap={qtyMap}
            setQtyMap={setQtyMap}
            variantMap={variantMap}
            setVariantMap={setVariantMap}
            handleAdd={handleAdd}
          />
        </div>

        {/* Cart summary panel */}
        <div className="lg:col-span-1 sticky top-24">
          <CartReviewPanel
            cart={cart}
            buyer={buyer}
            handleSubmit={handleSubmit}
            handleClearCart={handleClearCart}
            handleExportExcel={() => exportInvoiceToCSV(buyer, cart)}
            handleSendWhatsApp={() => openWhatsAppWithInvoice(buyer, cart)}
          />
        </div>
      </div>
    </div>
  );
}
