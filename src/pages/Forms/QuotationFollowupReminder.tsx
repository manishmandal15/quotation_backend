// src/quotation-module/QuotationFollowupReminder.tsx

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
  Space,
  Tooltip,
} from "antd";
import {
  SendOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

// ✅ Use .env base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Centralized axios instances
const quotationAPI = axios.create({
  baseURL: `${BASE_URL}/quotations`,
});

const trackingAPI = axios.create({
  baseURL: `${BASE_URL}/quotation-tracking`,
});

const commonAPI = axios.create({
  baseURL: BASE_URL,
});

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

  dispatched_by?: number;          // ← add this
   has_followup?: boolean;
   is_deal_finalised?: string | null;

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

const QuotationFollowupReminder: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [dispatchForm] = Form.useForm();
  const [currentDispatchRow, setCurrentDispatchRow] = useState<Quotation | null>(null);

  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [followupForm] = Form.useForm();
  const [currentFollowupRow, setCurrentFollowupRow] = useState<Quotation | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<Quotation | null>(null);

  // ✅ Fetch Quotations
  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const [quotRes, trackRes] = await Promise.all([
        quotationAPI.get("/"),
        trackingAPI.get("/"),
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
      }));

      setQuotations(merged);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch quotations");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await commonAPI.get("/users");
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

  // ✅ Dispatch Save
  const handleDispatchSave = async (values: any) => {
    if (!currentDispatchRow) return;
    try {
      const dispatchedDate =
        values[DispatchFormFields.DISPATCH_DATE]?.format?.("YYYY-MM-DD HH:mm:ss") ||
        values[DispatchFormFields.DISPATCH_DATE];

      const payload = {
        quotation_id: currentDispatchRow.id,
        sent_by: Number(values[DispatchFormFields.DISPATCHED_BY]),
        method: String(values[DispatchFormFields.DISPATCH_THROUGH]).toLowerCase(),
        sent_at: dispatchedDate || new Date().toISOString().slice(0, 19).replace("T", " "),
        sent_to_email: currentDispatchRow.customer_email ?? "customer@example.com",
      };

      await commonAPI.post("/quotation-dispatches", payload);
      message.success("Dispatched successfully ✅");
      setIsDispatchOpen(false);
      fetchQuotations();
    } catch (err: any) {
      console.error(err);
      message.error("Error while dispatching");
    }
  };

  // ✅ Followup Save
  const handleFollowupSave = async (values: any) => {
    if (!currentFollowupRow) return;
    try {
      const nextFollowupDate =
        values.next_followup_date?.format?.("YYYY-MM-DD HH:mm:ss") ||
        values.next_followup_date ||
        null;

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

      await commonAPI.post("/quotation_followups", payload);
      message.success("Follow-up saved successfully ✅");
      setIsFollowupOpen(false);
      fetchQuotations();
    } catch (err: any) {
      console.error(err);
      message.error("Error saving follow-up");
    }
  };

  // ✅ Dispatch + Followup + View modals
  const openDispatchModal = (row: Quotation) => {
    setCurrentDispatchRow(row);
    setIsDispatchOpen(true);
    dispatchForm.resetFields();
  };

  const openFollowupModal = (row: Quotation) => {
    setCurrentFollowupRow(row);
    setIsFollowupOpen(true);
    followupForm.resetFields();
  };

  const openViewModal = (row: Quotation) => {
    setViewRow(row);
    setIsViewOpen(true);
  };

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
    // { title: "Approved By", dataIndex: "approved_by", key: "approved_by" },
    // { title: "Approved Date", dataIndex: "approved_date", key: "approved_date" },
     {
      title: "Dispatched",
      dataIndex: "is_dispatched",
      key: "is_dispatched",
      //  render: (v: boolean) => (v ? "Yes" : "No"),
    },
    { title: "Dispatched Date", dataIndex: "dispatched_date", key: "dispatched_date" },
    { title: "Dispatched Through", dataIndex: "dispatched_through", key: "dispatched_through" },
    // { title: "Deal Status", dataIndex: "deal_status", key: "deal_status" },
    {
  title: "Deal Finalised",
  dataIndex: "is_deal_finalised",
  key: "is_deal_finalised",
  render: (v: any) => (v === "Yes" ? " Yes" : " No"),   // ✅ 
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



          <Tooltip title="Follow-Up">
            <Button
              type="default"
              icon={<ClockCircleOutlined />}
              onClick={() => openFollowupModal(record)}
              style={{ borderRadius: 4 }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Quotation Followup & Reminders</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={fetchQuotations}
        >
          Refresh
        </Button>
      </div>

      {/* <Table
        columns={columns}
        dataSource={quotations}
        rowKey={(r) => r.id ?? r.quotation_id ?? 0}
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1200 }}
      /> */}


      <Table
  columns={columns}
  dataSource={quotations}
  rowKey={(r) => r.id ?? r.quotation_id ?? 0}
  loading={loading}
  bordered
  pagination={{ pageSize: 8 }}
  scroll={{ x: 1200 }}
  onRow={(record) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Parse nextfollowup_date safely (supports both dd-mm-yyyy and yyyy-mm-dd)
    const nextDate = record.nextfollowup_date
      ? (() => {
          const val = record.nextfollowup_date;
          if (typeof val === "string" && val.includes("-")) {
            const parts = val.split("-");
            if (parts.length === 3) {
              const [year, month, day] =
                parts[0].length === 4 ? parts : [parts[2], parts[1], parts[0]];
              return new Date(`${year}-${month}-${day}`);
            }
          }
          return new Date(val);
        })()
      : null;

    let style: React.CSSProperties = {};

    // ✅ Deal finalised → 🟢 Green row
    if (record.is_deal_finalised === "Yes") {
      style = {
        backgroundColor: "#ccffcc", // light green
        color: "#000",
        fontWeight: 500,
        transition: "background-color 0.3s ease",
      };
    }

    // ❌ Not finalised but date passed or today → 🔴 Red row
    else if (record.is_deal_finalised === "No" && nextDate) {
      if (nextDate.getTime() <= today.getTime()) {
        style = {
          backgroundColor: "#ffcccc", // light red
          color: "#000",
          fontWeight: 500,
          transition: "background-color 0.3s ease",
        };
      }
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
             title={`Follow-Up - Quotation ${currentFollowupRow?.quotation_no ?? ""}`}
             open={isFollowupOpen}
             onCancel={() => setIsFollowupOpen(false)}
             footer={null}
             destroyOnClose
           >
             <Form layout="vertical" form={followupForm} onFinish={handleFollowupSave}>
               <Form.Item label="Is Deal Finalised?" name="is_deal_finalised" rules={[{ required: true }]}>
                 <Select>
                   <Select.Option value="Yes">Yes</Select.Option>
                   <Select.Option value="No">No</Select.Option>
                 </Select>
               </Form.Item>
     
               <Form.Item label="Invoice No" name="invoice_no">
                 <Input />
               </Form.Item>
     
               <Form.Item label="Customer Wants Time?" name="customer_wants_time" rules={[{ required: true }]}>
                 <Select>
                   <Select.Option value="Yes">Yes</Select.Option>
                   <Select.Option value="No">No</Select.Option>
                   <Select.Option value="Not Interested">Not Interested</Select.Option>
                 </Select>
               </Form.Item>
     
               <Form.Item label="Next Follow-Up Date" name="next_followup_date">
                 <DatePicker showTime style={{ width: "100%" }} />
               </Form.Item>
     
               <Form.Item label="User" name="user_id" rules={[{ required: true }]}>
                 <Select
                   placeholder="Select User"
                   options={users.map((u) => ({ label: u.name, value: u.id }))}
                 />
               </Form.Item>
     
               <div style={{ textAlign: "right" }}>
                 <Button onClick={() => setIsFollowupOpen(false)} style={{ marginRight: 8 }}>
                   Cancel
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
        footer={[<Button key="close" onClick={() => setIsViewOpen(false)}>Close</Button>]}
        destroyOnClose
      >
        {viewRow && (
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
        )}
      </Modal>
    </div>
  );
};

export default QuotationFollowupReminder;
