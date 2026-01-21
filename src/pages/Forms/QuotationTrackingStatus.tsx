// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   Space,
//   Tooltip,
// } from "antd";
// import {
//   SendOutlined,
//   ClockCircleOutlined,
//   EyeOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import type { ColumnsType } from "antd/es/table";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // ✅ Create reusable API instances
// const API = axios.create({
//   baseURL: `${BASE_URL}/quotation-tracking`,
// });

// const Api = axios.create({
//   baseURL: BASE_URL,
// });

// // 🔹 Types
// type Quotation = {
//   id: number;
//   quotation_id: number;
//   quotation_no: string;
//   customer_name: string;
//   quotation_date?: string;
//   net_amount?: number;
//   approved_by?: string;
//   approved_date?: string;
//   is_dispatched?: boolean;
//   dispatched_date?: string | null;
//   dispatched_through?: string | null;
//   deal_status?: string | null;
//   followup_date?: string | null;
// follow_up_date?: string | null;
// nextfollowup_date?: string | null;

//   dispatched_by?: number;          // ← add this
//    has_followup?: boolean;
//    is_deal_finalised?: string | null;

// };

// type User = {
//   id: number;
//   name: string;
// };

// // 🔹 Logged-in user placeholder
// const loggedInUser = "CurrentUser";

// // 🔹 Field keys
// const DispatchFormFields = {
//   DISPATCH_THROUGH: "dispatched_through",
//   DISPATCH_DATE: "dispatched_date",
//   DISPATCHED_BY: "dispatched_by",
// };

// const FollowupFormFields = {
//   PLANNED_FOLLOWUP_DATE: "planned_followup_date",
//   ACTUAL_FOLLOWUP_DATE: "actual_followup_date",
//   IS_DEAL_FINALISED: "is_deal_finalised",
//   INVOICE_NO: "invoice_no",
//   CUSTOMER_WANTS_TIME: "customer_wants_time",
//   NEXT_FOLLOWUP_DATE: "next_followup_date",
//   FOLLOWUP_BY: "followup_by",
// };

// const QuotationTrackingStatus: React.FC = () => {
//   const [quotations, setQuotations] = useState<Quotation[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");

//   // Modal states
//   const [isDispatchOpen, setIsDispatchOpen] = useState(false);
//   const [dispatchForm] = Form.useForm();
//   const [currentDispatchRow, setCurrentDispatchRow] =
//     useState<Quotation | null>(null);

//   const [isFollowupOpen, setIsFollowupOpen] = useState(false);
//   const [followupForm] = Form.useForm();
//   const [currentFollowupRow, setCurrentFollowupRow] =
//     useState<Quotation | null>(null);

//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [viewRow, setViewRow] = useState<Quotation | null>(null);

//   // 🔹 Fetch quotations + tracking
//   const fetchQuotations = async () => {
//     setLoading(true);
//     try {
//       const [quotRes, trackRes] = await Promise.all([
//         axios.get(`${BASE_URL}/quotations`),
//         axios.get(`${BASE_URL}/quotation-tracking`),
//       ]);

//       const quotations = (quotRes.data || []).map((q: any) => ({
//         ...q,
//         id: q.id ?? q.quotation_id ?? q.sno,
//       }));

//       const tracking = trackRes.data || [];

//       const merged = tracking.map((t: any) => ({
//         id: t.id,
//         quotation_id: t.id,
//         quotation_no: t.quotation_no ?? "-",
//         quotation_date: t.quotation_date ?? "-",
//         is_dispatched: t.is_dispatched ?? "No",
//         dispatched_date: t.dispatched_date ?? "-",
//         dispatched_through: t.dispatched_through ?? "-",
//         approved_by: t.approved_by ?? "-",
//         approved_date: t.approved_date ?? "-",
//         deal_status: t.deal_status ?? "Pending",
//         followup_date: t.followup_date ?? t.follow_up_date ?? "-",
//         nextfollowup_date: t.nextfollowup_date ?? "-",
//         dispatched_by: t.dispatched_by ?? null,
//         has_followup: t.has_followup ?? false,
//         net_amount: t.net_amount ?? "0",
//         customer_name: t.customer_name ?? "-",
//       }));

