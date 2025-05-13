// src/utils/submitOrderToSheet.js
import { SHEET_URL } from "../components/config/gsheet";

export async function exportInvoiceToGoogleSheet({ dealer, order }) {
  try {
    const response = await fetch(SHEET_URL, {
      method: "POST",
      body: JSON.stringify({ dealer, order }),
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
    console.error("❌ Failed to export to Google Sheet:", err);
    throw err;
  }
}
