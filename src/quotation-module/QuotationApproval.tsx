import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Typography,
  Card,
  Popconfirm,
} from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import QuotationPreview from "./QuotationPreview"; // ⬅️ use preview component

const { Title } = Typography;
const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// 🔹 API Clients
const APPROVAL_API = axios.create({ baseURL: `${BASE_URL}/quotation-approvals` });
const QUOTATION_API = axios.create({ baseURL: `${BASE_URL}/quotations` });
const CUSTOMER_API = axios.create({ baseURL: `${BASE_URL}/customers` });

const QuotationApprovalDesk: React.FC = () => {
  const [quotationList, setQuotationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false); // modal state
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null); // selected quotation for preview

  // ✅ Load quotations + customers + approvals
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

      // ✅ Merge quotation + customer + approval
      const mapped = quotations.map((q: any) => {
        const customer =
          customers.find(
            (c) =>
              String(c.id) === String(q.customer_id) ||
              String(c.customer_id) === String(q.customer_id)
          ) || {};

        const approval =
          approvals.find(
            (a) =>
              String(a.quotation_id) === String(q.id) ||
              String(a.id) === String(q.approval_id)
          ) || {};

        const net_amount =
          Number(q.net_amount) ||
          (Array.isArray(q.items)
            ? q.items.reduce((sum: number, item: any) => {
                const price = Number(item.price || item.unit_price || 0);
                const qty = Number(item.quantity || item.qty || 0);
                return sum + price * qty;
              }, 0)
            : 0);

        return {
          ...q,
          customer_name: q.customer_name || customer.name || "N/A",
          customer,
          approval_id: approval.id || null,
          approver_name: approval.approver_name || "-",
          status: approval.status || "pending",
          approved_at: approval.approved_at || null,
          net_amount,
        };
      });

      setQuotationList(mapped);
    } catch (err) {
      console.error("❌ Error loading data:", err);
      message.error("Failed to load quotation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ✅ Approve
  const handleApprove = async (record: any) => {
    try {
      const approverName = localStorage.getItem("username") || "Admin";
      const approvedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");

      await APPROVAL_API.put(`/${record.approval_id || record.id}`, {
        status: "approved",
        approver_name: approverName,
        approved_at: approvedAt,
        comments: "Approved successfully",
      });

      message.success("Quotation approved successfully!");
      loadAllData();
    } catch {
      message.error("Approval failed");
    }
  };

  // ✅ Reject
  const handleReject = async (record: any) => {
    try {
      const approverName = localStorage.getItem("username") || "Admin";
      const rejectedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");

      await APPROVAL_API.put(`/${record.approval_id || record.id}`, {
        status: "rejected",
        approver_name: approverName,
        approved_at: rejectedAt,
        comments: "Rejected by approver",
      });

      message.success("Quotation rejected!");
      loadAllData();
    } catch {
      message.error("Rejection failed");
    }
  };

  // ✅ Preview modal
  const handlePreview = (record: any) => {
    setSelectedQuotation(record);
    setPreviewVisible(true);
  };

  const columns = [
    { title: "S.No", render: (_: any, __: any, i: number) => i + 1, width: 60 },
    { title: "Quotation No", dataIndex: "quotation_no", key: "quotation_no" },
    { title: "Customer Name", dataIndex: "customer_name", key: "customer_name" },
    {
      title: "Net Amount (₹)",
      dataIndex: "net_amount",
      key: "net_amount",
      align: "right" as const,
      render: (v: number) =>
        v ? v.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00",
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
      render: (v: string | null) => (v ? dayjs(v).format("DD-MM-YYYY HH:mm") : "-"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} shape="circle" onClick={() => handlePreview(record)} />
          <Popconfirm
            title="Approve this quotation?"
            onConfirm={() => handleApprove(record)}
            disabled={record.status === "approved"}
          >
            <Button
              icon={<CheckOutlined />}
              type="primary"
              shape="circle"
              disabled={record.status === "approved"}
              style={{ background: "#52c41a", borderColor: "#52c41a" }}
            />
          </Popconfirm>
          <Popconfirm
            title="Reject this quotation?"
            onConfirm={() => handleReject(record)}
            disabled={record.status === "rejected"}
          >
            <Button icon={<CloseOutlined />} danger shape="circle" disabled={record.status === "rejected"} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>🗂 Quotation Approval Desk</Title>
      </div>

      <Table
        columns={columns}
        dataSource={quotationList}
        rowKey="id"
        bordered
        loading={loading}
      />

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
