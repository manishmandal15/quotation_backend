import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { getQuotationByNumber } from "./quotationApi";
import logo from "/images/logo/dsonik.png";
import { Button } from "antd";
import { PrinterOutlined, CloseOutlined } from "@ant-design/icons";
import { noop } from "antd/es/_util/warning";

type Item = {
  product_name?: string;
  description?: string;
  quantity?: number;
  unit_price?: number;
  discount?: number;
  tax_rate?: number;
  line_total?: number;
};

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

export default function PrintPage() {
  const printRef = useRef<HTMLDivElement | null>(null);

  const [quotationNo, setQuotationNo] = useState("");
  const [autoPrint, setAutoPrint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("quotationNo") || "";
    const auto = params.get("autoPrint") === "true";

    setQuotationNo(q);
    setAutoPrint(auto);

    if (q) loadQuotation(q, auto);
  }, []);

  const loadQuotation = async (q: string, shouldAutoPrint?: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getQuotationByNumber(q);
      const payload = res?.data ?? res;
      setData(payload);

      if (shouldAutoPrint) {
        setTimeout(() => handlePrint(), 500);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load quotation");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
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
    setTimeout(() => newWin.print(), 200);
  };

  if (loading)
    return <h2 style={{ textAlign: "center", marginTop: 40 }}>Loading...</h2>;
  if (error)
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>{error}</h3>;
  if (!data)
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>No Data</h3>;

  // CUSTOMER DATA FIX (SAFE)
  const cust = data?.customer || {};
  const customer = {
    name: cust.name || "N/A",
    phone: cust.phone || cust.mobile || "-",
    email: cust.email || "",
    gst_no: cust.gst_no || cust.gstNumber || "",
    address: cust.address || cust.location || "Address not available",
  };

  // PRODUCTS (SAFE NORMALIZED)
  const rawItems = data.items || data.products || [];
  const mappedItems: Item[] = Array.isArray(rawItems)
    ? rawItems.map((item: any) => ({
        product_name: item.product_name || item.name || "Unnamed Product",
        description: item.description || item.item_description || "-",
        quantity: Number(item.quantity || 0),
        unit_price: Number(item.unit_price || 0),
        discount: Number(item.discount || 0),
        tax_rate: Number(item.tax_rate || 0),
        line_total:
          Number(item.line_total) ||
          Number(item.quantity || 0) * Number(item.unit_price || 0),
      }))
    : [];

  const subtotal = mappedItems.reduce((sum, i) => sum + (i.line_total || 0), 0);
  const discount = Number(data.discount_amount || data.discount || 0);
  const tax = Number(data.tax_amount || data.tax || 0);
  const total = subtotal - discount + tax;

  return (
    <div style={{ padding: 0, fontFamily: "Arial, sans-serif" }}>
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
          padding: 0,
          borderRadius: 6,
          boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
          border: "2px solid black",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "2px solid #000",
            paddingBottom: 10,
            background: "gray",
          }}
        >
          <img src={logo} alt="logo" style={{ height: 60 }} />
          <div style={{ textAlign: "right" }}>
            <h2>DSONIK</h2>
            <div style={{ fontSize: 13 }}>
              74, Anand Industrial Estate, Mohan Nagar, Ghaziabad - 201007
            </div>
            <div style={{ fontSize: 13 }}>GSTIN: 09AOGPK1379A1ZA</div>
            <div style={{ fontSize: 13 }}>
              Email: info@dsonik.com | Ph: +91-9810776728
            </div>
          </div>
        </div>

        {/* Customer & Quotation Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          {/* CUSTOMER */}
          <div style={{ width: "48%" }}>
            <h4 style={{ margin: "0 0 2px 0", fontSize: 14 }}>
              Customer Details
            </h4>
            <p style={{ margin: "1px 0" }}>
              <b>{customer.name}</b>
            </p>
            {customer.gst_no && (
              <p style={{ margin: "1px 0" }}>GSTIN: {customer.gst_no}</p>
            )}
            <p style={{ margin: "1px 0" }}>{customer.address}</p>

            <p style={{ margin: "1px 0" }}>Phone: {customer.phone}</p>
            {customer.email && (
              <p style={{ margin: "1px 0" }}>Email: {customer.email}</p>
            )}
          </div>

          {/* QUOTATION INFO */}
          <div style={{ width: "48%", textAlign: "right" }}>
            <h4 style={{ margin: "0 0 2px 0", fontSize: 14 }}>
              Quotation Info
            </h4>
            <p>
              <b>No:</b> {data.quotation_no || quotationNo}
            </p>
            <p>
              <b>Date:</b>{" "}
              {data.created_at
                ? dayjs(data.created_at).format("DD-MM-YYYY")
                : "-"}
            </p>
            <p>
              <b>Validity:</b>{" "}
              {data.validity_date
                ? dayjs(data.validity_date).format("DD-MM-YYYY")
                : "-"}
            </p>
            <p>
              <b>Payment:</b> {data.payment_terms || "50% Advance"}
            </p>
            <p>
              <b>Delivery:</b> {data.delivery_terms || "As discussed"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}
        >
          <thead>
            <tr style={{ background: "#f3f3f3" }}>
              <th style={th}>S.No</th>
              <th style={th}>Product</th>
              <th style={th}>Description</th>
              <th style={th}>Qty</th>
              <th style={th}>Price</th>
              <th style={th}>Discount %</th>
              <th style={th}>Tax %</th>
              <th style={th}>Total</th>
            </tr>
          </thead>

          <tbody>
            {mappedItems.length ? (
              mappedItems.map((item, i) => (
                <tr key={i}>
                  <td style={td}>{i + 1}</td>
                  <td style={td}>{item.product_name}</td>
                  <td style={td}>{item.description}</td>
                  <td style={td}>{item.quantity}</td>
                  <td style={td}>{item.unit_price?.toFixed(2)}</td>
                  <td style={td}>{item.discount}</td>
                  <td style={td}>{item.tax_rate}</td>
                  <td style={td}>{item.line_total?.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 10 }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              textAlign: "right",
              marginTop: 12,
              border: "3px solid black",
              width: "230px",
            }}
          >
            <div>Sub Total: ₹{subtotal.toFixed(2)}</div>
            <div>Discount: ₹{discount.toFixed(2)}</div>
            <div>Tax: ₹{tax.toFixed(2)}</div>
            <h3>Grand Total: ₹{total.toFixed(2)}</h3>
          </div>
        </div>

        {/* Terms */}
        <div style={{ marginTop: 20, }}>
          <h3  style={{ marginTop: 20, border: "2px solid black",width: "30%" , background: "gray" }}>Terms & Conditions</h3>
          <p style={{ whiteSpace: "pre-line" }}>
            {data.terms_conditions || "—"}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p>
              <b>Devender Kumar</b>
              <br />
              Director
              <br />
              9810776728
            </p>
            <p>
              <b>Sanjay</b>
              <br />
              Business Partner
              <br />
              9220480010
            </p>
          </div>

          <div style={{ textAlign: "left" }}>
            <h4 style={{ marginBottom: 4 }}>Bank Details</h4>
            <p>Bank: HDFC Bank</p>
            <p>Account No: 50200058580458</p>
            <p>IFSC: HDFC0000527</p>
          </div>
        </div>

        <p
          style={{
            textAlign: "right",
            marginTop: 140,
            border: "2px solid black",
            marginBottom: 0,
            borderTop: 0,
            background: "gray",
            height:"20px"
          }}
        >
          <b>Thank You For Your Business!</b>
        </p>
      </div>
    </div>
  );
}
