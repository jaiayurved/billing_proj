
const API_URL = import.meta.env.VITE_API_URL;

export async function exportInvoiceToLocalServer({ buyerName, phone, order, source = "NEW" }) {
  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      body: JSON.stringify({
        dealer: { name: buyerName, phone },
        order
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();
    if (result.error) {
      console.error("❌ API Error:", result.error);
      throw new Error(result.error);
    }

    console.log("✅ Order saved successfully:", result);
    return result;
  } catch (err) {
    console.error("❌ Failed to export to local server:", err);
    throw err;
  }
}
