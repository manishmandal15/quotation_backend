import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Select, message, Space, Input } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import QuotationPreview from "./QuotationPreview";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Option } = Select;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QuotationsApproval: React.FC = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [form] = Form.useForm();
  const [actionType, setActionType] = useState<"approved" | "rejected">("approved");

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [qRes, aRes, uRes, cRes, pRes] = await Promise.all([
        axios.get(`${BASE_URL}/quotations`),
        axios.get(`${BASE_URL}/quotation-approvals`),
        axios.get(`${BASE_URL}/users`),
        axios.get(`${BASE_URL}/customers`),
        axios.get(`${BASE_URL}/products`),
      ]);

      setQuotations(Array.isArray(qRes.data) ? qRes.data : []);
      setApprovals(Array.isArray(aRes.data) ? aRes.data : []);
      setUsers(Array.isArray(uRes.data) ? uRes.data : []);
      setCustomers(Array.isArray(cRes.data) ? cRes.data : []);
      setProducts(Array.isArray(pRes.data) ? pRes.data : []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getApproval = (quotationId: number) => {
    return approvals.find(a => a.quotation_id === quotationId) || {};
  };

  // Open approve/reject modal
  const openModal = (quotation: any, type: "approved" | "rejected") => {
    setSelectedQuotation(quotation);
    setActionType(type);
    const existingApproval = approvals.find(a => a.quotation_id === quotation.id);
    form.setFieldsValue({
      approver_id: existingApproval?.approver_id || undefined,
      comments: existingApproval?.comments || "",
    });
    setIsModalVisible(true);
  };

  // Approve / Reject save
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        quotation_id: selectedQuotation.id,
        approver_id: values.approver_id,
        status: actionType,
        comments: values.comments || null,
      };

      const existingApproval = approvals.find(a => a.quotation_id === selectedQuotation.id);
      if (existingApproval) {
        await axios.put(`${BASE_URL}/quotation-approvals/${existingApproval.id}`, payload);
      } else {
        await axios.post(`${BASE_URL}/quotation-approvals`, payload);
      }

      message.success(`Quotation ${actionType} successfully!`);
      setIsModalVisible(false);
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to save approval");
    }
  };

  const handlePreview = async (quotation: any) => {
  try {
    // Fetch full quotation details from backend, including products
    const { data } = await axios.get(`${BASE_URL}/quotations/${quotation.id}`);

    // Map products with master product info
    const productsMapped = (data.products ?? []).map((item: any) => {
      const product = products.find(p => p.id === item.product_id);
      return {
        ...item,
        product_name: product?.name || "Unnamed Product",
        description: item.description || product?.description || "",
        unit_price: item.unit_price || product?.price || 0,
      };
    });

    // Map customer
    const customer = customers.find(c => c.id === data.customer_id) || {};

    setSelectedQuotation({
      ...data,
      products: productsMapped,
      customer,
      terms_conditions: data.terms_conditions || "",
    });
    setPreviewVisible(true);
  } catch (err) {
    console.error("Failed to load quotation preview:", err);
    message.error("Unable to load quotation preview");
  }
};


  const columns = [
    { title: "S.No", render: (_: any, __: any, i: number) => i + 1, width: 60 },
    { title: "Quotation No", dataIndex: "quotation_no", key: "quotation_no" },
    { title: "Customer Name", key: "customer_name",
      render: (_: any, record: any) => {
        const customer = customers.find(c => c.id === record.customer_id);
        return customer?.name || "-";
      }
    },
    { title: "Created At", dataIndex: "created_at", key: "created_at",
      render: (v: string) => v ? dayjs(v).format("DD-MM-YYYY") : "-" },
    { title: "Net Amount (₹)", dataIndex: "net_amount", key: "net_amount",
      align: "right" as const,
      render: (v: number) => v.toLocaleString("en-IN", { minimumFractionDigits: 2 }) },
    { title: "Approver Name", key: "approver_name",
      render: (_: any, record: any) => getApproval(record.id).approver_name || "-" },
    { title: "Status", key: "status",
      render: (_: any, record: any) => {
        const status = getApproval(record.id).status || "pending";
        return <span style={{ color: status==="approved"?"green":status==="rejected"?"red":"orange", fontWeight: 500, textTransform:"capitalize" }}>{status}</span>;
      }
    },
    { title: "Approved Date", key: "approved_at",
      render: (_: any, record: any) => {
        const date = getApproval(record.id).approved_at;
        return date ? dayjs(date).format("DD-MM-YYYY") : "-";
      }
    },
    { title: "Actions", key: "actions",
      render: (_: any, record: any) => {
        const status = getApproval(record.id).status || "pending";
        return (
          <Space>
  <Button 
    icon={<EyeOutlined />} 
    type="default" 
    onClick={() => handlePreview(record)} 
  />
  <Button 
    icon={<CheckOutlined />} 
    type="primary" 
    disabled={status === "approved"} 
    onClick={() => openModal(record, "approved")} 
  />
  <Button 
    icon={<CloseOutlined />} 
    type="default" 
    danger 
    disabled={status === "rejected"} 
    onClick={() => openModal(record, "rejected")} 
  />
</Space>
        );
      }
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quotations Approval</h2>
      <Table
        dataSource={quotations}
        columns={columns}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />

      {/* Approve / Reject Modal */}
      <Modal
        title={actionType === "approved" ? "Approve Quotation" : "Reject Quotation"}
        open={isModalVisible}
        onCancel={()=>setIsModalVisible(false)}
        onOk={handleSave}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="approver_id" label="Select Approver" rules={[{ required: true, message: "Select an approver" }]}>
            <Select placeholder="Select Approver">
              {users.map(u => <Option key={u.id} value={u.id}>{u.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="comments" label="Comments">
            <Input placeholder="Enter comments (optional)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Quotation Modal */}
      {previewVisible && selectedQuotation && (
        <QuotationPreview
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          previewData={selectedQuotation}
        />
      )}
    </div>
  );
};

export default QuotationsApproval;
