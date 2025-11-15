import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { getQuotationByNumber } from "./quotationApi";
import logo from "/images/logo/dsonik.png"; // adjust path if needed

type Item = {
  product_name?: string;
  description?: string;
  quantity?: number;
  unit_price?: number;
  line_total?: number;
};

export default function PrintPage() {
  const printRef = useRef<HTMLDivElement | null>(null);

  // Read URL parameters safely inside useEffect
  const [quotationNo, setQuotationNo] = useState("");
  const [autoPrint, setAutoPrint] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get("quotationNo") || "";
    const auto = params.get("autoPrint") === "true";

    setQuotationNo(qParam);
    setAutoPrint(auto);

    if (qParam) loadQuotation(qParam);
  }, []);

  const loadQuotation = async (q: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await getQuotationByNumber(q);
      const payload = res?.data ?? res;
      setData(payload);

      if (autoPrint) setTimeout(() => window.print(), 500);
    } catch (err) {
      console.error(err);
      setError("Failed to load quotation");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const items: Item[] = Array.isArray(data?.products) ? data.products : [];
  const subtotal = items.reduce(
    (sum, it) =>
      sum +
      Number(
        it.line_total ??
          (Number(it.quantity || 0) * Number(it.unit_price || 0))
      ),
    0
  );
  const discount = Number(data?.discount_amount || 0);
  const tax = Number(data?.tax_amount || 0);
  const total = subtotal - discount + tax;

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      {/* PRINT CSS FIX */}
      <style>
        {`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-area, #print-area * {
            visibility: visible !important;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}
      </style>

      {/* Input Section */}
      <div
        style={{
          maxWidth: 720,
          margin: "12px auto",
          padding: 12,
          border: "1px solid #e6e6e6",
          borderRadius: 8,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Enter Quotation No (e.g. QTN-2025-5001)"
            value={quotationNo}
            onChange={(e) => setQuotationNo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                loadQuotation((e.target as HTMLInputElement).value.trim());
            }}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={() => loadQuotation(quotationNo.trim())}
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              background: "#2563eb",
              color: "#fff",
              border: "none",
            }}
          >
            Open
          </button>
          <button
            onClick={() => window.print()}
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              background: "#111827",
              color: "#fff",
              border: "none",
            }}
          >
            Print
          </button>
        </div>

        <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
          Tip: you can append{" "}
          <code>?quotationNo=QTN-...&autoPrint=true</code> to auto-print.
        </div>
      </div>

      {/* Status */}
      <div style={{ maxWidth: 900, margin: "8px auto" }}>
        {loading && (
          <div style={{ textAlign: "center" }}>⏳ Loading quotation…</div>
        )}
        {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      </div>

      {/* PRINT AREA */}
      {data && (
        <div
          id="print-area"
          ref={printRef}
          style={{
            maxWidth: 900,
            margin: "12px auto",
            background: "#fff",
            padding: 18,
            borderRadius: 6,
            boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "2px solid #000",
              paddingBottom: 10,
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{ height: 60 }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div style={{ textAlign: "right" }}>
              <h2 style={{ margin: 0 }}>DSONIK</h2>
              <div style={{ fontSize: 13 }}>
                74, Anand Industrial Estate, Mohan Nagar, Ghaziabad - 201007
              </div>
              <div style={{ fontSize: 13 }}>GSTIN: 09AOGPK1379A1ZA</div>
              <div style={{ fontSize: 13 }}>
                Email: info@dsonik.com | Ph: +91-9810776728
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <div style={{ width: "48%" }}>
              <h4 style={{ marginBottom: 6 }}>Customer Details</h4>
              <div>
                <strong>{data.customer?.name || "N/A"}</strong>
              </div>
              <div style={{ fontSize: 13 }}>{data.customer?.address || "-"}</div>
              <div style={{ fontSize: 13 }}>
                Phone: {data.customer?.phone || "-"}
              </div>
              <div style={{ fontSize: 13 }}>
                Email: {data.customer?.email || "-"}
              </div>
            </div>

            <div style={{ width: "48%", textAlign: "right" }}>
              <h4 style={{ marginBottom: 6 }}>Quotation Info</h4>
              <div>
                <b>No:</b>{" "}
                {data.quotation_no || data.quotationNo || quotationNo}
              </div>
              <div>
                <b>Date:</b>{" "}
                {data.created_at
                  ? dayjs(data.created_at).format("DD-MM-YYYY")
                  : "-"}
              </div>
              <div>
                <b>Validity:</b>{" "}
                {data.validity_date
                  ? dayjs(data.validity_date).format("DD-MM-YYYY")
                  : "-"}
              </div>
              <div>
                <b>Payment:</b> {data.payment_terms || "-"}
              </div>
            </div>
          </div>

          {/* Table */}
          <table
            style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}
          >
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
                items.map((it, idx) => (
                  <tr key={idx}>
                    <td style={td}>{idx + 1}</td>
                    <td style={td}>{it.product_name}</td>
                    <td style={td}>{it.description}</td>
                    <td style={td}>{it.quantity}</td>
                    <td style={td}>
                      {Number(it.unit_price || 0).toFixed(2)}
                    </td>
                    <td style={td}>
                      {Number(
                        it.line_total ??
                          (Number(it.quantity || 0) *
                            Number(it.unit_price || 0))
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={td}>
                    No items
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Summary */}
          <div style={{ textAlign: "right", marginTop: 12 }}>
            <div>Sub Total: ₹{subtotal.toFixed(2)}</div>
            <div>Discount: ₹{discount.toFixed(2)}</div>
            <div>Tax: ₹{tax.toFixed(2)}</div>
            <h3>Grand Total: ₹{total.toFixed(2)}</h3>
          </div>

          
        {/* Terms */}
        <div className="terms">
          <h4>Terms & Conditions</h4>
          <ol>
            <li>Price: Ex works</li>
            <li>GST: 18% Extra</li>
            <li>Payment: 50% advance, 50% before dispatch</li>
            <li>Delivery: Within 10 working days after order</li>
            <li>Warranty: 1 year except consumables</li>
            <li>Cancellation: 10% + GST applicable</li>
            <li>Subject to Ghaziabad Jurisdiction</li>
          </ol>
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
              <p><b>Devender Kumar</b><br />Director<br />9810776728</p>
            <p><b>Sanjay</b><br />Business Partner<br />9220480010</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <h4>Bank Details</h4>
              <div>HDFC Bank</div>
              <div>Account: 50200058580458</div>
              <div>IFSC: HDFC0000527</div>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: 14 }}>
            Thank You For Your Business!
          </p>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 8,
  fontSize: 12,
  textAlign: "left",
};
const td: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 8,
  fontSize: 12,
};
