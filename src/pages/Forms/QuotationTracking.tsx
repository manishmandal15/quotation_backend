
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Space,
  Tooltip
} from "antd";
import {
  SendOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

const API = axios.create({
  baseURL: "http://localhost:5000/api/quotation-tracking",
});

type Quotation = {
  id: number;
  quotation_no: string;
  customer_name: string;
  quotation_date?: string; // ISO or formatted string
  net_amount?: number;
  approved_by?: string;
  approved_date?: string;
  is_dispatched?: boolean;
  dispatched_date?: string | null;
  dispatched_through?: string | null;
  deal_status?: string | null; // e.g. "Open" | "Closed"
  follow_up_date?: string | null;
};

type User = {
  id: number;
  name: string;
};

const loggedInUser = "CurrentUser"; 

const DispatchFormFields = {
  DISPATCH_THROUGH: "dispatched_through",
  DISPATCH_DATE: "dispatched_date",
  DISPATCHED_BY: "dispatched_by",
};

const FollowupFormFields = {
  PLANNED_FOLLOWUP_DATE: "planned_followup_date",
  ACTUAL_FOLLOWUP_DATE: "actual_followup_date",
  IS_DEAL_FINALISED: "is_deal_finalised",
  INVOICE_NO: "invoice_no",
  CUSTOMER_WANTS_TIME: "customer_wants_time",
  NEXT_FOLLOWUP_DATE: "next_followup_date",
  FOLLOWUP_BY: "followup_by",
};

const QuotationTracking: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Dispatch modal state
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [dispatchForm] = Form.useForm();
  const [currentDispatchRow, setCurrentDispatchRow] = useState<Quotation | null>(null);

  // Followup modal state
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [followupForm] = Form.useForm();
  const [currentFollowupRow, setCurrentFollowupRow] = useState<Quotation | null>(null);
  
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<Quotation | null>(null);

  // Fetch quotations (under process)
  const fetchQuotations = async () => {
    setLoading(true);
    try {
      // example GET / => returns array of quotations
      const res = await API.get("/");
      // expecting res.data = Quotation[]
      setQuotations(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch quotations");
    } finally {
      setLoading(false);
    }
  };

   // ✅ Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      message.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchQuotations();
    fetchUsers();
  }, []);

  // Open dispatch modal
  const openDispatchModal = (row: Quotation) => {
    setCurrentDispatchRow(row);
    setIsDispatchOpen(true);
    dispatchForm.resetFields();
    // preset dispatched_by to logged in user
    dispatchForm.setFieldsValue({
      [DispatchFormFields.DISPATCHED_BY]: loggedInUser,
      [DispatchFormFields.DISPATCH_THROUGH]: "Email",
    });
  };

  // Handle dispatch save
  const handleDispatchSave = async (values: any) => {
    if (!currentDispatchRow) return;
    try {
      // Format date if DayJS/moment object provided
      const dispatchedDate =
        values[DispatchFormFields.DISPATCH_DATE] && values[DispatchFormFields.DISPATCH_DATE].format
          ? values[DispatchFormFields.DISPATCH_DATE].format("YYYY-MM-DD")
          : values[DispatchFormFields.DISPATCH_DATE];

      const payload = {
        quotation_id: currentDispatchRow.id,
        dispatched: true,
        dispatched_through: values[DispatchFormFields.DISPATCH_THROUGH],
        dispatched_date: dispatchedDate,
        dispatched_by: values[DispatchFormFields.DISPATCHED_BY],
      };

      // POST to dispatch endpoint (change to your real endpoint)
      await API.post(`/dispatch`, payload);

      message.success("Dispatched successfully");
      setIsDispatchOpen(false);
      fetchQuotations();
    } catch (err) {
      console.error(err);
      message.error("Error while dispatching");
    }
  };

  // Open followup modal
  const openFollowupModal = (row: Quotation) => {
    setCurrentFollowupRow(row);
    setIsFollowupOpen(true);
    followupForm.resetFields();

    // preset planned & actual followup dates if exist
    followupForm.setFieldsValue({
      [FollowupFormFields.PLANNED_FOLLOWUP_DATE]: row.follow_up_date || null,
      [FollowupFormFields.FOLLOWUP_BY]: loggedInUser,
      [FollowupFormFields.IS_DEAL_FINALISED]: "No",
      [FollowupFormFields.CUSTOMER_WANTS_TIME]: "No",
    });
  };

  // Handle followup save
  const handleFollowupSave = async (values: any) => {
    if (!currentFollowupRow) return;
    try {
      const nextFollowupDate =
        values[FollowupFormFields.NEXT_FOLLOWUP_DATE] && values[FollowupFormFields.NEXT_FOLLOWUP_DATE].format
          ? values[FollowupFormFields.NEXT_FOLLOWUP_DATE].format("YYYY-MM-DD")
          : values[FollowupFormFields.NEXT_FOLLOWUP_DATE];

      const payload = {
        quotation_id: currentFollowupRow.id,
        planned_followup_date: values[FollowupFormFields.PLANNED_FOLLOWUP_DATE] || currentFollowupRow.follow_up_date,
        actual_followup_date: values[FollowupFormFields.ACTUAL_FOLLOWUP_DATE] || null,
        is_deal_finalised: values[FollowupFormFields.IS_DEAL_FINALISED] === "Yes",
        invoice_no: values[FollowupFormFields.INVOICE_NO] || null,
        customer_wants_time: values[FollowupFormFields.CUSTOMER_WANTS_TIME] === "Yes",
        next_followup_date: nextFollowupDate || null,
        followup_by: values[FollowupFormFields.FOLLOWUP_BY] || loggedInUser,
      };

      // POST to followup endpoint (change to your real endpoint)
      await API.post(`/followup`, payload);

      message.success("Followup saved");
      setIsFollowupOpen(false);
      fetchQuotations();
    } catch (err) {
      console.error(err);
      message.error("Error while saving followup");
    }
  };

  // Optional View details (simple view modal)
  // const [isViewOpen, setIsViewOpen] = useState(false);
  // const [viewRow, setViewRow] = useState<Quotation | null>(null);

  const openViewModal = (row: Quotation) => {
    setViewRow(row);
    setIsViewOpen(true);
  };

  // Approve / Reject handlers (optional)
  const handleApprove = async (row: Quotation) => {
    try {
      await API.post(`/approve`, { quotation_id: row.id, approved_by: loggedInUser });
      message.success("Quotation approved");
      fetchQuotations();
    } catch (err) {
      console.error(err);
      message.error("Error while approving");
    }
  };

  const handleReject = async (row: Quotation) => {
    try {
      await API.post(`/reject`, { quotation_id: row.id, rejected_by: loggedInUser });
      message.success("Quotation rejected");
      fetchQuotations();
    } catch (err) {
      console.error(err);
      message.error("Error while rejecting");
    }
  };

  // Table columns
  const columns: ColumnsType<Quotation> = [
    {
      title: "Sno",
      key: "sno",
      render: (_text, _record, index) => index + 1,
      width: 60,
    },
    { title: "Quotation No.", dataIndex: "quotation_no", key: "quotation_no" },
    { title: "Customer Name", dataIndex: "customer_name", key: "customer_name" },
    {
      title: "Quotation Date",
      dataIndex: "quotation_date",
      key: "quotation_date",
      render: (d: string) => (d ? d : "-"),
    },
    { title: "Net Amount", dataIndex: "net_amount", key: "net_amount" },
    { title: "Approved By", dataIndex: "approved_by", key: "approved_by" },
    { title: "Approved Date", dataIndex: "approved_date", key: "approved_date" },
    {
      title: "Dispatched",
      dataIndex: "is_dispatched",
      key: "is_dispatched",
      //  render: (v: boolean) => (v ? "Yes" : "No"),
    },
    { title: "Dispatched Date", dataIndex: "dispatched_date", key: "dispatched_date" },
    { title: "Dispatched Through", dataIndex: "dispatched_through", key: "dispatched_through" },
    { title: "Deal Status", dataIndex: "deal_status", key: "deal_status" },
    { title: "Follow Up Date", dataIndex: "followup_date", key: "followup_date" },
    {
      title: "Action",
      key: "actions",
      fixed: "right",
      width: 220,
      render: (_text, record) => (
        <Space>
             <Tooltip title="view">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => openViewModal(record)}
            style={{ borderRadius: 4 }}
          >
            
          </Button>
          </Tooltip>

          {/* Send (Dispatch) - always visible when not dispatched */}
          <Tooltip title="send">
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => openDispatchModal(record)}
            style={{ borderRadius: 4 }}
          >
            
          </Button>
          </Tooltip>

          {/* Followup - enable if dispatched = true, otherwise disabled */}
          <Tooltip title="Follow-up">
               <Button
                type="default"
                icon={<ClockCircleOutlined />}
                onClick={() => openFollowupModal(record)}
                 disabled={!record.is_dispatched}
                  style={{ borderRadius: 4 }}
                 />
           </Tooltip>

          {/* Optional approve/reject quick controls */}
          <Popconfirm
             title="Approve this quotation?"
              onConfirm={() => handleApprove(record)}
               >
               <Tooltip title="Approve Quotation">
                   <Button type="default" icon={<CheckOutlined />} />
               </Tooltip>
           </Popconfirm>

          

          <Popconfirm
            title="Reject this quotation?"
            onConfirm={() => handleReject(record)}
           >
          <Tooltip title="Reject Quotation">
               <Button type="default" icon={<CloseOutlined />} danger />
          </Tooltip>
          </Popconfirm>
          
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Quotation Tracking</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => fetchQuotations()}
        >
          Refresh
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={quotations}
        rowKey={(r) => r.id}
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1200 }}
      />

      {/* Dispatch Modal */}
      <Modal
        title={`Dispatch Quotation ${currentDispatchRow?.quotation_no ?? ""}`}
        open={isDispatchOpen}
        onCancel={() => setIsDispatchOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={dispatchForm} onFinish={handleDispatchSave}>
          <Form.Item
            label="Dispatch Through"
            name={DispatchFormFields.DISPATCH_THROUGH}
            rules={[{ required: true, message: "Select dispatch method" }]}
          >
            <Select>
              <Select.Option value="Email">Email</Select.Option>
              <Select.Option value="SMS">SMS</Select.Option>
              <Select.Option value="Post">Post</Select.Option>
              <Select.Option value="Manual">Manual</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Dispatch Date"
            name={DispatchFormFields.DISPATCH_DATE}
            rules={[{ required: true, message: "Select dispatch date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* ✅ Changed from Input → Dropdown (Users) */}
          <Form.Item
            label="Dispatched By"
            name={DispatchFormFields.DISPATCHED_BY}
            rules={[{ required: true, message: "Select dispatched by user" }]}
          >
            <Select placeholder="Select User">
              {users.map((u) => (
                <Select.Option key={u.id} value={u.name}>
                  {u.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsDispatchOpen(false)} style={{ marginRight: 8 }}>
              Close
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Followup Modal */}
      <Modal
        title={`Followup - Quotation ${currentFollowupRow?.quotation_no ?? ""}`}
        open={isFollowupOpen}
        onCancel={() => setIsFollowupOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={followupForm} onFinish={handleFollowupSave}>
          <Form.Item label="Planned Follow Up Date" name={FollowupFormFields.PLANNED_FOLLOWUP_DATE}>
            <Input disabled placeholder={currentFollowupRow?.follow_up_date ?? "N/A"} />
          </Form.Item>

          <Form.Item label="Actual Follow Up Date" name={FollowupFormFields.ACTUAL_FOLLOWUP_DATE}>
            <Input disabled placeholder="(Auto-recorded if needed)" />
          </Form.Item>

          <Form.Item
            label="Is Deal Finalised?"
            name={FollowupFormFields.IS_DEAL_FINALISED}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Invoice No (if finalised)" name={FollowupFormFields.INVOICE_NO}>
            <Input placeholder="Enter invoice no (if deal finalised)" />
          </Form.Item>

          <Form.Item
            label="Customer Wants Time?"
            name={FollowupFormFields.CUSTOMER_WANTS_TIME}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Next Followup Date" name={FollowupFormFields.NEXT_FOLLOWUP_DATE}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Follow up By" name={FollowupFormFields.FOLLOWUP_BY}>
            <Input disabled />
          </Form.Item>

          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsFollowupOpen(false)} style={{ marginRight: 8 }}>
              Close
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`Quotation Details ${viewRow?.quotation_no ?? ""}`}
        open={isViewOpen}
        onCancel={() => setIsViewOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewOpen(false)}>
            Close
          </Button>,
        ]}
        destroyOnClose
      >
        {viewRow ? (
          <div>
            <p><strong>Quotation No:</strong> {viewRow.quotation_no}</p>
            <p><strong>Customer:</strong> {viewRow.customer_name}</p>
            <p><strong>Quotation Date:</strong> {viewRow.quotation_date}</p>
            <p><strong>Net Amount:</strong> {viewRow.net_amount}</p>
            <p><strong>Approved By:</strong> {viewRow.approved_by}</p>
            <p><strong>Approved Date:</strong> {viewRow.approved_date}</p>
            <p><strong>Dispatched:</strong> {viewRow.is_dispatched ? "Yes" : "No"}</p>
            <p><strong>Dispatched Date:</strong> {viewRow.dispatched_date}</p>
            <p><strong>Dispatched Through:</strong> {viewRow.dispatched_through}</p>
            <p><strong>Deal Status:</strong> {viewRow.deal_status}</p>
            <p><strong>Follow Up Date:</strong> {viewRow.follow_up_date}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default QuotationTracking;



