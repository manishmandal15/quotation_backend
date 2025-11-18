// src/quotation-module/PrintPage.tsx
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { getQuotationByNumber } from "./quotationApi";
import logo from "/images/logo/dsonik.png";
import { Button } from "antd";
import { PrinterOutlined, CloseOutlined } from "@ant-design/icons";

type Item = {
  product_name?: string;
  description?: string;
  quantity?: number;
  unit_price?: number;
  discount?: number;
  tax_rate?: number;
  line_total?: number;
};

export default function PrintPage() {
  const printRef = useRef<HTMLDivElement | null>(null);

  const [quotationNo, setQuotationNo] = useState("");
  const [autoPrint, setAutoPrint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("quotationNo") || "";
    const auto = params.get("autoPrint") === "true";

    setQuotationNo(q);
    setAutoPrint(auto);

    if (q) loadQuotation(q);
  }, []);

  const loadQuotation = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuotationByNumber(q);
      console.log("API Response:", res); // ✅ Debug

      // Check API response structure
      const payload = res?.data ?? res; 
      if (!payload) {
        setError("Quotation not found");
        return;
      }

      setData(payload);

      // Auto-print if requested
      if (autoPrint) setTimeout(() => handlePrint(), 500);
    } catch (err) {
      console.error(err);
      setError("Failed to load quotation");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const newWin = window.open("", "_blank");
      if (!newWin) return;
      newWin.document.write(`
        <html>
          <head>
            <title>Quotation</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 10mm; font-size: 12px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
              th { background: #f5f5f5; }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      newWin.document.close();
      newWin.print();
    }
  };

  if (loading)
    return <h2 style={{ textAlign: "center", marginTop: 40 }}>Loading...</h2>;
  if (error)
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>{error}</h3>;
  if (!data)
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>No Data</h3>;

  // ✅ Customer mapping with safe fallbacks
  const customer = {
    name:
      data?.customer?.name ||
      data?.customer?.customerName ||
      data?.customer_name ||
      "N/A",
    gst_no:
      data?.customer?.gst_no ||
      data?.customer?.gstNumber ||
      data?.customer_gst ||
      "",
    cstate:
      data?.customer?.cstate ||
      data?.customer?.state ||
      data?.customer_state ||
      "",
    district:
      data?.customer?.district ||
      data?.customer_district ||
      "",
    address:
      data?.customer?.address ||
      data?.customer?.location ||
      data?.customer_address ||
      "Address not available",
    phone:
      data?.customer?.phone ||
      data?.customer?.mobile ||
      data?.customer_phone ||
      "-",
    email:
      data?.customer?.email ||
      data?.customer_email ||
      "",
  };

  // ✅ Items mapping
  const items: Item[] = Array.isArray(data?.products || data?.items)
    ? (data?.products || data?.items).map((item: any): Item => ({
        product_name:
          item?.product_name ||
          item?.product?.name ||
          item?.name ||
          "Unnamed Product",
        description: item?.description || "-",
        quantity: Number(item?.quantity || 0),
        unit_price: Number(item?.unit_price || item?.rate || 0),
        discount: Number(item?.discount || 0),
        tax_rate: Number(item?.tax_rate || 0),
        line_total:
          Number(item?.line_total) ||
          Number(item?.quantity || 0) * Number(item?.unit_price || item?.rate || 0),
      }))
    : [];

  // ✅ Totals
  const subtotal = items.reduce((sum: number, i: Item) => sum + (i.line_total || 0), 0);
  const discount = Number(data?.discount_amount || data?.discount || 0);
  const tax = Number(data?.tax_amount || data?.tax || 0);
  const total = subtotal - discount + tax;

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      {/* Buttons */}
      <div style={{ marginBottom: 12, textAlign: "right" }}>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          style={{ marginRight: 6 }}
        >
          Print
        </Button>
        <Button
          type="default"
          icon={<CloseOutlined />}
          onClick={() => window.close()}
        >
          Close
        </Button>
      </div>

      <div
        id="print-area"
        ref={printRef}
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          padding: 18,
          borderRadius: 6,
          boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #000", paddingBottom: 10 }}>
          <img src={logo} alt="logo" style={{ height: 60 }} />
          <div style={{ textAlign: "right" }}>
            <h2>DSONIK</h2>
            <div style={{ fontSize: 13 }}>74, Anand Industrial Estate, Mohan Nagar, Ghaziabad - 201007</div>
            <div style={{ fontSize: 13 }}>GSTIN: 09AOGPK1379A1ZA</div>
            <div style={{ fontSize: 13 }}>Email: info@dsonik.com | Ph: +91-9810776728</div>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <div style={{ width: "48%" }}>
            <h4>Customer Details</h4>
            <strong>{customer.name}</strong>
            {customer.gst_no && <p>GSTIN: {customer.gst_no}</p>}
            {customer.cstate && <p>State: {customer.cstate}</p>}
            {customer.district && <p>District: {customer.district}</p>}
            <p>{customer.address}</p>
            <p>Phone: {customer.phone}</p>
            {customer.email && <p>Email: {customer.email}</p>}
          </div>

          <div style={{ width: "48%", textAlign: "right" }}>
            <h4>Quotation Info</h4>
            <div><b>No:</b> {data.quotation_no || quotationNo}</div>
            <div>
              <b>Date:</b> {data.created_at ? dayjs(data.created_at).format("DD-MM-YYYY") : "-"}
            </div>
            <div>
              <b>Validity:</b> {data.validity_date ? dayjs(data.validity_date).format("DD-MM-YYYY") : "-"}
            </div>
            <div><b>Payment:</b> {data.payment_terms || "-"}</div>
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={th}>S.No</th>
              <th style={th}>Product</th>
              <th style={th}>Description</th>
              <th style={th}>Qty</th>
              <th style={th}>Unit Price</th>
              <th style={th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((it: Item, idx: number) => (
                <tr key={idx}>
                  <td style={td}>{idx + 1}</td>
                  <td style={td}>{it.product_name}</td>
                  <td style={td}>{it.description}</td>
                  <td style={td}>{it.quantity}</td>
                  <td style={td}>{Number(it.unit_price).toFixed(2)}</td>
                  <td style={td}>{Number(it.line_total).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={td}>No items</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ textAlign: "right", marginTop: 12 }}>
          <div>Sub Total: ₹{subtotal.toFixed(2)}</div>
          <div>Discount: ₹{discount.toFixed(2)}</div>
          <div>Tax: ₹{tax.toFixed(2)}</div>
          <h3>Grand Total: ₹{total.toFixed(2)}</h3>
        </div>

        {/* Terms */}
        <div style={{ marginTop: 20 }}>
          <h3>Terms & Conditions</h3>
          <p style={{ whiteSpace: "pre-line" }}>{data.terms_conditions || "—"}</p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between" }}>
          <div>
            <p>
              <b>Devender Kumar</b><br />
              Director<br />
              9810776728
            </p>
            <p>
              <b>Sanjay</b><br />
              Business Partner<br />
              9220480010
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h4>Bank Details</h4>
            <div>HDFC Bank</div>
            <div>Account: 50200058580458</div>
            <div>IFSC: HDFC0000527</div>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 14 }}><b>Thank You For Your Business!</b></p>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 6,
  fontSize: 12,
  textAlign: "left",
};
const td: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 6,
  fontSize: 12,
};
