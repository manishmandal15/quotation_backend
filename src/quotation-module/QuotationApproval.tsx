import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Typography, Card } from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import QuotationPreview from "./QuotationPreview";

const { Title } = Typography;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API clients
const APPROVAL_API = axios.create({ baseURL: `${BASE_URL}/quotation-approvals` });
const QUOTATION_API = axios.create({ baseURL: `${BASE_URL}/quotations` });
const CUSTOMER_API = axios.create({ baseURL: `${BASE_URL}/customers` });
const PRODUCT_API = axios.create({ baseURL: `${BASE_URL}/products` });

const QuotationApprovalDesk: React.FC = () => {
  const [quotationList, setQuotationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await PRODUCT_API.get("/");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Load all data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [quotationRes, customerRes, approvalRes] = await Promise.all([
        QUOTATION_API.get("/"),
        CUSTOMER_API.get("/"),
        APPROVAL_API.get("/"),
      ]);

      const quotations = Array.isArray(quotationRes.data) ? quotationRes.data : [];
      const customers = Array.isArray(customerRes.data) ? customerRes.data : [];
      const approvals = Array.isArray(approvalRes.data) ? approvalRes.data : [];

      const mapped = quotations.map((q: any) => {
        const customer = customers.find(c => String(c.id) === String(q.customer_id)) || {};
        const approval = approvals.find(a => String(a.quotation_id) === String(q.id));

        const net_amount =
          Number(q.net_amount) ||
          (Array.isArray(q.items)
            ? q.items.reduce((sum: number, item: any) => {
                const price = Number(item.unit_price || 0);
                const qty = Number(item.quantity || 0);
                return sum + price * qty;
              }, 0)
            : 0);

        return {
          ...q,
          customer,
          customer_name: customer.name || "N/A",
          approval_id: approval?.id || null,
          created_at: q.created_at,
          approver_name: approval?.approver_name || "-",
          status: approval?.status || "pending",
          approved_at: approval?.approved_at || null,
          net_amount,
        };
      });

      setQuotationList(mapped);
    } catch (err) {
      console.error("Error loading data:", err);
      message.error("Failed to load quotation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    loadAllData();
  }, []);

  // Approve or reject
  const handleApproval = async (record: any, status: "approved" | "rejected") => {
    if (!record.id) return message.error("Quotation ID missing");

    try {
      const approverId = Number(localStorage.getItem("user_id"));

      const payload = {
        quotation_id: record.id,
        approver_id: approverId,
        status,
        comments: status === "approved" ? "Approved successfully" : "Rejected by approver",
      };

      console.log("Approval Payload:", payload);

      if (record.approval_id) {
        await APPROVAL_API.put(`/${record.approval_id}`, payload);
      } else {
        await APPROVAL_API.post("/", payload);
      }

      message.success(`Quotation ${status} successfully!`);
      loadAllData();
    } catch (err) {
      console.error(`${status} failed:`, err);
      message.error(`${status} failed — check console`);
    }
  };

  // Preview quotation
  const handlePreview = async (record: any) => {
    try {
      const { data } = await QUOTATION_API.get(`/${record.id}`);
      const productsMapped = (data.products ?? []).map((item: any) => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          ...item,
          product_name: product?.name || "Unnamed Product",
          description: item.description || product?.description || "",
          unit_price: item.unit_price || product?.price || 0,
        };
      });
      setSelectedQuotation({ ...data, products: productsMapped, customer: record.customer });
      setPreviewVisible(true);
    } catch (err) {
      console.error("Failed to load quotation preview:", err);
      message.error("Unable to load quotation preview");
    }
  };

  const columns = [
    { title: "S.No", render: (_: any, __: any, i: number) => i + 1, width: 60 },
    { title: "Quotation No", dataIndex: "quotation_no", key: "quotation_no" },
    { title: "Customer Name", dataIndex: "customer_name", key: "customer_name" },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (v: string | null) => (v ? dayjs(v).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Net Amount (₹)",
      dataIndex: "net_amount",
      key: "net_amount",
      align: "right" as const,
      render: (v: number) =>
        v.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
    },
    { title: "Approver Name", dataIndex: "approver_name", key: "approver_name" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: string) => (
        <span
          style={{
            color: v === "approved" ? "green" : v === "rejected" ? "red" : "orange",
            fontWeight: 500,
            textTransform: "capitalize",
          }}
        >
          {v}
        </span>
      ),
    },
    {
      title: "Approved Date",
      dataIndex: "approved_at",
      key: "approved_at",
      render: (v: string | null) => (v ? dayjs(v).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} shape="circle" onClick={() => handlePreview(record)} />
          <Button
            icon={<CheckOutlined />}
            type="primary"
            shape="circle"
            onClick={() => handleApproval(record, "approved")}
            disabled={record.status === "approved"}
            style={{ background: "#52c41a", borderColor: "#52c41a" }}
          />
          <Button
            icon={<CloseOutlined />}
            danger
            shape="circle"
            onClick={() => handleApproval(record, "rejected")}
            disabled={record.status === "rejected"}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: "16px" }} style={{ width: "100%", overflowX: "auto" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          🗂 Quotation Approval Desk
        </Title>
        <Button onClick={loadAllData} type="default" style={{ minWidth: 120 }} loading={loading}>
          Refresh
        </Button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={quotationList}
          rowKey="id"
          bordered
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false, position: ["bottomCenter"] }}
          size="small"
          scroll={{ x: "max-content" }}
          style={{ minWidth: "100%", whiteSpace: "nowrap" }}
        />
      </div>

      {previewVisible && selectedQuotation && (
        <QuotationPreview
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          previewData={selectedQuotation}
        />
      )}
    </Card>
  );
};

export default QuotationApprovalDesk;
