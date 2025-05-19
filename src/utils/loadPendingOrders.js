const API_URL = import.meta.env.VITE_API_URL;

export async function loadPendingOrders() {
  try {
    const res = await fetch(`${API_URL}/api/orders`);
    const data = await res.json();

    if (!Array.isArray(data)) return [];

    const grouped = {};
    for (const row of data) {
      if (!row.dealer || !row.item || !row.qty) continue;

      if (!grouped[row.dealer]) {
        grouped[row.dealer] = {
          buyer: {
            name: row.dealer,
            gstin: row.gstin || "",
            city: row.city || "",
            type: row.type || ""
          },
          orderItems: []
        };
      }

      grouped[row.dealer].orderItems.push({
        item: row.item,
        qty: parseInt(row.qty) || 0
      });
    }

    return Object.values(grouped);
  } catch (err) {
    console.error("❌ Error loading pending orders:", err);
    return [];
  }
}
