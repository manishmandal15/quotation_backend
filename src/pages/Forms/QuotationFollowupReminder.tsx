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
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";



const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/quotation-tracking`,
});

const Api = axios.create({
  baseURL: BASE_URL,
});
const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");



type Quotation = {
  id: number;
  quotation_id: number;
  quotation_no: string;
  customer_name: string;
  quotation_date?: string;
  net_amount?: number;
  approved_by?: string;
  approved_date?: string;
  is_dispatched?: boolean;
  dispatched_date?: string | null;
  dispatched_through?: string | null;
  deal_status?: string | null;
  followup_date?: string | null;
  follow_up_date?: string | null;
  nextfollowup_date?: string | null;
  dispatched_by?: number;
  has_followup?: boolean;
  is_deal_finalised?: string | null;
};

type User = {
  id: number;
  name: string;
};

// const loggedInUser = "CurrentUser";

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

const QuotationFollowupReminder: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [dispatchForm] = Form.useForm();
  const [currentDispatchRow, setCurrentDispatchRow] = useState<Quotation | null>(null);
  const [searchText, setSearchText] = useState("");

  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [followupForm] = Form.useForm();
  const [currentFollowupRow, setCurrentFollowupRow] = useState<Quotation | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<Quotation | null>(null);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const [quotRes, trackRes] = await Promise.all([
        axios.get(`${BASE_URL}/quotations`),
        axios.get(`${BASE_URL}/quotation-tracking`),
      ]);

      const quotations = (quotRes.data || []).map((q: any) => ({
        ...q,
        id: q.id ?? q.quotation_id ?? q.sno,
      }));

      const tracking = trackRes.data || [];

      const merged = tracking.map((t: any) => ({ 
        id: t.id,
        quotation_id: t.id,
        quotation_no: t.quotation_no ?? "-",
        quotation_date: t.quotation_date ?? "-",
        is_dispatched: t.is_dispatched ?? "No",
        dispatched_date: t.dispatched_date ?? "-",
        dispatched_through: t.dispatched_through ?? "-",
        approved_by: t.approved_by ?? "-",
        approved_date: t.approved_date ?? "-",
        deal_status: t.deal_status ?? "Pending",
        followup_date: t.followup_date ?? t.follow_up_date ?? "-",
        nextfollowup_date: t.nextfollowup_date ?? "-",
        dispatched_by: t.dispatched_by ?? null,
        has_followup: t.has_followup ?? false,
        net_amount: t.net_amount ?? "0",
        customer_name: t.customer_name ?? "-",
        is_deal_finalised: t.is_deal_finalised ?? "No",
      }));

      setQuotations(merged);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch quotations");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
       const res = await axios.get(`${BASE_URL}/users`);
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchQuotations();
    fetchUsers();
  }, []);

  const openDispatchModal = (row: Quotation) => {
    setCurrentDispatchRow(row);
    setIsDispatchOpen(true);
    dispatchForm.resetFields();

    setTimeout(() => {
      dispatchForm.setFieldsValue({
        dispatched_by: loggedInUser,
        dispatched_through: "Email",
      });
    }, 0);
  };

  const handleDispatchSave = async (values: any) => {
    if (!currentDispatchRow) return;

    try {
      const dispatchedDate =
        values.dispatched_date && values.dispatched_date.format
          ? values.dispatched_date.format("YYYY-MM-DD HH:mm:ss")
          : values.dispatched_date;

      const payload = {
        quotation_id: currentDispatchRow.id,
        sent_by: Number(values.dispatched_by),
        method: String(values.dispatched_through).toLowerCase(),
        sent_at: dispatchedDate || new Date().toISOString().slice(0, 19).replace("T", " "),
        sent_to_email: currentDispatchRow.customer_email ?? "customer@example.com",
      };

      await Api.post("/quotation-dispatches", payload);

      message.success("Dispatched successfully");
      setIsDispatchOpen(false);
      fetchQuotations();
    } catch (err) {
      console.error(err);
      message.error("Error while dispatching");
    }
  };

  // const openFollowupModal = (row: Quotation) => {
  //   setCurrentFollowupRow(row);
  //   setIsFollowupOpen(true);
  //   followupForm.resetFields();
  // };
  const openFollowupModal = (row: Quotation) => {
  setCurrentFollowupRow(row);
  setIsFollowupOpen(true);
  followupForm.resetFields();

  followupForm.setFieldsValue({
    user_id: loggedInUser.id,
  });
};


  const handleFollowupSave = async (values: any) => {
    if (!currentFollowupRow) return;

    try {
      const nextFollowupDate =
        values.next_followup_date && values.next_followup_date.format
          ? values.next_followup_date.format("YYYY-MM-DD HH:mm:ss")
          : values.next_followup_date || null;

      const actualFollowupDate = new Date().toISOString().slice(0, 19).replace("T", " ");

      const payload = {
        quotation_id: currentFollowupRow.quotation_id,
        user_id: values.user_id,
        notes: values.notes || "",
        followup_date: actualFollowupDate,
        invoice_no: values.invoice_no || null,
        is_deal_finalised: values.is_deal_finalised,
        time_needed: values.customer_wants_time,
        next_followup_date: nextFollowupDate,
        followup_by: values.user_id,
        actual_followup_date: actualFollowupDate,
      };

      await Api.post("/quotation_followups", payload);

      message.success("Follow-up saved successfully");
      setIsFollowupOpen(false);
      fetchQuotations();
    } catch (err) {
      console.error(err);
      message.error("Error saving follow-up");
    }
  };

  const openViewModal = (row: Quotation) => {
    setViewRow(row);
    setIsViewOpen(true);
  };

  const columns: ColumnsType<Quotation> = [
    {
      title: "Sno",
      key: "sno",
      render: (_t, _r, index) => index + 1,
      width: 60,
    },
    { title: "Quotation No.", dataIndex: "quotation_no", key: "quotation_no" },
    { title: "Customer Name", dataIndex: "customer_name", key: "customer_name" },
    {
      title: "Quotation Date",
      dataIndex: "quotation_date",
      key: "quotation_date",
      render: (d) => d || "-",
    },
    { title: "Net Amount", dataIndex: "net_amount", key: "net_amount" },
    {
      title: "Dispatched",
      dataIndex: "is_dispatched",
      key: "is_dispatched",
    },
    { title: "Dispatched Date", dataIndex: "dispatched_date", key: "dispatched_date" },
    {
      title: "Dispatched Through",
      dataIndex: "dispatched_through",
      key: "dispatched_through",
    },
    {
      title: "Deal Finalised",
      dataIndex: "is_deal_finalised",
      key: "is_deal_finalised",
      render: (v) => (v === "Yes" ? "Yes" : "No"),
    },
    { title: "Follow Up Date", dataIndex: "followup_date", key: "followup_date" },
    { title: "Next Followup", dataIndex: "nextfollowup_date", key: "nextfollowup_date" },

    {
      title: "Action",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_text, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => openViewModal(record)}
              style={{ borderRadius: 4 }}
            />
          </Tooltip>

          <Tooltip
            title={
              !record.approved_by || record.approved_by === "-"
                ? "Approve first"
                : !record.is_dispatched
                ? "Dispatch first"
                : record.has_followup
                ? "Already done"
                : "Add Follow-up"
            }
          >
            <Button
              type="default"
              icon={<ClockCircleOutlined />}
              onClick={() => openFollowupModal(record)}
              disabled={!record.followup_date || record.followup_date === "-"}
              style={{ borderRadius: 4 }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 🔍 FIXED SEARCH (filteredData used below)
  const filteredData = quotations.filter((q) =>
    (q.quotation_no ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (q.customer_name ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (q.deal_status ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
   <div className="p-6">
  <div className="flex justify-between items-center mb-4">
    
    {/* Title */}
    <h2 className="text-2xl font-semibold">
      Quotation Followup & Reminders
    </h2>

    {/* Right Side: Search + Refresh */}
    <div className="flex items-center gap-3">

      {/* SEARCH INPUT */}
      <Input
        placeholder="Search quotation..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 320 }}
        allowClear
      />

      {/* REFRESH BUTTON */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => fetchQuotations()}
      >
        Refresh
      </Button>

    </div>
  </div>


      {/* ✅ FIX: SEARCH NOW WORKS */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(r) => r.id ?? r.quotation_id ?? 0}
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1200 }}
        onRow={(record) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const nextDate = record.nextfollowup_date
            ? new Date(record.nextfollowup_date)
            : null;

          let style = {};

          if (record.is_deal_finalised === "Yes") {
            style = { backgroundColor: "#ccffcc", fontWeight: 500 };
          } else if (nextDate && nextDate <= today) {
            style = { backgroundColor: "#ffcccc", fontWeight: 500 };
          }

          return { style };
        }}
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
            rules={[{ required: true }]}
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
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Dispatched By"
            name={DispatchFormFields.DISPATCHED_BY}
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select User"
              showSearch
              optionFilterProp="label"
              options={users.map((u) => ({
                label: u.name,
                value: u.id,
              }))}
            />
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
          <Form.Item label="Planned Follow Up Date" name="planned_followup_date">
            <Input disabled placeholder={currentFollowupRow?.follow_up_date ?? "N/A"} />
          </Form.Item>

          <Form.Item label="Actual Follow Up Date" name="actual_followup_date">
            <Input disabled placeholder="Auto Recorded" />
          </Form.Item>

          <Form.Item
            label="Is Deal Finalised?"
            name="is_deal_finalised"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Invoice No" name="invoice_no">
            <Input placeholder="Enter invoice no" />
          </Form.Item>

          <Form.Item
            label="Customer Wants Time?"
            name="customer_wants_time"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Next Followup Date" name="next_followup_date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
  label="Followup By"
  name="user_id"
  rules={[{ required: true }]}
>
  <Select disabled>
    <Select.Option value={loggedInUser.id}>
      {loggedInUser.name}
    </Select.Option>
  </Select>
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
        {viewRow && (
          <>
            <p><strong>Quotation No:</strong> {viewRow.quotation_no}</p>
            <p><strong>Customer:</strong> {viewRow.customer_name}</p>
            <p><strong>Date:</strong> {viewRow.quotation_date}</p>
            <p><strong>Amount:</strong> {viewRow.net_amount}</p>
            <p><strong>Approved By:</strong> {viewRow.approved_by}</p>
            <p><strong>Approved Date:</strong> {viewRow.approved_date}</p>
            <p><strong>Dispatched:</strong> {viewRow.is_dispatched ? "Yes" : "No"}</p>
            <p><strong>Dispatched Date:</strong> {viewRow.dispatched_date}</p>
            <p><strong>Through:</strong> {viewRow.dispatched_through}</p>
            <p><strong>Deal Status:</strong> {viewRow.deal_status}</p>
            <p><strong>Followup:</strong> {viewRow.followup_date}</p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default QuotationFollowupReminder;
