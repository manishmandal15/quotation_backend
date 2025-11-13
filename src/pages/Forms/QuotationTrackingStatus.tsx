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
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Create reusable API instances
const API = axios.create({
  baseURL: `${BASE_URL}/quotation-tracking`,
});

const Api = axios.create({
  baseURL: BASE_URL,
});

// 🔹 Types
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
};

type User = {
  id: number;
  name: string;
};

// 🔹 Logged-in user placeholder
const loggedInUser = "CurrentUser";

// 🔹 Field keys
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

const QuotationTrackingStatus: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [dispatchForm] = Form.useForm();
  const [currentDispatchRow, setCurrentDispatchRow] =
    useState<Quotation | null>(null);

  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [followupForm] = Form.useForm();
  const [currentFollowupRow, setCurrentFollowupRow] =
    useState<Quotation | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<Quotation | null>(null);

  // 🔹 Fetch quotations + tracking
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
      }));

      setQuotations(merged);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch quotations");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users`);
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

  // 🔹 Open modals
  const openDispatchModal = (row: Quotation) => {
    setCurrentDispatchRow(row);
    setIsDispatchOpen(true);
    dispatchForm.resetFields();

    setTimeout(() => {
      dispatchForm.setFieldsValue({
        [DispatchFormFields.DISPATCHED_BY]: loggedInUser,
        [DispatchFormFields.DISPATCH_THROUGH]: "Email",
      });
    }, 0);
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

  // 🔹 Save Dispatch
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
        sent_at:
          dispatchedDate ||
          new Date().toISOString().slice(0, 19).replace("T", " "),
        sent_to_email: "customer@example.com",
      };

      await Api.post("/quotation-dispatches", payload);

      message.success("Dispatched successfully ✅");
      setIsDispatchOpen(false);
      fetchQuotations();
    } catch (err) {
      console.error("❌ Dispatch Error:", err);
      message.error("Error while dispatching");
    }
  };

  // 🔹 Save Followup
  const handleFollowupSave = async (values: any) => {
    if (!currentFollowupRow) return;

    try {
      const nextFollowupDate =
        values.next_followup_date?.format?.("YYYY-MM-DD HH:mm:ss") ||
        values.next_followup_date ||
        null;

      const actualFollowupDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

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
      message.success("Follow-up saved successfully ✅");
      setIsFollowupOpen(false);
      fetchQuotations();
    } catch (err) {
      console.error("❌ Follow-Up Save Error:", err);
      message.error("Error saving follow-up");
    }
  };

  // 🔹 Columns
  const columns: ColumnsType<Quotation> = [
    {
      title: "S.No",
      render: (_: any, __: any, i: number) => i + 1,
      width: 60,
    },
    { title: "Quotation No", dataIndex: "quotation_no", key: "quotation_no" },
    { title: "Customer", dataIndex: "customer_name", key: "customer_name" },
    { title: "Quotation Date", dataIndex: "quotation_date", key: "quotation_date" },
    { title: "Net Amount", dataIndex: "net_amount", key: "net_amount" },
    { title: "Approved By", dataIndex: "approved_by", key: "approved_by" },
    { title: "Approved Date", dataIndex: "approved_date", key: "approved_date" },
    { title: "Dispatched", dataIndex: "is_dispatched", key: "is_dispatched" },
    { title: "Dispatched Date", dataIndex: "dispatched_date", key: "dispatched_date" },
    { title: "Dispatched Through", dataIndex: "dispatched_through", key: "dispatched_through" },
    { title: "Deal Status", dataIndex: "deal_status", key: "deal_status" },
    { title: "Followup Date", dataIndex: "followup_date", key: "followup_date" },
    { title: "Next Followup", dataIndex: "nextfollowup_date", key: "nextfollowup_date" },
  ];

  // 🔹 Search
  const filteredData = quotations.filter(
    (q) =>
      q.quotation_no?.toLowerCase().includes(searchText.toLowerCase()) ||
      q.customer_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      q.deal_status?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-2xl font-semibold">Quotation Status Tracking</h2>
        <Input
          placeholder="Search quotation..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "100%", maxWidth: 400 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(r) => r.id ?? r.quotation_id ?? 0}
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default QuotationTrackingStatus;
