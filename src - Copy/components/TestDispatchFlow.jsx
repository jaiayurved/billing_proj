// src/components/TestDispatchFlow.jsx
import React, { useState, useEffect } from "react";
import PendingOrdersList from "./PendingOrdersList";
import DispatchItemProcessor from "./DispatchItemProcessor";
import InvoiceTable from "./InvoiceTable";
import { loadPendingOrders } from "../utils/loadPendingOrders";

export default function TestDispatchFlow({ productList }) {
  const SHEET_URL = "https://script.google.com/macros/s/AKfycbw5DxTAH1_S2RadDCaPTKSVD3VW1q27Rj3tj0A47ZJ8eFmz_dZKimkjTVQ7l6SxBL83/exec";
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceList, setInvoiceList] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const data = await loadPendingOrders();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  const handleProcessedItem = (item) => {
    setInvoiceList(prev => [...prev, item]);
  };

  const handleDispatchSubmit = async () => {
    if (!selectedOrder || invoiceList.length === 0) return alert("No order or items to dispatch");

    const payload = {
      buyer: selectedOrder.buyer,
      items: invoiceList,
      dispatchedAt: new Date().toISOString()
    };

    try {
      await fetch(`${SHEET_URL}?type=dispatchSave`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      alert("✅ Order dispatched and saved to sheet!");
      setSelectedOrder(null);
      setInvoiceList([]);
    } catch (err) {
      console.error("Error saving dispatch:", err);
      alert("Failed to save dispatch");
    }
  };

  return (
    <div className="p-4 border-t mt-6">
      {!selectedOrder ? (
        <PendingOrdersList orders={orders} onSelect={setSelectedOrder} />
      ) : (
        <>
          <DispatchItemProcessor
            itemList={selectedOrder.orderItems}
            productList={productList}
            onItemProcessed={handleProcessedItem}
          />
          <InvoiceTable invoiceList={invoiceList} onRemove={() => {}} />
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => handleDispatchSubmit()}
          >
            ✅ Mark Order as Dispatched
          </button>
        </>
      )}
    </div>
  );
}
