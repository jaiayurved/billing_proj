import React, { useState, useEffect } from "react";
import useToast from "../hooks/useToast";
import { exportInvoiceToGoogleSheet } from "../utils/submitOrderToSheet";
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

    const updatedCart = [...cart, { item: variant.name, qty, mrp: variant.MRP }];
    setCart(updatedCart);
    setQtyMap({ ...qtyMap, [base]: "" });
    showToast("✅ Item added", "success");
  };

  const handleSubmit = async () => {
    if (!buyer.name || cart.length === 0) {
      showToast("⚠️ Enter buyer and at least one item", "error");
      return;
    }
    try {
      await exportInvoiceToGoogleSheet({ dealer: buyer, order: cart, source: "NEW" });
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
      <div className="sticky top-0 z-10 bg-white pb-2 border-b flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-blue-900">📋 Book New Order</h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">🧾 Items: <strong>{cart.length}</strong></span>
          </div>
        </div>
        <BuyerSelector buyerList={buyerList} buyer={buyer} setBuyer={setBuyer} />
      </div>

      <CategoryTabs
        allCategories={allCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <input
            placeholder="Search item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-200"
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

        <CartReviewPanel
          cart={cart}
          buyer={buyer}
          handleSubmit={handleSubmit}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
