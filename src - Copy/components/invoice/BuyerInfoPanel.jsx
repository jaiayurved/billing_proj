// src/components/invoice/BuyerInfoPanel.jsx
import React from "react";
import BuyerSelector from "../BuyerSelector";
import { applySchemeDiscountToInvoice } from "../../utils/cartUtils";

export default function BuyerInfoPanel({ buyerList, selectedBuyer, setSelectedBuyer, invoiceList, setInvoiceList }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 space-y-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">🧍 Buyer Details</h2>

      <BuyerSelector
        buyerList={buyerList}
        buyer={selectedBuyer || {}}
        setBuyer={(b) => {
          setSelectedBuyer(b);
          if (invoiceList.length > 0) {
            const updated = applySchemeDiscountToInvoice(invoiceList, b, true);
            setInvoiceList(updated);
          }
        }}
      />

      {selectedBuyer && (
        <div className="text-sm text-gray-600 pt-2">
          <div><strong>GSTIN:</strong> {selectedBuyer.gstin || "NA"}</div>
          <div><strong>City:</strong> {selectedBuyer.city || "NA"}</div>
        </div>
      )}
    </div>
  );
}
