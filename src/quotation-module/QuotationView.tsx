// src/quotation-module/QuotationView.tsx
import React from "react";
import { Modal, Table } from "antd";
import dayjs from "dayjs";

type Props = {
  visible: boolean;
  onClose: () => void;
  data: any;
};

const QuotationView: React.FC<Props> = ({ visible, onClose, data }) => {
  if (!data) return null;

  const customer = data.customer || {};

  const items = Array.isArray(data.products)
    ? data.products.map((item: any, i: number) => ({
        key: i,
        product_name: item?.product_name || item?.name || "Unnamed Product",
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

  const columns = [
    { title: "S.No", render: (_: any, __: any, index: number) => index + 1 },
    { title: "Product", dataIndex: "product_name" },
    { title: "Description", dataIndex: "description" },
    { title: "Qty", dataIndex: "quantity" },
    { title: "Unit Price", dataIndex: "unit_price", render: (v: number) => `₹${v.toFixed(2)}` },
    { title: "Discount (%)", dataIndex: "discount" },
    { title: "Tax (%)", dataIndex: "tax_rate" },
    { title: "Total", dataIndex: "line_total", render: (v: number) => `₹${v.toFixed(2)}` },
  ];

  const subtotal = items.reduce((sum: number, i: any) => sum + (i.line_total || 0), 0);
  const discount = Number(data.discount_amount || 0);
  const tax = Number(data.tax_amount || 0);
  const total = subtotal - discount + tax;

  return (
    <Modal
      title={`Quotation: ${data.quotation_no || "QTN-XXXX"}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <h4>Customer Details</h4>
        <p><b>{customer.name || "N/A"}</b></p>
        <p>{customer.address || "-"}</p>
        <p>Phone: {customer.phone || "-"}</p>
        {customer.gst_no && <p>GST: {customer.gst_no}</p>}
        <p>State: {customer.cstate || "-"}, District: {customer.district || "-"}</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h4>Quotation Info</h4>
        <p>Quotation No: {data.quotation_no}</p>
        <p>Date: {dayjs(data.created_at || new Date()).format("DD-MM-YYYY")}</p>
        <p>Validity: {data.validity_date ? dayjs(data.validity_date).format("DD-MM-YYYY") : "-"}</p>
        <p>Payment: {data.payment_terms || "-"}</p>
        <p>Delivery: {data.delivery_terms || "-"}</p>
      </div>

      <Table
        dataSource={items}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        style={{ marginBottom: 16 }}
      />

      <div style={{ textAlign: "right", lineHeight: 1.6 }}>
        <p><b>Subtotal:</b> ₹{subtotal.toFixed(2)}</p>
        <p><b>Discount:</b> ₹{discount.toFixed(2)}</p>
        <p><b>Tax:</b> ₹{tax.toFixed(2)}</p>
        <h3><b>Net Total:</b> ₹{total.toFixed(2)}</h3>
      </div>

      {data.terms_conditions && (
        <div style={{ marginTop: 16 }}>
          <h4>Terms & Conditions</h4>
          <p>{data.terms_conditions}</p>
        </div>
      )}
    </Modal>
  );
};

export default QuotationView;
