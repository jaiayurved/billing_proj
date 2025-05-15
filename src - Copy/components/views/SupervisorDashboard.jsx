// src/components/views/SupervisorDashboard.jsx
import React, { useState, useEffect } from "react";
//import useLabelBatch from "../../hooks/useLabelBatch";
//import useToast from "../../hooks/useToast";
import { SHEET_URL } from "../config/gsheet";




export default function SupervisorDashboard() {
  const [itemList, setItemList] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [mfgDate, setMfgDate] = useState("");
  const [expDate, setExpDate] = useState("");
  const [qtyPerCarton, setQtyPerCarton] = useState("");
  const [noOfCartons, setNoOfCartons] = useState("");
  const [dispatchList, setDispatchList] = useState([]);
  const showToast = useToast();

  useEffect(() => {
fetch(`${SHEET_URL}?type=products`)      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const names = data.map(p => p.name).filter(Boolean);
          setItemList([...new Set(names)]);
        }
      })
      .catch(() => showToast("Failed to load item list", "error"));
  }, []);

  const labelData = useLabelBatch(selectedItem);

  useEffect(() => {
    if (labelData.length > 0) {
      setBatchList(labelData.map(l => l.batch));
    }
  }, [labelData]);

  useEffect(() => {
    const selected = labelData.find(l => l.batch === selectedBatch);
    if (selected) {
      setMfgDate(selected.mfg);
      setExpDate(selected.exp);
    }
  }, [selectedBatch]);

  const handleAdd = () => {
    if (!selectedItem || !selectedBatch || !qtyPerCarton || !noOfCartons) {
      return showToast("Please fill all required fields", "error");
    }
    const totalQty = parseInt(qtyPerCarton) * parseInt(noOfCartons);
    const row = {
      date: new Date().toLocaleDateString("en-GB"),
      type: "Stock Journal",
      item: selectedItem,
      qty: totalQty,
      rate: 1,
      amount: totalQty,
      mode: "Use for Stock Journal",
      batch: selectedBatch,
      mfg: mfgDate,
      exp: expDate,
      godown: "Main location",
    };
    setDispatchList([...dispatchList, row]);
    showToast("Item added to dispatch list", "success");
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Factory Dispatch Entry</h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <label>Item Name</label>
          <select
            className="w-full border px-2 py-1"
            value={selectedItem}
            onChange={e => {
              setSelectedItem(e.target.value);
              setSelectedBatch("");
              setMfgDate("");
              setExpDate("");
            }}
          >
            <option value="">Select</option>
            {itemList.map((item, idx) => (
              <option key={idx} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Batch No.</label>
          <select
            className="w-full border px-2 py-1"
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
          >
            <option value="">Select</option>
            {batchList.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label>MFG Date</label>
          <input className="w-full border px-2 py-1" value={mfgDate} readOnly />
        </div>
        <div>
          <label>EXP Date</label>
          <input className="w-full border px-2 py-1" value={expDate} readOnly />
        </div>
        <div>
          <label>Qty per Carton</label>
          <input
            type="number"
            className="w-full border px-2 py-1"
            value={qtyPerCarton}
            onChange={e => setQtyPerCarton(e.target.value)}
          />
        </div>
        <div>
          <label>No. of Cartons</label>
          <input
            type="number"
            className="w-full border px-2 py-1"
            value={noOfCartons}
            onChange={e => setNoOfCartons(e.target.value)}
          />
        </div>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAdd}
      >
        + Add to Dispatch List
      </button>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Dispatch Preview:</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th>Date</th><th>Item</th><th>Batch</th><th>MFG</th><th>EXP</th><th>Qty</th><th>Godown</th>
            </tr>
          </thead>
          <tbody>
            {dispatchList.map((row, i) => (
              <tr key={i} className="border-t">
                <td>{row.date}</td><td>{row.item}</td><td>{row.batch}</td><td>{row.mfg}</td><td>{row.exp}</td><td>{row.qty}</td><td>{row.godown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

