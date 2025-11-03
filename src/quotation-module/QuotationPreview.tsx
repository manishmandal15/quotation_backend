// src/quotation-module/QuotationPreview.tsx
import React, { useRef } from "react";
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
              margin: 20px;
              color: #000;
              font-size: 12px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .header img {
              height: 70px;
            }
            .company-info {
              text-align: right;
              font-size: 12px;
            }
            .info-section {
              display: flex;

              margin-top: 15px;
             
              padding: 10px;
             
            }
            .info-box {
              width: 48%;
              line-height: 1.5;
              border-buttom: 1px solid black;
             
            }
             .info-box-1{
            margin-left: 20%;
             }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
              font-size: 11px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 6px;
              text-align: center;
            }
            th {
              background: #f5f5f5;
            }
            .totals {
              text-align: right;
              margin-top: 15px;
              font-size: 12px;
            }
            .footer {
              margin-top: 25px;
              display: flex;
              justify-content: space-between;
              gap: 20px;
            }
            .terms, .bank {
              width: 48%;
              font-size: 11px;
              line-height: 1.5;
            }
            .signature {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
              font-size: 12px;
            }
            .thankyou {
              text-align: center;
              margin-top: 30px;
              font-weight: bold;
              font-size: 13px;
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  // Customer & quotation data
  const customer = previewData?.customer || {
    name: previewData?.customer_name || "Customer Name",
    address: previewData?.customer_address || "Customer Address",
    phone: previewData?.customer_phone || "0000000000",
    email: previewData?.customer_email || "customer@example.com",
  };

  const quotationNo =
    previewData?.quotation_no ||
    previewData?.quotationNumber ||
    previewData?.quotation_id ||
    "QTN-XXXX";

  const validity = previewData?.validity_date
    ? dayjs(previewData.validity_date).format("DD-MM-YYYY")
    : previewData?.validity || "-";

  const currency = previewData?.currency_code || "INR";

  const items = Array.isArray(previewData?.products)
    ? previewData.products.map((item: any) => ({
        product_name: item?.product_name || "Unnamed Product",
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
      width={950}
      footer={[
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          Print
        </Button>,
        <Button key="close" onClick={onClose}>Close</Button>,
      ]}
    >
      <div ref={printRef}>
        {/* Header (same as before) */}
        <div className="header">
          <img src={logo} alt="Company Logo" />
          <div className="company-info">
            <h2 style={{ margin: 0 }}>D SONIK</h2>
            <p>Andal, Durgapur, West Bengal - 713321</p>
            <p>GSTIN: 19AOJPK7756E1Z3</p>
            <p>Email: dsonik.info@gmail.com | Ph: +91-9832470834</p>
          </div>
        </div>

        {/* Quotation + Customer Info */}
        <div className="info-section">
          <div className="info-box">
            <h4>Customer Details</h4>
            <p><b>{customer.name}</b></p>
            <p>{customer.address}</p>
            <p>Contact: {customer.phone}</p>
            <p>Email: {customer.email}</p>
          </div>
           
          <div className="info-box-1">
            <h4>Quotation Info</h4>
            <p><b>Quotation No:</b> {quotationNo}</p>
            <p><b>Validity:</b> {validity}</p>
            <p><b>Currency:</b> {currency}</p>
            <p><b>Payment:</b> {previewData?.payment_terms || "Net 30 Days"}</p>
            <p><b>Delivery:</b> {previewData?.delivery_terms || "As per discussion"}</p>
          </div>
        </div>

        {/* Product Table */}
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
              <tr><td colSpan={8}>No items found</td></tr>
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

        {/* Terms & Bank Details */}
        <div className="footer">
          <div className="terms">
            <h4>Terms & Conditions</h4>
            <ol>
              <li>Price: Ex works</li>
              <li>GST: 18% Extra</li>
              <li>Packing: NA for Delhi NCR</li>
              <li>Freight: NA for Delhi NCR</li>
              <li>Payment: 50% advance, 50% before dispatch</li>
              <li>Delivery: Within 10 working days after receiving order and advance</li>
              <li>Warranty: 1-year standard warranty except consumables</li>
              <li>Cancellation: 10% + GST applicable in case of cancellation</li>
              <li>Subject to Ghaziabad Jurisdiction</li>
            </ol>
          </div>

          <div className="bank">
            <h4>Bank Details</h4>
            <p>Bank Name: HDFC Bank</p>
            <p>Account No: 50200058580458</p>
            <p>IFSC: HDFC0000527</p>
            <p>Branch: ANDAL</p>
          </div>
        </div>

        {/* Signature */}
        <div className="signature">
          <p><b>Devender Kumar</b><br />Director<br />9810776728</p>
          <p><b>Sanjay</b><br />Business Partner<br />9220480010</p>
        </div>

        <p className="thankyou">Thank You For Your Business!</p>
      </div>
    </Modal>
  );
};

export default QuotationPreview;
