// src/utils/submitOrderToSheet.js
import { SHEET_URL } from "../components/config/gsheet";

const API_KEY = "DPRTMNT54$";
const POST_URL = `${SHEET_URL}?key=${API_KEY}`;

export async function exportInvoiceToGoogleSheet({ buyerName, phone, order, source = "NEW" }) {
  try {
    const response = await fetch(POST_URL, {
      method: "POST",
      body: JSON.stringify({ buyerName, phone, order, source }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json?.() ?? {};
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
