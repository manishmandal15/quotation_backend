// ✅ src/quotation-module/QuotationApprovalDesk.tsx

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Typography,
  Card,
  Modal,
  Descriptions,
  Popconfirm,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title } = Typography;

// 🔹 API linked with QuotationApprovalController
const APPROVAL_API = axios.create({
  baseURL: "http://localhost:5000/api/quotation-approvals",
});

const QuotationApprovalDesk: React.FC = () => {
  const [approvalList, setApprovalList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState<any | null>(null);

  // 🔹 Fetch all approvals
  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await APPROVAL_API.get("/");
      setApprovalList(res.data || []);
    } catch {
      message.error("Error loading approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  // 🔹 Approve API call
  const handleApprove = async (record: any) => {
    try {
      await APPROVAL_API.put(`/${record.id}`, {
        status: "approved",
        comments: "Approved successfully",
      });
      message.success("Quotation approved successfully!");
      fetchApprovals();
    } catch {
      message.error("Failed to approve quotation");
    }
  };

  // 🔹 Reject API call
  const handleReject = async (record: any) => {
    try {
      await APPROVAL_API.put(`/${record.id}`, {
        status: "rejected",
        comments: "Rejected by approver",
      });
      message.success("Quotation rejected successfully!");
      fetchApprovals();
    } catch {
      message.error("Failed to reject quotation");
    }
  };

  // 🔹 Table columns
  const columns = [
    {
      title: "S.No",
      render: (_: any, __: any, i: number) => i + 1,
      width: 70,
    },
    { title: "Quotation No", dataIndex: "quotation_no" },
    { title: "Approver Name", dataIndex: "approver_name" },
    {
      title: "Status",
      dataIndex: "status",
      render: (v: string) => (
        <span
          style={{
            color:
              v === "approved"
                ? "green"
                : v === "rejected"
                ? "red"
                : "orange",
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
      render: (v: string | null) =>
        v ? dayjs(v).format("DD-MM-YYYY HH:mm") : "-",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          {/* 👁 View Button */}
          <Button
            icon={<EyeOutlined />}
            shape="circle"
            onClick={() => setViewModal(record)}
          />

          {/* ✅ Approve Button with Popconfirm */}
          <Popconfirm
            title="Are you sure to approve this quotation?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleApprove(record)}
            disabled={record.status === "approved"}
          >
            <Button
              icon={<CheckOutlined />}
              type="primary"
              shape="circle"
              disabled={record.status === "approved"}
              style={{
                background: "#52c41a",
                borderColor: "#52c41a",
              }}
            />
          </Popconfirm>

          {/* ❌ Reject Button with Popconfirm */}
          <Popconfirm
            title="Are you sure to reject this quotation?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleReject(record)}
            disabled={record.status === "rejected"}
          >
            <Button
              icon={<CloseOutlined />}
              danger
              shape="circle"
              disabled={record.status === "rejected"}
            />
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
        dataSource={approvalList}
        rowKey="id"
        bordered
        loading={loading}
      />

      {/* 🔹 View Details Modal */}
      <Modal
        open={!!viewModal}
        title="Approval Details"
        footer={null}
        onCancel={() => setViewModal(null)}
      >
        {viewModal && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Quotation No">
              {viewModal.quotation_no}
            </Descriptions.Item>
            <Descriptions.Item label="Approver Name">
              {viewModal.approver_name}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <span
                style={{
                  color:
                    viewModal.status === "approved"
                      ? "green"
                      : viewModal.status === "rejected"
                      ? "red"
                      : "orange",
                  textTransform: "capitalize",
                  fontWeight: 500,
                }}
              >
                {viewModal.status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Comments">
              {viewModal.comments || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Approved At">
              {viewModal.approved_at
                ? dayjs(viewModal.approved_at).format("DD-MM-YYYY HH:mm")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

export default QuotationApprovalDesk;