//       setQuotations(merged);
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to fetch quotations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/users`);
//       setUsers(res.data || []);
//     } catch (err) {
//       console.error("❌ Error fetching users:", err);
//       message.error("Failed to load users");
//     }
//   };

//   useEffect(() => {
//     fetchQuotations();
//     fetchUsers();
//   }, []);

//   // 🔹 Open modals
//   const openDispatchModal = (row: Quotation) => {
//     setCurrentDispatchRow(row);
//     setIsDispatchOpen(true);
//     dispatchForm.resetFields();

//     setTimeout(() => {
//       dispatchForm.setFieldsValue({
//         [DispatchFormFields.DISPATCHED_BY]: loggedInUser,
//         [DispatchFormFields.DISPATCH_THROUGH]: "Email",
//       });
//     }, 0);
//   };

//   const openFollowupModal = (row: Quotation) => {
//     setCurrentFollowupRow(row);
//     setIsFollowupOpen(true);
//     followupForm.resetFields();
//   };

//   const openViewModal = (row: Quotation) => {
//     setViewRow(row);
//     setIsViewOpen(true);
//   };

//   // 🔹 Save Dispatch
//   const handleDispatchSave = async (values: any) => {
//     if (!currentDispatchRow) return;
//     try {
//       const dispatchedDate =
//         values[DispatchFormFields.DISPATCH_DATE]?.format?.("YYYY-MM-DD HH:mm:ss") ||
//         values[DispatchFormFields.DISPATCH_DATE];

//       const payload = {
//         quotation_id: currentDispatchRow.id,
//         sent_by: Number(values[DispatchFormFields.DISPATCHED_BY]),
//         method: String(values[DispatchFormFields.DISPATCH_THROUGH]).toLowerCase(),
//         sent_at:
//           dispatchedDate ||
//           new Date().toISOString().slice(0, 19).replace("T", " "),
//         sent_to_email: "customer@example.com",
//       };

//       await Api.post("/quotation-dispatches", payload);

//       message.success("Dispatched successfully ✅");
//       setIsDispatchOpen(false);
//       fetchQuotations();
//     } catch (err) {
//       console.error("❌ Dispatch Error:", err);
//       message.error("Error while dispatching");
//     }
//   };

//   // 🔹 Save Followup
//   const handleFollowupSave = async (values: any) => {
//     if (!currentFollowupRow) return;

//     try {
//       const nextFollowupDate =
//         values.next_followup_date?.format?.("YYYY-MM-DD HH:mm:ss") ||
//         values.next_followup_date ||
//         null;

//       const actualFollowupDate = new Date()
//         .toISOString()
//         .slice(0, 19)
//         .replace("T", " ");

//       const payload = {
//         quotation_id: currentFollowupRow.quotation_id,
//         user_id: values.user_id,
//         notes: values.notes || "",
//         followup_date: actualFollowupDate,
//         invoice_no: values.invoice_no || null,
//         is_deal_finalised: values.is_deal_finalised,
//         time_needed: values.customer_wants_time,
//         next_followup_date: nextFollowupDate,
//         followup_by: values.user_id,
//         actual_followup_date: actualFollowupDate,
//       };

//       await Api.post("/quotation_followups", payload);
//       message.success("Follow-up saved successfully ✅");
//       setIsFollowupOpen(false);
//       fetchQuotations();
//     } catch (err) {
//       console.error("❌ Follow-Up Save Error:", err);
//       message.error("Error saving follow-up");
//     }
//   };

//   // 🔹 Columns
//   const columns: ColumnsType<Quotation> = [
//     {
//       title: "S.No",
//       render: (_: any, __: any, i: number) => i + 1,
//       width: 60,
//     },
//     { title: "Quotation No", dataIndex: "quotation_no", key: "quotation_no" },
//     { title: "Customer", dataIndex: "customer_name", key: "customer_name" },
//     { title: "Quotation Date", dataIndex: "quotation_date", key: "quotation_date" },
//     { title: "Net Amount", dataIndex: "net_amount", key: "net_amount" },
//     { title: "Approved By", dataIndex: "approved_by", key: "approved_by" },
//     { title: "Approved Date", dataIndex: "approved_date", key: "approved_date" },
//     { title: "Dispatched", dataIndex: "is_dispatched", key: "is_dispatched" },
//     { title: "Dispatched Date", dataIndex: "dispatched_date", key: "dispatched_date" },
//     { title: "Dispatched Through", dataIndex: "dispatched_through", key: "dispatched_through" },
//     // { title: "Deal Status", dataIndex: "deal_status", key: "deal_status" },
//     {
//   title: "Deal Finalised",
//   dataIndex: "is_deal_finalised",
//   key: "is_deal_finalised",
//   render: (v: any) => (v === "Yes" ? " Yes" : " No"),   // ✅ 
// },
//     { title: "Follow Up Date", dataIndex: "followup_date", key: "followup_date" },
//      { title: "Next Followup", dataIndex: "nextfollowup_date", key: "nextfollowup_date" },
// //     {
// //       title: "Action",
// //       key: "actions",
// //       fixed: "right",
// //       width: 150,
// //       render: (_text, record) => (
// //         <Space>
// //              <Tooltip title="view">
// //           <Button
// //             type="default"
// //             icon={<EyeOutlined />}
// //             onClick={() => openViewModal(record)}
// //             style={{ borderRadius: 4 }}
// //           >
            
// //           </Button>
// //           </Tooltip>

// //           {/* Send (Dispatch) - always visible when not dispatched */}
// //            {/* ✅ Dispatch button visible only if approved_by is set */}
// //       {record.approved_by && record.approved_by !== "-" ? (
// //         <Tooltip title="Send / Dispatch">
// //           <Button
// //             type="primary"
// //             icon={<SendOutlined />}
// //             onClick={() => openDispatchModal(record)}
// //             style={{ borderRadius: 4 }}
// //           />
// //         </Tooltip>
// //       ) : (
// //         <Tooltip title="Approve quotation before dispatch">
// //           <Button
// //             type="primary"
// //             icon={<SendOutlined />}
// //             disabled
// //             style={{ borderRadius: 4, opacity: 0.5 }}
// //           />
// //         </Tooltip>
// //       )}

// //           {/* Followup - enable if dispatched = true, otherwise disabled */}
// //           {/* <Tooltip title="Follow-up">
// //                <Button
// //                 type="default"
// //                 icon={<ClockCircleOutlined />}
// //                 onClick={() => openFollowupModal(record)}
// //                  disabled={!record.is_dispatched}
// //                   style={{ borderRadius: 4 }}
// //                  />
// //            </Tooltip> */}


// //           <Tooltip
// //   title={
// //     !record.approved_by || record.approved_by === "-"
// //       ? "Approve the quotation first"
// //       : !record.is_dispatched
// //       ? "Dispatch before follow-up"
// //       : record.has_followup
// //       ? "Follow-up already done"
// //       : "Add Follow-up"
// //   }
// // >
// //   <Button
// //     type="default"
// //     icon={<ClockCircleOutlined />}
// //     onClick={() => openFollowupModal(record)}
// //    disabled={
// //   !record.followup_date || 
// //   record.followup_date === "-" ||
// //   record.followup_date.trim() === ""
// // }
// //     style={{
// //       borderRadius: 4,
// //       opacity:
// //         !record.approved_by || record.approved_by === "-" || !record.is_dispatched
// //           ? 0.5
// //           : 1,
// //     }}
// //   />
// // </Tooltip>
  
// //         </Space>
// //       ),
// //     },
//   ];

//   // 🔹 Search
//   const filteredData = quotations.filter(
//     (q) =>
//       q.quotation_no?.toLowerCase().includes(searchText.toLowerCase()) ||
//       q.customer_name?.toLowerCase().includes(searchText.toLowerCase()) ||
//       q.deal_status?.toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
//         <h2 className="text-2xl font-semibold">Quotation Status Tracking</h2>
//         <Input
//           placeholder="Search quotation..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{ width: "100%", maxWidth: 400 }}
//           allowClear
//         />
//       </div>

//       {/* <Table
//         columns={columns}
//         dataSource={filteredData}
//         rowKey={(r) => r.id ?? r.quotation_id ?? 0}
//         loading={loading}
//         bordered
//         pagination={{ pageSize: 8 }}
//         scroll={{ x: 1200 }}
//       /> */}


//      <Table
//   columns={columns}
//   dataSource={quotations}
//   rowKey={(r) => r.id ?? r.quotation_id ?? 0}
//   loading={loading}
//   bordered
//   pagination={{ pageSize: 8 }}
//   scroll={{ x: 1200 }}
//   onRow={(record) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // ✅ Parse nextfollowup_date safely (support dd-mm-yyyy and yyyy-mm-dd)
//     const nextDate = record.nextfollowup_date
//       ? (() => {
//           const val = record.nextfollowup_date;
//           if (typeof val === "string" && val.includes("-")) {
//             const parts = val.split("-");
//             if (parts.length === 3) {
//               const [year, month, day] =
//                 parts[0].length === 4 ? parts : [parts[2], parts[1], parts[0]];
//               return new Date(`${year}-${month}-${day}`);
//             }
//           }
//           return new Date(val);
//         })()
//       : null;

//     let style: React.CSSProperties = {};

//     // 🟢 Deal Finalised
//     if (record.is_deal_finalised === "Yes") {
//       style = {
//         backgroundColor: "#ccffcc", // light green
//         color: "#000",
//         fontWeight: 500,
//         transition: "background-color 0.3s ease",
//       };
//     }

//     // 🔴 Not Finalised and next followup due or past
//     else if (record.is_deal_finalised === "No" && nextDate) {
//       if (nextDate.getTime() <= today.getTime()) {
//         style = {
//           backgroundColor: "#ffcccc", // light red
//           color: "#000",
//           fontWeight: 500,
//           transition: "background-color 0.3s ease",
//         };
//       }
//     }

//     return { style };
//   }}
// />



//       {/* Dispatch Modal */}
//       <Modal
//         title={`Dispatch Quotation ${currentDispatchRow?.quotation_no ?? ""}`}
//         open={isDispatchOpen}
//         onCancel={() => setIsDispatchOpen(false)}
//         footer={null}
//         destroyOnClose
//       >
//         <Form layout="vertical" form={dispatchForm} onFinish={handleDispatchSave}>
//           <Form.Item
//             label="Dispatch Through"
//             name={DispatchFormFields.DISPATCH_THROUGH}
//             rules={[{ required: true, message: "Select dispatch method" }]}
//           >
//             <Select>
//               <Select.Option value="Email">Email</Select.Option>
//               <Select.Option value="SMS">SMS</Select.Option>
//               <Select.Option value="Post">Post</Select.Option>
//               <Select.Option value="Manual">Manual</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Dispatch Date"
//             name={DispatchFormFields.DISPATCH_DATE}
//             rules={[{ required: true, message: "Select dispatch date" }]}
//           >
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>

//           {/* ✅ Changed from Input → Dropdown (Users) */}
//           {/* <Form.Item
//             label="Dispatched By"
//             name={DispatchFormFields.DISPATCHED_BY}
            
//             rules={[{ required: true, message: "Select dispatched by user" }]}
//           >
//             <Select placeholder="Select User">
//               {users.map((u) => (
//                 <Select.Option key={u.id} value={u.name}>
//                   {u.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item> */}


//           <Form.Item
//   label="Dispatched By"
//   name={DispatchFormFields.DISPATCHED_BY}
//   rules={[{ required: true, message: "Select dispatched by user" }]}
// >
//   <Select
//     placeholder="Select User"
//     showSearch
//     optionFilterProp="label"
//     options={users.map((u) => ({
//       label: u.name,
//       value: u.id, // ✅ send ID instead of name
//     }))}
//   />
// </Form.Item>


//           <div className="flex justify-end mt-4">
//             <Button onClick={() => setIsDispatchOpen(false)} style={{ marginRight: 8 }}>
//               Close
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </div>
//         </Form>
//       </Modal>

//       {/* Followup Modal */}
//       <Modal
//         title={`Followup - Quotation ${currentFollowupRow?.quotation_no ?? ""}`}
//         open={isFollowupOpen}
//         onCancel={() => setIsFollowupOpen(false)}
//         footer={null}
//         destroyOnClose
//       >
//         <Form layout="vertical" form={followupForm} onFinish={handleFollowupSave}>
//           <Form.Item label="Planned Follow Up Date" name={FollowupFormFields.PLANNED_FOLLOWUP_DATE}>
//             <Input disabled placeholder={currentFollowupRow?.follow_up_date ?? "N/A"} />
//           </Form.Item>

//           <Form.Item label="Actual Follow Up Date" name={FollowupFormFields.ACTUAL_FOLLOWUP_DATE}>
//             <Input disabled placeholder="(Auto-recorded if needed)" />
//           </Form.Item>

//           <Form.Item
//             label="Is Deal Finalised?"
//             name={FollowupFormFields.IS_DEAL_FINALISED}
//             rules={[{ required: true }]}
//           >
//             <Select>
//               <Select.Option value="Yes">Yes</Select.Option>
//               <Select.Option value="No">No</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label="Invoice No (if finalised)" name={FollowupFormFields.INVOICE_NO}>
//             <Input placeholder="Enter invoice no (if deal finalised)" />
//           </Form.Item>

//           <Form.Item
//             label="Customer Wants Time?"
//             name={FollowupFormFields.CUSTOMER_WANTS_TIME}
//             rules={[{ required: true }]}
//           >
//             <Select>
//               <Select.Option value="Yes">Yes</Select.Option>
//               <Select.Option value="No">No</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label="Next Followup Date" name={FollowupFormFields.NEXT_FOLLOWUP_DATE}>
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>

//           {/* <Form.Item label="Follow up By" name={FollowupFormFields.FOLLOWUP_BY}>
//             <Input disabled />
//           </Form.Item> */}

//            <Form.Item
//       label="User"
//       name="user_id"
//       rules={[{ required: true, message: "Select user" }]}
//     >
//       <Select
//         placeholder="Select User"
//         showSearch
//         optionFilterProp="label"
//         options={users.map((u) => ({
//           label: u.name,
//           value: u.id, // ✅ send ID instead of name
//         }))}
//       />
//     </Form.Item>

//           <div className="flex justify-end mt-4">
//             <Button onClick={() => setIsFollowupOpen(false)} style={{ marginRight: 8 }}>
//               Close
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </div>
//         </Form>
//       </Modal>



//     {/* Followup Modal */}
// {/* <Modal
//   title={`Follow-Up - ${currentFollowupRow?.quotation_no || ""}`}
//   open={isFollowupOpen}
//   onCancel={() => setIsFollowupOpen(false)}
//   footer={null}
//   destroyOnClose
// >
//   <Form layout="vertical" form={followupForm} onFinish={handleFollowupSave}>
//     <Form.Item
//       label="Follow-Up Date"
//       name="followup_date"
//       rules={[{ required: true, message: "Please select follow-up date" }]}
//     >
//       <DatePicker
//         className="w-full"
//         format="YYYY-MM-DD"
//         placeholder="Select follow-up date"
//       />
//     </Form.Item>

    
    

//     <Form.Item
//       label="Notes / Remarks"
//       name="notes"
//       rules={[{ required: true, message: "Please enter notes" }]}
//     >
//       <Input.TextArea rows={4} placeholder="Enter follow-up notes or remarks..." />
//     </Form.Item>

//     <div style={{ textAlign: "right" }}>
//       <Button onClick={() => setIsFollowupOpen(false)} style={{ marginRight: 8 }}>
//         Cancel
//       </Button>
//       <Button type="primary" htmlType="submit">
//         Save
//       </Button>
//     </div>
//   </Form>
// </Modal> */}




// {/* <Modal
//   title={`Add Follow-Up - ${currentFollowupRow?.quotation_no || ""}`}
//   open={isFollowupOpen}
//   onCancel={() => setIsFollowupOpen(false)}
//   footer={null}
// >
//   <Form layout="vertical" onFinish={handleFollowupSave}>
   
//     <Form.Item
//       label="User"
//       name="user_id"
//       rules={[{ required: true, message: "Select user" }]}
//     >
//       <Select
//         placeholder="Select User"
//         showSearch
//         optionFilterProp="label"
//         options={users.map((u) => ({
//           label: u.name,
//           value: u.id, // ✅ send ID instead of name
//         }))}
//       />
//     </Form.Item>

//     <Form.Item
//       label="Follow-Up Date"
//       name="followup_date"
//       rules={[{ required: true, message: "Please select follow-up date" }]}
//     >
//       <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
//     </Form.Item>

//     <Form.Item
//       label="Notes"
//       name="notes"
//       rules={[{ required: true, message: "Please enter notes" }]}
//     >
//       <Input.TextArea rows={4} placeholder="Enter follow-up notes" />
//     </Form.Item>

//     {/* <Form.Item>
//       <Button type="primary" htmlType="submit" loading={savingFollowup} block>
//         Save Follow-Up
//       </Button>
//     </Form.Item> 

//      <div style={{ textAlign: "right" }}>
//       <Button onClick={() => setIsFollowupOpen(false)} style={{ marginRight: 8 }}>
//         Cancel
//       </Button>
//       <Button type="primary" htmlType="submit">
//         Save
//       </Button>
//     </div>
//   </Form>
// </Modal> */}




//       {/* View Modal */}
//       <Modal
//         title={`Quotation Details ${viewRow?.quotation_no ?? ""}`}
//         open={isViewOpen}
//         onCancel={() => setIsViewOpen(false)}
//         footer={[
//           <Button key="close" onClick={() => setIsViewOpen(false)}>
//             Close
//           </Button>,
//         ]}
//         destroyOnClose
//       >
//         {viewRow ? (
//           <div>
//             <p><strong>Quotation No:</strong> {viewRow.quotation_no}</p>
//             <p><strong>Customer:</strong> {viewRow.customer_name}</p>
//             <p><strong>Quotation Date:</strong> {viewRow.quotation_date}</p>
//             <p><strong>Net Amount:</strong> {viewRow.net_amount}</p>
//             <p><strong>Approved By:</strong> {viewRow.approved_by}</p>
//             <p><strong>Approved Date:</strong> {viewRow.approved_date}</p>
//             <p><strong>Dispatched:</strong> {viewRow.is_dispatched ? "Yes" : "No"}</p>
//             <p><strong>Dispatched Date:</strong> {viewRow.dispatched_date}</p>
//             <p><strong>Dispatched Through:</strong> {viewRow.dispatched_through}</p>
//             <p><strong>Deal Status:</strong> {viewRow.deal_status}</p>
//             <p><strong>Follow Up Date:</strong> {viewRow.follow_up_date}</p>
//           </div>
//         ) : null}
//       </Modal>
//     </div>
//   );
// };

// export default QuotationTrackingStatus;






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

// ✅ Get base URL from .env (Vite)
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  quotation_date?: string; // ISO or formatted string
  net_amount?: number;
  approved_by?: string;
  approved_date?: string;
  is_dispatched?: boolean;
  dispatched_date?: string | null;
  dispatched_through?: string | null;
  deal_status?: string | null; // e.g. "Open" | "Closed"
  // follow_up_date?: string | null;
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

const QuotationTrackingStatus: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");


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
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(8);



//   const fetchQuotations = async () => {
//   setLoading(true);
//   try {
//    const res = await axios.get("http://localhost:5000/api/quotations");
//     //  const res = await API.get("/");
//     const data = (res.data || []).map((q: any) => ({
//       ...q,
//       id: q.quotation_id 
//     }));
//     console.log("🔹 Quotations fetched:", data);

//     setQuotations(data);
//   } catch (err) {
//     console.error(err);
//     message.error("Failed to fetch quotations");
//   } finally {
//     setLoading(false);
//   }
// };



const fetchQuotations = async () => {
  setLoading(true);
  try {
    // get plain quotations (primary source)
    const [quotRes, trackRes] = await Promise.all([
       axios.get(`${BASE_URL}/quotations`),
        axios.get(`${BASE_URL}/quotation-tracking`),
    ]);

    const quotations = (quotRes.data || []).map((q: any) => ({
      ...q,
      // ensure canonical id exists (use DB id)
      id: q.id ?? q.quotation_id ?? q.sno,
    }));

    const tracking = trackRes.data || []; // array of rows from quotation-tracking endpoint
    const quotationsMap = new Map(
  (quotRes.data || []).map((q: any) => [
    q.quotation_no,
    q.deal_handled_by_name,
  ])
);

    // merge tracking data into quotations (if found)
   const merged = tracking.map((t: any) => ({
  //   id: quotations?.id ?? null,
  // quotation_id: t.quotation_id ?? null,
  id: t.id,                      // ✅ REAL quotation id
  quotation_id: t.id,            // ✅ KEEP SAME everywhere
  quotation_no: t.quotation_no ?? "-",
  quotation_date: t.quotation_date ?? "-",
  is_dispatched: t.is_dispatched ?? "No",
  dispatched_date: t.dispatched_date ?? "-",
  dispatched_through: t.dispatched_through ?? "-",
  approved_by: t.approved_by ?? "-",
  approved_date: t.approved_date ?? "-",
  deal_status: t.deal_status ?? "Pending",
  followup_date: t.followup_date ?? t.follow_up_date ?? "-",
   deal_handled_by_name:
    quotationsMap.get(t.quotation_no) ?? "-",
  nextfollowup_date: t.nextfollowup_date ?? t.nextfollowup_date ?? "-",
  dispatched_by: t.dispatched_by ?? null,
  has_followup: t.has_followup ?? false,
  net_amount: t.net_amount??"0",
  customer_name: t.customer_name??"-",
  is_deal_finalised: t.is_deal_finalised ?? "No",
}));
    console.log("TRACKING DATA SAMPLE:", tracking[0]);
    console.log("🔹 Quotations fetched (merged):", merged);
    setQuotations(merged);
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

  // Open dispatch modal
  const openDispatchModal = (row: Quotation) => {
     console.log("🧩 Record clicked for Dispatch:", row);
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

  // Handle dispatch save
  // const handleDispatchSave = async (values: any) => {
  //   if (!currentDispatchRow) return;
  //   try {
  //     // Format date if DayJS/moment object provided
  //     const dispatchedDate =
  //       values[DispatchFormFields.DISPATCH_DATE] && values[DispatchFormFields.DISPATCH_DATE].format
  //         ? values[DispatchFormFields.DISPATCH_DATE].format("YYYY-MM-DD")
  //         : values[DispatchFormFields.DISPATCH_DATE];

  //     const payload = {
  //       quotation_id: currentDispatchRow.id,
  //       dispatched: true,
  //       dispatched_through: values[DispatchFormFields.DISPATCH_THROUGH],
  //       dispatched_date: dispatchedDate,
  //       dispatched_by: values[DispatchFormFields.DISPATCHED_BY],
  //     };
       
  //     console.log("🚀 Dispatch Payload:", payload);
  //     // POST to dispatch endpoint (change to your real endpoint)
  //     await API.post(`/dispatch`, payload);

  //     message.success("Dispatched successfully");
  //     setIsDispatchOpen(false);
  //     fetchQuotations();
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Error while dispatching");
  //   }
  // };


 // ✅ Handle Dispatch Save
// const handleDispatchSave = async (values: any) => {
//   if (!currentDispatchRow) return;

//   try {
//     // Format date safely
//     const dispatchedDate =
//       values[DispatchFormFields.DISPATCH_DATE] &&
//       values[DispatchFormFields.DISPATCH_DATE].format
//         ? values[DispatchFormFields.DISPATCH_DATE].format("YYYY-MM-DD HH:mm:ss")
//         : values[DispatchFormFields.DISPATCH_DATE];

//     // ✅ Prepare correct payload (matching backend fields)
//     const payload = {
//       quotation_id: currentDispatchRow.quotation_id,
//       sent_by: values[DispatchFormFields.DISPATCHED_BY], // user name or ID
//       method: values[DispatchFormFields.DISPATCH_THROUGH],
//       sent_at: dispatchedDate || new Date().toISOString().slice(0, 19).replace("T", " "),
//       sent_to_email: "customer@example.com", // optional (if backend requires)
//     };

//     console.log("🚀 Dispatch Payload (Final):", payload);

//     // ✅ Correct API endpoint (no double path)
//     const url = `/quotation-dispatches`;
//     console.log("📡 POST URL:", Api.defaults.baseURL + url);

//     // await API.post(url, payload);
//        await Api.post(url, payload);

//     message.success("Dispatched successfully ✅");
//     setIsDispatchOpen(false);
//     fetchQuotations();
    
//   } catch (err: any) {
//     console.error("❌ Axios Error:", err);
//     message.error("Error while dispatching");
//   }
// };





const handleDispatchSave = async (values: any) => {
  if (!currentDispatchRow) return;

  try {
    const dispatchedDate =
      values[DispatchFormFields.DISPATCH_DATE] && values[DispatchFormFields.DISPATCH_DATE].format
        ? values[DispatchFormFields.DISPATCH_DATE].format("YYYY-MM-DD HH:mm:ss")
        : values[DispatchFormFields.DISPATCH_DATE];

    const payload = {
      quotation_id: currentDispatchRow.id,           // <- use id (guaranteed by fetchQuotations)
      sent_by: Number(values[DispatchFormFields.DISPATCHED_BY]), // ensure numeric user id
      method: String(values[DispatchFormFields.DISPATCH_THROUGH]).toLowerCase(), // normalize
      sent_at: dispatchedDate || new Date().toISOString().slice(0, 19).replace("T", " "),
      sent_to_email: currentDispatchRow.customer_email ?? "customer@example.com",
    };

    console.log("📤 Dispatch Payload:", payload);

    await Api.post("/quotation-dispatches", payload);

    message.success("Dispatched successfully ✅");
    setIsDispatchOpen(false);
    fetchQuotations();
  } catch (err: any) {
    console.error("❌ Dispatch Error:", err);
    message.error("Error while dispatching");
  }
};




  // Open followup modal
  // const openFollowupModal = (row: Quotation) => {
  //   setCurrentFollowupRow(row);
  //   setIsFollowupOpen(true);
  //   followupForm.resetFields();

  //   // preset planned & actual followup dates if exist
  //   followupForm.setFieldsValue({
  //     [FollowupFormFields.PLANNED_FOLLOWUP_DATE]: row.follow_up_date || null,
  //     [FollowupFormFields.FOLLOWUP_BY]: loggedInUser,
  //     [FollowupFormFields.IS_DEAL_FINALISED]: "No",
  //     [FollowupFormFields.CUSTOMER_WANTS_TIME]: "No",
  //   });
  // };

  const openFollowupModal = (row: Quotation) => {
  setCurrentFollowupRow(row);
  setIsFollowupOpen(true);
  followupForm.resetFields();
};

  // Handle followup save
  // const handleFollowupSave = async (values: any) => {
  //   if (!currentFollowupRow) return;
  //   try {
  //     const nextFollowupDate =
  //       values[FollowupFormFields.NEXT_FOLLOWUP_DATE] && values[FollowupFormFields.NEXT_FOLLOWUP_DATE].format
  //         ? values[FollowupFormFields.NEXT_FOLLOWUP_DATE].format("YYYY-MM-DD")
  //         : values[FollowupFormFields.NEXT_FOLLOWUP_DATE];

  //     const payload = {
  //       quotation_id: currentFollowupRow.id,
  //       planned_followup_date: values[FollowupFormFields.PLANNED_FOLLOWUP_DATE] || currentFollowupRow.follow_up_date,
  //       actual_followup_date: values[FollowupFormFields.ACTUAL_FOLLOWUP_DATE] || null,
  //       is_deal_finalised: values[FollowupFormFields.IS_DEAL_FINALISED] === "Yes",
  //       invoice_no: values[FollowupFormFields.INVOICE_NO] || null,
  //       customer_wants_time: values[FollowupFormFields.CUSTOMER_WANTS_TIME] === "Yes",
  //       next_followup_date: nextFollowupDate || null,
  //       followup_by: values[FollowupFormFields.FOLLOWUP_BY] || loggedInUser,
  //     };

  //     // POST to followup endpoint (change to your real endpoint)
  //     await API.post(`/quotation_followups`, payload);

  //     message.success("Followup saved");
  //     setIsFollowupOpen(false);
  //     fetchQuotations();
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Error while saving followup");
  //   }
  // };



  // Handle Followup Save
// const handleFollowupSave = async (values: any) => {
//   if (!currentFollowupRow) return;

//   try {
//     const followupDate =
//       values.followup_date && values.followup_date.format
//         ? values.followup_date.format("YYYY-MM-DD")
//         : values.followup_date;

//     const payload = {
//       quotation_id: currentFollowupRow.quotation_id || currentFollowupRow.id,
//       // user_id: Number(localStorage.getItem("user_id") || 1), // 🔹 replace with real login user id if available
//       user_id: values.user_id,
//       notes: values.notes || "",
//       followup_date: followupDate,
//     };

//     console.log("📤 Sending Follow-Up Payload:", payload);

//     await Api.post("/quotation_followups", payload);

//     message.success("Follow-up saved successfully ✅");
//     setIsFollowupOpen(false);
//     fetchQuotations(); // refresh table
//   } catch (err: any) {
//     console.error("❌ Follow-Up Save Error:", err);
//     message.error("Error saving follow-up");
//   }
// };



const handleFollowupSave = async (values: any) => {
  if (!currentFollowupRow) return;

  try {
    // ✅ Convert next followup date to proper format
    const nextFollowupDate =
      values.next_followup_date && values.next_followup_date.format
        ? values.next_followup_date.format("YYYY-MM-DD HH:mm:ss")
        : values.next_followup_date || null;

     const followupDate =
      values.followup_date && values.followup_date.format
        ? values.followup_date.format("YYYY-MM-DD")
        : values.followup_date;

    // ✅ Convert planned followup date (disabled → row se)
    // const plannedFollowupDate = currentFollowupRow.follow_up_date
    //   ? currentFollowupRow.follow_up_date
    //   : null;

    // ✅ Auto actual followup (backend ko dede)
    const actualFollowupDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    // ✅ Prepare Final Payload
    const payload = {
      // quotation_id: currentFollowupRow.quotation_id || currentFollowupRow.id,
     quotation_id: currentFollowupRow.quotation_id, 


      user_id: values.user_id,

      notes: values.notes || "",

      // followup_date: currentFollowupRow.follow_up_date,
      // followup_date: currentFollowupRow.followup_date,
       followup_date: actualFollowupDate, 
      invoice_no: values.invoice_no || null,
      is_deal_finalised: values.is_deal_finalised,
      time_needed: values.customer_wants_time,  // ✅ matches DB column
      next_followup_date: nextFollowupDate,
      followup_by: values.user_id,

      actual_followup_date: actualFollowupDate, // 🔹 if backend supports it
    };
    console.log("ROW:", currentFollowupRow);

    console.log("📤 Sending Follow-Up Payload:", payload);

    await Api.post("/quotation_followups", payload);

    message.success("Follow-up saved successfully ✅");
    setIsFollowupOpen(false);
    fetchQuotations();

  } catch (err: any) {
    console.error("❌ Follow-Up Save Error:", err);
    message.error("Error saving follow-up");
  }
};


  // Optional View details (simple view modal)
  // const [isViewOpen, setIsViewOpen] = useState(false);
  // const [viewRow, setViewRow] = useState<Quotation | null>(null);

  const openViewModal = (row: Quotation) => {
    setViewRow(row);
    setIsViewOpen(true);
  };

 

 

  // Table columns
  const columns: ColumnsType<Quotation> = [
    {
  title: "S.No",
  key: "sno",
  width: 60,
  render: (_text, _record, index) =>
    (currentPage - 1) * pageSize + index + 1,
},

    { title: "Quotation No.", dataIndex: "quotation_no", key: "quotation_no" },
    { title: "Customer Name", dataIndex: "customer_name", key: "customer_name" },
    {
  title: "Deal Handled By",
  dataIndex: "deal_handled_by_name",
  render: (val: any) => val || "-"
},
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
    // { title: "Deal Status", dataIndex: "deal_status", key: "deal_status" },
    {
  title: "Deal Finalised",
  dataIndex: "is_deal_finalised",
  key: "is_deal_finalised",
  render: (v: any) => (v === "Yes" ? " Yes" : " No"),   // ✅ 
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
             return new Date(`${year}-${month}-${day}`).getTime();
           }
           return new Date(d).getTime();
         };
         return parseDate(a.nextfollowup_date) - parseDate(b.nextfollowup_date);
       },
       onCell: (record: Quotation) => {
         // compute nextDate same as you did before
         let style: React.CSSProperties = {};
         const nf = record.nextfollowup_date;
         const parse = (d?: string | null) => {
           if (!d || d === "-" || typeof d !== "string") return null;
           const parts = d.split("-");
           if (parts.length === 3) {
             const [day, month, year] = parts;
             return new Date(`${year}-${month}-${day}`);
           }
           const dt = new Date(d);
           return isNaN(dt.getTime()) ? null : dt;
         };
         const nextDate = parse(nf);
         const today = new Date(); today.setHours(0,0,0,0);
     
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
//     {
//       title: "Action",
//       key: "actions",
//       fixed: "right",
//       width: 150,
//       render: (_text, record) => (
//         <Space>
//              <Tooltip title="view">
//           <Button
//             type="default"
//             icon={<EyeOutlined />}
//             onClick={() => openViewModal(record)}
//             style={{ borderRadius: 4 }}
//           >
            
//           </Button>
//           </Tooltip>

//           {/* Send (Dispatch) - always visible when not dispatched */}
//            {/* ✅ Dispatch button visible only if approved_by is set */}
//       {record.approved_by && record.approved_by !== "-" ? (
//         <Tooltip title="Send / Dispatch">
//           <Button
//             type="primary"
//             icon={<SendOutlined />}
//             onClick={() => openDispatchModal(record)}
//             style={{ borderRadius: 4 }}
//           />
//         </Tooltip>
//       ) : (
//         <Tooltip title="Approve quotation before dispatch">
//           <Button
//             type="primary"
//             icon={<SendOutlined />}
//             disabled
//             style={{ borderRadius: 4, opacity: 0.5 }}
//           />
//         </Tooltip>
//       )}

//           {/* Followup - enable if dispatched = true, otherwise disabled */}
//           {/* <Tooltip title="Follow-up">
//                <Button
//                 type="default"
//                 icon={<ClockCircleOutlined />}
//                 onClick={() => openFollowupModal(record)}
//                  disabled={!record.is_dispatched}
//                   style={{ borderRadius: 4 }}
//                  />
//            </Tooltip> */}


//           <Tooltip
//   title={
//     !record.approved_by || record.approved_by === "-"
//       ? "Approve the quotation first"
//       : !record.is_dispatched
//       ? "Dispatch before follow-up"
//       : record.has_followup
//       ? "Follow-up already done"
//       : "Add Follow-up"
//   }
// >
//   <Button
//     type="default"
//     icon={<ClockCircleOutlined />}
//     onClick={() => openFollowupModal(record)}
//    disabled={
//   !record.followup_date || 
//   record.followup_date === "-" ||
//   record.followup_date.trim() === ""
// }
//     style={{
//       borderRadius: 4,
//       opacity:
//         !record.approved_by || record.approved_by === "-" || !record.is_dispatched
//           ? 0.5
//           : 1,
//     }}
//   />
// </Tooltip>
  
//         </Space>
//       ),
//     },
  ];


  const filteredData = quotations.filter((q) =>
  q.quotation_no?.toLowerCase().includes(searchText.toLowerCase()) ||
  q.customer_name?.toLowerCase().includes(searchText.toLowerCase()) ||
  q.deal_status?.toLowerCase().includes(searchText.toLowerCase())
);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-semibold">Quotation Status Tracking</h2>

  <div className="flex gap-3">
    <Input
      placeholder="Search quotation..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      style={{ width: 400 }}
      allowClear
    />

    {/* <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => fetchQuotations()}
    >
      Refresh
    </Button> */}
  </div>
</div>
      
      

      {/* <Table
        columns={columns}
        // dataSource={quotations}
        dataSource={filteredData}
        rowKey={(r) => r.id ?? r.quotation_id ?? 0}
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1200 }}
      /> */}


     <Table
  columns={columns}
  dataSource={filteredData}
  rowKey={(r) => r.id ?? r.quotation_id ?? 0}
  loading={loading}
  bordered
  pagination={{
  current: currentPage,
  pageSize: pageSize,
  onChange: (page, size) => {
    setCurrentPage(page);
    setPageSize(size || 8);
  },
}}
  scroll={{ x: 1200 }}
  onRow={(record) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Parse nextfollowup_date safely (support dd-mm-yyyy and yyyy-mm-dd)
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

    // 🟢 Deal Finalised
    if (record.is_deal_finalised === "Yes") {
      style = {
        backgroundColor: "#ccffcc", // light green
        color: "#000",
        fontWeight: 500,
        transition: "background-color 0.3s ease",
      };
    }

    // 🔴 Not Finalised and next followup due or past
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
          {/* <Form.Item
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
          </Form.Item> */}


          <Form.Item
  label="Dispatched By"
  name={DispatchFormFields.DISPATCHED_BY}
  rules={[{ required: true, message: "Select dispatched by user" }]}
>
  <Select
    placeholder="Select User"
    showSearch
    optionFilterProp="label"
    options={users.map((u) => ({
      label: u.name,
      value: u.id, // ✅ send ID instead of name
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

          {/* <Form.Item label="Follow up By" name={FollowupFormFields.FOLLOWUP_BY}>
            <Input disabled />
          </Form.Item> */}

           <Form.Item
      label="User"
      name="user_id"
      rules={[{ required: true, message: "Select user" }]}
    >
      <Select
        placeholder="Select User"
        showSearch
        optionFilterProp="label"
        options={users.map((u) => ({
          label: u.name,
          value: u.id, // ✅ send ID instead of name
        }))}
      />
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



    {/* Followup Modal */}
{/* <Modal
  title={`Follow-Up - ${currentFollowupRow?.quotation_no || ""}`}
  open={isFollowupOpen}
  onCancel={() => setIsFollowupOpen(false)}
  footer={null}
  destroyOnClose
>
  <Form layout="vertical" form={followupForm} onFinish={handleFollowupSave}>
    <Form.Item
      label="Follow-Up Date"
      name="followup_date"
      rules={[{ required: true, message: "Please select follow-up date" }]}
    >
      <DatePicker
        className="w-full"
        format="YYYY-MM-DD"
        placeholder="Select follow-up date"
      />
    </Form.Item>

    
    

    <Form.Item
      label="Notes / Remarks"
      name="notes"
      rules={[{ required: true, message: "Please enter notes" }]}
    >
      <Input.TextArea rows={4} placeholder="Enter follow-up notes or remarks..." />
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
</Modal> */}




{/* <Modal
  title={`Add Follow-Up - ${currentFollowupRow?.quotation_no || ""}`}
  open={isFollowupOpen}
  onCancel={() => setIsFollowupOpen(false)}
  footer={null}
>
  <Form layout="vertical" onFinish={handleFollowupSave}>
   
    <Form.Item
      label="User"
      name="user_id"
      rules={[{ required: true, message: "Select user" }]}
    >
      <Select
        placeholder="Select User"
        showSearch
        optionFilterProp="label"
        options={users.map((u) => ({
          label: u.name,
          value: u.id, // ✅ send ID instead of name
        }))}
      />
    </Form.Item>

    <Form.Item
      label="Follow-Up Date"
      name="followup_date"
      rules={[{ required: true, message: "Please select follow-up date" }]}
    >
      <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
    </Form.Item>

    <Form.Item
      label="Notes"
      name="notes"
      rules={[{ required: true, message: "Please enter notes" }]}
    >
      <Input.TextArea rows={4} placeholder="Enter follow-up notes" />
    </Form.Item>

    {/* <Form.Item>
      <Button type="primary" htmlType="submit" loading={savingFollowup} block>
        Save Follow-Up
      </Button>
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
</Modal> */}




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

export default QuotationTrackingStatus;



