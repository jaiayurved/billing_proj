// src/utils/loadPendingOrders.js
import { SHEET_URL } from "../components/config/gsheet";

export async function loadPendingOrders() {
  try {
    const res = await fetch(`${SHEET_URL}?type=pendingOrders`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("❌ Invalid response format from Google Sheet:", data);
      return [];
    }

    const grouped = {};
    for (const row of data) {
      if (!row.buyerName || !row.item || !row.qty) continue;

      if (!grouped[row.buyerName]) {
        grouped[row.buyerName] = {
          buyer: {
            name: row.buyerName,
            gstin: row.gstin || "",
            city: row.city || "",
            type: row.type || ""
          },
          orderItems: []
        };
      }
      grouped[row.buyerName].orderItems.push({
        item: row.item,
        plannedQty: parseInt(row.qty) || 0
      });
    }

    return Object.values(grouped).map(order => ({
      buyer: order.buyer,
      items: order.orderItems.map(i => ({ name: i.item, qty: i.plannedQty }))
    }));
  } catch (err) {
    console.error("❌ Error loading pending orders:", err);
    return [];
  }
}
