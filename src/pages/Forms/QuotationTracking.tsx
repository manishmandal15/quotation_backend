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

// ✅ Get base URL from .env (Vite)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// ✅ Centralized API instances
const API = axios.create({
  baseURL: `${BASE_URL}/quotation-tracking`,
});

const Api = axios.create({
  baseURL: BASE_URL,
});

type Quotation = {
  id: number;
  quotation_id: number;
  quotation_no: string;
  customer_name: string;
  quotation_date?: string;
  net_amount?: number | string;
  approved_by?: string;
  approved_date?: string;
  is_dispatched?: boolean | string;
  dispatched_date?: string | null;
  dispatched_through?: string | null;
  deal_status?: string | null;
  followup_date?: string | null;
  follow_up_date?: string | null;
  nextfollowup_date?: string | null;
  dispatched_by?: number | null;
  has_followup?: boolean;
  is_deal_finalised?: string | null;
  customer_email?: string | null;
};

type User = {
  id: number;
  name: string;
};

// const loggedInUser = "CurrentUser";
const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");


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

  // Search state (missing earlier) ✅
  const [searchText, setSearchText] = useState("");

  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [dispatchForm] = Form.useForm();
  const [currentDispatchRow, setCurrentDispatchRow] = useState<Quotation | null>(null);

  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [followupForm] = Form.useForm();
  const [currentFollowupRow, setCurrentFollowupRow] = useState<Quotation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);


  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<Quotation | null>(null);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const [quotRes, trackRes] = await Promise.all([
        axios.get(`${BASE_URL}/quotations`),
        axios.get(`${BASE_URL}/quotation-tracking`),
        
      ]);

      const quotationsFromMaster = (quotRes.data || []).map((q: any) => ({
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
        customer_email: t.customer_email ?? null,
      }));

      // Optionally merge master and tracking by quotation_no if needed (kept minimal)
      setQuotations(merged);
      setCurrentPage(1);
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

    // set sensible defaults: if users present set first user's id else fallback to loggedInUser
    // setTimeout(() => {
    //   dispatchForm.setFieldsValue({
    //     [DispatchFormFields.DISPATCHED_BY]: users?.[0]?.id ?? loggedInUser,
    //     [DispatchFormFields.DISPATCH_THROUGH]: "Email",
    //   });
    // }, 0);

    setTimeout(() => {
  dispatchForm.setFieldsValue({
    [DispatchFormFields.DISPATCHED_BY]: loggedInUser.id,
    [DispatchFormFields.DISPATCH_THROUGH]: "email",
  });
}, 0);

  };

  const handleDispatchSave = async (values: any) => {
  if (!currentDispatchRow) return;

  if (!loggedInUser?.id) {
    message.error("User not logged in");
    return;
  }

  const method = String(
    values[DispatchFormFields.DISPATCH_THROUGH]
  ).toLowerCase();

  const payload: any = {
    quotation_id: currentDispatchRow.id,
    sent_by: loggedInUser.id,
    method,
  };

  if (method === "email") {
    if (!currentDispatchRow.customer_email) {
      message.error("Customer email not available");
      return;
    }
    payload.sent_to_email = currentDispatchRow.customer_email;
  }

  console.log("DISPATCH PAYLOAD 👉", payload);

  try {
    await Api.post("/quotation-dispatches", payload);
    message.success("Dispatched successfully ✅");
    setIsDispatchOpen(false);
    fetchQuotations();
  } catch (err: any) {
    console.error(err);
    message.error(err?.response?.data?.message || "Dispatch failed ❌");
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

  setTimeout(() => {
    followupForm.setFieldsValue({
      user_id: loggedInUser.id,
    });
  }, 0);
};


  const handleFollowupSave = async (values: any) => {
    if (!currentFollowupRow) return;
    try {
      const nextFollowupDate =
        values.next_followup_date?.format?.("YYYY-MM-DD HH:mm:ss") ??
        values.next_followup_date ??
        null;

      const actualFollowupDate = new Date().toISOString().slice(0, 19).replace("T", " ");
      const payload = {
        quotation_id: currentFollowupRow.quotation_id ?? currentFollowupRow.id,
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
      message.success("Follow-up saved successfully ✅");
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
  title: "S.No",
  key: "sno",
  width: 60,
  render: (_text, _record, index) =>
    (currentPage - 1) * pageSize + index + 1,
},

    { title: "Quotation No", dataIndex: "quotation_no", key: "quotation_no" },
    { title: "Customer", dataIndex: "customer_name", key: "customer_name" },
    { title: "Quotation Date", dataIndex: "quotation_date", key: "quotation_date" },
    { title: "Net Amount", dataIndex: "net_amount", key: "net_amount" },
    {
      title: "Dispatched",
      dataIndex: "is_dispatched",
      key: "is_dispatched",
      render: (v: any) => {
        // handle boolean/string
        if (v === true || v === "Yes" || v === "yes") return "Yes";
        if (v === false || v === "No" || v === "no") return "No";
        return String(v ?? "-");
      },
    },
    { title: "Dispatched Date", dataIndex: "dispatched_date", key: "dispatched_date" },
    { title: "Through", dataIndex: "dispatched_through", key: "dispatched_through" },
    {
      title: "Deal Finalised",
      dataIndex: "is_deal_finalised",
      key: "is_deal_finalised",
      render: (v: any) => (v === "Yes" ? "Yes" : "No"),
    },

    { title: "Follow Up Date", dataIndex: "followup_date", key: "followup_date" },
    {
      title: "Next Followup",
      dataIndex: "nextfollowup_date",
      key: "nextfollowup_date",
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        const parseDate = (d: any): number => {
          if (!d || d === "-" || typeof d !== "string") return 0;
          const parts = d.split("-");
          if (parts.length === 3) {
            const [day, month, year] = parts;
            const dt = new Date(`${year}-${month}-${day}`).getTime();
            return Number.isNaN(dt) ? 0 : dt;
          }
          const dt = new Date(d).getTime();
          return Number.isNaN(dt) ? 0 : dt;
        };
        return parseDate(a.nextfollowup_date) - parseDate(b.nextfollowup_date);
      },
      onCell: (record: Quotation) => {
        // compute nextDate safely
        let style: React.CSSProperties = {};
        const nf = record.nextfollowup_date;
        const parse = (d?: string | null) => {
          if (!d || d === "-" || typeof d !== "string") return null;
          const parts = d.split("-");
          if (parts.length === 3) {
            const [day, month, year] = parts;
            const dt = new Date(`${year}-${month}-${day}`);
            return isNaN(dt.getTime()) ? null : dt;
          }
          const dt = new Date(d);
          return isNaN(dt.getTime()) ? null : dt;
        };
        const nextDate = parse(nf);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (record.is_deal_finalised === "Yes") {
          style = { backgroundColor: "#ccffcc", color: "#000", transition: "background-color 0.3s ease" };
        } else if (record.is_deal_finalised === "No" && nextDate) {
          if (nextDate.getTime() <= today.getTime()) {
            style = { backgroundColor: "#ffcccc", color: "#000", transition: "background-color 0.3s ease" };
          }
        }

        return { style };
      },
    },

    {
      title: "Action",
      key: "actions",
      fixed: "right",
      width: 240,
      render: (_text, record) => {
        const link = `${window.location.origin}/printpage?id=${record.id}&autoPrint=true`;

        return (
          <Space>
            {/* View */}
            <Tooltip title="View">
              <Button icon={<EyeOutlined />} onClick={() => window.open(link,"_blank")} />
              
            </Tooltip>

            {/* Dispatch */}
            <Tooltip title="Dispatch">
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => openDispatchModal(record)}
                disabled={!record.approved_by || record.approved_by === "-"}
              />
            </Tooltip>

            {/* Follow-Up */}
            <Tooltip
              title={
                record.is_dispatched && record.is_dispatched !== "No"
                  ? "Add Follow-Up"
                  : "Follow-Up disabled until dispatched"
              }
            >
              <Button
                icon={<ClockCircleOutlined />}
                onClick={() => openFollowupModal(record)}
                disabled={
                  !record.is_dispatched ||
                  record.is_dispatched === "No" ||
                  record.is_dispatched === "-"
                }
              />
            </Tooltip>

            {/* WhatsApp */}
            <Tooltip title="Share via WhatsApp">
              <Button
                shape="circle"
                icon={<img src="https://img.icons8.com/color/20/whatsapp.png" />}
                style={{ background: "#25D366", border: "none" }}
                onClick={() => {
                  const waMsg =
                    `*Quotation Details*%0A%0A` +
                    `Quotation No: ${record.quotation_no}%0A` +
                    `Customer: ${record.customer_name}%0A` +
                    `Amount: ₹${record.net_amount}%0A%0A` +
                    `Quotation Link:%0A${link}`;
                  const waURL = `https://wa.me/?text=${encodeURIComponent(waMsg)}`;
                  window.open(waURL, "_blank");
                }}
              />
            </Tooltip>

            {/* Email */}
            <Tooltip title="Share via Email">
              <Button
                shape="circle"
                icon={<img src="https://img.icons8.com/fluency/20/mail.png" />}
                style={{ background: "#1677ff", border: "none" }}
                onClick={() => {
                  const subject = `Quotation - ${record.quotation_no}`;
                  const body =
                    `Dear ${record.customer_name},\n\n` +
                    `Please find your quotation details below:\n\n` +
                    `Quotation Number: ${record.quotation_no}\n` +
                    `Net Amount: ₹${record.net_amount}\n\n` +
                    `Click the link below to view your quotation:\n${link}\n\n` +
                    `Regards,\nDsonik Group`;

                  const mailURL = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  window.location.href = mailURL;
                }}
              />
            </Tooltip>

            {/* Copy */}
            <Tooltip title="Copy details">
              <Button
                shape="circle"
                icon={<img src="https://img.icons8.com/ios-glyphs/20/copy.png" />}
                onClick={async () => {
                  const copyText =
                    `Quotation No: ${record.quotation_no}\n` +
                    `Customer: ${record.customer_name}\n` +
                    `Amount: ₹${record.net_amount}\n` +
                    `Link: ${link}`;
                  try {
                    await navigator.clipboard.writeText(copyText);
                    message.success("Quotation details copied!");
                  } catch (e) {
                    console.error(e);
                    message.error("Copy failed");
                  }
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  

  // Filtered data from search box
  const filteredData = quotations.filter((q) =>
    (q.quotation_no ?? "").toString().toLowerCase().includes(searchText.toLowerCase()) ||
    (q.customer_name ?? "").toString().toLowerCase().includes(searchText.toLowerCase()) ||
    (q.deal_status ?? "").toString().toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        
        {/* Title */}
        <h2 className="text-2xl font-semibold">
          Quotation Dispatch & Follow-Up
        </h2>
    
        {/* Right Side: Search + Refresh */}
        <div className="flex items-center gap-3">
    
          {/* SEARCH INPUT */}
          <Input
            placeholder="Search quotation..."
            value={searchText}
            onChange={(e) => {
  setSearchText(e.target.value);
  setCurrentPage(1);
}}

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
      {/* <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
        onRow={(record) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // ✅ Parse nextfollowup_date safely
          const nextDate = record.nextfollowup_date
            ? (() => {
                const parts = (record.nextfollowup_date || "").split("-");
                if (parts.length === 3) {
                  const [day, month, year] = parts;
                  const dt = new Date(`${year}-${month}-${day}`);
                  return isNaN(dt.getTime()) ? null : dt;
                }
                const dt = new Date(record.nextfollowup_date || "");
                return isNaN(dt.getTime()) ? null : dt;
              })()
            : null;

          let style: React.CSSProperties = {};

          if (record.is_deal_finalised === "Yes") {
            style = {
              backgroundColor: "#ccffcc",
              color: "#000",
              transition: "background-color 0.3s ease",
            };
          } else if (record.is_deal_finalised === "No" && nextDate) {
            if (nextDate.getTime() <= today.getTime()) {
              style = {
                backgroundColor: "#ffcccc",
                color: "#000",
                transition: "background-color 0.3s ease",
              };
            }
          }

          return { style };
        }}
      /> */}

      <Table
  columns={columns}
  dataSource={filteredData}
  rowKey="id"
  loading={loading}
  pagination={{
    current: currentPage,
    pageSize: pageSize,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50"],
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size || 10);
    },
  }}
  onRow={(record) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextDate = record.nextfollowup_date
      ? (() => {
          const parts = record.nextfollowup_date.split("-");
          if (parts.length === 3) {
            const [day, month, year] = parts;
            const dt = new Date(`${year}-${month}-${day}`);
            return isNaN(dt.getTime()) ? null : dt;
          }
          const dt = new Date(record.nextfollowup_date);
          return isNaN(dt.getTime()) ? null : dt;
        })()
      : null;

    let style: React.CSSProperties = {};

    if (record.is_deal_finalised === "Yes") {
      style = { backgroundColor: "#ccffcc", color: "#000" };
    } else if (record.is_deal_finalised === "No" && nextDate) {
      if (nextDate.getTime() <= today.getTime()) {
        style = { backgroundColor: "#ffcccc", color: "#000" };
      }
    }

    return { style };
  }}
/>


      {/* Dispatch Modal */}
      <Modal
  title={`Dispatch Quotation No. ${currentDispatchRow?.quotation_no ?? ""}`}
  open={isDispatchOpen}
  onCancel={() => setIsDispatchOpen(false)}
  footer={null}
  destroyOnClose
>
  <Form
    layout="vertical"
    form={dispatchForm}
    onFinish={handleDispatchSave}
  >
    <Form.Item
      label="Dispatch Through"
      name={DispatchFormFields.DISPATCH_THROUGH}
      rules={[{ required: true }]}
    >
      <Select>
       <Select.Option value="email">Email</Select.Option>
<Select.Option value="sms">SMS</Select.Option>
<Select.Option value="post">Post</Select.Option>
<Select.Option value="manual">Manual</Select.Option>

      </Select>
    </Form.Item>

    <Form.Item
      label="Dispatch Date"
      name={DispatchFormFields.DISPATCH_DATE}
      rules={[{ required: true }]}
    >
      <DatePicker showTime style={{ width: "100%" }} />
    </Form.Item>

    {/* 🔒 LOCKED LOGGED-IN USER */}
    <Form.Item
      label="Dispatched By"
      name={DispatchFormFields.DISPATCHED_BY}
      rules={[{ required: true }]}
    >
      <Select disabled>
        <Select.Option value={loggedInUser.id}>
          {loggedInUser.name}
        </Select.Option>
      </Select>
    </Form.Item>

    <div style={{ textAlign: "right" }}>
      <Button
        onClick={() => setIsDispatchOpen(false)}
        style={{ marginRight: 8 }}
      >
        Cancel
      </Button>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </div>
  </Form>
</Modal>


    

      {/* Follow-Up Modal */}
      <Modal
        title={`Follow-Up - Quotation ${currentFollowupRow?.quotation_no ?? ""}`}
        open={isFollowupOpen}
        onCancel={() => setIsFollowupOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={followupForm} onFinish={handleFollowupSave}>
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
            <Input />
          </Form.Item>

          <Form.Item
            label="Customer Wants Time?"
            name="customer_wants_time"
            rules={[{ required: true }]}
          >
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
  <Select placeholder="Select User">
    {users.map((u) => (
      <Select.Option
        key={u.id}
        value={u.id}
        disabled={u.id === loggedInUser.id}
      >
        {u.name}
      </Select.Option>
    ))}
  </Select>
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
  title={`Follow-Up - Quotation ${currentFollowupRow?.quotation_no ?? ""}`}
  open={isFollowupOpen}
  onCancel={() => setIsFollowupOpen(false)}
  footer={null}
  destroyOnClose
>
  <Form
    layout="vertical"
    form={followupForm}
    onFinish={handleFollowupSave}
  >
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
      <Input />
    </Form.Item>

    <Form.Item
      label="Customer Wants Time?"
      name="customer_wants_time"
      rules={[{ required: true }]}
    >
      <Select>
        <Select.Option value="Yes">Yes</Select.Option>
        <Select.Option value="No">No</Select.Option>
        <Select.Option value="Not Interested">Not Interested</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item label="Next Follow-Up Date" name="next_followup_date">
      <DatePicker showTime style={{ width: "100%" }} />
    </Form.Item>

    {/* 🔒 LOCKED LOGGED-IN USER */}
    <Form.Item
      label="Follow-Up By"
      name="user_id"
      rules={[{ required: true }]}
    >
      <Select disabled>
        <Select.Option value={loggedInUser.id}>
          {loggedInUser.name}
        </Select.Option>
      </Select>
    </Form.Item>

    <div style={{ textAlign: "right" }}>
      <Button
        onClick={() => setIsFollowupOpen(false)}
        style={{ marginRight: 8 }}
      >
        Cancel
      </Button>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </div>
  </Form>
</Modal>

    </div>
  );
};

export default QuotationTracking;
