import React, { useState } from "react";

export default function LinkGenerator() {
  const [quotationNo, setQuotationNo] = useState("");

  const handleOpen = () => {
    if (!quotationNo.trim()) return alert("Enter Quotation No!");
    const link = `/printpage?quotationNo=${encodeURIComponent(quotationNo)}&autoPrint=true`;
    window.open(link, "_blank");
  };

  return (
    <div>
      <input value={quotationNo} onChange={(e) => setQuotationNo(e.target.value)} placeholder="Quotation No" />
      <button onClick={handleOpen}>Open & Print</button>
    </div>
  );
}
