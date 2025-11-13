// src/quotation-module/QuotationPreview.tsx

import React, { useRef, useEffect } from "react";
import { Modal, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import logo from "/images/logo/dsonik.png";

type Props = {
  visible: boolean;
  onClose: () => void;
  previewData: any;
};

const QuotationPreview: React.FC<Props> = ({ visible, onClose, previewData }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Quotation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 10mm;
              color: #000;
              font-size: 11px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #000;
              padding-bottom: 8px;
              margin-bottom: 10px;
            }
            .header img { height: 60px; }
            .company-info { text-align: right; font-size: 11px; }
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
            }
            .info-box, .info-box-1 { width: 48%; line-height: 1.5; }
            .info-box-1 { text-align: right; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 4px;
              text-align: center;
              font-size: 10.5px;
            }
            th { background: #f5f5f5; }
            .totals {
              text-align: right;
              margin-top: 8px;
              font-size: 11px;
              line-height: 1.6;
            }
            .terms {
              margin-top: 12px;
              font-size: 10.5px;
              line-height: 1.5;
            }
            .bottom-section {
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .signature { line-height: 1.4; font-size: 11px; }
            .bank { text-align: right; font-size: 10.5px; line-height: 1.5; }
            .thankyou {
              text-align: center;
              margin-top: 10px;
              font-weight: bold;
              font-size: 12px;
            }
            @media print { body { margin: 8mm; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

   // 🚀 Auto-print on modal open
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        onClose();
        handlePrint();
      }, 500);
    }
  }, [visible]);
  // ✅ Customer
  const customer = previewData?.customer || {};

  const quotationNo =
    previewData?.quotation_no ||
    previewData?.quotationNumber ||
    previewData?.quotation_id ||
    "QTN-XXXX";

  const validity = previewData?.validity_date
    ? dayjs(previewData.validity_date).format("DD-MM-YYYY")
    : previewData?.validity || "-";

  const currency = previewData?.currency_code || "INR";

  // ✅ Products fix
  const items = Array.isArray(previewData?.products)
    ? previewData.products.map((item: any) => ({
        product_name:
          item?.product_name ||
          item?.product?.name || // when nested
          item?.name ||
          "Unnamed Product",
        description: item?.description || "-",
        quantity: Number(item?.quantity || 0),
        unit_price: Number(item?.unit_price || 0),
        discount: Number(item?.discount || 0),
        tax_rate: Number(item?.tax_rate || 0),
        line_total:
          Number(item?.line_total) ||
          Number(item?.quantity || 0) * Number(item?.unit_price || 0),
      }))
    : [];

  const subtotal = items.reduce((sum: number, i: any) => sum + (i.line_total || 0), 0);
  const discount = Number(previewData?.discount_amount || 0);
  const tax = Number(previewData?.tax_amount || 0);
  const total = subtotal - discount + tax;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          Print
        </Button>,
        <Button key="close" onClick={onClose}>Close</Button>,
      ]}
    >
      <div ref={printRef}>
        {/* Header */}
        <div className="header">
          <img src={logo} alt="Company Logo" />
          <div className="company-info">
            <h2 style={{ margin: 0 }}>DSONIK</h2>
            <p>74, Anand industrial Estatee <br></br> Mohan Nagar, Gaziabad 201007</p>
            <p>GSTIN: 09AOGPK1379A1ZA</p>
            <p>Website: www.dsonik.com</p>
            <p>Email: info@dsonik.com | Ph: +91-9810776728</p>
          </div>
        </div>

        {/* Info */}
        <div className="info-section">
          <div className="info-box">
            <h4>Customer Details</h4>
            <p><b>{customer.name || "N/A"}</b></p>
            {customer.gst_no && <p>GSTIN: {customer.gst_no}</p>}
            {customer.cstate && <p>State: {customer.cstate}</p>}
            {customer.district && <p>District: {customer.district}</p>}
            <p>{customer.address || "Address not available"}</p>
            <p>Phone: {customer.phone || "-"}</p>
            {customer.email && <p>Email: {customer.email}</p>}
          </div>

          <div className="info-box-1">
            <h4>Quotation Info</h4>
            <p><b>No:</b> {quotationNo}</p>
            <p><b>Date:</b> {dayjs(previewData?.created_at || new Date()).format("DD-MM-YYYY")}</p>
            <p><b>Validity:</b> {validity}</p>
            <p><b>Currency:</b> {currency}</p>
            <p><b>Payment:</b> {previewData?.payment_terms || "50% Advance"}</p>
            <p><b>Delivery:</b> {previewData?.delivery_terms || "As discussed"}</p>
          </div>
        </div>

        {/* Table */}
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount (%)</th>
              <th>Tax (%)</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.product_name}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit_price.toFixed(2)}</td>
                  <td>{item.discount}</td>
                  <td>{item.tax_rate}</td>
                  <td>{item.line_total.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={8}>No products found</td></tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="totals">
          <p>Sub Total: ₹{subtotal.toFixed(2)}</p>
          <p>Discount: ₹{discount.toFixed(2)}</p>
          <p>Tax: ₹{tax.toFixed(2)}</p>
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
        <div className="bottom-section">
          <div className="signature">
            <p><b>Devender Kumar</b><br />Director<br />9810776728</p>
            <p><b>Sanjay</b><br />Business Partner<br />9220480010</p>
          </div>
          <div className="bank">
            <h4>Bank Details</h4>
            <p>Bank: HDFC Bank</p>
            <p>Account No: 50200058580458</p>
            <p>IFSC: HDFC0000527</p>
            <p>Branch: ANDAL</p>
          </div>
        </div>

        <p className="thankyou">Thank You For Your Business!</p>
      </div>
    </Modal>
  );
};

export default QuotationPreview;
