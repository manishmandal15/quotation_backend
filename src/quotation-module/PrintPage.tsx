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

const th: React.CSSProperties = { border: "1px solid #ddd", padding: 6, fontSize: 12, textAlign: "left" };
const td: React.CSSProperties = { border: "1px solid #ddd", padding: 6, fontSize: 12 };

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

    if (q) loadQuotation(q);
  }, []);

  const loadQuotation = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuotationByNumber(q);
      const payload = res?.data ?? res;

      if (!payload) {
        setError("Quotation not found");
        return;
      }

      setData(payload);

      if (autoPrint) setTimeout(() => handlePrint(), 600);
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

  if (loading) return <h2 style={{ textAlign: "center", marginTop: 40 }}>Loading...</h2>;
  if (error) return <h3 style={{ textAlign: "center", marginTop: 40 }}>{error}</h3>;
  if (!data) return <h3 style={{ textAlign: "center", marginTop: 40 }}>No Data</h3>;

  // Map customer
  const customer = data?.customer
    ? {
      name: data.customer.name || "N/A",
      phone: data.customer.phone || "-",
      email: data.customer.email || "",
      gst_no: data.customer.gst_no || "",
      address: data.customer.address || "Address not available",
      cstate: data.customer.cstate || "",
      district: data.customer.district || "",
    }
    : null;
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
        <Button type="default" icon={<CloseOutlined />} onClick={() => window.close()}>
          Close
        </Button>
      </div>

      {/* Printable Area */}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "2px solid #000",
            paddingBottom: 10,
          }}
        >
          <img src={logo} alt="logo" style={{ height: 60 }} />
          <div style={{ textAlign: "right" }}>
            <h2>DSONIK</h2>
            <div style={{ fontSize: 13 }}>74, Anand Industrial Estate, Mohan Nagar, Ghaziabad - 201007</div>
            <div style={{ fontSize: 13 }}>GSTIN: 09AOGPK1379A1ZA</div>
            <div style={{ fontSize: 13 }}>Email: info@dsonik.com | Ph: +91-9810776728</div>
          </div>
        </div>

        {/* Customer & Quotation Info */}
        <div
          className="info-section"
          style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}
        >
          {/* Customer Details */}
          {customer ? (
            <div className="info-box" style={{ width: "48%" }}>
              <h4 style={{ margin: "0 0 2px 0", fontSize: 14 }}>Customer Details</h4>
              <p style={{ margin: "1px 0" }}><b>{customer.name}</b></p>
              {customer.gst_no && <p style={{ margin: "1px 0" }}>GSTIN: {customer.gst_no}</p>}
              <p style={{ margin: "1px 0" }}>{customer.address}</p>
              <p style={{ margin: "1px 0" }}>Phone: {customer.phone}</p>
              {customer.email && <p style={{ margin: "1px 0" }}>Email: {customer.email}</p>}
            </div>
          ) : (
            <p style={{ margin: "1px 0" }}>Loading customer details...</p>
          )}

          {/* Quotation Info */}
          <div style={{ width: "48%", textAlign: "right" }}>
            <h4 style={{ margin: "0 0 2px 0", fontSize: 14 }}>Quotation Info</h4>
            <p style={{ margin: "1px 0" }}><b>No:</b> {data.quotation_no || quotationNo}</p>
            <p style={{ margin: "1px 0" }}><b>Date:</b> {data.created_at ? dayjs(data.created_at).format("DD-MM-YYYY") : "-"}</p>
            <p style={{ margin: "1px 0" }}><b>Validity:</b> {data.validity_date ? dayjs(data.validity_date).format("DD-MM-YYYY") : "-"}</p>
            <p style={{ margin: "1px 0" }}><b>Payment:</b> {data?.payment_terms || "50% Advance"}</p>
            <p style={{ margin: "1px 0" }}><b>Delivery:</b> {data?.delivery_terms || "As discussed"}</p>
          </div>
        </div>


        {/* Items Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
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
          <div style={{ textAlign: "left", lineHeight: 1.3, marginTop: 0 }}>
            <h4 style={{ marginBottom: 4 }}>Bank Details</h4>
            <p style={{ margin: "2px 0" }}>Bank: HDFC Bank</p>
            <p style={{ margin: "2px 0" }}>Account No: 50200058580458</p>
            <p style={{ margin: "2px 0" }}>IFSC: HDFC0000527</p>
            <p style={{ margin: "2px 0" }}>Branch: ANDAL</p>
          </div>

        </div>

        <p style={{ textAlign: "center", marginTop: 14 }}>
          <b>Thank You For Your Business!</b>
        </p>
      </div>
    </div>
  );
}
